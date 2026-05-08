import Script from "next/script";

/**
 * Loads the AdSense library once globally. Mount inside <head> via the root
 * layout. Skipped entirely outside production or when no publisher ID is set,
 * which keeps the homepage Lighthouse score clean during dev.
 */
export function AdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!publisherId) return null;
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  );
}
