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

// ----- Share tool stats --------------------------------------------------

export interface ShareDailyPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  file: number;
  text: number;
  url: number;
  /** Sum of file_size for file shares created that day, bytes. */
  fileBytes: number;
}

export interface ReportedShareRow {
  slug: string;
  type: "file" | "text" | "url";
  reportedAt: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  /** First 500 chars of text shares; null for file/url. */
  textPreview: string | null;
  /** Filename for file shares; null otherwise. */
  fileName: string | null;
  /** Mime type for file shares; null otherwise. */
  fileMimetype: string | null;
  /** Bytes for file shares; null otherwise. */
  fileSize: number | null;
  /** Target URL for url shares; null otherwise. */
  originalUrl: string | null;
}

export interface ShareFileTypeBreakdown {
  mimetype: string;
  count: number;
}

export interface ShareStats {
  total: number;
  filesTotal: number;
  textTotal: number;
  urlTotal: number;
  /** Last 30 days of new-share counts by type, plus daily file-bytes. */
  daily: ShareDailyPoint[];
  /** Currently-reported (hidden) shares awaiting moderation. */
  reportedQueue: ReportedShareRow[];
  /** Total bytes used by *currently stored* file shares. */
  storageBytes: number;
  /** Top 10 mimetypes among file shares ever uploaded. */
  topFileTypes: ShareFileTypeBreakdown[];
  /** What fraction of shares used a custom slug (0..1). */
  customSlugRate: number;
  /** What fraction were password-protected (0..1). */
  passwordProtectedRate: number;
}

// ----- Geo / device breakdown --------------------------------------------

export interface CountByLabel {
  label: string;
  count: number;
}

export interface GeoStats {
  /** Top 10 countries by tool-usage events (last 30 days). */
  topCountries: CountByLabel[];
  /** Device split, last 30 days. */
  devices: CountByLabel[];
  /** Total events the breakdown is computed from. */
  totalEvents: number;
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
  /** Share tool stats — null when service-role key is missing. */
  shareStats: ShareStats | null;
  /** Geo + device breakdown of tool_usage (last 30 days). */
  geo: GeoStats;
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
  shareStats: null,
  geo: { topCountries: [], devices: [], totalEvents: 0 },
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

/** Mirror of `lib/db/shares.ts` ShareType but local so we don't drag a
 *  server-only import chain into admin.ts. */
type ShareTypeInternal = "file" | "text" | "url";

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
      geoUsageRes,
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
      // Country + device breakdown for the last 30 days.
      supabase
        .from("tool_usage")
        .select("country, device")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
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

