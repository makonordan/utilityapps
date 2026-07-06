import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CalendarClock,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  MousePointerClick,
  Send,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import { TwitterIcon } from "@/components/icons/SocialIcons";
import { PollCreator } from "@/components/business-tools/PollCreator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/instant-poll landing page.
 *
 * The <PollCreator /> client component is the hero — its own H1
 * ("Ask anything. Share in seconds.") is the page's H1. Below it we
 * ship the "how it works" strip and use-case grid the spec asks for.
 * FAQ + longer SEO body come in a follow-up.
 */

const TOOL_ID = "instant-poll";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE =
  "Instant Poll Maker — Create a Poll & Share a Link in Seconds | UtilityApps";
const DESCRIPTION =
  "Create a free instant poll and share the link in seconds. No login, no signup. Perfect for WhatsApp groups, Twitter, and quick decisions. Live results update in real time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "instant poll",
    "free poll maker",
    "create a poll",
    "poll for whatsapp",
    "quick poll no login",
    "online poll maker",
    "poll link generator",
    "live poll",
    "group vote",
    "quick vote",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Instant Poll — Share a Link in Seconds",
    description:
      "No account. No signup. Type a question, share the link. Live results update as votes land.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Instant Poll")}&description=${encodeURIComponent("Share a link. Watch results roll in.")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Instant Poll — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

interface HowItWorksStep {
  n: number;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    n: 1,
    title: "Type your question",
    body: "One question, two to ten options. Takes about fifteen seconds.",
    icon: MousePointerClick,
  },
  {
    n: 2,
    title: "Share the link",
    body: "WhatsApp, Twitter, or copy. Voters don't need an account.",
    icon: Send,
  },
  {
    n: 3,
    title: "Watch results live",
    body: "Counts update the moment each vote lands. Close it when you're done.",
    icon: BarChart3,
  },
];

interface UseCaseCard {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
}

const USE_CASES: UseCaseCard[] = [
  {
    title: "WhatsApp groups",
    body: "Where to eat, when to meet, what to watch. The 'reactions' feature can't count.",
    icon: MessageCircle,
  },
  {
    title: "Team decisions",
    body: "Standups, feature prioritisation, sprint retros. Async voting beats a Slack thread.",
    icon: Briefcase,
  },
  {
    title: "Twitter / X polls",
    body: "Longer than the built-in 4-option / 24-hour limit, and results stay live.",
    icon: TwitterIcon,
  },
  {
    title: "Classroom check-ins",
    body: "Quick pop quiz or vote on the next topic. Students scan a QR from the whiteboard.",
    icon: GraduationCap,
  },
  {
    title: "Event planning",
    body: "Menu picks, seat assignments, keynote choice. RSVP-adjacent.",
    icon: CalendarClock,
  },
];

export default function InstantPollPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_CONFIG.url}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool?.category ?? "Productivity Tools",
        item: category
          ? `${SITE_CONFIG.url}/tools/categories/${category.id}`
          : `${SITE_CONFIG.url}/tools`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool?.name ?? "Instant Poll",
        item: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
      },
    ],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool?.name ?? "Instant Poll",
    description: tool?.longDescription ?? DESCRIPTION,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (Web)",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <ScriptJsonLd data={breadcrumbJsonLd} />
      <ScriptJsonLd data={softwareJsonLd} />
      <TrackToolVisit toolId={TOOL_ID} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
        >
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          {category && (
            <>
              <Link
                href={`/tools/categories/${category.id}`}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {tool?.category}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="font-medium text-surface-700 dark:text-surface-200">
            {tool?.name ?? "Instant Poll"}
          </span>
        </nav>
      </div>

      {/* Creator — the hero. Its own H1 is the page's H1. */}
      <section className="px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <PollCreator />
      </section>

      {/* How it works */}
      <section className="border-y border-surface-200 bg-surface-50/50 py-14 dark:border-surface-800 dark:bg-surface-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Three steps, under 10 seconds
            </h2>
          </header>
          <ol className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.n}
                  className="relative rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 left-5 grid h-7 w-7 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-sm"
                  >
                    {step.n}
                  </span>
                  <div className="mt-2 flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Use-case grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <header className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Made for
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Quick decisions with people you know
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-surface-600 dark:text-surface-300">
            Not for anonymous election-scale voting — for the day-to-day polls
            that used to fill up group chats.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-sm"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
                  {uc.title}
                </h3>
                <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
                  {uc.body}
                </p>
              </div>
            );
          })}
          <Link
            href="/tools/categories/productivity-tools"
            className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-5 transition hover:border-primary-400 hover:bg-primary-50 dark:border-primary-500/30 dark:bg-primary-500/10 dark:hover:border-primary-400/60"
          >
            <div>
              <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              <h3 className="mt-3 text-sm font-semibold text-primary-800 dark:text-primary-200">
                More Productivity Tools
              </h3>
              <p className="mt-1 text-xs text-primary-800/80 dark:text-primary-200/80">
                Timers, calculators, calendar helpers, and more — all free, all in your browser.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
              Browse the hub <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </section>

      {/* Trust strip — subtle differentiation from Google Forms */}
      <section className="mx-auto mb-16 max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-success-200 bg-success-50/50 p-5 text-sm text-success-900 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-100 sm:p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400" />
            <div>
              <p className="font-semibold">
                Why not Google Forms?
              </p>
              <p className="mt-1 leading-relaxed">
                Because Google Forms takes twelve clicks and a Google account
                to answer &quot;which pizza?&quot; This tool takes two clicks and
                zero accounts. If you need branching logic, spreadsheet
                integration, or file uploads, Forms is still the right pick —
                for anything simpler, this is faster.
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-success-800/80 dark:text-success-200/80">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> Voters don&rsquo;t need an account
                </span>
                <span className="inline-flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> Links stay live for 30 days
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> One-tap WhatsApp share
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Small helpers ───────────────────────────────────────────────────────

function ScriptJsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
