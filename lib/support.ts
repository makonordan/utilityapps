/**
 * Support-page tier config + cached supporter-wall fetch.
 *
 * Tier definitions are the single source of truth for:
 *   - the three pricing cards on /support
 *   - the badge / display logic when a supporter logs in (future work)
 *   - the webhook handlers that map a provider's plan to a tier
 *
 * Pricing is hard-coded because it's product copy, not data — moving it
 * to the DB would force a re-render plus admin UI for very little gain.
 * If you change `priceMonthly` here, also update the matching plan in
 * Buy Me a Coffee / Paystack / Stripe.
 */

import { unstable_cache } from "next/cache";

import type {
  SupporterCycle,
  SupporterPublicRow,
  SupporterTier,
} from "./supabase";

export interface TierDefinition {
  id: Exclude<SupporterTier, "one_time">;
  /** Public-facing display name. */
  name: string;
  /** Short tagline under the name on the pricing card. */
  tagline: string;
  /** Visible monthly price in USD. */
  priceMonthly: number;
  /** Annual price (17% off ≈ 2 months free). Stored to keep arithmetic
   *  on the card consistent with what the provider actually charges. */
  priceAnnual: number;
  currency: "USD";
  /** Bullet list shown on the card. */
  features: string[];
  /** Buy Me a Coffee membership URL — falls back to the BMaC profile if
   *  the tier-specific env var isn't set yet. Set via env so launching
   *  one tier at a time doesn't require a code change. */
  bmacUrlEnv: string;
  /** Stripe price ID for the monthly plan (env-var name). */
  stripePriceMonthlyEnv: string;
  /** Stripe price ID for the annual plan. */
  stripePriceAnnualEnv: string;
  /** Paystack plan code for monthly recurring. */
  paystackPlanMonthlyEnv: string;
  paystackPlanAnnualEnv: string;
  /** Visual accent (Tailwind class shorthand used by the pricing card). */
  accent: "blue" | "purple" | "gold";
  /** Highlights this card as the most-popular default. */
  featured?: boolean;
}

export const TIERS: TierDefinition[] = [
  {
    id: "supporter",
    name: "Supporter",
    tagline: "Help cover the basics",
    priceMonthly: 5,
    priceAnnual: 50,
    currency: "USD",
    features: [
      "Your name on the Supporters wall (with your permission)",
      "Monthly update email from Daniel",
      "Early access to new tools (3 days before public)",
      "Subtle Supporter badge on your profile (when logged in)",
      "Knowing you're keeping UtilityApps free for everyone",
    ],
    bmacUrlEnv: "BMAC_SUPPORTER_URL",
    stripePriceMonthlyEnv: "STRIPE_PRICE_SUPPORTER_MONTHLY",
    stripePriceAnnualEnv: "STRIPE_PRICE_SUPPORTER_ANNUAL",
    paystackPlanMonthlyEnv: "PAYSTACK_PLAN_SUPPORTER_MONTHLY",
    paystackPlanAnnualEnv: "PAYSTACK_PLAN_SUPPORTER_ANNUAL",
    accent: "blue",
  },
  {
    id: "power",
    name: "Power Supporter",
    tagline: "Shape what gets built next",
    priceMonthly: 15,
    priceAnnual: 150,
    currency: "USD",
    features: [
      "Everything in Supporter",
      "Vote on the tool roadmap (monthly polls)",
      "Quarterly behind-the-scenes video from Daniel",
      "Your name displayed prominently on the Supporters wall",
      "Access to a private Telegram channel",
      "Priority email support",
    ],
    bmacUrlEnv: "BMAC_POWER_URL",
    stripePriceMonthlyEnv: "STRIPE_PRICE_POWER_MONTHLY",
    stripePriceAnnualEnv: "STRIPE_PRICE_POWER_ANNUAL",
    paystackPlanMonthlyEnv: "PAYSTACK_PLAN_POWER_MONTHLY",
    paystackPlanAnnualEnv: "PAYSTACK_PLAN_POWER_ANNUAL",
    accent: "purple",
    featured: true,
  },
  {
    id: "patron",
    name: "Founding Patron",
    tagline: "Direct access + recognition",
    priceMonthly: 50,
    priceAnnual: 500,
    currency: "USD",
    features: [
      "Everything above",
      "Monthly 15-min video call with Daniel (or async Q&A)",
      "Recognition on a specific tool page: “Supported by [you]”",
      "Handwritten thank-you note mailed to you",
      "Founding Patron badge across the site",
      "Direct input on major product decisions",
    ],
    bmacUrlEnv: "BMAC_PATRON_URL",
    stripePriceMonthlyEnv: "STRIPE_PRICE_PATRON_MONTHLY",
    stripePriceAnnualEnv: "STRIPE_PRICE_PATRON_ANNUAL",
    paystackPlanMonthlyEnv: "PAYSTACK_PLAN_PATRON_MONTHLY",
    paystackPlanAnnualEnv: "PAYSTACK_PLAN_PATRON_ANNUAL",
    accent: "gold",
  },
];

/** Marketing claim: annual = 2 months free vs monthly. Render below the toggle. */
export function annualSavingsPercent(): number {
  // 10/12 = 0.833... → ~17% saved by paying for 10 months instead of 12.
  return Math.round((1 - 10 / 12) * 100);
}

/** Resolve a tier's checkout URL for a given provider + billing cycle, or
 *  null if that combination isn't configured yet — caller hides the
 *  button when null. */
export function resolveCheckoutUrl(
  tier: TierDefinition,
  provider: "bmac" | "stripe" | "paystack",
  cycle: Exclude<SupporterCycle, "one_time">
): string | null {
  if (provider === "bmac") {
    const url = process.env[tier.bmacUrlEnv];
    return isPresent(url) ? url : null;
  }
  if (provider === "stripe") {
    // For Stripe we link to a server route that creates a Checkout session
    // — env var tells us which Price ID to use, not the URL itself.
    const env = cycle === "annual" ? tier.stripePriceAnnualEnv : tier.stripePriceMonthlyEnv;
    return isPresent(process.env[env])
      ? `/api/checkout/stripe?tier=${tier.id}&cycle=${cycle}`
      : null;
  }
  if (provider === "paystack") {
    const env =
      cycle === "annual" ? tier.paystackPlanAnnualEnv : tier.paystackPlanMonthlyEnv;
    return isPresent(process.env[env])
      ? `/api/checkout/paystack?tier=${tier.id}&cycle=${cycle}`
      : null;
  }
  return null;
}

function isPresent(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const fetchPublicSupporters = unstable_cache(
  async (limit: number): Promise<SupporterPublicRow[]> => {
    // Lazy-import so static prerender of /support doesn't pull in
    // Supabase at module-eval — same pattern as lib/toolRating.ts.
    const { getPublicSupporters } = await import("./db/queries");
    const res = await getPublicSupporters(limit);
    if (res.error || !res.data) return [];
    return res.data;
  },
  ["support-supporters-wall"],
  { revalidate: 60 * 60, tags: ["supporters-wall"] }
);

/** Public entry — call from the /support page. Returns [] on any failure
 *  so a broken DB connection never breaks the page render. */
export async function getCachedPublicSupporters(
  limit: number = 100
): Promise<SupporterPublicRow[]> {
  try {
    return await fetchPublicSupporters(limit);
  } catch {
    return [];
  }
}
