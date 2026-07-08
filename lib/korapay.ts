import "server-only";

import crypto from "node:crypto";

/**
 * Korapay (https://korapay.com) integration — server-only.
 *
 * Flow: `initializeCharge` creates a hosted-checkout session and returns a
 * `checkout_url` the buyer is redirected to. When payment completes, Korapay
 * POSTs a webhook to our `notification_url`; `verifyWebhookSignature` proves
 * that webhook genuinely came from Korapay before we fulfil the order.
 *
 * The secret key lives only in the `KORAPAY_SECRET_KEY` environment variable.
 */

const KORAPAY_API = "https://api.korapay.com/merchant/api/v1";

function secretKey(): string {
  const key = process.env.KORAPAY_SECRET_KEY;
  if (!key) throw new Error("KORAPAY_SECRET_KEY is not configured");
  return key;
}

/** True when the integration is configured — used to gate the checkout route. */
export function isKorapayConfigured(): boolean {
  return Boolean(process.env.KORAPAY_SECRET_KEY);
}

export interface InitializeChargeInput {
  amount: number;
  currency: string;
  reference: string;
  customerEmail: string;
  customerName?: string;
  redirectUrl: string;
  notificationUrl: string;
  narration?: string;
  metadata?: Record<string, string>;
}

interface KorapayInitResponse {
  status?: boolean;
  message?: string;
  data?: { checkout_url?: string; reference?: string };
}

/**
 * Create a Korapay hosted-checkout session. Returns the URL to redirect the
 * buyer to. Throws on any non-success response so the caller can fail loudly.
 */
export async function initializeCharge(
  input: InitializeChargeInput
): Promise<{ checkoutUrl: string; reference: string }> {
  const res = await fetch(`${KORAPAY_API}/charges/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey()}`,
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      reference: input.reference,
      redirect_url: input.redirectUrl,
      notification_url: input.notificationUrl,
      narration: input.narration,
      // We absorb the processing fee so the buyer pays exactly the sticker price.
      merchant_bears_cost: true,
      customer: {
        email: input.customerEmail,
        ...(input.customerName ? { name: input.customerName } : {}),
      },
      ...(input.metadata ? { metadata: input.metadata } : {}),
    }),
  });

  const json = (await res.json().catch(() => null)) as KorapayInitResponse | null;

  if (!res.ok || !json?.status || !json.data?.checkout_url) {
    throw new Error(json?.message || `Korapay initialize failed (HTTP ${res.status})`);
  }

  return {
    checkoutUrl: json.data.checkout_url,
    reference: json.data.reference ?? input.reference,
  };
}

/**
 * Verify a Korapay webhook signature. Korapay signs the webhook by computing
 * the HMAC-SHA256 of the JSON-stringified `data` object, keyed with the secret
 * key. We recompute it and compare in constant time.
 */
export function verifyWebhookSignature(
  dataObject: unknown,
  signature: string | null | undefined
): boolean {
  if (!signature) return false;
  let expected: string;
  try {
    expected = crypto
      .createHmac("sha256", secretKey())
      .update(JSON.stringify(dataObject))
      .digest("hex");
  } catch {
    return false;
  }
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
