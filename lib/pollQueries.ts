import "server-only";

import { getSupabaseAdmin } from "./supabaseAdmin";

/**
 * Server-side poll fetching, shared between the API route at
 * /api/poll/[publicId] and the server component at
 * /tools/instant-poll/[publicId].
 *
 * Both need the exact same shape: the poll row (minus creator_token
 * and internal id) plus the aggregate counts view. Extracting the
 * query saves the server component one HTTP hop over Node's own
 * loopback (SSR fetching your own API works but adds ~30-50ms of
 * needless round-trip) and keeps the response shape in one place.
 */

/** Regex mirroring generatePublicId's charset — 54 chars, 8-long.
 *  Reject garbage before touching the DB. Duplicated here so callers
 *  don't have to import from the route file (which would create a
 *  server-component → route-file coupling). */
const PUBLIC_ID_REGEX = /^[A-HJ-KM-NP-Za-hj-km-np-z2-9]{8}$/;

export interface PollOption {
  id: string;
  text: string;
}

export interface PollSettings {
  showResultsBeforeVote: boolean;
  allowMultiplePerDevice: boolean;
}

export interface PollPublic {
  publicId: string;
  question: string;
  options: PollOption[];
  pollType: "single" | "multiple";
  isClosed: boolean;
  isExpired: boolean;
  expiresAt: string;
  createdAt: string;
  settings: PollSettings;
}

export interface PollResults {
  /** option.id → vote count. Options with 0 votes may be omitted. */
  counts: Record<string, number>;
  total: number;
}

export interface PollFetchResult {
  poll: PollPublic;
  results: PollResults;
}

/**
 * Fetch a poll + its aggregate counts by public id. Returns null when
 * the id is malformed or no poll matches. Never returns creator_token
 * or individual votes — same guarantees as the GET API route.
 */
export async function getPollByPublicId(
  publicId: string
): Promise<PollFetchResult | null> {
  if (!PUBLIC_ID_REGEX.test(publicId)) return null;
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data: poll, error: pollErr } = await admin
    .from("polls")
    .select(
      "id, public_id, question, options, poll_type, is_closed, expires_at, created_at, settings"
    )
    .eq("public_id", publicId)
    .maybeSingle();
  if (pollErr || !poll) return null;

  const isExpired = new Date(poll.expires_at).getTime() < Date.now();
  const isClosed = Boolean(poll.is_closed) || isExpired;

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

  return {
    poll: {
      publicId: poll.public_id,
      question: poll.question,
      options: Array.isArray(poll.options) ? (poll.options as PollOption[]) : [],
      pollType: poll.poll_type,
      isClosed,
      isExpired,
      expiresAt: poll.expires_at,
      createdAt: poll.created_at,
      settings: {
        showResultsBeforeVote: Boolean(poll.settings?.showResultsBeforeVote),
        allowMultiplePerDevice: Boolean(poll.settings?.allowMultiplePerDevice),
      },
    },
    results: { counts, total },
  };
}
