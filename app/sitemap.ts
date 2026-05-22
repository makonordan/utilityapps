import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/sitemap-entries";

// Regenerate hourly so scheduled posts enter the sitemap on their publish date.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
