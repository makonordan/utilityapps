/**
 * Loads the AdSense library once globally. Rendered inside the <head> of the
 * root layout, which means the literal <script> tag ships in server-rendered
 * HTML — important because Google's AdSense site-verification crawler scans
 * the static HTML and can miss tags that get injected post-hydration via
 * `next/script` strategies.
 *
 * Reads NEXT_PUBLIC_ADSENSE_ID from env; falls back to the production
 * publisher ID so verification works on Vercel even before the env var is
 * configured. Skipped outside production to keep dev Lighthouse scores clean.
 */
const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5535248433258106";

export function AdSenseScript() {
  if (!PUBLISHER_ID) return null;
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
    />
  );
}
