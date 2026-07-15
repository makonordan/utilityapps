import { BUSINESS_SIZES, PRICING_MODELS, REGIONS } from "./types";
import type { AppListing, BusinessSize, PricingModel, Region } from "./types";

export const REGION_NAME: Record<Region, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.name])
) as Record<Region, string>;

export const SIZE_NAME: Record<BusinessSize, string> = Object.fromEntries(
  BUSINESS_SIZES.map((s) => [s.id, s.name])
) as Record<BusinessSize, string>;

export const PRICING_NAME: Record<PricingModel, string> = Object.fromEntries(
  PRICING_MODELS.map((p) => [p.id, p.name])
) as Record<PricingModel, string>;

export function industryLabel(id: string): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** "From 29 USD/mo" style summary used on cards and listing headers. */
export function formatStartingPrice(app: AppListing): string {
  if (app.startingPrice === "VERIFY" || app.currency === "VERIFY") {
    return "Pricing pending verification";
  }
  if (app.startingPrice === 0) return "Free";
  return `From ${app.startingPrice} ${app.currency}/mo`;
}

/** A single pricing-tier price cell, e.g. "29 USD/mo" or "Pending verification".
 *  `suffix` (e.g. "/mo") is only appended when the value is an actual positive
 *  price — never after "Free", "—", or "Pending verification". */
export function formatTierPrice(
  value: number | null | "VERIFY",
  currency: string | "VERIFY",
  suffix = ""
): string {
  if (value === "VERIFY" || currency === "VERIFY") return "Pending verification";
  if (value === null) return "—";
  if (value === 0) return "Free";
  return `${value} ${currency}${suffix}`;
}

/** Guards against an empty/unset date string (unreviewed draft) instead of
 *  handing `new Date("")` to Intl and printing "Invalid Date". */
export function safeFormatDate(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

/** Head-to-head row result for comparison pages. "unknown" means the data
 *  can't fairly support a call (e.g. pricing still unverified) — render
 *  neither a winner nor a "tie" badge rather than manufacturing a difference. */
export type Winner = "a" | "b" | "tie" | "unknown";

export function comparePricing(a: AppListing, b: AppListing): Winner {
  if (typeof a.startingPrice !== "number" || typeof b.startingPrice !== "number") return "unknown";
  if (a.startingPrice === b.startingPrice) return "tie";
  return a.startingPrice < b.startingPrice ? "a" : "b";
}

export function compareFreeTier(a: AppListing, b: AppListing): Winner {
  if (a.hasFreeTier === b.hasFreeTier) return "tie";
  return a.hasFreeTier ? "a" : "b";
}

export function comparePlatforms(a: AppListing, b: AppListing): Winner {
  if (a.platforms.length === b.platforms.length) return "tie";
  return a.platforms.length > b.platforms.length ? "a" : "b";
}
