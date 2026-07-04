import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brush,
  Camera,
  CheckCircle2,
  QrCode,
  Smartphone,
  UserPlus,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/business-card/GoogleSignInButton";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "business-card";

const TITLE = "Free Digital Business Card with QR Code — Multiple Cards, One Link";
const DESCRIPTION =
  "Create free digital business cards with QR codes that save contacts directly to phones. One master QR code for all your business cards. No app needed to scan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "digital business card",
    "free digital business card",
    "QR code business card",
    "vCard QR code",
    "scan to save contact",
    "multiple business cards one QR",
    "electronic business card",
    "no app business card",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Digital Business Card — One QR, Multiple Cards",
    description: "Create multiple digital business cards. Share one QR code. Contacts save directly to phones.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function BusinessCardLandingPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-200 bg-gradient-to-b from-primary-50 via-white to-white pb-16 pt-16 sm:pt-24 dark:border-surface-800 dark:from-primary-500/10 dark:via-surface-950 dark:to-surface-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
            <QrCode className="h-3.5 w-3.5" /> New on {SITE_CONFIG.name}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl dark:text-white">
            One QR code. All your business cards.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-surface-600 dark:text-surface-300">
            Create multiple digital business cards for every business, role, or identity you have.
            Share one QR code. Contacts save directly to their phone — no app to scan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/business-card/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
            >
              Create your free card
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/bc/danielmakonor"
              className="text-sm font-medium text-surface-600 underline decoration-dotted underline-offset-2 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              See an example →
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 text-sm font-medium text-surface-700 sm:grid-cols-2 sm:gap-x-10 dark:text-surface-200">
            {[
              "Multiple cards, one QR code",
              "Saves directly to phone contacts",
              "Works with any phone camera",
              "Free to start — no signup for scanners",
            ].map((t) => (
              <li key={t} className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 dark:bg-surface-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            How it works
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: UserPlus,
                title: "Create your cards",
                body: "Add as many business cards as you need, each with its own identity, contact details, and branding.",
              },
              {
                icon: QrCode,
                title: "Share one QR code",
                body: "Your master QR shows all your cards when scanned. Or share individual card QR codes for specific contexts.",
              },
              {
                icon: Smartphone,
                title: "Contacts save directly",
                body: "When someone scans, your info saves to their phone contacts automatically. No app to install. No signup required.",
              },
            ].map((s, i) => (
              <li
                key={i}
                className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs font-mono font-semibold text-primary-600 dark:text-primary-400">
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-y border-surface-200 bg-surface-50/60 py-20 dark:border-surface-800 dark:bg-surface-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Made for the people who wear more than one hat.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: QrCode, title: "Multiple cards, one QR", body: "Solo founders with multiple businesses. Consultants with different services. Companies with departments. All under one link." },
              { icon: Smartphone, title: "Direct to phone contacts", body: "Not just a webpage. Scanning triggers a native \"Add to Contacts\" dialog — vCard format works everywhere." },
              { icon: Brush, title: "Custom branding per card", body: "Different themes and colours per card. Represent yourself and your businesses accurately." },
              { icon: BarChart3, title: "Real scan analytics", body: "See which cards get saved and where. No PII tracked — country-level only." },
              { icon: Camera, title: "Any phone camera works", body: "iOS Camera app, Android's built-in scanner, Google Lens. No dedicated scanner app needed." },
              { icon: CheckCircle2, title: "Free to start", body: "One card, no signup for scanners, no watermark on your saved contact." },
            ].map((f) => (
              <article
                key={f.title}
                className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base font-bold text-surface-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-white py-20 dark:bg-surface-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Simple plans
          </h2>
          <p className="mt-2 text-center text-sm text-surface-600 dark:text-surface-300">
            Start free. Upgrade only when you need more.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PricingCard
              tier="Free"
              price="$0"
              period="forever"
              features={["1 card", "Basic themes", "Individual QR code", "500 scans/month analytics"]}
              cta="Get started"
              href="/tools/business-card/create"
            />
            <PricingCard
              tier="Pro"
              price="$1"
              period="/ card · one-time"
              features={[
                "Everything in Free",
                "$1 for every new card",
                "All themes",
                "Master QR code covers all your cards",
                "Unlimited analytics",
                "Custom slugs",
                "No watermark",
              ]}
              cta="Coming soon"
              featured
            />
            <PricingCard
              tier="Business"
              price="$2"
              period="/ card · per year"
              features={[
                "Custom email and domain",
                "Unlimited team members",
                "Admin privileges",
                "Team management",
                "Bulk export",
                "White label",
              ]}
              cta="Coming soon"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-surface-200 bg-gradient-to-br from-primary-500 to-accent-500 py-20 text-white dark:border-surface-800">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to give out your card?
          </h2>
          <p className="mt-3 text-base text-white/90">
            Sign in with Google, add your details, and you&rsquo;ll have a QR code ready to share in
            about a minute.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GoogleSignInButton className="!bg-white !text-surface-900 !hover:bg-surface-100">
              Continue with Google
            </GoogleSignInButton>
            <Link
              href="/bc/danielmakonor"
              className="text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-2 hover:text-white"
            >
              See the demo first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingCard({
  tier,
  price,
  period,
  features,
  cta,
  href,
  featured,
}: {
  tier: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`flex flex-col rounded-3xl border p-6 ${
        featured
          ? "border-primary-500 ring-2 ring-primary-200 dark:border-primary-500 dark:ring-primary-500/30"
          : "border-surface-200 dark:border-surface-800"
      } bg-white dark:bg-surface-900`}
    >
      <p className="text-sm font-semibold text-surface-500 dark:text-surface-400">{tier}</p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
          {price}
        </span>
        <span className="text-sm text-surface-500">{period}</span>
      </p>
      <ul className="mt-5 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-surface-700 dark:text-surface-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
            {f}
          </li>
        ))}
      </ul>
      {href ? (
        <Link
          href={href}
          className={`mt-6 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
            featured
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-surface-100 text-surface-800 hover:bg-surface-200 dark:bg-surface-800 dark:text-white dark:hover:bg-surface-700"
          }`}
        >
          {cta}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-surface-100 px-4 py-2.5 text-sm font-semibold text-surface-500 dark:bg-surface-800 dark:text-surface-400"
        >
          {cta}
        </button>
      )}
    </article>
  );
}
