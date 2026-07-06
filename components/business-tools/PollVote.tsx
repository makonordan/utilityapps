"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Lock,
  MessageCircle,
  Radio,
  RefreshCw,
  Sparkles,
  Square,
  Trash2,
  Unlock,
  Zap,
} from "lucide-react";

import type { PollFetchResult, PollOption } from "@/lib/pollQueries";
import { cn } from "@/lib/utils";

/**
 * PollVote — the public poll experience at
 * /tools/instant-poll/[publicId]. This is what most users see (via
 * a WhatsApp / Slack / SMS link), overwhelmingly on mobile, so
 * everything from tap-target size to keyboard behaviour is optimised
 * for a thumb-and-in-app-browser context.
 *
 * State machine:
 *
 *   voting     → default when poll is open and this device hasn't voted
 *   submitting → in-flight to /api/poll/[publicId]/vote
 *   results    → after successful vote, or when arriving pre-voted, or
 *                when the poll is closed / expired
 *
 * localStorage keys used:
 *
 *   poll:<publicId>          → creator_token (from PollCreator's success
 *                              flow — unlocks close/reopen/delete)
 *   poll:device-token        → one 32-hex device token shared across all
 *                              polls; combined server-side with the
 *                              user-agent to make voter_hash
 *   poll-voted:<publicId>    → JSON array of the option.id values this
 *                              device already voted for
 *
 * Live polling: every 5s while the results view is open + the poll is
 * still active, refetches /api/poll/[publicId]. Stops after 5 min of
 * user inactivity (no scroll/click/keydown) so an abandoned tab doesn't
 * hammer the endpoint forever. A "Live" chip pulses while polling, and
 * flips to "Paused" once the idle timeout fires.
 */

const RESULTS_POLL_INTERVAL_MS = 5_000;
const RESULTS_POLL_IDLE_STOP_MS = 5 * 60 * 1000;

// ── Types ──────────────────────────────────────────────────────────────

type VoteState = "voting" | "submitting" | "results";

interface Props {
  initial: PollFetchResult;
  publicId: string;
}

// ── Component ──────────────────────────────────────────────────────────

