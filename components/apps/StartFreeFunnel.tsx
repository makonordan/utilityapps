import Link from "next/link";

import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

/** "Try free first" funnel box — links out to our own free tools instead of
 *  a paid listing. Renders nothing if there's nothing to link to. */
export function StartFreeFunnel({
  tools,
  introText,
  className,
}: {
  tools: Tool[];
  introText: string;
  className?: string;
}) {
  if (tools.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-700/40 dark:bg-primary-500/10",
        className
      )}
    >
      <h2 className="text-lg font-bold text-surface-900 dark:text-white">Try free first</h2>
      <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{introText}</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {tools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={tool.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-semibold text-surface-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:hover:border-primary-700 dark:hover:text-primary-300"
            >
              Free {tool.name} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
