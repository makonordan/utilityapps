import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for server-side admin reads of tables that must
 * NOT be readable with the public anon key — currently `contact_messages`,
 * which holds names, emails and message text (PII).
 *
 * The service-role key bypasses Row Level Security, so this module is marked
 * `server-only`: the build fails loudly if it is ever imported into client
 * code, which would leak the key into the browser bundle.
 *
 * Returns `null` when SUPABASE_SERVICE_ROLE_KEY is not configured, so callers
 * degrade gracefully (the admin panel shows a "key not set" hint) instead of
 * crashing.
 */

let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "utilityapps-admin" } },
  });
  return cached;
}
