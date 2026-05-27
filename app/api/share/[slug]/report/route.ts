import { NextRequest, NextResponse } from "next/server";

import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/share/[slug]/report — flag a share as abusive.
 *
 * Per the launch decision, the share is auto-deleted on first report and
 * the recipient page starts returning "removed". A separate notification
 * email lets the operator see what was killed (useful for finding false
 * positives and restoring them from logs if needed).
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");

  const row = await shares.findBySlug(slug);
  if (!row) {
    // Don't reveal whether it ever existed.
    return NextResponse.json({ ok: true });
  }

  // Soft-delete: mark `reported = true`. The recipient page and access
  // route both already treat `reported = true` as 404, so the share is
  // immediately unreachable. The row stays in the DB so the admin can
  // (a) see it in the moderation queue, (b) restore false positives,
  // (c) decide whether to hard-delete. A future cleanup cron will sweep
  // reported rows older than 24h.
  await shares.reportShare(slug);

  // Email notification — best-effort. Failure does not break the report.
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "noreply@utilityapps.site",
          to: ["hello@utilityapps.site"],
          subject: `[Share reported] ${slug}`,
          text: [
            `A share was reported and is now hidden from recipients.`,
            `Review and restore (or hard-delete) at ${SITE_CONFIG.url}/admin → Share tab.`,
            ``,
            `Slug: ${slug}`,
            `URL was: ${SITE_CONFIG.url}/s/${slug}`,
            `Type: ${row.type}`,
            `Created: ${row.created_at}`,
            `Expired at: ${row.expires_at}`,
            `View count: ${row.view_count}`,
            `Creator IP hash: ${row.creator_ip ?? "(none)"}`,
            ``,
            row.type === "url"
              ? `Original URL: ${row.original_url}`
              : row.type === "text"
                ? `Text preview (first 500 chars): ${(row.text_content ?? "").slice(0, 500)}`
                : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch (err) {
      console.error("[share/report] resend", err);
    }
  }

  return NextResponse.json({ ok: true });
}
