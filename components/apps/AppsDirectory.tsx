"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";

import { AppLogo } from "@/components/apps/AppLogo";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ALL_APPS,
  APP_CATEGORIES,
  BUSINESS_SIZES,
  INDUSTRIES,
  PRICING_MODELS,
  REGIONS,
  searchApps,
  type AppListing,
  type BusinessSize,
  type PricingModel,
  type Region,
} from "@/lib/apps";
import { logCompletedSearch, trackAffiliateClick, trackAppEvent } from "@/lib/apps/analytics";
import { formatStartingPrice, industryLabel, PRICING_NAME, REGION_NAME, SIZE_NAME } from "@/lib/apps/format";
import { cn } from "@/lib/utils";

const DIRECTORY_CATEGORY = APP_CATEGORIES[0]?.id ?? null;

type SortMode = "editors" | "popular" | "trending" | "price" | "recent";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "editors", label: "Editor's Picks" },
  { id: "popular", label: "Most Popular" },
  { id: "trending", label: "Trending" },
  { id: "price", label: "Price: Low → High" },
  { id: "recent", label: "Recently Reviewed" },
];

interface FilterState {
  q: string;
  industries: string[];
  regions: Region[];
  sizes: BusinessSize[];
  pricingModels: PricingModel[];
  freeOnly: boolean;
  sort: SortMode;
}

function parseList<T extends string>(value: string | null): T[] {
  if (!value) return [];
  return value.split(",").filter(Boolean) as T[];
}

function stateFromParams(params: URLSearchParams): FilterState {
  const sortParam = params.get("sort");
  const sort = SORT_OPTIONS.some((s) => s.id === sortParam) ? (sortParam as SortMode) : "editors";
  return {
    q: params.get("q") ?? "",
    industries: parseList(params.get("industry")),
    regions: parseList<Region>(params.get("region")),
    sizes: parseList<BusinessSize>(params.get("size")),
    pricingModels: parseList<PricingModel>(params.get("pricing")),
    freeOnly: params.get("free") === "1",
    sort,
  };
}

function paramsFromState(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.industries.length) params.set("industry", state.industries.join(","));
  if (state.regions.length) params.set("region", state.regions.join(","));
  if (state.sizes.length) params.set("size", state.sizes.join(","));
  if (state.pricingModels.length) params.set("pricing", state.pricingModels.join(","));
  if (state.freeOnly) params.set("free", "1");
  if (state.sort !== "editors") params.set("sort", state.sort);
  return params.toString();
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function matchesFilters(app: AppListing, filters: FilterState): boolean {
  if (filters.industries.length && !filters.industries.some((i) => app.industries.includes(i))) {
    return false;
  }
  if (filters.regions.length && !filters.regions.some((r) => app.regions.includes(r))) {
    return false;
  }
  if (filters.sizes.length && !filters.sizes.some((s) => app.businessSizes.includes(s))) {
    return false;
  }
  if (filters.pricingModels.length && !filters.pricingModels.includes(app.pricingModel)) {
    return false;
  }
  if (filters.freeOnly && !app.hasFreeTier) return false;
  return true;
}

function priceValue(app: AppListing): number {
  return typeof app.startingPrice === "number" ? app.startingPrice : Number.POSITIVE_INFINITY;
}

function sortApps(apps: AppListing[], mode: SortMode): AppListing[] {
  const list = [...apps];
  switch (mode) {
    case "editors":
      return list.sort(
        (a, b) => Number(b.editorsPick) - Number(a.editorsPick) || b.popularityScore - a.popularityScore
      );
    case "popular":
      return list.sort((a, b) => b.popularityScore - a.popularityScore);
    case "trending":
      return list.sort(
        (a, b) => Number(b.trending) - Number(a.trending) || b.popularityScore - a.popularityScore
      );
    case "price":
      return list.sort((a, b) => priceValue(a) - priceValue(b));
    case "recent":
      return list.sort((a, b) => (b.lastReviewed || "").localeCompare(a.lastReviewed || ""));
    default:
      return list;
  }
}

// Curated shortcuts are computed once from the full published catalog and are
// independent of the visitor's active filters — they're meant to always
// offer a useful jumping-off point, even if filters currently return zero.
const EDITORS_PICKS = sortApps(
  ALL_APPS.filter((a) => a.editorsPick),
  "popular"
);
const TRENDING_APPS = sortApps(
  ALL_APPS.filter((a) => a.trending),
  "popular"
);
const FREE_APPS = sortApps(
  ALL_APPS.filter((a) => a.hasFreeTier),
  "popular"
).slice(0, 8);
const GLOBAL_APPS = sortApps(
  ALL_APPS.filter((a) => a.regions.some((r) => r !== "north-america")),
  "popular"
).slice(0, 8);

