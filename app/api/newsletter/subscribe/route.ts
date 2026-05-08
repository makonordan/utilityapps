import { NextRequest } from "next/server";
import { z } from "zod";

import { getRankedTrendingTools } from "@/lib/trending";
import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(64).optional().nullable(),
});


export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = SubscribeSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return Response.json(
      { success: false, error: first?.message ?? "Invalid email" },
      { status: 400 }
    );
  }

  const { email, source } = parsed.data;

  // 1+2. Persist via Supabase (upsert handles "already subscribed").
  let alreadySubscribed = false;
  try {
    const [queries, db] = await Promise.all([
      import("@/lib/db/queries").catch(() => null),
      import("@/lib/supabase").catch(() => null),
    ]);
    if (queries && db) {
      const lookup = await db.supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("email", email)
        .maybeSingle();
      alreadySubscribed = !!lookup.data;

      const insert = await queries.subscribeNewsletter(email, source ?? null);
      if (insert.error) {
        return Response.json(
          { success: false, error: insert.error },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    console.error("[newsletter/subscribe] supabase", err);
  }

  // 3. Send the welcome email via Resend (only for first-time subscribers
  //    so we don't spam returning users).
  if (!alreadySubscribed && process.env.RESEND_API_KEY) {
    try {
      const tools = await getRankedTrendingTools(5);
      const html = welcomeEmailHtml(tools);
      const text = welcomeEmailText(tools);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "noreply@utilityapps.site",
          to: [email],
          subject: `Welcome to ${SITE_CONFIG.name} — Your Free Tool Guide`,
          html,
          text,
        }),
      });
      if (!res.ok) {
        console.warn("[newsletter/subscribe] resend non-2xx", res.status);
      }
    } catch (err) {
      // Email failure must not break the subscription.
      console.error("[newsletter/subscribe] resend", err);
    }
  }

  return Response.json({
    success: true,
    alreadySubscribed,
    message: alreadySubscribed
      ? "You're already subscribed — see you Friday."
      : "Check your email!",
  });
}

interface ToolForEmail {
  id: string;
  name: string;
  description: string;
  href: string;
}

function welcomeEmailHtml(tools: ToolForEmail[]): string {
  const toolList = tools
    .map(
      (t) => `
        <tr>
          <td style="padding:8px 0; vertical-align:top;">
            <a href="${SITE_CONFIG.url}${t.href}" style="color:#0066FF; font-weight:600; text-decoration:none;">${escapeHtml(t.name)}</a>
            <div style="color:#475569; font-size:13px; line-height:1.45; margin-top:2px;">${escapeHtml(t.description)}</div>
          </td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome to ${SITE_CONFIG.name}</title>
</head>
<body style="margin:0; padding:0; background:#f8fafc; font-family: 'Inter', -apple-system, system-ui, Segoe UI, Roboto, sans-serif; color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc; padding:24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:16px; padding:32px;">
          <tr>
            <td>
              <a href="${SITE_CONFIG.url}" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none;">
                <span style="display:inline-block; width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#0066FF,#7C3AED); color:#fff; text-align:center; line-height:32px; font-weight:800;">U</span>
                <span style="color:#0f172a; font-weight:700; font-size:18px;">${SITE_CONFIG.name}</span>
              </a>

              <h1 style="font-size:22px; line-height:1.3; margin:24px 0 8px;">Thanks for subscribing to ${SITE_CONFIG.name}!</h1>
              <p style="margin:0; color:#475569; font-size:14px; line-height:1.55;">
                You'll get one short email each Friday — no spam, no other emails. To get you started, here are the 5 most popular tools this week:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px; border-top:1px solid #e2e8f0;">
                ${toolList}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                <tr>
                  <td>
                    <a href="${SITE_CONFIG.url}/tools" style="display:inline-block; background:#0066FF; color:#ffffff; padding:12px 18px; border-radius:12px; text-decoration:none; font-weight:600; font-size:14px;">Browse all 200+ tools</a>
                  </td>
                </tr>
              </table>

              <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />
              <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.5;">
                You're receiving this because you subscribed at ${SITE_CONFIG.url}.
                <a href="${SITE_CONFIG.url}/unsubscribe?email=${encodeURIComponent("__EMAIL__")}" style="color:#94a3b8; text-decoration:underline;">Unsubscribe in one click</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function welcomeEmailText(tools: ToolForEmail[]): string {
  const lines = tools
    .map((t) => `- ${t.name}: ${SITE_CONFIG.url}${t.href}`)
    .join("\n");
  return `Thanks for subscribing to ${SITE_CONFIG.name}!

You'll get one short email each Friday — no spam, no other emails. To get you started, here are the 5 most popular tools this week:

${lines}

Browse all 200+ tools: ${SITE_CONFIG.url}/tools

Unsubscribe: ${SITE_CONFIG.url}/unsubscribe`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
