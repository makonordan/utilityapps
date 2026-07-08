"use client";

import { ExternalLink, ShieldCheck, Smartphone, Zap } from "lucide-react";

import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface Props {
  tool: Tool;
  className?: string;
}

const BADGES = [
  { Icon: ShieldCheck, label: "100% Free" },
  { Icon: Zap, label: "No Signup" },
  { Icon: Smartphone, label: "Mobile Friendly" },
] as const;

/**
 * Call-to-action card for tools that haven't been migrated to in-house React
 * components yet. Renders a clean "Open Tool" button that navigates to the
 * external/standalone tool URL in a new tab — no iframe.
 *
 * Tools with their own page file under app/tools/<slug>/page.tsx (e.g.
 * compress-image, resize-image) bypass this entirely and render their
 * components directly, with no iframe and no "open externally" hop.
 */
export function ToolEmbed({ tool, className }: Props) {
  const href = tool.externalHref ?? tool.embedUrl;
  if (!href) return null;

  return (
    <section
      aria-label={`${tool.name} tool`}
      className={cn(
        "rounded-3xl border border-surface-200 bg-gradient-to-br from-white to-surface-50 p-8 shadow-card sm:p-10 dark:border-surface-800 dark:from-surface-900 dark:to-surface-950",
        className
      )}
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Standalone tool
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Open {tool.name}
          </h2>
          <p className="max-w-2xl text-sm text-surface-600 sm:text-base dark:text-surface-300">
            {tool.description}
          </p>
          <ul className="flex flex-wrap gap-2 pt-1">
            {BADGES.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-surface-700 ring-1 ring-surface-200 dark:bg-surface-800 dark:text-surface-200 dark:ring-surface-700"
              >
                <b.Icon className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                {b.label}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600 sm:text-base"
        >
          Open {tool.name}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-6 border-t border-surface-200 pt-4 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
        Opens in a new tab. The full tool — calculations, history, and exports — runs there.
      </p>
    </section>
  );
}
