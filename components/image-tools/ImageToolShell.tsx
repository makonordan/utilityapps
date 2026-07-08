import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Cloud,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { ToolRatingBadge } from "@/components/tools/ToolRatingBadge";
import { ToolVsLinks } from "@/components/tools/ToolVsLinks";
import { getIcon } from "@/lib/icons";
import {
  IMAGE_TOOL_PUBLISHED,
  getImageFeatureList,
  getImageHowTo,
  type HowToStep,
} from "@/lib/imageFaqs";
import { TOOLS, TOOLS_BY_ID } from "@/lib/tools";
import {
  getCachedToolRating,
  toAggregateRatingSchema,
  type ToolRatingSummary,
} from "@/lib/toolRating";
import { SITE_CONFIG, cn } from "@/lib/utils";

interface ImageToolShellProps {
  toolId: string;
  title: string;
  description: string;
  children: ReactNode;
  processingLocation: "browser" | "api";
  apiRequired: boolean;
  /** Long-form SEO body — rendered between the bottom ad and the FAQ. */
  seoContent?: ReactNode;
  /** FAQ entries. Falls back to nothing if absent. */
  faqItems?: FAQItem[];
  /**
   * Optional override for HowTo steps. Defaults to `getImageHowTo(toolId)`
   * so individual pages don't need to pass them.
   */
  howToSteps?: HowToStep[];
  /**
   * Featured blog post to link to from the "Related reading" card. Defaults
   * to the image-compression deep dive, which is the only image-themed post
   * shipped so far. Pages with their own pick can pass an override.
   */
  relatedBlog?: { title: string; href: string };
  className?: string;
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Free" },
  { icon: Zap, label: "No Signup" },
  { icon: Smartphone, label: "Works on Mobile" },
] as const;

// Per-tool "Related reading" link. Maps each image tool to the most relevant
// blog post that actually exists in /content/blog. Tools not listed fall back
// to FALLBACK_BLOG. Update both ends if you add a new image-themed post.
const RELATED_BLOG_BY_TOOL: Record<
  string,
  { title: string; href: string } | undefined
> = {
  "compress-image": {
    title: "Best Free Image Compressor Tools in 2026",
    href: "/blog/best-free-image-compressor-tools-2026",
  },
  "resize-image": {
    title: "How to Resize Images for Social Media (Every Platform)",
    href: "/blog/how-to-resize-image-for-social-media",
  },
  "remove-background": {
    title: "How to Remove the Background From an Image (Free, 30 Seconds)",
    href: "/blog/how-to-remove-background-from-image-free",
  },
  "watermark-image": {
    title: "How to Add a Watermark to Your Photos (Without Photoshop)",
    href: "/blog/how-to-add-watermark-to-photos",
  },
  "upscale-image": {
    title: "What Is AI Image Upscaling? (And When It Actually Works)",
    href: "/blog/what-is-image-upscaling-ai",
  },
  "meme-generator": {
    title: "Best Free Meme Generators Online",
    href: "/blog/best-free-meme-generators-online",
  },
  "convert-to-jpg": {
    title: "JPG vs PNG vs WEBP: Which Image Format Should You Use?",
    href: "/blog/jpg-vs-png-vs-webp-which-format",
  },
  "convert-from-jpg": {
    title: "JPG vs PNG vs WEBP: Which Image Format Should You Use?",
    href: "/blog/jpg-vs-png-vs-webp-which-format",
  },
};

const FALLBACK_BLOG = {
  title: "JPG vs PNG vs WEBP: Which Image Format Should You Use?",
  href: "/blog/jpg-vs-png-vs-webp-which-format",
};

function getRelatedImageTools(currentId: string) {
  return TOOLS.filter(
    (t) => t.category === "Image Tools" && t.id !== currentId
  );
}

