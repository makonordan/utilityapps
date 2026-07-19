"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutGrid, X } from "lucide-react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "utilityapps:apps-promo-modal";
const SHOW_DELAY_MS = 6000;

type Answer = "yes" | "no";

/** One-time homepage nudge: most visitors land here for the free tools and
 *  never learn the Apps directory (business software, pricing-verified)
 *  exists at all — it's several sections down the page. A single dismissible
 *  question surfaces it up front without being a hard sell. Delayed and
 *  localStorage-gated so it never competes with CookieConsent's immediate
 *  bottom banner and never nags a returning visitor. Plain CSS transitions,
 *  not framer-motion/AnimatePresence — see Header.tsx's MobileMenu for why
 *  that library's mount/unmount tracking is worth avoiding on overlays.
 *
 *  Takes the app/category counts as props (computed server-side in
 *  app/page.tsx) rather than importing lib/apps directly — that module's
 *  331-listing dataset has no reason to ship into this client bundle just
 *  to render two numbers. */
export function AppsPromoModal({
  appCount,
  categoryCount,
}: {
  appCount: number;
  categoryCount: number;
}) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Safari private mode etc. — treat as unseen, just don't persist later.
    }
    if (stored) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    }, SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  function dismiss(answer: Answer) {
    try {
      window.localStorage.setItem(STORAGE_KEY, answer);
    } catch {
      // ignore storage errors
    }
    setShown(false);
    setTimeout(() => setVisible(false), 200);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apps-promo-heading"
      className={cn(
        "fixed inset-0 z-[65] flex items-center justify-center bg-surface-950/50 px-4 backdrop-blur-sm transition-opacity duration-200",
        shown ? "opacity-100" : "opacity-0"
      )}
      onClick={() => dismiss("no")}
    >
      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-surface-200 bg-white p-6 shadow-card-hover transition-all duration-200 dark:border-surface-800 dark:bg-surface-900",
          shown ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => dismiss("no")}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-200"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
          <LayoutGrid className="h-5 w-5" />
        </span>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Quick question
        </p>
        <h2
          id="apps-promo-heading"
          className="mt-1 text-lg font-bold tracking-tight text-surface-900 dark:text-white"
        >
          Also comparing business software?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
          UtilityApps isn&apos;t just free tools — we run a pricing-verified directory of{" "}
          {appCount}+ business apps across {categoryCount} categories: CRM, invoicing, AI tools,
          e-commerce, and more.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => dismiss("no")}
            className="flex-1 rounded-xl border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-700 transition hover:bg-surface-100 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
          >
            Just here for tools
          </button>
          <Link
            href="/apps"
            onClick={() => dismiss("yes")}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:from-primary-600 hover:to-accent-600"
          >
            Show me →
          </Link>
        </div>
      </div>
    </div>
  );
}
