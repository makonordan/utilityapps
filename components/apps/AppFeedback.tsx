"use client";

import { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { getExistingVote, markVoted, trackAppEvent } from "@/lib/apps/analytics";
import { cn } from "@/lib/utils";

/** Anonymous, no-login "was this helpful" widget. One vote per device via a
 *  localStorage flag — checked gently (so we don't ask twice) rather than
 *  used to block a determined re-vote. */
export function AppFeedback({ appId, appName }: { appId: string; appName: string }) {
  // Start null on both server and first client render (SSR can't read
  // localStorage) and only switch to an existing vote post-hydration, in an
  // effect — reading localStorage in the useState initializer would render
  // differently server- vs client-side for returning visitors and produce a
  // hydration mismatch.
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVote(getExistingVote(appId));
  }, [appId]);

  function castVote(choice: "up" | "down") {
    setVote(choice);
    markVoted(appId, choice);
    trackAppEvent(appId, choice === "up" ? "helpful_yes" : "helpful_no");
  }

  if (vote) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 text-center text-sm text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
        Thanks for the feedback — it helps us keep this review honest.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-200 bg-white p-5 text-center dark:border-surface-800 dark:bg-surface-900 sm:flex-row sm:justify-between sm:text-left">
      <p className="text-sm font-semibold text-surface-900 dark:text-white">
        Was this review of {appName} helpful?
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => castVote("up")}
          aria-label="Yes, this review was helpful"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3.5 py-2 text-sm font-semibold text-surface-700 transition hover:border-success-300 hover:text-success-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-success-700 dark:hover:text-success-300"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </button>
        <button
          type="button"
          onClick={() => castVote("down")}
          aria-label="No, this review was not helpful"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3.5 py-2 text-sm font-semibold text-surface-700 transition hover:border-warning-300 hover:text-warning-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-warning-700 dark:hover:text-warning-300"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </button>
      </div>
    </div>
  );
}
