"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCcw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-warning-500 to-accent-500 text-white shadow-glow">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
        Something went wrong on our end.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-surface-600 dark:text-surface-300">
        We&apos;ve logged the issue. Try refreshing — most one-off errors clear themselves. If it
        keeps happening, the homepage usually still works.
      </p>

      {error.digest && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-[11px] font-mono text-surface-500 dark:bg-surface-800 dark:text-surface-400">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
        >
          Go home
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-10 text-xs text-surface-500 dark:text-surface-400">
        If this is urgent, email{" "}
        <a
          href="mailto:hello@utilityapps.site"
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          hello@utilityapps.site
        </a>{" "}
        — include the reference code above.
      </p>
    </main>
  );
}
