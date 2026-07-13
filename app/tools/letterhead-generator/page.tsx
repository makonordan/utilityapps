import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronRight,
  DollarSign,
  FileSignature,
  FileText,
  Landmark,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { LetterheadGenerator } from "@/components/business-tools/LetterheadGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/letterhead-generator landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The interactive generator (form + preview +
 * Word/PDF/PNG export) is the <LetterheadGenerator /> client island in
 * the middle.
 *
 * Positioning angle: most free "letterhead maker" sites hand back a
 * locked JPG/PNG you can't type into. This one's headline differentiator
 * is the editable .docx — the logo/branding sit in a real Word Header
 * section so the body area stays free for typing an actual letter.
 */

const TOOL_ID = "letterhead-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Letterhead Generator — Word, PDF, PNG";
const DESCRIPTION =
  "Create a free professional company letterhead in seconds. Add your logo and details, choose A4 or US Letter, and download as an editable Word document, PDF, or image. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Letterhead Generator — Word, PDF, or Image",
    description:
      "Design a professional company letterhead and download it as an editable Word document, print-ready PDF, or image. A4, US Letter, and more. No signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Letterhead Generator")}&description=${encodeURIComponent("Editable Word, PDF, or image — A4 & US Letter")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Letterhead Generator — UtilityApps",
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
    title: "Official letters",
    body: "Reference letters, notices, and general correspondence that need to look like they came from a real organization.",
    icon: FileText,
  },
  {
    title: "Invoices & quotes",
    body: "Give a quote or one-off invoice a branded header before you paste in the line items and totals.",
    icon: Receipt,
  },
  {
    title: "Contracts",
    body: "Freelance agreements, NDAs, and short contracts drafted on branded paper instead of a blank page.",
    icon: FileSignature,
  },
  {
    title: "Job offers",
    body: "Offer letters and onboarding paperwork that read as official the moment a candidate opens the file.",
    icon: Briefcase,
  },
  {
    title: "Client correspondence",
    body: "Status updates, proposals, and formal emails-turned-letters that carry your logo and contact details.",
    icon: MessageSquare,
  },
  {
    title: "Government & formal submissions",
    body: "Grant applications, compliance letters, and filings where a registration number and clean layout matter.",
    icon: Landmark,
  },
];

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this letterhead generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, and no limit on how many letterheads you create or download. Design it, download it in whichever format you need, and use it however you like.",
  },
  {
    question: "Can I edit the letterhead in Microsoft Word?",
    answer:
      "Yes — that's the point of the .docx download. Your logo, company name, and contact details are placed in the document's Header section, so they repeat automatically and stay out of the way of the body area. Open the file in Word (or Google Docs, LibreOffice), click into the blank body, and type your letter.",
  },
  {
    question: "What paper sizes are supported?",
    answer:
      "A4, US Letter, US Legal, A5, Executive, and B5. Pick one in the Paper size section before you download — the Word, PDF, and image exports all use the exact dimensions of whichever size you chose. A4 is selected by default since it's the worldwide standard.",
  },
  {
    question: "Can I add my company logo?",
    answer:
      "Yes. Upload a PNG, JPG, or WEBP file directly (it's resized and hosted automatically), or paste the URL of a logo you already host somewhere. A PNG with a transparent background gives the cleanest result, especially on templates with a colored header band.",
  },
  {
    question: "Should I use A4 or US Letter?",
    answer:
      "A4 (210 × 297 mm) is the standard almost everywhere outside North America — most of Europe, Africa, Asia, and Latin America. US Letter (215.9 × 279.4 mm) is the standard in the United States and Canada. Use whichever matches where your recipient — or your printer — is.",
  },
  {
    question: "What format should I download — Word, PDF, or image?",
    answer:
      "Word (.docx) if you're going to type an actual letter into it — it's fully editable. PDF if you need a fixed, print-ready file that looks identical on every device and doesn't accept accidental edits. PNG if you need to drop the letterhead into a tool that doesn't accept Word or PDF, like pasting a header image into an email or a slide.",
  },
  {
    question: "Can I use this letterhead in Google Docs?",
    answer:
      "Yes, two ways. Either download the .docx and open it directly in Google Docs (File → Open, it converts automatically), or download the header-only transparent PNG and insert it into a Google Docs header via Insert → Header & page number, then Insert → Image.",
  },
  {
    question: "Do you store my company details?",
    answer:
      "No. Every field you fill in — company name, address, colors, everything — stays in your browser and is used only to generate the file you download. The one exception is a logo you choose to upload, which is hosted so it can be embedded in your files; nothing else is saved or sent anywhere.",
  },
  {
    question: "Can I add my company registration or tax number?",
    answer:
      "Yes — there's an optional Registration / Tax number field in the Contact & registration section. It shows up in the footer area on templates designed around a detailed footer (like Elegant Footer), and you can also surface it via the general footer text field on any template.",
  },
  {
    question: "How do I add my own colors and fonts?",
    answer:
      "The Style section has a primary color and an accent color, each with a visual picker plus a hex input for an exact brand match, and a font selector with seven fonts (Arial, Calibri, Times New Roman, Georgia, Verdana, Garamond, Cambria) chosen specifically because they render identically in your browser preview and inside Word — no font substitution surprises.",
  },
];

// ── Related tools ────────────────────────────────────────────────────────

const RELATED_TOOL_IDS = [
  "business-card",
  "email-signature-generator",
  "qr-code-generator",
  "company-stamp-generator",
] as const;

