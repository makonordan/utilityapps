/**
 * Data + utilities for the Event Ticket Generator tool at
 * /tools/event-ticket-generator.
 *
 * Pure TypeScript. No React, no browser APIs, no 'use client'.
 * Imported by both the server (metadata, structured data) and the
 * client (form + preview + PDF/PNG export + bulk generation), plus
 * by a lightweight test harness during development.
 *
 * ── Important, honest note about check-in ──
 *
 * This tool GENERATES tickets and their check-in QR codes. It does
 * NOT validate them at the door. There is no central database of
 * issued tickets and no server that "knows" which tickets are real.
 *
 * That's a deliberate architectural choice — everything runs in the
 * user's browser, we never see attendee data, and organisers keep
 * every list themselves. It also means organisers verify tickets by
 * one of two paths, both of which they own end-to-end:
 *
 *   (a) Scan the QR to read the ticket ID at the door and check it
 *       against their own attendee list (spreadsheet, Notion, CRM).
 *   (b) Encode a verification URL in the QR (see QrContentMode 'url')
 *       so the scanner opens a page the organiser hosts, which then
 *       looks up the ticket in their own system.
 *
 * The UI surfaces this honestly so organisers aren't surprised at the
 * door when they realise there's no "our servers" to confirm against.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type TemplateId =
  | "classic-stub"
  | "modern-gradient"
  | "concert"
  | "vip-pass"
  | "minimal"
  | "wristband";

/** Layout aspect the template is designed for. Horizontal is the
 *  landscape credit-card style; vertical is the portrait lanyard/VIP
 *  pass style. The form UI can auto-swap orientation-sensitive controls
 *  (e.g. logo placement) based on this. */
export type TemplateOrientation = "horizontal" | "vertical";

/** What to put inside the check-in QR. Defaults to 'ticket-id' because
 *  it works with literally any QR scanner — camera app, iOS Camera,
 *  Android Google Lens, dedicated scanning apps. 'url' and 'json' are
 *  for organisers who've built their own verification flow. */
export type QrContentMode = "ticket-id" | "url" | "json";

export interface TicketData {
  eventName: string;
  eventTagline: string;
  organizerName: string;
  venue: string;
  eventDate: string;
  eventTime: string;
  /** e.g. "General Admission", "VIP", "Early Bird". */
  ticketType: string;
  /** Optional seating info — e.g. "Row A, Seat 12", "Table 4". */
  seatInfo: string;
  /** Display only — e.g. "Free", "$25", "₦5,000". No payment processing. */
  price: string;
  /** Unique code identifying this specific ticket. Generated via
   *  generateTicketId or generateRandomTicketId. */
  ticketId: string;
  /** Optional — the person the ticket is issued to. Empty for
   *  transferable / bearer tickets. */
  attendeeName: string;
  /** Public URL to organiser's logo. */
  logoUrl: string;
  /** Optional event banner used as a background image on templates
   *  that support it (concert, modern-gradient). */
  backgroundImageUrl: string;
  primaryColor: string;
  accentColor: string;
  template: TemplateId;
  /** The FINAL string the QR encodes — produced by buildQrContent()
   *  from the mode + this TicketData + optional verification URL. */
  qrContent: string;
  /** Optional fine print shown on the ticket — refund policy,
   *  age restriction, ticket-transfer rules. */
  termsText: string;
}

// ── Templates ─────────────────────────────────────────────────────────────

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  orientation: TemplateOrientation;
  /** Inline SVG string previewing the layout — ~180×100 (or 100×180
   *  for vertical templates), self-contained, safe to render via
   *  dangerouslySetInnerHTML in the template picker. */
  thumbnail: string;
}

// Palette shared by every thumbnail so previews read as one system.
const THUMB_ACCENT = "#3B82F6";
const THUMB_HEADING = "#374151";
const THUMB_MUTED = "#9CA3AF";
const THUMB_BLOCK = "#374151";
const THUMB_BORDER = "#E5E7EB";
const THUMB_BG = "#F9FAFB";
const THUMB_SURFACE = "#FFFFFF";

/** Horizontal 180×100 SVG envelope. */
function thumbH(inner: string): string {
  return `<svg viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="180" height="100" fill="${THUMB_BG}"/>${inner}</svg>`;
}

/** Vertical 100×180 SVG envelope — same viewBox aspect ratio as the
 *  ticket itself so the preview reads as portrait. */
function thumbV(inner: string): string {
  return `<svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="100" height="180" fill="${THUMB_BG}"/>${inner}</svg>`;
}

