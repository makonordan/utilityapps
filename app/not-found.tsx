import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

import { SearchBar } from "@/components/search/SearchBar";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn't find that page. Try a search or browse the most-used tools.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const popular = [...TOOLS]
    .sort((a, b) => b.monthlySearches - a.monthlySearches)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-warning-200 bg-warning-50/60 px-3 py-1 text-xs font-semibold text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300">
          <Compass className="h-3.5 w-3.5" />
          404 · Page not found
        </span>
        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl dark:text-white">
          Lost? We&apos;ve all been there.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-surface-600 dark:text-surface-300">
          The page you&apos;re looking for doesn&apos;t exist, moved, or was never built. Try a
          search, or jump to one of the most-used tools below.
        </p>
        <div className="mt-8">
          <SearchBar />
        </div>
        <div className="mt-6 inline-flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-primary-600 transition hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Back to {SITE_CONFIG.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-surface-300 dark:text-surface-700">·</span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-surface-600 transition hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          >
            Report a broken link
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Popular right now
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
            Try one of these
          </h2>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
