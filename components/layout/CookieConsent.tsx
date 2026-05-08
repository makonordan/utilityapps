"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "utilityapps:cookie-consent";

type Choice = "accepted" | "rejected";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // Mount-only read of localStorage; the lint rule's cascade concern
      // doesn't apply because this fires once and never re-runs.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!stored) setVisible(true);
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function record(choice: Choice) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, ts: new Date().toISOString() })
      );
    } catch {
      // ignore storage errors (Safari private mode, etc.)
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { choice } }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-surface-200 bg-white/95 p-4 shadow-card backdrop-blur dark:border-surface-800 dark:bg-surface-900/95 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-surface-700 dark:text-surface-200">
          We use a few essential cookies plus optional analytics to improve UtilityApps. See our{" "}
          <Link href="/privacy" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => record("rejected")}
            className="rounded-xl border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 transition hover:bg-surface-100 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => record("accepted")}
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
