import { NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_EXPIRY_HOURS,
  getClientIp,
  isAllowedExpiry,
} from "../../_utils";

export const runtime = "nodejs";

interface Body {
  slug?: unknown;
  path?: unknown;
  filename?: unknown;
  mimetype?: unknown;
  size?: unknown;
  customSlugWasUsed?: unknown;
  expiresIn?: unknown;
  password?: unknown;
  viewLimit?: unknown;
}

/**
 * POST /api/share/file/finalize
 *
 * Second half of the two-phase upload. The client has finished pushing
 * the file to Supabase Storage via the signed URL from /init; this
 * endpoint verifies it actually landed at the expected path, then
 * inserts the shares row. The init endpoint never wrote to the DB —
 * orphan Storage files (uploaded but never finalised) are cheaper than
 * orphan DB rows pointing at nothing.
 */
export async function POST(request: NextRequest) {
  const shares = await import("@/lib/db/shares");
  const { validateFileMetadata } = await import("@/lib/file-validation");

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const path = typeof body.path === "string" ? body.path : "";
  const filename = typeof body.filename === "string" ? body.filename : "";
  const mimetype =
    typeof body.mimetype === "string" ? body.mimetype : "application/octet-stream";
  const size = Number(body.size);
  const customSlugWasUsed = Boolean(body.customSlugWasUsed);

  if (!slug || !path || !filename || !Number.isFinite(size)) {
    return NextResponse.json(
      { error: "Missing init data — refresh the page and try again." },
      { status: 400 }
    );
  }

  // Re-run validation in case the client tampered between init and finalize.
  const meta = validateFileMetadata(filename, size, mimetype);
  if (!meta.ok) {
    return NextResponse.json({ error: meta.error }, { status: 400 });
  }

  const expiresInRaw = Number(body.expiresIn ?? 168);
  const expiresIn = isAllowedExpiry(expiresInRaw) ? expiresInRaw : 168;

  const password =
    typeof body.password === "string" && body.password.length > 0
      ? body.password
      : null;

  let viewLimit: number | null = null;
  if (body.viewLimit != null && body.viewLimit !== "") {
    const n = Math.floor(Number(body.viewLimit));
    if (!Number.isFinite(n) || n < 1 || n > 1000) {
      return NextResponse.json(
        { error: "View limit must be a whole number between 1 and 1000." },
        { status: 400 }
      );
    }
    viewLimit = n;
  }

  const ip = getClientIp(request);
  const ipHash = shares.hashCreatorIp(ip);

  const result = await shares.finalizeFileShare({
    slug,
    path,
    filename,
    mimetype,
    size,
    password,
    viewLimit,
    expiresInHours: expiresIn,
    creatorIpHash: ipHash,
    customSlugWasUsed,
  });

  if (!result.ok || !result.share) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    slug: result.share.slug,
    expiresAt: result.share.expires_at,
    allowedExpiryHours: ALLOWED_EXPIRY_HOURS,
  });
}
