/**
 * Thin wrapper over Sentry.captureException for the "soft error" case —
 * caught exceptions inside try/catch blocks that we handle gracefully
 * but still want visibility into.
 *
 * Lots of code already does:
 *
 *   } catch (err) {
 *     console.error("[some-namespace]", err);
 *     return { ok: false, error: "Friendly message" };
 *   }
 *
 * Adding `reportError(err, { tag: "some-namespace" })` to that block
 * keeps the console output AND gets the error into Sentry, without
 * forcing a rethrow that would surface as a 500 to the user.
 *
 * Gracefully no-ops when SENTRY_DSN isn't set, so non-production
 * environments (and anyone forking the codebase without a Sentry
 * account) work identically to before.
 */

interface ReportContext {
  /** Short tag for grouping — usually the namespace, e.g. "shares.createShare". */
  tag?: string;
  /** Free-form key/value context to attach to the Sentry event. */
  extra?: Record<string, unknown>;
}

/** Lazily-loaded Sentry — kept out of bundle when not configured. */
let sentryPromise:
  | Promise<typeof import("@sentry/nextjs")>
  | null
  | undefined;

function loadSentry(): Promise<typeof import("@sentry/nextjs")> | null {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || process.env.NODE_ENV !== "production") return null;
  if (sentryPromise === undefined) {
    sentryPromise = import("@sentry/nextjs");
  }
  return sentryPromise || null;
}

/** Report a caught exception. Safe to call even if Sentry isn't configured. */
export function reportError(
  error: unknown,
  context: ReportContext = {}
): void {
  // Always log to console — that's the existing behaviour and devs rely on it.
  const tag = context.tag ? `[${context.tag}]` : "";
  console.error(tag, error);

  const sentryModule = loadSentry();
  if (!sentryModule) return;

  void sentryModule
    .then((Sentry) => {
      Sentry.captureException(error, {
        tags: context.tag ? { component: context.tag } : undefined,
        extra: context.extra,
      });
    })
    .catch(() => {
      // Sentry failed to load — silently swallow. We've already logged.
    });
}

/**
 * Capture a string message (not an exception). Useful for "this
 * happened but it wasn't strictly an error" signals — e.g. rate-limit
 * hits, suspicious activity, fallback paths kicking in.
 */
export function reportMessage(
  message: string,
  context: ReportContext = {}
): void {
  const tag = context.tag ? `[${context.tag}]` : "";
  console.warn(tag, message);

  const sentryModule = loadSentry();
  if (!sentryModule) return;

  void sentryModule
    .then((Sentry) => {
      Sentry.captureMessage(message, {
        level: "warning",
        tags: context.tag ? { component: context.tag } : undefined,
        extra: context.extra,
      });
    })
    .catch(() => {
      /* same as above */
    });
}
