import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { recordPayment, upsertSupporter, markSupporterCancelled } from "@/lib/supporterWebhook";
import type { SupporterTier } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Paystack webhook (Nigeria-first recurring + one-time).
 *
 * Paystack signs every webhook with `x-paystack-signature` — an
 * HMAC-SHA512 of the raw body using your SECRET_KEY. We require
 * PAYSTACK_SECRET_KEY to be set; without it we reject everything so a
 * misconfigured deploy can't be spoofed.
 *
 * Plan → tier mapping is env-driven via PAYSTACK_PLAN_*_CODE so adding
 * a tier doesn't need a code change.
 *
 * Reference: https://paystack.com/docs/payments/webhooks
 *   Events handled:
 *     - subscription.create     (new recurring supporter)
 *     - invoice.payment_failed  (mark pending; no DB change for now)
 *     - subscription.disable    (cancellation)
 *     - charge.success          (recurring renewal OR one-time donation)
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("[paystack-webhook] PAYSTACK_SECRET_KEY not set; rejecting");
    return new Response("not configured", { status: 503 });
  }

  if (!verifySignature(rawBody, request.headers.get("x-paystack-signature"), secret)) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: PaystackEvent;
  try {
    payload = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  switch (payload.event) {
    case "subscription.create":
      return await handleSubscriptionCreate(payload);
    case "subscription.disable":
      return await handleSubscriptionDisable(payload);
    case "charge.success":
      return await handleCharge(payload);
    default:
      return new Response("ignored", { status: 200 });
  }
}

function verifySignature(body: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac("sha512", secret).update(body).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const headerBuf = Buffer.from(header, "hex");
  if (expectedBuf.length !== headerBuf.length) return false;
  return timingSafeEqual(expectedBuf, headerBuf);
}

interface PaystackEvent {
  event: string;
  data: {
    plan?: { plan_code?: string; interval?: string; amount?: number };
    subscription_code?: string;
    customer?: { email?: string; first_name?: string; last_name?: string };
    amount?: number;
    currency?: string;
    reference?: string;
    next_payment_date?: string;
    metadata?: { display_name?: string; is_anonymous?: boolean; supporter_tier?: SupporterTier };
  };
}

function mapPaystackPlanToTier(planCode: string | undefined): SupporterTier | null {
  if (!planCode) return null;
  if (planCode === process.env.PAYSTACK_PLAN_SUPPORTER_CODE) return "supporter";
  if (planCode === process.env.PAYSTACK_PLAN_POWER_CODE) return "power";
  if (planCode === process.env.PAYSTACK_PLAN_PATRON_CODE) return "patron";
  return null;
}

async function handleSubscriptionCreate(payload: PaystackEvent): Promise<Response> {
  const d = payload.data;
  const tier = mapPaystackPlanToTier(d.plan?.plan_code);
  if (!tier || !d.customer?.email) return new Response("unknown plan", { status: 200 });

  const cycle = d.plan?.interval === "annually" ? "annual" : "monthly";
  // Paystack returns amount in kobo (NGN minor unit). Divide by 100 for naira.
  const amount = Number(d.plan?.amount ?? 0) / 100;
  const name = `${d.customer.first_name ?? ""} ${d.customer.last_name ?? ""}`.trim() ||
    d.customer.email;
  const isAnonymous = d.metadata?.is_anonymous === true;

  const up = await upsertSupporter({
    email: d.customer.email,
    name,
    display_name: isAnonymous ? "🌟 Anonymous Supporter" : d.metadata?.display_name ?? null,
    tier,
    payment_provider: "paystack",
    subscription_id: d.subscription_code ?? null,
    amount_monthly: cycle === "annual" ? amount / 12 : amount,
    currency: (d.currency || "NGN").toUpperCase(),
    billing_cycle: cycle,
    show_publicly: !isAnonymous,
    next_payment_at: d.next_payment_date ?? null,
  });
  if (!up.ok) {
    return new Response(`upsert failed: ${up.reason}`, { status: 503 });
  }
  return new Response("ok", { status: 200 });
}

async function handleSubscriptionDisable(payload: PaystackEvent): Promise<Response> {
  const subId = payload.data.subscription_code;
  if (!subId) return new Response("missing subscription_code", { status: 200 });
  const res = await markSupporterCancelled(subId);
  if (!res.ok) return new Response(`cancel failed: ${res.reason}`, { status: 503 });
  return new Response("ok", { status: 200 });
}

async function handleCharge(payload: PaystackEvent): Promise<Response> {
  const d = payload.data;
  if (!d.customer?.email || !d.reference) {
    return new Response("missing fields", { status: 200 });
  }

  // For recurring renewals the plan is set → reuse subscription handling.
  // For pure one-time donations (no plan) we record the payment under a
  // one_time supporter row.
  const tier = d.plan?.plan_code ? mapPaystackPlanToTier(d.plan.plan_code) : "one_time";
  if (!tier) return new Response("unknown plan", { status: 200 });

  const amount = Number(d.amount ?? 0) / 100;
  const name = `${d.customer.first_name ?? ""} ${d.customer.last_name ?? ""}`.trim() ||
    d.customer.email;
  const isAnonymous = d.metadata?.is_anonymous === true;

  const up = await upsertSupporter({
    email: d.customer.email,
    name,
    display_name: isAnonymous ? "🌟 Anonymous Supporter" : d.metadata?.display_name ?? null,
    tier,
    payment_provider: "paystack",
    subscription_id: null,
    amount_monthly: tier === "one_time" ? 0 : amount,
    currency: (d.currency || "NGN").toUpperCase(),
    billing_cycle: tier === "one_time" ? "one_time" : "monthly",
    show_publicly: !isAnonymous,
  });
  if (!up.ok) {
    return new Response(`upsert failed: ${up.reason}`, { status: 503 });
  }

  await recordPayment(up.id, {
    amount,
    currency: (d.currency || "NGN").toUpperCase(),
    payment_method: "paystack",
    transaction_id: d.reference,
  });
  return new Response("ok", { status: 200 });
}
