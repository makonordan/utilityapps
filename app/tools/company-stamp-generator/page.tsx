import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Copy,
  DollarSign,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { CompanyStampGenerator } from "@/components/business-tools/CompanyStampGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { STAMP_DISCLAIMER } from "@/lib/companyStamp";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/company-stamp-generator landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The interactive designer (shape/text/style
 * controls + live preview + PNG/SVG export) is the
 * <CompanyStampGenerator /> client island in the middle.
 *
 * The disclaimer that governs this whole tool's scope — internal
 * business marking and decorative seals only, never a notary/
 * government/bank imitation — is shown twice on purpose: once here in
 * the hero (so it's visible to anyone who doesn't scroll to the tool,
 * including crawlers) and again inside <CompanyStampGenerator /> itself
 * (so it's visible right where people are actively designing a stamp).
 */

const TOOL_ID = "company-stamp-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Company Stamp Generator — PNG Seals";
const DESCRIPTION =
  "Create free business stamps and company seals online. Make APPROVED, PAID, RECEIVED, DRAFT and custom round or rectangular stamps. Download as a transparent PNG for your documents. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Company Stamp Generator — Transparent PNG Seals",
    description:
      "Design APPROVED, PAID, RECEIVED, DRAFT and custom round, rectangular, or oval company stamps, then download a transparent PNG. No signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Company Stamp Generator")}&description=${encodeURIComponent("APPROVED, PAID & custom seals — transparent PNG")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Company Stamp Generator — UtilityApps",
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
    title: "Mark invoices PAID",
    body: "Stamp a paid invoice before you file or email it back, so anyone who opens it later can tell at a glance it's settled.",
    icon: DollarSign,
  },
  {
    title: "Stamp documents APPROVED",
    body: "Sign off on internal paperwork, expense reports, or drafts that have cleared review — a visual marker that's faster than a signature line.",
    icon: CheckCircle2,
  },
  {
    title: "Mark copies and drafts",
    body: "Distinguish a working DRAFT from the ORIGINAL, or label a COPY so nobody mistakes a duplicate for the source document.",
    icon: Copy,
  },
  {
    title: "RECEIVED date-stamping",
    body: "Log the date paperwork, deliveries, or applications came in — pair the RECEIVED preset with a blank line for a handwritten date.",
    icon: CalendarCheck,
  },
  {
    title: "CONFIDENTIAL marking",
    body: "Flag internal documents that shouldn't circulate outside the team before they're shared, printed, or attached to an email.",
    icon: Lock,
  },
  {
    title: "Decorative company seal",
    body: "Add a round seal with your company name and founding year to letters and certificates for a finished, established look.",
    icon: Award,
  },
];

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this stamp generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, and no limit on how many stamps you design or download. Pick a preset or start from scratch, customize it, and download as many times as you like.",
  },
  {
    question: "Does the stamp have a transparent background?",
    answer:
      "Yes. The PNG download has a genuinely transparent background — only the ink (text, border, and any texture) is opaque. Drop it onto a document in Word, Google Docs, or a PDF editor and you won't see a white box around it.",
  },
  {
    question: "Can I make a round company seal?",
    answer:
      "Yes. Choose the Round Seal shape and you get a circular stamp with an outer border, curved top and bottom text, and a large center word or symbol — the classic seal look. Rectangle and Oval shapes are also available.",
  },
  {
    question: "Can I add curved text around the seal?",
    answer:
      "Yes, on Round and Oval shapes. The Top text and Bottom text fields curve along the seal's edge — typically a company name on top and a city or \"EST.\" year on the bottom, with optional star separators between them.",
  },
  {
    question: "How do I add the stamp to a Word document or PDF?",
    answer:
      "Download the PNG, then in Word or Google Docs use Insert → Image and place it wherever you need it on the page — the transparent background means it sits cleanly over existing text or a signature line. Most PDF editors have a similar \"Insert image\" or \"Stamp\" tool that accepts a PNG the same way.",
  },
  {
    question: "Can I choose the ink color and border?",
    answer:
      "Yes. Pick from five common ink colors (red, blue, black, green, purple) or set any custom hex color, and choose a border style — single, double, dashed, rope, or none — with an adjustable width. A rotation slider adds a natural, slightly-tilted \"stamped\" look.",
  },
  {
    question: "What size should I download for printing?",
    answer:
      "Use Large (1200px) or Print (2400px) for anything you plan to print — the higher resolution stays crisp at full size on paper. Small (300px) and Medium (600px) are enough for on-screen use, like inserting into a PDF you'll only ever view digitally.",
  },
  {
    question: "Can I add a date to my stamp?",
    answer:
      "Yes. The Date field has three modes: none, a blank underline you fill in by hand after printing (the classic rubber-stamp look), or a fixed date baked directly into the design.",
  },
  {
    question: "Do you store my stamp or company details?",
    answer:
      "No. Everything — the text you type, the shape, the colors — stays in your browser and is used only to render the preview and the file you download. Nothing is uploaded or saved on our servers.",
  },
  {
    question: "Can I use this for official or notary seals?",
    answer:
      "No. This tool is built for internal business document marking and decorative company seals only — things like APPROVED, PAID, or a generic company seal for letters. It does not include, and won't add, wording or templates that imitate a notary public, government department, court, bank, or other official authentication mark. Don't use stamps made here to claim an authorization or verification you don't actually have.",
  },
];

