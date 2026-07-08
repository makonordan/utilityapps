import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Admin-only restore. Flips `reported = false` so the share becomes
 * reachable again. The cookie check in proxy.ts gates access.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");

  const existing = await shares.findBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }
  const ok = await shares.unreportShare(slug);
  if (!ok) {
    return NextResponse.json(
      { error: "Couldn't restore the share." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
