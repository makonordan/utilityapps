import "server-only";

import { ALL_APPS } from "./apps";
import { getVerifiedComparisonSlugs } from "./apps/comparisons";
import { CATEGORIES } from "./categories";
import { getPostMetas } from "./blog";
import { TOOL_VS_COMPETITOR, getCompetitorsWithTools } from "./competitorComparisons";
import { TOOLS } from "./tools";
import { SITE_CONFIG } from "./utils";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const STATIC_PAGES: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/apps", priority: 0.9, changeFrequency: "weekly" },
  { path: "/youtube", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
  { path: "/affiliate-disclosure", priority: 0.4, changeFrequency: "monthly" },
  { path: "/press", priority: 0.5, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/studio", priority: 0.8, changeFrequency: "monthly" },
];

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date();
  const entries: SitemapEntry[] = [];

  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${SITE_CONFIG.url}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  for (const category of CATEGORIES) {
    entries.push({
      url: `${SITE_CONFIG.url}/tools/categories/${category.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const tool of TOOLS) {
    entries.push({
      url: `${SITE_CONFIG.url}${tool.href}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Programmatic comparison pages — same dedup logic as the route's
  // generateStaticParams so the sitemap matches what's actually built.
  const seenComparisons = new Set<string>();
  for (const tool of TOOLS) {
    for (const relatedId of tool.relatedTools) {
      if (!TOOLS.some((t) => t.id === relatedId)) continue;
      const ordered = [tool.id, relatedId].sort();
      const key = ordered.join("|");
      if (seenComparisons.has(key)) continue;
      seenComparisons.add(key);
      entries.push({
        url: `${SITE_CONFIG.url}/tools/compare/${ordered[0]}-vs-${ordered[1]}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Competitor /vs/ comparison pages — high-intent commercial queries
  // (e.g. "iLovePDF alternative", "merge pdf vs Smallpdf").
  for (const entry of TOOL_VS_COMPETITOR) {
    entries.push({
      url: `${SITE_CONFIG.url}/vs/${entry.toolId}-vs-${entry.competitorSlug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  // Per-competitor alternative-hub pages (e.g. /alternatives/ilovepdf).
  // Slightly higher priority than /vs/ since each hub fans out to multiple
  // tools and serves as a category-level alternative entry point.
  for (const competitor of getCompetitorsWithTools()) {
    entries.push({
      url: `${SITE_CONFIG.url}/alternatives/${competitor.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Apps directory listing pages. ALL_APPS is already filtered to verified
  // pricing only in production (see isPricingVerified() in lib/apps/index.ts)
  // — a listing still marked "VERIFY" never gets a sitemap entry.
  for (const app of ALL_APPS) {
    entries.push({
      url: `${SITE_CONFIG.url}/apps/${app.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Apps comparison pages — same verified-both-sides filter as the route's
  // own generateStaticParams, so the sitemap never links a comparison where
  // either app is still awaiting pricing verification.
  for (const comparison of getVerifiedComparisonSlugs()) {
    entries.push({
      url: `${SITE_CONFIG.url}/apps/compare/${comparison}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  try {
    const posts = await getPostMetas();
    for (const post of posts) {
      entries.push({
        url: `${SITE_CONFIG.url}${post.url}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Contentlayer may not have generated yet — skip silently.
  }

  return entries;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function entriesToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
