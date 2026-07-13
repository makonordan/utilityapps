import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  DollarSign,
  HeartHandshake,
  Home,
  ReceiptText,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Wrench,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { ReceiptGenerator } from "@/components/business-tools/ReceiptGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/receipt-generator landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The interactive generator (form + live
 * preview + PDF/image/print export) is the <ReceiptGenerator /> client
 * island in the middle.
 *
 * Structurally mirrors app/tools/letterhead-generator/page.tsx — same
 * breadcrumb/hero/ads/use-cases/SEO/FAQ/related-tools skeleton — so the
 * two Business Tools pages read as one family.
 */

const TOOL_ID = "receipt-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Receipt Generator — PDF & Image";
const DESCRIPTION =
  "Create professional receipts for free. Add your business details, items, tax and totals, then download as a PDF or image. No signup, nothing uploaded — it all runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Receipt Generator — PDF & Image, No Signup",
    description:
      "Build a professional receipt in seconds — logo, line items, tax and discount, payment method — then download it as a PDF or image. Free, browser-side, no signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Receipt Generator")}&description=${encodeURIComponent("Create & download receipts as PDF or image")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Receipt Generator — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ── Use cases ────────────────────────────────────────────────────────────

interface UseCase {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
}

const USE_CASES: UseCase[] = [
  {
    title: "Small retail",
    body: "Ring up an in-person sale and hand over a clean, itemized receipt without owning a POS system or a printer.",
    icon: Store,
  },
  {
    title: "Freelancers",
    body: "Confirm a one-off payment or a deposit from a client with a receipt that looks as professional as your invoices.",
    icon: Briefcase,
  },
  {
    title: "Market sellers",
    body: "Generate a receipt on the spot at a stall, pop-up, or craft fair — no terminal or signal required, just a phone.",
    icon: ShoppingBasket,
  },
  {
    title: "Services",
    body: "Cleaners, tutors, repair techs, and other service providers can issue a receipt the moment a job is paid for.",
    icon: Wrench,
  },
  {
    title: "Rent receipts",
    body: "Landlords and property managers documenting a tenant's rent payment for either party's own records.",
    icon: Home,
  },
  {
    title: "Donation receipts",
    body: "Nonprofits and community groups acknowledging a cash or in-kind donation with a dated, itemized record.",
    icon: HeartHandshake,
  },
];

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this receipt generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, and no limit on how many receipts you create or download.",
  },
  {
    question: "Do you store my business or customer data?",
    answer:
      "No. Everything you type — business details, customer info, items, prices — stays in your browser and is used only to render the receipt you download. The one exception is a logo you choose to upload, which is hosted so it can be embedded in the file; nothing else is saved or sent anywhere.",
  },
  {
    question: "Can I add my business logo?",
    answer:
      "Yes. Upload a PNG, JPG, or WEBP file directly (it's compressed and hosted automatically), or paste the URL of a logo you already host somewhere.",
  },
  {
    question: "Should I download the PDF or the image?",
    answer:
      "PDF if you need something print-ready that opens identically on any device — best for emailing or filing. Image (PNG) if you need to drop the receipt into a chat app, text message, or somewhere that doesn't accept PDF attachments. Both are generated from the exact same data, so they always match.",
  },
  {
    question: "Can I add tax and a discount?",
    answer:
      "Yes. Set a tax rate as a percentage, and add a discount as either a flat amount or a percentage — the subtotal, discount, tax, and total all recalculate live as you type.",
  },
  {
    question: "Does the receipt number generate automatically?",
    answer:
      "Yes — a receipt number in the format RCP-2026-0001 is generated as soon as the page loads. It's fully editable, so you can overwrite it with your own numbering scheme (or your accounting software's) if you have one.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "USD, GBP, EUR, NGN, GHS, KES, ZAR, CAD, and AUD. Pick one from the Currency section and every price on the receipt — line items, subtotal, tax, total — formats with the right symbol automatically.",
  },
  {
    question: "Is this a valid, legal receipt?",
    answer:
      "It's a legitimate proof-of-payment document for everyday record-keeping — freelance work, rent, market sales, donations, and similar transactions. It is not a substitute for a registered POS or fiscal receipt in jurisdictions that legally require sales to run through certified fiscal hardware or software — check your local tax authority's rules if that applies to your business.",
  },
  {
    question: "Can I email the receipt to a customer?",
    answer:
      "Yes — download it as a PDF or PNG and attach it to an email the normal way. There's no built-in email sender; the file is yours to send however you'd like, which also means it never passes through our servers.",
  },
  {
    question: "Does this work on mobile?",
    answer:
      "Yes. The form and live preview both adapt to small screens — the preview stacks above the form on mobile — and PDF, image, and print all work the same on a phone or tablet as on desktop.",
  },
];

// ── Related tools ────────────────────────────────────────────────────────

const RELATED_TOOL_IDS = [
  "invoice-generator",
  "letterhead-generator",
  "business-card",
  "company-stamp-generator",
] as const;

