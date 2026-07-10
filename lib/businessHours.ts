/**
 * Data + constants for the Business Hours Sign Generator tool at
 * /tools/business-hours-sign.
 *
 * This file is pure TypeScript — no React, no browser APIs, no client
 * directive. It's imported by both server (metadata, structured data) and
 * client (form + preview) code, and by the PDF (jspdf) and image
 * (html2canvas) exporters, so all of them agree on the same open/closed
 * math and the same template/paper-size/font options.
 *
 * Everything here runs 100% in the browser. There is no auth, no
 * database, and no server round-trip — a business's hours and branding
 * never leave the device.
 */

export {
  DEFAULT_FONT,
  DOC_SAFE_FONTS,
  DOC_SAFE_FONTS_BY_NAME,
  type DocSafeFont,
} from "./letterhead";

// ── Sign sizes ───────────────────────────────────────────────────────────

export type SignSizeId = "a4" | "letter" | "a5" | "square";

export interface SignSizeDefinition {
  id: SignSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  /** Pixel width at 96 DPI: widthMm / 25.4 * 96, rounded. Used for the
   *  on-screen preview and as the base resolution for the PNG export
   *  (the exporter applies its own upscale on top of this). */
  widthPx: number;
  /** Pixel height at 96 DPI: heightMm / 25.4 * 96, rounded. */
  heightPx: number;
  description: string;
}

/** 96 DPI is the standard CSS pixel density — matches what browsers use
 *  for `px` and what html2canvas renders at by default. */
function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * 96);
}

function signSize(
  id: SignSizeId,
  name: string,
  widthMm: number,
  heightMm: number,
  description: string
): SignSizeDefinition {
  return { id, name, widthMm, heightMm, widthPx: mmToPx(widthMm), heightPx: mmToPx(heightMm), description };
}

export const SIGN_SIZES: SignSizeDefinition[] = [
  signSize("a4", "A4", 210, 297, "Standard printable sign, worldwide"),
  signSize("letter", "US Letter", 215.9, 279.4, "Standard printable sign, US/Canada"),
  signSize("a5", "A5", 148, 210, "Half-page — a smaller printed or window sign"),
  signSize("square", "Square", 200, 200, "1:1 — a social media post or a door/window sticker"),
];

export const SIGN_SIZES_BY_ID: Record<SignSizeId, SignSizeDefinition> = SIGN_SIZES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SignSizeId, SignSizeDefinition>
);

export const DEFAULT_SIGN_SIZE: SignSizeId = "a4";

/** Sign padding as a fraction of width/height rather than an absolute
 *  pixel value — the live preview renders at a modest on-screen card
 *  size while the PDF exporter draws at the paper's real mm dimensions,
 *  so a shared fraction (each side multiplies by its own width/height)
 *  keeps the margin visually identical at any resolution without the
 *  two needing to agree on a pixel scale. */
export const SIGN_PADDING_X_FRACTION = 0.08;
export const SIGN_PADDING_Y_FRACTION = 0.06;

// ── Templates ────────────────────────────────────────────────────────────

export type TemplateId = "classic-list" | "modern-card" | "bold-open-closed" | "elegant";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic-list",
    name: "Classic List",
    description:
      "A simple day-by-day list of hours under the business name — the most traditional printed sign layout.",
  },
  {
    id: "modern-card",
    name: "Modern Card",
    description: "A rounded card with a colored header band, logo, and a clean two-column hours table.",
  },
  {
    id: "bold-open-closed",
    name: "Bold Open/Closed",
    description:
      "A large OPEN or CLOSED status fills the top of the sign, with the full hours list smaller below it.",
  },
  {
    id: "elegant",
    name: "Elegant",
    description:
      "A centered, minimal layout with generous whitespace — reads like a boutique or restaurant sign.",
  },
];

export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TemplateId, TemplateDefinition>
);

export const DEFAULT_TEMPLATE: TemplateId = "classic-list";

// ── Days & hours ─────────────────────────────────────────────────────────

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

/** Monday-first — the order every day-by-day sign is displayed in,
 *  regardless of JS's Sunday-first Date.getDay(). */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DAY_LABELS_SHORT: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export interface DayHours {
  day: DayOfWeek;
  isOpen: boolean;
  /** 24-hour "HH:mm" string, e.g. "09:00". Ignored when isOpen is false. */
  openTime: string;
  /** 24-hour "HH:mm" string, e.g. "17:00". Ignored when isOpen is false. */
  closeTime: string;
  /** Optional note shown next to the day, e.g. "Lunch break 12–1". */
  note: string;
}

/** A weekday-open, weekend-closed default for a single day — used to seed
 *  a fresh week and as the fallback shape when a preset doesn't specify
 *  a day explicitly. */
export function defaultDayHours(day: DayOfWeek): DayHours {
  const isWeekend = day === "saturday" || day === "sunday";
  return { day, isOpen: !isWeekend, openTime: "09:00", closeTime: "17:00", note: "" };
}

/** A full Monday–Sunday week using defaultDayHours for each day. */
export function defaultWeek(): DayHours[] {
  return DAYS_OF_WEEK.map(defaultDayHours);
}

// ── Quick presets ────────────────────────────────────────────────────────

