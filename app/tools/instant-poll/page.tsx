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

const TITLE = "Instant Poll Maker — Share a Link in Seconds";
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

// ── FAQ — single source of truth for both the visible cards and the
//    FAQPage JSON-LD so structured data can't drift from the page. ───

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this poll maker free?",
    answer:
      "Yes, completely. No signup, no watermark, no per-poll fees, no monthly limits. Create as many polls as you want, and collect as many votes as your audience can send. UtilityApps runs on ads — that's it.",
  },
  {
    question: "Do I need an account to create a poll?",
    answer:
      "No. Type the question, add options, click Create. Your creator token — the secret that lets you close, reopen, or delete the poll later — lives in your browser's localStorage. Clear your cookies and you lose the ability to manage that specific poll, but the poll itself keeps working.",
  },
  {
    question: "Do voters need to log in?",
    answer:
      "No. Voters tap the link and pick an option. That's the whole point — the tool exists because Google Forms requiring an account to vote on 'which restaurant tonight?' has always been ridiculous.",
  },
  {
    question: "How do I share my poll on WhatsApp?",
    answer:
      "On the success screen after creation, tap the green WhatsApp button. It opens WhatsApp's share sheet with your question and poll link pre-filled — pick a group or contact and hit send. On desktop, WhatsApp Web opens with the same pre-filled message. Recipients land straight on the vote page inside the WhatsApp in-app browser and vote in one tap.",
  },
  {
    question: "Can someone vote more than once?",
    answer:
      "By default, no. Each vote is bound to a random device token in the voter's browser combined with the browser's user-agent, hashed into a one-way voter identifier. A second vote from the same browser on the same poll gets rejected as a duplicate. When creating the poll you can flip on 'Allow multiple votes per device' — useful for cheer counters, attendance-style polls, or anywhere multiple check-ins are legitimate.",
  },
  {
    question: "Are votes anonymous?",
    answer:
      "Yes. We don't record who voted for what. The only voter identifier we store is a hash of (poll ID + browser device token + user-agent) — non-reversible and per-poll, so scanning our database can't reveal what any specific device voted on across polls. We don't collect email addresses, IP addresses, or names. Rate limiting uses hashed IPs kept in memory only, evicted every hour.",
  },
  {
    question: "How long does a poll stay live?",
    answer:
      "30 days from creation. After that, the poll auto-closes and shows final results — still readable and shareable, just no new votes accepted. The creator can also close a poll earlier or reopen a closed one from the results view. Deleted polls (and their votes) are gone immediately.",
  },
  {
    question: "Can I close or delete my poll?",
    answer:
      "Yes, both — from the same browser you created it on. The results page shows a 'You created this poll' panel with Close voting, Reopen voting, and Delete poll buttons. If you created the poll on a different device (say, your phone) you'll need to be on that original device to manage it, because the creator token only exists in that browser's localStorage.",
  },
  {
    question: "How many options can I add?",
    answer:
      "Between 2 and 10. Below two isn't a poll; above ten becomes a decision-paralysis machine. If you need more granularity, split into two polls — one narrowing candidates, one picking the winner.",
  },
  {
    question: "Can I see results in real time?",
    answer:
      "Yes. The results view polls the server every 5 seconds and animates the bar widths as new votes land. Watching a group vote roll in on a shared screen is half the appeal. If you leave the tab idle for 5 minutes, live polling pauses to save server resources — scroll or tap and it resumes instantly.",
  },
];

