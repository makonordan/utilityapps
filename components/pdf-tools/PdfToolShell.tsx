import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Smartphone, Zap } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { ToolRatingBadge } from "@/components/tools/ToolRatingBadge";
import { ToolVsLinks } from "@/components/tools/ToolVsLinks";
import { getIcon } from "@/lib/icons";
import {
  PDF_TOOL_PUBLISHED,
  getPdfFeatureList,
  getPdfHowTo,
  type HowToStep,
} from "@/lib/pdfFaqs";
import { TOOLS, TOOLS_BY_ID } from "@/lib/tools";
import {
  getCachedToolRating,
  toAggregateRatingSchema,
  type ToolRatingSummary,
} from "@/lib/toolRating";
import { SITE_CONFIG, cn } from "@/lib/utils";

interface PdfToolShellProps {
  toolId: string;
  title: string;
  description: string;
  children: ReactNode;
  seoContent?: ReactNode;
  faqItems?: FAQItem[];
  howToSteps?: HowToStep[];
  className?: string;
  /**
   * Set true for Phase-2 server-backed tools (Office ↔ PDF via ConvertAPI).
   * Swaps the trust badge and disclaimer banner to be honest about uploads.
   */
  serverProcessing?: boolean;
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Free" },
  { icon: Zap, label: "No Signup" },
  { icon: Smartphone, label: "Works on Mobile" },
] as const;

function getRelatedPdfTools(currentId: string) {
  return TOOLS.filter((t) => t.category === "PDF Tools" && t.id !== currentId);
}

export async function PdfToolShell({
  toolId,
  title,
  description,
  children,
  seoContent,
  faqItems,
  howToSteps,
  className,
  serverProcessing = false,
}: PdfToolShellProps) {
  const tool = TOOLS_BY_ID[toolId];
  const Icon = getIcon(tool?.icon ?? "FileText");
  const related = getRelatedPdfTools(toolId);
  const steps = howToSteps ?? getPdfHowTo(toolId);
  // Cached hourly — keeps the page statically prerendered while still
  // surfacing fresh ratings within a sensible SEO window.
  const rating = await getCachedToolRating(toolId);

  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-10 sm:py-14", className)}>
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
          Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href="/tools/categories/pdf-tools"
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          PDF Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">{title}</span>
      </nav>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md"
        >
          <Icon className="h-7 w-7" />
        </span>
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            {title}
          </h1>
          <p className="max-w-2xl text-base text-surface-600 dark:text-surface-300">
            {description}
          </p>
          <ul className="flex flex-wrap items-center gap-2">
            {rating && (
              <li>
                <ToolRatingBadge rating={rating} />
              </li>
            )}
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200"
              >
                <badge.icon className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                {badge.label}
              </li>
            ))}
            {serverProcessing ? (
              <li className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                <ShieldCheck className="h-3 w-3" /> Server conversion
              </li>
            ) : (
              <li className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
                <ShieldCheck className="h-3 w-3" /> Browser-side
              </li>
            )}
          </ul>
        </div>
      </header>

      {serverProcessing ? (
        <p className="mt-4 inline-flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <span aria-hidden="true">⚠️</span>
          <span>
            <strong>Server-side conversion.</strong> Office ↔ PDF needs a Word/Excel/PowerPoint engine that
            doesn&rsquo;t run in your browser, so this tool uploads your file to our conversion
            partner, returns the result, and deletes the file immediately afterward. 10 MB per file,
            10 conversions per hour per IP.
          </span>
        </p>
      ) : (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          <span aria-hidden="true">🔒</span>
          Everything runs in your browser — your PDFs are not uploaded to a server.
        </p>
      )}

      <AdSlot position="top" />

      <section className="mt-2">{children}</section>

      <AdSlot position="bottom" />

      {seoContent && (
        <section className="prose prose-surface mt-12 max-w-none dark:prose-invert">
          {seoContent}
        </section>
      )}

      {faqItems && faqItems.length > 0 && (
        <div className="mt-12">
          <ToolFAQ items={faqItems} />
        </div>
      )}

      <ToolVsLinks toolId={toolId} />

      {related.length > 0 && (
        <section className="mt-14 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                More PDF tools
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                Related tools
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      <SeoSchemas
        toolId={toolId}
        title={title}
        description={description}
        steps={steps}
        rating={rating}
      />
    </div>
  );
}

function SeoSchemas({
  toolId,
  title,
  description,
  steps,
  rating,
}: {
  toolId: string;
  title: string;
  description: string;
  steps: HowToStep[];
  rating: ToolRatingSummary | null;
}) {
  const base = SITE_CONFIG.url;
  const tool = TOOLS_BY_ID[toolId];
  const longDescription = tool?.longDescription || description;
  const featureList = getPdfFeatureList(toolId);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${base}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: "PDF Tools",
        item: `${base}/tools/categories/pdf-tools`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: `${base}/tools/${toolId}`,
      },
    ],
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${base}/tools/${toolId}`,
    name: title,
    description: longDescription,
    url: `${base}/tools/${toolId}`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "PDF Tool",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList,
    // Conditionally embed the aggregateRating so Google's SoftwareApplication
    // rich-snippet stars become eligible once we have ≥3 ratings on this tool.
    // Below threshold the field is omitted entirely (per Google: don't ship
    // empty/zero rating schemas).
    ...(rating && { aggregateRating: toAggregateRatingSchema(rating) }),
    screenshot: `${base}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=pdf-tool`,
    softwareVersion: "1.0",
    datePublished: PDF_TOOL_PUBLISHED,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  const howTo =
    steps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use ${title}`,
          description: longDescription,
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(software).replace(/</g, "\\u003c"),
        }}
      />
      {howTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howTo).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
