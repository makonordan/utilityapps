"use client";

import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

import { ToolCard } from "@/components/tools/ToolCard";
import { useBookmarks } from "@/hooks/useBookmarks";

export function SavedToolsView() {
  const { bookmarks, clear } = useBookmarks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Your bookmarks
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Saved tools
          </h1>
          <p className="mt-2 max-w-xl text-sm text-surface-600 dark:text-surface-300">
            Bookmarks are stored anonymously on this device and synced across tabs. No account
            required.
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Remove all saved tools?")) clear();
            }}
            className="text-xs font-semibold text-surface-500 underline-offset-4 hover:text-warning-600 hover:underline dark:text-surface-400"
          >
            Clear all
          </button>
        )}
      </header>

      {bookmarks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <section className="mt-10 rounded-3xl border border-dashed border-surface-200 bg-gradient-to-br from-surface-50 to-white p-10 text-center dark:border-surface-800 dark:from-surface-900 dark:to-surface-950">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
        <Heart className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-surface-900 dark:text-white">
        No saved tools yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-surface-600 dark:text-surface-300">
        Browse tools and tap the heart icon on any card to bookmark it. Your saved tools live here
        and travel with you on this device.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
        >
          Browse Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
        >
          <Sparkles className="h-4 w-4" />
          See trending
        </Link>
      </div>
    </section>
  );
}
