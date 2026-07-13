import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { CATEGORIES, getCategoryBySlug, type Category } from "@/lib/categories";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateItemListSchema,
  jsonLdString,
} from "@/lib/schema";
import { TOOLS, type Tool } from "@/lib/tools";
import { SITE_CONFIG, formatNumber } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category not found" };

  const title = `${cat.name} — ${cat.toolCount}+ Free Tools`;
  const description = `Browse all ${cat.toolCount}+ free ${cat.name.toLowerCase()} on ${SITE_CONFIG.name}. ${cat.description}`;

  return {
    title,
    description,
    keywords: [
      `${cat.name.toLowerCase()}`,
      `free ${cat.name.toLowerCase()}`,
      `online ${cat.name.toLowerCase()}`,
      `best ${cat.name.toLowerCase()} 2026`,
      "no signup",
    ],
    alternates: { canonical: `/tools/categories/${cat.id}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/tools/categories/${cat.id}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(cat.name)}&description=${encodeURIComponent(`${cat.toolCount}+ free tools`)}&type=category`,
          width: 1200,
          height: 630,
          alt: cat.name,
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

export default async function CategoryPage({ params }: RouteParams) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const tools = TOOLS.filter((t) => t.category === cat.name);
  const popular = [...tools].sort((a, b) => b.monthlySearches - a.monthlySearches).slice(0, 5);

  const breadcrumbCrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    { name: cat.name, url: `${SITE_CONFIG.url}/tools/categories/${cat.id}` },
  ];

  const faqs = buildCategoryFAQs(cat, tools);

  return (
    <>
      <Schema data={generateBreadcrumbSchema(breadcrumbCrumbs)} />
      <Schema
        data={generateItemListSchema(
          `${cat.name} on ${SITE_CONFIG.name}`,
          tools.map((t) => ({ name: t.name, url: t.href }))
        )}
      />
      <Schema data={generateFAQSchema(faqs)} />

      <Hero category={cat} toolCount={tools.length} />

      {popular.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <header className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Featured
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-surface-900 dark:text-white">
              5 {cat.name.toLowerCase()} worth starting with
            </h2>
          </header>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {popular.map((tool) => (
              <li key={tool.id}>
                <Link
                  href={tool.href}
                  className="group flex h-full items-center justify-between gap-2 rounded-2xl border border-surface-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
                      {tool.name}
                    </p>
                    <p className="line-clamp-1 text-[11px] text-surface-500 dark:text-surface-400">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-surface-400 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            All {cat.name.toLowerCase()}
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} available — free, no signup, instant.
          </p>
        </header>
        {tools.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-surface-200 p-10 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
            We&apos;re still building tools in this category. Check back soon, or{" "}
            <Link
              href="/contact"
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              suggest one
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ToolFAQ items={faqs} title="Common questions" />
      </section>

      <RelatedCategories currentId={cat.id} />
    </>
  );
}

function Hero({ category, toolCount }: { category: Category; toolCount: number }) {
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
              {category.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ backgroundColor: category.color }}
            aria-hidden="true"
          >
            <Sparkles className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {toolCount} free {toolCount === 1 ? "tool" : "tools"} · no signup
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
              Free {category.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
              {category.description} Every tool runs in your browser, requires no account, and stays
              free forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedCategories({ currentId }: { currentId: string }) {
  const others = CATEGORIES.filter((c) => c.id !== currentId).slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-2 sm:px-6">
      <header className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Other categories
        </h2>
      </header>
      <ul className="flex flex-wrap gap-2">
        {others.map((c) => (
          <li key={c.id}>
            <Link
              href={`/tools/categories/${c.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
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

function Schema({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}

function buildCategoryFAQs(category: Category, tools: Tool[]): FAQItem[] {
  const popular = [...tools].sort((a, b) => b.monthlySearches - a.monthlySearches).slice(0, 3);
  const popularNames = popular.map((t) => t.name).join(", ");
  return [
    {
      q: `What are ${category.name.toLowerCase()}?`,
      a: `${category.description} On ${SITE_CONFIG.name}, every tool in this category is free, runs in your browser, and never requires an account.`,
    },
    {
      q: `Are these ${category.name.toLowerCase()} really free?`,
      a: `Yes. All ${tools.length} tools in this category are free to use with no signup, credit card, or usage limits. We monetize through optional digital products and tasteful display ads, never by gating the tools.`,
    },
    {
      q: `Which ${category.name.toLowerCase()} are most popular?`,
      a:
        popular.length > 0
          ? `The most-used tools in this category are ${popularNames}. The list updates daily based on real usage.`
          : `We're still building tools in this category — check back soon.`,
    },
    {
      q: `Are my inputs and files private?`,
      a: `Most ${category.name.toLowerCase()} run entirely in your browser, so inputs and files never leave your device. Tools that require server processing auto-delete uploads within an hour and never log inputs.`,
    },
    {
      q: `Can I use these on mobile?`,
      a: `Every UtilityApps tool is mobile-first and works on phones, tablets, and desktop browsers. The site also installs as a Progressive Web App for offline access.`,
    },
    {
      q: `Can I suggest a new ${category.name.toLowerCase().replace(/s$/, "")}?`,
      a: `Please do — the fastest way is the contact form on /contact. We ship the most-requested tools first.`,
    },
  ];
}
