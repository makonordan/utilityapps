import { TOOLS_BY_ID, type Tool } from "@/lib/tools";

export const runtime = "nodejs";
export const revalidate = 3600;

const WINDOW_DAYS = 7;
const LIMIT = 10;

interface TrendingResponseItem extends Tool {
  rank: number;
  usageCount: number;
}

interface TrendingResponse {
  tools: TrendingResponseItem[];
  windowDays: number;
  limit: number;
  generatedAt: string;
  source: "supabase" | "fallback";
}

export async function GET() {
  let items: TrendingResponseItem[] = [];
  let source: TrendingResponse["source"] = "fallback";

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (queries) {
      const res = await queries.getTrendingTools(LIMIT);
      if (res.data && res.data.length > 0) {
        for (const row of res.data) {
          const tool = TOOLS_BY_ID[row.toolId];
          if (!tool) continue;
          items.push({ ...tool, rank: items.length + 1, usageCount: row.usageCount });
          if (items.length >= LIMIT) break;
        }
        if (items.length > 0) source = "supabase";
      }
    }
  } catch (err) {
    console.error("[tools/trending]", err);
  }

  if (items.length === 0) {
    // Fallback: derive from static tool metadata so the endpoint always succeeds.
    const ranked = Object.values(TOOLS_BY_ID)
      .slice()
      .sort((a, b) => {
        const score = (t: Tool) =>
          (t.featured ? 2 : 0) + (t.trending ? 1 : 0) + t.monthlySearches / 1_000_000;
        return score(b) - score(a);
      })
      .slice(0, LIMIT);
    items = ranked.map((tool, i) => ({ ...tool, rank: i + 1, usageCount: 0 }));
  }

  const body: TrendingResponse = {
    tools: items,
    windowDays: WINDOW_DAYS,
    limit: LIMIT,
    generatedAt: new Date().toISOString(),
    source,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
