import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink, Info } from "lucide-react";

import { SITE_CONFIG } from "@/lib/utils";

/**
 * Visual content for a soft-deprecated tool page.
 *
 * Used when a tool we used to offer (PDF↔Excel, PowerPoint↔PDF in this
 * case) no longer ships because we can't do it well browser-side. We keep
 * the URL alive so:
 *   - inbound links (blogs, search engines) don't 404
 *   - visitors get an honest explanation + a working alternative
 *   - SEO equity on these high-search-volume routes (~880k+/mo each)
 *     isn't lost overnight
 *
 * The page is intentionally simple — no shell, no FAQ, no dropzone. It's
 * a content page, not a tool page.
 */

export interface RetiredToolAlternative {
  label: string;
  description: string;
  href: string;
  /** True if this is an external (non-UtilityApps) alternative. */
  external?: boolean;
}

interface Props {
  /** Display name of the tool, e.g. "PDF to Excel". */
  toolName: string;
  /** Honest one-paragraph explanation of why we don't offer it. */
  reason: string;
  /** Suggested working alternatives — internal first, external as fallback. */
  alternatives: RetiredToolAlternative[];
  /** Breadcrumb category, defaults to "PDF Tools". */
  categoryLabel?: string;
}

export function RetiredToolNotice({
  toolName,
  reason,
  alternatives,
  categoryLabel = "PDF Tools",
}: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
          Tools
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link
          href="/tools/categories/pdf-tools"
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          {categoryLabel}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="font-medium text-surface-700 dark:text-surface-200">
          {toolName}
        </span>
      </nav>

      <p className="inline-flex items-center gap-2 rounded-full border border-warning-200 bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        Not currently offered
      </p>

      <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
        {toolName} isn&rsquo;t available right now.
      </h1>

      <p className="mt-5 text-base leading-relaxed text-surface-700 dark:text-surface-200">
        {reason}
      </p>

      <h2 className="mt-10 text-lg font-bold text-surface-900 dark:text-white">
        What we suggest instead
      </h2>
      <ul className="mt-4 space-y-3">
        {alternatives.map((alt, i) => (
          <li key={i}>
            <a
              href={alt.href}
              target={alt.external ? "_blank" : undefined}
              rel={alt.external ? "noopener noreferrer" : undefined}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-surface-900 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                  {alt.label}
                  {alt.external && (
                    <ExternalLink
                      className="ml-1.5 inline h-3 w-3 text-surface-400"
                      aria-hidden="true"
                    />
                  )}
                </p>
                <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
                  {alt.description}
                </p>
              </div>
              <ArrowRight
                className="mt-1 h-4 w-4 shrink-0 text-surface-400 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl border border-surface-200 bg-surface-50/60 p-5 text-sm text-surface-700 dark:border-surface-800 dark:bg-surface-900/40 dark:text-surface-200">
        <p>
          <strong>Why we&rsquo;re honest about this:</strong> the rest of
          our tools are designed to run inside your browser without uploading
          your file. For this specific conversion, doing it well requires
          server-side software we don&rsquo;t run, and the browser-only
          version would produce poor results. We&rsquo;d rather tell you
          than ship something that disappoints.
        </p>
        <p className="mt-3">
          Browse the rest of our{" "}
          <Link
            href="/tools/categories/pdf-tools"
            className="font-semibold text-primary-700 hover:underline dark:text-primary-300"
          >
            PDF tools
          </Link>{" "}
          — most do work entirely in your browser.{" "}
          {SITE_CONFIG.name} stays free, no signup.
        </p>
      </div>
    </div>
  );
}
