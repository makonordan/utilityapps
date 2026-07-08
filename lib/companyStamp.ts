/**
 * Data + utilities for the Company Stamp Generator tool at
 * /tools/company-stamp-generator.
 *
 * Pure TypeScript. No React, no browser APIs, no 'use client'.
 * Imported by both the server (metadata, structured data) and the
 * client (form + canvas/SVG preview + PNG/SVG export).
 *
 * ── Scope, on purpose ──
 *
 * This file only ships presets and wording for LEGITIMATE internal
 * business document marking and decorative company seals: things
 * like APPROVED, PAID, RECEIVED, DRAFT. It deliberately does NOT
 * include (and must never gain) presets or wording that imitate an
 * official third-party authentication mark — "NOTARY PUBLIC",
 * "CERTIFIED TRUE COPY" issued by an authority, government
 * department seals, court seals, apostille/embassy seals, bank
 * endorsement stamps, tax-authority seals, or coat-of-arms style
 * emblems. Those all imply a legal verification this tool cannot
 * and should not manufacture. Keep new presets inside the
 * "stamped a document I own" use case, not the "forged an official
 * seal" one.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type StampShape = "round" | "rectangle" | "oval";

/** How the date line under the center text is handled. 'blank-line'
 *  prints an underscore rule for the user to fill in by hand after
 *  printing — the common look for real ink stamps. 'fixed' bakes in
 *  a specific date string. */
export type DateMode = "none" | "blank-line" | "fixed";

export type TextureStyle = "clean" | "rubber-worn" | "vintage";

export interface StampData {
  shape: StampShape;
  /** Curved text along the top arc (round/oval), e.g. company name. */
  topText: string;
  /** Curved text along the bottom arc (round/oval), e.g. city / est. year. */
  bottomText: string;
  /** Main text, e.g. "APPROVED". */
  centerText: string;
  /** Small line under the center text, e.g. a date field label. */
  centerSubText: string;
  dateMode: DateMode;
  fixedDate: string;
  /** Small ★ separators between top and bottom text (round layout). */
  starSeparators: boolean;
  /** Single ink hex color used for the whole stamp. */
  color: string;
  borderStyle: "single" | "double" | "dashed" | "rope" | "none";
  borderWidth: number;
  /** CSS font stack — see STAMP_FONTS. */
  fontFamily: string;
  textureStyle: TextureStyle;
  /** Degrees of tilt applied to the whole stamp for a natural, hand-stamped look. */
  rotation: number;
  /** Export size in pixels (square canvas the stamp is centered in). */
  sizePx: number;
}

// ── Presets ───────────────────────────────────────────────────────────────
//
// Every preset here is a legitimate internal business-marking stamp
// or a generic decorative company seal. Do NOT add notary,
// government, bank, court, or certification-authority presets.

export interface StampPreset {
  id: string;
  label: string;
  shape: StampShape;
  centerText: string;
  suggestedColor: string;
  /** Only set on presets that use the curved top/bottom arcs (e.g. the
   *  generic Company Seal). Left undefined for plain rectangle stamps. */
  topText?: string;
  bottomText?: string;
  centerSubText?: string;
  starSeparators?: boolean;
  dateMode?: DateMode;
}

export const STAMP_PRESETS: readonly StampPreset[] = [
  {
    id: "approved",
    label: "Approved",
    shape: "round",
    centerText: "APPROVED",
    suggestedColor: "#1B7A3D",
    dateMode: "blank-line",
  },
  {
    id: "paid",
    label: "Paid",
    shape: "round",
    centerText: "PAID",
    suggestedColor: "#C1272D",
    dateMode: "blank-line",
  },
  {
    id: "received",
    label: "Received",
    shape: "rectangle",
    centerText: "RECEIVED",
    suggestedColor: "#1F4E8C",
    dateMode: "blank-line",
  },
  {
    id: "draft",
    label: "Draft",
    shape: "rectangle",
    centerText: "DRAFT",
    suggestedColor: "#6B7280",
    dateMode: "none",
  },
  {
    id: "confidential",
    label: "Confidential",
    shape: "rectangle",
    centerText: "CONFIDENTIAL",
    suggestedColor: "#C1272D",
    dateMode: "none",
  },
  {
    id: "copy",
    label: "Copy",
    shape: "rectangle",
    centerText: "COPY",
    suggestedColor: "#1F4E8C",
    dateMode: "none",
  },
  {
    id: "original",
    label: "Original",
    shape: "rectangle",
    centerText: "ORIGINAL",
    suggestedColor: "#1B7A3D",
    dateMode: "none",
  },
  {
    id: "void",
    label: "Void",
    shape: "rectangle",
    centerText: "VOID",
    suggestedColor: "#C1272D",
    dateMode: "none",
  },
  {
    id: "urgent",
    label: "Urgent",
    shape: "rectangle",
    centerText: "URGENT",
    suggestedColor: "#C1272D",
    dateMode: "none",
  },
  {
    id: "for-deposit-only",
    label: "For Deposit Only",
    shape: "rectangle",
    centerText: "FOR DEPOSIT ONLY",
    suggestedColor: "#1F4E8C",
    dateMode: "none",
  },
  {
    id: "sample",
    label: "Sample",
    shape: "rectangle",
    centerText: "SAMPLE",
    suggestedColor: "#6B7280",
    dateMode: "none",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    shape: "rectangle",
    centerText: "CANCELLED",
    suggestedColor: "#C1272D",
    dateMode: "none",
  },
  {
    id: "posted",
    label: "Posted",
    shape: "round",
    centerText: "POSTED",
    suggestedColor: "#1F4E8C",
    dateMode: "blank-line",
  },
  {
    id: "entered",
    label: "Entered",
    shape: "round",
    centerText: "ENTERED",
    suggestedColor: "#1B7A3D",
    dateMode: "blank-line",
  },
  {
    id: "reviewed",
    label: "Reviewed",
    shape: "round",
    centerText: "REVIEWED",
    suggestedColor: "#6B2C91",
    dateMode: "blank-line",
  },
  {
    id: "company-seal",
    label: "Company Seal",
    shape: "round",
    centerText: "★",
    centerSubText: "",
    topText: "YOUR COMPANY NAME",
    bottomText: "EST. 2020",
    starSeparators: true,
    suggestedColor: "#1A1A1A",
    dateMode: "none",
  },
] as const;

