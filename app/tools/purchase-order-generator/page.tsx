import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  ClipboardList,
  DollarSign,
  HardHat,
  Package,
  ShieldCheck,
  Store,
  Warehouse,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { PurchaseOrderGenerator } from "@/components/business-tools/PurchaseOrderGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/purchase-order-generator landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The interactive generator (form + live
 * preview + PDF/image/print export) is the <PurchaseOrderGenerator />
 * client island in the middle.
 *
 * Structurally mirrors app/tools/receipt-generator/page.tsx — same
 * breadcrumb/hero/ads/use-cases/SEO/FAQ/related-tools skeleton — so the
 * Business Tools pages read as one family.
 */

const TOOL_ID = "purchase-order-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Purchase Order Generator — Create PO PDF Online | UtilityApps";
const DESCRIPTION =
  "Create free professional purchase orders (PO). Add buyer and supplier details, line items and terms, then download as PDF or image. No signup, nothing uploaded — it all runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Purchase Order Generator — PDF, No Signup",
    description:
      "Build a professional purchase order in seconds — buyer, supplier, line items, tax, shipping, and terms — then download it as a PDF or image. Free, browser-side, no signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Purchase Order Generator")}&description=${encodeURIComponent("Create & download a purchase order as PDF or image")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Purchase Order Generator — UtilityApps",
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
    title: "Ordering stock",
    body: "Restock inventory from a regular supplier with a clear record of SKUs, quantities, and agreed unit prices.",
    icon: Store,
  },
  {
    title: "Supplier orders",
    body: "Send a formal, numbered order to any vendor instead of a one-line email that's easy to lose track of.",
    icon: Building2,
  },
  {
    title: "Procurement",
    body: "Give a purchasing team the paper trail an ERP gives you — request, approval, and a document to match against the invoice.",
    icon: ClipboardList,
  },
  {
    title: "Contractor purchases",
    body: "Order materials for a job site with an expected delivery date and a shipping address that isn't your office.",
    icon: HardHat,
  },
  {
    title: "Office supplies",
    body: "Document a routine supply order — and who signed off on it — without opening a spreadsheet.",
    icon: Package,
  },
  {
    title: "Wholesale buying",
    body: "Order in bulk from a wholesaler with itemized quantities, unit prices, and shipping terms spelled out upfront.",
    icon: Warehouse,
  },
];

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this purchase order generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, and no limit on how many purchase orders you create or download.",
  },
  {
    question: "Is a PO made with this tool legally binding?",
    answer:
      "Generally, a purchase order becomes a binding commitment once the supplier accepts it — that's a brief, general description, not legal advice, and the specifics depend on your jurisdiction and your agreement with the supplier. This tool produces a complete, professional PO document; for high-value or legally sensitive orders, have your own procurement or legal process review the terms before it's sent.",
  },
  {
    question: "Do you store my buyer or supplier data?",
    answer:
      "No. Everything you type — buyer and supplier details, items, prices, terms — stays in your browser and is used only to render the PO you download. The one exception is a buyer logo you choose to upload, which is hosted so it can be embedded in the file; nothing else is saved or sent anywhere.",
  },
  {
    question: "What format is the PO number?",
    answer:
      "A PO number in the format PO-2026-0001 is generated automatically as soon as the page loads. It's fully editable, so you can overwrite it with your own numbering scheme (or your accounting/procurement software's) if you have one.",
  },
  {
    question: "What's the difference between a purchase order and an invoice?",
    answer:
      "A purchase order is the buyer requesting goods or services, sent before anything ships. An invoice is the supplier billing the buyer, sent after — usually referencing the original PO number so the two can be matched up. If you need to bill a client rather than order from a supplier, use the Invoice Generator instead.",
  },
  {
    question: "Can I add tax and shipping cost?",
    answer:
      "Yes. Set a tax rate as a percentage and a flat shipping cost, plus an optional discount as either a flat amount or a percentage — the subtotal, discount, tax, shipping, and total all recalculate live as you type.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "USD, GBP, EUR, NGN, GHS, KES, ZAR, CAD, and AUD. Pick one from the Currency section and every price on the order — line items, subtotal, tax, shipping, total — formats with the right symbol automatically.",
  },
  {
    question: "Can I add terms and conditions?",
    answer:
      "Yes — there's a dedicated Terms & conditions field that appears on the PO above the authorized-by signature line. A starter clause covering payment timing and delivery matching is pre-filled; edit or replace it with your own.",
  },
  {
    question: "Can I email or print the PO?",
    answer:
      "Both. Download it as a PDF and attach it to an email the normal way, or click Print to send it straight to your printer — the print layout isolates just the PO, so nothing else on the page ends up on paper. There's no built-in email sender, which also means the order never passes through our servers.",
  },
  {
    question: "Does this work on mobile?",
    answer:
      "Yes. The form and live preview both adapt to small screens — the preview stacks above the form on mobile — and PDF, image, and print all work the same on a phone or tablet as on desktop.",
  },
];

