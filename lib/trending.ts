import { TOOLS, type Tool } from "./tools";

export interface RankedTool extends Tool {
  rank: number;
  usageCount: number;
}

export async function getRankedTrendingTools(limit: number = 8): Promise<RankedTool[]> {
  // Try Supabase-backed counts first; fall back to the static "trending" flag
  // and monthlySearches when env/db is unavailable. Either way, the homepage
  // renders.
  try {
    const queries = await import("./db/queries").catch(() => null);
    if (queries) {
      const res = await queries.getTrendingTools(limit);
      if (res.data && res.data.length > 0) {
        const ranked: RankedTool[] = [];
        for (const row of res.data) {
          const tool = TOOLS.find((t) => t.id === row.toolId);
          if (!tool) continue;
          ranked.push({ ...tool, rank: ranked.length + 1, usageCount: row.usageCount });
          if (ranked.length >= limit) break;
        }
        if (ranked.length > 0) return ranked;
      }
    }
  } catch {
    // fall through to static fallback
  }

  return [...TOOLS]
    .sort((a, b) => {
      // featured/trending first, then by monthly searches
      const score = (t: Tool) =>
        (t.featured ? 2 : 0) + (t.trending ? 1 : 0) + t.monthlySearches / 1_000_000;
      return score(b) - score(a);
    })
    .slice(0, limit)
    .map((tool, i) => ({ ...tool, rank: i + 1, usageCount: 0 }));
}