const RELATED_TOOL_IDS = [
  "qr-code-generator",
  "event-ticket-generator",
] as const;

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
    name: tool?.name ?? "Instant Poll Maker",
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <ScriptJsonLd data={breadcrumbJsonLd} />
      <ScriptJsonLd data={softwareJsonLd} />
      <ScriptJsonLd data={faqJsonLd} />
      <TrackToolVisit toolId={TOOL_ID} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
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

      {/* SEO body — ~600 words in six ContentBlock sections. */}
      <section className="mx-auto max-w-4xl space-y-10 px-4 pb-16 sm:px-6">
        <ContentBlock title="Why instant polls beat Google Forms for quick decisions">
          <p>
            Google Forms is a beast: form builder, response spreadsheet,
            notification settings, per-question branching, and a Google
            account requirement for anyone who wants to answer. Great for
            surveys with thirty questions and skip logic. Overkill for
            &quot;which restaurant tonight?&quot;
          </p>
          <p>
            Instant Poll skips every step you don&rsquo;t need. Type the
            question, add the options, share the link. From landing on this
            page to a votable URL is under 10 seconds. The trade-offs are
            deliberate — no branching logic, no file uploads, no CSV export.
            If you need those, Forms is still the right tool. If you need a
            decision in the next hour and Grandma is one of the voters,
            this is.
          </p>
        </ContentBlock>

        <ContentBlock title="Best uses">
          <p>Where the tool earns its keep:</p>
          <ul className="mt-2 space-y-1.5 pl-5 [list-style:disc]">
            <li>
              <strong>WhatsApp group decisions</strong> — where to eat,
              when to meet, what to watch. The reactions feature can&rsquo;t
              count votes; this does.
            </li>
            <li>
              <strong>Team choices</strong> — feature prioritisation,
              sprint retro action items, whether to move standup. Async
              voting beats a Slack thread that dies at message 40.
            </li>
            <li>
              <strong>Twitter / X engagement</strong> — the built-in poll
              maxes at four options and 24 hours. Ours does 10 options for
              30 days, and results stay live after the tweet drops off the
              feed.
            </li>
            <li>
              <strong>Classroom check-ins</strong> — pop quiz, topic vote,
              exam-prep favourites. Print the QR code, project it, and
              students scan in.
            </li>
            <li>
              <strong>Event date picking</strong> — which Saturday works
              for the birthday drink? Which timeslot for the study group?
            </li>
            <li>
              <strong>&ldquo;Where should we eat&rdquo;</strong> — the
              canonical use case. This exists because that question
              deserved a better answer than eight rounds of &quot;idk, you?&quot;
            </li>
          </ul>
        </ContentBlock>

        <ContentBlock title="Live results, updating in real time">
          <p>
            The moment a vote lands anywhere in the world, every open
            results view on every device polls the server and updates. No
            refresh, no reload. Bars smoothly animate to their new widths,
            the winning option (if there is one) glows, and the total-vote
            counter ticks up.
          </p>
          <p>
            Under the hood, results pages refresh every 5 seconds. If the
            tab stays idle for 5 minutes we pause polling so an abandoned
            tab doesn&rsquo;t hammer the endpoint forever — scroll or tap
            anywhere and it resumes on the spot. Creators watching a group
            vote come in see the fight for first place unfold in real time
            without touching a keyboard.
          </p>
        </ContentBlock>

        <ContentBlock title="Privacy: no login, no personal data, votes are anonymous">
          <p>
            Nothing personal about voters is stored. Not IP addresses, not
            email addresses, not usernames. The only voter identifier we
            keep is a one-way hash of (poll ID + a random token in the
            voter&rsquo;s browser + user-agent string) — enough to reject a
            duplicate vote on the same poll from the same browser, not
            enough to identify anyone across polls or link to any external
            identity.
          </p>
          <p>
            Rate limiting uses hashed IPs kept in memory only — evicted
            every hour, wiped on server restart. Polls auto-expire after
            30 days and can be deleted at any time by the creator. When
            you delete, votes cascade — nothing about that poll remains on
            our infrastructure. Voters are anonymous by construction;
            creators are pseudonymous (identified only by a random token
            in their own browser localStorage, never on our servers).
          </p>
        </ContentBlock>

        <ContentBlock title="How to share to WhatsApp (the primary channel)">
          <p>
            After creating your poll, the success screen shows a green
            WhatsApp button. Tapping it opens WhatsApp&rsquo;s share sheet
            with the poll question and link pre-filled — pick a group or
            contact and hit send. On desktop, WhatsApp Web opens with the
            same pre-filled message. Recipients tap the link, land on the
            vote page in the WhatsApp in-app browser, and vote in one tap.
            No app install, no permission prompts.
          </p>
          <p>
            For Twitter / X, the Twitter button opens the intent tweet
            composer with your question as the tweet text and the poll
            link as an unfurled card. For anything else — Slack, Discord,
            SMS, email — just copy the link. Every viewer of the results
            view can re-share from the same buttons, which is how a
            single seed vote spreads to twenty.
          </p>
        </ContentBlock>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Ten short answers — including when this tool isn&rsquo;t the right pick.
          </p>
        </header>
        <ul className="space-y-3">
          {FAQS.map((f) => (
            <li
              key={f.question}
              className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
            >
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                {f.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                {f.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Related tools */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <header className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Related tools
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Free tools organisers reach for alongside quick group polls.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          {RELATED_TOOL_IDS.map((id) => {
            const t = TOOLS_BY_ID[id];
            if (!t) return null;
            const cat = getCategoryByName(t.category);
            return (
              <Link
                key={id}
                href={t.href}
                className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: cat?.color ?? "#2563EB" }}
                >
                  <span className="text-sm font-semibold">
                    {t.name.charAt(0)}
                  </span>
                </span>
                <h3 className="mt-3 text-sm font-semibold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {t.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-surface-600 dark:text-surface-300">
                  {t.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  Try free <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
          <Link
            href="/tools/categories/business-tools"
            className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-4 transition hover:border-primary-400 hover:bg-primary-50 dark:border-primary-500/30 dark:bg-primary-500/10 dark:hover:border-primary-400/60"
          >
            <div>
              <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              <h3 className="mt-3 text-sm font-semibold text-primary-800 dark:text-primary-200">
                All Business Tools
              </h3>
              <p className="mt-1 text-xs text-primary-800/80 dark:text-primary-200/80">
                Business cards, invoices, event tickets, QR codes — one hub.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
              Browse the hub <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
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

function ContentBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-surface-600 dark:text-surface-300 sm:text-base">
        {children}
      </div>
    </article>
  );
}
