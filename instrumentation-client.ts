/**
 * Browser-side Sentry init. Next.js 15.3+ loads this automatically when
 * present at the project root — no manual import needed.
 *
 * Gracefully no-ops without NEXT_PUBLIC_SENTRY_DSN so the app runs
 * locally and in preview deploys without a Sentry account.
 */

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn,
    // No performance / replay tracing for now — we're using Sentry strictly
    // for errors so the free tier (5K events/mo) covers us for a while.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "production",
    // Filter noise: don't report errors thrown by third-party scripts /
    // browser extensions / ad blockers. They show up in Sentry as
    // "Script error.\nat <anonymous>" and bloat the queue without being
    // actionable.
    beforeSend(event, hint) {
      const err = hint?.originalException;
      const msg = (err instanceof Error ? err.message : String(err)) || "";
      if (/script error|extension|chrome-extension|safari-extension/i.test(msg)) {
        return null;
      }
      return event;
    },
  });
}

/**
 * Next.js requires this export for client-side navigation error capture.
 * See https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
