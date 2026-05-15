"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { fadeInUp, staggerGrid } from "@/lib/animations";
import { TOOLS, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", category: null },
  { label: "Text", category: "Text Tools" },
  { label: "Image", category: "Image Tools" },
  { label: "Video", category: "Video Tools" },
  { label: "Audio", category: "Audio Tools" },
  { label: "Design", category: "Design Tools" },
  { label: "Calculator", category: "Calculator Tools" },
  { label: "Finance", category: "Finance Tools" },
  { label: "Health", category: "Health Tools" },
  { label: "Developer", category: "Developer Tools" },
  { label: "SEO", category: "SEO Tools" },
  { label: "Productivity", category: "Productivity Tools" },
];

export function AllTools() {
  const [filter, setFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const tools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t: Tool) => {
      if (filter && t.category !== filter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [filter, query]);

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
            onChange={(e) => setQuery(e.target.value)}
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
              onClick={() => setFilter(f.category)}
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

      {tools.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            Icon={Search}
            title="No tools match those filters"
            description="Try clearing the search or pick a different category — there are 25 tools live and 200+ planned."
            actions={[
              { label: "Clear filters", href: "/tools" },
              { label: "Suggest a tool", href: "/contact", variant: "secondary" },
            ]}
          />
        </div>
      ) : (
        <motion.ul
          key={`${filter ?? "all"}-${query}`}
          variants={staggerGrid}
          initial="hidden"
          animate="visible"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => (
            <motion.li key={tool.id} variants={fadeInUp}>
              <ToolCard tool={tool} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}
