import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIp,
  hashIp,
} from "@/lib/pollRateLimit";
import { computeVoterHash } from "@/lib/pollUtils";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/poll/[publicId]/vote
 *
 * Body: { optionIds: string[], deviceToken: string }
 *   optionIds:   the option.id values the voter selected. Single-choice
 *                polls must send exactly one; multi-choice polls send
 *                one or more (subject to the poll's own option list).
 *   deviceToken: opaque per-browser random string the client keeps in
 *                localStorage. Combined with the request's user-agent
 *                and the poll id to build the voter_hash — see
 *                lib/pollUtils.computeVoterHash for the shape.
 *
 * Responses:
 *   200: { ok: true, results }               — vote accepted
 *   400: { ok: false, error }                — malformed body / bad option ids
 *   404: { ok: false, error }                — poll not found
 *   409: { ok: false, error, results,        — this device already voted
 *          alreadyVoted: true }
 *   410: { ok: false, error, results,        — poll is closed / expired
 *          pollClosed: true, pollExpired?: true }
 *   429: { ok: false, error }                — per-IP rate limit hit
 *
 * The results payload on every closed / duplicate case gives the UI
 * enough to switch straight to the results view without a second GET.
 */

const VOTE_RATE_LIMIT_MAX = 100;
const VOTE_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const PUBLIC_ID_REGEX = /^[A-HJ-KM-NP-Za-hj-km-np-z2-9]{8}$/;

type Params = { params: Promise<{ publicId: string }> };

interface OptionRow {
  id: string;
  text: string;
}

export async function POST(request: NextRequest, { params }: Params) {
  const { publicId } = await params;
  if (!PUBLIC_ID_REGEX.test(publicId)) {
    return NextResponse.json(
      { ok: false, error: "Poll not found." },
      { status: 404 }
    );
  }

  // ── Rate limit
  const ip = getClientIp(request.headers);
  const ipKey = await hashIp(ip);
  const rl = checkRateLimit(
    `poll:vote:${ipKey}`,
    VOTE_RATE_LIMIT_MAX,
    VOTE_RATE_LIMIT_WINDOW_MS
  );
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "You've voted too many times in the last hour. Please try again shortly.",
      },
      {
        status: 429,
        headers: rl.retryAfterSec
          ? { "Retry-After": String(rl.retryAfterSec) }
          : {},
      }
    );
  }

  // ── Parse body
  let body: { optionIds?: unknown; deviceToken?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be JSON." },
      { status: 400 }
    );
  }
  const requestedOptionIds = Array.isArray(body.optionIds)
    ? (body.optionIds as unknown[]).filter(
        (v): v is string => typeof v === "string"
      )
    : [];
  const deviceToken =
    typeof body.deviceToken === "string" ? body.deviceToken.trim() : "";
  if (requestedOptionIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "At least one option is required." },
      { status: 400 }
    );
  }
  if (!deviceToken) {
    return NextResponse.json(
      { ok: false, error: "deviceToken is required." },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "storage-unavailable" },
      { status: 503 }
    );
  }

  // ── Fetch poll
  const { data: poll, error: pollErr } = await admin
    .from("polls")
    .select(
      "id, poll_type, is_closed, expires_at, total_votes, options, settings"
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
  const isEffectivelyClosed = Boolean(poll.is_closed) || isExpired;

  // Small helper — used at each early-exit site so the client always
  // gets a fresh counts breakdown to render in place.
  const currentResults = async () => {
    const { data: agg } = await admin
      .from("poll_results")
      .select("counts, total")
      .eq("poll_id", poll.id)
      .maybeSingle();
    return {
      counts:
        agg && typeof agg.counts === "object" && agg.counts !== null
          ? (agg.counts as Record<string, number>)
          : {},
      total: typeof agg?.total === "number" ? agg.total : 0,
    };
  };

  if (isEffectivelyClosed) {
    return NextResponse.json(
      {
        ok: false,
        error: isExpired ? "This poll has expired." : "This poll is closed.",
        results: await currentResults(),
        pollClosed: true,
        pollExpired: isExpired,
      },
      { status: 410 }
    );
  }

  // ── Validate option ids against the poll's option set
  const optionRows = Array.isArray(poll.options)
    ? (poll.options as OptionRow[])
    : [];
  const validIds = new Set(optionRows.map((o) => o.id));
  const chosenIds = requestedOptionIds.filter((id) => validIds.has(id));
  if (chosenIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "The selected options are not part of this poll." },
      { status: 400 }
    );
  }
  const dedupedChosen = Array.from(new Set(chosenIds));
  if (poll.poll_type === "single" && dedupedChosen.length !== 1) {
    return NextResponse.json(
      { ok: false, error: "This poll only accepts one choice." },
      { status: 400 }
    );
  }

  // ── Duplicate-vote check
  const userAgent = request.headers.get("user-agent") ?? "";
  const voterHash = await computeVoterHash(poll.id, deviceToken, userAgent);
  const settings = (poll.settings ?? {}) as { allowMultiplePerDevice?: boolean };
  if (!settings.allowMultiplePerDevice) {
    const { data: existing } = await admin
      .from("poll_votes")
      .select("id")
      .eq("poll_id", poll.id)
      .eq("voter_hash", voterHash)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "You've already voted on this poll.",
          results: await currentResults(),
          alreadyVoted: true,
        },
        { status: 409 }
      );
    }
  }

  // ── Insert vote
  const { error: voteErr } = await admin.from("poll_votes").insert({
    poll_id: poll.id,
    option_ids: dedupedChosen,
    voter_hash: voterHash,
  });
  if (voteErr) {
    return NextResponse.json(
      { ok: false, error: voteErr.message },
      { status: 500 }
    );
  }

  // Fire-and-forget bump of the denormalised counter on the polls row.
  // The authoritative count still comes from the poll_results view, so
  // if this update races and drops an increment the results panel is
  // unaffected — the counter is a display convenience only.
  void admin
    .from("polls")
    .update({ total_votes: (poll.total_votes ?? 0) + 1 })
    .eq("id", poll.id);

  return NextResponse.json({
    ok: true,
    results: await currentResults(),
  });
}
