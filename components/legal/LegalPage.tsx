import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  /** Display name in the breadcrumb tail */
  breadcrumbLabel: string;
  /** ISO date string of the last update */
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({ title, description, breadcrumbLabel, lastUpdated, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
          <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
            {breadcrumbLabel}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base text-surface-600 dark:text-surface-300">{description}</p>
        )}
        {lastUpdated && (
          <p className="mt-3 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Last updated {formatDate(lastUpdated)}
          </p>
        )}
      </header>

      <div className={cn("mt-8 space-y-6 text-[15px] leading-relaxed text-surface-700 dark:text-surface-200")}>
        {children}
      </div>
    </div>
  );
}

export function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-24 text-xl font-bold text-surface-900 sm:text-2xl dark:text-white">
      {children}
    </h2>
  );
}

export function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mt-6 scroll-mt-24 text-base font-semibold text-surface-900 dark:text-white">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-surface-400">{children}</ul>;
}

export function A({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
    >
      {children}
    </Link>
  );
}
