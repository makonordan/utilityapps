import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Heart,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { HelpFreeActions } from "@/components/support/HelpFreeActions";
import { OneTimeDonation } from "@/components/support/OneTimeDonation";
import { TierSelector, type TierCheckoutUrls } from "@/components/support/TierSelector";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { BANK_DETAILS, PAYPAL, SUPPORT_EMAIL, hasBankDetails, hasPayPal } from "@/lib/donate";
import { generateBreadcrumbSchema, jsonLdString } from "@/lib/schema";
import {
  TIERS,
  getCachedPublicSupporters,
  resolveCheckoutUrl,
} from "@/lib/support";
import type { SupporterPublicRow, SupporterTier } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Support UtilityApps — Keep 100+ Free Tools Alive";
const DESCRIPTION =
  "Help an independent developer keep UtilityApps free, private, and growing. Three supporter tiers from $5/month, plus one-time donations and business tool sponsorship. Built by Daniel in Lagos, Nigeria.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/support" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/support`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

const ALLOCATION = [
  { label: "Infrastructure (hosting, APIs, domains)", percent: 25, bar: "bg-primary-500" },
  { label: "Content writer (part-time)", percent: 25, bar: "bg-accent-500" },
  { label: "Social media manager (part-time)", percent: 25, bar: "bg-success-500" },
  { label: "AI tools and design subscriptions", percent: 15, bar: "bg-warning-500" },
  { label: "New tool development", percent: 10, bar: "bg-amber-500" },
];

const FAQS: FAQItem[] = [
  {
    q: "Are donations tax-deductible?",
    a: "No. UtilityApps isn't a registered nonprofit. Donations are personal gifts to support a free service, not tax-deductible contributions.",
  },
  {
    q: "What payment methods do you accept?",
    a: "International recurring: Buy Me a Coffee Memberships and Stripe (cards, Apple Pay, Google Pay). Nigerian recurring + one-time: Paystack (cards, bank transfer, USSD). One-time international tips: Buy Me a Coffee or PayPal. Direct Nigerian bank transfer is also available — details revealed on the page after click.",
  },
  {
    q: "Can I cancel my membership any time?",
    a: "Yes — instantly, no questions asked, no cancellation form. Whichever provider you signed up with (BMaC, Stripe, Paystack) has a self-serve cancel button in their dashboard.",
  },
  {
    q: "What happens if you can't sustain UtilityApps?",
    a: "My commitment: if I ever decide to stop maintaining UtilityApps, I'll give 90 days' notice, open-source the codebase if possible, and find a way to keep the most popular tools accessible. I will never sell user data, lock features that were previously free, or quietly shut down without notice.",
  },
  {
    q: "Do I need to pay to use the tools?",
    a: "No. Every tool is free, forever. Support is optional — it funds new tools, faster updates, and the time to keep improving the platform.",
  },
  {
    q: "Can I sponsor a specific tool?",
    a: `Yes. If you or your company want to sponsor a specific tool from the roadmap with subtle attribution, email ${SUPPORT_EMAIL}. Recognition is a footer credit on that tool's page — subject to relevance (no gambling, adult content, or scam-adjacent industries).`,
  },
  {
    q: "How do I get my supporter badge?",
    a: "After your first payment, the supporter badge is auto-applied to your account based on the email you used to subscribe. Log in with that email and the badge is yours.",
  },
  {
    q: "Is this a registered company?",
    a: "Not yet. UtilityApps is a personal project run by Daniel as an individual. If donations and revenue grow to where a company makes sense, supporters will be informed before anything changes.",
  },
  {
    q: "Can I support without my name shown?",
    a: 'Yes. During signup, choose "Anonymous" and you\'ll appear on the wall as "🌟 Anonymous Supporter" with no name visible.',
  },
  {
    q: "How are funds actually spent?",
    a: "Quarterly transparency posts on the blog show exactly what money came in, where it went, and what it funded. The first such post will land within a quarter of the program launching.",
  },
];