export type PresetId = "weekday-9-5" | "everyday-8-8" | "retail";

export interface PresetDefinition {
  id: PresetId;
  name: string;
  description: string;
}

export const PRESETS: PresetDefinition[] = [
  { id: "weekday-9-5", name: "Mon–Fri, 9–5", description: "Weekdays 9:00 AM–5:00 PM. Closed Saturday and Sunday." },
  { id: "everyday-8-8", name: "7 days, 8–8", description: "Open every day, 8:00 AM–8:00 PM." },
  { id: "retail", name: "Retail hours", description: "Mon–Sat 10:00 AM–7:00 PM. Sunday 11:00 AM–5:00 PM." },
];

/** Builds a full week of DayHours for a given preset. Returns a fresh
 *  array each call so callers can safely mutate the result. */
export function applyPreset(id: PresetId): DayHours[] {
  switch (id) {
    case "weekday-9-5":
      return DAYS_OF_WEEK.map((day) => ({
        day,
        isOpen: day !== "saturday" && day !== "sunday",
        openTime: "09:00",
        closeTime: "17:00",
        note: "",
      }));
    case "everyday-8-8":
      return DAYS_OF_WEEK.map((day) => ({
        day,
        isOpen: true,
        openTime: "08:00",
        closeTime: "20:00",
        note: "",
      }));
    case "retail":
      return DAYS_OF_WEEK.map((day) => ({
        day,
        isOpen: true,
        openTime: day === "sunday" ? "11:00" : "10:00",
        closeTime: day === "sunday" ? "17:00" : "19:00",
        note: "",
      }));
    default:
      return defaultWeek();
  }
}

// ── Business hours data ──────────────────────────────────────────────────

/** 'auto' computes open/closed from `days` and the current time (see
 *  computeOpenStatus). 'open'/'closed' pin the badge regardless of the
 *  clock — useful for a business that wants to flip a sign manually
 *  rather than trust device clocks. 'hidden' omits the badge entirely. */
export type CurrentStatusMode = "auto" | "open" | "closed" | "hidden";

export const DEFAULT_STATUS_MODE: CurrentStatusMode = "auto";
export const DEFAULT_HEADER_TEXT = "Business Hours";

export interface BusinessHoursData {
  businessName: string;
  tagline: string;
  /** Public URL to an uploaded/hosted logo. */
  logoUrl: string;
  /** One entry per day of the week — see DAYS_OF_WEEK for order. */
  days: DayHours[];
  currentStatusMode: CurrentStatusMode;
  /** e.g. "Business Hours" / "Hours of Operation" / "Opening Times". */
  headerText: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  /** Must be one of DOC_SAFE_FONTS[].name (re-exported above). */
  font: string;
  paperSize: SignSizeId;
  template: TemplateId;
}

// ── Open/closed status ───────────────────────────────────────────────────

export interface OpenStatus {
  isOpenNow: boolean;
  /** Human-readable description of the next transition, e.g.
   *  "Closes at 5:00 PM" or "Opens tomorrow at 9:00 AM". */
  nextChange: string;
}

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** "09:00" -> "9:00 AM". Shared by the live preview and the exporters so
 *  displayed times read the same everywhere regardless of the 24-hour
 *  strings stored in DayHours. */
export function formatTime12h(time: string): string {
  const minutes = parseMinutes(time);
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** JS's Date.getDay() is Sunday-first (0-6); DAYS_OF_WEEK is Monday-first
 *  to match how the sign displays. This bridges the two. */
function jsDayToDayOfWeek(jsDay: number): DayOfWeek {
  const order: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return order[jsDay];
}

/** Determines whether the business is open right now, and describes the
 *  next transition (closing time if open, opening time if closed) — used
 *  for 'auto' currentStatusMode and the optional "Open Now" badge. Pure
 *  function of `days` and `now` so the preview and exporters compute an
 *  identical answer given the same inputs. */
export function computeOpenStatus(days: DayHours[], now: Date = new Date()): OpenStatus {
  const byDay = new Map(days.map((d) => [d.day, d] as const));
  const currentDay = jsDayToDayOfWeek(now.getDay());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const today = byDay.get(currentDay);
  if (today?.isOpen) {
    const openMin = parseMinutes(today.openTime);
    const closeMin = parseMinutes(today.closeTime);
    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      return { isOpenNow: true, nextChange: `Closes at ${formatTime12h(today.closeTime)}` };
    }
    if (currentMinutes < openMin) {
      return { isOpenNow: false, nextChange: `Opens at ${formatTime12h(today.openTime)}` };
    }
  }

  // Not open right now — walk forward through the week (starting
  // tomorrow, wrapping past Sunday back to Monday) for the next open day.
  const currentIndex = DAYS_OF_WEEK.indexOf(currentDay);
  for (let offset = 1; offset <= 7; offset++) {
    const day = DAYS_OF_WEEK[(currentIndex + offset) % 7];
    const entry = byDay.get(day);
    if (entry?.isOpen) {
      const label = offset === 1 ? "tomorrow" : DAY_LABELS[day];
      return { isOpenNow: false, nextChange: `Opens ${label} at ${formatTime12h(entry.openTime)}` };
    }
  }

  return { isOpenNow: false, nextChange: "Closed — no hours set" };
}
