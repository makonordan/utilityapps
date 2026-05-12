import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * URL → screenshot proxy → Screenshotone API
 *
 * Setup
 * -----
 * 1. Sign up at https://screenshotone.com (100 free screenshots/month).
 * 2. Grab your access key from the dashboard.
 * 3. Add it to .env.local (NEVER commit this file):
 *
 *      SCREENSHOTONE_API_KEY=your_key_here
 *
 * Why this route exists
 * ---------------------
 * The access key must NEVER ship to the browser. This server route validates
 * the incoming URL, hands it off to Screenshotone with the API key, and
 * streams the resulting image back. The client only ever sees this
 * same-origin endpoint, so the key stays server-side.
 */

const ALLOWED_FORMATS = new Set(["jpg", "jpeg", "png", "webp"]);

interface Body {
  url?: string;
  width?: number;
  height?: number | "auto";
  format?: string;
  scale?: number;
  fullPage?: boolean;
}

function isValidPublicUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      // Reject IPv4 private ranges in the easy cases — Screenshotone wouldn't
      // be able to reach them anyway, but rejecting up-front gives a nicer
      // error and avoids tickling SSRF defences.
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.SCREENSHOTONE_API_KEY) {
    return NextResponse.json(
      {
        error:
          "URL-to-image isn't configured on this server. Add SCREENSHOTONE_API_KEY to .env.local — see app/api/tools/html-to-image/route.ts for instructions.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { url, width = 1280, format = "jpg", scale = 1, fullPage = false } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }
  if (!isValidPublicUrl(url)) {
    return NextResponse.json(
      { error: "URL must be a public http(s) address." },
      { status: 400 }
    );
  }
  const fmt = format.toLowerCase();
  if (!ALLOWED_FORMATS.has(fmt)) {
    return NextResponse.json(
      { error: "Unsupported format. Use jpg, png or webp." },
      { status: 400 }
    );
  }
  const viewportWidth = Math.min(2560, Math.max(360, Math.floor(width)));
  const dpr = Math.min(3, Math.max(1, Math.floor(scale)));

  const params = new URLSearchParams({
    url,
    access_key: process.env.SCREENSHOTONE_API_KEY,
    viewport_width: String(viewportWidth),
    format: fmt === "jpg" ? "jpeg" : fmt,
    device_scale_factor: String(dpr),
    full_page: fullPage ? "true" : "false",
    block_ads: "true",
    block_cookie_banners: "true",
    block_trackers: "true",
    cache: "false",
  });

  // Optional fixed viewport height when the caller asks for a viewport-only
  // screenshot rather than the whole page.
  if (!fullPage && typeof body.height === "number" && body.height > 0) {
    params.set("viewport_height", String(Math.min(4096, Math.floor(body.height))));
  }

  const endpoint = `https://api.screenshotone.com/take?${params.toString()}`;

  try {
    const upstream = await fetch(endpoint);
    if (upstream.ok) {
      const bytes = await upstream.arrayBuffer();
      const contentType = upstream.headers.get("content-type") ?? `image/${fmt}`;
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(bytes.byteLength),
          "Cache-Control": "no-store",
        },
      });
    }

    // Surface Screenshotone's error JSON when available — they return
    // structured messages for quota-exceeded, blocked-domain, etc.
    let detail = "";
    const ct = upstream.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      try {
        const body = (await upstream.json()) as { error_message?: string; message?: string };
        detail = body.error_message ?? body.message ?? "";
      } catch {
        /* ignore */
      }
    }

    if (upstream.status === 402 || /quota/i.test(detail)) {
      return NextResponse.json(
        {
          error:
            "The shared Screenshotone allowance is exhausted for this month. The site owner needs to upgrade or wait for the monthly reset.",
        },
        { status: 402 }
      );
    }
    if (upstream.status === 422 || /timeout|navigation|invalid/i.test(detail)) {
      return NextResponse.json(
        {
          error:
            detail ||
            "The page couldn't be captured. Some sites block screenshots via CORS / X-Frame-Options / bot detection — try a different URL.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        error:
          detail || `Screenshot failed (status ${upstream.status}). Please try again.`,
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("[api/html-to-image]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Screenshot service unreachable. Please try again." },
      { status: 502 }
    );
  }
}