// ── Related tools ────────────────────────────────────────────────────────

const RELATED_TOOL_IDS = [
  "letterhead-generator",
  "business-card",
  "email-signature-generator",
  "qr-code-generator",
] as const;

export default function CompanyStampGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : ShieldCheck;
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
      name: tool?.name ?? "Company Stamp Generator",
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
    name: tool?.name ?? "Company Stamp Generator",
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
            {tool?.name ?? "Company Stamp Generator"}
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
              Free Company Stamp Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Design a business stamp or company seal — round, rectangular,
              or oval — with the text, color, border, and texture you want,
              then download it as a transparent PNG ready to drop onto your
              documents. Free, with no signup required.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={Zap}>Transparent PNG</TrustChip>
              <TrustChip Icon={Award}>Round, rectangle &amp; oval</TrustChip>
            </ul>
          </div>
        </header>

        {/* Required, persistent disclaimer — same wording shown inside the
            tool itself. */}
        <section className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
          <p>{STAMP_DISCLAIMER}</p>
        </section>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <CompanyStampGenerator />
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
              Everyday internal marking — not a replacement for an official seal.
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
            title="What business stamps are used for"
            body={
              <p>
                A business stamp is a quick, visual way to mark the status
                of an internal document without writing a note every time.
                APPROVED tells the next person in line a document has
                cleared review. PAID confirms an invoice is settled. RECEIVED
                logs that something came in, often alongside a handwritten
                date. DRAFT flags a document that isn&rsquo;t final yet, and
                CONFIDENTIAL signals it shouldn&rsquo;t leave the team. None
                of these carry legal weight on their own — they&rsquo;re a
                faster, more consistent alternative to writing the same word
                by hand on every document that needs it, and they look more
                deliberate than a sticky note or a margin scribble.
              </p>
            }
          />
          <ContentBlock
            title="Round seals vs rectangular stamps vs oval — when each is used"
            body={
              <p>
                Round seals are the traditional shape for a company seal —
                curved text around the rim (company name on top, city or
                founding year on the bottom) framing a center emblem or
                word, giving it a formal, established look. Rectangular
                stamps are the workhorse shape for short, single-word
                statuses like APPROVED, PAID, or DRAFT — simpler to read at
                a glance and closest to a real rubber ink stamp. Oval seals
                sit between the two: they carry curved top-and-bottom text
                like a round seal but read a little less formal, and fit
                more naturally into a wide signature block or footer.
              </p>
            }
          />
          <ContentBlock
            title="How to design a clear, professional company stamp"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  Keep the center word short and bold — APPROVED or PAID
                  reads instantly; a long sentence in the center just looks
                  cramped.
                </li>
                <li>
                  Pick one ink color and stick to it. Real stamps are a
                  single color; matching that convention is what makes the
                  design read as a stamp rather than a graphic.
                </li>
                <li>
                  Add a small rotation (a few degrees) and a rubber-worn or
                  vintage texture — a perfectly straight, perfectly clean
                  stamp reads as a digital graphic, not something that was
                  physically pressed onto paper.
                </li>
                <li>
                  Use a double or rope border for a more formal seal look, a
                  single border for a simple status stamp, or no border at
                  all for a minimal mark.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="Why a transparent PNG matters"
            body={
              <p>
                A stamp with a white background sits on top of your document
                as an ugly rectangle, covering whatever text was underneath
                it. A transparent PNG has no background at all — only the
                ink (the text, border, and texture) is opaque — so when you
                place it over a signature line, a paid invoice, or a
                document footer, only the stamp itself shows. That&rsquo;s
                what makes it usable directly inside a document rather than
                only as a standalone image.
              </p>
            }
          />
          <ContentBlock
            title="How to insert the stamp into Word, Google Docs, or a PDF"
            body={
              <p>
                In Microsoft Word or Google Docs, use Insert → Image, choose
                the downloaded PNG, and drag it into position — the
                transparent background means it layers cleanly over
                existing text or a signature line without a visible box
                around it. In most PDF editors, look for an &ldquo;Insert
                image&rdquo; or &ldquo;Stamp&rdquo; tool that accepts a PNG
                the same way; some let you save the stamp as a reusable
                stamp in your stamp library so you don&rsquo;t have to
                re-upload it every time.
              </p>
            }
          />
          <ContentBlock
            title="Responsible use"
            body={
              <p>
                This generator is built for internal business document
                marking and decorative company seals — APPROVED, PAID,
                RECEIVED, DRAFT, CONFIDENTIAL, or a generic company seal for
                letters and certificates. It is <strong>not</strong> a way
                to create or imitate an official seal: it doesn&rsquo;t
                include notary public wording, government department or
                court seals, apostille or embassy seals, bank endorsement
                stamps, or any emblem meant to imply legal authentication or
                certification by a third party — and it shouldn&rsquo;t be
                used to build one yourself. Use what you make here to mark
                your own documents, not to misrepresent an approval,
                verification, or authorization you don&rsquo;t actually
                have.
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
                Other free tools people use to build out their business
                identity.
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
