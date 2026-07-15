import { getAppById } from "./index";

/**
 * Explicit, curated high-intent "X vs Y" pairs — deliberately not all 153
 * combinations across 18 apps. Each tuple's order is the canonical URL order
 * (`${a}-vs-${b}` under /apps/compare/); a request for the reverse order
 * permanently redirects to this order, and any pair not listed here 404s
 * rather than silently rendering a thin, un-curated comparison.
 *
 * Shared between app/apps/compare/[comparison]/page.tsx (rendering +
 * generateStaticParams) and lib/sitemap-entries.ts (sitemap generation) so
 * there's exactly one list to keep curated.
 */
export const COMPARISON_PAIRS: [string, string][] = [
  ["freshbooks", "quickbooks-online"],
  ["xero", "quickbooks-online"],
  ["wave", "freshbooks"],
  ["zoho-books", "quickbooks-online"],
  ["wave", "zoho-invoice"],
  ["freshbooks", "xero"],
  ["wave", "quickbooks-online"],
  ["xero", "zoho-books"],
  ["freeagent", "xero"],
  ["sage-business-cloud", "quickbooks-online"],
  ["paypal-invoicing", "stripe-invoicing"],
  ["bonsai", "freshbooks"],
  ["harvest", "freshbooks"],
  ["invoice-ninja", "zoho-invoice"],
  ["bill-com", "quickbooks-online"],
];

/** Canonical `a-vs-b` slugs for pairs where both apps currently resolve via
 *  getAppById — i.e. both have verified pricing and are actually published.
 *  This is what generateStaticParams and the sitemap should both use, so a
 *  comparison never gets a public URL while either side is still awaiting
 *  pricing verification. */
export function getVerifiedComparisonSlugs(): string[] {
  return COMPARISON_PAIRS.filter(([a, b]) => getAppById(a) && getAppById(b)).map(
    ([a, b]) => `${a}-vs-${b}`
  );
}
