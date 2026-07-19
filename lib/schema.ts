import type { FAQItem } from "@/components/tools/ToolFAQ";

import type { AppListing } from "./apps/types";
import type { BlogPostMeta } from "./blog";
import type { Product } from "./products";
import type { Tool } from "./tools";
import { SITE_CONFIG } from "./utils";

const ORG = {
  "@type": "Organization" as const,
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icon.png` },
};

const PUBLISHER = {
  "@type": "Organization" as const,
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icon.png` },
};

/** Maps a BlogPostMeta.author string to their public profile, so article
 *  schema can credit a real Person (E-E-A-T) instead of a faceless
 *  Organization. Add an entry here for each named byline in use. */
const AUTHOR_PROFILES: Record<string, { url: string; sameAs: string[]; jobTitle: string }> = {
  "Daniel M.": {
    url: `${SITE_CONFIG.url}/about#author`,
    sameAs: ["https://www.linkedin.com/in/makonordaniel/"],
    jobTitle: "Founder, UtilityApps",
  },
};

/** The author's own profile links (e.g. LinkedIn), for UI use outside JSON-LD
 *  — the byline link on blog posts and the About page bio card. */
export function getAuthorProfile(author: string): { url: string; sameAs: string[] } | null {
  return AUTHOR_PROFILES[author] ?? null;
}

export function generateAuthorSchema(author: string): object {
  const profile = AUTHOR_PROFILES[author];
  if (!profile) return { "@type": "Organization" as const, name: author, url: SITE_CONFIG.url };
  return {
    "@type": "Person" as const,
    name: author,
    url: profile.url,
    sameAs: profile.sameAs,
    jobTitle: profile.jobTitle,
  };
}

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.author,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    logo: `${SITE_CONFIG.url}/icon.png`,
    sameAs: [
      `https://x.com/${SITE_CONFIG.twitterHandle.replace(/^@/, "")}`,
      "https://www.youtube.com/@UtilityAppsSite",
      "https://www.linkedin.com/company/utilityapps/",
      "https://www.instagram.com/utilityappssite",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@utilityapps.site",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  };
}

export function generateWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: "UtilityApps — Free AI Tools",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: ORG,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbCrumb[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function generateToolSchema(tool: Tool): object {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.longDescription,
    applicationCategory: tool.category.replace(/ Tools$/, "Application"),
    operatingSystem: "Any (Web)",
    url: `${SITE_CONFIG.url}${tool.href}`,
    image: `${SITE_CONFIG.url}/og/tools/${tool.id}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: PUBLISHER,
  };
}

export function generateArticleSchema(post: BlogPostMeta, options: { wordCount?: number } = {}): object {
  const url = `${SITE_CONFIG.url}${post.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ?? `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: generateAuthorSchema(post.author),
    publisher: PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    ...(options.wordCount ? { wordCount: options.wordCount } : {}),
  };
}

export function generateProductSchema(
  product: Product,
  options: { includeReviews?: boolean } = {}
): object {
  const includeReviews = options.includeReviews !== false && product.reviews.length > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Organization", name: SITE_CONFIG.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
    },
    ...(includeReviews
      ? {
          review: product.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            datePublished: r.date,
            reviewBody: r.body,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl,
    },
  };
}

/**
 * Third-party app listings (the /apps directory). Deliberately omits
 * aggregateRating/reviewRating — we don't collect star ratings, so we never
 * emit fake rating schema. Offers are only included once pricing has been
 * verified (never while a field still holds the "VERIFY" placeholder).
 */
export function generateAppSoftwareSchema(app: AppListing): object {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.tagline,
    applicationCategory: "BusinessApplication",
    operatingSystem: app.platforms.join(", "),
    url: `${SITE_CONFIG.url}/apps/${app.id}`,
    ...(app.logoUrl.startsWith("http") ? { image: app.logoUrl } : {}),
    ...(typeof app.startingPrice === "number" && app.currency !== "VERIFY"
      ? {
          offers: {
            "@type": "Offer",
            price: app.startingPrice.toFixed(2),
            priceCurrency: app.currency,
            url: app.website,
          },
        }
      : {}),
    publisher: PUBLISHER,
  };
}

/** Our editorial verdict, attributed to UtilityApps — not a crowd-sourced
 *  star rating. No reviewRating field; see generateAppSoftwareSchema. */
export function generateAppReviewSchema(app: AppListing): object {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "SoftwareApplication", name: app.name, url: app.website },
    reviewBody: app.verdict,
    author: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    publisher: PUBLISHER,
    ...(app.lastReviewed ? { datePublished: app.lastReviewed } : {}),
    url: `${SITE_CONFIG.url}/apps/${app.id}`,
  };
}

export function generateCollectionPageSchema(options: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}): object {
  const url = options.url.startsWith("http") ? options.url : `${SITE_CONFIG.url}${options.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    ...(options.itemCount !== undefined ? { mainEntity: { "@type": "ItemList", numberOfItems: options.itemCount } } : {}),
  };
}

export function generateItemListSchema(name: string, items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Serialize a JSON-LD object into the safe string form for embedding inside
 * a <script type="application/ld+json"> tag. Replaces `<` to defuse the
 * `</script>` injection vector.
 */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
