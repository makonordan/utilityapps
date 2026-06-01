import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { recordPayment, upsertSupporter, markSupporterCancelled } from "@/lib/supporterWebhook";
import type { SupporterTier } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Stripe webhook (international recurring + one-time).
 *
 * Stripe sends `stripe-signature` with each request. We require
 * STRIPE_WEBHOOK_SECRET to be set; without it we reject everything.
 *
 * We verify the signature manually (no Stripe SDK dependency) so the
 * route stays a single file. Stripe's scheme:
 *   - Header format:  t=<unix>,v1=<hmac-sha256>
 *   - Signed payload: `${timestamp}.${rawBody}`
 *
 * Plan → tier mapping is env-driven via STRIPE_PRICE_*. Add tiers by
 * setting new env vars; no code change required.
 *
 * Reference: https://stripe.com/docs/webhooks/signatures
 *   Events handled:
 *     - checkout.session.completed
 *     - customer.subscription.created
 *     - customer.subscription.updated  (renewal payments)
 *     - customer.subscription.deleted  (cancellation)
 *     - invoice.payment_succeeded      (record each renewal payment)
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set; rejecting");
    return new Response("not configured", { status: 503 });
  }

  if (!verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), secret)) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: StripeEvent;
  try {
    payload = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  switch (payload.type) {
    case "checkout.session.completed":
      return await handleCheckout(payload);
    case "customer.subscription.deleted":
      return await handleCancellation(payload);
    case "invoice.payment_succeeded":
      return await handleRenewal(payload);
    default:
      return new Response("ignored", { status: 200 });
  }
}

/** Parse Stripe's t=<ts>,v1=<sig> header + verify HMAC. Reject signatures
 *  older than 5 minutes to prevent replay. */
function verifyStripeSignature(body: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    })
  );
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  if (Math.abs(Date.now() / 1000 - tsNum) > 300) return false; // 5-min replay window

  const signed = `${ts}.${body}`;
  const expected = createHmac("sha256", secret).update(signed).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(sig, "hex");
  if (expectedBuf.length !== sigBuf.length) return false;
  return timingSafeEqual(expectedBuf, sigBuf);
}

interface StripeEvent {
  type: string;
  data: {
    object: {
      id?: string;
      customer_email?: string;
      customer_details?: { email?: string; name?: string };
      subscription?: string;
      mode?: "payment" | "subscription";
      amount_total?: number;
      amount_paid?: number;
      currency?: string;
      metadata?: {
        display_name?: string;
        is_anonymous?: string;
        supporter_tier?: SupporterTier;
        billing_cycle?: "monthly" | "annual";
      };
      lines?: {
        data?: Array<{ price?: { id?: string; recurring?: { interval?: string } } }>;
      };
      items?: {
        data?: Array<{ price?: { id?: string; recurring?: { interval?: string } } }>;
      };
    };
  };
}

function mapStripePriceToTier(
  priceId: string | undefined
): { tier: SupporterTier; cycle: "monthly" | "annual" } | null {
  if (!priceId) return null;
  const M = (env: string) => process.env[env] === priceId;
  if (M("STRIPE_PRICE_SUPPORTER_MONTHLY")) return { tier: "supporter", cycle: "monthly" };
  if (M("STRIPE_PRICE_SUPPORTER_ANNUAL")) return { tier: "supporter", cycle: "annual" };
  if (M("STRIPE_PRICE_POWER_MONTHLY")) return { tier: "power", cycle: "monthly" };
  if (M("STRIPE_PRICE_POWER_ANNUAL")) return { tier: "power", cycle: "annual" };
  if (M("STRIPE_PRICE_PATRON_MONTHLY")) return { tier: "patron", cycle: "monthly" };
  if (M("STRIPE_PRICE_PATRON_ANNUAL")) return { tier: "patron", cycle: "annual" };
  return null;
}

