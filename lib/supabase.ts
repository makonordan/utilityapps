import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
  );
}

export interface ToolUsageRow {
  id: number;
  tool_id: string;
  user_session: string | null;
  created_at: string;
  country: string | null;
  device: string | null;
}

export interface BookmarkRow {
  id: number;
  user_id: string;
  tool_id: string;
  created_at: string;
}

export interface NewsletterSubscriberRow {
  id: number;
  email: string;
  created_at: string;
  confirmed: boolean;
  source: string | null;
}

export interface ToolRatingRow {
  id: number;
  tool_id: string;
  rating: number;
  created_at: string;
  user_session: string | null;
}

export interface BlogViewRow {
  id: number;
  slug: string;
  views: number;
  updated_at: string;
}

export interface SearchQueryRow {
  id: number;
  query: string;
  results_count: number;
  clicked_tool: string | null;
  created_at: string;
}

export interface ProductsClickRow {
  id: number;
  product_id: string;
  url: string;
  source: string | null;
  user_session: string | null;
  country: string | null;
  device: string | null;
  created_at: string;
}

export interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// --- Apps directory analytics (anonymous, no IP, no accounts) -------------

export interface AppSearchRow {
  id: number;
  query: string;
  results_count: number;
  category: string | null;
  clicked_app_id: string | null;
  created_at: string;
}

export type AppEventType =
  | "listing_view"
  | "affiliate_click"
  | "compare_view"
  | "helpful_yes"
  | "helpful_no"
  | "filter_used";

export interface AppEventRow {
  id: number;
  app_id: string;
  event_type: AppEventType;
  metadata: Record<string, unknown>;
  device_type: string | null;
  country: string | null;
  created_at: string;
}

export interface AppSuggestionRow {
  id: number;
  suggested_name: string;
  suggested_url: string | null;
  reason: string | null;
  email: string | null;
  created_at: string;
}

export type SupporterTier = "supporter" | "power" | "patron" | "one_time";
export type SupporterProvider = "bmac" | "stripe" | "paystack" | "manual";
export type SupporterStatus = "active" | "cancelled" | "pending";
export type SupporterCycle = "monthly" | "annual" | "one_time";

/** Full supporter row — only readable via the service-role client. */
export interface SupporterRow {
  id: string;
  email: string;
  name: string;
  display_name: string | null;
  tier: SupporterTier;
  payment_provider: SupporterProvider;
  subscription_id: string | null;
  amount_monthly: number;
  currency: string;
  billing_cycle: SupporterCycle;
  status: SupporterStatus;
  show_publicly: boolean;
  joined_at: string;
  last_payment_at: string | null;
  next_payment_at: string | null;
  total_contributed: number;
}

/** Anon-readable projection used by the /support wall. No PII. */
export interface SupporterPublicRow {
  display_name: string;
  tier: SupporterTier;
  joined_at: string;
}

export interface SupporterPaymentRow {
  id: string;
  supporter_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  paid_at: string;
}

export type StudioCompanySize = "solo" | "small" | "medium" | "large";
export type StudioTimeline = "asap" | "within_month" | "within_quarter" | "exploring";
export type StudioBudget = "under_5k" | "5k_15k" | "15k_50k" | "over_50k" | "open";
export type StudioContactPref = "email" | "video_call" | "whatsapp";
export type StudioStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost";

