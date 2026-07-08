import type { Metadata } from "next";
import Link from "next/link";
import {
  Bug,
  ChevronRight,
  Rocket,
  Search,
  Server,
  Sparkles,
} from "lucide-react";

import {
  getSortedChangelog,
  type ChangelogEntry,
  type ChangelogKind,
} from "@/lib/changelog";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG, cn } from "@/lib/utils";

const TITLE = `Changelog — What's new on ${SITE_CONFIG.name}`;
const DESCRIPTION = `Track every tool launch, feature add, and SEO ship on ${SITE_CONFIG.name}. Updated with each release.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/changelog" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/changelog`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

const KIND_META: Record<
  ChangelogKind,
  { label: string; icon: typeof Rocket; className: string }
> = {
  launch: {
    label: "Launch",
    icon: Rocket,
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  feature: {
    label: "Feature",
    icon: Sparkles,
    className:
      "bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/30",
  },
  seo: {
    label: "SEO",
    icon: Search,
    className:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  },
  fix: {
    label: "Fix",
    icon: Bug,
    className:
      "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30",
  },
  infra: {
    label: "Infra",
    icon: Server,
    className:
      "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600",
  },
};

export default function ChangelogPage() {
  const entries = getSortedChangelog();
  const grouped = groupByMonth(entries);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">Changelog</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Changelog
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
          What&rsquo;s new on {SITE_CONFIG.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Every tool launch, feature add, and ship that&rsquo;s worth mentioning.
          Newer entries first.
        </p>
      </header>

      <div className="space-y-12">
        {grouped.map(({ label, entries: monthEntries }) => (
          <section key={label}>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {label}
            </h2>
            <ol className="space-y-6 border-l border-surface-200 pl-6 dark:border-surface-800">
              {monthEntries.map((entry, i) => (
                <Entry key={`${entry.date}-${i}`} entry={entry} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function Entry({ entry }: { entry: ChangelogEntry }) {
  const meta = KIND_META[entry.kind];
  const Icon = meta.icon;

  return (
    <li className="relative">
      <span
        className={cn(
          "absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full ring-2",
          meta.className
        )}
        aria-hidden="true"
      >
        <Icon className="h-3 w-3" />
      </span>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <time
          dateTime={entry.date}
          className="font-mono text-surface-500 dark:text-surface-400"
        >
          {formatDate(entry.date)}
        </time>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
            meta.className
          )}
        >
          {meta.label}
        </span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-surface-900 dark:text-white">
        {entry.title}
      </h3>
      <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
        {entry.description}
      </p>
      {entry.tools && entry.tools.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {entry.tools.map((toolId) => {
            const tool = TOOLS_BY_ID[toolId];
            if (!tool) return null;
            return (
              <li key={toolId}>
                <Link
                  href={tool.href}
                  className="inline-block rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-700 transition hover:bg-primary-50 hover:text-primary-700 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
                >
                  {tool.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function groupByMonth(entries: ChangelogEntry[]): { label: string; entries: ChangelogEntry[] }[] {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const [year, month] = entry.date.split("-");
    const key = `${year}-${month}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries()).map(([key, value]) => ({
    label: monthLabel(key),
    entries: value,
  }));
}

function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1));
  return `${monthNames[monthIndex]} ${year}`;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${year}-${month}-${day}`;
}
