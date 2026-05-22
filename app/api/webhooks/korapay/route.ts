import { NextRequest } from "next/server";

import { verifyWebhookSignature } from "@/lib/korapay";
import { getOrderByReference, updateOrderStatus } from "@/lib/orders";
import { createDownloadLink, sendProductEmail } from "@/lib/productDelivery";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

/**
 * Korapay payment webhook.
 *
 * Korapay POSTs here when a charge completes. We:
 *  1. Verify the `x-korapay-signature` HMAC — untrusted requests are rejected.
 *  2. On `charge.success`, match the order, re-check amount/currency.
 *  3. Mark it paid, mint a signed download link, and email it to the buyer.
 *
 * Idempotent: Korapay retries until it gets a 2xx, and an already-fulfilled
 * order is a no-op. A confirmed-but-undelivered order returns 500 so Korapay
 * retries and we get another chance to deliver.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  let payload: { event?: string; data?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const signature = request.headers.get("x-korapay-signature");
  if (!verifyWebhookSignature(payload.data, signature)) {
    console.warn("[korapay-webhook] rejected: invalid signature");
    return new Response("invalid signature", { status: 401 });
  }

  // Only successful charges fulfil an order. Acknowledge everything else with
  // 200 so Korapay does not keep retrying events we intentionally ignore.
  if (payload.event !== "charge.success" || !payload.data) {
    return new Response("ignored", { status: 200 });
  }

  const data = payload.data;
  const reference = typeof data.reference === "string" ? data.reference : "";
  if (!reference) return new Response("missing reference", { status: 200 });

  const order = await getOrderByReference(reference);
  if (!order) {
    console.warn("[korapay-webhook] no order for reference", reference);
    return new Response("order not found", { status: 200 });
  }

  // Idempotency — a retried webhook for an already-delivered order is a no-op.
  if (order.status === "fulfilled") {
    return new Response("already fulfilled", { status: 200 });
  }

  // Re-check the charge against the order we created. Never trust the webhook
  // body alone for the amount.
  const chargeStatus = String(data.status ?? "").toLowerCase();
  if (chargeStatus && chargeStatus !== "success") {
    await updateOrderStatus(reference, "failed");
    return new Response("charge not successful", { status: 200 });
  }
  const paidAmount = Number(data.amount);
  const paidCurrency = String(data.currency ?? "");
  if (
    !Number.isFinite(paidAmount) ||
    paidAmount + 0.01 < order.amount ||
    paidCurrency !== order.currency
  ) {
    console.error("[korapay-webhook] amount/currency mismatch for", reference, {
      expected: `${order.currency} ${order.amount}`,
      got: `${paidCurrency} ${data.amount}`,
    });
    return new Response("amount mismatch", { status: 200 });
  }

  await updateOrderStatus(reference, "paid");

  // Fulfil: mint a signed download link and email it. If any of this fails,
  // return 500 so Korapay retries — the order is "paid" not "fulfilled", so
  // the retry resumes delivery without re-charging.
  const product = getProductById(order.product_id);
  if (!product?.file) {
    console.error("[korapay-webhook] product/file missing for", order.product_id);
    return new Response("product file missing", { status: 500 });
  }

  const downloadUrl = await createDownloadLink(product.file);
  if (!downloadUrl) {
    return new Response("could not create download link", { status: 500 });
  }

  const emailed = await sendProductEmail({
    to: order.email,
    productName: product.name,
    downloadUrl,
    reference,
    amount: order.amount,
    currency: order.currency,
  });
  if (!emailed) {
    return new Response("could not send email", { status: 500 });
  }

  await updateOrderStatus(reference, "fulfilled");
  return new Response("ok", { status: 200 });
}
