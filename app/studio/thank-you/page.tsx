import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, FileText, Grid2X2 } from "lucide-react";

import { CalendlyLink } from "@/components/studio/CalendlyButton";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Thanks — we'll be in touch | ${SITE_CONFIG.name} Studio`;

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false, follow: true },
  alternates: { canonical: "/studio/thank-you" },
};

export default function StudioThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md"
      >
        ✓
      </span>
      <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
        Thanks — we&rsquo;ll be in touch within 24 hours.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-surface-600 dark:text-surface-300">
        We received your project details and Daniel will personally respond
        within 24 hours (often sooner). While you wait, here are a few things
        you might find useful:
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card
          icon={<Grid2X2 className="h-5 w-5" />}
          title="Check out our portfolio"
          description="Browse the 100+ tools shipped on UtilityApps."
          href="/tools"
          cta="See the tools"
        />
        <Card
          icon={<FileText className="h-5 w-5" />}
          title="Read our build story"
          description="How UtilityApps got built solo with AI-augmented development."
          href="/blog"
          cta="Read on the blog"
        />
        <CalendlyCard />
      </div>

      <p className="mt-10 text-sm text-surface-500 dark:text-surface-400">
        Need to add something?{" "}
        <span className="font-medium text-surface-700 dark:text-surface-200">
          Reply to the confirmation email
        </span>{" "}
        and Daniel will see it.
      </p>

      <Link
        href="/studio"
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 transition hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
      >
        ← Back to Studio
      </Link>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
        {icon}
      </span>
      <h2 className="mt-3 text-sm font-bold text-surface-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
        {cta}
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function CalendlyCard() {
  return (
    <CalendlyLink
      analyticsId="thank-you-skip-ahead"
      className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
        <CalendarCheck className="h-5 w-5" />
      </span>
      <h2 className="mt-3 text-sm font-bold text-surface-900 dark:text-white">
        Book a slot directly
      </h2>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
        Skip the wait and pick a 30-min discovery call now.
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
        Open Calendly
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </CalendlyLink>
  );
}
