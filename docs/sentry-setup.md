# Sentry — error tracking setup

Sentry catches every uncaught error in the site (server routes, RSC
renders, client navigation) AND every "soft" caught error we explicitly
report via `reportError()`. The code is already in place; you just need
to wire up the env vars.

Without `NEXT_PUBLIC_SENTRY_DSN` set, Sentry is **completely off** —
no SDK init, no network calls. The site behaves exactly as before. So
this is safe to deploy first and configure later.

## One-time setup (5 minutes)

### 1. Sign up

[sentry.io/signup](https://sentry.io/signup) — free tier covers 5K
errors per month, more than enough for our traffic.

### 2. Create a Next.js project

After signup:

- **Create a new project**
- Platform: **Next.js**
- Project name: `utilityapps`
- Skip the in-app installation wizard — the code is already installed.

You'll land on a DSN page. Copy the value that looks like:

```
https://<32-char-hex>@<id>.ingest.us.sentry.io/<projectid>
```

### 3. Add the DSN to Vercel

In Vercel → your project → Settings → Environment Variables, add:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SENTRY_DSN` | the DSN you copied | Production, Preview |

> The DSN is safe to expose publicly — it's just a write-only ingestion
> endpoint. Sentry expects browser code to ship it.

You can ALSO set `SENTRY_DSN` to the same value if you want server-side
init even in dev. Not required; the code reads `NEXT_PUBLIC_SENTRY_DSN`
as a fallback for server init too.

### 4. Redeploy

Trigger a redeploy so the env var is baked into the build. Errors start
flowing to Sentry within a minute of the deploy going live.

### 5. (Optional) Source maps

Stack traces show minified code by default. To get the original file +
line:

- Generate a Sentry **auth token** (Settings → Auth Tokens → "Create
  New" → scope: `project:releases`)
- Add to Vercel as `SENTRY_AUTH_TOKEN` and `SENTRY_ORG` + `SENTRY_PROJECT`
- Wrap `next.config.js` exports with `withSentryConfig` (one block change)

Skip this for V1 — minified stack traces are still useful with the file
URLs Sentry already shows.

## What's been instrumented

- **Server**: every route handler / RSC error via `onRequestError` in
  `instrumentation.ts`. Errors that would otherwise surface as opaque
  500s now arrive in Sentry with full request context.
- **Client**: every uncaught browser error + router transition errors via
  `instrumentation-client.ts`. Filters out browser-extension noise so
  the queue stays signal-only.
- **Soft errors** in catch blocks already using `console.error`:
  - All 13 catch blocks in `lib/db/shares.ts`
  - The ConvertAPI catch in `app/api/convert/route.ts`
  - More to come as we find them.

Adding `reportError(err, { tag: "some-namespace" })` to any new catch
block surfaces it in Sentry without changing the user-facing behaviour
(error swallowed, friendly message returned). The helper is a no-op
when Sentry isn't configured.

## What's NOT enabled

- Performance / tracing — `tracesSampleRate: 0`. We can turn it on
  later, but for an event-rate-limited free tier it's better to keep
  the quota for errors.
- Session replay — `replaysSessionSampleRate: 0`. Same reason.
- Profiling — same.

If we ever need them, edit `instrumentation.ts` and
`instrumentation-client.ts`. No new install needed.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| No errors in Sentry after a deploy | `NEXT_PUBLIC_SENTRY_DSN` not set, or set to "Preview only" while testing on Production |
| Errors appear with `[anonymous]` only | Source maps not uploaded — see step 5 above |
| Local dev hits Sentry quota | Sentry SDK is gated on `process.env.NODE_ENV === "production"` so this shouldn't happen — if it does, double-check `NODE_ENV` |