export default async function SupportPage() {
  const supporters = await getCachedPublicSupporters(100);

  // Resolve provider URLs server-side per tier per cycle. Resulting
  // record is plain JSON so we can hand it to the client TierSelector.
  const checkoutUrls: TierCheckoutUrls = Object.fromEntries(
    TIERS.map((t) => [
      t.id,
      {
        monthly: {
          bmac: resolveCheckoutUrl(t, "bmac", "monthly"),
          stripe: resolveCheckoutUrl(t, "stripe", "monthly"),
          paystack: resolveCheckoutUrl(t, "paystack", "monthly"),
        },
        annual: {
          bmac: resolveCheckoutUrl(t, "bmac", "annual"),
          stripe: resolveCheckoutUrl(t, "stripe", "annual"),
          paystack: resolveCheckoutUrl(t, "paystack", "annual"),
        },
      },
    ])
  );

  const bmacOneTimeUrl = process.env.BMAC_ONE_TIME_URL || null;
  const stripeOneTimeUrl = process.env.STRIPE_ONE_TIME_URL
    ? "/api/checkout/stripe?mode=one_time"
    : null;
  const paystackOneTimeUrl = process.env.PAYSTACK_ONE_TIME_URL
    ? "/api/checkout/paystack?mode=one_time"
    : null;

  return (
    <>
      <Schema />

      <Hero />

      <Story />

      <Allocation />

      <Tiers checkoutUrls={checkoutUrls} />

      <OneTime
        bmacOneTimeUrl={bmacOneTimeUrl}
        stripeOneTimeUrl={stripeOneTimeUrl}
        paystackOneTimeUrl={paystackOneTimeUrl}
      />

      <SponsorshipSection />

      <Wall supporters={supporters} />

      <FaqSection />

      <FreeHelp />

      <FounderNote />
    </>
  );
}

// ── Section components ────────────────────────────────────────────────────

function Schema() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Support", url: `${SITE_CONFIG.url}/support` },
  ]);
  const donateAction = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/support`,
    potentialAction: {
      "@type": "DonateAction",
      recipient: { "@type": "Person", name: "Daniel" },
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(donateAction) }}
      />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-12 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-xs text-surface-500 dark:text-surface-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-surface-400" aria-hidden="true" />
            <li
              className="font-medium text-surface-700 dark:text-surface-200"
              aria-current="page"
            >
              Support
            </li>
          </ol>
        </nav>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          Founding-supporter program
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Support UtilityApps — keep 100+ free tools alive
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Help an independent developer in Lagos keep building the open web —
          free, private, useful, forever.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#tiers"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            Become a Founding Supporter
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#one-time"
            className="text-sm font-medium text-surface-600 underline decoration-dotted underline-offset-2 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          >
            or make a one-time donation
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-surface-600 dark:text-surface-300">
          {[
            "No signup",
            "Privacy first",
            "100+ free tools",
            "Built in Lagos",
          ].map((t) => (
            <li
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 dark:bg-surface-800"
            >
              <ShieldCheck className="h-3 w-3 text-success-500" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        Why I&rsquo;m asking for help
      </h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-surface-700 dark:text-surface-200">
        <p>
          Hi — I&rsquo;m Daniel, the developer behind UtilityApps. I built the
          first version of this site as a weekend project to solve a small
          frustration: every time I needed a quick utility online — compress
          an image, calculate a loan, count words — I landed on a site
          demanding my email, locking features behind a paywall, or burying
          the actual tool under five ads.
        </p>
        <p>
          One Word Counter grew into hundreds of utilities: PDF tools, image
          converters, calculators, audio editors, design helpers, legal
          generators, on-device translation. The rule has been simple from
          day one: every tool is free, no signup, no Pro tier, no usage cap.
          Most run inside your browser so files never leave your device.
        </p>
        <p>
          For a long time I funded everything personally — evenings and
          weekends, with ad revenue covering hosting. That worked when
          UtilityApps was small. It doesn&rsquo;t scale to the next 100
          tools, the content quality I want to ship, or the time the
          platform now needs to keep improving instead of stagnating.
        </p>
        <p>
          I&rsquo;m asking for help because doing this alone isn&rsquo;t
          sustainable any more — not because the project is in trouble, but
          because I want to push it further than one person&rsquo;s evenings
          allow. Supporters fund the things ads can&rsquo;t: hired help on
          content + social, paid APIs, faster shipping.
        </p>
      </div>

      <blockquote className="mt-8 rounded-3xl border border-primary-200 bg-primary-50/40 p-6 text-base italic text-surface-800 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-surface-100">
        &ldquo;I built UtilityApps because I was tired of the internet
        getting worse. I&rsquo;m asking for help because doing it alone
        isn&rsquo;t sustainable any more.&rdquo;
        <footer className="mt-3 text-xs font-semibold uppercase tracking-wider not-italic text-primary-700 dark:text-primary-300">
          — Daniel, Lagos
        </footer>
      </blockquote>
    </section>
  );
}

function Allocation() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        Where your money goes
      </h2>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
        Planned allocation as supporter revenue ramps. The split is a target,
        not a fixed budget — see the quarterly transparency post for the
        actual numbers.
      </p>
      <div className="mt-6 space-y-4">
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
                style={{ width: `${a.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-surface-500 dark:text-surface-400">
        I publish transparent quarterly updates showing exactly how support
        is being used.
      </p>
    </section>
  );
}

