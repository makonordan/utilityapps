import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Admin-only hard delete. The cookie check in proxy.ts gates access —
 * if we reach this handler, the request is authenticated. Removes both
 * the DB row and (for file shares) the Storage object via
 * `shares.deleteBySlug`, which already handles both.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");

  const existing = await shares.findBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }
  const ok = await shares.deleteBySlug(slug);
  if (!ok) {
    return NextResponse.json(
      { error: "Couldn't delete the share." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
