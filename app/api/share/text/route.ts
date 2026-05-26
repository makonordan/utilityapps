import { NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_EXPIRY_HOURS,
  TEXT_SHARES_PER_HOUR,
  getClientIp,
  isAllowedExpiry,
} from "../_utils";

export const runtime = "nodejs";

const MAX_TEXT_BYTES = 100 * 1024; // 100 KB

interface Body {
  content?: unknown;
  language?: unknown; // optional prismjs language id
  expiresIn?: unknown; // hours: 1 | 24 | 168 | 720
  password?: unknown;
  customSlug?: unknown;
  viewLimit?: unknown; // integer 1..1000
}

export async function POST(request: NextRequest) {
  // Lazy-imports keep cold start fast and (more importantly) keep the
  // server-only db layer out of any client bundle that ever transitively
  // imports a sibling under app/.
  const shares = await import("@/lib/db/shares");
  const { validateCustomSlug } = await import("@/lib/slug");

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (!content.trim()) {
    return NextResponse.json({ error: "Paste some text first." }, { status: 400 });
  }
  if (Buffer.byteLength(content, "utf8") > MAX_TEXT_BYTES) {
    return NextResponse.json(
      { error: "Text is too large. Max 100 KB." },
      { status: 413 }
    );
  }

  const expiresInRaw = Number(body.expiresIn ?? 168);
  const expiresIn = isAllowedExpiry(expiresInRaw) ? expiresInRaw : 168;

  const password =
    typeof body.password === "string" && body.password.length > 0
      ? body.password
      : null;

  // Optional custom slug — validate the *shape* here; uniqueness is checked
  // inside createShare against the live DB.
  let customSlug: string | null = null;
  if (typeof body.customSlug === "string" && body.customSlug.trim()) {
    const v = validateCustomSlug(body.customSlug);
    if (!v.valid) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }
    customSlug = v.normalised ?? null;
  }

  // Optional view limit
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

  if (await shares.isRateLimited(ipHash, TEXT_SHARES_PER_HOUR)) {
    return NextResponse.json(
      {
        error: `Rate limit reached (${TEXT_SHARES_PER_HOUR} shares per hour). Try again in an hour.`,
      },
      { status: 429 }
    );
  }

  const result = await shares.createShare({
    type: "text",
    customSlug,
    password,
    viewLimit,
    expiresInHours: expiresIn,
    creatorIpHash: ipHash,
    textContent: content,
    textLanguage:
      typeof body.language === "string" && body.language ? body.language : null,
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
