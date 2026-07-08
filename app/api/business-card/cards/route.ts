import { NextRequest, NextResponse } from "next/server";

import { getBcUser } from "@/lib/businessCard/auth";
import { PLAN_LIMITS, isValidSlug, type BcCardRow, type BcCardType, type BcTheme, type BcSocialLink } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * List + create cards for the current authenticated user.
 *
 * GET  → returns all cards for the user, newest first
 * POST → create a new card
 *
 * All plan-limit enforcement lives here (server-side). The client UI
 * mirrors the limits but must never be trusted.
 */

export async function GET() {
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "db-unavailable" }, { status: 503 });

  const { data, error } = await admin
    .from("bc_cards")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, cards: (data ?? []) as BcCardRow[] });
}

export async function POST(request: NextRequest) {
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

  if (!body.full_name || body.full_name.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "full_name is required" }, { status: 400 });
  }

  // Plan check — active card count. `is_active = false` cards don't count
  // so downgrades don't break existing users.
  const limits = PLAN_LIMITS[user.plan];
  if (limits.maxCards !== null) {
    const { count } = await admin
      .from("bc_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);
    if ((count ?? 0) >= limits.maxCards) {
      return NextResponse.json(
        {
          ok: false,
          error: `Plan limit reached: ${limits.maxCards} active card${limits.maxCards === 1 ? "" : "s"}. Upgrade to add more.`,
          code: "PLAN_LIMIT_CARDS",
        },
        { status: 402 }
      );
    }
  }

  // Theme + social link count guards.
  const theme: BcTheme = (body.card_theme ?? "minimal") as BcTheme;
  if (!limits.themes.includes(theme)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Your plan doesn't include the "${theme}" theme.`,
        code: "PLAN_LIMIT_THEME",
      },
      { status: 402 }
    );
  }
  const socials = (body.social_links ?? []) as BcSocialLink[];
  if (socials.length > limits.maxSocialLinks) {
    return NextResponse.json(
      {
        ok: false,
        error: `Your plan allows up to ${limits.maxSocialLinks} social links.`,
        code: "PLAN_LIMIT_SOCIAL",
      },
      { status: 402 }
    );
  }

  // Slug: on Free, we always auto-generate; on Pro+, respect an explicit
  // one if valid, else auto-generate.
  const proposedSlug = body.slug?.toString().trim().toLowerCase();
  const autoSlug = slugifyName(body.full_name);
  const slug =
    limits.customSlug && proposedSlug && isValidSlug(proposedSlug) ? proposedSlug : autoSlug;
  const finalSlug = await uniquifySlug(admin, user.id, slug);

  const insertRow = {
    user_id: user.id,
    slug: finalSlug,
    card_type: (body.card_type ?? "personal") as BcCardType,
    is_active: body.is_active ?? true,
    is_master_visible: body.is_master_visible ?? true,
    display_order: body.display_order ?? 0,

    full_name: body.full_name.trim(),
    job_title: body.job_title?.trim() || null,
    company_name: body.company_name?.trim() || null,
    department: body.department?.trim() || null,
    pronouns: body.pronouns?.trim() || null,
    tagline: body.tagline?.trim() || null,
    bio: body.bio?.trim() || null,

    email: body.email?.trim() || null,
    phone_primary: body.phone_primary?.trim() || null,
    phone_secondary: body.phone_secondary?.trim() || null,
    website: body.website?.trim() || null,
    address_street: body.address_street?.trim() || null,
    address_city: body.address_city?.trim() || null,
    address_state: body.address_state?.trim() || null,
    address_country: body.address_country?.trim() || null,
    address_postal: body.address_postal?.trim() || null,

    social_links: socials,

    avatar_url: body.avatar_url?.trim() || null,
    brand_color_primary: body.brand_color_primary?.trim() || "#3B82F6",
    brand_color_secondary: body.brand_color_secondary?.trim() || "#1E40AF",
    card_theme: theme,
    logo_url: body.logo_url?.trim() || null,

    vcf_include_photo: body.vcf_include_photo ?? true,
    vcf_include_address: body.vcf_include_address ?? false,
    vcf_notes: body.vcf_notes?.trim() || null,
  };

  const { data, error } = await admin.from("bc_cards").insert(insertRow).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, card: data as BcCardRow }, { status: 201 });
}

function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "card"
  );
}

async function uniquifySlug(
  admin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  base: string
): Promise<string> {
  if (!admin) return base;
  let candidate = base;
  let suffix = 2;
  // Loop until we find an unused (user_id, slug) pair — typically 0 or 1
  // iterations, capped at 20 to avoid a runaway.
  for (let i = 0; i < 20; i++) {
    const { data } = await admin
      .from("bc_cards")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}
