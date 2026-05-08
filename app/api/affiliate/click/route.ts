import { NextRequest } from "next/server";
import { z } from "zod";

import { PRODUCTS_BY_ID } from "@/lib/products";

export const runtime = "nodejs";

const ClickSchema = z.object({
  productId: z.string().trim().min(1).max(64),
  url: z.string().trim().url().max(2048),
  source: z.string().trim().max(64).optional().nullable(),
  session: z.string().trim().max(64).optional().nullable(),
  device: z.enum(["mobile", "desktop", "tablet", "unknown"]).optional(),
  country: z.string().trim().max(8).optional().nullable(),
});

/**
 * Affiliate-click logger.
 *
 * The client fires this fire-and-forget on a buy-button click; the actual
 * navigation happens via the <a target="_blank"> tag so users see the
 * destination URL on hover and the click works without JS. The route still
 * returns `redirectUrl` so non-browser callers (or future server-redirect
 * variants) can use it.
 */
export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = ClickSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json(
      { success: false, error: issue?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const { productId, url, source, session, device, country } = parsed.data;

  // Validate the productId against the catalog so we don't pollute the table.
  if (!PRODUCTS_BY_ID[productId]) {
    return Response.json(
      { success: false, error: "Unknown productId" },
      { status: 404 }
    );
  }

  let persisted = false;
  try {
    const sb = await import("@/lib/supabase").catch(() => null);
    if (sb) {
      const { error } = await sb.supabase.from("products_clicks").insert({
        product_id: productId,
        url,
        source: source ?? null,
        user_session: session ?? null,
        device: device ?? null,
        country: country ?? null,
      });
      if (error) {
        console.error("[affiliate/click] supabase", error.message);
      } else {
        persisted = true;
      }
    }
  } catch (err) {
    console.error("[affiliate/click]", err);
  }

  return Response.json({
    success: true,
    redirectUrl: url,
    persisted,
  });
}
