"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, X } from "lucide-react";

import { getIcon } from "@/lib/icons";
import { getRecentTools, subscribeRecentTools, type RecentEntry } from "@/lib/recent";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "utilityapps:recent-dismissed";

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color])
);

export function RecentlyUsed() {
  const [entries, setEntries] = useState<RecentEntry[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Mount-only hydration of browser state (sessionStorage + localStorage).
    /* eslint-disable react-hooks/set-state-in-effect */
    setHydrated(true);
    setEntries(getRecentTools());
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    /* eslint-enable react-hooks/set-state-in-effect */
    return subscribeRecentTools(() => setEntries(getRecentTools()));
  }, []);

  const tools = useMemo<Tool[]>(() => {
    return entries
      .map((e) => TOOLS_BY_ID[e.toolId])
      .filter((t): t is Tool => Boolean(t));
  }, [entries]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!hydrated || dismissed || tools.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.aside
        key="recent-used"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        aria-label="Recently used tools"
        className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-3xl rounded-2xl border border-surface-200 bg-white/95 shadow-card-hover backdrop-blur dark:border-surface-800 dark:bg-surface-900/95"
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            <Clock className="h-3 w-3" />
            Recently used
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss recently used"
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <ul className="-mx-2 flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
          {tools.map((tool) => {
            const Icon = getIcon(tool.icon);
            const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";
            return (
              <li key={tool.id} className="shrink-0">
                <Link
                  href={tool.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-800 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card",
                    "dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:hover:border-primary-700"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="max-w-[160px] truncate">{tool.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.aside>
    </AnimatePresence>
  );
}
