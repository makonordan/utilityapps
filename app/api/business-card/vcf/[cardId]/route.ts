import { NextRequest } from "next/server";

import { buildVcard, vcfFilename } from "@/lib/businessCard/vcard";
import type { BcCardRow } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Serve the vCard 3.0 .vcf file for a specific card.
 *
 * Public — no auth required — because the whole point is that a
 * stranger scans the QR code and saves the contact. The card must
 * be `is_active = true` to be served. Address is included in the
 * vCard only when the owner enabled `vcf_include_address`.
 *
 * We fire-and-forget a `vcf_download` scan event so the owner's
 * dashboard reflects real save intent.
 */

type Params = { params: Promise<{ cardId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  const admin = getSupabaseAdmin();
  if (!admin) {
    return new Response("Service unavailable", { status: 503 });
  }

  const { data: card, error } = await admin
    .from("bc_cards")
    .select("*")
    .eq("id", cardId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) return new Response(error.message, { status: 500 });
  if (!card) return new Response("Not found", { status: 404 });

  const cardRow = card as BcCardRow;
  const body = buildVcard(cardRow);

  // Track the save. Never blocks the download.
  void trackScan(admin, cardRow.id, "vcf_download", request);

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${vcfFilename(cardRow.full_name)}"`,
      // Prevent CDNs from serving a stale vCard when the card is edited.
      "Cache-Control": "private, no-store",
    },
  });
}

async function trackScan(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  cardId: string,
  scanType:
    | "qr_scan"
    | "link_visit"
    | "master_selector"
    | "vcf_download"
    | "social_click"
    | "phone_tap"
    | "email_tap"
    | "website_tap",
  request: NextRequest
) {
  const country = request.headers.get("x-vercel-ip-country") ?? null;
  const ua = request.headers.get("user-agent") ?? "";
  const deviceType = /mobile|iphone|android/i.test(ua)
    ? "mobile"
    : /ipad|tablet/i.test(ua)
      ? "tablet"
      : "desktop";
  const referrer = request.headers.get("referer") ?? null;
  const safeReferrer = referrer ? new URL(referrer).origin : null;

  try {
    const { error: insertErr } = await admin.from("bc_scans").insert({
      card_id: cardId,
      scan_type: scanType,
      device_type: deviceType,
      country,
      referrer: safeReferrer,
    });
    if (insertErr) throw insertErr;

    // Bump the summary counter on the card. save_count for vcf_download,
    // scan_count for QR/link visits — matches what the dashboard reads.
    const col: "save_count" | "scan_count" =
      scanType === "vcf_download" ? "save_count" : "scan_count";
    const { data } = await admin
      .from("bc_cards")
      .select(col)
      .eq("id", cardId)
      .maybeSingle();
    const current = (data as Record<string, number> | null)?.[col] ?? 0;
    await admin.from("bc_cards").update({ [col]: current + 1 }).eq("id", cardId);
  } catch (err) {
    console.warn("[bc/track] scan insert failed:", err instanceof Error ? err.message : err);
  }
}
