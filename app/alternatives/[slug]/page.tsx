import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { CATEGORIES } from "@/lib/categories";
import {
  getCompetitor,
  getCompetitorsWithTools,
  getToolIdsForCompetitor,
  type Competitor,
} from "@/lib/competitorComparisons";
import { getIcon } from "@/lib/icons";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  jsonLdString,
} from "@/lib/schema";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color])
);

export async function generateStaticParams() {
  return getCompetitorsWithTools().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const competitor = getCompetitor(slug);
  if (!competitor) return { title: "Alternative not found" };

  const title = `Free ${competitor.name} Alternatives`;
  const description = `Looking for a ${competitor.name} alternative? UtilityApps covers the same jobs free, with no signup, no daily caps, and no Pro upsell. ${competitor.blurb}`;

  return {
    title,
    description,
    keywords: [
      `${competitor.name} alternative`,
      `free ${competitor.name} alternative`,
      `${competitor.name} alternatives`,
      `${competitor.name} replacement`,
      `best ${competitor.name} alternative`,
      `alternatives to ${competitor.name}`,
    ],
    alternates: { canonical: `/alternatives/${slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/alternatives/${slug}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(`Free ${competitor.name} Alternatives`)}&description=${encodeURIComponent("No signup, no limits")}&type=tool`,
          width: 1200,
          height: 630,
          alt: `Free ${competitor.name} alternatives`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export default async function AlternativesPage({ params }: RouteParams) {
  const { slug } = await params;
  const competitor = getCompetitor(slug);
  if (!competitor) notFound();

  const toolIds = getToolIdsForCompetitor(slug);
  const tools = toolIds
    .map((id) => TOOLS_BY_ID[id])
    .filter((t): t is Tool => Boolean(t));
  if (tools.length === 0) notFound();

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Alternatives", url: `${SITE_CONFIG.url}/alternatives` },
    {
      name: `${competitor.name} alternatives`,
      url: `${SITE_CONFIG.url}/alternatives/${slug}`,
    },
  ];

  const faqs = buildAlternativesFAQs(competitor, tools);

  return (
    <>
      <Schema data={generateBreadcrumbSchema(breadcrumb)} />
      <Schema data={generateFAQSchema(faqs)} />

      <Hero competitor={competitor} count={tools.length} />

      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <p className="text-base leading-relaxed text-surface-700 dark:text-surface-200">
          {competitor.blurb} If that pricing or workflow doesn&rsquo;t fit
          you, the {tools.length} UtilityApps {tools.length === 1 ? "tool" : "tools"} below
          cover the same {jobNoun(tools.length)} for free, with no signup,
          no daily limit, and no Pro upsell. Most run inside your browser
          so the file never leaves your device.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Free {competitor.name} alternatives on {SITE_CONFIG.name}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <AlternativeCard key={tool.id} tool={tool} competitor={competitor} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <WhySwitch competitor={competitor} />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {competitor.name} facts verified on {competitor.factsVerifiedOn} from{" "}
          <a
            href={competitor.homepage}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-surface-700 dark:hover:text-surface-200"
          >
            {new URL(competitor.homepage).hostname}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          . Their pricing or limits may have changed — check their site for
          the latest.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ToolFAQ items={faqs} title="Common questions" />
      </section>
    </>
  );
}

function Schema({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}

function Hero({ competitor, count }: { competitor: Competitor; count: number }) {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
            <li
              className="font-medium text-surface-700 dark:text-surface-200"
              aria-current="page"
            >
              {competitor.name} alternatives
            </li>
          </ol>
        </nav>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Free · No signup · No limits
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Free {competitor.name} alternatives
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          {count} UtilityApps {count === 1 ? "tool that covers" : "tools that cover"} the
          same {jobNoun(count)} {competitor.name} does — without the signup,
          the daily cap, or the Pro upsell.
        </p>
      </div>
    </section>
  );
}

function AlternativeCard({
  tool,
  competitor,
}: {
  tool: Tool;
  competitor: Competitor;
}) {
  const Icon = getIcon(tool.icon);
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";

  return (
    <article className="group relative rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
          style={{ backgroundColor: accent }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-surface-900 dark:text-white">
            {tool.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-surface-600 dark:text-surface-400">
            {tool.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={tool.href}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-700 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
            >
              Open {tool.name}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
            <Link
              href={`/vs/${tool.id}-vs-${competitor.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-surface-200 px-3 py-1 font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-800 dark:border-surface-700 dark:text-surface-300 dark:hover:border-surface-600 dark:hover:text-surface-100"
            >
              vs {competitor.name}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function WhySwitch({ competitor }: { competitor: Competitor }) {
  const reasons = buildWhySwitch(competitor);
  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-800 dark:bg-surface-900/40">
      <h2 className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
        Why switch from {competitor.name}?
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-200"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildWhySwitch(competitor: Competitor): string[] {
  const reasons: string[] = [];

  // Pull factual reasons from the competitor's features when they're a
  // net negative ("tone: no"). Keeps the switch case grounded in the
  // same data the /vs/ pages display — no separate copy to drift.
  const f = competitor.features;
  if (f.pricing.tone === "no") reasons.push(`UtilityApps stays free — no Pro upsell or paid tier`);
  if (f.signupRequired.tone === "no")
    reasons.push(`No account needed — open the tool and use it`);
  if (f.processingLocation.tone === "no")
    reasons.push(`Most jobs run in your browser — files don't leave your device`);
  if (f.freeTierLimit.tone === "no")
    reasons.push(`No daily-task cap or file-size paywall`);
  if (f.watermarks.tone === "no") reasons.push(`No watermark on exports`);
  if (f.mobile.tone === "no") reasons.push(`Works on phones with no app install`);

  if (reasons.length === 0) {
    // Defensive: every competitor we ship should have at least one
    // negative — but never render an empty section if we add a
    // squeaky-clean competitor in the future.
    reasons.push(
      `UtilityApps is free with no signup`,
      `Open the tool, use it, close the tab`,
      `No upsell, no email capture, no Pro tier`
    );
  }

  return reasons;
}

function buildAlternativesFAQs(competitor: Competitor, tools: Tool[]): FAQItem[] {
  const first = tools[0];
  const list = tools.map((t) => t.name).join(", ");

  return [
    {
      q: `What's the best free ${competitor.name} alternative?`,
      a: `It depends on the specific job. For ${first.description.toLowerCase()} ${first.name} on UtilityApps is a direct free replacement. The full set covers ${tools.length} ${competitor.name}-adjacent ${tools.length === 1 ? "tool" : "tools"}: ${list}.`,
    },
    {
      q: `Are these really free?`,
      a: `Yes. ${SITE_CONFIG.name} is monetized through optional digital products and display ads on the surrounding pages — never by gating the tools themselves. No signup, no usage caps, no Pro tier.`,
    },
    {
      q: `Are my files uploaded?`,
      a: `For most tools in this list, no — they run in your browser. A few (e.g. Office↔PDF conversion, background removal) genuinely need server-side processing; for those we upload over HTTPS and delete the file immediately after processing.`,
    },
    {
      q: `Why is ${competitor.name} paid if you can do this free?`,
      a: `${competitor.name} runs a larger operation (mobile apps, dedicated infrastructure, a team) and charges to fund it. ${SITE_CONFIG.name} is a leaner setup funded by ads on surrounding pages — different model, same job.`,
    },
    {
      q: `How recent are these comparisons?`,
      a: `${competitor.name}'s pricing and limits were verified on ${competitor.factsVerifiedOn}. We re-check periodically — see the link to ${competitor.name}'s official site above for the latest.`,
    },
  ];
}

function jobNoun(count: number): string {
  return count === 1 ? "job" : "jobs";
}