export function PollVote({ initial, publicId }: Props) {
  const [poll, setPoll] = useState(initial.poll);
  const [results, setResults] = useState(initial.results);
  // Show results immediately if the poll is closed/expired. Otherwise
  // start on the voting screen and let the effect below flip us to
  // results if this device already voted (localStorage check runs
  // client-only to avoid a hydration mismatch).
  const [state, setState] = useState<VoteState>(
    initial.poll.isClosed ? "results" : "voting"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [votedOptionIds, setVotedOptionIds] = useState<string[]>([]);
  const [creatorToken, setCreatorToken] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"link" | null>(null);
  const [livePolling, setLivePolling] = useState<"live" | "paused">("live");

  // ── One-time client-only bootstrap: pick up prior vote + creator
  //    token from localStorage. Kept in useEffect (not useState) so
  //    server and client render the same first HTML — no hydration
  //    mismatch. ────────────────────────────────────────────────────
  useEffect(() => {
    const prior = readVotedOptionIds(publicId);
    if (prior.length > 0) {
      setVotedOptionIds(prior);
      if (!initial.poll.isClosed) setState("results");
    }
    setCreatorToken(readCreatorToken(publicId));
  }, [publicId, initial.poll.isClosed]);

  const shareUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.location.href
        : `https://utilityapps.site/tools/instant-poll/${publicId}`,
    [publicId]
  );

  // ── Live results polling ────────────────────────────────────────────

  useEffect(() => {
    if (state !== "results") return;
    // Never poll a closed poll — results are frozen. Also skip if
    // component just mounted showing a closed poll.
    if (poll.isClosed) return;

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let lastActivityAt = Date.now();
    setLivePolling("live");

    const bumpActivity = () => {
      const wasPaused = Date.now() - lastActivityAt > RESULTS_POLL_IDLE_STOP_MS;
      lastActivityAt = Date.now();
      if (wasPaused) {
        // User came back after being idle — resume polling immediately
        // instead of waiting for the next scheduled tick.
        setLivePolling("live");
        void tick();
      }
    };

    const tick = async () => {
      if (cancelled) return;
      if (Date.now() - lastActivityAt > RESULTS_POLL_IDLE_STOP_MS) {
        setLivePolling("paused");
        return;
      }
      try {
        const res = await fetch(`/api/poll/${publicId}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as {
          ok?: boolean;
          poll?: PollFetchResult["poll"];
          results?: PollFetchResult["results"];
        };
        if (!cancelled && json.ok && json.poll && json.results) {
          setPoll(json.poll);
          setResults(json.results);
          if (json.poll.isClosed) {
            // Poll just closed — stop scheduling further polls.
            return;
          }
        }
      } catch {
        // Silent — network flaps are common in-app browsers; the next
        // scheduled tick will retry.
      }
      if (!cancelled) {
        timerId = setTimeout(tick, RESULTS_POLL_INTERVAL_MS);
      }
    };

    window.addEventListener("scroll", bumpActivity, { passive: true });
    window.addEventListener("click", bumpActivity);
    window.addEventListener("keydown", bumpActivity);
    timerId = setTimeout(tick, RESULTS_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
      window.removeEventListener("scroll", bumpActivity);
      window.removeEventListener("click", bumpActivity);
      window.removeEventListener("keydown", bumpActivity);
    };
  }, [state, publicId, poll.isClosed]);

  // ── Selection handlers ──────────────────────────────────────────────

  const toggleSelected = useCallback(
    (id: string) => {
      setError(null);
      setSelected((prev) => {
        if (poll.pollType === "single") {
          // Radio semantics — clicking the currently-selected option
          // deselects it, but any other click replaces the set.
          if (prev.has(id) && prev.size === 1) return new Set();
          return new Set([id]);
        }
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [poll.pollType]
  );

  // ── Submit vote ─────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    if (selected.size === 0) {
      setError("Pick an option first.");
      return;
    }
    const optionIds = Array.from(selected);
    setState("submitting");
    setError(null);

    const deviceToken = getOrCreateDeviceToken();
    try {
      const res = await fetch(`/api/poll/${publicId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds, deviceToken }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        results?: PollFetchResult["results"];
        error?: string;
        alreadyVoted?: boolean;
        pollClosed?: boolean;
        pollExpired?: boolean;
      };

      // Same-device duplicate — jump to results, mark voted.
      if (res.status === 409 && json.alreadyVoted) {
        if (json.results) setResults(json.results);
        writeVotedOptionIds(publicId, optionIds);
        setVotedOptionIds(optionIds);
        setState("results");
        return;
      }
      // Poll closed / expired — jump to results with the final state.
      if (res.status === 410 && json.pollClosed) {
        if (json.results) setResults(json.results);
        setPoll((prev) => ({
          ...prev,
          isClosed: true,
          isExpired: Boolean(json.pollExpired),
        }));
        setState("results");
        return;
      }
      if (!res.ok || !json.ok || !json.results) {
        setError(json.error ?? "Couldn't record your vote. Please try again.");
        setState("voting");
        return;
      }
      setResults(json.results);
      writeVotedOptionIds(publicId, optionIds);
      setVotedOptionIds(optionIds);
      setState("results");
    } catch {
      setError("Network error. Please try again.");
      setState("voting");
    }
  }, [selected, publicId]);

  // ── Creator manage actions ──────────────────────────────────────────

  const manage = useCallback(
    async (action: "close" | "reopen" | "delete") => {
      if (!creatorToken) return;
      if (
        action === "delete" &&
        !confirm(
          "Delete this poll? Every vote and the results view will disappear. This can't be undone."
        )
      ) {
        return;
      }
      try {
        const res = await fetch(`/api/poll/${publicId}/manage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorToken, action }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error ?? "Couldn't update the poll.");
          return;
        }
        if (action === "delete") {
          // Wipe the creator token + voted marker for this poll.
          try {
            window.localStorage.removeItem(`poll:${publicId}`);
            window.localStorage.removeItem(`poll-voted:${publicId}`);
          } catch {
            /* ignore */
          }
          window.location.href = "/tools/instant-poll";
          return;
        }
        setPoll((prev) => ({ ...prev, isClosed: action === "close" }));
      } catch {
        setError("Network error.");
      }
    },
    [creatorToken, publicId]
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("link");
      window.setTimeout(() => setCopyState(null), 1800);
    } catch {
      /* ignore */
    }
  }, [shareUrl]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-8 sm:px-6">
      <PollHeader poll={poll} totalVotes={results.total} />

      {state === "voting" && (
        <VotingView
          poll={poll}
          selected={selected}
          onToggle={toggleSelected}
          totalVotes={results.total}
          error={error}
          onSubmit={submit}
        />
      )}

      {state === "submitting" && <SubmittingView />}

      {state === "results" && (
        <ResultsView
          poll={poll}
          results={results}
          votedOptionIds={votedOptionIds}
          shareUrl={shareUrl}
          copyState={copyState}
          onCopyLink={copyLink}
          livePolling={livePolling}
        />
      )}

      {creatorToken && (
        <CreatorPanel
          isClosed={poll.isClosed}
          isExpired={poll.isExpired}
          onAction={manage}
        />
      )}
    </div>
  );
}

// ── Poll header (shown in every state) ─────────────────────────────────

function PollHeader({
  poll,
  totalVotes,
}: {
  poll: PollFetchResult["poll"];
  totalVotes: number;
}) {
  return (
    <header className="mb-6">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-300">
        {poll.pollType === "multiple" ? (
          <>
            <Square className="h-3 w-3" /> Multiple choice
          </>
        ) : (
          <>
            <Radio className="h-3 w-3" /> Single choice
          </>
        )}
      </p>
      <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        {poll.question}
      </h1>
      {poll.isClosed && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-900/5 px-3 py-1 text-[11px] font-medium text-surface-700 dark:bg-surface-100/5 dark:text-surface-300">
          <Lock className="h-3 w-3" />
          {poll.isExpired
            ? "This poll has expired."
            : "This poll has been closed."}
        </p>
      )}
      <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
        <strong className="tabular-nums text-surface-700 dark:text-surface-200">
          {totalVotes.toLocaleString()}
        </strong>{" "}
        {totalVotes === 1 ? "vote" : "votes"} so far · No login needed
      </p>
    </header>
  );
}

// ── Voting view ────────────────────────────────────────────────────────

function VotingView({
  poll,
  selected,
  onToggle,
  totalVotes: _totalVotes,
  error,
  onSubmit,
}: {
  poll: PollFetchResult["poll"];
  selected: Set<string>;
  onToggle: (id: string) => void;
  totalVotes: number;
  error: string | null;
  onSubmit: () => void;
}) {
  const canSubmit = selected.size > 0;
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {poll.options.map((opt) => {
          const isSelected = selected.has(opt.id);
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => onToggle(opt.id)}
                aria-pressed={isSelected}
                className={cn(
                  // Min-height 56px = thumb-friendly per iOS HIG.
                  "flex w-full min-h-14 items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left text-base font-medium transition dark:bg-surface-900",
                  isSelected
                    ? "border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-100"
                    : "border-surface-200 text-surface-800 hover:border-surface-300 active:bg-surface-100 dark:border-surface-800 dark:text-surface-100 dark:active:bg-surface-800"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center transition",
                    poll.pollType === "single" ? "rounded-full" : "rounded-md",
                    isSelected
                      ? "bg-primary-500 text-white"
                      : "border-2 border-surface-300 text-transparent dark:border-surface-600"
                  )}
                >
                  {isSelected ? (
                    poll.pollType === "single" ? (
                      <Circle className="h-2.5 w-2.5 fill-current" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 leading-snug">{opt.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-glow transition disabled:opacity-50 sm:text-lg",
          "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
        )}
      >
        Vote <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-center text-[11px] text-surface-500 dark:text-surface-400">
        Anonymous · One vote per device
      </p>
    </div>
  );
}

// ── Submitting view ────────────────────────────────────────────────────

function SubmittingView() {
  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-8 text-center dark:border-surface-800 dark:bg-surface-900">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-300">
        <RefreshCw className="h-5 w-5 animate-spin" />
      </div>
      <p className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
        Casting your vote…
      </p>
    </div>
  );
}

// ── Results view ───────────────────────────────────────────────────────

function ResultsView({
  poll,
  results,
  votedOptionIds,
  shareUrl,
  copyState,
  onCopyLink,
  livePolling,
}: {
  poll: PollFetchResult["poll"];
  results: PollFetchResult["results"];
  votedOptionIds: string[];
  shareUrl: string;
  copyState: "link" | null;
  onCopyLink: () => void;
  livePolling: "live" | "paused";
}) {
  const votedSet = useMemo(() => new Set(votedOptionIds), [votedOptionIds]);
  const votedTexts = useMemo(() => {
    return poll.options
      .filter((o) => votedSet.has(o.id))
      .map((o) => o.text);
  }, [poll.options, votedSet]);

  // Winner = max vote count. If tied, no single winner is highlighted.
  const maxCount = Math.max(0, ...Object.values(results.counts));
  const winners = new Set(
    Object.entries(results.counts)
      .filter(([, count]) => count === maxCount && count > 0)
      .map(([id]) => id)
  );
  const uniqueWinner = winners.size === 1;

  const whatsappUrl = useMemo(() => {
    const text = poll.question
      ? `${poll.question}\n${shareUrl}`
      : shareUrl;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [poll.question, shareUrl]);

  return (
    <div className="space-y-5">
      {votedTexts.length > 0 && (
        <p className="inline-flex items-start gap-2 rounded-2xl border border-success-200 bg-success-50 px-3 py-2 text-xs text-success-900 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-100">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-400" />
          <span>
            You voted for <strong>{votedTexts.join(", ")}</strong>
          </span>
        </p>
      )}

      <ul className="space-y-2">
        {poll.options.map((opt) => (
          <ResultBar
            key={opt.id}
            option={opt}
            count={results.counts[opt.id] ?? 0}
            total={results.total}
            isWinner={uniqueWinner && winners.has(opt.id)}
            wasVoted={votedSet.has(opt.id)}
          />
        ))}
      </ul>

      <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
        <span className="tabular-nums">
          {results.total.toLocaleString()} total{" "}
          {results.total === 1 ? "vote" : "votes"}
        </span>
        {!poll.isClosed && (
          <span
            className={cn(
              "inline-flex items-center gap-1",
              livePolling === "live"
                ? "text-success-700 dark:text-success-300"
                : "text-surface-500 dark:text-surface-400"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                livePolling === "live"
                  ? "animate-pulse bg-success-500"
                  : "bg-surface-400"
              )}
            />
            {livePolling === "live" ? "Live" : "Paused"}
          </span>
        )}
      </div>

      {/* Share row — every result view is a re-share opportunity. */}
      <div className="grid gap-2 sm:grid-cols-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={onCopyLink}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
            copyState === "link"
              ? "bg-success-600 text-white hover:bg-success-700"
              : "border border-surface-200 bg-white text-surface-800 hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          )}
        >
          {copyState === "link" ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy link
            </>
          )}
        </button>
      </div>

      {/* Growth loop — every viewer is a potential creator. */}
      <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 text-sm text-primary-900 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" />
          <div className="flex-1">
            <p className="font-semibold">Want your own poll?</p>
            <p className="mt-0.5 text-xs">
              Free. No signup. Share on WhatsApp in under 10 seconds.
            </p>
          </div>
          <Link
            href="/tools/instant-poll"
            className="inline-flex items-center gap-1 rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
          >
            Create <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultBar({
  option,
  count,
  total,
  isWinner,
  wasVoted,
}: {
  option: PollOption;
  count: number;
  total: number;
  isWinner: boolean;
  wasVoted: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <li>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-3.5 transition",
          isWinner
            ? "border-primary-400 bg-primary-50 dark:border-primary-500/60 dark:bg-primary-500/10"
            : "border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
        )}
      >
        {/* Background fill — animated width. Sits behind the text. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 rounded-2xl transition-[width] duration-500 ease-out",
            isWinner
              ? "bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-500/20 dark:to-accent-500/20"
              : "bg-surface-100 dark:bg-surface-800/60"
          )}
          style={{ width: `${pct}%` }}
        />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {wasVoted && (
              <CheckCircle2
                aria-label="Your vote"
                className="h-4 w-4 shrink-0 text-success-600 dark:text-success-400"
              />
            )}
            <span
              className={cn(
                "truncate text-sm font-semibold",
                isWinner
                  ? "text-primary-900 dark:text-primary-100"
                  : "text-surface-900 dark:text-white"
              )}
            >
              {option.text}
            </span>
          </div>
          <div className="flex shrink-0 items-baseline gap-2 tabular-nums">
            <span
              className={cn(
                "text-xs",
                isWinner
                  ? "text-primary-800/80 dark:text-primary-200/80"
                  : "text-surface-500 dark:text-surface-400"
              )}
            >
              {count.toLocaleString()}
            </span>
            <span
              className={cn(
                "text-sm font-bold",
                isWinner
                  ? "text-primary-700 dark:text-primary-300"
                  : "text-surface-700 dark:text-surface-200"
              )}
            >
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

// ── Creator panel ──────────────────────────────────────────────────────

function CreatorPanel({
  isClosed,
  isExpired,
  onAction,
}: {
  isClosed: boolean;
  isExpired: boolean;
  onAction: (a: "close" | "reopen" | "delete") => void;
}) {
  return (
    <details className="mt-8 rounded-2xl border border-surface-200 bg-surface-50/60 p-4 dark:border-surface-800 dark:bg-surface-900/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-surface-700 dark:text-surface-200">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-primary-500" />
          You created this poll
        </span>
        <span className="text-[10px] text-primary-600 dark:text-primary-400">
          Manage
        </span>
      </summary>
      <div className="mt-3 space-y-2">
        {isExpired ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            This poll has passed its 30-day lifetime. You can still delete it.
          </p>
        ) : isClosed ? (
          <button
            type="button"
            onClick={() => onAction("reopen")}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold text-surface-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          >
            <Unlock className="h-3.5 w-3.5" /> Reopen voting
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction("close")}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold text-surface-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          >
            <Lock className="h-3.5 w-3.5" /> Close voting
          </button>
        )}
        <button
          type="button"
          onClick={() => onAction("delete")}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/40 dark:bg-surface-900 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete poll
        </button>
      </div>
      <p className="mt-2 text-[10px] text-surface-500 dark:text-surface-400">
        Only this browser can manage this poll — the manage token lives in your localStorage.
      </p>
    </details>
  );
}

// ── localStorage helpers ───────────────────────────────────────────────

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function readCreatorToken(publicId: string): string | null {
  const ls = safeLocalStorage();
  if (!ls) return null;
  try {
    return ls.getItem(`poll:${publicId}`);
  } catch {
    return null;
  }
}

function readVotedOptionIds(publicId: string): string[] {
  const ls = safeLocalStorage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(`poll-voted:${publicId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((v): v is string => typeof v === "string");
    }
    return [];
  } catch {
    return [];
  }
}

function writeVotedOptionIds(publicId: string, ids: string[]): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(`poll-voted:${publicId}`, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function getOrCreateDeviceToken(): string {
  const ls = safeLocalStorage();
  if (ls) {
    try {
      const existing = ls.getItem("poll:device-token");
      if (existing) return existing;
    } catch {
      /* ignore */
    }
  }
  // 16 random bytes → 32 hex chars. Non-cryptographic identifier — the
  // API combines it with the request user-agent and hashes the pair, so
  // this string is never itself a credential.
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < buf.length; i++) {
    out += buf[i].toString(16).padStart(2, "0");
  }
  if (ls) {
    try {
      ls.setItem("poll:device-token", out);
    } catch {
      /* ignore */
    }
  }
  return out;
}
