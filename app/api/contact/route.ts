import { NextRequest } from "next/server";
import { z } from "zod";

import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";

const SUBJECTS = [
  "General inquiry",
  "Tool request",
  "Bug report",
  "Press / Partnership",
  "Privacy / data request",
  "Other",
] as const;

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
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

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json(
      { success: false, error: issue?.message ?? "Invalid form data" },
      { status: 400 }
    );
  }

  // Honeypot — pretend to succeed but discard the message.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return Response.json({
      success: true,
      message: "Thanks — we'll get back to you within two business days.",
    });
  }

  const { name, email, subject, message } = parsed.data;
  const inboxAddress = process.env.CONTACT_INBOX ?? "hello@utilityapps.site";
  const fromAddress = process.env.RESEND_FROM ?? "noreply@utilityapps.site";

  // Persist to Supabase so every submission is viewable in the admin
  // dashboard. Best-effort: a database failure must not lose the message or
  // break the user's submission — the email send below is the backup path.
  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (queries) {
      const saved = await queries.saveContactMessage(name, email, subject, message);
      if (saved.error) console.warn("[contact] supabase save failed:", saved.error);
    }
  } catch (err) {
    console.error("[contact] supabase", err);
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [inboxAddress],
          reply_to: email,
          subject: `[${SITE_CONFIG.name}] ${subject} — ${name}`,
          html: contactEmailHtml({ name, email, subject, message }),
          text: contactEmailText({ name, email, subject, message }),
        }),
      });
      if (!res.ok) {
        console.warn("[contact] resend non-2xx", res.status);
        return Response.json(
          { success: false, error: "Could not send your message — please email us directly." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[contact] resend", err);
      return Response.json(
        { success: false, error: "Could not send your message — please email us directly." },
        { status: 502 }
      );
    }
  } else {
    // Resend not configured — log so the operator can pull from their server logs.
    console.info("[contact] (resend not configured) inbound message", { name, email, subject, message });
  }

  return Response.json({
    success: true,
    message: "Thanks — we'll get back to you within two business days.",
  });
}

interface EmailFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contactEmailHtml({ name, email, subject, message }: EmailFields): string {
  return `<!doctype html>
<html><body style="font-family: Inter, system-ui, sans-serif; color: #0f172a; padding: 24px; max-width: 600px;">
  <h1 style="font-size: 18px; margin: 0 0 12px;">New message — ${escapeHtml(subject)}</h1>
  <p style="margin: 0 0 4px; color: #475569; font-size: 13px;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
  <p style="margin: 0 0 16px; color: #475569; font-size: 13px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.55;">
    ${escapeHtml(message)}
  </div>
  <p style="margin-top: 24px; color: #94a3b8; font-size: 12px;">Sent from the contact form at ${SITE_CONFIG.url}/contact</p>
</body></html>`;
}

function contactEmailText({ name, email, subject, message }: EmailFields): string {
  return `New message — ${subject}

From: ${name} <${email}>
Subject: ${subject}

${message}

—
Sent from the contact form at ${SITE_CONFIG.url}/contact`;
}
