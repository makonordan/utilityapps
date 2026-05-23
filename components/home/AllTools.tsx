"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { fadeInUp, staggerGrid } from "@/lib/animations";
import { TOOLS, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", category: null },
  { label: "PDF", category: "PDF Tools" },
  { label: "Image", category: "Image Tools" },
  { label: "Video", category: "Video Tools" },
  { label: "Audio", category: "Audio Tools" },
  { label: "Design", category: "Design Tools" },
  { label: "Student", category: "Student Tools" },
  { label: "Calculator", category: "Calculator Tools" },
  { label: "Finance", category: "Finance Tools" },
  { label: "Health", category: "Health Tools" },
  { label: "Sleep", category: "Sleep Tools" },
  { label: "Travel", category: "Travel Tools" },
  { label: "Productivity", category: "Productivity Tools" },
  { label: "Legal", category: "Legal Tools" },
  { label: "Developer", category: "Developer Tools" },
  { label: "SEO", category: "SEO Tools" },
  { label: "Text", category: "Text Tools" },
];

const PAGE = 8;

// The 8 headline categories drive the first page, one tool each. The remaining
// categories are appended so "Load more" eventually surfaces every tool.
const BROWSE_CATEGORY_ORDER = [
  "PDF Tools",
  "Image Tools",
  "Video Tools",
  "Audio Tools",
  "Design Tools",
  "Student Tools",
  "Calculator Tools",
  "Finance Tools",
  "Health Tools",
  "Sleep Tools",
  "Travel Tools",
  "Productivity Tools",
  "Legal Tools",
  "Developer Tools",
  "SEO Tools",
  "Text Tools",
];

/** Within a category: featured first, then trending, then highest search volume. */
function browsePriority(a: Tool, b: Tool): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.trending !== b.trending) return a.trending ? -1 : 1;
  return b.monthlySearches - a.monthlySearches;
}

/**
 * Round-robin through categories, taking the next-best tool from each in turn,
 * so the first N results are one-per-category and every tool eventually appears.
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
  // Categories not in `order` still get appended so nothing is ever dropped.
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

export function AllTools() {
  const [filter, setFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE);

  const searching = query.trim().length > 0;
  // Pagination applies ONLY to the unfiltered, unsearched "All" view.
  const paginated = !filter && !searching;

  const fullList = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = TOOLS.filter((t: Tool) => {
      if (filter && t.category !== filter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
    // Diversified one-per-category ordering only for the plain "All" view.
    if (!filter && !q) return diversify(matched, BROWSE_CATEGORY_ORDER, browsePriority);
    return matched;
  }, [filter, query]);

  const visible = paginated ? fullList.slice(0, visibleCount) : fullList;
  const allShown = visible.length >= fullList.length;

  // Changing the filter or search resets pagination back to the first page.
  const changeFilter = (category: string | null) => {
    setFilter(category);
    setVisibleCount(PAGE);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE);
  };

  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Browse 200+ Free Tools
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Filter by category, search by keyword, or just scroll — every tool is free, no signup.
          </p>
        </div>
        <label className="relative flex w-full max-w-xs items-center sm:w-72">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-surface-400" />
          <span className="sr-only">Search tools</span>
          <input
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-xl border border-surface-200 bg-white py-2 pl-9 pr-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
        </label>
      </header>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => {
          const active = filter === f.category;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => changeFilter(f.category)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                active
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {fullList.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            Icon={Search}
            title="No tools match those filters"
            description="Try clearing the search or pick a different category — there are 70 tools live and 200+ planned."
            actions={[
              { label: "Clear filters", href: "/tools" },
              { label: "Suggest a tool", href: "/contact", variant: "secondary" },
            ]}
          />
        </div>
      ) : (
        <>
          <motion.ul
            key={`${filter ?? "all"}-${query}`}
            variants={staggerGrid}
            initial="hidden"
            animate="visible"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((tool) => (
              <motion.li key={tool.id} variants={fadeInUp}>
                <ToolCard tool={tool} />
              </motion.li>
            ))}
          </motion.ul>

          {/* Load more — only in the diversified "All" view. */}
          {paginated && !allShown && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              >
                Load More Tools
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
          {paginated && allShown && fullList.length > PAGE && (
            <p className="mt-10 text-center text-sm font-medium text-surface-500 dark:text-surface-400">
              You&apos;ve seen all 200+ tools
            </p>
          )}
        </>
      )}
    </section>
  );
}
