import { NextRequest, NextResponse } from "next/server";

import { getBcUser } from "@/lib/businessCard/auth";
import type { BcCardRow } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/** GET / PATCH / DELETE a single card. All routes verify the card belongs
 *  to the authenticated user before doing anything. */

type Params = { params: Promise<{ cardId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "db-unavailable" }, { status: 503 });

  const { data, error } = await admin
    .from("bc_cards")
    .select("*")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, card: data as BcCardRow });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "db-unavailable" }, { status: 503 });

  let body: Partial<BcCardRow>;
  try {
    body = (await request.json()) as Partial<BcCardRow>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Whitelist writable fields (never let the client change ownership,
  // counters, or timestamps).
  const patch: Record<string, unknown> = {};
  const writable: (keyof BcCardRow)[] = [
    "slug",
    "card_type",
    "is_active",
    "is_master_visible",
    "display_order",
    "full_name",
    "job_title",
    "company_name",
    "department",
    "pronouns",
    "tagline",
    "bio",
    "email",
    "phone_primary",
    "phone_secondary",
    "website",
    "address_street",
    "address_city",
    "address_state",
    "address_country",
    "address_postal",
    "social_links",
    "avatar_url",
    "brand_color_primary",
    "brand_color_secondary",
    "card_theme",
    "logo_url",
    "vcf_include_photo",
    "vcf_include_address",
    "vcf_notes",
  ];
  for (const key of writable) {
    if (key in body) patch[key as string] = body[key];
  }

  // Verify ownership via a scoped update — RLS + explicit user_id filter.
  const { data, error } = await admin
    .from("bc_cards")
    .update(patch)
    .eq("id", cardId)
    .eq("user_id", user.id)
    .select("*")
    .maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, card: data as BcCardRow });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { cardId } = await params;
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "db-unavailable" }, { status: 503 });

  const { error, count } = await admin
    .from("bc_cards")
    .delete({ count: "exact" })
    .eq("id", cardId)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!count) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
