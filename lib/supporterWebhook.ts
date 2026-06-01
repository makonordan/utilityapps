import "server-only";

import type {
  SupporterCycle,
  SupporterProvider,
  SupporterTier,
} from "./supabase";
import { getSupabaseAdmin } from "./supabaseAdmin";

/**
 * Shared upsert helper used by the three supporter webhook routes.
 *
 * A single upsert keyed on (email) so:
 *   - The same supporter resubscribing under a new tier just updates their row
 *   - Cancelled supporters who resubscribe come back as active automatically
 *   - Each separate payment becomes its own `supporter_payments` row,
 *     idempotent on (supporter_id, transaction_id)
 *
 * Returns `{ ok: false }` if Supabase isn't configured — callers convert
 * that to a 503 so the payment provider retries the webhook later.
 */

export interface SupporterUpsert {
  email: string;
  name: string;
  display_name?: string | null;
  tier: SupporterTier;
  payment_provider: SupporterProvider;
  subscription_id?: string | null;
  amount_monthly: number;
  currency: string;
  billing_cycle: SupporterCycle;
  show_publicly?: boolean;
  next_payment_at?: string | null;
}

export interface PaymentInsert {
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  paid_at?: string;
}

export async function upsertSupporter(
  data: SupporterUpsert
): Promise<{ ok: true; id: string } | { ok: false; reason: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, reason: "supabase-admin-unconfigured" };

  const { data: row, error } = await admin
    .from("supporters")
    .upsert(
      {
        email: data.email,
        name: data.name,
        display_name: data.display_name ?? null,
        tier: data.tier,
        payment_provider: data.payment_provider,
        subscription_id: data.subscription_id ?? null,
        amount_monthly: data.amount_monthly,
        currency: data.currency,
        billing_cycle: data.billing_cycle,
        status: "active",
        show_publicly: data.show_publicly ?? true,
        last_payment_at: new Date().toISOString(),
        next_payment_at: data.next_payment_at ?? null,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (error || !row) {
    return { ok: false, reason: error?.message ?? "upsert-failed" };
  }
  return { ok: true, id: row.id as string };
}

export async function recordPayment(
  supporterId: string,
  payment: Omit<PaymentInsert, "email">
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, reason: "supabase-admin-unconfigured" };

  const { error } = await admin.from("supporter_payments").upsert(
    {
      supporter_id: supporterId,
      amount: payment.amount,
      currency: payment.currency,
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id,
      paid_at: payment.paid_at ?? new Date().toISOString(),
    },
    { onConflict: "supporter_id,transaction_id", ignoreDuplicates: true }
  );

  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function markSupporterCancelled(
  subscriptionId: string
): Promise<{ ok: true; updated: number } | { ok: false; reason: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, reason: "supabase-admin-unconfigured" };

  const { data, error } = await admin
    .from("supporters")
    .update({ status: "cancelled", next_payment_at: null })
    .eq("subscription_id", subscriptionId)
    .select("id");

  if (error) return { ok: false, reason: error.message };
  return { ok: true, updated: data?.length ?? 0 };
}
