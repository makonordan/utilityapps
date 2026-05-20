import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Heart, MapPin } from "lucide-react";

import {
  BANK_DETAILS,
  DONATE_LINKS,
  PAYPAL,
  SUPPORT_EMAIL,
  SUPPORTERS,
  hasBankDetails,
  hasPayPal,
  isPlaceholder,
} from "@/lib/donate";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Support UtilityApps — Help Keep 200+ Tools Free Forever";
const DESCRIPTION =
  "UtilityApps is built and maintained by one person, funded only by ads and donations. Your support keeps every tool free with no signup required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/donate" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/donate`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/donate`,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

// ── Where the money goes ───────────────────────────────────────────────────
const ALLOCATION = [
  {
    percent: 40,
    label: "Building new tools",
    detail:
      "Every donation helps fund development time for the next planned tool — a UK & Canada salary tax calculator, a sleep cycle calculator, a credit card payoff planner, and dozens more. Your contribution accelerates the timeline.",
    bar: "bg-primary-500",
  },
  {
    percent: 25,
    label: "Infrastructure & API costs",
    detail:
      "Background removal API, exchange-rate API, hosting, domains, email services, analytics, and CDN bandwidth as traffic grows.",
    bar: "bg-accent-500",
  },
  {
    percent: 20,
    label: "Content & SEO",
    detail:
      "Writing genuinely useful guides that explain the math behind the calculators and the science behind the health tools. Quality content costs time or money.",
    bar: "bg-success-500",
  },
  {
    percent: 15,
    label: "Improving existing tools",
    detail:
      "Bug fixes, user-requested features, accessibility, performance, mobile polish, and translations.",
    bar: "bg-warning-500",
  },
  {
    percent: 0,
    label: "Marketing or paid ads",
    detail:
      "I don't pay for traffic. UtilityApps grows by being good enough that people share it. No marketing budget, no paid promotion.",
    bar: "bg-surface-300",
  },
] as const;

const WHY = [
  {
    title: "The internet got worse, and I want to push back",
    body: "Every year the open web feels more closed — more paywalls, more signup walls, more “create a free account to continue,” more AI-generated junk. UtilityApps is my small contribution to keeping the useful, free, open internet alive.",
  },
  {
    title: "Free should mean free",
    body: "Most “free” tools are free until you hit a limit, free until you need to export your file, free until they upload your private photos to their servers. UtilityApps is free the way the old web was free — you visit, you use, you leave. No catches.",
  },
  {
    title: "Privacy should be the default, not a premium feature",
    body: "Most tools here run entirely in your browser. Your image, your salary, your BMI, your documents never touch my servers. I literally cannot see your data because I never receive it.",
  },
  {
    title: "Tools should serve users, not advertisers",
    body: "I show some ads — they help fund the project — but the rule is: ads never break the tool. The tool always comes first. If a tool feels degraded by ads, the ads come out.",
  },
];

const NEEDS = [
  { emoji: "🌐", title: "Domain & hosting", body: "Yearly fees for utilityapps.site and the tool sites that feed it — servers, CDN bandwidth, database storage, email." },
  { emoji: "🔧", title: "API costs", body: "Live currency rates, background removal, screenshot generation. Free tiers cover early traffic; costs grow with usage." },
  { emoji: "⏰", title: "Time", body: "I build, write, design and fix bugs in evenings and weekends. Support lets me spend more time building instead of taking other freelance work." },
  { emoji: "📚", title: "New tools & features", body: "Every donation goes toward the next 50, 100, 200 tools on the roadmap. Your support sets the pace." },
];

const FREE_WAYS = [
  { emoji: "⭐", text: "Share UtilityApps with one friend who'd find it useful" },
  { emoji: "🐦", text: "Post about a tool you used on social media" },
  { emoji: "🔗", text: "Link to UtilityApps from your blog, podcast, or YouTube channel" },
  { emoji: "📝", text: "Write a review on Product Hunt or AlternativeTo" },
  { emoji: "💬", text: `Tell me which tool to build next — ${SUPPORT_EMAIL}` },
];

const FAQ = [
  {
    q: "Is UtilityApps a registered company?",
    a: "Not yet. It's a personal project run by me as an individual. As donations and revenue grow, I may register a company to formalise operations — supporters will be informed if that happens.",
  },
  {
    q: "Are donations tax-deductible?",
    a: "No. UtilityApps isn't a registered nonprofit. Donations are personal gifts to support a free service, not tax-deductible contributions. Please consider this when deciding to donate.",
  },
  {
    q: "What happens if you can't sustain UtilityApps?",
    a: "My commitment: if I ever decide to stop maintaining UtilityApps, I will give 90 days' notice, open-source the codebase if possible, and find a way to keep the most popular tools accessible. I will never sell user data, lock features that were previously free, or quietly shut down without notice.",
  },
  {
    q: "Can I sponsor a specific tool?",
    a: `Yes. If you or your company want to fund a specific tool from the roadmap, email ${SUPPORT_EMAIL}. Sponsor recognition can be a footer link on that tool's page — subject to relevance (no gambling, adult content, or scam-adjacent industries).`,
  },
  {
    q: "Do you offer paid features or a Pro tier?",
    a: "Not currently. The plan is to keep every tool free. If a Pro tier ever launches, it will only add nice-to-have extras (ad-free experience, saved history, API access) — never gate features that were previously free.",
  },
  {
    q: "I run a similar platform. Want to collaborate?",
    a: `Yes — email ${SUPPORT_EMAIL}. I love working with people building in the same space.`,
  },
];

