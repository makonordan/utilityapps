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

  // Mark + delete in one quick pass. We mark first so the cleanup-by-cron
  // (future) and the deletion both see the reported flag in the audit log.
  await shares.reportShare(slug);
  await shares.deleteBySlug(slug);

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
          subject: `[Share reported & removed] ${slug}`,
          text: [
            `A share was reported and auto-deleted.`,
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
