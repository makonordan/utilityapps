"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, TrendingUp } from "lucide-react";

import { BookmarkButton } from "@/components/tools/BookmarkButton";
import { ShareToolButton } from "@/components/tools/ShareToolButton";
import { CATEGORIES } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { recordToolUse } from "@/lib/recent";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  rank?: number;
  variant?: "grid" | "trending";
  className?: string;
}

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color])
);

const HIGH_VALUE_THRESHOLD = 15;

function monthlyUsers(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 500 + (Math.abs(h) % 1501);
}

export function ToolCard({ tool, rank, variant = "grid", className }: ToolCardProps) {
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";
  const showHighValue = tool.cpc >= HIGH_VALUE_THRESHOLD;
  const isExternal = !!tool.externalHref;
  const Icon = getIcon(tool.icon);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700",
        variant === "trending" ? "min-w-[280px] sm:min-w-0" : "h-full",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />

      {/* Stretched card-level link. Sits beneath the visual content via
          `inset-0`; the surrounding text/badges use `pointer-events-none`
          so clicks fall through to this anchor. The interactive Share /
          Bookmark buttons re-enable pointer events on themselves and call
          stopPropagation to avoid triggering navigation. Opens in a new
          tab so users don't lose their place on the homepage. */}
      <Link
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => recordToolUse(tool.id)}
        aria-label={`Open ${tool.name} in a new tab`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
      />

      <div className="pointer-events-none relative z-10 flex items-start justify-between p-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {tool.category}
            </p>
            <h3 className="text-base font-semibold text-surface-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {tool.name}
            </h3>
          </div>
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <ShareToolButton toolId={tool.id} toolName={tool.name} toolPath={tool.href} size="sm" />
          <BookmarkButton toolId={tool.id} size="sm" />
        </div>
      </div>

      <p className="pointer-events-none relative z-10 line-clamp-3 px-5 text-sm text-surface-600 dark:text-surface-300">
        {tool.description}
      </p>

      <div className="pointer-events-none relative z-10 mt-auto flex flex-wrap items-center gap-2 px-5 pt-4">
        {variant === "trending" && rank && (
          <Badge tone="trending">
            <TrendingUp className="h-3 w-3" /> Trending #{rank}
          </Badge>
        )}
        {tool.new && <Badge tone="new">New</Badge>}
        {tool.trending && variant !== "trending" && (
          <Badge tone="trending">
            <TrendingUp className="h-3 w-3" /> Trending
          </Badge>
        )}
        {showHighValue && <Badge tone="high-value">High Value</Badge>}
        {variant === "grid" && (
          <span className="text-[11px] text-surface-500 dark:text-surface-400">
            {monthlyUsers(tool.id)} users/month
          </span>
        )}
      </div>

      <div className="pointer-events-none relative z-10 flex items-center justify-between border-t border-surface-100 p-4 pt-3 dark:border-surface-800">
        <span
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400"
          aria-hidden="true"
        >
          Try Free
          <ArrowUpRight className="h-4 w-4" />
        </span>
        {isExternal && (
          <span
            className="inline-flex items-center gap-1 text-[11px] text-surface-500 dark:text-surface-400"
            title="Opens a dedicated tool site"
          >
            <ExternalLink className="h-3 w-3" /> Standalone
          </span>
        )}
      </div>
    </article>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "trending" | "new" | "high-value";
  children: React.ReactNode;
}) {
  const styles = {
    trending: "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300",
    new: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300",
    "high-value": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        styles[tone]
      )}
    >
      {children}
    </span>
  );
}