    // Geo + device breakdown — derived from the 30-day tool_usage slice.
    const geoRows = (geoUsageRes.data ?? []) as Array<{
      country: string | null;
      device: string | null;
    }>;
    const countryCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    for (const row of geoRows) {
      const country = (row.country ?? "").trim() || "Unknown";
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
      const device = (row.device ?? "").trim() || "Unknown";
      deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);
    }
    const geo: GeoStats = {
      topCountries: Array.from(countryCounts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      devices: Array.from(deviceCounts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      totalEvents: geoRows.length,
    };

    // Share tool stats — needs the service-role client because `shares`
    // has no anon SELECT policy. Returns null when key missing so the
    // dashboard can show a "configure SUPABASE_SERVICE_ROLE_KEY" hint.
    let shareStats: ShareStats | null = null;
    try {
      const adminMod = await import("./supabaseAdmin").catch(() => null);
      const adminClient = adminMod?.getSupabaseAdmin() ?? null;
      if (adminClient) {
        const thirtyDaysAgo = new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString();
        const [
          totalsRes,
          dailyRes,
          reportedRes,
          fileTypesRes,
          flagsRes,
        ] = await Promise.all([
          // All-time totals by type
          adminClient.from("shares").select("type, file_size, reported"),
          // Last 30 days by day + type
          adminClient
            .from("shares")
            .select("type, created_at, file_size")
            .gte("created_at", thirtyDaysAgo)
            .order("created_at", { ascending: true }),
          // Reported queue (max 50 — admin would normally clear faster than this)
          adminClient
            .from("shares")
            .select(
              "slug, type, reported_at, created_at, expires_at, view_count, text_content, file_name, file_mimetype, file_size, original_url"
            )
            .eq("reported", true)
            .order("reported_at", { ascending: false })
            .limit(50),
          // File-type breakdown (all-time, file shares only)
          adminClient
            .from("shares")
            .select("file_mimetype")
            .eq("type", "file"),
          // Custom slug + password protection % (all-time)
          adminClient
            .from("shares")
            .select("custom_slug, password_hash"),
        ]);

        type TotalsRow = { type: ShareTypeInternal; file_size: number | null; reported: boolean };
        const totals = (totalsRes.data ?? []) as TotalsRow[];
        let filesTotal = 0,
          textTotal = 0,
          urlTotal = 0,
          storageBytes = 0;
        for (const row of totals) {
          if (row.type === "file") {
            filesTotal += 1;
            if (!row.reported && row.file_size) storageBytes += row.file_size;
          } else if (row.type === "text") textTotal += 1;
          else if (row.type === "url") urlTotal += 1;
        }
        const total = totals.length;

        // Bucket the 30-day rows into daily series with file/text/url counts
        // and per-day file-bytes for the storage-trend chart.
        const dailyMap = new Map<string, ShareDailyPoint>();
        for (let i = 29; i >= 0; i -= 1) {
          const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);
          dailyMap.set(day, { date: day, file: 0, text: 0, url: 0, fileBytes: 0 });
        }
        type DailyRow = {
          type: ShareTypeInternal;
          created_at: string;
          file_size: number | null;
        };
        for (const row of (dailyRes.data ?? []) as DailyRow[]) {
          const day = row.created_at.slice(0, 10);
          const bucket = dailyMap.get(day);
          if (!bucket) continue;
          if (row.type === "file") {
            bucket.file += 1;
            bucket.fileBytes += row.file_size ?? 0;
          } else if (row.type === "text") bucket.text += 1;
          else if (row.type === "url") bucket.url += 1;
        }

        type ReportedRow = {
          slug: string;
          type: ShareTypeInternal;
          reported_at: string;
          created_at: string;
          expires_at: string;
          view_count: number;
          text_content: string | null;
          file_name: string | null;
          file_mimetype: string | null;
          file_size: number | null;
          original_url: string | null;
        };
        const reportedQueue: ReportedShareRow[] = (
          (reportedRes.data ?? []) as ReportedRow[]
        ).map((r) => ({
          slug: r.slug,
          type: r.type,
          reportedAt: r.reported_at,
          createdAt: r.created_at,
          expiresAt: r.expires_at,
          viewCount: r.view_count,
          textPreview: r.type === "text" ? (r.text_content ?? "").slice(0, 500) : null,
          fileName: r.file_name,
          fileMimetype: r.file_mimetype,
          fileSize: r.file_size,
          originalUrl: r.original_url,
        }));

        const fileTypeCounts = new Map<string, number>();
        for (const row of (fileTypesRes.data ?? []) as Array<{
          file_mimetype: string | null;
        }>) {
          const mt = (row.file_mimetype ?? "unknown").trim() || "unknown";
          fileTypeCounts.set(mt, (fileTypeCounts.get(mt) ?? 0) + 1);
        }
        const topFileTypes: ShareFileTypeBreakdown[] = Array.from(
          fileTypeCounts.entries()
        )
          .map(([mimetype, count]) => ({ mimetype, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        const flags = (flagsRes.data ?? []) as Array<{
          custom_slug: boolean;
          password_hash: string | null;
        }>;
        const customCount = flags.filter((f) => f.custom_slug).length;
        const passwordCount = flags.filter((f) => f.password_hash).length;

        shareStats = {
          total,
          filesTotal,
          textTotal,
          urlTotal,
          daily: Array.from(dailyMap.values()),
          reportedQueue,
          storageBytes,
          topFileTypes,
          customSlugRate: total > 0 ? customCount / total : 0,
          passwordProtectedRate: total > 0 ? passwordCount / total : 0,
        };
      }
    } catch (err) {
      console.error("[admin/stats] share stats", err);
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
      shareStats,
      geo,
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
