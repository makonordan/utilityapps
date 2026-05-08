import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import type { RankedTool } from "@/lib/trending";

export function TrendingTools({ tools }: { tools: RankedTool[] }) {
  if (tools.length === 0) return null;

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

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {tools.map((tool) => (
          <div key={tool.id} className="snap-start sm:snap-align-none">
            <ToolCard tool={tool} rank={tool.rank} variant="trending" />
          </div>
        ))}
      </div>
    </section>
  );
}
