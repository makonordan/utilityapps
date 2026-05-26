import { NextRequest, NextResponse } from "next/server";

import { getClientIp } from "../_utils";

export const runtime = "nodejs";

/**
 * GET /api/share/[slug] — share metadata only.
 *
 * Returns the bare minimum the recipient page needs to render the right
 * state: type, whether a password is needed, whether it expired, whether
 * the view limit was reached. Does NOT return the actual content (text /
 * original URL) — that comes from POST /access after password check.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");
  const row = await shares.findBySlug(slug);

  // Don't leak whether the slug was ever valid — same response either way.
  if (!row) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }
  if (shares.isExpired(row)) {
    return NextResponse.json(
      { exists: false, reason: "expired" },
      { status: 404 }
    );
  }
  if (shares.isViewLimitReached(row)) {
    return NextResponse.json(
      { exists: false, reason: "view-limit" },
      { status: 404 }
    );
  }
  if (row.reported) {
    return NextResponse.json(
      { exists: false, reason: "removed" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    exists: true,
    type: row.type,
    hasPassword: !!row.password_hash,
    expiresAt: row.expires_at,
    viewCount: row.view_count,
    viewLimit: row.view_limit,
    textLanguage: row.text_language,
  });
}

/**
 * DELETE /api/share/[slug] — creator removes their own share.
 *
 * Verified by matching the requester's IP hash against the row's stored
 * creator_ip hash. The "My shares" list in the frontend uses this when
 * the user clicks the trash icon next to a share they created.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");
  const ip = getClientIp(request);
  const ipHash = shares.hashCreatorIp(ip);

  if (!(await shares.isCreator(slug, ipHash))) {
    return NextResponse.json(
      { error: "You can only delete shares you created from this device + network." },
      { status: 403 }
    );
  }
  const deleted = await shares.deleteBySlug(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
