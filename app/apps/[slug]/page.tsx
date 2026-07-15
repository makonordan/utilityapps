import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Globe2, ShieldCheck, XCircle } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { AffiliateCTA } from "@/components/apps/AffiliateCTA";
import { AppFeedback } from "@/components/apps/AppFeedback";
import { AppLogo } from "@/components/apps/AppLogo";
import { StartFreeFunnel } from "@/components/apps/StartFreeFunnel";
import { TrackAppView } from "@/components/apps/TrackAppView";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { ALL_APPS, APP_CATEGORIES, getAppById, type AppListing } from "@/lib/apps";
import {
  formatStartingPrice,
  formatTierPrice,
  industryLabel,
  REGION_NAME,
  SIZE_NAME,
  safeFormatDate,
} from "@/lib/apps/format";
import {
  generateAppReviewSchema,
  generateAppSoftwareSchema,
  generateBreadcrumbSchema,
  jsonLdString,
} from "@/lib/schema";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// generateStaticParams (and getAppById below) both read from ALL_APPS, which
// already excludes any listing with unverified pricing in production — see
// isPricingVerified() in lib/apps/index.ts. That's the guard: an app whose
// pricing still holds a "VERIFY" placeholder simply never gets a public
// param or a reachable getAppById() result outside development.
export async function generateStaticParams() {
  return ALL_APPS.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppById(slug);
  if (!app) return { title: "Software not found" };

  const title = `${app.name} Review — Pricing, Pros & Cons, and Who It's For`;
  const description = `${app.verdict} Starting price: ${formatStartingPrice(app)}. ${app.freeTierReality}`;
  const url = `${SITE_CONFIG.url}/apps/${app.id}`;

  return {
    title,
    description,
    keywords: [app.name, `${app.name} review`, `${app.name} pricing`, `${app.name} alternatives`, app.subCategory],
    alternates: { canonical: `/apps/${app.id}` },
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

function ScriptJsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}

function buildAppFAQs(app: AppListing, alternatives: AppListing[]): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      q: `Is ${app.name} free?`,
      a: app.hasFreeTier
        ? `Yes, there's a free tier. ${app.freeTierReality}`
        : `No — ${app.name} doesn't have a permanent free plan. ${app.freeTierReality}`,
    },
    {
      q: `How much does ${app.name} cost?`,
      a: `${formatStartingPrice(app)}. We verify pricing directly against ${app.name}'s own pricing page — see the pricing table above for the full breakdown of plans, and check the verified date before making a decision, since software pricing changes often.`,
    },
    {
      q: `Who is ${app.name} best for?`,
      a: app.bestFor.length > 0
        ? app.bestFor.join(" ")
        : `See "Choose this if..." above for who we think ${app.name} fits best.`,
    },
    {
      q: `Who should avoid ${app.name}?`,
      a: app.avoidIf.length > 0
        ? app.avoidIf.join(" ")
        : `See "Look elsewhere if..." above for who we think should skip ${app.name}.`,
    },
    {
      q: `Does ${app.name} work well outside the US?`,
      a: app.regionNotes || `${app.name} is used across ${app.regions.map((r) => REGION_NAME[r]).join(", ")} — check the Regional fit section above for specifics.`,
    },
    {
      q: `What are the best alternatives to ${app.name}?`,
      a: alternatives.length > 0
        ? `Worth comparing: ${alternatives.map((a) => a.name).join(", ")}. See the Alternatives section above for why you might pick one of these instead.`
        : `We're still building out alternatives in this category — check the full directory for other options.`,
    },
  ];
  return faqs;
}

