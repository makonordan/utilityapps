import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  X as XIcon,
} from "lucide-react";

import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { CATEGORIES } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  jsonLdString,
} from "@/lib/schema";
import { TOOLS, TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG, cn, formatNumber } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const SEPARATOR = "-vs-";

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color])
);

function parseSlug(slug: string): { aId: string; bId: string } | null {
  const parts = slug.split(SEPARATOR);
  if (parts.length !== 2) return null;
  const [aId, bId] = parts;
  if (!aId || !bId || aId === bId) return null;
  return { aId, bId };
}

export async function generateStaticParams() {
  // Generate one comparison page per (tool, related) pair, deduplicated so
  // /a-vs-b and /b-vs-a don't both render. ~50-80 pages depending on the
  // related-tools graph — pure programmatic SEO with no manual list.
  const seen = new Set<string>();
  const params: { slug: string }[] = [];
  for (const tool of TOOLS) {
    for (const relatedId of tool.relatedTools) {
      if (!TOOLS_BY_ID[relatedId]) continue;
      const ordered = [tool.id, relatedId].sort();
      const key = ordered.join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ slug: `${ordered[0]}${SEPARATOR}${ordered[1]}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Comparison not found" };
  const a = TOOLS_BY_ID[parsed.aId];
  const b = TOOLS_BY_ID[parsed.bId];
  if (!a || !b) return { title: "Comparison not found" };

  const title = `${a.name} vs ${b.name} — Which One Should You Use? | ${SITE_CONFIG.name}`;
  const description = `Side-by-side comparison of ${a.name} and ${b.name}: features, use cases, and which one fits your situation. Both are free on ${SITE_CONFIG.name}.`;

  return {
    title,
    description,
    keywords: [
      `${a.name} vs ${b.name}`,
      `${a.name} or ${b.name}`,
      `${a.name} compared to ${b.name}`,
      `${a.name.toLowerCase()} ${b.name.toLowerCase()}`,
      "free online tools",
    ],
    alternates: { canonical: `/tools/compare/${slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/tools/compare/${slug}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(`${a.name} vs ${b.name}`)}&description=${encodeURIComponent("Side-by-side comparison")}&type=tool`,
          width: 1200,
          height: 630,
          alt: `${a.name} vs ${b.name}`,
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

export default async function ComparePage({ params }: RouteParams) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const a = TOOLS_BY_ID[parsed.aId];
  const b = TOOLS_BY_ID[parsed.bId];
  if (!a || !b) notFound();

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    { name: "Compare", url: `${SITE_CONFIG.url}/tools/compare` },
    { name: `${a.name} vs ${b.name}`, url: `${SITE_CONFIG.url}/tools/compare/${slug}` },
  ];

  const faqs = buildComparisonFAQs(a, b);

  return (
    <>
      <Schema data={generateBreadcrumbSchema(breadcrumb)} />
      <Schema data={generateFAQSchema(faqs)} />

      <Hero a={a} b={b} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ComparisonTable a={a} b={b} />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            When to use each
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Both tools are free. The better choice depends on what you&apos;re trying to do.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <UseCaseCard tool={a} other={b} />
          <UseCaseCard tool={b} other={a} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <PrimaryCta tool={a} />
          <PrimaryCta tool={b} />
        </div>
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

function Hero({ a, b }: { a: Tool; b: Tool }) {
  const IconA = getIcon(a.icon);
  const IconB = getIcon(b.icon);
  const accentA = CATEGORY_COLOR[a.category] ?? "#0066FF";
  const accentB = CATEGORY_COLOR[b.category] ?? "#7C3AED";

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
            <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
              {a.name} vs {b.name}
            </li>
          </ol>
        </nav>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          <Sparkles className="h-3.5 w-3.5" />
          Comparison · both tools are free
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          {a.name} vs {b.name} — which one should you use?
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Side-by-side comparison of features, use cases, and pricing for two of our most-used tools.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ToolPill tool={a} Icon={IconA} accent={accentA} />
          <ToolPill tool={b} Icon={IconB} accent={accentB} />
        </div>
      </div>
    </section>
  );
}

function ToolPill({
  tool,
  Icon,
  accent,
}: {
  tool: Tool;
  Icon: ReturnType<typeof getIcon>;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
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
          {tool.category}
        </p>
      </div>
    </div>
  );
}

interface ComparisonRow {
  label: string;
  a: { value: string; tone?: "yes" | "no" };
  b: { value: string; tone?: "yes" | "no" };
}

function ComparisonTable({ a, b }: { a: Tool; b: Tool }) {
  const rows = buildComparisonRows(a, b);

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-900">
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              Feature
            </th>
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              {a.name}
            </th>
            <th className="border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:text-surface-400">
              {b.name}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-950">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="border-b border-surface-100 px-4 py-3 font-medium text-surface-900 dark:border-surface-800 dark:text-white">
                {row.label}
              </td>
              <Cell value={row.a} />
              <Cell value={row.b} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }: { value: ComparisonRow["a"] }) {
  return (
    <td className="border-b border-surface-100 px-4 py-3 align-top text-surface-700 dark:border-surface-800 dark:text-surface-200">
      <span className="inline-flex items-start gap-2">
        {value.tone === "yes" && <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />}
        {value.tone === "no" && <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />}
        <span>{value.value}</span>
      </span>
    </td>
  );
}

function UseCaseCard({ tool, other }: { tool: Tool; other: Tool }) {
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";
  return (
    <article className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <h3 className="text-base font-semibold text-surface-900 dark:text-white">
          Use {tool.name} when…
        </h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-surface-700 dark:text-surface-200">
        {buildUseCases(tool, other).map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PrimaryCta({ tool }: { tool: Tool }) {
  const accent = CATEGORY_COLOR[tool.category] ?? "#0066FF";
  return (
    <Link
      href={tool.href}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
    >
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Try it now
        </span>
        <p className="mt-0.5 truncate text-base font-bold text-surface-900 dark:text-white">
          {tool.name}
        </p>
        <p className="line-clamp-1 text-xs text-surface-500 dark:text-surface-400">
          {tool.description}
        </p>
      </div>
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow"
        )}
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function buildComparisonRows(a: Tool, b: Tool): ComparisonRow[] {
  const sharedKeyword = (() => {
    const setA = new Set(a.keywords.map((k) => k.toLowerCase()));
    return b.keywords.find((k) => setA.has(k.toLowerCase())) ?? null;
  })();

  return [
    {
      label: "Category",
      a: { value: a.category },
      b: { value: b.category },
    },
    {
      label: "Free to use",
      a: { value: "Yes — no signup", tone: "yes" },
      b: { value: "Yes — no signup", tone: "yes" },
    },
    {
      label: "Runs in browser",
      a: { value: "Yes", tone: "yes" },
      b: { value: "Yes", tone: "yes" },
    },
    {
      label: "Standalone tool site",
      a: a.externalHref
        ? { value: "Yes — dedicated subdomain", tone: "yes" }
        : { value: "Embedded on UtilityApps", tone: "no" },
      b: b.externalHref
        ? { value: "Yes — dedicated subdomain", tone: "yes" }
        : { value: "Embedded on UtilityApps", tone: "no" },
    },
    {
      label: "Best for",
      a: { value: a.description },
      b: { value: b.description },
    },
    {
      label: "Top keyword",
      a: { value: a.keywords[0] ?? a.name },
      b: { value: b.keywords[0] ?? b.name },
    },
    {
      label: "Common ground",
      a: { value: sharedKeyword ?? "—" },
      b: { value: sharedKeyword ?? "—" },
    },
    {
      label: "Mobile-friendly",
      a: { value: "Yes", tone: "yes" },
      b: { value: "Yes", tone: "yes" },
    },
  ];
}

function buildUseCases(tool: Tool, other: Tool): string[] {
  return [
    `You need ${tool.keywords[0] ?? tool.name.toLowerCase()} specifically.`,
    `You're working in the ${tool.category.toLowerCase()} category and want a focused tool.`,
    tool.featured
      ? `You want a battle-tested option — ${tool.name} is one of our most-used tools.`
      : `You prefer a lightweight, focused tool over the broader ${other.name}.`,
    tool.externalHref
      ? `You want the dedicated standalone site with the full feature set.`
      : `You want a quick, embedded version that runs in the same page.`,
  ];
}

function buildComparisonFAQs(a: Tool, b: Tool): FAQItem[] {
  return [
    {
      q: `What's the difference between ${a.name} and ${b.name}?`,
      a: `${a.name} is built for ${a.description.toLowerCase()} ${b.name} is built for ${b.description.toLowerCase()} They share the same UtilityApps quality bar — free, no signup, mobile-friendly — but solve adjacent problems.`,
    },
    {
      q: `Which one should I use?`,
      a: `Use ${a.name} if your primary need matches its description. Use ${b.name} if your need matches its description. Both are free, so trying both is also a valid answer.`,
    },
    {
      q: `Are both ${a.name} and ${b.name} really free?`,
      a: `Yes. Both tools are free with no signup, no credit card, and no usage caps. We monetize through optional digital products and tasteful display ads, never by gating the tools.`,
    },
    {
      q: `Can I use both at the same time?`,
      a: `Yes. Many users keep both bookmarked. UtilityApps tools are designed to compose — output from one tool is often useful input to another.`,
    },
    {
      q: `Are they private?`,
      a: `Both tools follow the UtilityApps privacy model: most processing happens in your browser, and we never log inputs. See the privacy policy for details.`,
    },
  ];
}
