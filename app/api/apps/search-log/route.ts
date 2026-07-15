import { NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const SearchLogSchema = z.object({
  query: z.string().trim().min(1).max(200),
  resultsCount: z.number().int().min(0).max(100_000),
  category: z.string().trim().max(64).optional().nullable(),
  clickedAppId: z.string().trim().max(128).optional().nullable(),
});

/**
 * Logs a *completed* search — the client debounces so only settled queries
 * land here, not every keystroke. Zero-result searches are the highest-value
 * signal in this whole feature (demand we're not serving yet), so
 * `resultsCount: 0` is preserved as-is, never filtered out.
 */
export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SearchLogSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json({ success: false, error: issue?.message ?? "Invalid body" }, { status: 400 });
  }

  const { query, resultsCount, category, clickedAppId } = parsed.data;

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) {
      return Response.json({ success: true, persisted: false });
    }
    const res = await queries.logAppSearch({
      query,
      resultsCount,
      category: category ?? null,
      clickedAppId: clickedAppId ?? null,
    });
    if (res.error) {
      return Response.json({ success: false, error: res.error }, { status: 500 });
    }
    return Response.json({ success: true, persisted: true });
  } catch (err) {
    console.error("[apps/search-log]", err);
    return Response.json({ success: false, error: "Failed to log search" }, { status: 500 });
  }
}
