import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AppEventType,
  BookmarkRow,
  DbResult,
  fail,
  ok,
  supabase,
  StudioBudget,
  StudioCompanySize,
  StudioContactPref,
  StudioInquiryRow,
  StudioTimeline,
  SupporterPublicRow,
  ToolRatingRow,
  ToolUsageRow,
} from "../supabase";
// NOTE: do NOT `import { getSupabaseAdmin } from "../supabaseAdmin"` here.
// supabaseAdmin is `server-only`; queries.ts is transitively imported by
// client components (BookmarkButton → useBookmarks → queries.ts) so a
// top-level import would break the client bundle. Server callers that need
// service-role access pass the admin client in as `client` instead — see
// `subscribeNewsletter` below.

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

/**
 * Record a successful completion event — fired by tools after they
 * actually deliver their primary output. Used to compute completion
 * rate per tool on the admin dashboard.
 */
export async function trackToolCompletion(
  toolId: string,
  userSession: string | null = null
): Promise<DbResult<true>> {
  try {
    // Insert-only; no .select() needed.
    const { error } = await supabase
      .from("tool_completions")
      .insert({ tool_id: toolId, user_session: userSession });
    if (error) return fail(error);
    return ok(true);
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
  source: string | null = null,
  /**
   * Optional Supabase client. Server callers should pass the service-role
   * client (`getSupabaseAdmin()`) so the insert bypasses RLS — the anon
   * client has no INSERT policy on newsletter_subscribers. Defaults to the
   * anon client for compatibility, but in that mode the insert only works
   * if the `newsletter_insert` RLS policy from schema.sql is applied.
   */
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return fail("Invalid email address");
    }
    // Insert-only with ON CONFLICT DO NOTHING (ignoreDuplicates: true). We
    // intentionally don't chain `.select()` so the response body never
    // contains other subscribers' emails (PII). A returning subscriber is
    // a no-op, not an error.
    const { error } = await client
      .from("newsletter_subscribers")
      .upsert(
        { email: normalized, source, confirmed: false },
        { onConflict: "email", ignoreDuplicates: true }
      );
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

// --- api waitlist ----------------------------------------------------------

/**
 * Add an email to the API access waitlist. Same shape as
 * subscribeNewsletter — anon INSERT only, dedupes via unique index.
 *
 * Server callers should pass the service-role client so the insert
 * bypasses RLS; falls back to the anon client which requires the
 * `api_waitlist_insert` policy from schema.sql.
 */
export async function addToApiWaitlist(
  email: string,
  useCase: string | null = null,
  source: string | null = null,
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return fail("Invalid email address");
    }
    const { error } = await client
      .from("api_waitlist")
      .upsert(
        {
          email: normalized,
          use_case: useCase?.trim() || null,
          source: source?.trim() || null,
        },
        { onConflict: "email", ignoreDuplicates: true }
      );
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Add an email to the Chrome extension waitlist. Mirror of
 * addToApiWaitlist but against extension_waitlist and without a
 * use-case field (the banner only captures email).
 */
export async function addToExtensionWaitlist(
  email: string,
  source: string | null = null,
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return fail("Invalid email address");
    }
    const { error } = await client
      .from("extension_waitlist")
      .upsert(
        { email: normalized, source: source?.trim() || null },
        { onConflict: "email", ignoreDuplicates: true }
      );
    if (error) return fail(error);
    return ok(true);
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

// --- apps directory analytics -----------------------------------------------
// Anonymous, privacy-respecting tracking for the /apps software directory.
// Anon-INSERT only — no SELECT policy exists on any of these tables (see
// schema.sql section 19), so reads always go through the service-role
// client in lib/apps/analyticsAdmin.ts, never these functions.

export interface AppSearchInput {
  query: string;
  resultsCount: number;
  category?: string | null;
  clickedAppId?: string | null;
}

export async function logAppSearch(
  input: AppSearchInput,
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const cleaned = input.query.trim();
    if (!cleaned) return ok(true);
    const { error } = await client.from("app_searches").insert({
      query: cleaned,
      results_count: input.resultsCount,
      category: input.category ?? null,
      clicked_app_id: input.clickedAppId ?? null,
    });
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export interface AppEventInput {
  appId: string;
  eventType: AppEventType;
  metadata?: Record<string, unknown>;
  deviceType?: string | null;
  country?: string | null;
}

export async function logAppEvent(
  input: AppEventInput,
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const { error } = await client.from("app_events").insert({
      app_id: input.appId,
      event_type: input.eventType,
      metadata: input.metadata ?? {},
      device_type: input.deviceType ?? null,
      country: input.country ?? null,
    });
    if (error) return fail(error);
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export interface AppSuggestionInput {
  suggestedName: string;
  suggestedUrl?: string | null;
  reason?: string | null;
  email?: string | null;
}

export async function logAppSuggestion(
  input: AppSuggestionInput,
  client: SupabaseClient = supabase
): Promise<DbResult<true>> {
  try {
    const name = input.suggestedName.trim();
    if (!name) return fail("suggestedName is required");
    const { error } = await client.from("app_suggestions").insert({
      suggested_name: name,
      suggested_url: input.suggestedUrl?.trim() || null,
      reason: input.reason?.trim() || null,
      email: input.email?.trim().toLowerCase() || null,
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

// --- studio_inquiries ------------------------------------------------------
// Discovery-call form submissions from /studio. Anon-INSERT only; reads go
// through the service-role admin client elsewhere.

export interface StudioInquiryInput {
  name: string;
  email: string;
  company: string;
  company_size: StudioCompanySize;
  industry: string;
  project_type: string;
  project_description: string;
  timeline: StudioTimeline;
  budget_range: StudioBudget;
  referral_source?: string | null;
  preferred_contact: StudioContactPref;
  whatsapp_number?: string | null;
}

export async function addStudioInquiry(
  input: StudioInquiryInput,
  client: SupabaseClient = supabase
): Promise<DbResult<StudioInquiryRow>> {
  try {
    const normalized = {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      company: input.company.trim(),
      company_size: input.company_size,
      industry: input.industry.trim(),
      project_type: input.project_type.trim(),
      project_description: input.project_description.trim(),
      timeline: input.timeline,
      budget_range: input.budget_range,
      referral_source: input.referral_source?.trim() || null,
      preferred_contact: input.preferred_contact,
      whatsapp_number: input.whatsapp_number?.trim() || null,
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
      return fail("Invalid email address");
    }
    if (normalized.project_description.length < 20) {
      return fail("Project description is too short");
    }
    if (normalized.project_description.length > 2000) {
      return fail("Project description is too long");
    }
    const { data, error } = await client
      .from("studio_inquiries")
      .insert(normalized)
      .select("*")
      .single();
    if (error || !data) return fail(error ?? "insert failed");
    return ok(data as StudioInquiryRow);
  } catch (err) {
    return fail(err);
  }
}

// --- supporters_public -----------------------------------------------------
// Anon-safe projection of the supporters table for the /support wall.
// Reads only display_name, tier, joined_at — never emails, amounts, or
// subscription IDs. Backed by the `supporters_public` Postgres view whose
// SELECT grant is explicit (the underlying table denies anon).

export async function getPublicSupporters(
  limit: number = 100
): Promise<DbResult<SupporterPublicRow[]>> {
  try {
    const { data, error } = await supabase
      .from("supporters_public")
      .select("display_name, tier, joined_at")
      .order("joined_at", { ascending: false })
      .limit(limit);
    if (error) return fail(error);
    return ok((data ?? []) as SupporterPublicRow[]);
  } catch (err) {
    return fail(err);
  }
}
