import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";

import { initializeCharge, isKorapayConfigured } from "@/lib/korapay";
import { createOrder } from "@/lib/orders";
import { productFileExists } from "@/lib/productDelivery";
import { getProductById, isOwnedProduct } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";

const CheckoutSchema = z.object({
  productId: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid checkout details" },
      { status: 400 }
    );
  }
  const { productId, email } = parsed.data;

  // The product — and its price — are resolved server-side. The client never
  // sends an amount, so it cannot be tampered with.
  const product = getProductById(productId);
  if (!product || !isOwnedProduct(product)) {
    return Response.json({ error: "Product not available for purchase" }, { status: 404 });
  }
  if (!product.file) {
    return Response.json(
      { error: "This product is coming soon and cannot be purchased yet." },
      { status: 409 }
    );
  }

  if (!isKorapayConfigured()) {
    return Response.json(
      { error: "Checkout is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  // Confirm the downloadable file is actually in storage before charging, so a
  // buyer is never charged for something we cannot deliver.
  if (!(await productFileExists(product.file))) {
    return Response.json(
      { error: "This product isn't available right now. Please try again later." },
      { status: 409 }
    );
  }

  const reference = `ua-${crypto.randomUUID()}`;
  const amount = product.price;
  const currency = product.currency;

  // Persist the order BEFORE redirecting to Korapay, so the webhook always has
  // a record to match against.
  const order = await createOrder({ reference, productId, email, amount, currency });
  if (!order) {
    return Response.json(
      { error: "Could not start checkout. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const { checkoutUrl } = await initializeCharge({
      amount,
      currency,
      reference,
      customerEmail: email,
      redirectUrl: `${SITE_CONFIG.url}/checkout/success?ref=${encodeURIComponent(reference)}`,
      notificationUrl: `${SITE_CONFIG.url}/api/webhooks/korapay`,
      narration: `${SITE_CONFIG.name} — ${product.name}`,
      metadata: { order_id: order.id, product_id: productId },
    });
    return Response.json({ checkoutUrl });
  } catch (err) {
    console.error("[checkout] Korapay initialize failed:", err);
    return Response.json(
      { error: "Could not start checkout. Please try again later." },
      { status: 502 }
    );
  }
}
