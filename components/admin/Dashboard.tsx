"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BookText,
  ChevronRight,
  CircleDollarSign,
  Inbox,
  LogOut,
  Mail,
  RefreshCcw,
  Search,
  Wrench,
} from "lucide-react";

import { SubscriberGrowthChart } from "@/components/admin/charts/SubscriberGrowthChart";
import { TrendingChart } from "@/components/admin/charts/TrendingChart";
import type {
  AdminStats,
  AdminToolRow,
  AffiliateClickRow,
  BlogViewSummary,
  ContactMessageSummary,
  NewsletterSubscriberSummary,
  SubscriberGrowthPoint,
  ZeroResultSearch,
} from "@/lib/admin";
import { TOOLS_BY_ID } from "@/lib/tools";
import { cn, formatDate, formatNumber } from "@/lib/utils";

type Tab = "overview" | "tools" | "blog" | "newsletter" | "contact" | "search" | "revenue";

const TABS: { id: Tab; label: string; Icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Overview", Icon: BarChart3 },
  { id: "tools", label: "Tools", Icon: Wrench },
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
    <nav aria-label="Admin sections">
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
      <ul className="grid gap-4 sm:grid-cols-3">
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

      <Section title="Recent newsletter signups">
        <SubscriberList items={stats.recentSubscribers.slice(0, 8)} />
      </Section>
    </div>
  );
}

// ----- Tools ---------------------------------------------------------------

function ToolsTab({ rows }: { rows: AdminToolRow[] }) {
  type Sort = "usage" | "bookmarks" | "rating";
  const [sort, setSort] = useState<Sort>("usage");
  const sorted = useMemo(() => {
    const copy = [...rows];
    if (sort === "usage") copy.sort((a, b) => b.usageCount - a.usageCount);
    if (sort === "bookmarks") copy.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
    if (sort === "rating") copy.sort((a, b) => b.averageRating - a.averageRating);
    return copy;
  }, [rows, sort]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          All tools ({rows.length})
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
            <option value="usage">Usage</option>
            <option value="bookmarks">Bookmarks</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      <DataTable
        columns={["Tool", "Category", "Usage (30d)", "Bookmarks", "Rating"]}
        rows={sorted.map((tool) => [
          tool.name,
          tool.category,
          formatNumber(tool.usageCount),
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
