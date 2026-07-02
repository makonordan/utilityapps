import { NextRequest, NextResponse } from "next/server";

import { provisionBcUser } from "@/lib/businessCard/auth";
import { RESERVED_USERNAMES, isValidUsername } from "@/lib/businessCard/types";

export const runtime = "nodejs";

/**
 * Claim a username for the current authenticated session by inserting
 * the bc_users row. Idempotent — a race where two requests hit at once
 * results in one 201 and one 200-with-existing.
 */
export async function POST(request: NextRequest) {
  let body: { username?: string };
  try {
    body = (await request.json()) as { username?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  if (!username) {
    return NextResponse.json({ ok: false, error: "username required", reason: "invalid" }, { status: 400 });
  }
  if (!isValidUsername(username)) {
    return NextResponse.json({ ok: false, error: "invalid username", reason: "invalid" }, { status: 400 });
  }
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json({ ok: false, error: "reserved username", reason: "invalid" }, { status: 400 });
  }

  const result = await provisionBcUser(username);
  if (!result.ok) {
    const status = result.reason === "not-authenticated" ? 401 : result.reason === "username-taken" ? 409 : 500;
    return NextResponse.json({ ok: false, error: result.detail ?? result.reason, reason: result.reason }, { status });
  }
  return NextResponse.json({ ok: true, user: result.user });
}
