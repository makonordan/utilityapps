import "server-only";

import { PRODUCTS_BY_ID, type Product } from "./products";
import { TOOLS_BY_ID, type Tool } from "./tools";

export interface AdminToolRow extends Tool {
  usageCount: number;
  bookmarkCount: number;
  averageRating: number;
  ratingCount: number;
}

export interface NewsletterSubscriberSummary {
  email: string;
  source: string | null;
  createdAt: string;
  confirmed: boolean;
}

export interface BlogViewSummary {
  slug: string;
  views: number;
  updatedAt: string;
}

export interface SearchQuerySummary {
  query: string;
  count: number;
}

export interface ContactMessageSummary {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ZeroResultSearch {
  query: string;
  count: number;
  lastSeen: string;
}

export interface AffiliateClickRow extends Pick<Product, "id" | "name" | "category" | "price" | "platform"> {
  clicks7d: number;
  clicks30d: number;
  clicksTotal: number;
}

export interface SubscriberGrowthPoint {
  /** ISO date (YYYY-MM-DD) for the day. */
  date: string;
  /** Subscribers gained that day. */
  delta: number;
  /** Cumulative subscriber count at end of day. */
  cumulative: number;
}

export interface AdminStats {
  totalToolViews: number;
  newsletterCount: number;
  trendingTools: { toolId: string; usageCount: number }[];
  topSearches: SearchQuerySummary[];
  zeroResultSearches: ZeroResultSearch[];
  recentSubscribers: NewsletterSubscriberSummary[];
  toolRows: AdminToolRow[];
  blogViews: BlogViewSummary[];
  affiliateRows: AffiliateClickRow[];
  affiliateClicks7d: number;
  affiliateClicks30d: number;
  subscriberGrowth: SubscriberGrowthPoint[];
  contactMessageCount: number;
  recentContactMessages: ContactMessageSummary[];
  /** True when the service-role key needed to read contact_messages is set. */
  contactReadable: boolean;
  source: "supabase" | "fallback";
  fallbackReason?: string;
}

const EMPTY_STATS: Omit<AdminStats, "source" | "fallbackReason"> = {
  totalToolViews: 0,
  newsletterCount: 0,
  trendingTools: [],
  topSearches: [],
  zeroResultSearches: [],
  recentSubscribers: [],
  toolRows: [],
  blogViews: [],
  affiliateRows: [],
  affiliateClicks7d: 0,
  affiliateClicks30d: 0,
  subscriberGrowth: [],
  contactMessageCount: 0,
  recentContactMessages: [],
  contactReadable: false,
};

// Shape of a contact_messages row as read through the untyped service-role
// client (which is a plain SupabaseClient without the Database generic).
interface ContactMessageRecord {
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const sb = await import("./supabase").catch(() => null);
  const queries = await import("./db/queries").catch(() => null);
  if (!sb || !queries) {
    return {
      ...EMPTY_STATS,
      toolRows: Object.values(TOOLS_BY_ID).map((t) => emptyToolRow(t)),
      source: "fallback",
      fallbackReason: "Supabase not configured",
    };
  }
  const { supabase } = sb;

  try {
    const [
      totalUsageRes,
      perToolUsageRes,
      perToolBookmarksRes,
      perToolRatingsRes,
      newsletterCountRes,
      recentSubscribersRes,
      blogViewsRes,
      topSearchesRes,
      trendingRes,
      zeroResultRes,
      affiliateClicksRes,
      subscriberDailyRes,
    ] = await Promise.all([
      supabase.from("tool_usage").select("id", { count: "exact", head: true }),
      supabase
        .from("tool_usage")
        .select("tool_id")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from("bookmarks").select("tool_id"),
      supabase.from("tool_ratings").select("tool_id, rating"),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase
        .from("newsletter_subscribers")
        .select("email, source, created_at, confirmed")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("blog_views").select("slug, views, updated_at").order("views", { ascending: false }).limit(20),
      queries.getTrendingSearches(20),
      queries.getTrendingTools(10),
      supabase
        .from("search_queries")
        .select("query, created_at")
        .eq("results_count", 0)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("products_clicks")
        .select("product_id, created_at")
        .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from("newsletter_subscribers")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true }),
    ]);

    const toolUsageCounts = countBy(perToolUsageRes.data ?? [], (r) => r.tool_id);
    const bookmarkCounts = countBy(perToolBookmarksRes.data ?? [], (r) => r.tool_id);

    const ratingAccum = new Map<string, { sum: number; count: number }>();
    for (const row of perToolRatingsRes.data ?? []) {
      const entry = ratingAccum.get(row.tool_id) ?? { sum: 0, count: 0 };
      entry.sum += row.rating;
      entry.count += 1;
      ratingAccum.set(row.tool_id, entry);
    }

    const toolRows: AdminToolRow[] = Object.values(TOOLS_BY_ID)
      .map((tool) => {
        const ratings = ratingAccum.get(tool.id);
        return {
          ...tool,
          usageCount: toolUsageCounts.get(tool.id) ?? 0,
          bookmarkCount: bookmarkCounts.get(tool.id) ?? 0,
          averageRating: ratings ? Number((ratings.sum / ratings.count).toFixed(2)) : 0,
          ratingCount: ratings?.count ?? 0,
        };
      })
      .sort((a, b) => b.usageCount - a.usageCount);

