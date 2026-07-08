import { NextRequest } from "next/server";

import {
  internalNotificationHtml,
  internalNotificationSubject,
  internalNotificationText,
  userConfirmationHtml,
  userConfirmationSubject,
  userConfirmationText,
} from "@/lib/emails/studio";
import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Receives discovery-call inquiries from /studio and /studio/contact.
 *
 *   1. Best-effort rate limit (3 inquiries per IP per rolling 24h, in-memory).
 *      Spec called for Upstash Redis here; Upstash isn't installed, so we
 *      use a per-process Map. Good enough for the expected volume (low,
 *      manually triaged); not horizontally scalable. Swap to Redis when
 *      the form starts seeing meaningful traffic or bot abuse.
 *   2. Server-side validation of every field + enum.
 *   3. Insert into supabase.studio_inquiries via the public anon client —
 *      the table allows anon-INSERT but denies anon-SELECT (PII), so the
 *      inquiry is visible only to service-role admin reads.
 *   4. Send the prospect a confirmation + the studio inbox a notification
 *      via Resend (if RESEND_API_KEY is set).
 *   5. Return 200 on success. Email failures don't roll back the DB write —
 *      the inquiry is the source of truth, email is a notification channel.
 */

const ALLOWED_SIZES = new Set(["solo", "small", "medium", "large"]);
const ALLOWED_TIMELINES = new Set(["asap", "within_month", "within_quarter", "exploring"]);
const ALLOWED_BUDGETS = new Set(["under_5k", "5k_15k", "15k_50k", "over_50k", "open"]);
const ALLOWED_CONTACT_PREFS = new Set(["email", "video_call", "whatsapp"]);

const MAX_PER_IP_PER_DAY = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const ipBuckets = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return Response.json(
      { ok: false, error: "Too many inquiries from your network today. Email studio@utilityapps.site instead." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validate(body);
  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: 400 });
  }
  const input = validation.input;

  // Persist via the anon client — RLS allows INSERT but blocks SELECT, so
  // the row is invisible to the public-facing client even after insert.
  const { addStudioInquiry } = await import("@/lib/db/queries");
  const saved = await addStudioInquiry(input);
  if (saved.error || !saved.data) {
    console.error("[studio-inquiry] supabase insert failed:", saved.error);
    return Response.json(
      { ok: false, error: "Couldn't save your inquiry. Please email studio@utilityapps.site directly." },
      { status: 502 }
    );
  }

  // Fire-and-forget the two emails. Failures are logged but don't fail the
  // request — the inquiry is already saved and the prospect will be reached
  // out to manually if email delivery breaks.
  void sendEmails(input).catch((err) => {
    console.error("[studio-inquiry] email send failed:", err);
  });

  return Response.json({ ok: true });
}

// ── validation ────────────────────────────────────────────────────────────

interface ValidationOk {
  ok: true;
  input: import("@/lib/db/queries").StudioInquiryInput;
}
interface ValidationFail {
  ok: false;
  error: string;
}

