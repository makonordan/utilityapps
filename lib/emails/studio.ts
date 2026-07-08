import "server-only";

import type {
  StudioBudget,
  StudioCompanySize,
  StudioContactPref,
  StudioTimeline,
} from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * HTML + plain-text email templates for /studio inquiries.
 *
 * Two emails per inbound:
 *   - userConfirmation()       → sent to the prospect
 *   - internalNotification()   → sent to the studio inbox
 *
 * Templates intentionally keep markup minimal (no external CSS, no
 * images) so they render in every mail client, including Outlook +
 * iOS Mail, without hand-tuning.
 */

const HUMANIZED_SIZE: Record<StudioCompanySize, string> = {
  solo: "Solo",
  small: "Small (2–10)",
  medium: "Medium (11–50)",
  large: "Large (51+)",
};

const HUMANIZED_TIMELINE: Record<StudioTimeline, string> = {
  asap: "ASAP",
  within_month: "Within a month",
  within_quarter: "Within a quarter",
  exploring: "Just exploring",
};

const HUMANIZED_BUDGET: Record<StudioBudget, string> = {
  under_5k: "Under $5K",
  "5k_15k": "$5K – $15K",
  "15k_50k": "$15K – $50K",
  over_50k: "Over $50K",
  open: "Open / not sure",
};

const HUMANIZED_CONTACT: Record<StudioContactPref, string> = {
  email: "Email",
  video_call: "Video call",
  whatsapp: "WhatsApp",
};

export interface InquirySummary {
  name: string;
  email: string;
  company: string;
  company_size: StudioCompanySize;
  industry: string;
  project_type: string;
  project_description: string;
  timeline: StudioTimeline;
  budget_range: StudioBudget;
  referral_source: string | null;
  preferred_contact: StudioContactPref;
  whatsapp_number: string | null;
}

// ── User confirmation ──────────────────────────────────────────────────────

export function userConfirmationSubject(summary: InquirySummary): string {
  return "Got your project details — Daniel will be in touch soon";
}

export function userConfirmationHtml(s: InquirySummary): string {
  return wrap(`
    <p>Hi ${escapeHtml(s.name)},</p>
    <p>Thanks for reaching out about your <strong>${escapeHtml(s.project_type)}</strong> project. Daniel received your details and will personally respond within 24 hours (usually faster).</p>

    <h3 style="margin:24px 0 8px;font-size:14px;color:#0a0a0a;">Here&rsquo;s what to expect:</h3>
    <ol style="padding-left:18px;color:#1f2937;line-height:1.6;font-size:14px;">
      <li>Daniel will email you to schedule a 30-min discovery call</li>
      <li>On the call, you&rsquo;ll discuss your project, goals, and timeline</li>
      <li>Within 48 hours of the call, you&rsquo;ll receive a detailed proposal</li>
      <li>If you approve, we start building within 3 business days</li>
    </ol>

    <h3 style="margin:24px 0 8px;font-size:14px;color:#0a0a0a;">Your project summary:</h3>
    <blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #6366f1;background:#f8fafc;color:#374151;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(s.project_description)}</blockquote>

    <p style="font-size:14px;color:#1f2937;">If you need to add anything or have urgent questions, just reply to this email.</p>
    <p style="font-size:14px;color:#1f2937;">— Daniel<br/>Founder, ${SITE_CONFIG.name} Studio<br/><a href="mailto:studio@utilityapps.site" style="color:#6366f1;">studio@utilityapps.site</a></p>
  `);
}

export function userConfirmationText(s: InquirySummary): string {
  return [
    `Hi ${s.name},`,
    "",
    `Thanks for reaching out about your ${s.project_type} project. Daniel received your details and will personally respond within 24 hours (usually faster).`,
    "",
    "Here's what to expect:",
    "1. Daniel will email you to schedule a 30-min discovery call",
    "2. On the call, you'll discuss your project, goals, and timeline",
    "3. Within 48 hours of the call, you'll receive a detailed proposal",
    "4. If you approve, we start building within 3 business days",
    "",
    "Your project summary:",
    s.project_description,
    "",
    "If you need to add anything or have urgent questions, just reply to this email.",
    "",
    "— Daniel",
    `Founder, ${SITE_CONFIG.name} Studio`,
    "studio@utilityapps.site",
  ].join("\n");
}

// ── Internal notification ─────────────────────────────────────────────────

export function internalNotificationSubject(s: InquirySummary): string {
  return `🔔 New Studio inquiry: ${s.company} — ${s.project_type}`;
}

export function internalNotificationHtml(s: InquirySummary): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 10px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;">${label}</td>
      <td style="padding:6px 10px;font-size:13px;color:#0a0a0a;">${value}</td>
    </tr>`;
  return wrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#0a0a0a;">New Studio inquiry</h2>
    <p style="margin:0 0 16px;font-size:13px;color:#374151;">
      <a href="mailto:${escapeHtml(s.email)}?subject=Re:%20your%20${encodeURIComponent(s.project_type)}%20inquiry" style="color:#6366f1;font-weight:600;">Reply by email</a>
      ${s.whatsapp_number ? ` · <a href="https://wa.me/${onlyDigits(s.whatsapp_number)}" style="color:#10a37f;font-weight:600;">WhatsApp them</a>` : ""}
    </p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${row("Name", escapeHtml(s.name))}
      ${row("Email", `<a href="mailto:${escapeHtml(s.email)}" style="color:#6366f1;">${escapeHtml(s.email)}</a>`)}
      ${row("Company", escapeHtml(s.company))}
      ${row("Company size", HUMANIZED_SIZE[s.company_size])}
      ${row("Industry", escapeHtml(s.industry))}
      ${row("Project type", escapeHtml(s.project_type))}
      ${row("Timeline", HUMANIZED_TIMELINE[s.timeline])}
      ${row("Budget range", HUMANIZED_BUDGET[s.budget_range])}
      ${row("Contact preference", HUMANIZED_CONTACT[s.preferred_contact])}
      ${s.whatsapp_number ? row("WhatsApp", escapeHtml(s.whatsapp_number)) : ""}
      ${s.referral_source ? row("Heard about us via", escapeHtml(s.referral_source)) : ""}
    </table>
    <h3 style="margin:20px 0 8px;font-size:14px;color:#0a0a0a;">Project description</h3>
    <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #6366f1;background:#f8fafc;color:#374151;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(s.project_description)}</blockquote>
  `);
}

export function internalNotificationText(s: InquirySummary): string {
  return [
    `New Studio inquiry`,
    ``,
    `Name:        ${s.name}`,
    `Email:       ${s.email}`,
    `Company:     ${s.company}`,
    `Size:        ${HUMANIZED_SIZE[s.company_size]}`,
    `Industry:    ${s.industry}`,
    `Project:     ${s.project_type}`,
    `Timeline:    ${HUMANIZED_TIMELINE[s.timeline]}`,
    `Budget:      ${HUMANIZED_BUDGET[s.budget_range]}`,
    `Contact via: ${HUMANIZED_CONTACT[s.preferred_contact]}`,
    s.whatsapp_number ? `WhatsApp:    ${s.whatsapp_number}` : null,
    s.referral_source ? `Source:      ${s.referral_source}` : null,
    ``,
    `--- Description ---`,
    s.project_description,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

// ── helpers ────────────────────────────────────────────────────────────────

function wrap(body: string): string {
  return `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0a0a0a;">
    <div style="max-width:560px;margin:0 auto;">${body}</div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function onlyDigits(s: string): string {
  return s.replace(/\D+/g, "");
}