export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: "classic-stub",
    name: "Classic Stub",
    description:
      "Horizontal ticket with a perforated tear-off stub on the right holding the check-in QR. The layout every venue's staff already recognises.",
    orientation: "horizontal",
    thumbnail: thumbH(
      `<rect x="4" y="6" width="120" height="88" rx="6" fill="${THUMB_SURFACE}" stroke="${THUMB_BORDER}" stroke-width="1"/>` +
        // event title lines
        `<rect x="14" y="14" width="70" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="14" y="24" width="46" height="4" rx="1" fill="${THUMB_ACCENT}"/>` +
        // details bottom
        `<rect x="14" y="68" width="90" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="14" y="78" width="60" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        // perforation
        `<line x1="128" y1="10" x2="128" y2="90" stroke="${THUMB_BORDER}" stroke-width="1" stroke-dasharray="2 2"/>` +
        // stub with QR
        `<rect x="132" y="6" width="44" height="88" rx="6" fill="${THUMB_SURFACE}" stroke="${THUMB_BORDER}" stroke-width="1"/>` +
        `<rect x="142" y="20" width="24" height="24" fill="${THUMB_BLOCK}"/>` +
        `<rect x="138" y="52" width="32" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="140" y="60" width="28" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="138" y="76" width="32" height="4" rx="1" fill="${THUMB_ACCENT}"/>`
    ),
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    description:
      "Full-bleed gradient background with a clean, high-contrast layout. Reads as premium without needing a photo.",
    orientation: "horizontal",
    thumbnail: thumbH(
      `<defs><linearGradient id="tt-gradient" x1="0" y1="0" x2="180" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${THUMB_ACCENT}"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>` +
        `<rect x="4" y="6" width="172" height="88" rx="10" fill="url(#tt-gradient)"/>` +
        // text on gradient
        `<rect x="14" y="18" width="80" height="6" rx="1" fill="${THUMB_SURFACE}"/>` +
        `<rect x="14" y="28" width="60" height="4" rx="1" fill="${THUMB_SURFACE}" opacity="0.8"/>` +
        `<rect x="14" y="72" width="80" height="4" rx="1" fill="${THUMB_SURFACE}" opacity="0.75"/>` +
        // QR block
        `<rect x="132" y="26" width="34" height="34" rx="4" fill="${THUMB_SURFACE}"/>` +
        `<rect x="138" y="32" width="22" height="22" fill="${THUMB_BLOCK}"/>`
    ),
  },
  {
    id: "concert",
    name: "Concert",
    description:
      "Bold, image-forward layout with the event banner as a background. The right pick for gigs, festivals, and screenings.",
    orientation: "horizontal",
    thumbnail: thumbH(
      // dark banner area
      `<rect x="4" y="6" width="172" height="70" rx="8" fill="#111827"/>` +
        // simulated image texture
        `<circle cx="40" cy="30" r="16" fill="${THUMB_ACCENT}" opacity="0.6"/>` +
        `<circle cx="120" cy="50" r="24" fill="#F59E0B" opacity="0.4"/>` +
        `<rect x="14" y="60" width="90" height="6" rx="1" fill="${THUMB_SURFACE}"/>` +
        // bottom band with details
        `<rect x="4" y="78" width="172" height="16" rx="4" fill="${THUMB_SURFACE}" stroke="${THUMB_BORDER}" stroke-width="1"/>` +
        `<rect x="14" y="85" width="60" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="86" y="85" width="40" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="140" y="82" width="26" height="9" fill="${THUMB_BLOCK}"/>`
    ),
  },
  {
    id: "vip-pass",
    name: "VIP Pass",
    description:
      "Dark, elegant lanyard-style pass in portrait. Photo/logo at the top, QR at the bottom, everything else stacked between.",
    orientation: "vertical",
    thumbnail: thumbV(
      // main pass body
      `<rect x="14" y="8" width="72" height="164" rx="8" fill="#0F172A"/>` +
        // lanyard hole
        `<rect x="42" y="12" width="16" height="4" rx="2" fill="${THUMB_BG}"/>` +
        // logo circle
        `<circle cx="50" cy="42" r="16" fill="${THUMB_ACCENT}"/>` +
        // event lines
        `<rect x="22" y="72" width="56" height="6" rx="1" fill="${THUMB_SURFACE}"/>` +
        `<rect x="30" y="84" width="40" height="4" rx="1" fill="${THUMB_ACCENT}"/>` +
        // separator
        `<line x1="22" y1="98" x2="78" y2="98" stroke="${THUMB_SURFACE}" stroke-opacity="0.2" stroke-width="1"/>` +
        // details
        `<rect x="22" y="106" width="56" height="3" rx="1" fill="${THUMB_SURFACE}" opacity="0.6"/>` +
        `<rect x="22" y="114" width="48" height="3" rx="1" fill="${THUMB_SURFACE}" opacity="0.6"/>` +
        // QR
        `<rect x="30" y="130" width="40" height="34" rx="3" fill="${THUMB_SURFACE}"/>` +
        `<rect x="34" y="134" width="32" height="26" fill="${THUMB_BLOCK}"/>`
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "White background, typographic focus, a subtle accent line down the left edge. The most print-friendly template — one ink colour if you want.",
    orientation: "horizontal",
    thumbnail: thumbH(
      `<rect x="4" y="6" width="172" height="88" rx="4" fill="${THUMB_SURFACE}" stroke="${THUMB_BORDER}" stroke-width="1"/>` +
        // accent bar
        `<rect x="4" y="6" width="4" height="88" fill="${THUMB_ACCENT}"/>` +
        // clean typography
        `<rect x="18" y="14" width="70" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="18" y="24" width="50" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="18" y="66" width="60" height="4" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="18" y="76" width="80" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="18" y="82" width="70" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        // small QR
        `<rect x="140" y="30" width="30" height="30" fill="${THUMB_BLOCK}"/>` +
        `<rect x="140" y="68" width="30" height="3" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "wristband",
    name: "Wristband",
    description:
      "Long thin horizontal band with rounded ends. Prints on standard wristband stock; the QR sits neatly on one end so it's visible when worn.",
    orientation: "horizontal",
    thumbnail: thumbH(
      // long thin band centred vertically
      `<rect x="6" y="42" width="168" height="16" rx="8" fill="${THUMB_ACCENT}"/>` +
        `<rect x="18" y="47" width="60" height="4" rx="1" fill="${THUMB_SURFACE}"/>` +
        `<rect x="90" y="48" width="40" height="3" rx="1" fill="${THUMB_SURFACE}" opacity="0.8"/>` +
        // QR square on the right end
        `<rect x="146" y="44" width="12" height="12" fill="${THUMB_SURFACE}"/>` +
        `<rect x="148" y="46" width="8" height="8" fill="${THUMB_BLOCK}"/>`
    ),
  },
];

/** Convenience lookup — templates are frequently accessed by id from
 *  form state and renderers. */
export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> =
  TEMPLATES.reduce(
    (acc, t) => {
      acc[t.id] = t;
      return acc;
    },
    {} as Record<TemplateId, TemplateDefinition>
  );

// ── QR content builder ───────────────────────────────────────────────────

/** Options for buildQrContent. verificationBaseUrl is only consulted
 *  when mode === 'url'. */
export interface BuildQrContentOptions {
  mode: QrContentMode;
  ticket: TicketData;
  /** For mode='url' — the organiser's verification endpoint. We append
   *  `?id=<ticketId>` (or `&id=…` if the URL already has a query
   *  string) so the scanner opens the exact ticket. */
  verificationBaseUrl?: string;
}

/**
 * Turn a TicketData plus a QR content mode into the final string that
 * gets encoded into the check-in QR code. Falls back to the plain
 * ticket ID for unknown modes and for 'url' when no base URL is
 * provided — the ticket ID is still the source of truth either way.
 */
export function buildQrContent(
  mode: QrContentMode,
  ticket: TicketData,
  verificationBaseUrl?: string
): string {
  const id = ticket.ticketId ?? "";
  switch (mode) {
    case "ticket-id":
      return id;
    case "url": {
      const base = (verificationBaseUrl ?? "").trim();
      if (!base) return id;
      const abs = /^https?:\/\//i.test(base) ? base : `https://${base}`;
      const sep = abs.includes("?") ? "&" : "?";
      return `${abs}${sep}id=${encodeURIComponent(id)}`;
    }
    case "json": {
      const payload: Record<string, string> = { id };
      if (ticket.eventName?.trim()) payload.event = ticket.eventName.trim();
      if (ticket.attendeeName?.trim()) payload.name = ticket.attendeeName.trim();
      return JSON.stringify(payload);
    }
    default:
      return id;
  }
}

// ── Ticket ID generators ─────────────────────────────────────────────────

/** Uppercase alphanum for prefixes. Empty → "TKT" default. Truncates
 *  overlong prefixes to 8 chars so IDs stay printable at ~2 cm scan
 *  size. */
function cleanPrefix(prefix: string, fallback: string = "TKT"): string {
  const cleaned = (prefix ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  return cleaned || fallback;
}

/**
 * Sequential ticket ID like "MEETUP-2026-00042". Right pick when the
 * organiser is generating tickets from a spreadsheet row or a numbered
 * batch — the sequence lets them cross-reference at the door.
 */
export function generateTicketId(prefix: string, sequence: number): string {
  const year = new Date().getFullYear();
  const seq = Math.max(0, Math.floor(sequence));
  const padded = String(seq).padStart(5, "0");
  return `${cleanPrefix(prefix)}-${year}-${padded}`;
}

/**
 * Random ticket ID like "TKT-K7M3PXQ2". Right pick for one-off tickets
 * where a sequence isn't meaningful. Uses Crockford-inspired charset
 * (no I/O/0/1 lookalikes) so a scanner mishap on a printed ticket
 * doesn't yield a valid-looking-but-wrong ID.
 */
export function generateRandomTicketId(prefix: string = "TKT"): string {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `${cleanPrefix(prefix)}-${out}`;
}
