import { NextRequest } from "next/server";

import { TOOLS_BY_ID } from "@/lib/tools";

export const runtime = "nodejs";
export const revalidate = 60;

interface ToolStatsResponse {
  toolId: string;
  today: number;
  last7Days: number;
  last30Days: number;
  total: number;
  averageRating: number | null;
  ratingCount: number;
  source: "supabase" | "fallback";
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!TOOLS_BY_ID[slug]) {
    return Response.json({ error: "Unknown tool" }, { status: 404 });
  }

  const fallback: ToolStatsResponse = {
    toolId: slug,
    today: 0,
    last7Days: 0,
    last30Days: 0,
    total: 0,
    averageRating: null,
    ratingCount: 0,
    source: "fallback",
  };

  try {
    const sb = await import("@/lib/supabase").catch(() => null);
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!sb || !queries) {
      return jsonResponse(fallback);
    }

    const since24h = new Date(Date.now() - ONE_DAY_MS).toISOString();

    const [usage, todayRes, ratingRes] = await Promise.all([
      queries.getToolUsageStats(slug),
      sb.supabase
        .from("tool_usage")
        .select("id", { count: "exact", head: true })
        .eq("tool_id", slug)
        .gte("created_at", since24h),
      queries.getAverageRating(slug),
    ]);

    const body: ToolStatsResponse = {
      toolId: slug,
      today: todayRes.count ?? 0,
      last7Days: usage.data?.last7Days ?? 0,
      last30Days: usage.data?.last30Days ?? 0,
      total: usage.data?.total ?? 0,
      averageRating: ratingRes.data && ratingRes.data.count > 0 ? ratingRes.data.average : null,
      ratingCount: ratingRes.data?.count ?? 0,
      source: "supabase",
    };

    return jsonResponse(body);
  } catch (err) {
    console.error("[tools/stats]", err);
    return jsonResponse(fallback);
  }
}

function jsonResponse(body: ToolStatsResponse): Response {
  return Response.json(body, {
    headers: {
      // Short cache so social proof stays roughly fresh without hammering Supabase.
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