export async function ImageToolShell({
  toolId,
  title,
  description,
  children,
  processingLocation,
  apiRequired,
  seoContent,
  faqItems,
  howToSteps,
  relatedBlog,
  className,
}: ImageToolShellProps) {
  const tool = TOOLS_BY_ID[toolId];
  const Icon = getIcon(tool?.icon ?? "Sparkles");
  const related = getRelatedImageTools(toolId);
  const blogLink = relatedBlog ?? RELATED_BLOG_BY_TOOL[toolId] ?? FALLBACK_BLOG;
  const steps = howToSteps ?? getImageHowTo(toolId);
  const rating = await getCachedToolRating(toolId);

  const isBrowserSide = processingLocation === "browser";
  const privacyText = isBrowserSide
    ? "Files are processed in your browser — never uploaded to our servers."
    : "Files are sent securely over HTTPS to a processing API and discarded after the result is returned.";

  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-10 sm:py-14", className)}>
      {/* Breadcrumb */}
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
          href="/tools/image-tools"
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          Image Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">{title}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md"
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
            <li
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                isBrowserSide
                  ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300"
                  : "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
              )}
            >
              {isBrowserSide ? (
                <>
                  <ShieldCheck className="h-3 w-3" /> Browser-side
                </>
              ) : (
                <>
                  <Cloud className="h-3 w-3" /> Powered by API
                </>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* API notice */}
      {apiRequired && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-200">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Server-powered tool.</span> This tool sends
            your file to a third-party API to do the heavy lifting. Files are
            transmitted over HTTPS and not retained after processing.
          </p>
        </div>
      )}

      {/* Privacy notice */}
      <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <span aria-hidden="true">🔒</span>
        {privacyText}
      </p>

      {/* Top ad */}
      <AdSlot position="top" />

      {/* Tool body */}
      <section className="mt-2">{children}</section>

      {/* Bottom ad */}
      <AdSlot position="bottom" />

      {/* Long-form SEO content */}
      {seoContent && (
        <section className="prose prose-surface mt-12 max-w-none dark:prose-invert">
          {seoContent}
        </section>
      )}

      {/* Related reading link — gives Google an internal link to the
          image-themed blog post and gives the user a follow-up read. */}
      <aside className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200 bg-surface-50/60 p-4 dark:border-surface-800 dark:bg-surface-800/40">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Related reading
            </p>
            <p className="text-sm font-semibold text-surface-900 dark:text-white">
              {blogLink.title}
            </p>
          </div>
        </div>
        <Link
          href={blogLink.href}
          className="inline-flex items-center gap-1 rounded-lg border border-primary-300 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50 dark:border-primary-500/60 dark:text-primary-200 dark:hover:bg-primary-500/10"
        >
          Read article
          <ChevronRight className="h-3 w-3" />
        </Link>
      </aside>

      {/* FAQ */}
      {faqItems && faqItems.length > 0 && (
        <div className="mt-12">
          <ToolFAQ items={faqItems} />
        </div>
      )}

      {/* All sibling image tools — every other tool in the category, so users
          can jump between them without going back to the hub. */}
      <ToolVsLinks toolId={toolId} />

      {related.length > 0 && (
        <section className="mt-14 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                More image tools
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                All {related.length + 1} image tools
              </h2>
            </div>
            <Link
              href="/tools/image-tools"
              className="text-xs font-semibold text-primary-700 hover:underline dark:text-primary-300"
            >
              View hub →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD schemas: BreadcrumbList + SoftwareApplication + HowTo.
          FAQPage schema is auto-emitted by ToolFAQ above. */}
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

// ──────────────────────────────────────────────────────────────────────────
// Inline JSON-LD
// ──────────────────────────────────────────────────────────────────────────

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
  const featureList = getImageFeatureList(toolId);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${base}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Image Tools",
        item: `${base}/tools/image-tools`,
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
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Image Tool",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList,
    ...(rating && { aggregateRating: toAggregateRatingSchema(rating) }),
    screenshot: `${base}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=image-tool`,
    softwareVersion: "1.0",
    datePublished: IMAGE_TOOL_PUBLISHED,
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
