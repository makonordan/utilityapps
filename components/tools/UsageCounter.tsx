"use client";

import { useEffect, useState } from "react";
import { Star, Users } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";

interface ToolStatsResponse {
  today: number;
  last7Days: number;
  total: number;
  averageRating: number | null;
  ratingCount: number;
}

/**
 * Lightweight social-proof badge for the tool detail page.
 *
 * Fetches /api/tools/[slug]/stats and shows "X used today" plus an optional
 * star rating. Hidden if the count is below the threshold so we don't show
 * embarrassing low numbers — the badge only appears once it's meaningful.
 */
export function UsageCounter({
  toolId,
  threshold = 3,
  className,
}: {
  toolId: string;
  threshold?: number;
  className?: string;
}) {
  const [stats, setStats] = useState<ToolStatsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tools/${toolId}/stats`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ToolStatsResponse;
        if (!cancelled) setStats(data);
      } catch {
        // silent — social proof is decorative
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toolId]);

  if (!stats) return null;
  if (stats.today < threshold) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-xs", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50/60 px-2.5 py-1 font-semibold text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-300">
        <Users className="h-3 w-3" aria-hidden="true" />
        {formatNumber(stats.today)} used this today
      </span>
      {stats.averageRating !== null && stats.ratingCount > 0 && (
        <span className="inline-flex items-center gap-1 text-surface-600 dark:text-surface-400">
          <Star className="h-3 w-3 fill-warning-400 text-warning-400" aria-hidden="true" />
          {stats.averageRating.toFixed(1)}
          <span className="text-surface-400">({formatNumber(stats.ratingCount)})</span>
        </span>
      )}
    </div>
  );
}
