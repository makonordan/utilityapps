import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { AppsDirectory } from "@/components/apps/AppsDirectory";
import { AppSuggestionForm } from "@/components/apps/AppSuggestionForm";
import { AppsNewsletter } from "@/components/apps/AppsNewsletter";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { generateBreadcrumbSchema, generateCollectionPageSchema, jsonLdString } from "@/lib/schema";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Apps — Honestly Curated Software Recommendations";
const DESCRIPTION =
  "Software recommendations you can actually trust. Curated by usefulness, not by who paid the most. Compare invoicing, project management, email marketing, HR and payroll software by industry, region, price and business size. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "best invoicing software",
    "best accounting software for small business",
    "best project management software",
    "best email marketing software",
    "best HR and payroll software",
    "software comparison",
    "honest software reviews",
  ],
  alternates: { canonical: "/apps" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/apps`,
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

const breadcrumbJsonLd = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Apps", url: "/apps" },
]);

const collectionJsonLd = generateCollectionPageSchema({
  name: "Business Software Directory",
  description: DESCRIPTION,
  url: "/apps",
});

const TRUST_ITEMS = [
  "Independently reviewed",
  "Pricing verified",
  "We say when NOT to use something",
  "Affiliate-funded, never affiliate-ranked",
];

const FUNNEL_TOOL_IDS = ["invoice-generator", "receipt-generator", "purchase-order-generator"] as const;
const FUNNEL_TOOLS = FUNNEL_TOOL_IDS.map((id) => TOOLS_BY_ID[id]).filter(
  (t): t is NonNullable<typeof t> => Boolean(t)
);

const FAQS: FAQItem[] = [
  {
    q: "How do you choose which software to recommend?",
    a: "We start from usefulness for a specific kind of user — a freelancer, an agency, a growing small business — not from which vendor pays the highest commission. Every listing is checked against the vendor's own live pricing page, and every verdict includes who it's genuinely a poor fit for, not just who it's great for.",
  },
  {
    q: "Do vendors pay you for placement?",
    a: "No — never. No vendor can pay to appear higher in these rankings, get an 'Editor's Pick' badge, or have a negative point removed from their listing. Sort order is driven by our own editorial signals (popularity, trending, price, recency) or a plain alphabetical/verified-date order — not by commission rate.",
  },
  {
    q: "How do you make money?",
    a: "Some links on this page are affiliate links — if you sign up or buy through one, we may earn a commission at no extra cost to you. That's disclosed on every card that uses one. It funds the free tools on this site; it does not influence which tools we recommend or how we rank them.",
  },
  {
    q: "Is your pricing information current?",
    a: "Every listing shows the date we last verified its pricing directly against the vendor's own pricing page. Software pricing changes often, so we periodically recheck it — if you spot a price that looks out of date, use the suggestion box below and we'll fix it.",
  },
  {
    q: "Do I need an account to use this page?",
    a: "No. Browse, search, and filter freely — there's no signup, no gate, and no paywall on any part of this directory.",
  },
  {
    q: "Do you list tools that don't pay you anything?",
    a: "Yes. Plenty of tools here have no affiliate program at all, and we still list them when they're genuinely useful. A tool having no affiliate relationship never keeps it off this page, and having one never bumps it up.",
  },
  {
    q: "Why don't you use star ratings?",
    a: "Crowd-averaged stars are easy to game, easy to buy, and tell you almost nothing about who a tool is actually wrong for. Instead we write a specific verdict, a list of who it's best for, and a list of who should avoid it — more useful than a number, harder to fake.",
  },
  {
    q: "How often are reviews updated?",
    a: "Pricing is spot-checked on a recurring basis and whenever we're alerted it might be stale; editorial verdicts are revisited whenever a vendor materially changes their product or plans. The verified date on each listing tells you exactly how fresh it is.",
  },
  {
    q: "Can I suggest software to add?",
    a: "Yes — email us or use the suggestion box below with the tool's name and why you use it. We read every suggestion, though we can't guarantee every tool makes the cut.",
  },
  {
    q: "Which invoicing/accounting software is best for freelancers vs. a small business?",
    a: "It depends on volume and complexity, not just size. A solo freelancer sending a handful of invoices a month is usually better off starting free (Zoho Invoice, Wave) and only paying once they outgrow it. A small business with employees, inventory, or multi-currency needs typically wants a full accounting suite like QuickBooks Online, Xero, or Zoho Books instead. Use the Business size and Free tier filters above to narrow it down for your situation.",
  },
];

function TransparencyBox() {
  return (
    <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/60 p-6 dark:border-accent-700/40 dark:bg-accent-500/10">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600 dark:text-accent-400" />
        <div>
          <h2 className="text-base font-bold text-surface-900 dark:text-white">
            How we make money — and why it doesn&apos;t change our rankings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
            Some links here are affiliate links; if you buy, we may earn a commission at no cost to
            you. We rank by what&apos;s genuinely best for the person reading, not by commission. We
            list tools with no affiliate program too, and we tell you when a tool isn&apos;t right
            for you. If that ever stops being true, this page stops being worth reading.
          </p>
          <Link
            href="/affiliate-disclosure"
            className="mt-3 inline-block text-sm font-semibold text-accent-700 underline-offset-2 hover:underline dark:text-accent-300"
          >
            Read our full affiliate disclosure →
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppsDirectoryFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="h-12 animate-pulse rounded-xl bg-surface-100 dark:bg-surface-900" />
      <div className="mt-6 h-56 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-900" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-900" />
        ))}
      </div>
    </div>
  );
}

export default function AppsDirectoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(collectionJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
              <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
                Apps
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
            Software you can actually trust
          </h1>
          <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
            Honestly curated recommendations — ranked by usefulness, never by who paid us. No
            signup, no pay-to-rank, no fake badges.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-surface-700 dark:text-surface-200">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success-600 dark:text-success-400" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <TransparencyBox />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="top" />
      </div>

      <Suspense fallback={<AppsDirectoryFallback />}>
        <AppsDirectory />
      </Suspense>

      {/* Funnel to our own free tools */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-700/40 dark:bg-primary-500/10">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            Start free with our tools
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            Not ready to pay? Use our free tools first — come back when you outgrow them.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {FUNNEL_TOOLS.map((tool) => (
              <li key={tool.id}>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-semibold text-surface-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:hover:border-primary-700 dark:hover:text-primary-300"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <AppsNewsletter />
      </section>

      {/* SEO content */}
      <section className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="prose prose-surface max-w-none dark:prose-invert">
          <h2>How to choose invoicing or accounting software</h2>
          <p>
            Most buyers pick invoicing or accounting software the wrong way: they search &ldquo;best
            accounting software,&rdquo; open the first three &ldquo;best of&rdquo; lists, and pick
            whichever name appears highest on all of them. That approach optimizes for what the
            software industry pays to promote, not for what actually fits your business. The right
            starting question isn&apos;t &ldquo;what&apos;s the best invoicing software&rdquo; — it&apos;s
            &ldquo;what does <em>my</em> business actually need to send invoices, get paid, and keep
            clean books, without paying for capability I&apos;ll never use?&rdquo;
          </p>
          <p>
            Start with volume and complexity, not brand recognition. A solo freelancer sending five
            invoices a month has almost nothing in common with a 12-person agency running payroll
            and multi-currency billing, even though software review sites often lump both into the
            same &ldquo;best accounting software&rdquo; list. Filter by your actual business size and
            industry first, then compare the handful of tools left — that&apos;s a much shorter, more
            honest list than any generic ranking.
          </p>

          <h2>What actually matters (and what doesn&apos;t)</h2>
          <p>
            <strong>Free tier reality.</strong> Marketing pages love the word &ldquo;free,&rdquo; but the
            reality varies wildly — some free tiers are genuinely usable indefinitely (Wave, Zoho
            Invoice), while others are a thinly disguised trial that stops working the moment you
            hit five clients or 30 days. Read what the free tier actually allows, not just that one
            exists.
          </p>
          <p>
            <strong>Regional tax and VAT support.</strong> A tool built around US sales tax and 1099
            filing can be a poor fit for a UK sole trader who needs Making Tax Digital compliance, or
            a business charging VAT across the EU. Conversely, tools built for UK/EU tax rules
            sometimes have thin US support. This is one of the most commonly overlooked factors in
            generic &ldquo;best of&rdquo; lists, which are almost always written from a single
            country&apos;s perspective.
          </p>
          <p>
            <strong>Integrations.</strong> The software that matters most isn&apos;t the invoicing tool
            in isolation — it&apos;s the invoicing tool plus your bank, your payment processor, your
            e-commerce platform, and whatever your accountant already uses. A cheaper tool that
            doesn&apos;t talk to any of those can cost you more time than a pricier one that does.
          </p>
          <p>
            <strong>Scaling costs.</strong> The sticker price on a pricing page is the starting price,
            not the price you&apos;ll pay in year two. Per-user fees, client caps, and add-on modules
            (payroll, receipt scanning, extra currencies) can quietly double your monthly bill as you
            grow. Model the cost at the size you expect to be in 12 months, not just today.
          </p>

          <h2>Why most &ldquo;best of&rdquo; lists are pay-to-play — and how this one differs</h2>
          <p>
            Many software directories rank primarily by affiliate commission: the vendor with the
            richest payout program tends to land in the top slot, badge and all, regardless of fit.
            It&apos;s rarely disclosed clearly, and it means the &ldquo;best&rdquo; result is often just
            the best-funded one. We do use affiliate links — that&apos;s disclosed above and on every
            card that has one — but sort order here is driven by editorial signals (popularity,
            trending status, price, how recently we verified it), never by commission rate. We also
            list tools with no affiliate program at all, and every listing has an honest
            &ldquo;avoid if&rdquo; section, because telling you when <em>not</em> to use something is
            the part most vendor-funded lists conveniently skip.
          </p>

          <h2>When free tools are enough</h2>
          <p>
            If you&apos;re sending a handful of invoices a month and don&apos;t need payroll, inventory,
            or multi-entity accounting, a paid subscription is often premature. Our own free{" "}
            <Link href="/tools/invoice-generator">Invoice Generator</Link>,{" "}
            <Link href="/tools/receipt-generator">Receipt Generator</Link>, and{" "}
            <Link href="/tools/purchase-order-generator">Purchase Order Generator</Link> cover the
            basics with no signup and no monthly fee. Use those until the volume, tax complexity, or
            team size of your business genuinely outgrows a free tool — then use the filters above to
            find the paid software that fits what you&apos;ve actually become, not what a generic
            ranking assumes you are.
          </p>
        </div>
      </section>

      <ToolFAQ items={FAQS} title="Apps FAQ" />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AppSuggestionForm />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="bottom" />
      </div>
    </>
  );
}