function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary-500 bg-primary-500 text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
      )}
    >
      {children}
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 hover:bg-primary-100 dark:hover:bg-primary-500/20"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function MiniAppCard({ app }: { app: AppListing }) {
  const href = app.affiliateUrl ?? app.website;
  const isAffiliate = Boolean(app.affiliateUrl);
  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer"}
      onClick={() => trackAffiliateClick(app.id, href, "directory-quick-browse")}
      className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
    >
      <div className="flex items-center gap-2">
        <AppLogo app={app} size={32} />
        <span className="truncate text-sm font-semibold text-surface-900 dark:text-white">
          {app.name}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-surface-600 dark:text-surface-400">{app.tagline}</p>
      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
        {formatStartingPrice(app)}
      </span>
    </a>
  );
}

function QuickBrowseRow({ title, apps }: { title: string; apps: AppListing[] }) {
  if (apps.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {apps.map((app) => (
          <MiniAppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function AppCard({ app }: { app: AppListing }) {
  const href = app.affiliateUrl ?? app.website;
  const isAffiliate = Boolean(app.affiliateUrl);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700">
      <div className="flex items-start gap-3">
        <AppLogo app={app} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-surface-900 dark:text-white">
            {app.name}
          </h3>
          <p className="line-clamp-2 text-sm text-surface-600 dark:text-surface-400">{app.tagline}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-surface-700 dark:text-surface-300">{app.verdict}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-100 px-2.5 py-1 text-xs font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200">
          {formatStartingPrice(app)}
        </span>
        {app.hasFreeTier && (
          <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
            Free tier
          </span>
        )}
        {app.editorsPick && (
          <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
            Editor&apos;s Pick
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {app.businessSizes.map((s) => (
          <span
            key={s}
            className="rounded-full border border-surface-200 px-2 py-0.5 text-[11px] text-surface-600 dark:border-surface-800 dark:text-surface-400"
          >
            {SIZE_NAME[s]}
          </span>
        ))}
        {app.regions.map((r) => (
          <span
            key={r}
            className="rounded-full border border-surface-200 px-2 py-0.5 text-[11px] text-surface-600 dark:border-surface-800 dark:text-surface-400"
          >
            {REGION_NAME[r]}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-1 border-t border-surface-100 pt-3 text-xs dark:border-surface-800">
        {app.bestFor[0] && (
          <p className="text-surface-600 dark:text-surface-400">
            <span aria-hidden="true">✅</span> {app.bestFor[0]}
          </p>
        )}
        {app.avoidIf[0] && (
          <p className="text-surface-600 dark:text-surface-400">
            <span aria-hidden="true">⛔</span> {app.avoidIf[0]}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4 dark:border-surface-800">
        <Link
          href={`/apps/${app.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Read our take
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <a
          href={href}
          target="_blank"
          rel={isAffiliate ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer"}
          onClick={() => trackAffiliateClick(app.id, href, "directory-grid")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-primary-600 dark:text-surface-200 dark:hover:text-primary-400"
        >
          Visit site
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export function AppsDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>(() => stateFromParams(searchParams));

  // Keep the URL in sync so filtered/sorted views are shareable and
  // bookmarkable. replace (not push) + scroll:false avoids spamming browser
  // history or jumping the page on every filter click.
  useEffect(() => {
    const qs = paramsFromState(filters);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pathname]);

  const base = filters.q.trim() ? searchApps(filters.q) : ALL_APPS;
  const filtered = base.filter((app) => matchesFilters(app, filters));
  const sorted = sortApps(filtered, filters.sort);

  // Log completed searches only — debounced so a settled query (not every
  // keystroke) gets one entry, with the result count it actually produced.
  // Zero-result searches are the highest-value signal here (demand we're
  // not serving), so they're logged the same as any other search.
  useEffect(() => {
    const query = filters.q.trim();
    if (!query) return;
    const timer = setTimeout(() => {
      logCompletedSearch(query, sorted.length, DIRECTORY_CATEGORY);
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q]);

  // Filter usage is logged only when a filter is switched ON — that's the
  // "what are people looking for" signal; switching one off isn't a new
  // demand data point. `app_id` for these events is the 'directory'
  // sentinel since they aren't tied to one listing.
  const logFilterUsed = (filterType: string, value: string) =>
    trackAppEvent("directory", "filter_used", { filterType, value });

  const toggleIndustry = (id: string) => {
    if (!filters.industries.includes(id)) logFilterUsed("industry", id);
    setFilters((f) => ({ ...f, industries: toggleValue(f.industries, id) }));
  };
  const toggleRegion = (id: Region) => {
    if (!filters.regions.includes(id)) logFilterUsed("region", id);
    setFilters((f) => ({ ...f, regions: toggleValue(f.regions, id) }));
  };
  const toggleSize = (id: BusinessSize) => {
    if (!filters.sizes.includes(id)) logFilterUsed("size", id);
    setFilters((f) => ({ ...f, sizes: toggleValue(f.sizes, id) }));
  };
  const togglePricing = (id: PricingModel) => {
    if (!filters.pricingModels.includes(id)) logFilterUsed("pricing", id);
    setFilters((f) => ({ ...f, pricingModels: toggleValue(f.pricingModels, id) }));
  };
  const toggleFreeOnly = () => {
    if (!filters.freeOnly) logFilterUsed("freeOnly", "true");
    setFilters((f) => ({ ...f, freeOnly: !f.freeOnly }));
  };
  const setSort = (sort: SortMode) => setFilters((f) => ({ ...f, sort }));
  const setQuery = (q: string) => setFilters((f) => ({ ...f, q }));
  const clearAll = () =>
    setFilters((f) => ({
      ...f,
      industries: [],
      regions: [],
      sizes: [],
      pricingModels: [],
      freeOnly: false,
    }));

  const activeChips = [
    ...filters.industries.map((id) => ({
      key: `industry-${id}`,
      label: industryLabel(id),
      onRemove: () => toggleIndustry(id),
    })),
    ...filters.regions.map((id) => ({
      key: `region-${id}`,
      label: REGION_NAME[id],
      onRemove: () => toggleRegion(id),
    })),
    ...filters.sizes.map((id) => ({
      key: `size-${id}`,
      label: SIZE_NAME[id],
      onRemove: () => toggleSize(id),
    })),
    ...filters.pricingModels.map((id) => ({
      key: `pricing-${id}`,
      label: PRICING_NAME[id],
      onRemove: () => togglePricing(id),
    })),
    ...(filters.freeOnly ? [{ key: "free", label: "Free tier only", onRemove: toggleFreeOnly }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Quick-browse rows */}
      <div className="space-y-8">
        <QuickBrowseRow title="⭐ Editor's Picks" apps={EDITORS_PICKS} />
        <QuickBrowseRow title="🔥 Trending now" apps={TRENDING_APPS} />
        <QuickBrowseRow title="🆓 Best free options" apps={FREE_APPS} />
        <QuickBrowseRow title="🌍 Strong outside the US" apps={GLOBAL_APPS} />
      </div>

      {/* Search */}
      <div className="mt-10">
        <label className="relative flex w-full items-center">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-surface-400" />
          <span className="sr-only">Search invoicing &amp; accounting software</span>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoicing & accounting software..."
            className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
        </label>
      </div>

      {/* Filter panel */}
      <div className="mt-6 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Industry
            </p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((id) => (
                <ChipToggle key={id} active={filters.industries.includes(id)} onClick={() => toggleIndustry(id)}>
                  {industryLabel(id)}
                </ChipToggle>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Region
            </p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <ChipToggle key={r.id} active={filters.regions.includes(r.id)} onClick={() => toggleRegion(r.id)}>
                  {r.name}
                </ChipToggle>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Business size
              </p>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_SIZES.map((s) => (
                  <ChipToggle key={s.id} active={filters.sizes.includes(s.id)} onClick={() => toggleSize(s.id)}>
                    {s.name}
                  </ChipToggle>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Pricing
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICING_MODELS.map((p) => (
                  <ChipToggle
                    key={p.id}
                    active={filters.pricingModels.includes(p.id)}
                    onClick={() => togglePricing(p.id)}
                  >
                    {p.name}
                  </ChipToggle>
                ))}
                <ChipToggle active={filters.freeOnly} onClick={toggleFreeOnly}>
                  Free tier only
                </ChipToggle>
              </div>
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-100 pt-4 dark:border-surface-800">
            {activeChips.map((chip) => (
              <ActiveChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-surface-500 underline-offset-2 hover:text-primary-600 hover:underline dark:text-surface-400 dark:hover:text-primary-400"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Sort + result count */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-surface-600 dark:text-surface-400">
          <span className="font-semibold text-surface-900 dark:text-white">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "app" : "apps"} match your filters
        </p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {SORT_OPTIONS.map((opt) => (
            <ChipToggle key={opt.id} active={filters.sort === opt.id} onClick={() => setSort(opt.id)}>
              {opt.label}
            </ChipToggle>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {sorted.length === 0 ? (
          <EmptyState
            Icon={Search}
            title={
              ALL_APPS.length === 0
                ? "Pricing verification in progress"
                : "No apps match those filters"
            }
            description={
              ALL_APPS.length === 0
                ? "We're finishing pricing verification for this category before publishing any listings — check back soon."
                : "Try clearing a filter or two above, or search for something broader."
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((app) => (
              <li key={app.id}>
                <AppCard app={app} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
