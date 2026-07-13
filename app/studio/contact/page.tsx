import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { InquiryForm } from "@/components/studio/InquiryForm";
import { CalendlyLink } from "@/components/studio/CalendlyButton";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Tell Us About Your Project — Studio";
const DESCRIPTION =
  "Share your project details with UtilityApps Studio. We'll respond within 24 hours to schedule a free 30-min discovery call.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/studio/contact" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/studio/contact`,
    siteName: SITE_CONFIG.name,
  },
};

export default function StudioContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/studio"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 transition hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to Studio
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Project inquiry
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
          Tell us about your project.
        </h1>
        <p className="mt-3 text-base text-surface-600 dark:text-surface-300">
          Daniel will personally respond within 24 hours to set up a free
          30-minute discovery call. Prefer to skip the form?{" "}
          <CalendlyLink
            analyticsId="contact-skip-form"
            className="font-semibold text-primary-700 underline decoration-dotted underline-offset-2 hover:text-primary-800 dark:text-primary-300"
          >
            Book a calendar slot directly →
          </CalendlyLink>
        </p>
      </header>

      <div className="mt-10 rounded-3xl border border-surface-200 bg-white p-6 sm:p-8 dark:border-surface-800 dark:bg-surface-900">
        <InquiryForm />
      </div>

      <p className="mt-6 text-center text-xs text-surface-500 dark:text-surface-400">
        Your details go directly to Daniel. We never share them or add you to a
        marketing list.
      </p>
    </div>
  );
}
