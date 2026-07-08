import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/poll/[publicId]/manage
 *
 * Body: { creatorToken: string, action: "close" | "reopen" | "delete" }
 *
 * The creator_token is the ONLY authentication used for these three
 * operations — it's stored in the creator's browser localStorage after
 * poll creation and never surfaces on any GET response. RLS on the
 * polls table blocks anon UPDATE / DELETE outright (see schema.sql
 * section 18), so this service-role route is the only path through.
 *
 * Constant-time compare on the token via node:crypto timingSafeEqual —
 * lengths differ → early false; equal lengths → xor-and-or reduce so
 * that mismatches take the same wall-clock as matches. Overkill for a
 * 64-hex opaque secret that never crosses the wire in a lookup path,
 * but it costs nothing and eliminates the class of concern.
 *
 * Responses:
 *   200: { ok: true, action, isClosed?: boolean }
 *   400: { ok: false, error }                 — bad body
 *   403: { ok: false, error }                 — token mismatch
 *   404: { ok: false, error }                 — poll not found
 *   500: { ok: false, error }                 — storage failure
 */

const PUBLIC_ID_REGEX = /^[A-HJ-KM-NP-Za-hj-km-np-z2-9]{8}$/;

type Params = { params: Promise<{ publicId: string }> };
type ManageAction = "close" | "reopen" | "delete";
const VALID_ACTIONS: readonly ManageAction[] = ["close", "reopen", "delete"];

export async function POST(request: NextRequest, { params }: Params) {
  const { publicId } = await params;
  if (!PUBLIC_ID_REGEX.test(publicId)) {
    return NextResponse.json(
      { ok: false, error: "Poll not found." },
      { status: 404 }
    );
  }

  let body: { creatorToken?: unknown; action?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be JSON." },
      { status: 400 }
    );
  }
  const creatorToken =
    typeof body.creatorToken === "string" ? body.creatorToken.trim() : "";
  const actionRaw = typeof body.action === "string" ? body.action : "";
  if (!creatorToken) {
    return NextResponse.json(
      { ok: false, error: "creatorToken is required." },
      { status: 400 }
    );
  }
  if (!VALID_ACTIONS.includes(actionRaw as ManageAction)) {
    return NextResponse.json(
      {
        ok: false,
        error: `action must be one of: ${VALID_ACTIONS.join(", ")}`,
      },
      { status: 400 }
    );
  }
  const action = actionRaw as ManageAction;

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "storage-unavailable" },
      { status: 503 }
    );
  }

  const { data: poll, error: pollErr } = await admin
    .from("polls")
    .select("id, creator_token")
    .eq("public_id", publicId)
    .maybeSingle();
  if (pollErr) {
    return NextResponse.json(
      { ok: false, error: pollErr.message },
      { status: 500 }
    );
  }
  if (!poll) {
    return NextResponse.json(
      { ok: false, error: "Poll not found." },
      { status: 404 }
    );
  }

  if (!safeStringEq(poll.creator_token, creatorToken)) {
    return NextResponse.json(
      { ok: false, error: "You aren't authorised to manage this poll." },
      { status: 403 }
    );
  }

  if (action === "close" || action === "reopen") {
    const isClosed = action === "close";
    const { error } = await admin
      .from("polls")
      .update({ is_closed: isClosed })
      .eq("id", poll.id);
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, action, isClosed });
  }

  // action === "delete" — cascades to poll_votes via the FK.
  const { error: delErr } = await admin
    .from("polls")
    .delete()
    .eq("id", poll.id);
  if (delErr) {
    return NextResponse.json(
      { ok: false, error: delErr.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, action });
}

/**
 * Constant-time string equality via node:crypto.timingSafeEqual.
 * timingSafeEqual throws on unequal-length buffers, so we bail out on
 * length first — the length-check is itself non-constant-time, but
 * length is public information here (creator_token is always the same
 * 64-hex length so a length mismatch means garbage input, not a hint).
 */
function safeStringEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "utf-8"), Buffer.from(b, "utf-8"));
}
