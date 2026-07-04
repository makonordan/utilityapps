/**
 * Business Card domain types. These mirror the bc_* Supabase tables 1:1
 * so a query result → object literal is a straight cast.
 */

export type BcPlan = "free" | "pro" | "business";
export type BcCardType = "personal" | "business" | "company_department";
export type BcTheme = "minimal" | "gradient" | "dark" | "professional" | "creative";
export type BcBgStyle = "gradient" | "solid" | "pattern";
export type BcScanType =
  | "qr_scan"
  | "link_visit"
  | "master_selector"
  | "vcf_download"
  | "social_click"
  | "phone_tap"
  | "email_tap"
  | "website_tap";

export interface BcSocialLink {
  platform:
    | "linkedin"
    | "twitter"
    | "instagram"
    | "facebook"
    | "youtube"
    | "tiktok"
    | "github"
    | "dribbble"
    | "behance"
    | "whatsapp"
    | "telegram"
    | "calendly"
    | "linktree"
    | "custom";
  url: string;
  /** Display label — defaults to the platform name if omitted at input. */
  label?: string;
}

export interface BcUserRow {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  username: string;
  avatar_url: string | null;
  plan: BcPlan;
  created_at: string;
  updated_at: string;
}

export interface BcCardRow {
  id: string;
  user_id: string;
  slug: string;
  card_type: BcCardType;
  is_active: boolean;
  is_master_visible: boolean;
  display_order: number;

  full_name: string;
  job_title: string | null;
  company_name: string | null;
  department: string | null;
  pronouns: string | null;
  tagline: string | null;
  bio: string | null;

  email: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  website: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_country: string | null;
  address_postal: string | null;

  social_links: BcSocialLink[];

  avatar_url: string | null;
  brand_color_primary: string;
  brand_color_secondary: string;
  card_theme: BcTheme;
  logo_url: string | null;

  vcf_include_photo: boolean;
  vcf_include_address: boolean;
  vcf_notes: string | null;

  scan_count: number;
  view_count: number;
  save_count: number;

  created_at: string;
  updated_at: string;
}

export interface BcMasterSettingsRow {
  id: string;
  user_id: string;
  page_title: string | null;
  page_bio: string | null;
  background_style: BcBgStyle;
  background_color: string;
  show_avatar: boolean;
  master_avatar_url: string | null;
  custom_domain: string | null;
  created_at: string;
  updated_at: string;
}

export interface BcScanRow {
  id: string;
  card_id: string;
  scan_type: BcScanType;
  device_type: string | null;
  country: string | null;
  referrer: string | null;
  scanned_at: string;
}

// ── Plan limits ────────────────────────────────────────────────────────────

/** Enforced server-side in the cards CRUD route. Read-only source of truth
 *  so we never have client and server disagreeing on what's allowed. */
export const PLAN_LIMITS: Record<
  BcPlan,
  { maxCards: number | null; maxSocialLinks: number; themes: BcTheme[]; watermark: boolean; customSlug: boolean }
> = {
  free: {
    maxCards: 1,
    maxSocialLinks: 3,
    themes: ["minimal", "professional"],
    watermark: true,
    customSlug: false,
  },
  // Pro & Business are pay-per-card ($1 one-time / $2 per year respectively),
  // so there's no hard cap — billing gates each new card individually.
  // Until billing is wired up, both behave like unlimited plans.
  pro: {
    maxCards: null,
    maxSocialLinks: 10,
    themes: ["minimal", "gradient", "dark", "professional", "creative"],
    watermark: false,
    customSlug: true,
  },
  business: {
    maxCards: null,
    maxSocialLinks: 100,
    themes: ["minimal", "gradient", "dark", "professional", "creative"],
    watermark: false,
    customSlug: true,
  },
};

// ── Username / slug validation (client-side helpers) ───────────────────────

/** Same rule as the CHECK constraint on bc_users.username. */
export function isValidUsername(u: string): boolean {
  if (u.length < 3 || u.length > 30) return false;
  if (u !== u.toLowerCase()) return false;
  if (!/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/.test(u)) return false;
  if (u.includes("--")) return false;
  return true;
}

export function isValidSlug(s: string): boolean {
  if (s.length < 1 || s.length > 60) return false;
  return /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/.test(s);
}

/** Reserved usernames — collide with app routes or would be confusing. */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "bc",
  "blog",
  "cards",
  "contact",
  "dashboard",
  "demo",
  "help",
  "home",
  "login",
  "logout",
  "master",
  "new",
  "pricing",
  "privacy",
  "settings",
  "signup",
  "support",
  "terms",
  "tools",
  "utilityapps",
]);
