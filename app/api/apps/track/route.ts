import { NextRequest } from "next/server";
import { z } from "zod";

import { checkRateLimit, getClientIp, hashIp } from "@/lib/pollRateLimit";

export const runtime = "nodejs";

// affiliate_click is deliberately excluded — it has its own endpoint
// (app/api/apps/affiliate-click/route.ts) that also returns the redirect URL.
const ALLOWED_EVENT_TYPES = [
  "listing_view",
  "compare_view",
  "helpful_yes",
  "helpful_no",
  "filter_used",
] as const;

const TrackSchema = z.object({
  // Doubles as a real app id, a comparison slug ("freshbooks-vs-xero"), or
  // the literal sentinel "directory" for events not tied to one listing
  // (filter_used) — see lib/db/schema.sql section 19.
  appId: z.string().trim().min(1).max(128).regex(/^[a-z0-9-]+$/i, "Invalid appId"),
  eventType: z.enum(ALLOWED_EVENT_TYPES),
  metadata: z.record(z.string(), z.unknown()).optional(),
  device: z.enum(["mobile", "desktop", "tablet", "unknown"]).optional(),
  country: z.string().trim().max(8).optional().nullable(),
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = TrackSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json({ success: false, error: issue?.message ?? "Invalid body" }, { status: 400 });
  }

  // Rate limit by IP, transiently — the IP is hashed with a process-local
  // salt purely to key the in-memory bucket and is never stored anywhere
  // (see lib/pollRateLimit.ts). Generous limit: this is fire-and-forget
  // analytics, not a security boundary.
  const ip = getClientIp(request.headers);
  const ipHash = await hashIp(ip);
  const rl = checkRateLimit(`apps-track:${ipHash}`, 60, 60_000);
  if (!rl.ok) {
    return Response.json(
      { success: false, error: "Rate limited" },
      {
        status: 429,
        headers: rl.retryAfterSec ? { "Retry-After": String(rl.retryAfterSec) } : undefined,
      }
    );
  }

  const { appId, eventType, metadata, device } = parsed.data;

  // Country resolution priority: client-supplied -> x-vercel-ip-country ->
  // cf-ipcountry -> null. Resolved server-side so we never depend on the
  // client knowing its own country, and never touch the request IP itself.
  let country: string | null = null;
  if (typeof parsed.data.country === "string" && parsed.data.country.length <= 8) {
    country = parsed.data.country;
  } else {
    const geoHeader =
      request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
    if (geoHeader && geoHeader.length <= 8 && geoHeader.toUpperCase() !== "XX") {
      country = geoHeader.toUpperCase();
    }
  }

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) {
      return Response.json({ success: true, persisted: false });
    }
    const res = await queries.logAppEvent({
      appId,
      eventType,
      metadata: metadata ?? {},
      deviceType: device ?? null,
      country,
    });
    if (res.error) {
      return Response.json({ success: false, error: res.error }, { status: 500 });
    }
    return Response.json({ success: true, persisted: true });
  } catch (err) {
    console.error("[apps/track]", err);
    return Response.json({ success: false, error: "Failed to track" }, { status: 500 });
  }
}
