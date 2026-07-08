import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  X as XIcon,
} from "lucide-react";

import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { CATEGORIES } from "@/lib/categories";
import {
  COMPETITORS,
  TOOL_VS_COMPETITOR,
  US_FACTS,
  getCompetitor,
  getVsNarrative,
  type Competitor,
  type CompetitorFeature,
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

const SEPARATOR = "-vs-";

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color])
);

/** Pull our-tool-id + competitor-slug back out of a single-segment slug. The
 *  competitor slug can itself contain hyphens (e.g. "remove-bg"), so we
 *  walk the known competitor list rather than splitting on the first match. */
function parseSlug(slug: string): { toolId: string; competitorSlug: string } | null {
  for (const competitorSlug of Object.keys(COMPETITORS)) {
    const suffix = `${SEPARATOR}${competitorSlug}`;
    if (slug.endsWith(suffix)) {
      const toolId = slug.slice(0, -suffix.length);
      if (!toolId) return null;
      return { toolId, competitorSlug };
    }
  }
  return null;
}

export async function generateStaticParams() {
  return TOOL_VS_COMPETITOR.map(({ toolId, competitorSlug }) => ({
    slug: `${toolId}${SEPARATOR}${competitorSlug}`,
  }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Comparison not found" };
  const tool = TOOLS_BY_ID[parsed.toolId];
  const competitor = getCompetitor(parsed.competitorSlug);
  if (!tool || !competitor) return { title: "Comparison not found" };

  const title = `${tool.name} vs ${competitor.name} — Free ${competitor.name} Alternative | ${SITE_CONFIG.name}`;
  const description = `Compare ${tool.name} (free, no signup) with ${competitor.name}: pricing, signup, file caps, watermarks. Side-by-side, fact-checked ${competitor.factsVerifiedOn}.`;

  return {
    title,
    description,
    keywords: [
      `${tool.name} vs ${competitor.name}`,
      `${competitor.name} alternative`,
      `free ${competitor.name} alternative`,
      `${competitor.name} vs ${tool.name}`,
      `${competitor.name} free`,
      ...tool.keywords.slice(0, 3),
    ],
    alternates: { canonical: `/vs/${slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/vs/${slug}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(`${tool.name} vs ${competitor.name}`)}&description=${encodeURIComponent(`Free ${competitor.name} alternative`)}&type=tool`,
          width: 1200,
          height: 630,
          alt: `${tool.name} vs ${competitor.name}`,
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

export default async function VsPage({ params }: RouteParams) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const tool = TOOLS_BY_ID[parsed.toolId];
  const competitor = getCompetitor(parsed.competitorSlug);
  if (!tool || !competitor) notFound();

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    {
      name: `${tool.name} vs ${competitor.name}`,
      url: `${SITE_CONFIG.url}/vs/${slug}`,
    },
  ];

  const faqs = buildVsFAQs(tool, competitor);
  const narrative = getVsNarrative(tool.id, competitor.slug);

  return (
    <>
      <Schema data={generateBreadcrumbSchema(breadcrumb)} />
      <Schema data={generateFAQSchema(faqs)} />

      <Hero tool={tool} competitor={competitor} />

      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <p className="text-base leading-relaxed text-surface-700 dark:text-surface-200">
          {narrative}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ComparisonTable tool={tool} competitor={competitor} />
        <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
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
          . Their pricing or limits may have changed since — check their site
          for the latest.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <PrimaryCta tool={tool} />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <Link
          href={`/alternatives/${competitor.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline dark:text-primary-300"
        >
          See all free {competitor.name} alternatives
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
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

function Hero({ tool, competitor }: { tool: Tool; competitor: Competitor }) {
  const Icon = getIcon(tool.icon);
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";

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
            <li>
              <Link href="/tools" className="hover:text-surface-700 dark:hover:text-surface-200">
                Tools
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
            <li
              className="font-medium text-surface-700 dark:text-surface-200"
              aria-current="page"
            >
              {tool.name} vs {competitor.name}
            </li>
          </ol>
        </nav>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          <Sparkles className="h-3.5 w-3.5" />
          Free {competitor.name} alternative
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          {tool.name} vs {competitor.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          {competitor.blurb}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <UsPill tool={tool} Icon={Icon} accent={accent} />
          <CompetitorPill competitor={competitor} />
        </div>
      </div>
    </section>
  );
}

function UsPill({
  tool,
  Icon,
  accent,
}: {
  tool: Tool;
  Icon: ReturnType<typeof getIcon>;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary-200 bg-white p-4 dark:border-primary-700/50 dark:bg-surface-900">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
          {tool.name}
        </p>
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          {SITE_CONFIG.name} · free, no signup
        </p>
      </div>
    </div>
  );
}

function CompetitorPill({ competitor }: { competitor: Competitor }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400"
        aria-hidden="true"
      >
        <ShieldCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
          {competitor.name}
        </p>
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          Verified {competitor.factsVerifiedOn}
        </p>
      </div>
    </div>
  );
}

interface ComparisonRow {
  label: string;
  us: CompetitorFeature;
  them: CompetitorFeature;
}

function ComparisonTable({ tool, competitor }: { tool: Tool; competitor: Competitor }) {
  const rows = buildComparisonRows(tool, competitor);

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-900">
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              Feature
            </th>
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              {tool.name}
            </th>
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              {competitor.name}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-950">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="border-b border-surface-100 px-4 py-3 font-medium text-surface-900 dark:border-surface-800 dark:text-white">
                {row.label}
              </td>
              <Cell value={row.us} />
              <Cell value={row.them} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }: { value: CompetitorFeature }) {
  return (
    <td className="border-b border-surface-100 px-4 py-3 align-top text-surface-700 dark:border-surface-800 dark:text-surface-200">
      <span className="inline-flex items-start gap-2">
        {value.tone === "yes" && (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-label="Pro" />
        )}
        {value.tone === "no" && (
          <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" aria-label="Con" />
        )}
        <span>{value.value}</span>
      </span>
    </td>
  );
}

function PrimaryCta({ tool }: { tool: Tool }) {
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";
  return (
    <Link
      href={tool.href}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50/40 p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-primary-700/50 dark:bg-primary-500/5 dark:hover:border-primary-600"
    >
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Try the free alternative
        </span>
        <p className="mt-0.5 truncate text-lg font-bold text-surface-900 dark:text-white">
          Open {tool.name}
        </p>
        <p className="line-clamp-1 text-xs text-surface-600 dark:text-surface-400">
          {tool.description}
        </p>
      </div>
      <span
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-glow"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function buildComparisonRows(tool: Tool, competitor: Competitor): ComparisonRow[] {
  return [
    {
      label: "Pricing",
      us: US_FACTS.pricing,
      them: competitor.features.pricing,
    },
    {
      label: "Signup required",
      us: US_FACTS.signupRequired,
      them: competitor.features.signupRequired,
    },
    {
      label: "Where processing happens",
      us: processingLocationFor(tool),
      them: competitor.features.processingLocation,
    },
    {
      label: "Free-tier limits",
      us: US_FACTS.freeTierLimit,
      them: competitor.features.freeTierLimit,
    },
    {
      label: "Watermarks",
      us: US_FACTS.watermarks,
      them: competitor.features.watermarks,
    },
    {
      label: "Mobile-friendly",
      us: US_FACTS.mobile,
      them: competitor.features.mobile,
    },
  ];
}

/** A few of our tools genuinely do call a server-side API (Office↔PDF,
 *  background removal, some video work). We tell the truth on the row
 *  rather than blanket-claim "browser" everywhere — that's a credibility
 *  signal that survives the read. */
const SERVER_SIDE_TOOL_IDS = new Set<string>([
  "pdf-to-word",
  "pdf-to-excel",
  "pdf-to-ppt",
  "word-to-pdf",
  "excel-to-pdf",
  "ppt-to-pdf",
  "remove-background",
  "upscale-image",
]);

function processingLocationFor(tool: Tool): CompetitorFeature {
  if (SERVER_SIDE_TOOL_IDS.has(tool.id)) {
    return {
      value: "Server (file uploaded, deleted after processing)",
      tone: "no",
    };
  }
  return { value: "Inside your browser — file never uploaded", tone: "yes" };
}

function buildVsFAQs(tool: Tool, competitor: Competitor): FAQItem[] {
  const lower = tool.name.toLowerCase();
  return [
    {
      q: `Is ${tool.name} a free ${competitor.name} alternative?`,
      a: `Yes. ${tool.name} is completely free with no signup, no daily limits, and no Pro upsell. It covers the same core ${lower} job ${competitor.name} does.`,
    },
    {
      q: `What's the catch?`,
      a: `${SITE_CONFIG.name} is monetized through optional digital products and tasteful display ads on the surrounding pages — never by gating the tools themselves. ${tool.name} has no usage cap, no signup, and no watermark on the output.`,
    },
    {
      q: `Is my file uploaded to your servers?`,
      a: SERVER_SIDE_TOOL_IDS.has(tool.id)
        ? `For this specific tool, yes — the conversion needs server-side processing that doesn't run in the browser. The file is sent over HTTPS, processed, and deleted immediately. We don't keep it.`
        : `No. ${tool.name} runs entirely in your browser. The file never leaves your device — we couldn't see it even if we wanted to.`,
    },
    {
      q: `Why does ${competitor.name} cost money if you can do it free?`,
      a: `${competitor.name} runs a larger product (mobile apps, dedicated infrastructure, a team) and charges to fund it. ${SITE_CONFIG.name} is a leaner operation funded by ads on the surrounding pages and digital products — different model, same job.`,
    },
    {
      q: `How recent are the comparison facts?`,
      a: `${competitor.name}'s pricing and limits were verified on ${competitor.factsVerifiedOn}. We re-check periodically, but their plans can change — the link at the bottom of the comparison table goes to their official site.`,
    },
  ];
}
