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
    ],
  },
  async headers() {
    return [
      // Default headers on every response.
      {
        source: "/:path*",
        headers: securityHeaders,
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
