import "server-only";

import { getSupabaseAdmin } from "./supabaseAdmin";

/**
 * Order persistence for owned digital products.
 *
 * Orders hold a customer email and the source-of-truth payment state, so the
 * `orders` table has RLS enabled with NO anon policies — every read/write here
 * goes through the service-role client. See lib/db/schema.sql.
 */

export type OrderStatus = "pending" | "paid" | "fulfilled" | "failed";

export interface OrderRow {
  id: string;
  reference: string;
  product_id: string;
  email: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  reference: string;
  productId: string;
  email: string;
  amount: number;
  currency: string;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRow | null> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.error("[orders] SUPABASE_SERVICE_ROLE_KEY not configured");
    return null;
  }
  const { data, error } = await db
    .from("orders")
    .insert({
      reference: input.reference,
      product_id: input.productId,
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      status: "pending",
    })
    .select()
    .single();
  if (error) {
    console.error("[orders] create failed:", error.message);
    return null;
  }
  return data as OrderRow;
}

export async function getOrderByReference(reference: string): Promise<OrderRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) {
    console.error("[orders] lookup failed:", error.message);
    return null;
  }
  return (data as OrderRow) ?? null;
}

export async function updateOrderStatus(
  reference: string,
  status: OrderStatus
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) return false;
  const { error } = await db
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("reference", reference);
  if (error) {
    console.error("[orders] status update failed:", error.message);
    return false;
  }
  return true;
}