export default function DonatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <Breadcrumb />

        {/* Hero */}
        <header className="mt-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
            <Heart className="h-3.5 w-3.5" />
            Support the project
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Help keep 200+ tools free, forever
          </h1>
          <p className="mt-3 text-base text-surface-600 dark:text-surface-300">
            UtilityApps is built and maintained by one person, funded only by ads and donations.
            Your support keeps every tool free — with no signup required.
          </p>
          <a
            href="#donate"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            <Heart className="h-4 w-4" />
            Jump to donation options
          </a>
        </header>

        {/* Section 1 — The human */}
        <Section title="Hi, I'm Daniel 👋">
          <p>
            Hi, I'm Daniel — the developer, designer, writer, and one-person team behind
            UtilityApps. I'm based in Lagos, Nigeria: a builder by trade and an obsessive
            problem-solver by nature.
          </p>
          <p>
            UtilityApps started as a weekend project to solve a simple frustration. Every time I
            needed to do something quick online — compress an image, calculate a loan payment,
            count words in an article — I'd land on a site that demanded my email, locked features
            behind a paywall, or buried the actual tool under five ads and a popup.
          </p>
          <p>
            I thought: why doesn't a place exist where useful tools are just&hellip; free? Where
            nothing tries to trick you, sell you, or harvest your data? So I started building it.
          </p>
          <p>
            What began as a single Word Counter has grown into a platform with calculators for
            finance, health and productivity, image and document tools, currency converters, and
            dozens more — with hundreds planned. Every single tool is free. Every tool will stay
            free. Forever.
          </p>
        </Section>

        {/* Section 2 — Why */}
        <Section title="Why I'm building this">
          <div className="not-prose mt-2 space-y-4">
            {WHY.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
              >
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-surface-600 dark:text-surface-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 3 — Why support is needed */}
        <Section title="Why I'm asking for help">
          <p>Running a free platform isn't actually free. Here's what your support pays for:</p>
          <div className="not-prose mt-3 grid gap-3 sm:grid-cols-2">
            {NEEDS.map((n) => (
              <div
                key={n.title}
                className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
              >
                <span className="text-2xl" aria-hidden="true">
                  {n.emoji}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-surface-900 dark:text-white">
                  {n.title}
                </h3>
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{n.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            To be transparent: <strong>ads cover hosting costs. Donations cover everything
            beyond that</strong> — new tools, better features, faster updates, and the time to
            keep the platform improving instead of stagnating.
          </p>
        </Section>

        {/* Section 4 — Where the money goes */}
        <Section title="Exactly where the money goes">
          <p>
            I want to be specific, because vague &ldquo;support our work&rdquo; pages annoy me
            too. Here's roughly how donations are used:
          </p>
          <div className="not-prose mt-4 space-y-4">
            {ALLOCATION.map((a) => (
              <div key={a.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">
                    {a.label}
                  </span>
                  <span className="font-mono text-sm font-bold text-surface-700 dark:text-surface-200">
                    {a.percent}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                  <div
                    className={`h-full rounded-full ${a.bar}`}
                    style={{ width: `${Math.max(a.percent, 1.5)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-surface-600 dark:text-surface-400">{a.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5 — How to donate */}
        <section id="donate" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Ways to support UtilityApps
          </h2>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
            Choose whichever is easiest for you. Every contribution matters, big or small.
          </p>

          <DonateGroup title="Pay with any currency">
            <DonateButton
              emoji="💳"
              label="KoraPay"
              note="Card, bank transfer or wallet — any currency"
              href={DONATE_LINKS.korapay}
            />
          </DonateGroup>

          {/* PayPal — send to recipient email */}
          {hasPayPal() && (
            <div className="mt-4">
              <details className="group rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-surface-900 dark:text-white">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">🅿️</span> PayPal — send to my account
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-surface-100 px-5 py-4 text-sm dark:border-surface-800">
                  <dl className="space-y-1.5">
                    <DetailRow label="Recipient" value={PAYPAL.accountName} />
                    <DetailRow label="Email" value={PAYPAL.email} />
                  </dl>
                  <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
                    Open{" "}
                    <a
                      href="https://www.paypal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                    >
                      PayPal
                    </a>
                    , choose <em>Send</em>, and use the email above. PayPal handles the currency
                    conversion automatically.
                  </p>
                </div>
              </details>
            </div>
          )}

          {/* Bank transfer — native <details> reveal, no JS needed */}
          <div className="mt-4">
            <details className="group rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-surface-900 dark:text-white">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🏦</span> Direct bank transfer (Nigeria)
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-surface-100 px-5 py-4 text-sm dark:border-surface-800">
                {hasBankDetails() ? (
                  <>
                    <dl className="space-y-1.5">
                      <DetailRow label="Account name" value={BANK_DETAILS.accountName} />
                      <DetailRow label="Bank" value={BANK_DETAILS.bankName} />
                      <DetailRow label="Account number" value={BANK_DETAILS.accountNumber} />
                    </dl>
                    <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
                      After transferring, please email{" "}
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {SUPPORT_EMAIL}
                      </a>{" "}
                      with your name so I can thank you personally and add you to the supporter
                      wall (with your permission).
                    </p>
                  </>
                ) : (
                  <p className="text-surface-600 dark:text-surface-300">
                    Bank transfer details are being set up. In the meantime, email{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    to arrange a transfer.
                  </p>
                )}
              </div>
            </details>
          </div>

          {/* Free ways to help */}
          <div className="mt-8 rounded-2xl border border-surface-200 bg-gradient-to-br from-primary-50/40 to-white p-5 dark:border-surface-800 dark:from-primary-500/10 dark:to-surface-900">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
              Can't donate? These help just as much
            </h3>
            <ul className="mt-3 space-y-2">
              {FREE_WAYS.map((w) => (
                <li
                  key={w.text}
                  className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-200"
                >
                  <span aria-hidden="true">{w.emoji}</span>
                  <span>{w.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 6 — Thank you wall */}
        <Section title="Thank you wall">
          <p>
            Supporters who give over $10 (or its equivalent) get listed here, with their
            permission. This isn't a vanity wall — it's a small public thanks for keeping this
            platform free for everyone else. Want to stay anonymous? Just say so when you donate.
          </p>
          <div className="not-prose mt-3">
            {SUPPORTERS.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {SUPPORTERS.map((name) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-sm font-medium text-surface-800 dark:bg-surface-800 dark:text-surface-100"
                  >
                    <Heart className="h-3 w-3 text-primary-500" />
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-surface-200 p-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
                Be the first name on the wall. 💛
              </p>
            )}
          </div>
        </Section>

        {/* Section 7 — FAQ */}
        <Section title="Frequently asked questions">
          <div className="not-prose mt-2 space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-surface-900 dark:text-white">
                  {item.q}
                  <ChevronRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="border-t border-surface-100 px-5 py-4 text-sm text-surface-600 dark:border-surface-800 dark:text-surface-300">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Section>

        {/* Section 8 — Final ask */}
        <section className="mt-14 rounded-3xl border border-surface-200 bg-gradient-to-br from-primary-50/50 to-white p-6 text-center sm:p-10 dark:border-surface-800 dark:from-primary-500/10 dark:to-surface-900">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            One more thing
          </h2>
          <div className="mx-auto mt-3 max-w-xl space-y-3 text-sm text-surface-600 dark:text-surface-300">
            <p>If you've read this far, thank you — genuinely.</p>
            <p>
              You don't have to donate. UtilityApps will keep running whether you do or not. But
              every dollar from someone who found a tool useful is fuel to keep building — the
              difference between a side project that fades and one that grows into something
              genuinely valuable for millions of people.
            </p>
            <p>
              If a tool here saved you 10 minutes, consider giving back the value of those 10
              minutes. If a calculator helped you make a better financial decision, consider 1% of
              what it saved you. Any amount is meaningful.
            </p>
          </div>
          <a
            href="#donate"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            <Heart className="h-5 w-5" />
            Donate now
          </a>
          <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
            <MapPin className="h-3.5 w-3.5" />
            Daniel — Lagos, Nigeria
          </p>
        </section>
      </div>
    </>
  );
}

// ── Helper components ──────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
          Donate
        </li>
      </ol>
    </nav>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
        {title}
      </h2>
      <div className="prose prose-sm prose-surface mt-3 max-w-none text-surface-600 dark:prose-invert dark:text-surface-300">
        {children}
      </div>
    </section>
  );
}

function DonateGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {title}
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function DonateButton({
  emoji,
  label,
  note,
  href,
}: {
  emoji: string;
  label: string;
  note: string;
  href: string;
}) {
  // Hide the option entirely if its link hasn't been configured yet.
  if (isPlaceholder(href)) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
    >
      <span className="text-2xl" aria-hidden="true">
        {emoji}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {label}
        </span>
        <span className="block text-xs text-surface-500 dark:text-surface-400">{note}</span>
      </span>
    </a>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </dt>
      <dd className="font-mono text-sm text-surface-900 dark:text-white">{value}</dd>
    </div>
  );
}
