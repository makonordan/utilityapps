import { NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_EXPIRY_HOURS,
  URL_SHARES_PER_HOUR,
  getClientIp,
  isAllowedExpiry,
} from "../_utils";

export const runtime = "nodejs";

const MAX_URL_LENGTH = 2048;

/**
 * Bare-minimum domain blocklist for the URL shortener. Real protection
 * comes from the in-flow "Report this content" button + auto-delete on
 * first report. This list catches the laziest abuse only.
 */
const BLOCKED_HOSTS = new Set([
  // SSRF-adjacent — never shorten URLs that point at the local machine
  // or unroutable addresses.
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  // (utilityapps.site removed — was overly defensive. Reported shares
  //  are already auto-hidden so the "obscure abuse via shortener" vector
  //  is moot, and the block was preventing legitimate use like sharing
  //  a tool or blog URL through the shortener.)
  // Add reported domains here as they come in.
]);

function validateUrl(input: string): { ok: true; url: string } | { ok: false; error: string } {
  if (input.length > MAX_URL_LENGTH) {
    return { ok: false, error: "URL is too long." };
  }
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http:// and https:// links are allowed." };
  }
  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) {
    return { ok: false, error: "That domain isn't allowed." };
  }
  // Light heuristic: block private/loopback IPs by pattern
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) {
    return { ok: false, error: "Private network addresses aren't allowed." };
  }
  return { ok: true, url: parsed.toString() };
}

interface Body {
  url?: unknown;
  expiresIn?: unknown;
  password?: unknown;
  customSlug?: unknown;
  viewLimit?: unknown;
}

export async function POST(request: NextRequest) {
  const shares = await import("@/lib/db/shares");
  const { validateCustomSlug } = await import("@/lib/slug");

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  if (!rawUrl) {
    return NextResponse.json({ error: "Enter a URL to shorten." }, { status: 400 });
  }
  const validated = validateUrl(rawUrl);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const expiresInRaw = Number(body.expiresIn ?? 168);
  const expiresIn = isAllowedExpiry(expiresInRaw) ? expiresInRaw : 168;

  const password =
    typeof body.password === "string" && body.password.length > 0
      ? body.password
      : null;

  let customSlug: string | null = null;
  if (typeof body.customSlug === "string" && body.customSlug.trim()) {
    const v = validateCustomSlug(body.customSlug);
    if (!v.valid) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }
    customSlug = v.normalised ?? null;
  }

  let viewLimit: number | null = null;
  if (body.viewLimit != null && body.viewLimit !== "") {
    const n = Math.floor(Number(body.viewLimit));
    if (!Number.isFinite(n) || n < 1 || n > 1000) {
      return NextResponse.json(
        { error: "View limit must be a whole number between 1 and 1000." },
        { status: 400 }
      );
    }
    viewLimit = n;
  }

  const ip = getClientIp(request);
  const ipHash = shares.hashCreatorIp(ip);

  if (await shares.isRateLimited(ipHash, URL_SHARES_PER_HOUR)) {
    return NextResponse.json(
      {
        error: `Rate limit reached (${URL_SHARES_PER_HOUR} shares per hour). Try again in an hour.`,
      },
      { status: 429 }
    );
  }

  const result = await shares.createShare({
    type: "url",
    customSlug,
    password,
    viewLimit,
    expiresInHours: expiresIn,
    creatorIpHash: ipHash,
    originalUrl: validated.url,
  });

  if (!result.ok || !result.share) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    slug: result.share.slug,
    expiresAt: result.share.expires_at,
    allowedExpiryHours: ALLOWED_EXPIRY_HOURS,
  });
}
