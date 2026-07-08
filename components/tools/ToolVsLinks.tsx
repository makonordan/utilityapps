import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCompetitorsForTool } from "@/lib/competitorComparisons";
import { cn } from "@/lib/utils";

/**
 * Strip of internal links from a tool page to its /vs/ comparison pages.
 *
 * Renders nothing when the tool has no mapped competitors — so we never
 * dilute UX with an empty section. When present, each link is dofollow
 * (default Next.js Link behavior) — these are first-party pages whose
 * link equity we want to flow.
 *
 * Designed to slot between the FAQ and "Related tools" sections in each
 * tool shell. Visual weight is intentionally light: a small heading and
 * pill-shaped links, not a hero strip.
 */
export function ToolVsLinks({
  toolId,
  className,
}: {
  toolId: string;
  className?: string;
}) {
  const competitors = getCompetitorsForTool(toolId);
  if (competitors.length === 0) return null;

  return (
    <section
      aria-labelledby={`vs-links-${toolId}`}
      className={cn("mt-12", className)}
    >
      <h2
        id={`vs-links-${toolId}`}
        className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400"
      >
        Compared to alternatives
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {competitors.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/vs/${toolId}-vs-${c.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
            >
              vs {c.name}
              <ArrowRight
                className="h-3 w-3 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
