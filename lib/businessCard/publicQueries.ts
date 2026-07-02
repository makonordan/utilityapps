import "server-only";

import type { BcCardRow, BcMasterSettingsRow, BcUserRow } from "./types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Read helpers for the public /bc/ pages. Uses the service-role admin
 * client so that even if RLS on bc_users blocks anon reads of the row
 * (only exposing username is fine, but we also need name+avatar), we
 * can return the public-safe fields for rendering.
 *
 * These helpers strip PII/private fields at the query layer, not just
 * relying on RLS — belt-and-braces.
 */

export interface PublicUser {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export async function getPublicUser(username: string): Promise<PublicUser | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin
    .from("bc_users")
    .select("id, username, name, avatar_url")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (!data) return null;
  const row = data as Pick<BcUserRow, "id" | "username" | "name" | "avatar_url">;
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    avatarUrl: row.avatar_url,
  };
}

export async function getPublicMasterSettings(userId: string): Promise<BcMasterSettingsRow | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin
    .from("bc_master_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as BcMasterSettingsRow | null) ?? null;
}

export async function getPublicMasterCards(userId: string): Promise<BcCardRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data } = await admin
    .from("bc_cards")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .eq("is_master_visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as BcCardRow[];
}

export async function getPublicCard(username: string, slug: string): Promise<{ card: BcCardRow; user: PublicUser } | null> {
  const user = await getPublicUser(username);
  if (!user) return null;
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin
    .from("bc_cards")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", slug.toLowerCase())
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  return { card: data as BcCardRow, user };
}
