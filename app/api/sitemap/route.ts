import { entriesToXml, getSitemapEntries } from "@/lib/sitemap-entries";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const entries = await getSitemapEntries();
  const body = entriesToXml(entries);

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
