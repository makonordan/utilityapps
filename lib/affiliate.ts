import { getOrCreateAnonId } from "./anon-id";
import { PRODUCTS_BY_ID } from "./products";

function detectDevice(): "mobile" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

/**
 * Track an affiliate-link click.
 *
 * Posts to /api/affiliate/click which logs to the dedicated `products_clicks`
 * Supabase table. Uses `keepalive: true` so the request survives the page
 * navigation triggered by the actual <a target="_blank"> click. Best-effort
 * — never throws, never blocks the caller.
 */
export async function trackAffiliateClick(productId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const product = PRODUCTS_BY_ID[productId];
  if (!product) return;

  const session = getOrCreateAnonId();
  const device = detectDevice();

  try {
    await fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        url: product.affiliateUrl,
        source: window.location.pathname,
        session,
        device,
      }),
      keepalive: true,
    });
  } catch {
    // Swallow — the buy click navigation is what matters.
  }
}