export default async function AppListingPage({ params }: RouteParams) {
  const { slug } = await params;
  const app = getAppById(slug);
  if (!app) notFound();

  const category = APP_CATEGORIES.find((c) => c.id === app.category);

  const alternatives = ALL_APPS.filter((a) => a.category === app.category && a.id !== app.id)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 4);

  const funnelTools = app.relatedUtilityAppsTools
    .map((id) => TOOLS_BY_ID[id])
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const faqs = buildAppFAQs(app, alternatives);

  const breadcrumb = [
    { name: "Home", url: "/" },
    { name: "Apps", url: "/apps" },
    ...(category ? [{ name: category.name, url: "/apps" }] : []),
    { name: app.name, url: `/apps/${app.id}` },
  ];

  const lastReviewedLabel = safeFormatDate(app.lastReviewed);
  const pricingVerifiedLabel = safeFormatDate(app.pricingVerifiedDate);

  return (
    <>
      <ScriptJsonLd data={generateBreadcrumbSchema(breadcrumb)} />
      <ScriptJsonLd data={generateAppSoftwareSchema(app)} />
      <ScriptJsonLd data={generateAppReviewSchema(app)} />
      <TrackAppView appId={app.id} eventType="listing_view" />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumb.slice(0, -1).map((item) => (
              <li key={item.url + item.name} className="flex items-center gap-1.5">
                <Link href={item.url} className="hover:text-surface-700 dark:hover:text-surface-200">
                  {item.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
              </li>
            ))}
            <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
              {app.name}
            </li>
          </ol>
        </nav>

        {/* 1. Header */}
        <header className="mt-6">
          <div className="flex items-start gap-4">
            <AppLogo app={app} size={56} />
            <div className="min-w-0 flex-1">
              {category && (
                <Link
                  href="/apps"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400"
                >
                  {category.name}
                </Link>
              )}
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
                {app.name}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-surface-600 dark:text-surface-300">{app.tagline}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.businessSizes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-surface-200 px-2.5 py-0.5 text-xs text-surface-600 dark:border-surface-800 dark:text-surface-400"
              >
                {SIZE_NAME[s]}
              </span>
            ))}
            {app.regions.map((r) => (
              <span
                key={r}
                className="rounded-full border border-surface-200 px-2.5 py-0.5 text-xs text-surface-600 dark:border-surface-800 dark:text-surface-400"
              >
                {REGION_NAME[r]}
              </span>
            ))}
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 dark:text-surface-400">
            <ShieldCheck className="h-3.5 w-3.5 text-success-600 dark:text-success-400" />
            Last reviewed {lastReviewedLabel ?? "not yet reviewed"} · Pricing verified{" "}
            {pricingVerifiedLabel ?? "not yet verified"}
          </p>
        </header>

        <AdSlot position="top" />

        {/* 2. Our verdict */}
        <section className="mt-8 rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-6 dark:border-primary-700/40 dark:bg-primary-500/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Our take
          </p>
          <p className="mt-2 text-lg font-semibold leading-snug text-surface-900 dark:text-white">
            {app.verdict}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-700 dark:text-success-400">
                <CheckCircle2 className="h-4 w-4" />
                Choose this if...
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-surface-700 dark:text-surface-200">
                {app.bestFor.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-warning-700 dark:text-warning-400">
                <XCircle className="h-4 w-4" />
                Look elsewhere if...
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-surface-700 dark:text-surface-200">
                {app.avoidIf.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Primary CTA */}
        <section className="mt-6 rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
          <AffiliateCTA app={app} source="listing" />
        </section>

        {/* 4. Pricing table */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Pricing
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Verified {pricingVerifiedLabel ?? "not yet"} against{" "}
            <a
              href={app.pricingSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              {app.name}&apos;s own pricing page
            </a>
            .
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-900 dark:text-surface-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Monthly</th>
                  <th className="px-4 py-3 font-semibold">Annual</th>
                  <th className="px-4 py-3 font-semibold">Key limits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {app.pricing.map((tier) => (
                  <tr key={tier.name}>
                    <td className="px-4 py-3 font-semibold text-surface-900 dark:text-white">{tier.name}</td>
                    <td className="px-4 py-3 text-surface-700 dark:text-surface-200">
                      {formatTierPrice(tier.priceMonthly, tier.currency, "/mo")}
                    </td>
                    <td className="px-4 py-3 text-surface-700 dark:text-surface-200">
                      {formatTierPrice(tier.priceAnnual, tier.currency, "/yr")}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                      {tier.keyLimits.join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Free tier reality */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
            Free tier reality
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-700 dark:text-surface-300">
            {app.hasFreeTier
              ? app.freeTierReality
              : `There's no permanent free plan. ${app.freeTierReality}`}
          </p>
        </section>

        <AdSlot position="mid" />

        {/* 6. Pros / Cons */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="inline-flex items-center gap-1.5 text-lg font-bold text-success-700 dark:text-success-400">
              <CheckCircle2 className="h-5 w-5" />
              Pros
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-surface-700 dark:text-surface-200">
              {app.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="inline-flex items-center gap-1.5 text-lg font-bold text-warning-700 dark:text-warning-400">
              <XCircle className="h-5 w-5" />
              Cons
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-surface-700 dark:text-surface-200">
              {app.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Key features + integrations + platforms */}
        <section className="mt-10 grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Key features
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-surface-700 dark:text-surface-200">
              {app.keyFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Integrations
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {app.integrations.map((i) => (
                <li
                  key={i}
                  className="rounded-full border border-surface-200 px-2.5 py-0.5 text-xs text-surface-600 dark:border-surface-800 dark:text-surface-400"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Platforms
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {app.platforms.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-surface-200 px-2.5 py-0.5 text-xs capitalize text-surface-600 dark:border-surface-800 dark:text-surface-400"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Regional fit */}
        <section className="mt-10 rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
          <h2 className="inline-flex items-center gap-1.5 text-lg font-bold text-surface-900 dark:text-white">
            <Globe2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            Regional fit
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-700 dark:text-surface-300">
            {app.regionNotes}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {app.regions.map((r) => (
              <li
                key={r}
                className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
              >
                {REGION_NAME[r]}
              </li>
            ))}
          </ul>
        </section>

        {/* 9. Best for industries / business sizes */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Best for</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {app.industries.map((id) => (
              <Link
                key={id}
                href={`/apps?industry=${encodeURIComponent(id)}`}
                className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
              >
                {industryLabel(id)}
              </Link>
            ))}
            {app.businessSizes.map((id) => (
              <Link
                key={id}
                href={`/apps?size=${id}`}
                className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
              >
                {SIZE_NAME[id]}
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Funnel to our own tools */}
        <StartFreeFunnel
          tools={funnelTools}
          introText={`Not ready for ${app.name}? Start with our free tools — come back when you outgrow them.`}
          className="mt-10"
        />

        {/* 11. Alternatives */}
        {alternatives.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Alternatives</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {alternatives.map((alt) => (
                <li key={alt.id}>
                  <Link
                    href={`/apps/${alt.id}`}
                    className="group flex h-full flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                  >
                    <div className="flex items-center gap-2">
                      <AppLogo app={alt} size={28} />
                      <span className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {alt.name}
                      </span>
                    </div>
                    {alt.bestFor[0] && (
                      <p className="text-xs text-surface-600 dark:text-surface-400">
                        Pick this instead if: {alt.bestFor[0]}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AdSlot position="bottom" />

        {/* 12. Was this review helpful */}
        <section className="mt-10">
          <AppFeedback appId={app.id} appName={app.name} />
        </section>

        {/* 13. FAQ */}
        <div className="mt-10">
          <ToolFAQ items={faqs} title={`${app.name} FAQ`} />
        </div>
      </div>
    </>
  );
}