// ── Related tools ────────────────────────────────────────────────────────

const RELATED_TOOL_IDS = ["receipt-generator", "invoice-generator", "letterhead-generator"] as const;

export default function PurchaseOrderGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : ClipboardList;
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
      name: tool?.name ?? "Purchase Order Generator",
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
    name: tool?.name ?? "Purchase Order Generator",
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
            {tool?.name ?? "Purchase Order Generator"}
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
              Free Purchase Order Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Create a professional purchase order in seconds — add buyer
              and supplier details, line items, tax, shipping, and terms,
              then download it as a PDF or an image. Free, with no
              signup, and everything runs right in your browser.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={ClipboardList}>PDF & image export</TrustChip>
              <TrustChip Icon={Zap}>Totals update live</TrustChip>
            </ul>
            <p className="mt-3 text-xs text-surface-400 dark:text-surface-500">
              This tool creates purchase order documents for your own business use. It does not
              provide legal or procurement advice.
            </p>
          </div>
        </header>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <PurchaseOrderGenerator />
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
              Any purchase from a supplier that needs a paper trail before
              goods or materials ship.
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
            title="What a purchase order is, and why businesses use one"
            body={
              <p>
                A purchase order (PO) is a document a buyer sends to a
                supplier to formally request goods or services at an
                agreed price, before any money changes hands or anything
                ships. It exists to remove ambiguity: once a supplier
                accepts a PO, both sides have a shared, dated record of
                exactly what was ordered, how much of it, at what price,
                and by when — which matters the moment a shipment shows
                up short, a price gets disputed, or an order needs to be
                matched against an invoice during payment. For any
                business that buys from the same suppliers repeatedly, a
                PO system also makes spending easy to track and audit,
                since every purchase is tied to a numbered document
                instead of a phone call or a one-line email.
              </p>
            }
          />
          <ContentBlock
            title="Purchase order vs. invoice"
            body={
              <p>
                The two documents map to opposite ends of the same
                transaction. A purchase order comes first — it&rsquo;s the
                buyer requesting goods or services, before anything ships
                and before any money changes hands. An invoice comes
                after — it&rsquo;s the supplier billing the buyer, usually once
                the order has been fulfilled, and it should reference the
                original PO number so both sides can match one against
                the other. In short: a PO says &ldquo;please supply
                this,&rdquo; an invoice says &ldquo;here&rsquo;s what you owe for
                what I supplied.&rdquo; Businesses that buy from the same
                suppliers repeatedly typically see both documents for
                every order, in that order.
              </p>
            }
          />
          <ContentBlock
            title="What a purchase order must include"
            body={
              <p>
                At minimum: who&rsquo;s buying (the buyer) and who&rsquo;s selling
                (the supplier), a PO number and date, and an itemized list
                of what&rsquo;s being ordered — description, quantity, and unit
                price for each line. Most POs also carry a SKU or product
                code per line so the supplier can match the order against
                their own catalog without guessing, plus a shipping
                address and expected delivery date if goods are going
                somewhere other than the buyer&rsquo;s main office. Financial
                terms — tax, shipping cost, any discount, and the total —
                round it out, along with terms and conditions covering
                things like payment timing and what happens if the
                delivered goods don&rsquo;t match the order.
              </p>
            }
          />
          <ContentBlock
            title="The purchase order process in procurement"
            body={
              <p>
                A buyer creates a PO and sends it to a supplier. The
                supplier reviews it and either accepts it as-is or comes
                back with changes — a different price, a longer lead time,
                a substitute item. Once both sides agree, the PO becomes
                the reference point for the rest of the transaction: the
                supplier ships against it, and when they invoice the
                buyer, that invoice should reference the same PO number
                and line items so accounts payable can check the invoice
                against what was actually ordered before releasing
                payment. Any mismatch — wrong quantity, wrong price, an
                item that was never ordered — gets caught at that
                three-way match instead of after the money&rsquo;s gone. Larger
                organizations often add an approval step before the PO
                ever reaches the supplier; smaller ones usually skip
                straight from &ldquo;decide to buy&rdquo; to &ldquo;send the PO.&rdquo;
              </p>
            }
          />
          <ContentBlock
            title="When small businesses use purchase orders"
            body={
              <p>
                Not every purchase needs one — a one-off, pay-on-the-spot
                buy rarely does. POs earn their keep once a business
                orders from the same suppliers repeatedly, orders in bulk,
                or needs a record to reconcile against an invoice later.
                A café ordering weekly from a produce supplier, a
                contractor ordering materials for a specific job, a
                retailer restocking inventory, or a nonprofit documenting
                a purchase against a grant budget all benefit from the
                same thing: a dated, numbered document that says exactly
                what was agreed before the goods showed up. It also
                matters for accountability — an &ldquo;authorized by&rdquo; name on
                the PO means every purchase can be traced back to who
                approved it, which gets harder to reconstruct after the
                fact from an email thread.
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
