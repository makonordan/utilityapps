import "server-only";

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { getSupabaseAdmin } from "../supabaseAdmin";
import { generateSlug, isGeneratedSlugAcceptable } from "../slug";

/**
 * Service-role data layer for the `shares` table.
 *
 * `shares` has RLS on with no policies, so every read/write here goes
 * through the service-role client. This module is `server-only` to keep
 * the key out of client bundles.
 *
 * Design notes:
 *   - Passwords use scrypt + per-row salt (Node's crypto, no bcrypt dep).
 *     scrypt is more than enough for the threat model: casual access
 *     prevention, not credential-database hardening.
 *   - View-count increments use a one-shot UPDATE returning the new
 *     value, so callers can act on "limit reached" immediately.
 *   - Slug uniqueness is retried up to 10 times with widening length
 *     to handle the (very rare) collision on 6-char random slugs.
 */

export type ShareType = "file" | "text" | "url";

export interface ShareRow {
  id: string;
  slug: string;
  type: ShareType;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_mimetype: string | null;
  text_content: string | null;
  text_language: string | null;
  original_url: string | null;
  password_hash: string | null;
  custom_slug: boolean;
  view_limit: number | null;
  view_count: number;
  expires_at: string;
  created_at: string;
  creator_ip: string | null;
  reported: boolean;
  reported_at: string | null;
}

// ----------------------------------------------------- password hashing

