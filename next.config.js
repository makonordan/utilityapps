// @ts-check

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Indexing is the default; this just makes the signal explicit for crawlers
  // that read response headers (some AI crawlers do).
  { key: "X-Robots-Tag", value: "index, follow" },
];

const longCacheImmutable = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const oneHourPublicCache = [
  { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: "https", hostname: "utilityapps.site" },
      { protocol: "https", hostname: "**.utilityapps.site" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "www.google.com" },
    ],
  },
  async headers() {
    // /embed/* must be iframable from third-party sites — that's the
    // whole point. We swap X-Frame-Options for a permissive CSP
    // frame-ancestors and re-apply the rest of the security headers.
    const embedHeaders = securityHeaders
      .filter((h) => h.key !== "X-Frame-Options")
      .concat([
        { key: "Content-Security-Policy", value: "frame-ancestors *" },
      ]);
    return [
      // Default headers on every response.
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Override for embeddable tool routes only.
      {
        source: "/embed/:path*",
        headers: embedHeaders,
      },
      // Legacy static tool bundles under /public/embeds/ (loan/mortgage/bmi/
      // percentage/age calculators). These are iframed into their in-house
      // tool pages for the widget itself, but each bundle is a full
      // standalone site export (its own about/contact/privacy/blog pages,
      // sitemap.xml, and a canonical pointing at the old external domain).
      // Crawlable and indexable by default, which wastes crawl budget on
      // ~90 off-brand URLs. noindex here (not a robots.txt disallow) so
      // Google can still crawl and read this header, then drop them.
      {
        source: "/embeds/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Hashed build assets — already content-hashed, so cache forever.
      {
        source: "/_next/static/:path*",
        headers: longCacheImmutable,
      },
      // Static assets the user drops into /public.
      {
        source: "/assets/:path*",
        headers: oneHourPublicCache,
      },
      // The native sitemap + robots routes — short TTL, can revalidate.
      {
        source: "/(sitemap.xml|robots.txt|llms.txt)",
        headers: oneHourPublicCache,
      },
    ];
  },
  async redirects() {
    return [
      // /donate was renamed to /support when the founding-supporter program
      // launched. Permanent so any blog post / external link auto-forwards
      // with SEO equity intact.
      {
        source: "/donate",
        destination: "/support",
        permanent: true,
      },
      // The footer/Header/megamenu link to /categories/<id>; the canonical
      // SEO path is /tools/categories/<id>. Redirect old links permanently.
      {
        source: "/categories/:id",
        destination: "/tools/categories/:id",
        permanent: true,
      },
      // Legacy iframe-style image tools were superseded by the in-house
      // Next.js components at /tools/compress-image and /tools/convert-from-jpg.
      // Permanent redirects preserve SEO and any external bookmarks.
      {
        source: "/tools/image-compressor",
        destination: "/tools/compress-image",
        permanent: true,
      },
      {
        source: "/tools/image-converter",
        destination: "/tools/convert-from-jpg",
        permanent: true,
      },
      // Word Counter, Character Counter, Case Converter, and Text Diff
      // Checker were merged into one richer toolkit at /tools/word-counter.
      {
        source: "/tools/character-counter",
        destination: "/tools/word-counter",
        permanent: true,
      },
      {
        source: "/tools/case-converter",
        destination: "/tools/word-counter",
        permanent: true,
      },
      {
        source: "/tools/text-diff-checker",
        destination: "/tools/word-counter?tab=compare",
        permanent: true,
      },
      // PDF Converter (Productivity Tools) duplicated the Image-to-PDF half
      // of the JPG/PDF tool and has been removed in favour of it.
      {
        source: "/tools/pdf-converter",
        destination: "/tools/jpg-pdf",
        permanent: true,
      },
      // Nap Calculator, Caffeine Cutoff Calculator, Brown Noise Generator,
      // and Ambient Sound Mixer were merged into the Sleep Cycle Calculator
      // toolkit, which also moved from Sleep Tools into Health Tools.
      {
        source: "/tools/nap-calculator",
        destination: "/tools/sleep-cycle-calculator?tab=nap",
        permanent: true,
      },
      {
        source: "/tools/caffeine-cutoff-calculator",
        destination: "/tools/sleep-cycle-calculator?tab=caffeine",
        permanent: true,
      },
      {
        source: "/tools/brown-noise-generator",
        destination: "/tools/sleep-cycle-calculator?tab=sounds",
        permanent: true,
      },
      {
        source: "/tools/ambient-sound-mixer",
        destination: "/tools/sleep-cycle-calculator?tab=sounds",
        permanent: true,
      },
      {
        source: "/tools/categories/sleep-tools",
        destination: "/tools/categories/health-tools",
        permanent: true,
      },
      // The Products nav entry was replaced by the curated Apps directory.
      // Existing checkout/order infrastructure for owned products stays live
      // (see lib/products.ts) but the browsing routes now forward to /apps
      // so SEO authority transfers instead of 404ing.
      {
        source: "/products",
        destination: "/apps",
        permanent: true,
      },
      {
        source: "/products/:id",
        destination: "/apps",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Static tool embeds live in /public/embeds/<tool>/. Next.js doesn't
      // auto-resolve directory paths to index.html, so the iframe sees a
      // 404. These rewrites map both `/embeds/<tool>` and `/embeds/<tool>/`
      // to the index file so any new tool dropped into /public/embeds/
      // "just works" with no per-tool URL config.
      {
        source: "/embeds/:tool",
        destination: "/embeds/:tool/index.html",
      },
      {
        source: "/embeds/:tool/",
        destination: "/embeds/:tool/index.html",
      },
    ];
  },
};

let configured = nextConfig;

try {
  // Contentlayer wrapper — peer dep `next-contentlayer2` must be installed.
  // contentlayer2 is the maintained community fork of the original (now
  // unmaintained) contentlayer/next-contentlayer packages.
  const { withContentlayer } = require("next-contentlayer2");
  configured = withContentlayer(configured);
} catch {
  // next-contentlayer2 not installed yet; skip silently so dev/build still works.
}

if (process.env.ANALYZE === "true") {
  try {
    const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: true });
    configured = withBundleAnalyzer(configured);
  } catch {
    // @next/bundle-analyzer not installed; ANALYZE mode is a no-op.
  }
}

module.exports = configured;
