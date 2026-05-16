import {
  BookmarkRow,
  DbResult,
  NewsletterSubscriberRow,
  fail,
  ok,
  supabase,
  ToolRatingRow,
  ToolUsageRow,
} from "../supabase";

// --- tool_usage ------------------------------------------------------------

export async function trackToolUsage(
  toolId: string,
  country: string | null = null,
  device: string | null = null,
  userSession: string | null = null
): Promise<DbResult<ToolUsageRow>> {
  try {
    const { data, error } = await supabase
      .from("tool_usage")
      .insert({ tool_id: toolId, country, device, user_session: userSession })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export interface ToolUsageStats {
  toolId: string;
  total: number;
  last7Days: number;
  last30Days: number;
}

export async function getToolUsageStats(toolId: string): Promise<DbResult<ToolUsageStats>> {
  try {
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [totalRes, recent30Res, recent7Res] = await Promise.all([
      supabase
        .from("tool_usage")
        .select("id", { count: "exact", head: true })
        .eq("tool_id", toolId),
      supabase
        .from("tool_usage")
        .select("id", { count: "exact", head: true })
        .eq("tool_id", toolId)
        .gte("created_at", since30),
      supabase
        .from("tool_usage")
        .select("id", { count: "exact", head: true })
        .eq("tool_id", toolId)
        .gte("created_at", since7),
    ]);

    if (totalRes.error) return fail(totalRes.error);
    if (recent30Res.error) return fail(recent30Res.error);
    if (recent7Res.error) return fail(recent7Res.error);

    return ok({
      toolId,
      total: totalRes.count ?? 0,
      last30Days: recent30Res.count ?? 0,
      last7Days: recent7Res.count ?? 0,
    });
  } catch (err) {
    return fail(err);
  }
}

export interface TrendingTool {
  toolId: string;
  usageCount: number;
}

export async function getTrendingTools(limit: number = 10): Promise<DbResult<TrendingTool[]>> {
  try {
    const { data, error } = await supabase.rpc("get_trending_tools", {
      window_days: 7,
      max_results: limit,
    });
    if (error) return fail(error);
    return ok(
      ((data ?? []) as { tool_id: string; usage_count: number | string }[]).map((row) => ({
        toolId: row.tool_id,
        usageCount: Number(row.usage_count),
      }))
    );
  } catch (err) {
    return fail(err);
  }
}

// --- bookmarks -------------------------------------------------------------

export async function addBookmark(
  userId: string,
  toolId: string
): Promise<DbResult<BookmarkRow>> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .upsert({ user_id: userId, tool_id: toolId }, { onConflict: "user_id,tool_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function removeBookmark(userId: string, toolId: string): Promise<DbResult<true>> {
  try {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("tool_id", toolId);
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getUserBookmarks(userId: string): Promise<DbResult<BookmarkRow[]>> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return fail(error);
    return ok(data ?? []);
  } catch (err) {
    return fail(err);
  }
}

// --- newsletter ------------------------------------------------------------

export async function subscribeNewsletter(
  email: string,
  source: string | null = null
): Promise<DbResult<NewsletterSubscriberRow>> {
  try {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return fail("Invalid email address");
    }
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: normalized, source, confirmed: false },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

// --- contact ---------------------------------------------------------------

export async function saveContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<DbResult<true>> {
  try {
    // Insert only — no .select() — so the table needs just an INSERT policy
    // for the anon key. Reads happen server-side with the service-role key.
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

// --- ratings ---------------------------------------------------------------

export async function rateTools(
  toolId: string,
  rating: number,
  userSession: string
): Promise<DbResult<ToolRatingRow>> {
  try {
    const clamped = Math.round(rating);
    if (clamped < 1 || clamped > 5) return fail("Rating must be between 1 and 5");
    const { data, error } = await supabase
      .from("tool_ratings")
      .upsert(
        { tool_id: toolId, rating: clamped, user_session: userSession },
        { onConflict: "tool_id,user_session" }
      )
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export interface AverageRating {
  toolId: string;
  average: number;
  count: number;
}

export async function getAverageRating(toolId: string): Promise<DbResult<AverageRating>> {
  try {
    const { data, error } = await supabase
      .from("tool_ratings")
      .select("rating")
      .eq("tool_id", toolId);
    if (error) return fail(error);
    const ratings = data ?? [];
    if (ratings.length === 0) return ok({ toolId, average: 0, count: 0 });
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return ok({
      toolId,
      average: Number((sum / ratings.length).toFixed(2)),
      count: ratings.length,
    });
  } catch (err) {
    return fail(err);
  }
}

// --- search ----------------------------------------------------------------

export async function trackSearch(
  query: string,
  resultsCount: number,
  clickedTool: string | null = null
): Promise<DbResult<true>> {
  try {
    const cleaned = query.trim();
    if (!cleaned) return ok(true);
    const { error } = await supabase.from("search_queries").insert({
      query: cleaned,
      results_count: resultsCount,
      clicked_tool: clickedTool,
    });
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export interface TrendingSearch {
  query: string;
  searchCount: number;
}

export async function getTrendingSearches(
  limit: number = 10
): Promise<DbResult<TrendingSearch[]>> {
  try {
    const { data, error } = await supabase.rpc("get_trending_searches", {
      window_days: 7,
      max_results: limit,
    });
    if (error) return fail(error);
    return ok(
      ((data ?? []) as { query: string; search_count: number | string }[]).map((row) => ({
        query: row.query,
        searchCount: Number(row.search_count),
      }))
    );
  } catch (err) {
    return fail(err);
  }
}