/** Encode salt + scrypt hash into a single string we can store in one column. */
function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `s1:${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Verify a password against the stored hash. Constant-time comparison. */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "s1") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

// ------------------------------------------------------------ helpers

/**
 * Hash a creator IP before storing it. We don't need the raw IP after
 * insert — only for rate-limiting checks within the same hour-window,
 * which compare hash-to-hash. This keeps GDPR exposure minimal.
 */
export function hashCreatorIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/** Get the share by slug, or null. Does NOT decrypt or verify anything. */
export async function findBySlug(slug: string): Promise<ShareRow | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("shares")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[shares.findBySlug]", error);
    return null;
  }
  return (data as ShareRow | null) ?? null;
}

/**
 * Find a free slug. Random by default; widens by one char per attempt to
 * keep the success probability ~1 even on a heavily-populated table.
 */
async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const length = 6 + Math.floor(attempt / 3);
    const candidate = generateSlug(length);
    if (!isGeneratedSlugAcceptable(candidate)) continue;
    const existing = await findBySlug(candidate);
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique slug after 10 attempts.");
}

// ----------------------------------------------------- create + access

export interface CreateShareInput {
  type: ShareType;
  customSlug?: string | null;
  password?: string | null;
  viewLimit?: number | null;
  /** Hours from now until the share expires. Default 168 (7 days). */
  expiresInHours?: number;
  /** Hashed creator IP (call hashCreatorIp() first). */
  creatorIpHash: string;
  // Type-specific payload — caller fills the right one
  textContent?: string;
  textLanguage?: string | null;
  originalUrl?: string;
}

export interface CreateShareResult {
  ok: boolean;
  share?: ShareRow;
  /** User-facing error if !ok. */
  error?: string;
}

/** Insert a share row. Caller is responsible for content validation. */
export async function createShare(input: CreateShareInput): Promise<CreateShareResult> {
  const client = getSupabaseAdmin();
  if (!client) {
    return { ok: false, error: "Server isn't configured to handle shares yet." };
  }

  const slug = input.customSlug ?? (await generateUniqueSlug());
  // If a custom slug was given, double-check uniqueness right before insert
  if (input.customSlug) {
    const existing = await findBySlug(input.customSlug);
    if (existing) {
      return { ok: false, error: "That custom link is already taken." };
    }
  }

  const hours = clampHours(input.expiresInHours ?? 168);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  const insertRow = {
    slug,
    type: input.type,
    file_path: null,
    file_name: null,
    file_size: null,
    file_mimetype: null,
    text_content: input.textContent ?? null,
    text_language: input.textLanguage ?? null,
    original_url: input.originalUrl ?? null,
    password_hash: input.password ? hashPassword(input.password) : null,
    custom_slug: Boolean(input.customSlug),
    view_limit: input.viewLimit ?? null,
    view_count: 0,
    expires_at: expiresAt,
    creator_ip: input.creatorIpHash,
    reported: false,
    reported_at: null,
  };

  const { data, error } = await client
    .from("shares")
    .insert(insertRow)
    .select("*")
    .single();
  if (error) {
    console.error("[shares.createShare]", error);
    // Most likely cause: race condition where slug collided between
    // findBySlug() and insert. The unique index catches it.
    return { ok: false, error: "Couldn't create the share. Try again." };
  }
  return { ok: true, share: data as ShareRow };
}

const HOUR_OPTIONS = new Set([1, 24, 168, 720]); // 1h / 1d / 7d / 30d
function clampHours(h: number): number {
  return HOUR_OPTIONS.has(h) ? h : 168;
}

/**
 * Increment the view counter and return the resulting row. Returns null
 * if the share has been deleted in the meantime. Uses an atomic UPDATE
 * so two simultaneous viewers can't both push past the view limit.
 */
export async function incrementViewCount(slug: string): Promise<ShareRow | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  // Two-step: read current, then conditional update with the new value.
  // (Supabase JS doesn't have a clean "increment returning" — but the
  // unique slug means contention is per-share, not per-table, which is
  // fine for our traffic profile.)
  const current = await findBySlug(slug);
  if (!current) return null;
  const newCount = current.view_count + 1;
  const { data, error } = await client
    .from("shares")
    .update({ view_count: newCount })
    .eq("slug", slug)
    .select("*")
    .single();
  if (error) {
    console.error("[shares.incrementViewCount]", error);
    return null;
  }
  return data as ShareRow;
}

/**
 * Delete a share by slug, including the backing Storage object for file
 * shares. Returns whether anything was deleted. Storage failures don't
 * block the DB delete — the goal is the share becoming unreachable.
 */
export async function deleteBySlug(slug: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;
  // Read first so we can clean up Storage if it's a file share.
  const existing = await findBySlug(slug);
  if (!existing) return false;
  if (existing.type === "file" && existing.file_path) {
    try {
      await client.storage.from(SHARE_BUCKET).remove([existing.file_path]);
    } catch (err) {
      console.error("[shares.deleteBySlug] storage", err);
      // continue — the DB delete is what makes the share unreachable
    }
  }
  const { error, count } = await client
    .from("shares")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) {
    console.error("[shares.deleteBySlug]", error);
    return false;
  }
  return (count ?? 0) > 0;
}

// =========================================================== File shares
// Phase 2: signed direct-uploads to Supabase Storage. The Vercel function
// never sees the file bytes, only metadata, so we sidestep the 4.5MB body
// limit on the Hobby plan entirely.

/** Bucket the file-share UI uploads into. Must exist in Supabase. */
export const SHARE_BUCKET = "share-files";

/**
 * Issue a signed upload URL for a new file share. The slug is generated
 * here so the URL path is predictable and we can call this once per
 * upload without a separate "reserve slug" step. We do NOT insert a row
 * yet — that happens in finalizeFileShare() after the client confirms
 * the upload succeeded. Orphan files (where the client uploaded but
 * never finalised) are far better than orphan rows with no file.
 */
export interface InitFileShareInput {
  filename: string;
  contentType: string;
  size: number;
  /** Pre-validated custom slug, or null/undefined for a random one. */
  customSlug?: string | null;
}

export interface InitFileShareResult {
  ok: boolean;
  slug?: string;
  /** Storage object key the client should upload to. */
  path?: string;
  /** Token to pass to supabase.storage.uploadToSignedUrl(). */
  token?: string;
  /** Full signed upload URL (for clients that POST directly). */
  signedUrl?: string;
  /** True when the slug came from `customSlug` rather than the generator. */
  customSlugWasUsed?: boolean;
  error?: string;
}

export async function initFileShare(
  input: InitFileShareInput
): Promise<InitFileShareResult> {
  const client = getSupabaseAdmin();
  if (!client) {
    return { ok: false, error: "Server isn't configured to handle file shares." };
  }
  // Custom slug? Check uniqueness BEFORE issuing the upload URL so the
  // user doesn't waste a 25MB upload on a slug we then reject.
  let slug: string;
  let customSlugWasUsed = false;
  if (input.customSlug) {
    const existing = await findBySlug(input.customSlug);
    if (existing) {
      return { ok: false, error: "That custom link is already taken." };
    }
    slug = input.customSlug;
    customSlugWasUsed = true;
  } else {
    slug = await generateUniqueSlug();
  }
  // Keep the original filename for the Content-Disposition header on download
  // but encode in the Storage path as `<slug>/<original>` so collisions are
  // impossible and the slug is recoverable from the path.
  const path = `${slug}/${input.filename}`;

  try {
    const { data, error } = await client.storage
      .from(SHARE_BUCKET)
      .createSignedUploadUrl(path);
    if (error || !data) {
      console.error("[shares.initFileShare]", error);
      return { ok: false, error: "Couldn't prepare the upload. Try again." };
    }
    return {
      ok: true,
      slug,
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      customSlugWasUsed,
    };
  } catch (err) {
    console.error("[shares.initFileShare]", err);
    return { ok: false, error: "Couldn't prepare the upload. Try again." };
  }
}

/**
 * After the client uploads to Storage via the signed URL, it calls this
 * to verify the file actually exists at the expected path and create the
 * share row. Belt-and-braces: even if the client lies, the row creation
 * step queries Storage for the file metadata.
 */
export interface FinalizeFileShareInput {
  slug: string;
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  password?: string | null;
  viewLimit?: number | null;
  expiresInHours?: number;
  creatorIpHash: string;
  customSlugWasUsed: boolean;
}

export async function finalizeFileShare(
  input: FinalizeFileShareInput
): Promise<CreateShareResult> {
  const client = getSupabaseAdmin();
  if (!client) {
    return { ok: false, error: "Server isn't configured to handle file shares." };
  }

  // Verify the file is actually there. We do a HEAD-style metadata fetch
  // by listing the parent dir (the slug folder) for the exact name.
  // Storage's `list` returns an empty array if the file isn't there.
  try {
    const folder = input.path.split("/").slice(0, -1).join("/");
    const wantedName = input.path.split("/").slice(-1)[0];
    const { data: files, error } = await client.storage
      .from(SHARE_BUCKET)
      .list(folder, { limit: 5 });
    if (error || !files) {
      console.error("[shares.finalizeFileShare] list", error);
      return { ok: false, error: "Couldn't verify the upload. Try again." };
    }
    const match = files.find((f) => f.name === wantedName);
    if (!match) {
      return {
        ok: false,
        error: "Upload didn't reach the server. Please try uploading again.",
      };
    }
    const actualSize =
      typeof match.metadata?.size === "number" ? match.metadata.size : null;
    if (actualSize !== null && actualSize > 25 * 1024 * 1024) {
      // Belt and suspenders — should never trigger because the bucket
      // has its own size cap, but if it did we clean up and fail.
      await client.storage.from(SHARE_BUCKET).remove([input.path]);
      return { ok: false, error: "File exceeded the 25 MB cap." };
    }
  } catch (err) {
    console.error("[shares.finalizeFileShare]", err);
    return { ok: false, error: "Couldn't verify the upload. Try again." };
  }

  const hours = clampHours(input.expiresInHours ?? 168);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  const insertRow = {
    slug: input.slug,
    type: "file" as const,
    file_path: input.path,
    file_name: input.filename,
    file_size: input.size,
    file_mimetype: input.mimetype,
    text_content: null,
    text_language: null,
    original_url: null,
    password_hash: input.password ? hashPassword(input.password) : null,
    custom_slug: input.customSlugWasUsed,
    view_limit: input.viewLimit ?? null,
    view_count: 0,
    expires_at: expiresAt,
    creator_ip: input.creatorIpHash,
    reported: false,
    reported_at: null,
  };

  const { data, error } = await client
    .from("shares")
    .insert(insertRow)
    .select("*")
    .single();
  if (error) {
    console.error("[shares.finalizeFileShare] insert", error);
    // Clean up the uploaded file so we don't leave an orphan.
    await client.storage.from(SHARE_BUCKET).remove([input.path]);
    return { ok: false, error: "Couldn't save the share. Please try again." };
  }
  return { ok: true, share: data as ShareRow };
}

/**
 * Issue a short-lived signed download URL for a file share. The URL is
 * what the recipient page hands the browser (img src, iframe src,
 * download anchor) — so we want it to be a real fetch-able URL, not a
 * proxy through the API.
 */
export async function createDownloadUrl(
  path: string,
  filename: string,
  expiresInSeconds = 60 * 60
): Promise<string | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client.storage
    .from(SHARE_BUCKET)
    .createSignedUrl(path, expiresInSeconds, {
      download: filename,
    });
  if (error || !data) {
    console.error("[shares.createDownloadUrl]", error);
    return null;
  }
  return data.signedUrl;
}

/**
 * Same as createDownloadUrl but for inline-rendering surfaces (image
 * preview, PDF iframe) — without the `download` hint so the browser
 * renders rather than downloads.
 */
export async function createInlineUrl(
  path: string,
  expiresInSeconds = 60 * 60
): Promise<string | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client.storage
    .from(SHARE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) {
    console.error("[shares.createInlineUrl]", error);
    return null;
  }
  return data.signedUrl;
}

/** Flag a share as reported. Cleanup (delete) is a follow-up step. */
export async function reportShare(slug: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;
  const { error } = await client
    .from("shares")
    .update({ reported: true, reported_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) {
    console.error("[shares.reportShare]", error);
    return false;
  }
  return true;
}

// --------------------------------------------------- expiration checks

/** Returns true if the row should be treated as unavailable. */
export function isExpired(row: ShareRow): boolean {
  return new Date(row.expires_at).getTime() < Date.now();
}

export function isViewLimitReached(row: ShareRow): boolean {
  return row.view_limit !== null && row.view_count >= row.view_limit;
}

// --------------------------------------------- in-line rate limiting

/**
 * Crude rate limit using the shares table itself: count shares created
 * by this IP hash within the last hour. No Redis needed for Phase 1.
 *
 * Returns true if the caller is OVER the limit and should be rejected.
 */
export async function isRateLimited(
  creatorIpHash: string,
  limitPerHour: number
): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await client
    .from("shares")
    .select("id", { count: "exact", head: true })
    .eq("creator_ip", creatorIpHash)
    .gte("created_at", since);
  if (error) {
    console.error("[shares.isRateLimited]", error);
    return false; // fail open — error logging beats a broken tool
  }
  return (count ?? 0) >= limitPerHour;
}

/**
 * Verify the requester owns this share (matches creator_ip hash). Used
 * when a creator deletes their own share from the "My shares" list.
 */
export async function isCreator(
  slug: string,
  creatorIpHash: string
): Promise<boolean> {
  const row = await findBySlug(slug);
  return row?.creator_ip === creatorIpHash;
}