async function handleCheckout(payload: StripeEvent): Promise<Response> {
  const o = payload.data.object;
  const email = o.customer_details?.email ?? o.customer_email;
  const name = o.customer_details?.name ?? email ?? "Supporter";
  if (!email) return new Response("missing email", { status: 200 });

  const isAnonymous = o.metadata?.is_anonymous === "true";
  const displayName = isAnonymous
    ? "🌟 Anonymous Supporter"
    : o.metadata?.display_name ?? null;

  if (o.mode === "subscription") {
    const priceId = o.items?.data?.[0]?.price?.id;
    const mapped = mapStripePriceToTier(priceId);
    if (!mapped) return new Response("unknown price", { status: 200 });

    const amount = (o.amount_total ?? 0) / 100;
    const up = await upsertSupporter({
      email,
      name,
      display_name: displayName,
      tier: mapped.tier,
      payment_provider: "stripe",
      subscription_id: o.subscription ?? null,
      amount_monthly: mapped.cycle === "annual" ? amount / 12 : amount,
      currency: (o.currency || "USD").toUpperCase(),
      billing_cycle: mapped.cycle,
      show_publicly: !isAnonymous,
    });
    if (!up.ok) {
      return new Response(`upsert failed: ${up.reason}`, { status: 503 });
    }
    if (o.id) {
      await recordPayment(up.id, {
        amount,
        currency: (o.currency || "USD").toUpperCase(),
        payment_method: "stripe",
        transaction_id: o.id,
      });
    }
    return new Response("ok", { status: 200 });
  }

  // One-time donation via Stripe Checkout (mode === "payment").
  const amount = (o.amount_total ?? 0) / 100;
  const up = await upsertSupporter({
    email,
    name,
    display_name: displayName,
    tier: "one_time",
    payment_provider: "stripe",
    amount_monthly: 0,
    currency: (o.currency || "USD").toUpperCase(),
    billing_cycle: "one_time",
    show_publicly: !isAnonymous,
  });
  if (!up.ok) {
    return new Response(`upsert failed: ${up.reason}`, { status: 503 });
  }
  if (o.id) {
    await recordPayment(up.id, {
      amount,
      currency: (o.currency || "USD").toUpperCase(),
      payment_method: "stripe-onetime",
      transaction_id: o.id,
    });
  }
  return new Response("ok", { status: 200 });
}

async function handleCancellation(payload: StripeEvent): Promise<Response> {
  const subId = payload.data.object.id;
  if (!subId) return new Response("missing id", { status: 200 });
  const res = await markSupporterCancelled(subId);
  if (!res.ok) return new Response(`cancel failed: ${res.reason}`, { status: 503 });
  return new Response("ok", { status: 200 });
}

async function handleRenewal(payload: StripeEvent): Promise<Response> {
  // Stripe sends invoice.payment_succeeded for each recurring charge.
  // We use it to record the payment row; the supporters row is already
  // active from the initial checkout, so no upsert is needed here.
  const o = payload.data.object;
  if (!o.id || !o.subscription) return new Response("missing fields", { status: 200 });
  const priceId = o.lines?.data?.[0]?.price?.id;
  const mapped = mapStripePriceToTier(priceId);
  if (!mapped) return new Response("unknown price", { status: 200 });

  const amount = (o.amount_paid ?? 0) / 100;

  // Look up the existing supporter by subscription_id to attach the payment.
  // Cheaper than another upsert and avoids racing with the checkout event.
  const { getSupabaseAdmin } = await import("@/lib/supabaseAdmin");
  const admin = getSupabaseAdmin();
  if (!admin) return new Response("supabase admin unconfigured", { status: 503 });
  const { data: row } = await admin
    .from("supporters")
    .select("id")
    .eq("subscription_id", o.subscription)
    .single();
  if (!row) return new Response("supporter not found", { status: 200 });

  await recordPayment(row.id as string, {
    amount,
    currency: (o.currency || "USD").toUpperCase(),
    payment_method: "stripe-renewal",
    transaction_id: o.id,
  });
  return new Response("ok", { status: 200 });
}
