import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  Clock,
  DollarSign,
  MousePointerClick,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

import { ComingSoonNotify } from "@/components/tools/ComingSoonNotify";
import { IN_HOUSE_TOOLS } from "@/components/tools/in-house/registry";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolEmbed } from "@/components/tools/ToolEmbed";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { UsageCounter } from "@/components/tools/UsageCounter";
import { AdSlot } from "@/components/ads/AdSlot";
import { CATEGORIES, getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { getRelatedPosts } from "@/lib/posts";
import { TOOLS, TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG, cn, formatDate } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * Tools that ship a dedicated page under /app/tools/<slug>/page.tsx.
 * They take precedence over this dynamic catch-all and must be excluded
 * from generateStaticParams so the build doesn't try to emit two routes
 * for the same path.
 */
const DEDICATED_TOOL_PAGES = new Set<string>([
  "compress-image",
  "resize-image",
  "crop-image",
  "convert-to-jpg",
  "convert-from-jpg",
  "photo-editor",
  "upscale-image",
  "remove-background",
  "watermark-image",
  "meme-generator",
  "rotate-image",
  "html-to-image",
  "blur-face",
]);

export async function generateStaticParams() {
  return TOOLS.filter((tool) => !DEDICATED_TOOL_PAGES.has(tool.id)).map((tool) => ({
    slug: tool.id,
  }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS_BY_ID[slug];
  if (!tool) {
    return { title: "Tool not found" };
  }

  const title = `${tool.name} — Free Online ${tool.name} | ${SITE_CONFIG.name}`;
  const description = tool.longDescription;
  const ogImage = `${SITE_CONFIG.url}/og/tools/${tool.id}`;

  return {
    title,
    description,
    keywords: [...tool.keywords, tool.category, "free online tool", "no signup"],
    alternates: { canonical: `/tools/${tool.id}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/tools/${tool.id}`,
      siteName: SITE_CONFIG.name,
      images: [{ url: ogImage, width: 800, height: 400, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export default async function ToolPage({ params }: RouteParams) {
  const { slug } = await params;
  const tool = TOOLS_BY_ID[slug];
  if (!tool) notFound();

  const Icon = getIcon(tool.icon);
  const category = getCategoryByName(tool.category);
  const accent = category?.color ?? "#0066FF";

  const related = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  );

  const articles = await getRelatedPosts(tool.category, 3);

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    {
      name: tool.category,
      url: category ? `${SITE_CONFIG.url}/tools/categories/${category.id}` : `${SITE_CONFIG.url}/tools`,
    },
    { name: tool.name, url: `${SITE_CONFIG.url}/tools/${tool.id}` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.longDescription,
    applicationCategory: tool.category.replace(/ Tools$/, "Application"),
    operatingSystem: "Any (Web)",
    url: `${SITE_CONFIG.url}/tools/${tool.id}`,
    image: `${SITE_CONFIG.url}/og/tools/${tool.id}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  const howToSteps = buildHowToSteps(tool);
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${tool.name}`,
    description: tool.description,
    totalTime: "PT1M",
    step: howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.body,
      url: `${SITE_CONFIG.url}/tools/${tool.id}#step-${i + 1}`,
    })),
  };

  const faqs = buildToolFAQs(tool);

  return (
    <>
      <ScriptJsonLd data={breadcrumbJsonLd} />
      <ScriptJsonLd data={softwareJsonLd} />
      <ScriptJsonLd data={howToJsonLd} />
      <TrackToolVisit toolId={tool.id} />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        <Breadcrumb items={breadcrumb.map((b) => ({ name: b.name, url: b.url }))} currentName={tool.name} />

        <header className="mt-6">
          <div className="flex items-start gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            >
              {/* getIcon returns a stable component reference per icon name. */}
              {/* eslint-disable-next-line react-hooks/static-components */}
              <Icon className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={category ? `/tools/categories/${category.id}` : "/tools"}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400"
              >
                {tool.category}
              </Link>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
                {tool.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
                {tool.longDescription}
              </p>
            </div>
          </div>

          <UsageCounter toolId={tool.id} className="mt-5" />

          <ul className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <TrustChip Icon={DollarSign}>Free</TrustChip>
            <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
            <TrustChip Icon={Zap}>Instant</TrustChip>
            <TrustChip Icon={Smartphone}>Mobile-friendly</TrustChip>
          </ul>
        </header>

        <AdSlot position="top" />

        <section className="mt-8">
          {(() => {
            // Prefer the in-house Next.js component when one exists for this
            // tool slug. Falls back to the external-tool stub for tools that
            // haven't been migrated yet, or to a "coming soon" notify card
            // when no destination is configured at all.
            const InHouse = IN_HOUSE_TOOLS[tool.id];
            if (InHouse) return <InHouse />;
            if (tool.embedUrl || tool.externalHref) return <ToolEmbed tool={tool} />;
            return <ComingSoonNotify toolId={tool.id} toolName={tool.name} />;
          })()}
        </section>

        <AdSlot position="mid" />

        <FeatureGrid tool={tool} />

        <HowToSection toolName={tool.name} steps={howToSteps} />

        {articles.length > 0 && (
          <section className="mt-14 space-y-6">
            <header className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                Related articles
              </h2>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
              >
                More from the blog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </header>
            <ul className="grid gap-4 md:grid-cols-3">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={article.url}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
                  >
                    <div
                      className={cn("h-28 w-full bg-gradient-to-br", article.gradient)}
                      aria-hidden="true"
                    />
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                        {article.category}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-surface-900 dark:text-white">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-surface-600 dark:text-surface-400">
                        {article.description}
                      </p>
                      <p className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] text-surface-500 dark:text-surface-400">
                        <Clock className="h-3 w-3" />
                        {article.readingTimeMinutes} min · {formatDate(article.date)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14 space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                  All {tool.category}
                </h2>
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                  Every other {tool.category.toLowerCase().replace(/ tools$/, "")} tool — jump straight in.
                </p>
              </div>
              {category && (
                <Link
                  href={`/tools/categories/${category.id}`}
                  className="text-xs font-semibold text-primary-700 hover:underline dark:text-primary-300"
                >
                  View hub →
                </Link>
              )}
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}

        <AdSlot position="bottom" />

        <div className="mt-14">
          <ToolFAQ items={faqs} />
        </div>

        <CategoryNavCard currentCategoryId={category?.id} />
      </div>
    </>
  );
}

function ScriptJsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function Breadcrumb({
  items,
  currentName,
}: {
  items: { name: string; url: string }[];
  currentName: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.slice(0, -1).map((item, i) => (
          <li key={item.url} className="flex items-center gap-1.5">
            <Link href={item.url.replace(SITE_CONFIG.url, "") || "/"} className="hover:text-surface-700 dark:hover:text-surface-200">
              {item.name}
            </Link>
            {i < items.length - 2 && <ChevronRight className="h-3.5 w-3.5 text-surface-400" />}
            {i === items.length - 2 && <ChevronRight className="h-3.5 w-3.5 text-surface-400" />}
          </li>
        ))}
        <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
          {currentName}
        </li>
      </ol>
    </nav>
  );
}

function TrustChip({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1 rounded-full border border-surface-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-surface-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200">
      <Icon className="h-3 w-3 text-primary-500" />
      {children}
    </li>
  );
}

function FeatureGrid({ tool }: { tool: Tool }) {
  const features = [
    {
      Icon: ShieldCheck,
      title: "Private by default",
      body: tool.externalHref
        ? `${tool.name} runs on a dedicated subdomain. We never log your inputs.`
        : `${tool.name} runs entirely in your browser — files never leave your device.`,
    },
    {
      Icon: Zap,
      title: "Instant results",
      body: `No signup, no upload queue, no captcha. Use ${tool.name} and move on with your day.`,
    },
    {
      Icon: Smartphone,
      title: "Works everywhere",
      body: "Mobile, tablet, desktop, and offline (PWA). Install once, use everywhere.",
    },
    {
      Icon: DollarSign,
      title: "Free forever",
      body: "No premium tier, no per-use fees. Optional ads keep the lights on; you keep the tool.",
    },
  ];

  return (
    <section className="mt-14 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Built for everyday work
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Why people use {tool.name}
        </h2>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <li
            key={f.title}
            className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <f.Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">{f.title}</h3>
            <p className="mt-1.5 text-xs text-surface-600 dark:text-surface-400">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowToSection({
  toolName,
  steps,
}: {
  toolName: string;
  steps: { title: string; body: string }[];
}) {
  const stepIcons = [Search, MousePointerClick, Bookmark];
  return (
    <section className="mt-14 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Getting started
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          How to use the {toolName}
        </h2>
      </header>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => {
          const StepIcon = stepIcons[i] ?? Sparkles;
          return (
            <li
              key={step.title}
              id={`step-${i + 1}`}
              className="relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900"
            >
              <span className="font-mono text-4xl font-bold text-primary-100 dark:text-primary-500/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                <StepIcon className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-surface-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-surface-600 dark:text-surface-400">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CategoryNavCard({ currentCategoryId }: { currentCategoryId?: string }) {
  return (
    <section className="mt-14 rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        More from UtilityApps
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link
              href={`/tools/categories/${c.id}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition",
                c.id === currentCategoryId
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
              )}
            >
              {c.name}
              <span className="text-[10px] opacity-80">{c.toolCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function buildHowToSteps(tool: Tool): { title: string; body: string }[] {
  return [
    {
      title: `Open the ${tool.name}`,
      body: `${tool.name} loads instantly on this page — no download or signup. ${
        tool.externalHref
          ? "It runs on a dedicated, sandboxed subdomain inside the embed below."
          : "Once it ships, it'll run entirely inside your browser."
      }`,
    },
    {
      title: "Enter your inputs",
      body: `Type, paste, or upload what you need. ${tool.description}`,
    },
    {
      title: "Copy or save the result",
      body: `Use the result right away, copy it to your clipboard, or bookmark this page so you can come back without searching.`,
    },
  ];
}

function buildToolFAQs(tool: Tool): FAQItem[] {
  const out: FAQItem[] = [
    {
      q: `Is ${tool.name} really free?`,
      a: `Yes. ${tool.name} is free to use with no signup, no credit card, and no usage limits. We rely on optional digital products and tasteful ads — never on gating the tool itself.`,
    },
    {
      q: `Do I need to create an account?`,
      a: `No account is required. ${tool.name} works the moment the page loads. Bookmarks are stored anonymously on your device.`,
    },
    {
      q: `Is my data private when using ${tool.name}?`,
      a: tool.externalHref
        ? `Yes. The tool runs on a dedicated subdomain that processes inputs locally where possible. We do not log inputs or outputs.`
        : `Yes. ${tool.name} will run entirely in your browser — files and inputs never leave your device.`,
    },
    {
      q: `Does ${tool.name} work on mobile?`,
      a: `Every UtilityApps tool is mobile-first. ${tool.name} works on phones, tablets, and desktop browsers, and installs as a Progressive Web App.`,
    },
    {
      q: `Which countries and units are supported?`,
      a: tool.category === "Finance Tools"
        ? `${tool.name} supports the US, UK, Canada, Germany, France, and most EU countries with currency-aware inputs and updated rate data.`
        : tool.category === "Health Tools"
          ? `${tool.name} supports both metric (kg/cm) and imperial (lb/ft-in) units, with health guidance from WHO and equivalent regional bodies.`
          : `${tool.name} works worldwide and supports all common input formats.`,
    },
    {
      q: `Can I bookmark ${tool.name} for later?`,
      a: `Yes. Tap the heart icon at the top of this page to bookmark ${tool.name}. Bookmarks are stored anonymously and travel with you on the same device — no signup needed.`,
    },
  ];

  if (tool.keywords.length > 0) {
    const synonym = tool.keywords[0];
    out.push({
      q: `Is "${synonym}" the same as ${tool.name}?`,
      a: `Yes — "${synonym}" is one of the common names people use to find ${tool.name}. You're in the right place.`,
    });
  }

  if (tool.relatedTools.length > 0) {
    const related = tool.relatedTools
      .map((id) => TOOLS_BY_ID[id]?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    if (related) {
      out.push({
        q: `What other tools pair well with ${tool.name}?`,
        a: `Try ${related}. They're listed under "You might also like" above and work with the same one-click, no-signup flow.`,
      });
    }
  }

  return out;
}
