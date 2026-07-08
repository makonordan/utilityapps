import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_EMAIL = 254;
const MAX_USE_CASE = 500;
const MAX_SOURCE = 64;

interface Body {
  email?: unknown;
  useCase?: unknown;
  source?: unknown;
  /** Which waitlist: "api" (default) or "extension". */
  list?: unknown;
  /** Honeypot field — bots fill it; humans don't see it (display: none). */
  website?: unknown;
}

/**
 * POST /api/waitlist
 *
 * Demand-validation signup. Handles two waitlists via the `list` field:
 *   - "api"       (default) → api_waitlist, captures optional use-case
 *   - "extension"           → extension_waitlist, email only
 *
 * Anyone can post (no signup, no auth), but we apply:
 *   - basic email validation (server-side)
 *   - honeypot field to block dumb bots
 *   - service-role insert that bypasses RLS, so the tables can stay
 *     write-only from the anon side (emails are PII)
 *
 * Best-effort error reporting — failures go to Sentry via reportError.
 */
export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot trip — silently return success so the bot doesn't know.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true, alreadyOnWaitlist: false });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const useCase =
    typeof body.useCase === "string"
      ? body.useCase.trim().slice(0, MAX_USE_CASE)
      : null;
  const source =
    typeof body.source === "string"
      ? body.source.trim().slice(0, MAX_SOURCE)
      : null;

  const list = body.list === "extension" ? "extension" : "api";

  try {
    const [queries, admin] = await Promise.all([
      import("@/lib/db/queries").catch(() => null),
      import("@/lib/supabaseAdmin").catch(() => null),
    ]);
    if (!queries) {
      return NextResponse.json({ ok: true, persisted: false });
    }
    const adminClient = admin?.getSupabaseAdmin?.() ?? undefined;
    const result =
      list === "extension"
        ? await queries.addToExtensionWaitlist(
            email,
            source ?? "extension-banner",
            adminClient
          )
        : await queries.addToApiWaitlist(
            email,
            useCase,
            source ?? "api-page",
            adminClient
          );
    if (result.error) {
      const { reportError } = await import("@/lib/error-reporting");
      reportError(result.error, { tag: `api/waitlist/${list}`, extra: { email } });
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { reportError } = await import("@/lib/error-reporting");
    reportError(err, { tag: "api/waitlist" });
    return NextResponse.json(
      { error: "Couldn't add you to the waitlist. Try again." },
      { status: 500 }
    );
  }
}
