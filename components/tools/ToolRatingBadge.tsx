import { Star } from "lucide-react";

import type { ToolRatingSummary } from "@/lib/toolRating";
import { cn } from "@/lib/utils";

/**
 * Small visible rating badge: "★ 4.3 (12)". Google requires aggregate
 * ratings declared in JSON-LD to also be visible to users on the page —
 * structured data alone isn't enough for the rich snippet stars to show
 * in SERPs.
 *
 * Render nothing when there's no rating (caller passes null after the
 * cache helper applies its minimum-sample threshold).
 *
 * Sized to slot into a tool-page header without dominating the visual
 * hierarchy. Different shells can override `className` if needed.
 */
export function ToolRatingBadge({
  rating,
  className,
}: {
  rating: ToolRatingSummary | null;
  className?: string;
}) {
  if (!rating) return null;
  const { averageRating, ratingCount } = rating;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
        className
      )}
      aria-label={`Rated ${averageRating.toFixed(1)} out of 5 from ${ratingCount} ${ratingCount === 1 ? "user" : "users"}`}
    >
      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
      {averageRating.toFixed(1)}
      <span className="font-normal text-amber-700/70 dark:text-amber-300/70">
        ({ratingCount})
      </span>
    </span>
  );
}
