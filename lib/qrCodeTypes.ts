/**
 * Data + encoders for the QR Code Generator tool at
 * /tools/qr-code-generator.
 *
 * Pure TypeScript. No React, no browser APIs, no 'use client'. Imported
 * by both the server (metadata, structured data) and the client (form
 * builder + preview + PNG/SVG export), plus by a lightweight test
 * harness during development.
 *
 * Every encoder returns the exact standardised payload that a QR
 * library (we use `qrcode` + `qr-code-styling`) then rasters into an
 * image. Getting these formats correct is the whole game — a QR code
 * that scans as text-with-a-URL instead of triggering the OS's built-in
 * WiFi-join / add-contact / phone-dial / open-app behaviour is nearly
 * as useless as no QR at all. Scanner apps look for specific prefixes
 * (WIFI:, BEGIN:VCARD, mailto:, tel:, geo:, bitcoin:) and switch UX
 * accordingly.
 */

// ── Types ─────────────────────────────────────────────────────────────────

/** IDs of every QR content-type the tool supports. */
export type QrTypeId =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "sms"
  | "phone"
  | "whatsapp"
  | "event"
  | "geo"
  | "crypto"
  | "app";

/** Input widget kinds recognised by the form renderer. */
export type QrFieldType =
  | "text"
  | "textarea"
  | "password"
  | "select"
  | "checkbox"
  | "number"
  | "datetime-local"
  | "email"
  | "tel"
  | "url";

export interface QrFieldOption {
  value: string;
  label: string;
}

export interface QrField {
  /** Matches the key in the form's value map. */
  key: string;
  label: string;
  type: QrFieldType;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  /** Populated for `select` fields. */
  options?: readonly QrFieldOption[];
}

export interface QrType {
  id: QrTypeId;
  name: string;
  /** Lucide icon name. Resolved via lib/icons.ts at render time. */
  icon: string;
  description: string;
  fields: readonly QrField[];
}

// ── Field-value shapes used by the encoders ──────────────────────────────

