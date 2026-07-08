import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { AllTools } from "@/components/home/AllTools";
import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `All Free Online Tools — ${SITE_CONFIG.name}`;
const DESCRIPTION = `Browse all ${TOOLS.length} free utility tools on ${SITE_CONFIG.name}. Filter by category, search by keyword, and start using any tool instantly — no signup required.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_CONFIG.url}/tools` },
  ],
};

export default function ToolsDirectoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
              <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
                Tools
              </li>
            </ol>
          </nav>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            {TOOLS.length} tools live · hundreds more planned
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
            All free online tools
          </h1>
          <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
            {DESCRIPTION}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
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
        </div>
      </section>

      <AllTools />
    </>
  );
}
