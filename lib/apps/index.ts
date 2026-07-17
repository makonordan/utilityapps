import Fuse from "fuse.js";

import { AI_TOOLS_APPS } from "./data/ai-tools";
import { COMMUNICATION_TELECOMS_APPS } from "./data/communication-telecoms";
import { CRM_APPS } from "./data/crm";
import { CUSTOMER_SUPPORT_APPS } from "./data/customer-support";
import { DATA_ANALYTICS_APPS } from "./data/data-analytics";
import { DESIGN_APPS } from "./data/design";
import { DEV_TOOLS_APPS } from "./data/dev-tools";
import { ECOMMERCE_APPS } from "./data/ecommerce";
import { EDUCATION_APPS } from "./data/education";
import { EMAIL_MARKETING_APPS } from "./data/email-marketing";
import { FINANCE_BANKING_APPS } from "./data/finance-banking";
import { HR_PAYROLL_APPS } from "./data/hr-payroll";
import { INVOICING_APPS } from "./data/invoicing-accounting";
import { LEGAL_APPS } from "./data/legal";
import { PROJECT_MANAGEMENT_APPS } from "./data/project-management";
import { VERIFY, type AppListing, type BusinessSize, type Region } from "./types";

// Aggregates every category data file into one array. New categories drop in
// here as `...NEW_CATEGORY_APPS` — nothing else in this module changes.
const RAW_APPS: AppListing[] = [
  ...INVOICING_APPS,
  ...PROJECT_MANAGEMENT_APPS,
  ...EMAIL_MARKETING_APPS,
  ...HR_PAYROLL_APPS,
  ...DEV_TOOLS_APPS,
  ...EDUCATION_APPS,
  ...FINANCE_BANKING_APPS,
  ...COMMUNICATION_TELECOMS_APPS,
  ...ECOMMERCE_APPS,
  ...DATA_ANALYTICS_APPS,
  ...AI_TOOLS_APPS,
  ...CRM_APPS,
  ...CUSTOMER_SUPPORT_APPS,
  ...LEGAL_APPS,
  ...DESIGN_APPS,
];

/** A listing is publishable once every pricing-related fact has been
 *  checked against the vendor's live pricing page — no field still holds
 *  the VERIFY sentinel and pricingVerifiedDate has been stamped. See
 *  docs/apps-verification-checklist.md. */
export function isPricingVerified(app: AppListing): boolean {
  if (!app.pricingVerifiedDate) return false;
  if (app.startingPrice === VERIFY || app.currency === VERIFY) return false;
  if (app.freeTierReality === VERIFY) return false;
  return app.pricing.every(
    (tier) =>
      tier.priceMonthly !== VERIFY && tier.priceAnnual !== VERIFY && tier.currency !== VERIFY
  );
}

const unverifiedApps = RAW_APPS.filter((app) => !isPricingVerified(app));

// Guard: unverified pricing never reaches the published directory. In dev we
// still surface the listing (flagged via isPricingVerified()) so it can be
// previewed while you fill in real numbers; production hides it outright.
if (process.env.NODE_ENV !== "production" && unverifiedApps.length > 0) {
  console.warn(
    `[lib/apps] ${unverifiedApps.length} listing(s) have unverified pricing and will be hidden in production until pricingVerifiedDate is set: ${unverifiedApps
      .map((app) => app.id)
      .join(", ")}`
  );
}

/** Every scaffolded listing, verified or not — for internal tooling only
 *  (e.g. generating the verification checklist). Never render this
 *  directly in the public directory. */
export const ALL_APPS_RAW: AppListing[] = RAW_APPS;

/** The published directory. Listings with unverified pricing are excluded
 *  in production and merely flagged (still visible, see isPricingVerified())
 *  in development. */
export const ALL_APPS: AppListing[] =
  process.env.NODE_ENV === "production" ? RAW_APPS.filter(isPricingVerified) : RAW_APPS;

export const ALL_APPS_BY_ID: Record<string, AppListing> = Object.fromEntries(
  ALL_APPS.map((app) => [app.id, app])
);

export function getAppById(id: string): AppListing | undefined {
  return ALL_APPS_BY_ID[id];
}

export function getAppsByCategory(category: string): AppListing[] {
  return ALL_APPS.filter((app) => app.category === category);
}

export function getAppsByRegion(region: Region): AppListing[] {
  return ALL_APPS.filter((app) => app.regions.includes(region));
}

export function getAppsByIndustry(industry: string): AppListing[] {
  return ALL_APPS.filter((app) => app.industries.includes(industry));
}

export function getAppsByBusinessSize(size: BusinessSize): AppListing[] {
  return ALL_APPS.filter((app) => app.businessSizes.includes(size));
}

export function getTrendingApps(): AppListing[] {
  return ALL_APPS.filter((app) => app.trending);
}

export function getEditorsPicks(): AppListing[] {
  return ALL_APPS.filter((app) => app.editorsPick);
}

export interface AppFilters {
  category?: string;
  subCategory?: string;
  industries?: string[];
  businessSizes?: BusinessSize[];
  regions?: Region[];
  pricingModel?: string;
  hasFreeTier?: boolean;
}

/** Combined multi-filter — every provided field must match (AND across
 *  fields, OR within a field's array, e.g. any one of `industries`). */
export function filterApps(filters: AppFilters): AppListing[] {
  return ALL_APPS.filter((app) => {
    if (filters.category && app.category !== filters.category) return false;
    if (filters.subCategory && app.subCategory !== filters.subCategory) return false;
    if (filters.pricingModel && app.pricingModel !== filters.pricingModel) return false;
    if (filters.hasFreeTier !== undefined && app.hasFreeTier !== filters.hasFreeTier) return false;
    if (filters.industries?.length && !filters.industries.some((i) => app.industries.includes(i))) {
      return false;
    }
    if (
      filters.businessSizes?.length &&
      !filters.businessSizes.some((s) => app.businessSizes.includes(s))
    ) {
      return false;
    }
    if (filters.regions?.length && !filters.regions.some((r) => app.regions.includes(r))) {
      return false;
    }
    return true;
  });
}

const SEARCH_OPTIONS = {
  includeScore: true,
  threshold: 0.35,
  keys: [
    { name: "name", weight: 0.4 },
    { name: "tagline", weight: 0.25 },
    { name: "keyFeatures", weight: 0.2 },
    { name: "useCases", weight: 0.15 },
  ],
};

/** Fuzzy search over name/tagline/features/useCases. */
export function searchApps(query: string): AppListing[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const fuse = new Fuse(ALL_APPS, SEARCH_OPTIONS);
  return fuse.search(trimmed).map((result) => result.item);
}

export * from "./types";
