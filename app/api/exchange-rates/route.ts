import { NextResponse } from "next/server";

/**
 * Live exchange-rate proxy.
 *
 * Server-side fetch from ExchangeRate-API, cached for 24h via Next.js's
 * built-in fetch revalidation + a CDN Cache-Control header. The API key
 * lives only on the server (NO `NEXT_PUBLIC_` prefix) so the browser can't
 * read it. If the upstream API fails or no key is configured, we serve a
 * baked-in fallback rate table so the converter still works.
 *
 * Browser callers should hit /api/exchange-rates and never touch
 * exchangerate-api.com directly.
 */

export const runtime = "nodejs";
// Page-level revalidation hint — Next will reuse this route's response for
// 24h before re-running the handler. The fetch() below also has its own
// revalidate, in case this route is invoked dynamically.
export const revalidate = 86_400;

// USD-base fallback rates, updated periodically as a safety net.
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1370,
  GHS: 14.5,
  KES: 129,
  ZAR: 18.5,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 149,
  INR: 83.5,
  CNY: 7.25,
  BRL: 5.1,
  MXN: 17.2,
  CHF: 0.88,
  SEK: 10.5,
  NOK: 10.8,
  KRW: 1370,
  SGD: 1.34,
  HKD: 7.8,
  NZD: 1.65,
  EGP: 48.5,
};

interface UpstreamResponse {
  result: "success" | "error";
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_utc: string;
  time_next_update_utc: string;
  "error-type"?: string;
}

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    console.warn("[exchange-rates] EXCHANGE_RATE_API_KEY missing — serving fallback rates");
    return jsonFallback("API key not configured on server");
  }

  try {
    const upstream = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      {
        // Re-request from upstream at most once per 24h.
        next: { revalidate: 86_400 },
        // Don't hang the route forever if upstream is slow.
        signal: AbortSignal.timeout(5_000),
      }
    );

    if (!upstream.ok) {
      throw new Error(`Upstream returned HTTP ${upstream.status}`);
    }

    const data = (await upstream.json()) as UpstreamResponse;
    if (data.result !== "success" || !data.conversion_rates) {
      throw new Error(data["error-type"] ?? "Upstream returned non-success result");
    }

    return NextResponse.json(
      {
        rates: data.conversion_rates,
        base: data.base_code,
        lastUpdated: data.time_last_update_utc,
        nextUpdate: data.time_next_update_utc,
        source: "live" as const,
      },
      {
        headers: {
          // Browser + CDN cache: 24h fresh, 12h stale-while-revalidate.
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[exchange-rates] live fetch failed:", message);
    return jsonFallback(message);
  }
}

function jsonFallback(reason: string) {
  return NextResponse.json({
    rates: FALLBACK_RATES,
    base: "USD",
    lastUpdated: new Date().toISOString(),
    source: "fallback" as const,
    error: reason,
  });
}
