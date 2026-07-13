import type { Metadata } from "next";
import Link from "next/link";
import { Flag, ShieldOff } from "lucide-react";

import { ShareViewer } from "@/components/share-tool/ShareViewer";
import { SITE_CONFIG } from "@/lib/utils";

export const dynamic = "force-dynamic"; // shares change minute-to-minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Shared Content",
    description: "Open a one-off share — text or short link.",
    alternates: { canonical: `/s/${slug}` },
    robots: { index: false, follow: false }, // shares aren't search content
  };
}

export default async function ShareRecipientPage({ params }: PageProps) {
  const { slug } = await params;

  // Server-side metadata fetch using the admin client. Returning null
  // here means "no such share / expired / removed" — the unified empty
  // state below covers all of those without leaking which is which.
  const shares = await import("@/lib/db/shares");
  const row = await shares.findBySlug(slug);

  const available =
    !!row &&
    !shares.isExpired(row) &&
    !shares.isViewLimitReached(row) &&
    !row.reported;

  if (!available) {
    return <UnavailableState />;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
          {/* Tiny brand mark in the recipient page header */}
          <Link
            href="/"
            aria-label={`${SITE_CONFIG.name} home`}
            className="text-xs font-bold tracking-wider"
          >
            UA
          </Link>
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Shared via {SITE_CONFIG.name}
          </p>
          <h1 className="text-lg font-bold text-surface-900 dark:text-white">
            {row.type === "url" ? "Someone shared a link with you" : "Someone shared a snippet with you"}
          </h1>
        </div>
      </header>

      <ShareViewer
        slug={slug}
        type={row.type as "text" | "url" | "file"}
        hasPassword={!!row.password_hash}
        viewCount={row.view_count}
        viewLimit={row.view_limit}
        textLanguage={row.text_language}
      />

      <footer className="mt-10 flex items-center justify-between gap-3 border-t border-surface-200 pt-4 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
        <Link
          href={`/tools/share`}
          className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
        >
          Create your own share →
        </Link>
        <ReportLink slug={slug} />
      </footer>
    </main>
  );
}

function ReportLink({ slug }: { slug: string }) {
  // Server-rendered as a regular anchor; the actual POST is fired from
  // the ShareViewer client component when the form is submitted. This
  // intentionally non-interactive footer link is here for users who
  // don't engage with the viewer (e.g. URL shares that auto-redirect).
  return (
    <a
      href={`/s/${slug}#report`}
      className="inline-flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400"
    >
      <Flag className="h-3 w-3" /> Report this content
    </a>
  );
}

function UnavailableState() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 py-14 text-center">
      <span
        aria-hidden="true"
        className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-300"
      >
        <ShieldOff className="h-7 w-7" />
      </span>
      <h1 className="text-xl font-bold text-surface-900 dark:text-white">
        This share isn&rsquo;t available
      </h1>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
        The link may have expired, hit its view limit, been removed by the
        creator, or never existed.
      </p>
      <Link
        href="/tools/share"
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-800"
      >
        Create your own share →
      </Link>
    </main>
  );
}
