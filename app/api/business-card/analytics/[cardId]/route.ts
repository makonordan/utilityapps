import { NextRequest, NextResponse } from "next/server";

import type { BcScanType } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Client-side analytics ping. Public — no auth. Only writes to bc_scans,
 * never reads. Rate limited by client-side deduping (page renders once
 * per view), so a soft server-side abuse cap isn't included for v1.
 *
 * Accepted scan_type values are constrained to the enum in schema.sql.
 * Anything else → 400.
 */

const ALLOWED: BcScanType[] = [
  "qr_scan",
  "link_visit",
  "master_selector",
  "vcf_download",
  "social_click",
  "phone_tap",
  "email_tap",
  "website_tap",
];

type Params = { params: Promise<{ cardId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  let body: { scan_type?: string; referrer?: string };
  try {
    body = (await request.json()) as { scan_type?: string; referrer?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const scanType = body.scan_type as BcScanType | undefined;
  if (!scanType || !ALLOWED.includes(scanType)) {
    return NextResponse.json({ ok: false, error: "invalid scan_type" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "db-unavailable" }, { status: 503 });

  // Country from Vercel edge header (never IP).
  const country = request.headers.get("x-vercel-ip-country") ?? null;
  const ua = request.headers.get("user-agent") ?? "";
  const deviceType = /mobile|iphone|android/i.test(ua)
    ? "mobile"
    : /ipad|tablet/i.test(ua)
      ? "tablet"
      : "desktop";
  const referrer = body.referrer?.slice(0, 200) ?? null;

  const { error } = await admin.from("bc_scans").insert({
    card_id: cardId,
    scan_type: scanType,
    device_type: deviceType,
    country,
    referrer,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Best-effort counter bump (never blocks response).
  if (scanType !== "vcf_download") {
    // vcf_download is bumped by the /vcf endpoint directly.
    void (async () => {
      const { data } = await admin.from("bc_cards").select("view_count").eq("id", cardId).maybeSingle();
      const next = (data?.view_count ?? 0) + 1;
      await admin.from("bc_cards").update({ view_count: next }).eq("id", cardId);
    })();
  }

  return NextResponse.json({ ok: true });
}
