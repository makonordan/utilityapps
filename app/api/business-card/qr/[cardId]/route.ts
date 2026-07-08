import { NextRequest } from "next/server";

import { generateCardQrPng } from "@/lib/businessCard/qr";
import type { BcCardRow, BcUserRow } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Serve the QR code PNG for a specific card. Public — the card owner
 * needs a stable URL they can print, and third parties viewing the
 * public card page use the same PNG to save/download.
 *
 * Add `?hires=1` for the 1200×1200 print version.
 * Add `?download=1` to add a friendly Content-Disposition attachment header.
 */

type Params = { params: Promise<{ cardId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  const url = new URL(request.url);
  const hires = url.searchParams.get("hires") === "1";
  const download = url.searchParams.get("download") === "1";

  const admin = getSupabaseAdmin();
  if (!admin) return new Response("Service unavailable", { status: 503 });

  // Fetch enough to build the URL — username lives on bc_users.
  const { data: card } = await admin
    .from("bc_cards")
    .select("slug, is_active, full_name, user_id")
    .eq("id", cardId)
    .maybeSingle();
  if (!card || !card.is_active) return new Response("Not found", { status: 404 });
  const cardRow = card as Pick<BcCardRow, "slug" | "is_active" | "full_name" | "user_id">;

  const { data: user } = await admin
    .from("bc_users")
    .select("username")
    .eq("id", cardRow.user_id)
    .maybeSingle();
  if (!user) return new Response("Not found", { status: 404 });
  const username = (user as Pick<BcUserRow, "username">).username;

  const png = await generateCardQrPng(username, cardRow.slug, { hires });

  const headers: Record<string, string> = {
    "Content-Type": "image/png",
    // The URL is deterministic per card+username; QR contents only change
    // if the slug changes. 1h public cache is safe; owners can bust by
    // re-fetching after edit.
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  };
  if (download) {
    const filename = `${cardRow.full_name.replace(/[^\w\-]+/g, "-")}-qr${hires ? "-hires" : ""}.png`;
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }
  return new Response(new Uint8Array(png), { headers });
}
