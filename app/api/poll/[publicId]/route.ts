import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/poll/[publicId]
 *
 * Returns the poll metadata + aggregate vote counts. Never returns
 * individual votes and never returns creator_token — that field only
 * exists in the creation response and in the browser localStorage of
 * the person who made the poll.
 *
 * Responses:
 *   200: { ok: true, poll, results }
 *   404: { ok: false, error: "Poll not found." }
 *   503: { ok: false, error: "storage-unavailable" }
 *
 * poll shape (all camelCased for the client):
 *   { publicId, question, options, pollType, isClosed, isExpired,
 *     expiresAt, settings, createdAt }
 * results shape:
 *   { counts: Record<optionId, number>, total: number }
 */

/** Same charset as generatePublicId — 54 chars, 8-long. Reject garbage
 *  input before hitting the DB. */
const PUBLIC_ID_REGEX = /^[A-HJ-KM-NP-Za-hj-km-np-z2-9]{8}$/;

type Params = { params: Promise<{ publicId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { publicId } = await params;
  if (!PUBLIC_ID_REGEX.test(publicId)) {
    return NextResponse.json(
      { ok: false, error: "Poll not found." },
      { status: 404 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "storage-unavailable" },
      { status: 503 }
    );
  }

  // We need the internal id for the aggregate view join, but strip it
  // from the response body — clients only ever use public_id.
  const { data: poll, error: pollErr } = await admin
    .from("polls")
    .select(
      "id, public_id, question, options, poll_type, is_closed, expires_at, created_at, settings"
    )
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

  const isExpired = new Date(poll.expires_at).getTime() < Date.now();
  const isClosed = Boolean(poll.is_closed) || isExpired;

  // Aggregate counts come from the poll_results view — it groups
  // votes by option_id and returns a jsonb map so a single row is
  // enough. If a poll has zero votes the view has no row for that
  // poll_id, which we treat as `{ counts: {}, total: 0 }`.
  const { data: agg } = await admin
    .from("poll_results")
    .select("counts, total")
    .eq("poll_id", poll.id)
    .maybeSingle();

  const counts =
    agg && typeof agg.counts === "object" && agg.counts !== null
      ? (agg.counts as Record<string, number>)
      : {};
  const total = typeof agg?.total === "number" ? agg.total : 0;

  return NextResponse.json({
    ok: true,
    poll: {
      publicId: poll.public_id,
      question: poll.question,
      options: poll.options,
      pollType: poll.poll_type,
      isClosed,
      isExpired,
      expiresAt: poll.expires_at,
      createdAt: poll.created_at,
      settings: poll.settings,
    },
    results: {
      counts,
      total,
    },
  });
}