export interface WifiFields {
  ssid: string;
  password: string;
  /** WPA covers WPA/WPA2/WPA3 on every scanner in the wild. */
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardFields {
  firstName: string;
  lastName: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface EmailFields {
  address: string;
  subject: string;
  body: string;
}

export interface SmsFields {
  phone: string;
  message: string;
}

export interface WhatsappFields {
  phone: string;
  prefilledMessage: string;
}

export interface EventFields {
  title: string;
  location: string;
  /** ISO-ish "YYYY-MM-DDTHH:mm" from a datetime-local input. Local time. */
  startDate: string;
  endDate: string;
  description: string;
}

export interface GeoFields {
  latitude: string;
  longitude: string;
}

export interface CryptoFields {
  coin: "BTC" | "ETH";
  address: string;
  /** Optional amount. Left empty → no ?amount= parameter. */
  amount: string;
}

// ── QR_TYPES catalog ─────────────────────────────────────────────────────

export const QR_TYPES: readonly QrType[] = [
  {
    id: "url",
    name: "Website URL",
    icon: "Link",
    description: "Any web link. Most-scanned QR type by far.",
    fields: [
      {
        key: "url",
        label: "Website URL",
        type: "url",
        required: true,
        placeholder: "https://example.com",
      },
    ],
  },
  {
    id: "text",
    name: "Plain text",
    icon: "Type",
    description: "Arbitrary text — a note, a passphrase, a message.",
    fields: [
      {
        key: "text",
        label: "Text",
        type: "textarea",
        required: true,
        placeholder: "Any text you want the scanner to see.",
      },
    ],
  },
  {
    id: "wifi",
    name: "WiFi network",
    icon: "Wifi",
    description:
      "Prints the SSID and password so scanners can join in one tap.",
    fields: [
      { key: "ssid", label: "Network name (SSID)", type: "text", required: true },
      { key: "password", label: "Password", type: "password" },
      {
        key: "encryption",
        label: "Encryption",
        type: "select",
        options: [
          { value: "WPA", label: "WPA / WPA2 / WPA3" },
          { value: "WEP", label: "WEP (legacy)" },
          { value: "nopass", label: "None (open network)" },
        ],
      },
      {
        key: "hidden",
        label: "Hidden network",
        type: "checkbox",
        hint: "Check if your network doesn't broadcast its SSID.",
      },
    ],
  },
  {
    id: "vcard",
    name: "Contact card",
    icon: "Contact",
    description: "Scanner offers to save the contact directly to the phone.",
    fields: [
      { key: "firstName", label: "First name", type: "text", required: true },
      { key: "lastName", label: "Last name", type: "text" },
      { key: "org", label: "Company", type: "text" },
      { key: "title", label: "Job title", type: "text" },
      { key: "phone", label: "Phone", type: "tel", placeholder: "+234 803 …" },
      { key: "email", label: "Email", type: "email" },
      { key: "website", label: "Website", type: "url" },
      { key: "address", label: "Address", type: "textarea" },
    ],
  },
  {
    id: "email",
    name: "Email",
    icon: "Mail",
    description: "Opens the recipient's mail app with the message pre-filled.",
    fields: [
      { key: "address", label: "To", type: "email", required: true },
      { key: "subject", label: "Subject", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    id: "sms",
    name: "SMS",
    icon: "MessageSquare",
    description: "Opens the messages app with the number and text queued up.",
    fields: [
      {
        key: "phone",
        label: "Phone",
        type: "tel",
        required: true,
        placeholder: "+234 803 …",
      },
      { key: "message", label: "Message", type: "textarea" },
    ],
  },
  {
    id: "phone",
    name: "Phone number",
    icon: "Phone",
    description: "Scanner offers to dial the number.",
    fields: [
      {
        key: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        placeholder: "+234 803 …",
      },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "MessageCircle",
    description: "Opens a WhatsApp chat with the pre-filled message.",
    fields: [
      {
        key: "phone",
        label: "Phone (with country code)",
        type: "tel",
        required: true,
        placeholder: "+2348037723164",
        hint: "Include the country code — no spaces or dashes.",
      },
      {
        key: "prefilledMessage",
        label: "Pre-filled message",
        type: "textarea",
      },
    ],
  },
  {
    id: "event",
    name: "Calendar event",
    icon: "Calendar",
    description: "Scanner offers to add the event to the phone's calendar.",
    fields: [
      { key: "title", label: "Event title", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      {
        key: "startDate",
        label: "Starts",
        type: "datetime-local",
        required: true,
      },
      { key: "endDate", label: "Ends", type: "datetime-local", required: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    id: "geo",
    name: "Location",
    icon: "MapPin",
    description: "Opens the point on Google Maps / Apple Maps.",
    fields: [
      {
        key: "latitude",
        label: "Latitude",
        type: "text",
        required: true,
        placeholder: "6.5244",
      },
      {
        key: "longitude",
        label: "Longitude",
        type: "text",
        required: true,
        placeholder: "3.3792",
      },
    ],
  },
  {
    id: "crypto",
    name: "Crypto payment",
    icon: "Bitcoin",
    description: "Wallet apps parse the URI and pre-fill the send screen.",
    fields: [
      {
        key: "coin",
        label: "Currency",
        type: "select",
        options: [
          { value: "BTC", label: "Bitcoin" },
          { value: "ETH", label: "Ethereum" },
        ],
      },
      { key: "address", label: "Wallet address", type: "text", required: true },
      {
        key: "amount",
        label: "Amount (optional)",
        type: "text",
        hint: "Leave blank to let the payer choose the amount.",
      },
    ],
  },
  {
    id: "app",
    name: "App download",
    icon: "Smartphone",
    description:
      "A link to your app's install page. Use a smart-link URL when possible so iOS and Android both route correctly.",
    fields: [
      {
        key: "url",
        label: "Smart link or store URL",
        type: "url",
        required: true,
        placeholder: "https://onelink.to/your-app",
      },
    ],
  },
];

export const QR_TYPES_BY_ID: Record<QrTypeId, QrType> = QR_TYPES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<QrTypeId, QrType>
);

// ── Encoders ──────────────────────────────────────────────────────────────

/**
 * URL encoder — accepts anything from "example.com" to
 * "mailto:x@y.z" and returns a scannable URI. Adds https:// if the
 * input has no scheme; passes existing schemes (mailto, tel, ftp, …)
 * through unchanged.
 */
export function encodeUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return t;
  return `https://${t}`;
}

/** Plain text — returned verbatim. Whitespace is meaningful (a leading
 *  space could distinguish two otherwise-identical codes) so we don't
 *  trim. */
export function encodeText(text: string): string {
  return text;
}

/** Backslash-escape the five chars the WIFI URI reserves. */
function escapeWifi(v: string): string {
  return v.replace(/([\\;,":])/g, "\\$1");
}

/**
 * WiFi — the widely-adopted Zebra Crossing format
 *   WIFI:T:<auth>;S:<ssid>;P:<password>;H:<hidden>;;
 * Auth is "WPA", "WEP", or "nopass". Hidden is only emitted as "true"
 * when the network is hidden; scanners treat a missing H field as
 * "not hidden".
 */
export function encodeWifi(fields: WifiFields): string {
  const enc = fields.encryption || "WPA";
  const ssid = escapeWifi(fields.ssid ?? "");
  const password = enc === "nopass" ? "" : escapeWifi(fields.password ?? "");
  const parts = [`T:${enc}`, `S:${ssid}`, `P:${password}`];
  if (fields.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

/** vCard 3.0 escape — commas, semicolons, backslashes, and newlines per
 *  RFC 6350 §3.4. Same rules as the business-card build. */
function escapeVcf(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * vCard 3.0 — universally accepted by iOS Contacts, Android Contacts,
 * Gmail, Outlook. We target 3.0 rather than 4.0 because 4.0 support
 * is still uneven across scanners.
 *
 * Only non-empty fields emit a line so a minimal vCard doesn't ship
 * a wall of blank properties that would inflate the QR payload
 * (larger payload → denser code → harder to scan).
 */
export function encodeVCard(fields: VCardFields): string {
  const first = escapeVcf(fields.firstName ?? "");
  const last = escapeVcf(fields.lastName ?? "");
  const fn = [fields.firstName, fields.lastName].filter(Boolean).join(" ").trim();
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  if (fn) lines.push(`FN:${escapeVcf(fn)}`);
  // N is structured: Family;Given;Additional;Prefix;Suffix
  if (first || last) lines.push(`N:${last};${first};;;`);
  if (fields.org?.trim()) lines.push(`ORG:${escapeVcf(fields.org)}`);
  if (fields.title?.trim()) lines.push(`TITLE:${escapeVcf(fields.title)}`);
  if (fields.phone?.trim()) lines.push(`TEL;TYPE=CELL:${fields.phone.trim()}`);
  if (fields.email?.trim()) lines.push(`EMAIL:${fields.email.trim()}`);
  if (fields.website?.trim()) lines.push(`URL:${encodeUrl(fields.website)}`);
  if (fields.address?.trim()) {
    // ADR structured: PostBox;Extended;Street;City;Region;PostalCode;Country
    // Users type one string — we drop it into the Street slot.
    lines.push(`ADR:;;${escapeVcf(fields.address)};;;;`);
  }
  lines.push("END:VCARD");
  return lines.join("\n");
}

/**
 * Email — RFC 6068 mailto: URI. Space is percent-encoded as %20 (not
 * "+", which is a mailto-specific gotcha; some mail clients don't
 * decode it correctly in the body/subject).
 */
export function encodeEmail(fields: EmailFields): string {
  const params: string[] = [];
  if (fields.subject) params.push(`subject=${encodeURIComponent(fields.subject)}`);
  if (fields.body) params.push(`body=${encodeURIComponent(fields.body)}`);
  const qs = params.join("&");
  return `mailto:${(fields.address ?? "").trim()}${qs ? `?${qs}` : ""}`;
}

/**
 * SMS — Zebra Crossing SMSTO format. Android natively handles this;
 * iOS falls back to the messages app once the user taps.
 */
export function encodeSms(fields: SmsFields): string {
  const phone = (fields.phone ?? "").replace(/[^+\d]/g, "");
  return fields.message ? `SMSTO:${phone}:${fields.message}` : `SMSTO:${phone}`;
}

/** tel: — RFC 3966. Strip formatting; keep + and digits. */
export function encodePhone(phone: string): string {
  return `tel:${(phone ?? "").replace(/[^+\d]/g, "")}`;
}

/**
 * WhatsApp — https://wa.me/<digits>?text=… . The phone number must be
 * digits only (no +, no spaces, no dashes) per WhatsApp's spec —
 * anything else opens the "Enter a phone number" screen instead of the
 * intended chat.
 */
export function encodeWhatsapp(fields: WhatsappFields): string {
  const phone = (fields.phone ?? "").replace(/[^\d]/g, "");
  const msg = fields.prefilledMessage
    ? `?text=${encodeURIComponent(fields.prefilledMessage)}`
    : "";
  return `https://wa.me/${phone}${msg}`;
}

/** iCalendar escape — the four reserved characters per RFC 5545. */
function escapeIcal(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Turn "YYYY-MM-DDTHH:mm" (datetime-local) into iCal "YYYYMMDDTHHMMSS".
 *  Emitted as floating local time (no Z) so the event lands on the
 *  wall-clock time the user typed, regardless of the recipient's TZ. */
function icalDate(dt: string): string {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/**
 * Calendar event — VEVENT block. Some scanners want the full VCALENDAR
 * envelope; iOS and modern Android accept the raw VEVENT. We ship the
 * envelope for maximum compatibility.
 */
export function encodeEvent(fields: EventFields): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UtilityApps//QR Generator//EN",
    "BEGIN:VEVENT",
  ];
  if (fields.title) lines.push(`SUMMARY:${escapeIcal(fields.title)}`);
  if (fields.location) lines.push(`LOCATION:${escapeIcal(fields.location)}`);
  const dtStart = icalDate(fields.startDate);
  const dtEnd = icalDate(fields.endDate);
  if (dtStart) lines.push(`DTSTART:${dtStart}`);
  if (dtEnd) lines.push(`DTEND:${dtEnd}`);
  if (fields.description)
    lines.push(`DESCRIPTION:${escapeIcal(fields.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\n");
}

/** geo: URI per RFC 5870. */
export function encodeGeo(fields: GeoFields): string {
  const lat = (fields.latitude ?? "").trim();
  const lng = (fields.longitude ?? "").trim();
  return `geo:${lat},${lng}`;
}

/**
 * Crypto payment URI. BTC uses BIP-21 (`bitcoin:<addr>?amount=<btc>`);
 * ETH uses a simplified `ethereum:<addr>?amount=<eth>` form —
 * strictly EIP-681 wants wei via `?value=`, but every major wallet
 * (Trust, MetaMask, Rainbow) also accepts the human-friendly
 * `?amount=<eth>` variant and it's what users type.
 */
export function encodeCrypto(fields: CryptoFields): string {
  const scheme = fields.coin === "ETH" ? "ethereum" : "bitcoin";
  const address = (fields.address ?? "").trim();
  const amount = (fields.amount ?? "").trim();
  const qs = amount ? `?amount=${encodeURIComponent(amount)}` : "";
  return `${scheme}:${address}${qs}`;
}

/** App download — treat the URL like any other URL. Smart-link handling
 *  (App Store vs Play Store routing) is done by the URL itself
 *  (`onelink.to`, `firebase.app.goo.gl`, or the app's landing page). */
export function encodeApp(url: string): string {
  return encodeUrl(url);
}

// ── Dispatch encoder ──────────────────────────────────────────────────────

/** Dispatch by type id — handy for the form component which stores the
 *  active type + values and just wants the string to feed the QR
 *  library. Falls back to encodeText for safety on an unknown type. */
export function encode(
  typeId: QrTypeId,
  values: Record<string, string | boolean | undefined>
): string {
  const s = (k: string): string =>
    typeof values[k] === "string" ? (values[k] as string) : "";
  switch (typeId) {
    case "url":
      return encodeUrl(s("url"));
    case "text":
      return encodeText(s("text"));
    case "wifi":
      return encodeWifi({
        ssid: s("ssid"),
        password: s("password"),
        encryption:
          (s("encryption") as WifiFields["encryption"]) || "WPA",
        hidden: Boolean(values.hidden),
      });
    case "vcard":
      return encodeVCard({
        firstName: s("firstName"),
        lastName: s("lastName"),
        org: s("org"),
        title: s("title"),
        phone: s("phone"),
        email: s("email"),
        website: s("website"),
        address: s("address"),
      });
    case "email":
      return encodeEmail({
        address: s("address"),
        subject: s("subject"),
        body: s("body"),
      });
    case "sms":
      return encodeSms({ phone: s("phone"), message: s("message") });
    case "phone":
      return encodePhone(s("phone"));
    case "whatsapp":
      return encodeWhatsapp({
        phone: s("phone"),
        prefilledMessage: s("prefilledMessage"),
      });
    case "event":
      return encodeEvent({
        title: s("title"),
        location: s("location"),
        startDate: s("startDate"),
        endDate: s("endDate"),
        description: s("description"),
      });
    case "geo":
      return encodeGeo({ latitude: s("latitude"), longitude: s("longitude") });
    case "crypto":
      return encodeCrypto({
        coin: (s("coin") as CryptoFields["coin"]) || "BTC",
        address: s("address"),
        amount: s("amount"),
      });
    case "app":
      return encodeApp(s("url"));
    default:
      return encodeText(String(values ?? ""));
  }
}

// ── Style presets ────────────────────────────────────────────────────────

/** Dot-shape kinds. Mirrors qr-code-styling's `dotsOptions.type`. */
export type DotStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

/** Corner square kind. Mirrors qr-code-styling's
 *  `cornersSquareOptions.type`. */
export type CornerStyle = "square" | "extra-rounded" | "dot";

export interface QrColors {
  /** Foreground — the dark modules of the code. */
  dark: string;
  /** Background — the light modules. Usually white / transparent. */
  light: string;
}

export interface QrStylePreset {
  id: string;
  name: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  colors: QrColors;
}

export const QR_STYLE_PRESETS: readonly QrStylePreset[] = [
  {
    id: "classic",
    name: "Classic",
    dotStyle: "square",
    cornerStyle: "square",
    colors: { dark: "#000000", light: "#FFFFFF" },
  },
  {
    id: "rounded",
    name: "Rounded",
    dotStyle: "rounded",
    cornerStyle: "extra-rounded",
    colors: { dark: "#111827", light: "#FFFFFF" },
  },
  {
    id: "dots",
    name: "Dots",
    dotStyle: "dots",
    cornerStyle: "dot",
    colors: { dark: "#0F172A", light: "#FFFFFF" },
  },
  {
    id: "elegant",
    name: "Elegant",
    dotStyle: "extra-rounded",
    cornerStyle: "extra-rounded",
    colors: { dark: "#1E293B", light: "#F8FAFC" },
  },
  {
    id: "sharp",
    name: "Sharp",
    dotStyle: "classy",
    cornerStyle: "square",
    colors: { dark: "#000000", light: "#FFFFFF" },
  },
];

export const QR_STYLE_PRESETS_BY_ID: Record<string, QrStylePreset> =
  QR_STYLE_PRESETS.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<string, QrStylePreset>
  );

// ── Error-correction levels ──────────────────────────────────────────────

/** QR error-correction level per ISO/IEC 18004. Passed to the QR
 *  library as this exact single-letter identifier. */
export type ErrorCorrectionId = "L" | "M" | "Q" | "H";

export interface ErrorCorrectionLevel {
  id: ErrorCorrectionId;
  name: string;
  /** Approximate share of the code that can be lost and still decode. */
  percent: number;
  description: string;
}

/**
 * Use `H` when a logo is embedded — the logo covers a chunk of the code
 * and the extra redundancy is what keeps it scannable. `M` is the
 * sensible default for logo-less codes; `L` is only worth it when the
 * payload is long enough that a lower level meaningfully reduces
 * density (crypto addresses, long URLs).
 */
export const ERROR_CORRECTION_LEVELS: readonly ErrorCorrectionLevel[] = [
  {
    id: "L",
    name: "Low",
    percent: 7,
    description:
      "~7% recovery. Smallest, densest code. Only use for long payloads on clean surfaces.",
  },
  {
    id: "M",
    name: "Medium",
    percent: 15,
    description:
      "~15% recovery. Sensible default when no logo is embedded.",
  },
  {
    id: "Q",
    name: "Quartile",
    percent: 25,
    description:
      "~25% recovery. Reliable in print, on stickers, or on textured surfaces.",
  },
  {
    id: "H",
    name: "High",
    percent: 30,
    description:
      "~30% recovery. Required when embedding a logo — the logo covers part of the code and the redundancy is what keeps it scannable.",
  },
];

export const ERROR_CORRECTION_LEVELS_BY_ID: Record<
  ErrorCorrectionId,
  ErrorCorrectionLevel
> = ERROR_CORRECTION_LEVELS.reduce(
  (acc, l) => {
    acc[l.id] = l;
    return acc;
  },
  {} as Record<ErrorCorrectionId, ErrorCorrectionLevel>
);

/** Recommended default level for a given "has logo?" toggle. */
export function recommendedErrorCorrection(hasLogo: boolean): ErrorCorrectionId {
  return hasLogo ? "H" : "M";
}
