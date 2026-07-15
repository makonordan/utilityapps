import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { AffiliateCTA } from "@/components/apps/AffiliateCTA";
import { AppLogo } from "@/components/apps/AppLogo";
import { StartFreeFunnel } from "@/components/apps/StartFreeFunnel";
import { TrackAppView } from "@/components/apps/TrackAppView";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { ALL_APPS, getAppById, type AppListing } from "@/lib/apps";
import { COMPARISON_PAIRS, getVerifiedComparisonSlugs } from "@/lib/apps/comparisons";
import {
  comparePlatforms,
  comparePricing,
  compareFreeTier,
  formatStartingPrice,
  formatTierPrice,
  type Winner,
} from "@/lib/apps/format";
import { generateBreadcrumbSchema, jsonLdString } from "@/lib/schema";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG, cn } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ comparison: string }>;
}

function parseComparisonSlug(comparison: string): [string, string] | null {
  const parts = comparison.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

/** Returns the canonical `a-vs-b` slug for a curated pair (in either
 *  requested order), or null if this pair isn't one we curate. */
function canonicalSlugFor(idA: string, idB: string): string | null {
  if (COMPARISON_PAIRS.some(([x, y]) => x === idA && y === idB)) return `${idA}-vs-${idB}`;
  if (COMPARISON_PAIRS.some(([x, y]) => x === idB && y === idA)) return `${idB}-vs-${idA}`;
  return null;
}

export async function generateStaticParams() {
  return getVerifiedComparisonSlugs().map((comparison) => ({ comparison }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparisonSlug(comparison);
  if (!parsed) return { title: "Comparison not found" };
  const [a, b] = [getAppById(parsed[0]), getAppById(parsed[1])];
  if (!a || !b) return { title: "Comparison not found" };

  const title = `${a.name} vs ${b.name} — Which Is Better in 2026? Honest Comparison`;
  const description = `Choose ${a.name} if ${lowerFirst(a.bestFor[0] ?? a.tagline)} Choose ${b.name} if ${lowerFirst(
    b.bestFor[0] ?? b.tagline
  )} A side-by-side comparison of pricing, features, and who each is actually for.`;
  const canonical = canonicalSlugFor(a.id, b.id) ?? comparison;
  const url = `${SITE_CONFIG.url}/apps/compare/${canonical}`;

  return {
    title,
    description,
    keywords: [`${a.name} vs ${b.name}`, `${a.name} or ${b.name}`, `${a.name} alternative`, `${b.name} alternative`],
    alternates: { canonical: `/apps/compare/${canonical}` },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

/** Lowercases the first letter to fold a bestFor phrase into a sentence —
 *  but leaves a leading acronym (e.g. "US", "UK", "VAT") alone rather than
 *  producing "uS small businesses...". */
function lowerFirst(value: string): string {
  if (value.length === 0) return value;
  const firstWord = value.split(" ")[0];
  const isAcronym = firstWord.length > 1 && firstWord === firstWord.toUpperCase();
  if (isAcronym) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/** bestFor/avoidIf entries are authored as bullet-list fragments with no
 *  trailing period; verdict/regionNotes/freeTierReality are full sentences
 *  that already end in one. Folding a fragment into flowing prose needs a
 *  period added so two sentences don't run together. */
function endWithPeriod(value: string): string {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function ScriptJsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}

function buildComparisonFAQs(a: AppListing, b: AppListing, thirdAlt: AppListing | undefined): FAQItem[] {
  return [
    {
      q: `Is ${a.name} or ${b.name} cheaper?`,
      a: `${formatStartingPrice(a)} for ${a.name}, versus ${formatStartingPrice(b)} for ${b.name}. See the pricing table above for the full tier breakdown — the cheapest entry price isn't always the cheapest at the plan you'd actually need.`,
    },
    {
      q: `Which is better for freelancers, ${a.name} or ${b.name}?`,
      a: `${endWithPeriod(a.bestFor[0] ?? a.verdict)} Meanwhile, ${b.name}: ${endWithPeriod(
        b.bestFor[0] ?? b.verdict
      )} Check "Where each wins" above for the specific reasoning.`,
    },
    {
      q: `Can I switch from ${a.name} to ${b.name} later, or vice versa?`,
      a: `Most accounting/invoicing tools support exporting your data (clients, invoices, transactions) to CSV, and many accountants can help migrate the books. It's rarely instant or free of friction, though — factor in migration effort when the choice is close, not just the monthly price.`,
    },
    {
      q: `Does ${a.name} or ${b.name} have a better free tier?`,
      a: `${a.name}: ${a.hasFreeTier ? a.freeTierReality : `No permanent free plan — ${a.freeTierReality}`} ${b.name}: ${
        b.hasFreeTier ? b.freeTierReality : `No permanent free plan — ${b.freeTierReality}`
      }`,
    },
    {
      q: `Which works better outside the US, ${a.name} or ${b.name}?`,
      a: `${a.name}: ${a.regionNotes} ${b.name}: ${b.regionNotes}`,
    },
    {
      q: `What if neither ${a.name} nor ${b.name} is right for me?`,
      a: thirdAlt
        ? `Worth a look: ${thirdAlt.name} — ${thirdAlt.verdict} Or start with our free tools below and upgrade only once you actually outgrow them.`
        : `Browse the full directory for other options, or start with our free tools below and upgrade only once you actually outgrow them.`,
    },
  ];
}

function winnerLabel(winner: Winner, aName: string, bName: string): string | null {
  if (winner === "a") return aName;
  if (winner === "b") return bName;
  if (winner === "tie") return "Tie";
  return null;
}

function rowCellClass(isWinner: boolean): string {
  return cn(
    "px-4 py-3 align-top text-sm text-surface-700 dark:text-surface-200",
    isWinner && "bg-success-50/70 dark:bg-success-500/10"
  );
}

export default async function AppComparisonPage({ params }: RouteParams) {
  const { comparison } = await params;
  const parsed = parseComparisonSlug(comparison);
  if (!parsed) notFound();
  const [idA, idB] = parsed;

  const canonical = canonicalSlugFor(idA, idB);
  if (!canonical) notFound(); // not a curated pair — don't render arbitrary combinations
  if (canonical !== comparison) permanentRedirect(`/apps/compare/${canonical}`);

  const a = getAppById(idA);
  const b = getAppById(idB);
  if (!a || !b) notFound();

  const thirdAlt = ALL_APPS.filter((x) => x.category === a.category && x.id !== a.id && x.id !== b.id).sort(
    (x, y) => y.popularityScore - x.popularityScore
  )[0];

  const funnelToolIds = Array.from(new Set([...a.relatedUtilityAppsTools, ...b.relatedUtilityAppsTools]));
  const funnelTools = funnelToolIds
    .map((id) => TOOLS_BY_ID[id])
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const otherComparisons = COMPARISON_PAIRS.filter(([x, y]) => `${x}-vs-${y}` !== comparison)
    .map(([x, y]) => ({ x: getAppById(x), y: getAppById(y), slug: `${x}-vs-${y}` }))
    .filter((c): c is { x: AppListing; y: AppListing; slug: string } => Boolean(c.x && c.y))
    .sort((c1, c2) => {
      const relevance = (c: { x: AppListing; y: AppListing }) =>
        (c.x.id === a.id || c.x.id === b.id ? 1 : 0) + (c.y.id === a.id || c.y.id === b.id ? 1 : 0);
      return relevance(c2) - relevance(c1);
    })
    .slice(0, 6);

  const faqs = buildComparisonFAQs(a, b, thirdAlt);

  const breadcrumb = [
    { name: "Home", url: "/" },
    { name: "Apps", url: "/apps" },
    { name: `${a.name} vs ${b.name}`, url: `/apps/compare/${comparison}` },
  ];

  const pricingWinner = comparePricing(a, b);
  const freeTierWinner = compareFreeTier(a, b);
  const platformsWinner = comparePlatforms(a, b);

  const aTopTier = a.pricing[a.pricing.length - 1];
  const bTopTier = b.pricing[b.pricing.length - 1];

  return (
    <>
      <ScriptJsonLd data={generateBreadcrumbSchema(breadcrumb)} />
      <TrackAppView appId={comparison} eventType="compare_view" />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
            </li>
            <li className="flex items-center gap-1.5">
              <Link href="/apps" className="hover:text-surface-700 dark:hover:text-surface-200">
                Apps
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
            </li>
            <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
              {a.name} vs {b.name}
            </li>
          </ol>
        </nav>

        {/* 1. H1 */}
        <header className="mt-6">
          <div className="flex items-center gap-3">
            <AppLogo app={a} size={44} />
            <span className="text-lg font-bold text-surface-400 dark:text-surface-600">vs</span>
            <AppLogo app={b} size={44} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            {a.name} vs {b.name}: which should you actually choose?
          </h1>
        </header>

        <AdSlot position="top" />

        {/* 2. The answer up front */}
        <section className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-6 dark:border-primary-700/40 dark:bg-primary-500/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Short answer
          </p>
          <p className="mt-2 text-base leading-relaxed text-surface-900 dark:text-white">
            Choose <strong>{a.name}</strong> if {a.bestFor[0] ? lowerFirst(a.bestFor[0]) : `you need ${a.tagline}`}.{" "}
            Choose <strong>{b.name}</strong> if {b.bestFor[0] ? lowerFirst(b.bestFor[0]) : `you need ${b.tagline}`}.
          </p>
          {thirdAlt && (
            <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
              Honestly, if {thirdAlt.bestFor[0] ? lowerFirst(thirdAlt.bestFor[0]) : "neither of these quite fits"} —
              consider{" "}
              <Link href={`/apps/${thirdAlt.id}`} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                {thirdAlt.name}
              </Link>{" "}
              instead, or start with our free tools below.
            </p>
          )}
        </section>

        {/* 3. Side-by-side comparison table */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Side-by-side
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-900 dark:text-surface-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">—</th>
                  <th className="px-4 py-3 font-semibold">{a.name}</th>
                  <th className="px-4 py-3 font-semibold">{b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Starting price
                    {winnerLabel(pricingWinner, a.name, b.name) && (
                      <span className="mt-1 block text-[11px] font-medium text-success-600 dark:text-success-400">
                        {pricingWinner === "tie" ? "Tie" : `🏆 ${winnerLabel(pricingWinner, a.name, b.name)}`}
                      </span>
                    )}
                  </td>
                  <td className={rowCellClass(pricingWinner === "a")}>{formatStartingPrice(a)}</td>
                  <td className={rowCellClass(pricingWinner === "b")}>{formatStartingPrice(b)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Free tier
                    {winnerLabel(freeTierWinner, a.name, b.name) && (
                      <span className="mt-1 block text-[11px] font-medium text-success-600 dark:text-success-400">
                        {freeTierWinner === "tie" ? "Tie" : `🏆 ${winnerLabel(freeTierWinner, a.name, b.name)}`}
                      </span>
                    )}
                  </td>
                  <td className={rowCellClass(freeTierWinner === "a")}>{a.hasFreeTier ? "Yes" : "No"}</td>
                  <td className={rowCellClass(freeTierWinner === "b")}>{b.hasFreeTier ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Key features
                  </td>
                  <td className={rowCellClass(false)}>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {a.keyFeatures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={rowCellClass(false)}>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {b.keyFeatures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Integrations
                  </td>
                  <td className={rowCellClass(false)}>{a.integrations.join(", ")}</td>
                  <td className={rowCellClass(false)}>{b.integrations.join(", ")}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Platforms
                    {winnerLabel(platformsWinner, a.name, b.name) && (
                      <span className="mt-1 block text-[11px] font-medium text-success-600 dark:text-success-400">
                        {platformsWinner === "tie" ? "Tie" : `🏆 ${winnerLabel(platformsWinner, a.name, b.name)}`}
                      </span>
                    )}
                  </td>
                  <td className={cn(rowCellClass(platformsWinner === "a"), "capitalize")}>
                    {a.platforms.join(", ")}
                  </td>
                  <td className={cn(rowCellClass(platformsWinner === "b"), "capitalize")}>
                    {b.platforms.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Regional fit
                  </td>
                  <td className={rowCellClass(false)}>{a.regionNotes}</td>
                  <td className={rowCellClass(false)}>{b.regionNotes}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-sm font-semibold text-surface-900 dark:text-white">
                    Best for
                  </td>
                  <td className={rowCellClass(false)}>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {a.bestFor.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={rowCellClass(false)}>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {b.bestFor.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <AdSlot position="mid" />

        {/* 4. Where each wins */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Where {a.name} wins</h2>
            <ul className="mt-3 space-y-2 text-sm text-surface-700 dark:text-surface-200">
              {a.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Where {b.name} wins</h2>
            <ul className="mt-3 space-y-2 text-sm text-surface-700 dark:text-surface-200">
              {b.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Pricing at different scales */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
            Pricing as you grow
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Costs diverge as you scale — the cheapest entry plan isn&apos;t always the cheapest plan
            you&apos;ll actually need.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-900 dark:text-surface-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Scale</th>
                  <th className="px-4 py-3 font-semibold">{a.name}</th>
                  <th className="px-4 py-3 font-semibold">{b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-white">Solo / entry plan</td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">{formatStartingPrice(a)}</td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">{formatStartingPrice(b)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-white">
                    Growing team (highest published tier)
                  </td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">
                    {aTopTier ? formatTierPrice(aTopTier.priceMonthly, aTopTier.currency, "/mo") : "—"}
                  </td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">
                    {bTopTier ? formatTierPrice(bTopTier.priceMonthly, bTopTier.currency, "/mo") : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
            Exact per-seat and add-on costs vary — always confirm current team pricing directly with{" "}
            {a.name} and {b.name} before committing.
          </p>
        </section>

        {/* 6. Both CTAs */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
            <p className="mb-3 text-center text-sm font-semibold text-surface-900 dark:text-white">{a.name}</p>
            <AffiliateCTA app={a} source="compare" />
          </div>
          <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
            <p className="mb-3 text-center text-sm font-semibold text-surface-900 dark:text-white">{b.name}</p>
            <AffiliateCTA app={b} source="compare" />
          </div>
        </section>

        {/* 7. Or start free */}
        <StartFreeFunnel
          tools={funnelTools}
          introText={`Not sure ${a.name} or ${b.name} is worth paying for yet? Start with our free tools — come back when you outgrow them.`}
          className="mt-10"
        />

        <AdSlot position="bottom" />

        {/* 8. Other comparisons */}
        {otherComparisons.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Other comparisons</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {otherComparisons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/apps/compare/${c.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {c.x.name} vs {c.y.name} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 9. FAQ */}
        <div className="mt-10">
          <ToolFAQ items={faqs} title={`${a.name} vs ${b.name} FAQ`} />
        </div>
      </div>
    </>
  );
}