export default function LetterheadGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : FileText;
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
      name: tool?.name ?? "Letterhead Generator",
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
    name: tool?.name ?? "Letterhead Generator",
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
            {tool?.name ?? "Letterhead Generator"}
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
              Free Letterhead Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Design a professional company letterhead — add your logo,
              address, and brand colors, pick a layout and a paper size, then
              download it as an editable Word document, a print-ready PDF, or
              an image. Free, with no signup required.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={FileText}>Editable Word file</TrustChip>
              <TrustChip Icon={Zap}>A4, US Letter & more</TrustChip>
            </ul>
          </div>
        </header>

        {/* Differentiation banner — the editable-Word pitch that separates
            this from letterhead makers that only hand back a locked
            JPG/PNG. */}
        <section className="mt-6 rounded-3xl border border-success-200 bg-success-50/70 p-5 dark:border-success-500/30 dark:bg-success-500/10">
          <p className="flex items-start gap-3 text-sm text-success-900 dark:text-success-100">
            <Check className="mt-1 h-4 w-4 shrink-0 text-success-600 dark:text-success-400" />
            <span>
              <strong>
                Download an editable Word letterhead — not just a locked
                image.
              </strong>{" "}
              Type your letter directly, or get a print-ready PDF instead.
              Free, with A4, US Letter, and more.
            </span>
          </p>
        </section>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <LetterheadGenerator />
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
              Any document that should read as official the moment someone
              opens it.
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
            title="What a letterhead is, and why businesses use one"
            body={
              <p>
                A letterhead is the branded heading — usually a logo, company
                name, and contact details — printed at the top of official
                correspondence. It exists for one reason: professionalism.
                A letter on plain paper reads as informal, even careless;
                the same letter on a clean letterhead reads as something an
                organization stands behind. That matters most for
                correspondence with legal or financial weight — contracts,
                invoices, formal notices, offer letters — where the reader
                needs a quick, confident signal that the document is
                legitimate. It also reinforces brand consistency: every
                letter, quote, or notice that goes out carries the same
                logo, colors, and contact details, so recipients recognize
                your organization at a glance regardless of who on your team
                sent it.
              </p>
            }
          />
          <ContentBlock
            title="What to include on a letterhead"
            body={
              <p>
                At minimum: your logo, full company name, and a way to reach
                you — phone, email, or both. Most letterheads also include a
                physical address (required for a lot of formal and legal
                correspondence), a website, and — for regulated industries or
                government submissions — a company registration or tax
                number. Keep the list tight: a letterhead crowded with every
                possible detail starts competing with the letter itself.
                Logo, name, and the two or three contact methods someone is
                actually likely to use is usually enough.
              </p>
            }
          />
          <ContentBlock
            title="Choosing the right paper size: A4 vs US Letter vs Legal"
            body={
              <p>
                A4 (210 × 297 mm) is the standard almost everywhere outside
                North America — Europe, Africa, most of Asia, and Latin
                America all print on A4 by default. US Letter (215.9 × 279.4
                mm) is the standard across the United States and Canada —
                slightly wider and slightly shorter than A4. US Legal (215.9
                × 355.6 mm) is longer again, mostly reserved for contracts
                and legal filings that need the extra length. Pick based on
                where your recipient — or your printer — is; sending an A4
                letterhead to a US Letter printer (or vice versa) usually
                just prints fine with slightly different margins, but
                matching the regional standard looks more deliberate.
              </p>
            }
          />
          <ContentBlock
            title="Word vs PDF vs image — when to use each"
            body={
              <p>
                Download Word (.docx) when you&rsquo;re about to write an
                actual letter — the logo and details sit in the
                document&rsquo;s Header, so the body stays free for typing,
                and anyone on your team can reuse the same file for the next
                letter. Download PDF when you need something print-ready
                and final — it looks identical on every device,
                doesn&rsquo;t shift when opened in a different app, and
                reads as more finished for a one-off document you&rsquo;re
                not going to edit further. Download the image (PNG) when
                you need to drop the letterhead into a tool that
                doesn&rsquo;t accept Word or PDF at all — pasting a header
                into Google Docs, an email signature, or a slide deck. The
                header-only transparent version is built specifically for
                that last case.
              </p>
            }
          />
          <ContentBlock
            title="Design tips for a clean, professional letterhead"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  Use a PNG logo with a transparent background — it drops
                  cleanly onto any template, including ones with a colored
                  header band, instead of showing an ugly white box.
                </li>
                <li>
                  Limit yourself to two brand colors — a primary and an
                  accent. More than that starts to look like a ransom note
                  instead of a letterhead.
                </li>
                <li>
                  Leave enough body space. A header (and footer, if you use
                  one) that eats a third of the page leaves too little room
                  for an actual letter — keep the branded area lean.
                </li>
                <li>
                  Keep contact details to what someone would actually use —
                  phone and email cover most cases; add a physical address
                  and registration number only where the document type
                  calls for it.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="How to use the Word template"
            body={
              <p>
                Download the .docx, open it in Microsoft Word (or Google
                Docs, or LibreOffice), and click anywhere in the blank body
                area below the header. Type your letter exactly as you would
                in any Word document — the logo, company name, and contact
                details stay anchored in the header and repeat automatically
                if the letter runs to a second page. If you turned on
                &ldquo;Include sample letter body text&rdquo; before
                downloading, you&rsquo;ll see placeholder date, recipient,
                and paragraph lines already in place — delete them and type
                over them, or use them as a guide for where each part of the
                letter goes.
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
