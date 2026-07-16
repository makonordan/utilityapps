// Pure types + static reference data for the Apps directory. No React here —
// see lib/apps/index.ts for the aggregation layer that consumes this.

export type BusinessSize = "solo" | "small" | "medium" | "enterprise";

export type Region =
  | "global"
  | "north-america"
  | "europe"
  | "africa"
  | "asia"
  | "latam"
  | "oceania";

export type PricingModel = "free" | "freemium" | "subscription" | "one-time";

/** Sentinel for a factual field pending manual verification against the
 *  vendor's live pricing page. Never fill these with a guessed/remembered
 *  value — set VERIFY and let pricingSourceUrl point at where to check. */
export const VERIFY = "VERIFY" as const;
export type Verifiable<T> = T | typeof VERIFY;

export interface PricingTier {
  name: string;
  priceMonthly: Verifiable<number | null>;
  priceAnnual: Verifiable<number | null>;
  currency: Verifiable<string>;
  keyLimits: string[];
}

export interface AppListing {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string;
  website: string;

  // Classification (multiple entry paths)
  category: string;
  subCategory: string;
  industries: string[];
  businessSizes: BusinessSize[];
  regions: Region[];
  regionNotes: string;
  useCases: string[];
  pricingModel: PricingModel;

  // VERIFIED FACTS — each must be checked against the vendor's own pricing
  // page. Never invent these.
  pricing: PricingTier[];
  hasFreeTier: boolean;
  freeTierReality: string;
  startingPrice: Verifiable<number>;
  currency: Verifiable<string>;

  keyFeatures: string[];
  integrations: string[];
  platforms: string[];

  // THE EDITORIAL LAYER (our differentiator)
  verdict: string;
  bestFor: string[];
  avoidIf: string[];
  pros: string[];
  cons: string[];

  // Signals
  popularityScore: number;
  trending: boolean;
  editorsPick: boolean;

  // Monetization + integrity
  affiliateUrl: string | null;
  hasAffiliateProgram: Verifiable<boolean>;

  // Freshness + accuracy (critical for trust)
  pricingVerifiedDate: string;
  pricingSourceUrl: string;
  lastReviewed: string;

  // Funnel to our own tools (our unique advantage)
  relatedUtilityAppsTools: string[];
}

export interface AppCategory {
  id: string;
  name: string;
  description: string;
}

// Additional categories drop into this array (and get their own
// lib/apps/data/<category>.ts file) as the directory grows.
export const APP_CATEGORIES: AppCategory[] = [
  {
    id: "invoicing-accounting",
    name: "Invoicing & Accounting Software",
    description:
      "Send invoices, track expenses, and manage the books — from single-invoice freelancer tools to full double-entry accounting suites.",
  },
  {
    id: "project-management",
    name: "Project Management Software",
    description:
      "Plan work, assign tasks, and track progress — from simple kanban boards for small teams to full portfolio and resource management for larger orgs.",
  },
  {
    id: "email-marketing",
    name: "Email Marketing Software",
    description:
      "Build lists, send campaigns, and automate follow-ups — from simple newsletter tools to full marketing automation platforms.",
  },
  {
    id: "hr-payroll",
    name: "HR & Payroll Software",
    description:
      "Run payroll, manage benefits, and handle hiring and HR admin — from single-country payroll for small teams to global HR platforms.",
  },
];

export const REGIONS: { id: Region; name: string }[] = [
  { id: "global", name: "Global" },
  { id: "north-america", name: "North America" },
  { id: "europe", name: "Europe" },
  { id: "africa", name: "Africa" },
  { id: "asia", name: "Asia" },
  { id: "latam", name: "Latin America" },
  { id: "oceania", name: "Oceania" },
];

export const INDUSTRIES: string[] = [
  "freelancers",
  "agencies",
  "retail",
  "construction",
  "consulting",
  "ecommerce",
  "nonprofits",
  "hospitality",
  "healthcare",
  "real-estate",
];

export const BUSINESS_SIZES: { id: BusinessSize; name: string }[] = [
  { id: "solo", name: "Solo / Freelancer" },
  { id: "small", name: "Small business" },
  { id: "medium", name: "Medium business" },
  { id: "enterprise", name: "Enterprise" },
];

export const PRICING_MODELS: { id: PricingModel; name: string }[] = [
  { id: "free", name: "Free" },
  { id: "freemium", name: "Freemium" },
  { id: "subscription", name: "Subscription" },
  { id: "one-time", name: "One-time purchase" },
];
