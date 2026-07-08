import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/saved", "/unsubscribe"],
      },
      // Explicit allow blocks for the major search + AI crawlers. Same rules
      // as the wildcard, but listed separately so it's clear we welcome them
      // (and easy to tighten per-bot later without touching the wildcard).
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "DuckDuckBot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "Claude-Web", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/api/", "/admin/"] },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
