/**
 * Fires a GA4 custom event via the global `gtag()` installed by
 * components/analytics/GoogleAnalytics.tsx. Safe no-op when gtag hasn't
 * loaded yet (ad blockers, still loading, SSR) — never throws, never
 * blocks the caller.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    // analytics must never break the UI
  }
}
