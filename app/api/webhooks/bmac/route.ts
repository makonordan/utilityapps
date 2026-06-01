import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { recordPayment, upsertSupporter, markSupporterCancelled } from "@/lib/supporterWebhook";
import type { SupporterTier } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Buy Me a Coffee webhook.
 *
 * BMaC sends an HMAC-SHA256 of the raw body in the `x-signature-sha256`
 * header, computed with a shared secret you set in the BMaC dashboard.
 * We require BMAC_WEBHOOK_SECRET to be set; without it we reject every
 * request so a misconfigured deploy can't be spoofed.
 *
 * Plan → tier mapping is env-driven. Set BMAC_PLAN_SUPPORTER_ID etc. to
 * the BMaC membership level ID for each tier; un-mapped plans get
 * ignored with a 200 so BMaC doesn't keep retrying.
 *
 * Reference: https://developers.buymeacoffee.com/#/webhooks
 *   Verified events handled:
 *     - membership_started (new subscription)
 *     - membership_renewed (recurring charge)
 *     - membership_cancelled (cancellation)
 *     - donation                (one-time tip — recorded as one_time tier)
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.BMAC_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[bmac-webhook] BMAC_WEBHOOK_SECRET not set; rejecting");
    return new Response("not configured", { status: 503 });
  }

  if (!verifySignature(rawBody, request.headers.get("x-signature-sha256"), secret)) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: BmacEvent;
  try {
    payload = JSON.parse(rawBody) as BmacEvent;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  switch (payload.type) {
    case "membership_started":
    case "membership_renewed":
      return await handleMembership(payload);
    case "membership_cancelled":
      return await handleCancellation(payload);
    case "donation":
      return await handleOneTime(payload);
    default:
      return new Response("ignored", { status: 200 });
  }
}

function verifySignature(body: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const headerBuf = Buffer.from(header, "hex");
  if (expectedBuf.length !== headerBuf.length) return false;
  return timingSafeEqual(expectedBuf, headerBuf);
}

interface BmacEvent {
  type: string;
  data: {
    membership_level_id?: string | number;
    transaction_id?: string;
    supporter_email?: string;
    supporter_name?: string;
    display_name?: string;
    amount?: number | string;
    currency?: string;
    billing_period?: string; // "monthly" | "yearly"
    subscription_id?: string;
    next_charge_date?: string;
    is_anonymous?: boolean;
  };
}

function mapBmacPlanToTier(planId: string | number | undefined): SupporterTier | null {
  if (planId === undefined) return null;
  const key = String(planId);
  if (key === process.env.BMAC_PLAN_SUPPORTER_ID) return "supporter";
  if (key === process.env.BMAC_PLAN_POWER_ID) return "power";
  if (key === process.env.BMAC_PLAN_PATRON_ID) return "patron";
  return null;
}

async function handleMembership(payload: BmacEvent): Promise<Response> {
  const d = payload.data;
  const tier = mapBmacPlanToTier(d.membership_level_id);
  if (!tier) return new Response("unknown plan", { status: 200 });
  if (!d.supporter_email || !d.supporter_name) {
    return new Response("missing supporter", { status: 200 });
  }

  const cycle = d.billing_period === "yearly" ? "annual" : "monthly";
  const amount = Number(d.amount ?? 0);

  const up = await upsertSupporter({
    email: d.supporter_email,
    name: d.supporter_name,
    display_name: d.is_anonymous ? "🌟 Anonymous Supporter" : (d.display_name ?? null),
    tier,
    payment_provider: "bmac",
    subscription_id: d.subscription_id ?? null,
    amount_monthly: cycle === "annual" ? amount / 12 : amount,
    currency: (d.currency || "USD").toUpperCase(),
    billing_cycle: cycle,
    show_publicly: !d.is_anonymous,
    next_payment_at: d.next_charge_date ?? null,
  });
  if (!up.ok) {
    return new Response(`upsert failed: ${up.reason}`, { status: 503 });
  }

  if (d.transaction_id) {
    await recordPayment(up.id, {
      amount,
      currency: (d.currency || "USD").toUpperCase(),
      payment_method: "bmac",
      transaction_id: d.transaction_id,
    });
  }
  return new Response("ok", { status: 200 });
}

async function handleCancellation(payload: BmacEvent): Promise<Response> {
  const subId = payload.data.subscription_id;
  if (!subId) return new Response("missing subscription_id", { status: 200 });
  const res = await markSupporterCancelled(subId);
  if (!res.ok) return new Response(`cancel failed: ${res.reason}`, { status: 503 });
  return new Response("ok", { status: 200 });
}

async function handleOneTime(payload: BmacEvent): Promise<Response> {
  const d = payload.data;
  if (!d.supporter_email || !d.supporter_name || !d.transaction_id) {
    return new Response("missing fields", { status: 200 });
  }
  const amount = Number(d.amount ?? 0);

  const up = await upsertSupporter({
    email: d.supporter_email,
    name: d.supporter_name,
    display_name: d.is_anonymous ? "🌟 Anonymous Supporter" : (d.display_name ?? null),
    tier: "one_time",
    payment_provider: "bmac",
    amount_monthly: 0,
    currency: (d.currency || "USD").toUpperCase(),
    billing_cycle: "one_time",
    show_publicly: !d.is_anonymous,
  });
  if (!up.ok) {
    return new Response(`upsert failed: ${up.reason}`, { status: 503 });
  }

  await recordPayment(up.id, {
    amount,
    currency: (d.currency || "USD").toUpperCase(),
    payment_method: "bmac-tip",
    transaction_id: d.transaction_id,
  });
  return new Response("ok", { status: 200 });
}
