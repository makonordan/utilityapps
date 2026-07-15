import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AppLogo } from "@/components/apps/AppLogo";
import { getEditorsPicks } from "@/lib/apps";
import { formatStartingPrice } from "@/lib/apps/format";

/** Homepage teaser for the /apps directory. Renders nothing until at least
 *  one listing has verified pricing — a preview with placeholder prices
 *  would undercut the whole "pricing verified" trust pitch. */
export function AppsPreview() {
  const picks = getEditorsPicks().slice(0, 4);
  if (picks.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Software we actually recommend
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Honestly curated, pricing-verified picks — ranked by usefulness, never by who paid us.
          </p>
        </div>
        <Link
          href="/apps"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          Browse all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((app) => (
          <li key={app.id}>
            <Link
              href={`/apps/${app.id}`}
              className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
            >
              <div className="flex items-center gap-3">
                <AppLogo app={app} />
                <span className="min-w-0 truncate text-sm font-semibold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {app.name}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-surface-600 dark:text-surface-400">
                {app.tagline}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xs font-semibold text-surface-700 dark:text-surface-200">
                  {formatStartingPrice(app)}
                </span>
                <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
                  Editor&apos;s Pick
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/apps"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:hidden"
      >
        Browse all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
