import { unstable_cache } from "next/cache";

/**
 * Shared aggregate-rating helper for tool pages.
 *
 * Wraps the raw `getAverageRating` DB query in `unstable_cache` so each
 * tool page can fetch its own rating without hitting Supabase on every
 * request. The cache is invalidated hourly — fresh enough for SEO purposes
 * (Google re-crawls weekly), short enough that new ratings show up the
 * same day.
 *
 * Returns `null` when:
 *   - the DB call fails (we never break a tool page over a missing rating)
 *   - the tool has fewer than MIN_RATINGS_FOR_BADGE ratings
 *
 * The threshold serves three purposes:
 *   1. Avoids showing a misleading "1 star (1 rating)" badge
 *   2. Stays above Google's expected sample-size for rich snippets
 *   3. Prevents a single drive-by 1-star vote from defining a tool
 */

/** Google won't reliably show ★ rich snippets below this — and we don't
 *  want to either, since the noise/signal ratio is bad. Tune as the
 *  dataset grows. */
const MIN_RATINGS_FOR_BADGE = 3;

export interface ToolRatingSummary {
  averageRating: number; // 1.0–5.0, two decimals
  ratingCount: number;
}

const fetchRating = unstable_cache(
  async (toolId: string): Promise<ToolRatingSummary | null> => {
    // Lazy-import so static prerendering of tool pages doesn't eagerly pull
    // in the Supabase client (which throws at module-eval when its env vars
    // are missing — e.g. during local builds without `.env.local` keys).
    const { getAverageRating } = await import("./db/queries");
    const res = await getAverageRating(toolId);
    if (res.error || !res.data) return null;
    const { average, count } = res.data;
    if (count < MIN_RATINGS_FOR_BADGE) return null;
    return { averageRating: average, ratingCount: count };
  },
  ["tool-aggregate-rating"],
  {
    revalidate: 60 * 60, // 1 hour
    tags: ["tool-rating"],
  }
);

/** Public entry — call from any tool shell to fetch its cached rating. */
export async function getCachedToolRating(
  toolId: string
): Promise<ToolRatingSummary | null> {
  if (!toolId) return null;
  try {
    return await fetchRating(toolId);
  } catch {
    // Never break a tool page over a rating fetch error.
    return null;
  }
}

/**
 * Build the schema.org AggregateRating fragment to embed inside a
 * SoftwareApplication object. Caller should only include this when
 * `rating` is non-null.
 */
export function toAggregateRatingSchema(rating: ToolRatingSummary) {
  return {
    "@type": "AggregateRating",
    ratingValue: rating.averageRating,
    ratingCount: rating.ratingCount,
    bestRating: 5,
    worstRating: 1,
  };
}