function Tiers({ checkoutUrls }: { checkoutUrls: TierCheckoutUrls }) {
  return (
    <section
      id="tiers"
      className="scroll-mt-24 border-y border-surface-200 bg-surface-50/60 py-16 dark:border-surface-800 dark:bg-surface-900/30"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Choose your support level
          </h2>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
            All tiers are monthly. Annual options save ~17% (2 months free).
          </p>
        </header>
        <TierSelector tiers={TIERS} checkoutUrls={checkoutUrls} />
      </div>
    </section>
  );
}

function OneTime({
  bmacOneTimeUrl,
  stripeOneTimeUrl,
  paystackOneTimeUrl,
}: {
  bmacOneTimeUrl: string | null;
  stripeOneTimeUrl: string | null;
  paystackOneTimeUrl: string | null;
}) {
  return (
    <section id="one-time" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        Prefer to support once?
      </h2>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
        Every contribution helps. Pick an amount and the easiest provider for
        you.
      </p>
      <div className="mt-6">
        <OneTimeDonation
          bmacUrl={bmacOneTimeUrl}
          stripeOneTimeUrl={stripeOneTimeUrl}
          paystackOneTimeUrl={paystackOneTimeUrl}
          paypal={hasPayPal() ? PAYPAL : null}
          bank={hasBankDetails() ? BANK_DETAILS : null}
        />
      </div>
    </section>
  );
}

function SponsorshipSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 dark:border-amber-500/30 dark:from-amber-500/5 dark:to-surface-900">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          >
            <Building2 className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Sponsor a specific tool (for businesses)
            </h2>
            <p className="mt-2 text-sm text-surface-700 dark:text-surface-200">
              Real-estate agencies, financial advisors, design firms — align
              your brand with the tools your audience already uses.
            </p>
            <p className="mt-3 text-sm text-surface-700 dark:text-surface-200">
              <strong>$100/month per tool sponsored.</strong> Subtle
              attribution on the tool page (&ldquo;Supported by [Brand]&rdquo;)
              plus a credit in the site footer. Annual contracts available
              with a 17% discount.
            </p>
            <p className="mt-3 text-xs text-surface-600 dark:text-surface-300">
              Example fits: Mortgage Calculator → a real-estate brokerage. BMI
              Calculator → a wellness brand. Salary Calculator → an accounting
              firm. Subject to relevance — no gambling, adult content, or
              scam-adjacent industries.
            </p>
            <div className="mt-5">
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Tool sponsorship inquiry")}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                Email to discuss sponsorship
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Wall({ supporters }: { supporters: SupporterPublicRow[] }) {
  return (
    <section className="border-y border-surface-200 bg-surface-50/60 py-16 dark:border-surface-800 dark:bg-surface-900/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Founding supporters
        </h2>
        <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
          These people made UtilityApps possible.
        </p>

        {supporters.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-surface-200 bg-white p-10 text-center dark:border-surface-800 dark:bg-surface-900">
            <p className="text-base font-semibold text-surface-900 dark:text-white">
              Be the first to become a Founding Supporter.
            </p>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Your name lives here forever (or stay anonymous — your call).
            </p>
            <a
              href="#tiers"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              See tiers
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : (
          <ul className="mt-6 flex flex-wrap gap-2">
            {supporters.map((s, i) => (
              <li key={`${s.display_name}-${i}`}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${tierChipClasses(s.tier)}`}
                >
                  <span aria-hidden="true">{tierEmoji(s.tier)}</span>
                  {s.display_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        Common questions
      </h2>
      <div className="mt-6">
        <ToolFAQ items={FAQS} title="" />
      </div>
    </section>
  );
}

function FreeHelp() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        Can&rsquo;t support financially? Here&rsquo;s how to still help
      </h2>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
        Word-of-mouth growth matters more to a project this size than any
        single donation.
      </p>
      <div className="mt-6">
        <HelpFreeActions />
      </div>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <div className="rounded-3xl border border-surface-200 bg-gradient-to-br from-primary-50/40 to-white p-8 text-center dark:border-surface-800 dark:from-primary-500/10 dark:to-surface-900">
        <h3 className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
          Thank you
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-surface-700 dark:text-surface-200">
          If you&rsquo;ve read this far — genuinely, thank you. Whether you
          support today, support later, or just share UtilityApps with one
          person who&rsquo;d find it useful, it all keeps the project alive.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          — Daniel, Lagos, Nigeria
        </p>
      </div>
    </section>
  );
}

function tierEmoji(tier: SupporterTier): string {
  switch (tier) {
    case "patron":
      return "👑";
    case "power":
      return "✨";
    case "supporter":
      return "💛";
    default:
      return "🌟";
  }
}

function tierChipClasses(tier: SupporterTier): string {
  switch (tier) {
    case "patron":
      return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300";
    case "power":
      return "bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300";
    case "supporter":
      return "bg-primary-100 text-primary-800 dark:bg-primary-500/15 dark:text-primary-300";
    default:
      return "bg-surface-200 text-surface-700 dark:bg-surface-800 dark:text-surface-200";
  }
}