/** Convenience lookup — presets are frequently accessed by id from
 *  form state and the preset picker. */
export const STAMP_PRESETS_BY_ID: Record<string, StampPreset> =
  STAMP_PRESETS.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<string, StampPreset>
  );

// ── Colors ────────────────────────────────────────────────────────────────

export interface StampColor {
  id: string;
  label: string;
  hex: string;
}

/** Common stamp-pad ink colors. */
export const STAMP_COLORS: readonly StampColor[] = [
  { id: "red", label: "Red", hex: "#C1272D" },
  { id: "blue", label: "Blue", hex: "#1F4E8C" },
  { id: "black", label: "Black", hex: "#1A1A1A" },
  { id: "green", label: "Green", hex: "#1B7A3D" },
  { id: "purple", label: "Purple", hex: "#6B2C91" },
] as const;

// ── Fonts ─────────────────────────────────────────────────────────────────

export interface StampFont {
  id: string;
  label: string;
  /** Full CSS font-family stack, ready to drop into a `font-family` value. */
  cssStack: string;
}

/** Bold, stamp-appropriate web-safe fonts — no light/thin weights,
 *  since stamp ink doesn't render fine detail well. */
export const STAMP_FONTS: readonly StampFont[] = [
  {
    id: "arial-bold",
    label: "Arial Bold",
    cssStack: "'Arial Black', Arial, Helvetica, sans-serif",
  },
  {
    id: "impact",
    label: "Impact",
    cssStack: "Impact, 'Arial Narrow Bold', sans-serif",
  },
  {
    id: "georgia-bold",
    label: "Georgia Bold",
    cssStack: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "courier-bold",
    label: "Courier Bold",
    cssStack: "'Courier New', Courier, monospace",
  },
  {
    id: "trebuchet-bold",
    label: "Trebuchet Bold",
    cssStack: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
  },
] as const;

// ── Ink textures ──────────────────────────────────────────────────────────
//
// Describes how each texture modifies the rendered ink — implemented
// later via SVG filters (feTurbulence + feDisplacementMap for
// roughness, plain opacity for fade). Kept as plain numeric params
// here so the renderer has a single source of truth.

export interface StampTexture {
  id: TextureStyle;
  label: string;
  description: string;
  /** Overall ink opacity, 0–1. Real stamps are never fully opaque. */
  opacity: number;
  /** feTurbulence baseFrequency — higher = finer, grainier noise. 0 = no roughness filter. */
  roughness: number;
  /** feDisplacementMap scale — higher = more distorted/broken edges. */
  displacementScale: number;
}

export const STAMP_TEXTURES: readonly StampTexture[] = [
  {
    id: "clean",
    label: "Clean",
    description:
      "Crisp, fully-inked look with no distortion — a fresh stamp pad on smooth paper.",
    opacity: 1,
    roughness: 0,
    displacementScale: 0,
  },
  {
    id: "rubber-worn",
    label: "Rubber Worn",
    description:
      "Slightly uneven ink coverage with light edge roughness, like a well-used rubber stamp pressed by hand.",
    opacity: 0.85,
    roughness: 0.15,
    displacementScale: 2.5,
  },
  {
    id: "vintage",
    label: "Vintage",
    description:
      "Faded, worn ink with heavier grain and broken edges, like an old stamp on aged paper.",
    opacity: 0.65,
    roughness: 0.35,
    displacementScale: 5,
  },
] as const;

export const STAMP_TEXTURES_BY_ID: Record<TextureStyle, StampTexture> =
  STAMP_TEXTURES.reduce(
    (acc, t) => {
      acc[t.id] = t;
      return acc;
    },
    {} as Record<TextureStyle, StampTexture>
  );

// ── UI disclaimer ────────────────────────────────────────────────────────
//
// Single source of truth for the persistent disclaimer the tool's UI
// must display. Keep this in sync with what's actually rendered.

export const STAMP_DISCLAIMER =
  "For internal business document marking and decorative use only. Do not use to imitate official, notary, government, or bank seals, or to misrepresent authentication or approval you are not authorized to give.";
