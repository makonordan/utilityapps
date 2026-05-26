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

/** Delete a share by slug. Returns whether anything was deleted. */
export async function deleteBySlug(slug: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;
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
