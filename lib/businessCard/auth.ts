import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { BcUserRow } from "./types";

/**
 * Auth is Supabase-native. The RLS policies on bc_* tables key off
 * `auth.uid()` directly, so any session-bearing request from the browser
 * (via the SSR cookie helper below) gets its access scoped automatically.
 *
 * For anything that needs to bypass RLS — creating the bc_users row on
 * first sign-in, inserting analytics scans on behalf of anon users —
 * we drop down to the service-role admin client via `lib/supabaseAdmin`.
 */

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  // Next 16 makes cookies() async. Await it here so callers only need one
  // await on the parent function.
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options);
            }
          } catch {
            /* setAll may throw when called from a Server Component that
             * hasn't opted into cookie mutation — safe to ignore, the
             * middleware refresh will pick it up next request. */
          }
        },
      },
    }
  );
}

/** Get the current authenticated Supabase Auth user, or null. */
export async function getSessionUser(): Promise<{
  authId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
} | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return {
    authId: data.user.id,
    email: data.user.email ?? null,
    name:
      (data.user.user_metadata?.full_name as string | undefined) ??
      (data.user.user_metadata?.name as string | undefined) ??
      null,
    avatarUrl:
      (data.user.user_metadata?.avatar_url as string | undefined) ??
      (data.user.user_metadata?.picture as string | undefined) ??
      null,
  };
}

/** Resolve the current session to a bc_users row, creating it lazily
 *  on first visit. Returns null if the request isn't authenticated. */
export async function getBcUser(): Promise<BcUserRow | null> {
  const session = await getSessionUser();
  if (!session) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;

  // Look up by auth_id first.
  const { data: existing } = await admin
    .from("bc_users")
    .select("*")
    .eq("auth_id", session.authId)
    .maybeSingle();
  if (existing) return existing as BcUserRow;

  // First sign-in: DON'T auto-provision here. Username selection is
  // a required step (public URL depends on it) that the /create wizard
  // owns. Return null so the caller knows the user hasn't finished
  // onboarding yet.
  return null;
}

/**
 * Create the bc_users row for the current session with a chosen username.
 * Used by the create-wizard onboarding step. The username uniqueness +
 * shape check lives in the SQL CHECK constraint AND in isValidUsername
 * client-side; we just surface DB errors here.
 */
export async function provisionBcUser(username: string): Promise<
  | { ok: true; user: BcUserRow }
  | { ok: false; reason: "not-authenticated" | "username-taken" | "invalid" | "db-error"; detail?: string }
> {
  const session = await getSessionUser();
  if (!session) return { ok: false, reason: "not-authenticated" };
  if (!session.email) return { ok: false, reason: "invalid", detail: "email missing from auth" };

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, reason: "db-error", detail: "admin unconfigured" };

  const { data, error } = await admin
    .from("bc_users")
    .insert({
      auth_id: session.authId,
      email: session.email,
      name: session.name ?? session.email.split("@")[0],
      username: username.toLowerCase(),
      avatar_url: session.avatarUrl,
    })
    .select("*")
    .single();

  if (error) {
    // Postgres unique_violation is code 23505; check on the username index
    // vs auth_id index is inferred from the constraint name.
    if (error.code === "23505") {
      if (error.message.includes("username")) return { ok: false, reason: "username-taken" };
      // auth_id collision means the row already exists — race with a
      // concurrent request. Refetch and return it.
      const { data: existing } = await admin
        .from("bc_users")
        .select("*")
        .eq("auth_id", session.authId)
        .single();
      if (existing) return { ok: true, user: existing as BcUserRow };
    }
    if (error.code === "23514") return { ok: false, reason: "invalid", detail: "username failed CHECK constraint" };
    return { ok: false, reason: "db-error", detail: error.message };
  }
  return { ok: true, user: data as BcUserRow };
}
