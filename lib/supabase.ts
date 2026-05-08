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
    };
    // We don't define any DB views — but supabase-js v2.105's `GenericSchema`
    // contract requires a `Views` field. Empty object satisfies it.
    Views: Record<string, never>;
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
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown database error";
  return { data: null, error: message };
}
