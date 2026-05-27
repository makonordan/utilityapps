/**
 * Next.js instrumentation entry point — runs once per server runtime
 * (Node.js + Edge), before any request is served.
 *
 * Used here to initialise Sentry on the server side. The browser side
 * lives in `instrumentation-client.ts` (Next.js 15.3+ convention).
 *
 * Sentry is disabled gracefully when `SENTRY_DSN` /
 * `NEXT_PUBLIC_SENTRY_DSN` is absent — no errors, no crashes — so the
 * app runs fine locally without ever signing up to Sentry.
 */

export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      // Keep cost low until we know the volume. Bump if needed.
      tracesSampleRate: 0,
      // Skip transactions entirely; we're using Sentry for errors only.
      profilesSampleRate: 0,
      // Releases via Vercel commit SHA — keeps Sentry events grouped per deploy.
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      // Don't capture local-dev errors in prod Sentry.
      enabled: process.env.NODE_ENV === "production",
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0,
      profilesSampleRate: 0,
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      enabled: process.env.NODE_ENV === "production",
    });
  }
}

/**
 * App-Router error hook. Wired here once and applied to every server
 * action / route handler / RSC error path automatically. The Sentry SDK
 * exports a function that matches Next.js's onRequestError signature
 * exactly — we just wrap it with a config guard so the hook is a no-op
 * outside production / without a DSN.
 *
 * Without this hook, errors thrown inside RSC / Route Handlers would
 * surface as 500s in production logs but never reach Sentry.
 */
export async function onRequestError(
  ...args: Parameters<
    typeof import("@sentry/nextjs").captureRequestError
  >
) {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || process.env.NODE_ENV !== "production") return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
}