export interface StudioInquiryRow {
  id: string;
  name: string;
  email: string;
  company: string;
  company_size: StudioCompanySize;
  industry: string;
  project_type: string;
  project_description: string;
  timeline: StudioTimeline;
  budget_range: StudioBudget;
  referral_source: string | null;
  preferred_contact: StudioContactPref;
  whatsapp_number: string | null;
  status: StudioStatus;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      tool_usage: {
        Row: ToolUsageRow;
        Insert: Omit<ToolUsageRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<ToolUsageRow, "id">>;
        Relationships: [];
      };
      bookmarks: {
        Row: BookmarkRow;
        Insert: Omit<BookmarkRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<BookmarkRow, "id">>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: Omit<NewsletterSubscriberRow, "id" | "created_at" | "confirmed"> & {
          created_at?: string;
          confirmed?: boolean;
        };
        Update: Partial<Omit<NewsletterSubscriberRow, "id">>;
        Relationships: [];
      };
      tool_ratings: {
        Row: ToolRatingRow;
        Insert: Omit<ToolRatingRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<ToolRatingRow, "id">>;
        Relationships: [];
      };
      blog_views: {
        Row: BlogViewRow;
        Insert: Omit<BlogViewRow, "id" | "updated_at" | "views"> & {
          updated_at?: string;
          views?: number;
        };
        Update: Partial<Omit<BlogViewRow, "id">>;
        Relationships: [];
      };
      search_queries: {
        Row: SearchQueryRow;
        Insert: Omit<SearchQueryRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<SearchQueryRow, "id">>;
        Relationships: [];
      };
      products_clicks: {
        Row: ProductsClickRow;
        Insert: Omit<ProductsClickRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<ProductsClickRow, "id">>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Omit<ContactMessageRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<ContactMessageRow, "id">>;
        Relationships: [];
      };
      app_searches: {
        Row: AppSearchRow;
        Insert: Omit<AppSearchRow, "id" | "created_at" | "results_count"> & {
          created_at?: string;
          results_count?: number;
        };
        Update: Partial<Omit<AppSearchRow, "id">>;
        Relationships: [];
      };
      app_events: {
        Row: AppEventRow;
        Insert: Omit<AppEventRow, "id" | "created_at" | "metadata"> & {
          created_at?: string;
          metadata?: Record<string, unknown>;
        };
        Update: Partial<Omit<AppEventRow, "id">>;
        Relationships: [];
      };
      app_suggestions: {
        Row: AppSuggestionRow;
        Insert: Omit<AppSuggestionRow, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<AppSuggestionRow, "id">>;
        Relationships: [];
      };
      supporters: {
        Row: SupporterRow;
        Insert: Omit<SupporterRow, "id" | "joined_at"> & {
          id?: string;
          joined_at?: string;
        };
        Update: Partial<Omit<SupporterRow, "id">>;
        Relationships: [];
      };
      supporter_payments: {
        Row: SupporterPaymentRow;
        Insert: Omit<SupporterPaymentRow, "id" | "paid_at"> & {
          id?: string;
          paid_at?: string;
        };
        Update: Partial<Omit<SupporterPaymentRow, "id">>;
        Relationships: [];
      };
      studio_inquiries: {
        Row: StudioInquiryRow;
        Insert: Omit<StudioInquiryRow, "id" | "status" | "notes" | "created_at"> & {
          id?: string;
          status?: StudioStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<StudioInquiryRow, "id">>;
        Relationships: [];
      };
    };
    Views: {
      supporters_public: {
        Row: SupporterPublicRow;
        Relationships: [];
      };
    };
    Functions: {
      get_trending_tools: {
        Args: { window_days?: number; max_results?: number };
        Returns: { tool_id: string; usage_count: number }[];
      };
      get_trending_searches: {
        Args: { window_days?: number; max_results?: number };
        Returns: { query: string; search_count: number }[];
      };
      increment_blog_view: {
        Args: { p_slug: string };
        Returns: number;
      };
    };
  };
}

// supabase-js v2.105 added internal `__InternalSupabase` and `Views` keys to
// its `GenericSchema` contract that our hand-written `Database` type doesn't
// satisfy. Rather than maintain those internal shapes, we type the client
// loosely here and rely on the strongly-typed `*Row` interfaces above at
// call sites (admin.ts, queries.ts) for the actual safety net.
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "utilityapps" } },
  }
);

export type DbResult<T> = { data: T | null; error: string | null };

export function ok<T>(data: T): DbResult<T> {
  return { data, error: null };
}

export function fail<T = never>(error: unknown): DbResult<T> {
  // Supabase's PostgrestError is a plain object in some builds, not an Error
  // instance — so also accept any object that exposes a string `.message`.
  // Without this, real errors collapse to "Unknown database error" and the
  // caller has no idea what actually went wrong.
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : error &&
            typeof error === "object" &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Unknown database error";
  return { data: null, error: message };
}
