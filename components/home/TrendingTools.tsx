"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, TrendingUp } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS, type Tool } from "@/lib/tools";

const PAGE = 8;

// High-CPC categories (finance, health) lead the initial 8-tool view so the
// most ad-valuable tools are visible first.
const TRENDING_CATEGORY_ORDER = [
  "PDF Tools",
  "Finance Tools",
  "Image Tools",
  "Health Tools",
  "Calculator Tools",
  "Developer Tools",
  "Video Tools",
  "Audio Tools",
  // Remaining categories appended so "Load more" eventually shows every tool.
  "SEO Tools",
  "Productivity Tools",
  "Legal Tools",
  "Language Tools",
  "Design Tools",
  "Student Tools",
  "Sleep Tools",
  "Travel Tools",
  "Text Tools",
];

/** Trending value = monthly searches weighted by commercial value (CPC). */
function trendingScore(t: Tool): number {
  return t.monthlySearches * Math.max(1, t.cpc);
}
function trendingPriority(a: Tool, b: Tool): number {
  return trendingScore(b) - trendingScore(a);
}

/**
 * Round-robin through categories, taking the highest-value tool from each in
 * turn, so the first 8 are one-per-category and every tool eventually appears.
 */
function diversify(
  all: Tool[],
  order: string[],
  rank: (a: Tool, b: Tool) => number
): Tool[] {
  const grouped = new Map<string, Tool[]>();
  const known = new Set(order);
  for (const cat of order) {
    grouped.set(cat, all.filter((t) => t.category === cat).sort(rank));
  }
  const extra = [...new Set(all.map((t) => t.category))].filter((c) => !known.has(c));
  for (const cat of extra) {
    grouped.set(cat, all.filter((t) => t.category === cat).sort(rank));
  }
  const cats = [...order.filter((c) => grouped.get(c)?.length), ...extra];

  const result: Tool[] = [];
  let round = 0;
  let added = true;
  while (added && result.length < all.length) {
    added = false;
    for (const cat of cats) {
      const tool = grouped.get(cat)?.[round];
      if (tool) {
        result.push(tool);
        added = true;
      }
    }
    round++;
  }
  return result;
}

// Tools we want as the very first cards regardless of trending score —
// either brand-new launches we're spotlighting or evergreen jobs-to-be-done
// that users won't think to search for by category. Order here = display
// order. Diversification fills the slots after these.
const PINNED_TOOL_IDS = ["share"];

const PINNED_TOOLS: Tool[] = PINNED_TOOL_IDS
  .map((id) => TOOLS.find((t) => t.id === id))
  .filter((t): t is Tool => Boolean(t));

const PINNED_IDS = new Set(PINNED_TOOLS.map((t) => t.id));
const REST_TOOLS = TOOLS.filter((t) => !PINNED_IDS.has(t.id));

// TOOLS is a static catalog, so the diversified order is computed once.
const TRENDING_ORDERED = [
  ...PINNED_TOOLS,
  ...diversify(REST_TOOLS, TRENDING_CATEGORY_ORDER, trendingPriority),
];

export function TrendingTools() {
  const [visibleCount, setVisibleCount] = useState(PAGE);

  const visible = TRENDING_ORDERED.slice(0, visibleCount);
  const allShown = visible.length >= TRENDING_ORDERED.length;

  if (TRENDING_ORDERED.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-0.5 text-[11px] font-semibold text-accent-700 dark:border-accent-700/50 dark:bg-accent-500/10 dark:text-accent-300">
            <TrendingUp className="h-3 w-3" />
            Updated daily
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Trending Tools
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            What everyone is using on UtilityApps right now.
          </p>
        </div>
        <Link
          href="/tools"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          See all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} rank={i + 1} variant="trending" />
        ))}
      </div>

      {!allShown && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            Load More Trending
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
      {allShown && TRENDING_ORDERED.length > PAGE && (
        <p className="mt-10 text-center text-sm font-medium text-surface-500 dark:text-surface-400">
          You&apos;ve seen every tool
        </p>
      )}
    </section>
  );
}
