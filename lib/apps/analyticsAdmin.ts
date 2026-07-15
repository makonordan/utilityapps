import "server-only";

import { getAppById } from "./index";

/**
 * Admin-only aggregation over the Apps directory's anonymous analytics
 * tables (app_searches, app_events, app_suggestions). None of these tables
 * have a public SELECT policy (see lib/db/schema.sql section 19), so every
 * read here goes through the service-role client — this module must never
 * be imported into client code.
 */

export interface AppSearchSummary {
  query: string;
  count: number;
}

export interface AppZeroResultSearch {
  query: string;
  count: number;
  lastSeen: string;
}

export interface AppListingStat {
  appId: string;
  appName: string;
  count: number;
}

export interface AppHelpfulStat {
  appId: string;
  appName: string;
  yes: number;
  no: number;
  /** yes / (yes + no), or null when there are zero votes. */
  ratio: number | null;
}

export interface AppFilterStat {
  filter: string;
  count: number;
}

export interface AppSuggestionEntry {
  id: number;
  suggestedName: string;
  suggestedUrl: string | null;
  reason: string | null;
  email: string | null;
  createdAt: string;
}

export interface AppsAnalyticsSummary {
  /** Top 20 search queries, last 30 days. */
  topSearches: AppSearchSummary[];
  /** Zero-result searches, last 30 days — demand we're not serving. */
  zeroResultSearches: AppZeroResultSearch[];
  /** Top 20 most-viewed listings, last 30 days. */
  mostViewed: AppListingStat[];
  /** Top 20 most-clicked affiliate links, last 30 days — real purchase intent. */
  mostClicked: AppListingStat[];
  /** Helpful yes/no ratio per listing, last 30 days. */
  helpful: AppHelpfulStat[];
  /** Top 20 most-used filters, last 30 days. */
  topFilters: AppFilterStat[];
  /** Most recent 50 suggestions, all time. */
  suggestions: AppSuggestionEntry[];
  /** True when SUPABASE_SERVICE_ROLE_KEY is set and these tables were readable. */
  readable: boolean;
}

export const EMPTY_APPS_ANALYTICS: AppsAnalyticsSummary = {
  topSearches: [],
  zeroResultSearches: [],
  mostViewed: [],
  mostClicked: [],
  helpful: [],
  topFilters: [],
  suggestions: [],
  readable: false,
};

interface SearchRow {
  query: string;
  results_count: number;
  created_at: string;
}

interface EventRow {
  app_id: string;
  event_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface SuggestionRow {
  id: number;
  suggested_name: string;
  suggested_url: string | null;
  reason: string | null;
  email: string | null;
  created_at: string;
}

export async function getAppsAnalytics(): Promise<AppsAnalyticsSummary> {
  try {
    const adminMod = await import("../supabaseAdmin").catch(() => null);
    const adminClient = adminMod?.getSupabaseAdmin() ?? null;
    if (!adminClient) return EMPTY_APPS_ANALYTICS;

    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [searchesRes, eventsRes, suggestionsRes] = await Promise.all([
      adminClient
        .from("app_searches")
        .select("query, results_count, created_at")
        .gte("created_at", since30)
        .order("created_at", { ascending: false })
        .limit(2000),
      adminClient
        .from("app_events")
        .select("app_id, event_type, metadata, created_at")
        .gte("created_at", since30)
        .order("created_at", { ascending: false })
        .limit(5000),
      adminClient
        .from("app_suggestions")
        .select("id, suggested_name, suggested_url, reason, email, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    // --- searches: top queries + zero-result queries ------------------------
    const searchRows = (searchesRes.data ?? []) as SearchRow[];
    const searchCounts = new Map<string, number>();
    const zeroCounts = new Map<string, { count: number; lastSeen: string }>();
    for (const row of searchRows) {
      const key = row.query.trim().toLowerCase();
      if (!key) continue;
      searchCounts.set(key, (searchCounts.get(key) ?? 0) + 1);
      if (row.results_count === 0) {
        const entry = zeroCounts.get(key) ?? { count: 0, lastSeen: row.created_at };
        entry.count += 1;
        if (row.created_at > entry.lastSeen) entry.lastSeen = row.created_at;
        zeroCounts.set(key, entry);
      }
    }
    const topSearches: AppSearchSummary[] = Array.from(searchCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    const zeroResultSearches: AppZeroResultSearch[] = Array.from(zeroCounts.entries())
      .map(([query, v]) => ({ query, count: v.count, lastSeen: v.lastSeen }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // --- events: views, clicks, helpful votes, filters -----------------------
    const eventRows = (eventsRes.data ?? []) as EventRow[];
    const viewCounts = new Map<string, number>();
    const clickCounts = new Map<string, number>();
    const helpfulCounts = new Map<string, { yes: number; no: number }>();
    const filterCounts = new Map<string, number>();

    for (const row of eventRows) {
      if (row.event_type === "listing_view") {
        viewCounts.set(row.app_id, (viewCounts.get(row.app_id) ?? 0) + 1);
      } else if (row.event_type === "affiliate_click") {
        clickCounts.set(row.app_id, (clickCounts.get(row.app_id) ?? 0) + 1);
      } else if (row.event_type === "helpful_yes" || row.event_type === "helpful_no") {
        const entry = helpfulCounts.get(row.app_id) ?? { yes: 0, no: 0 };
        if (row.event_type === "helpful_yes") entry.yes += 1;
        else entry.no += 1;
        helpfulCounts.set(row.app_id, entry);
      } else if (row.event_type === "filter_used") {
        const filterType =
          typeof row.metadata?.filterType === "string" ? row.metadata.filterType : "unknown";
        const value = typeof row.metadata?.value === "string" ? row.metadata.value : "unknown";
        const label = `${filterType}: ${value}`;
        filterCounts.set(label, (filterCounts.get(label) ?? 0) + 1);
      }
    }

    const mostViewed: AppListingStat[] = Array.from(viewCounts.entries())
      .map(([appId, count]) => ({ appId, appName: getAppById(appId)?.name ?? appId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    const mostClicked: AppListingStat[] = Array.from(clickCounts.entries())
      .map(([appId, count]) => ({ appId, appName: getAppById(appId)?.name ?? appId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    const helpful: AppHelpfulStat[] = Array.from(helpfulCounts.entries())
      .map(([appId, v]) => ({
        appId,
        appName: getAppById(appId)?.name ?? appId,
        yes: v.yes,
        no: v.no,
        ratio: v.yes + v.no > 0 ? v.yes / (v.yes + v.no) : null,
      }))
      .sort((a, b) => b.yes + b.no - (a.yes + a.no));
    const topFilters: AppFilterStat[] = Array.from(filterCounts.entries())
      .map(([filter, count]) => ({ filter, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // --- suggestions inbox ---------------------------------------------------
    const suggestions: AppSuggestionEntry[] = ((suggestionsRes.data ?? []) as SuggestionRow[]).map(
      (row) => ({
        id: row.id,
        suggestedName: row.suggested_name,
        suggestedUrl: row.suggested_url,
        reason: row.reason,
        email: row.email,
        createdAt: row.created_at,
      })
    );

    return {
      topSearches,
      zeroResultSearches,
      mostViewed,
      mostClicked,
      helpful,
      topFilters,
      suggestions,
      readable: true,
    };
  } catch (err) {
    console.error("[apps/analyticsAdmin]", err);
    return EMPTY_APPS_ANALYTICS;
  }
}
