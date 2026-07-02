import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/businessCard/auth";

export const runtime = "nodejs";

/**
 * Supabase Auth OAuth callback. The client-initiated
 * `supabase.auth.signInWithOAuth({ redirectTo })` sends the user
 * to Google → back to `/auth/callback?code=<pkce>&next=<url>`. We
 * exchange the code for a session and 302 to `next` (or `/tools/
 * business-card/create` if unset).
 *
 * If exchange fails, we redirect to a friendly error page rather
 * than surface the raw Supabase error.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tools/business-card/create";

  if (!code) {
    return NextResponse.redirect(new URL(`/tools/business-card?auth_error=missing_code`, request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.warn("[bc/auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(new URL(`/tools/business-card?auth_error=exchange_failed`, request.url));
  }

  // Never redirect to an off-site URL supplied via `next`.
  const safeNext = next.startsWith("/") ? next : "/tools/business-card/create";
  return NextResponse.redirect(new URL(safeNext, request.url));
}
