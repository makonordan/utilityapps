import { NextResponse } from "next/server";

import { getBcUser } from "@/lib/businessCard/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the caller's bc_users identity (id, username, plan) or null.
 * Used by client components on ISR-cached public pages to decide whether
 * to render owner-only affordances (Edit button, analytics link).
 * We deliberately don't expose email or auth_id.
 */
export async function GET() {
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: true, user: null });
  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, plan: user.plan },
  });
}
