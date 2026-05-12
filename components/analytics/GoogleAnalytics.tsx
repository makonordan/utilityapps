"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js) integration for the App Router.
 *
 * Two pieces:
 *   1. The gtag.js script + initial `config` call. Loaded once via next/script
 *      with the `afterInteractive` strategy so it doesn't block first paint.
 *   2. A SPA route-change tracker. App Router doesn't fire a fresh page load
 *      on client-side navigations, so GA only sees the initial URL unless we
 *      manually fire `gtag('config', GA_ID, { page_path })` on every change.
 *      `useSearchParams` forces a Suspense boundary in App Router, hence the
 *      inner component split.
 *
 * Reads NEXT_PUBLIC_GA_ID from env; falls back to the production tag so the
 * site doesn't go silent if the var is missing on a deploy.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-3XBEVSR5EF";

declare global {
  interface Window {
    // gtag's signature is variadic across event types; the upstream typings
    // pull in a heavy package, so a permissive callable is the lighter call.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}

function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window.gtag !== "function") return;
    const search = searchParams?.toString();
    const page_path = search ? `${pathname}?${search}` : pathname;
    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
