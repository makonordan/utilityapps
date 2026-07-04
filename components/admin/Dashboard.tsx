"use client";

import { useMemo, useState } from "react";
import {
  AlertOctagon,
  ArrowUpRight,
  BarChart3,
  BookText,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Inbox,
  LogOut,
  Mail,
  RefreshCcw,
  RotateCcw,
  Search,
  Share2,
  Smartphone,
  Trash2,
  Wrench,
} from "lucide-react";

import { SubscriberGrowthChart } from "@/components/admin/charts/SubscriberGrowthChart";
import { TrendingChart } from "@/components/admin/charts/TrendingChart";
import type {
  AdminStats,
  AdminToolRow,
  AffiliateClickRow,
  ApiWaitlistSummary,
  BlogViewSummary,
  ContactMessageSummary,
  GeoStats,
  NewsletterSubscriberSummary,
  ReportedShareRow,
  ShareStats,
  SubscriberGrowthPoint,
  ZeroResultSearch,
} from "@/lib/admin";
import { TOOLS_BY_ID } from "@/lib/tools";
import { cn, formatDate, formatNumber } from "@/lib/utils";

type Tab =
  | "overview"
  | "tools"
  | "share"
  | "blog"
  | "newsletter"
  | "contact"
  | "search"
  | "revenue";

const TABS: { id: Tab; label: string; Icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Overview", Icon: BarChart3 },
  { id: "tools", label: "Tools", Icon: Wrench },
  { id: "share", label: "Quick Share", Icon: Share2 },
  { id: "blog", label: "Blog", Icon: BookText },
  { id: "newsletter", label: "Newsletter", Icon: Mail },
  { id: "contact", label: "Contact", Icon: Inbox },
  { id: "search", label: "Search", Icon: Search },
  { id: "revenue", label: "Revenue", Icon: CircleDollarSign },
];

// Heuristic — not real revenue. Used only for the "estimated" card so the
// admin can eyeball the order of magnitude. Override with NEXT_PUBLIC_ADSENSE_RPM.
const DEFAULT_ESTIMATED_RPM_USD = 4;

