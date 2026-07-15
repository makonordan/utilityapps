import { NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const ClickSchema = z.object({
  appId: z.string().trim().min(1).max(128).regex(/^[a-z0-9-]+$/i, "Invalid appId"),
  url: z.string().trim().url().max(2048),
  source: z.string().trim().max(64).optional().nullable(),
  device: z.enum(["mobile", "desktop", "tablet", "unknown"]).optional(),
  country: z.string().trim().max(8).optional().nullable(),
});

/**
 * Affiliate-click logger for the Apps directory.
 *
 * Mirrors app/api/affiliate/click/route.ts: the client fires this
 * fire-and-forget alongside a plain <a target="_blank"> click — actual
 * navigation happens via the anchor, not this response, so a logging
 * failure can never block the user from reaching the destination. The
 * route still returns `redirectUrl` for parity / future server-redirect use.
 */
export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ClickSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json({ success: false, error: issue?.message ?? "Invalid body" }, { status: 400 });
  }

  const { appId, url, source, device } = parsed.data;

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

  let persisted = false;
  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (queries) {
      const res = await queries.logAppEvent({
        appId,
        eventType: "affiliate_click",
        metadata: { url, source: source ?? null },
        deviceType: device ?? null,
        country,
      });
      if (!res.error) persisted = true;
    }
  } catch (err) {
    console.error("[apps/affiliate-click]", err);
  }

  return Response.json({ success: true, redirectUrl: url, persisted });
}
