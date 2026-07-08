import "server-only";

import { getSupabaseAdmin } from "./supabaseAdmin";
import { SITE_CONFIG } from "./utils";

/**
 * Digital-product delivery: turn a paid order into a download.
 *
 * Product files live in the PRIVATE Supabase Storage bucket `product-files`
 * (so they can never be downloaded for free). On payment confirmation we mint
 * a time-limited signed URL and email it to the buyer via Resend.
 */

const BUCKET = "product-files";
/** Signed download links stay valid for 14 days. */
const LINK_TTL_SECONDS = 60 * 60 * 24 * 14;
const SUPPORT_EMAIL = "hello@utilityapps.site";

/**
 * Confirm a product file actually exists in storage. The checkout route calls
 * this BEFORE charging, so a buyer is never charged for a file that has not
 * been uploaded yet.
 */
export async function productFileExists(filePath: string): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) return false;
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(filePath, 60);
  return !error && Boolean(data?.signedUrl);
}

/** Mint a time-limited, download-forcing signed URL for a product file. */
export async function createDownloadLink(filePath: string): Promise<string | null> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.error("[delivery] SUPABASE_SERVICE_ROLE_KEY not configured");
    return null;
  }
  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUrl(filePath, LINK_TTL_SECONDS, { download: true });
  if (error || !data?.signedUrl) {
    console.error("[delivery] signed URL failed:", error?.message ?? "no url returned");
    return null;
  }
  return data.signedUrl;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ProductEmailInput {
  to: string;
  productName: string;
  downloadUrl: string;
  reference: string;
  amount: number;
  currency: string;
}

/** Send the buyer their download link. Returns false on any failure. */
export async function sendProductEmail(input: ProductEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "noreply@utilityapps.site";
  if (!apiKey) {
    console.warn("[delivery] RESEND_API_KEY not set — cannot email download link");
    return false;
  }

  const name = escapeHtml(input.productName);
  const url = input.downloadUrl;
  const price = `${input.currency} ${input.amount.toFixed(2)}`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#f1f5f9;font-family:Inter,system-ui,sans-serif;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#0066FF;">${escapeHtml(SITE_CONFIG.name)}</p>
      <h1 style="margin:0 0 16px;font-size:22px;">Thanks for your purchase 🎉</h1>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">Your order is confirmed. Here is your download:</p>
      <p style="margin:0 0 20px;font-size:17px;font-weight:700;">${name}</p>
      <a href="${url}" style="display:inline-block;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;">Download your product</a>
      <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#475569;">This download link works for <strong>14 days</strong>. Please save the file somewhere safe once you've downloaded it.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;"><strong>Order reference:</strong> ${escapeHtml(input.reference)}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#475569;"><strong>Amount paid:</strong> ${escapeHtml(price)}</p>
      <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#475569;">Trouble downloading? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#0066FF;">${SUPPORT_EMAIL}</a> with your order reference.</p>
    </div>
    <p style="text-align:center;margin:16px 0 0;font-size:12px;color:#94a3b8;">${escapeHtml(SITE_CONFIG.name)} · ${escapeHtml(SITE_CONFIG.url)}</p>
  </div>
</body></html>`;

  const text = `Thanks for your purchase!

Your order is confirmed. Download your product:
${input.productName}

${url}

This download link works for 14 days — please save the file somewhere safe.

Order reference: ${input.reference}
Amount paid: ${price}

Trouble downloading? Contact ${SUPPORT_EMAIL} with your order reference.

— ${SITE_CONFIG.name}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from,
        to: [input.to],
        subject: `Your download — ${input.productName}`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[delivery] Resend non-2xx:", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[delivery] Resend send failed:", err);
    return false;
  }
}