export default function ReceiptGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : ReceiptText;
  const accent = category?.color ?? "#2563EB";

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    {
      name: tool?.category ?? "Business Tools",
      url: category
        ? `${SITE_CONFIG.url}/tools/categories/${category.id}`
        : `${SITE_CONFIG.url}/tools`,
    },
    {
      name: tool?.name ?? "Receipt Generator",
      url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool?.name ?? "Receipt Generator",
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

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Breadcrumb */}
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
            {tool?.name ?? "Receipt Generator"}
          </span>
        </nav>

        {/* Hero */}
        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ backgroundColor: accent }}
          >
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {tool?.category ?? "Business Tools"}
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
              Free Receipt Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Create a professional receipt in seconds — add your business
              details, line items, tax and discount, then download it as a
              PDF or an image. Free, with no signup, and everything runs
              right in your browser.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={ReceiptText}>PDF & image export</TrustChip>
              <TrustChip Icon={Zap}>Totals update live</TrustChip>
            </ul>
          </div>
        </header>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <ReceiptGenerator />
        </section>

        {/* Bottom ad — right after the tool, before the long-form content.
            Gives ad viewability a boost since users who scroll past the
            tool are more engaged. */}
        <AdSlot position="bottom" className="mt-10" />

        {/* Use-case grid */}
        <section className="mt-14">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Made for
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Any in-person or one-off payment that needs a paper trail.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => {
              const Ico = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    <Ico className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
                    {uc.title}
                  </h3>
                  <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{uc.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEO / long-form content */}
        <section className="mt-14 space-y-10">
          <ContentBlock
            title="What a receipt must include"
            body={
              <p>
                A receipt only needs to answer four questions: who was paid,
                who paid, for what, and how much. In practice that means the
                business name and contact details, the date of the
                transaction, an itemized list of what was purchased (with
                quantity and unit price), and the total amount paid. A
                receipt number makes it easy to reference later — for
                either party. Beyond that, a few fields are situational
                rather than mandatory: tax, if the sale was taxable; a
                discount, if one was applied; the payment method (cash,
                card, transfer); and, for cash sales, the amount tendered
                and change given. None of this needs a template with fifty
                fields — the shorter and clearer a receipt is, the faster
                both sides can confirm it matches what happened.
              </p>
            }
          />
          <ContentBlock
            title="Receipt vs. invoice — what's the difference"
            body={
              <p>
                An invoice is a request for payment, sent before or at the
                time money changes hands — it says &ldquo;you owe this
                amount.&rdquo; A receipt is proof that payment already
                happened — it says &ldquo;this was paid.&rdquo; A business
                might send an invoice, wait for payment, then issue a
                receipt once the money clears; or, for an in-person sale,
                skip the invoice entirely and hand over a receipt on the
                spot. The two documents share a lot of structure — business
                details, line items, totals — which is why they&rsquo;re easy to
                confuse, but they answer different questions and usually
                belong in different steps of a transaction.
              </p>
            }
          />
          <ContentBlock
            title="When businesses issue receipts"
            body={
              <p>
                Most obviously: any point-of-sale transaction — retail,
                food service, a market stall. Beyond that, receipts are
                standard whenever a customer might need proof of purchase
                later — for a warranty claim, a return, an expense report,
                or their own bookkeeping. Service providers (cleaners,
                tutors, contractors) issue them right after a job is paid
                for. Landlords issue rent receipts so tenants have a record
                of each payment, which matters for disputes and, in some
                places, for tenants&rsquo; own tax filings. Nonprofits issue
                donation receipts so donors have a dated record of what
                they gave — useful for the donor&rsquo;s records even where it
                doesn&rsquo;t carry formal tax-deductible status.
              </p>
            }
          />
          <ContentBlock
            title="Tax on receipts"
            body={
              <p>
                If a sale is subject to sales tax, VAT, or a similar levy,
                the receipt should show the tax rate applied and the tax
                amount separately from the subtotal, so the total is
                traceable back to its parts. This tool computes that
                automatically — set a tax rate and it&rsquo;s broken out as its
                own line before the total. What it can&rsquo;t do is tell you
                whether your specific sale is taxable, at what rate, or
                whether your jurisdiction requires receipts to be issued
                through certified fiscal hardware or software rather than a
                generic document like this one — that varies by country and
                sometimes by business type, so check with a local
                accountant or your tax authority if you&rsquo;re unsure.
              </p>
            }
          />
          <ContentBlock
            title="How to print or email a receipt"
            body={
              <p>
                To print: fill in the receipt, click Print, and use your
                browser&rsquo;s print dialog — the layout is isolated to just the
                receipt, so nothing else on the page ends up on paper. To
                email or message it: download the PDF (best for email,
                since it opens identically everywhere) or the PNG image
                (handy for a text message or chat app that doesn&rsquo;t accept
                PDF attachments), then attach it the normal way. Either
                file is generated in your browser and saved straight to
                your device — there&rsquo;s no server step in between, so nothing
                about the transaction passes through us.
              </p>
            }
          />
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <header className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Short answers to the questions we hear most.
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

        {/* Related */}
        <section className="mt-16">
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                Related tools
              </h2>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                Other free tools people use to run and document their
                business.
              </p>
            </div>
            {category && (
              <Link
                href={`/tools/categories/${category.id}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Browse all Business Tools <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_TOOL_IDS.map((id) => {
              const t = TOOLS_BY_ID[id];
              if (!t) return null;
              const Ico = getIcon(t.icon);
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
                    style={{ backgroundColor: cat?.color ?? "#0066FF" }}
                  >
                    <Ico className="h-5 w-5" />
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
          </div>
        </section>
      </div>
    </>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────

function ScriptJsonLd({ data }: { data: object }) {
  // Escape angle brackets so an unlucky </script> in the payload can't
  // break out of the tag. Matches the pattern used elsewhere on the site.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function TrustChip({
  Icon,
  children,
}: {
  Icon: typeof Zap;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-1 rounded-full border border-surface-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-surface-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200">
      <Icon className="h-3 w-3 text-primary-500" />
      {children}
    </li>
  );
}

function ContentBlock({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-surface-600 dark:text-surface-300 sm:text-base">
        {body}
      </div>
    </article>
  );
}