function validate(body: Record<string, unknown>): ValidationOk | ValidationFail {
  const str = (key: string, max = 500): string | null => {
    const v = body[key];
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    if (!trimmed) return null;
    return trimmed.slice(0, max);
  };

  const optStr = (key: string, max = 500): string | null => {
    const v = body[key];
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    if (!trimmed) return null;
    return trimmed.slice(0, max);
  };

  const name = str("name", 200);
  const email = str("email", 320);
  const company = str("company", 200);
  const companySize = str("company_size", 20);
  const industry = str("industry", 100);
  const projectType = str("project_type", 200);
  const projectDescription = str("project_description", 2000);
  const timeline = str("timeline", 30);
  const budget = str("budget_range", 30);
  const preferredContact = str("preferred_contact", 30);
  const whatsapp = optStr("whatsapp_number", 30);
  const referral = optStr("referral_source", 200);

  if (!name) return { ok: false, error: "Name is required" };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid email is required" };
  }
  if (!company) return { ok: false, error: "Company name is required" };
  if (!companySize || !ALLOWED_SIZES.has(companySize)) {
    return { ok: false, error: "Invalid company size" };
  }
  if (!industry) return { ok: false, error: "Industry is required" };
  if (!projectType) return { ok: false, error: "Project type is required" };
  if (!projectDescription || projectDescription.length < 20) {
    return { ok: false, error: "Please describe the project in at least 20 characters" };
  }
  if (!timeline || !ALLOWED_TIMELINES.has(timeline)) {
    return { ok: false, error: "Invalid timeline" };
  }
  if (!budget || !ALLOWED_BUDGETS.has(budget)) {
    return { ok: false, error: "Invalid budget range" };
  }
  if (!preferredContact || !ALLOWED_CONTACT_PREFS.has(preferredContact)) {
    return { ok: false, error: "Invalid contact preference" };
  }

  return {
    ok: true,
    input: {
      name,
      email,
      company,
      company_size: companySize as ValidationOk["input"]["company_size"],
      industry,
      project_type: projectType,
      project_description: projectDescription,
      timeline: timeline as ValidationOk["input"]["timeline"],
      budget_range: budget as ValidationOk["input"]["budget_range"],
      referral_source: referral,
      preferred_contact: preferredContact as ValidationOk["input"]["preferred_contact"],
      whatsapp_number: whatsapp,
    },
  };
}

// ── emails ────────────────────────────────────────────────────────────────

async function sendEmails(input: import("@/lib/db/queries").StudioInquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[studio-inquiry] RESEND_API_KEY missing; skipping email send", {
      to: input.email,
    });
    return;
  }
  const from = process.env.RESEND_FROM ?? "noreply@utilityapps.site";
  const internalTo =
    process.env.INTERNAL_NOTIFICATION_EMAIL ??
    process.env.NEXT_PUBLIC_STUDIO_EMAIL ??
    "studio@utilityapps.site";

  const summary: import("@/lib/emails/studio").InquirySummary = {
    name: input.name,
    email: input.email,
    company: input.company,
    company_size: input.company_size,
    industry: input.industry,
    project_type: input.project_type,
    project_description: input.project_description,
    timeline: input.timeline,
    budget_range: input.budget_range,
    referral_source: input.referral_source ?? null,
    preferred_contact: input.preferred_contact,
    whatsapp_number: input.whatsapp_number ?? null,
  };

  // Send both in parallel — the prospect's confirmation and the studio's
  // notification are independent. Each is wrapped in its own try so one
  // failing doesn't block the other.
  await Promise.all([
    resendSend({
      apiKey,
      from,
      to: input.email,
      reply_to: internalTo,
      subject: userConfirmationSubject(summary),
      html: userConfirmationHtml(summary),
      text: userConfirmationText(summary),
    }),
    resendSend({
      apiKey,
      from,
      to: internalTo,
      reply_to: input.email,
      subject: `[${SITE_CONFIG.name}] ${internalNotificationSubject(summary)}`,
      html: internalNotificationHtml(summary),
      text: internalNotificationText(summary),
    }),
  ]);
}

async function resendSend(args: {
  apiKey: string;
  from: string;
  to: string;
  reply_to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${args.apiKey}`,
      },
      body: JSON.stringify({
        from: args.from,
        to: [args.to],
        reply_to: args.reply_to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[studio-inquiry] resend non-2xx", res.status, txt.slice(0, 200));
    }
  } catch (err) {
    console.error("[studio-inquiry] resend fetch failed", err);
  }
}

// ── rate limit ────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  if (ip === "unknown") return true; // never block when we can't identify
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const arr = (ipBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (arr.length >= MAX_PER_IP_PER_DAY) {
    ipBuckets.set(ip, arr);
    return false;
  }
  arr.push(now);
  ipBuckets.set(ip, arr);

  // Best-effort cleanup so the Map doesn't grow unbounded across cold-start
  // lifetime. Cheap when the Map is small (which it always should be).
  if (ipBuckets.size > 1000) {
    for (const [k, v] of ipBuckets) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) ipBuckets.delete(k);
      else ipBuckets.set(k, fresh);
    }
  }
  return true;
}