    const zeroResultCounts = new Map<string, { count: number; lastSeen: string }>();
    for (const row of zeroResultRes.data ?? []) {
      const key = row.query.trim().toLowerCase();
      if (!key) continue;
      const entry = zeroResultCounts.get(key) ?? { count: 0, lastSeen: row.created_at };
      entry.count += 1;
      if (row.created_at > entry.lastSeen) entry.lastSeen = row.created_at;
      zeroResultCounts.set(key, entry);
    }
    const zeroResultSearches: ZeroResultSearch[] = Array.from(zeroResultCounts.entries())
      .map(([query, v]) => ({ query, count: v.count, lastSeen: v.lastSeen }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Affiliate clicks per product, plus 7d/30d aggregates.
    const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const clickRows = affiliateClicksRes.data ?? [];
    const perProduct: Record<string, { total: number; d30: number; d7: number }> = {};
    let affiliateClicks7d = 0;
    let affiliateClicks30d = 0;
    for (const row of clickRows) {
      const ts = new Date(row.created_at).getTime();
      const bucket = (perProduct[row.product_id] ??= { total: 0, d30: 0, d7: 0 });
      bucket.total += 1;
      if (ts >= cutoff30) {
        bucket.d30 += 1;
        affiliateClicks30d += 1;
      }
      if (ts >= cutoff7) {
        bucket.d7 += 1;
        affiliateClicks7d += 1;
      }
    }
    const affiliateRows: AffiliateClickRow[] = Object.values(PRODUCTS_BY_ID)
      .map((product) => {
        const c = perProduct[product.id] ?? { total: 0, d30: 0, d7: 0 };
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          platform: product.platform,
          clicksTotal: c.total,
          clicks30d: c.d30,
          clicks7d: c.d7,
        };
      })
      .sort((a, b) => b.clicks30d - a.clicks30d);

    // Subscriber growth: bucket the last 30 days by ISO date.
    const subRows = subscriberDailyRes.data ?? [];
    const dailyDelta = new Map<string, number>();
    for (const row of subRows) {
      const d = new Date(row.created_at).toISOString().slice(0, 10);
      dailyDelta.set(d, (dailyDelta.get(d) ?? 0) + 1);
    }
    const subscriberGrowth: SubscriberGrowthPoint[] = [];
    const baseline = (newsletterCountRes.count ?? 0) - subRows.length;
    let cumulative = Math.max(0, baseline);
    for (let i = 29; i >= 0; i--) {
      const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const delta = dailyDelta.get(day) ?? 0;
      cumulative += delta;
      subscriberGrowth.push({ date: day, delta, cumulative });
    }

    // Contact messages — read with the service-role client. The
    // contact_messages table has no anon SELECT policy (it holds PII), so the
    // anon `supabase` client cannot read it. Falls back to empty when the
    // SUPABASE_SERVICE_ROLE_KEY env var is not configured.
    let contactMessageCount = 0;
    let recentContactMessages: ContactMessageSummary[] = [];
    let contactReadable = false;
    try {
      const adminMod = await import("./supabaseAdmin").catch(() => null);
      const adminClient = adminMod?.getSupabaseAdmin() ?? null;
      if (adminClient) {
        contactReadable = true;
        const [contactCountRes, contactRecentRes] = await Promise.all([
          adminClient.from("contact_messages").select("id", { count: "exact", head: true }),
          adminClient
            .from("contact_messages")
            .select("name, email, subject, message, created_at")
            .order("created_at", { ascending: false })
            .limit(50),
        ]);
        contactMessageCount = contactCountRes.count ?? 0;
        recentContactMessages = ((contactRecentRes.data ?? []) as ContactMessageRecord[]).map(
          (row) => ({
            name: row.name,
            email: row.email,
            subject: row.subject,
            message: row.message,
            createdAt: row.created_at,
          })
        );
      }
    } catch (err) {
      console.error("[admin/stats] contact_messages", err);
    }

    return {
      totalToolViews: totalUsageRes.count ?? 0,
      newsletterCount: newsletterCountRes.count ?? 0,
      trendingTools: trendingRes.data ?? [],
      topSearches: (topSearchesRes.data ?? []).map((s) => ({
        query: s.query,
        count: s.searchCount,
      })),
      zeroResultSearches,
      recentSubscribers: (recentSubscribersRes.data ?? []).map((row) => ({
        email: row.email,
        source: row.source,
        createdAt: row.created_at,
        confirmed: row.confirmed,
      })),
      toolRows,
      blogViews: (blogViewsRes.data ?? []).map((row) => ({
        slug: row.slug,
        views: row.views,
        updatedAt: row.updated_at,
      })),
      affiliateRows,
      affiliateClicks7d,
      affiliateClicks30d,
      subscriberGrowth,
      contactMessageCount,
      recentContactMessages,
      contactReadable,
      source: "supabase",
    };
  } catch (err) {
    console.error("[admin/stats]", err);
    return {
      ...EMPTY_STATS,
      toolRows: Object.values(TOOLS_BY_ID).map((t) => emptyToolRow(t)),
      source: "fallback",
      fallbackReason: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

function countBy<T>(rows: T[], keyFn: (row: T) => string): Map<string, number> {
  const out = new Map<string, number>();
  for (const row of rows) {
    const key = keyFn(row);
    out.set(key, (out.get(key) ?? 0) + 1);
  }
  return out;
}

function emptyToolRow(tool: Tool): AdminToolRow {
  return {
    ...tool,
    usageCount: 0,
    bookmarkCount: 0,
    averageRating: 0,
    ratingCount: 0,
  };
}