export function Dashboard({ stats }: { stats: AdminStats }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Header source={stats.source} fallbackReason={stats.fallbackReason} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Sidebar tab={tab} setTab={setTab} />
        <main className="min-w-0">
          {tab === "overview" && <OverviewTab stats={stats} />}
          {tab === "tools" && <ToolsTab rows={stats.toolRows} />}
          {tab === "share" && <ShareTab stats={stats.shareStats} />}
          {tab === "blog" && <BlogTab views={stats.blogViews} />}
          {tab === "newsletter" && (
            <NewsletterTab
              total={stats.newsletterCount}
              recent={stats.recentSubscribers}
              growth={stats.subscriberGrowth}
            />
          )}
          {tab === "contact" && (
            <ContactTab
              total={stats.contactMessageCount}
              messages={stats.recentContactMessages}
              readable={stats.contactReadable}
            />
          )}
          {tab === "search" && (
            <SearchTab
              top={stats.topSearches}
              zero={stats.zeroResultSearches}
            />
          )}
          {tab === "revenue" && (
            <RevenueTab
              totalToolViews={stats.totalToolViews}
              affiliateRows={stats.affiliateRows}
              affiliateClicks7d={stats.affiliateClicks7d}
              affiliateClicks30d={stats.affiliateClicks30d}
              growth={stats.subscriberGrowth}
              newsletterCount={stats.newsletterCount}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Header({
  source,
  fallbackReason,
}: {
  source: AdminStats["source"];
  fallbackReason?: string;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          UtilityApps Admin
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Dashboard
        </h1>
        {source === "fallback" && (
          <p className="mt-1 text-xs text-warning-600 dark:text-warning-400">
            Showing empty data — Supabase unavailable{fallbackReason ? ` (${fallbackReason})` : ""}.
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-2 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <form method="POST" action="/api/admin/auth?_method=DELETE">
          <input type="hidden" name="_method" value="DELETE" />
          <a
            href="/api/admin/auth"
            onClick={(e) => {
              e.preventDefault();
              fetch("/api/admin/auth", { method: "DELETE" }).then(() => {
                window.location.href = "/admin/login";
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-2 text-xs font-medium text-surface-700 transition hover:border-warning-300 hover:text-warning-600 dark:border-surface-800 dark:text-surface-200 dark:hover:border-warning-500/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </a>
        </form>
      </div>
    </header>
  );
}

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return (
    // `lg:sticky lg:top-6 lg:self-start` keeps the nav pinned while the
    // main column scrolls. `self-start` is required inside the grid cell
    // or the sticky element gets stretched to the grid row height and
    // can't actually stick.
    <nav aria-label="Admin sections" className="lg:sticky lg:top-6 lg:self-start">
      <ul className="flex gap-1.5 overflow-x-auto rounded-2xl border border-surface-200 bg-white p-1 lg:flex-col lg:overflow-visible dark:border-surface-800 dark:bg-surface-900">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {active && <ChevronRight className="ml-auto hidden h-3.5 w-3.5 lg:inline" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">{hint}</p>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <header className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

// ----- Overview ------------------------------------------------------------

function OverviewTab({ stats }: { stats: AdminStats }) {
  const trendingData = stats.trendingTools.map((t) => ({
    name: TOOLS_BY_ID[t.toolId]?.name ?? t.toolId,
    count: t.usageCount,
  }));

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <StatCard
            label="Uses today"
            value={formatNumber(stats.totalUsageToday)}
            hint="Real events, last 24h"
          />
        </li>
        <li>
          <StatCard
            label="Site rating"
            value={
              stats.siteRating.average !== null
                ? stats.siteRating.average.toFixed(2)
                : "—"
            }
            hint={
              stats.siteRating.count > 0
                ? `${formatNumber(stats.siteRating.count)} ratings across ${stats.siteRating.toolsRated} tools`
                : "No ratings yet"
            }
          />
        </li>
        <li>
          <StatCard
            label="Total tool views"
            value={formatNumber(stats.totalToolViews)}
            hint="All time"
          />
        </li>
        <li>
          <StatCard
            label="Newsletter subscribers"
            value={formatNumber(stats.newsletterCount)}
          />
        </li>
        <li>
          <StatCard
            label="Top searches (7d)"
            value={formatNumber(stats.topSearches.length)}
            hint="Distinct queries"
          />
        </li>
      </ul>

      <Section
        title="Top 10 trending tools"
        description="By usage events in the last 7 days"
      >
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <TrendingChart data={trendingData} label="Uses" />
        </div>
      </Section>

      <Section title="Top search queries" description="Last 7 days">
        <DataTable
          columns={["Query", "Searches"]}
          rows={stats.topSearches.slice(0, 10).map((s) => [s.query, formatNumber(s.count)])}
          emptyText="No searches recorded yet."
        />
      </Section>

      <Section
        title="Where the traffic comes from"
        description="Tool-usage events, last 30 days"
      >
        <GeographySection geo={stats.geo} />
      </Section>

      <Section
        title="API access waitlist"
        description="Demand validation. 100 signups means real demand; 10 means build something else."
      >
        <ApiWaitlistCard waitlist={stats.apiWaitlist} />
      </Section>

      <Section
        title="Chrome extension waitlist"
        description="Banner signups. 100 in two weeks = build it; ~10 = build something else first."
      >
        <ApiWaitlistCard waitlist={stats.extensionWaitlist} />
      </Section>

      <Section title="Recent newsletter signups">
        <SubscriberList items={stats.recentSubscribers.slice(0, 8)} />
      </Section>
    </div>
  );
}

// ----- Geography (used inside Overview) ------------------------------------

function GeographySection({ geo }: { geo: GeoStats }) {
  if (geo.totalEvents === 0) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-4 text-sm text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
        <p>No tool-usage events in the last 30 days.</p>
        <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
          This populates once real visitors hit any tool page. Your own admin
          views don&rsquo;t count (the tracker rate-limits to one event per
          tool per session per hour). Country is detected server-side from
          the request&rsquo;s <code>x-vercel-ip-country</code> header — works
          automatically on Vercel.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          <Globe2 className="h-3.5 w-3.5" /> Top countries
        </p>
        <BarList items={geo.topCountries} total={geo.totalEvents} />
      </div>
      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          <Smartphone className="h-3.5 w-3.5" /> Devices
        </p>
        <BarList items={geo.devices} total={geo.totalEvents} />
      </div>
    </div>
  );
}

function ApiWaitlistCard({ waitlist }: { waitlist: ApiWaitlistSummary }) {
  if (!waitlist.readable) {
    return (
      <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-200">
        Waitlist count unavailable — the SUPABASE_SERVICE_ROLE_KEY env var
        is needed to read the <code>api_waitlist</code> table.
      </div>
    );
  }

  const pct = Math.min(100, (waitlist.total / waitlist.goal) * 100);
  const reached = waitlist.total >= waitlist.goal;
  const close = !reached && waitlist.total >= waitlist.goal * 0.5;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Signups
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-surface-900 dark:text-white">
          {formatNumber(waitlist.total)}
          <span className="ml-2 text-sm font-medium text-surface-500 dark:text-surface-400">
            of {waitlist.goal}
          </span>
        </p>
        <p
          className={cn(
            "mt-1 text-xs",
            reached
              ? "text-success-700 dark:text-success-300"
              : close
                ? "text-warning-700 dark:text-warning-300"
                : "text-surface-500 dark:text-surface-400"
          )}
        >
          {reached
            ? "🎉 Demand validated — start building."
            : close
              ? `Getting close — ${waitlist.goal - waitlist.total} more to go.`
              : `${waitlist.goal - waitlist.total} more for the green light.`}
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              reached
                ? "bg-success-500"
                : close
                  ? "bg-warning-500"
                  : "bg-primary-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Most recent signups
        </p>
        {waitlist.recent.length === 0 ? (
          <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
            Nobody yet. Push the /api page on socials and watch this fill.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-surface-200 dark:divide-surface-800">
            {waitlist.recent.slice(0, 8).map((entry) => (
              <li key={`${entry.email}-${entry.createdAt}`} className="py-2 text-sm">
                <p className="truncate font-mono text-xs text-surface-800 dark:text-surface-100">
                  {entry.email}
                </p>
                {entry.useCase && (
                  <p className="mt-0.5 truncate text-[11px] text-surface-600 dark:text-surface-300">
                    &ldquo;{entry.useCase}&rdquo;
                  </p>
                )}
                <p className="mt-0.5 text-[10px] text-surface-400">
                  {formatDate(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Horizontal bar list with label, count, and percentage. */
function BarList({
  items,
  total,
}: {
  items: { label: string; count: number }[];
  total: number;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-surface-500 dark:text-surface-400">No data.</p>;
  }
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        const widthPct = max > 0 ? (item.count / max) * 100 : 0;
        return (
          <li key={item.label}>
            <div className="flex items-center justify-between text-xs text-surface-700 dark:text-surface-200">
              <span className="truncate">{item.label}</span>
              <span className="tabular-nums text-surface-500 dark:text-surface-400">
                {formatNumber(item.count)} · {pct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ----- Tools ---------------------------------------------------------------

function ToolsTab({ rows }: { rows: AdminToolRow[] }) {
  type Sort = "today" | "usage" | "bookmarks" | "rating" | "completion";
  const [sort, setSort] = useState<Sort>("today");
  const sorted = useMemo(() => {
    const copy = [...rows];
    if (sort === "today")
      copy.sort((a, b) => b.usageToday - a.usageToday || b.usageCount - a.usageCount);
    if (sort === "usage") copy.sort((a, b) => b.usageCount - a.usageCount);
    if (sort === "bookmarks") copy.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
    if (sort === "rating") copy.sort((a, b) => b.averageRating - a.averageRating);
    if (sort === "completion") {
      // Uninstrumented tools sort to the bottom — "—" should never beat
      // an actual measured rate.
      copy.sort((a, b) => {
        if (a.instrumented !== b.instrumented) return a.instrumented ? -1 : 1;
        return b.completionRate - a.completionRate;
      });
    }
    return copy;
  }, [rows, sort]);

  const instrumentedCount = rows.filter((r) => r.instrumented).length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          All tools ({rows.length}) ·{" "}
          <span className="normal-case text-surface-400">
            {instrumentedCount} report completion
          </span>
        </h2>
        <label className="inline-flex items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          >
            <option value="today">Today</option>
            <option value="usage">Usage (30d)</option>
            <option value="bookmarks">Bookmarks</option>
            <option value="rating">Rating</option>
            <option value="completion">Completion rate</option>
          </select>
        </label>
      </div>

      <DataTable
        columns={[
          "Tool",
          "Category",
          "Today",
          "Usage (30d)",
          "Completions (30d)",
          "Completion rate",
          "Bookmarks",
          "Rating",
        ]}
        rows={sorted.map((tool) => [
          tool.name,
          tool.category,
          formatNumber(tool.usageToday),
          formatNumber(tool.usageCount),
          tool.instrumented ? formatNumber(tool.completionCount) : "—",
          tool.instrumented
            ? tool.usageCount > 0
              ? `${(tool.completionRate * 100).toFixed(1)}%`
              : "—"
            : "—",
          formatNumber(tool.bookmarkCount),
          tool.ratingCount > 0
            ? `${tool.averageRating.toFixed(2)} (${tool.ratingCount})`
            : "—",
        ])}
        emptyText="No tools."
      />
    </div>
  );
}

// ----- Share ---------------------------------------------------------------

function formatBytesShort(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

type ShareGranularity = "day" | "week" | "month";

const GRANULARITY_LABELS: Record<ShareGranularity, string> = {
  day: "Day (last 30 days)",
  week: "Week (last 12 weeks)",
  month: "Month (last 12 months)",
};

function ShareTab({ stats }: { stats: ShareStats | null }) {
  const [granularity, setGranularity] = useState<ShareGranularity>("day");

  if (!stats) {
    return (
      <p className="rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-200">
        Share stats unavailable — the SUPABASE_SERVICE_ROLE_KEY env var is
        needed to read the <code>shares</code> table.
      </p>
    );
  }

  // Active series + headline totals derived from it.
  const series = stats.series[granularity];
  const windowTotal = series.reduce(
    (sum, p) => sum + p.file + p.text + p.url,
    0
  );
  const windowBytes = series.reduce((sum, p) => sum + p.fileBytes, 0);

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <StatCard
            label="Total shares"
            value={formatNumber(stats.total)}
            hint="All time"
          />
        </li>
        <li>
          <StatCard
            label={
              granularity === "day"
                ? "Shares last 30 days"
                : granularity === "week"
                  ? "Shares last 12 weeks"
                  : "Shares last 12 months"
            }
            value={formatNumber(windowTotal)}
            hint={`${formatBytesShort(windowBytes)} of new files`}
          />
        </li>
        <li>
          <StatCard
            label="Storage used"
            value={formatBytesShort(stats.storageBytes)}
            hint="Excludes hidden / reported"
          />
        </li>
        <li>
          <StatCard
            label="Reported queue"
            value={formatNumber(stats.reportedQueue.length)}
            hint={
              stats.reportedQueue.length > 0
                ? "Needs review"
                : "Nothing to review"
            }
          />
        </li>
      </ul>

      <Section
        title="Type breakdown"
        description="Lifetime counts and percentages across every share ever created"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <ShareTypeCard label="Files" count={stats.filesTotal} total={stats.total} color="#0066FF" />
          <ShareTypeCard label="Text snippets" count={stats.textTotal} total={stats.total} color="#7C3AED" />
          <ShareTypeCard label="URLs" count={stats.urlTotal} total={stats.total} color="#14B8A6" />
        </div>
      </Section>

      <Section
        title="Share options uptake"
        description="What fraction of shares opt in to each setting"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ShareTypeCard
            label="Custom slug"
            count={stats.customSlugCount}
            total={stats.total}
            color="#F59E0B"
          />
          <ShareTypeCard
            label="Password-protected"
            count={stats.passwordProtectedCount}
            total={stats.total}
            color="#EF4444"
          />
        </div>
      </Section>

      <Section
        title="Shares over time"
        description="Toggle the time window. Empty bars mean no shares that period."
      >
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div role="tablist" className="inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
              {(["day", "week", "month"] as ShareGranularity[]).map((g) => {
                const active = granularity === g;
                return (
                  <button
                    key={g}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setGranularity(g)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                      active
                        ? "bg-white text-primary-700 shadow-sm dark:bg-surface-950 dark:text-primary-300"
                        : "text-surface-600 dark:text-surface-300"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {GRANULARITY_LABELS[granularity]}
            </p>
          </div>
          <ShareSeriesChart series={series} granularity={granularity} />
        </div>
      </Section>

      <Section title="Most-shared file types" description="All-time, file shares only">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          {stats.topFileTypes.length === 0 ? (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No file shares yet.
            </p>
          ) : (
            <BarList
              items={stats.topFileTypes.map((t) => ({
                label: t.mimetype,
                count: t.count,
              }))}
              total={stats.filesTotal}
            />
          )}
        </div>
      </Section>

      <Section
        title="Reported shares"
        description="Hidden from recipients. Restore false positives or hard-delete."
      >
        <ReportedQueue items={stats.reportedQueue} />
      </Section>
    </div>
  );
}

/** KPI-style card used for share-type counts AND the share-options uptake
 *  cards (custom slug + password). Shows label, count, percentage and a
 *  thin progress bar so the magnitude lands visually. */
function ShareTypeCard({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-surface-900 dark:text-white">
        {formatNumber(count)}
        <span className="ml-2 text-sm font-medium text-surface-500 dark:text-surface-400">
          · {pct.toFixed(1)}%
        </span>
      </p>
      <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
        of {formatNumber(total)} total share{total === 1 ? "" : "s"}
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/** Stacked column chart for the active time series. Pure SVG — one bar
 *  per bucket, every bucket label rendered along the X axis (so the user
 *  can read "12, 13, 14…" for day view or "Jan, Feb…" for month view).
 *
 *  We use a fixed viewBox of 600×200 to give bars and labels enough room
 *  even on the 30-day view; the SVG scales responsively via CSS. */
function ShareSeriesChart({
  series,
  granularity,
}: {
  series: ShareStats["series"]["day"];
  granularity: ShareGranularity;
}) {
  const CHART_W = 600;
  const CHART_H = 200;
  const BAR_AREA_H = 160; // leaves 40px at the bottom for axis labels
  const max = Math.max(1, ...series.map((p) => p.file + p.text + p.url));
  const cellW = CHART_W / Math.max(1, series.length);
  // Skip every Nth label for the day view so they don't overlap.
  const labelEvery =
    granularity === "day" && series.length > 15 ? 5 : 1;

  return (
    <div>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-64 w-full"
        role="img"
        aria-label="Share creation over time, by type"
      >
        {/* Bars */}
        {series.map((p, i) => {
          const fileH = (p.file / max) * BAR_AREA_H;
          const textH = (p.text / max) * BAR_AREA_H;
          const urlH = (p.url / max) * BAR_AREA_H;
          const totalH = fileH + textH + urlH;
          const x = i * cellW + cellW * 0.15;
          const w = cellW * 0.7;
          let y = BAR_AREA_H - totalH;
          const tooltip = `${p.label}: ${p.file + p.text + p.url} (${p.file}F · ${p.text}T · ${p.url}U)`;
          return (
            <g key={p.bucket}>
              <title>{tooltip}</title>
              {p.file > 0 && (
                <rect x={x} y={y} width={w} height={fileH} fill="#0066FF" />
              )}
              {p.text > 0 && (
                <rect
                  x={x}
                  y={(y += fileH)}
                  width={w}
                  height={textH}
                  fill="#7C3AED"
                />
              )}
              {p.url > 0 && (
                <rect
                  x={x}
                  y={(y += textH)}
                  width={w}
                  height={urlH}
                  fill="#14B8A6"
                />
              )}
              {/* Zero-bar placeholder so empty buckets still show as a thin */}
              {/* baseline tick, otherwise the chart looks broken on a slow day. */}
              {totalH === 0 && (
                <rect
                  x={x}
                  y={BAR_AREA_H - 1}
                  width={w}
                  height={1}
                  fill="currentColor"
                  className="text-surface-300 dark:text-surface-700"
                />
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {series.map((p, i) => {
          if (i % labelEvery !== 0 && i !== series.length - 1) return null;
          const cx = i * cellW + cellW / 2;
          return (
            <text
              key={`l-${p.bucket}`}
              x={cx}
              y={CHART_H - 12}
              textAnchor="middle"
              className="fill-surface-500 dark:fill-surface-400"
              fontSize={11}
            >
              {p.label}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-surface-600 dark:text-surface-300">
        <Legend color="#0066FF" label="Files" />
        <Legend color="#7C3AED" label="Text" />
        <Legend color="#14B8A6" label="URLs" />
        <span className="ml-auto text-surface-400">
          Hover any bar for the exact counts
        </span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function ReportedQueue({ items }: { items: ReportedShareRow[] }) {
  // Local state so a restore/delete action removes the row from view
  // without a full page refresh. The server still has the source of truth
  // — a hard refresh re-fetches.
  const [rows, setRows] = useState(items);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restore = async (slug: string) => {
    setBusySlug(slug);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/shares/${encodeURIComponent(slug)}/restore`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Couldn't restore.");
        return;
      }
      setRows((prev) => prev.filter((r) => r.slug !== slug));
    } catch {
      setError("Network error.");
    } finally {
      setBusySlug(null);
    }
  };

  const hardDelete = async (slug: string) => {
    if (!confirm(`Hard-delete share ${slug}? This removes the row and (for files) the Storage object. Cannot be undone.`)) {
      return;
    }
    setBusySlug(slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shares/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Couldn't delete.");
        return;
      }
      setRows((prev) => prev.filter((r) => r.slug !== slug));
    } catch {
      setError("Network error.");
    } finally {
      setBusySlug(null);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-success-200 bg-success-50 p-4 text-sm text-success-800 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-300">
        Nothing reported. Quiet day.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-error-50 px-3 py-2 text-xs text-error-700 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </p>
      )}
      {rows.map((r) => (
        <article
          key={r.slug}
          className="rounded-2xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/30 dark:bg-warning-500/10"
        >
          <header className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warning-700 dark:text-warning-300">
                <AlertOctagon className="h-3 w-3" /> {r.type} · /s/{r.slug}
              </p>
              <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
                Reported {formatDate(r.reportedAt)} · created {formatDate(r.createdAt)} ·{" "}
                {r.viewCount} view{r.viewCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={busySlug === r.slug}
                onClick={() => restore(r.slug)}
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-semibold text-surface-700 shadow-sm hover:bg-surface-50 disabled:opacity-50 dark:bg-surface-950 dark:text-surface-100"
              >
                <RotateCcw className="h-3 w-3" /> Restore
              </button>
              <button
                type="button"
                disabled={busySlug === r.slug}
                onClick={() => hardDelete(r.slug)}
                className="inline-flex items-center gap-1 rounded-md bg-error-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-error-700 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </header>

          {r.type === "text" && r.textPreview && (
            <pre className="mt-3 max-h-32 overflow-y-auto whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-[11px] text-surface-700 dark:bg-surface-950 dark:text-surface-200">
              {r.textPreview}
              {r.textPreview.length === 500 && "…"}
            </pre>
          )}
          {r.type === "url" && r.originalUrl && (
            <p className="mt-3 break-all rounded-md bg-white p-2 font-mono text-[11px] text-surface-700 dark:bg-surface-950 dark:text-surface-200">
              → {r.originalUrl}
            </p>
          )}
          {r.type === "file" && r.fileName && (
            <p className="mt-3 rounded-md bg-white p-2 text-[11px] text-surface-700 dark:bg-surface-950 dark:text-surface-200">
              📎 <strong>{r.fileName}</strong>
              {r.fileMimetype ? ` · ${r.fileMimetype}` : ""}
              {r.fileSize != null ? ` · ${formatBytesShort(r.fileSize)}` : ""}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

// ----- Blog ----------------------------------------------------------------

function BlogTab({ views }: { views: BlogViewSummary[] }) {
  return (
    <div>
      <Section title="Most-read posts" description="Top 20 by view count">
        <DataTable
          columns={["Slug", "Views", "Last updated"]}
          rows={views.map((v) => [v.slug, formatNumber(v.views), formatDate(v.updatedAt)])}
          emptyText="No view counts yet — record a few via the increment_blog_view RPC."
        />
      </Section>
    </div>
  );
}

// ----- Newsletter ----------------------------------------------------------

function NewsletterTab({
  total,
  recent,
  growth,
}: {
  total: number;
  recent: NewsletterSubscriberSummary[];
  growth: SubscriberGrowthPoint[];
}) {
  const newLast7 = growth.slice(-7).reduce((sum, p) => sum + p.delta, 0);
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-3">
        <li>
          <StatCard label="Total subscribers" value={formatNumber(total)} />
        </li>
        <li>
          <StatCard label="New this week" value={formatNumber(newLast7)} hint="Last 7 days" />
        </li>
        <li>
          <StatCard
            label="Confirmed"
            value={formatNumber(recent.filter((r) => r.confirmed).length)}
            hint="Of the most-recent 20"
          />
        </li>
      </ul>
      <Section title="Subscriber growth" description="Cumulative subscribers over the last 30 days">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <SubscriberGrowthChart data={growth} />
        </div>
      </Section>
      <Section title="Recent signups">
        <SubscriberList items={recent} />
      </Section>
    </div>
  );
}

// ----- Revenue -------------------------------------------------------------

function RevenueTab({
  totalToolViews,
  affiliateRows,
  affiliateClicks7d,
  affiliateClicks30d,
  growth,
  newsletterCount,
}: {
  totalToolViews: number;
  affiliateRows: AffiliateClickRow[];
  affiliateClicks7d: number;
  affiliateClicks30d: number;
  growth: SubscriberGrowthPoint[];
  newsletterCount: number;
}) {
  const rpm = readNumberEnv("NEXT_PUBLIC_ADSENSE_RPM", DEFAULT_ESTIMATED_RPM_USD);
  const estimatedRevenue = (totalToolViews / 1000) * rpm;
  const productsWithClicks = affiliateRows.filter((r) => r.clicksTotal > 0);
  const newLast7 = growth.slice(-7).reduce((sum, p) => sum + p.delta, 0);

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-3">
        <li>
          <StatCard
            label="Estimated AdSense revenue"
            value={`$${formatNumber(Math.round(estimatedRevenue))}`}
            hint={`Page views × $${rpm} RPM. Real number lives in AdSense.`}
          />
        </li>
        <li>
          <StatCard
            label="Affiliate clicks (30d)"
            value={formatNumber(affiliateClicks30d)}
            hint={`${formatNumber(affiliateClicks7d)} this week`}
          />
        </li>
        <li>
          <StatCard
            label="Newsletter list"
            value={formatNumber(newsletterCount)}
            hint={`+${formatNumber(newLast7)} this week`}
          />
        </li>
      </ul>

      <Section title="Open AdSense">
        <a
          href="https://www.google.com/adsense/start/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-semibold text-surface-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:hover:border-primary-700 dark:hover:text-primary-300"
        >
          AdSense dashboard
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Section>

      <Section title="Affiliate clicks per product" description="30-day window, sorted by recent activity">
        {productsWithClicks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-surface-200 p-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
            No affiliate clicks recorded yet. Once buy-button clicks roll in, products will appear here.
          </p>
        ) : (
          <DataTable
            columns={["Product", "Platform", "Price", "Clicks 7d", "Clicks 30d", "Total"]}
            rows={productsWithClicks.map((row) => [
              row.name,
              row.platform,
              `$${row.price}`,
              formatNumber(row.clicks7d),
              formatNumber(row.clicks30d),
              formatNumber(row.clicksTotal),
            ])}
            emptyText=""
          />
        )}
      </Section>

      <Section title="Subscriber growth" description="Cumulative subscribers over the last 30 days">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <SubscriberGrowthChart data={growth} />
        </div>
      </Section>
    </div>
  );
}

function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function SubscriberList({ items }: { items: NewsletterSubscriberSummary[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-surface-200 p-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
        No subscribers yet.
      </p>
    );
  }
  return (
    <DataTable
      columns={["Email", "Source", "Date", "Confirmed"]}
      rows={items.map((s) => [
        s.email,
        s.source ?? "—",
        formatDate(s.createdAt),
        s.confirmed ? "Yes" : "No",
      ])}
      emptyText=""
    />
  );
}

// ----- Contact -------------------------------------------------------------

function ContactTab({
  total,
  messages,
  readable,
}: {
  total: number;
  messages: ContactMessageSummary[];
  readable: boolean;
}) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <StatCard label="Total messages" value={formatNumber(total)} />
        </li>
        <li>
          <StatCard
            label="Showing"
            value={formatNumber(messages.length)}
            hint="Most recent 50"
          />
        </li>
      </ul>

      {!readable && (
        <p className="mt-6 rounded-2xl border border-warning-300 bg-warning-50 p-4 text-sm text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
          Contact messages can&apos;t be read yet. The table holds personal data, so it is not
          readable with the public key — add the <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          environment variable (Supabase → Settings → API → service_role key) and redeploy.
        </p>
      )}

      <Section title="Recent contact messages" description="Newest first">
        {messages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-surface-200 p-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
            {readable
              ? "No contact messages yet."
              : "Once the service-role key is set, submissions will appear here."}
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m, i) => (
              <li
                key={i}
                className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {m.name}{" "}
                    <a
                      href={`mailto:${m.email}`}
                      className="font-normal text-primary-600 hover:underline dark:text-primary-400"
                    >
                      ({m.email})
                    </a>
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {formatDate(m.createdAt)}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  {m.subject}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-surface-700 dark:text-surface-200">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// ----- Search --------------------------------------------------------------

function SearchTab({
  top,
  zero,
}: {
  top: { query: string; count: number }[];
  zero: ZeroResultSearch[];
}) {
  return (
    <div>
      <Section title="Top 20 searches" description="Last 7 days">
        <DataTable
          columns={["Query", "Searches"]}
          rows={top.slice(0, 20).map((s) => [s.query, formatNumber(s.count)])}
          emptyText="No searches recorded yet."
        />
      </Section>

      <Section
        title="Zero-result searches"
        description="Queries that returned nothing — content gaps to fill"
      >
        <DataTable
          columns={["Query", "Searches", "Last seen"]}
          rows={zero.map((s) => [s.query, formatNumber(s.count), formatDate(s.lastSeen)])}
          emptyText="No zero-result searches in the last 30 days. Nice."
        />
      </Section>
    </div>
  );
}

// ----- Reusable table ------------------------------------------------------

function DataTable({
  columns,
  rows,
  emptyText,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyText: string;
}) {
  if (rows.length === 0 && emptyText) {
    return (
      <p className="rounded-2xl border border-dashed border-surface-200 p-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
        {emptyText}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-900">
            {columns.map((col) => (
              <th
                key={col}
                className="border-b border-surface-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-950">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-surface-100 px-4 py-2.5 align-top text-surface-700 last:border-b-0 dark:border-surface-800 dark:text-surface-200"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
