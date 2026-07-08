/**
 * Data + constants for the Letterhead Generator tool at
 * /tools/letterhead-generator.
 *
 * This file is pure TypeScript — no React, no browser APIs, no client
 * directive. It's imported by both server (metadata, structured data) and
 * client (form + preview) code, and by three follow-up exporters (PDF via
 * jspdf, Word via docx, image via html2canvas) that all need to agree on
 * the same paper dimensions and the same normalized header/footer layout
 * so a letterhead looks identical regardless of which format the user
 * downloads.
 *
 * Everything here runs 100% in the browser. There is no auth, no
 * database, and no server round-trip — a user's logo, address, and
 * branding never leave their device.
 */

// ── Paper sizes ──────────────────────────────────────────────────────────

export type PaperSizeId = "a4" | "letter" | "legal" | "a5" | "executive" | "b5";

export interface PaperSizeDefinition {
  id: PaperSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  /** Pixel width at 96 DPI: widthMm / 25.4 * 96, rounded. Used for the
   *  on-screen preview and the PNG export. */
  widthPx: number;
  /** Pixel height at 96 DPI: heightMm / 25.4 * 96, rounded. */
  heightPx: number;
  description: string;
}

/** 96 DPI is the standard CSS pixel density — matches what browsers use
 *  for `px` and what html2canvas renders at by default. Exported because
 *  the Word exporter needs it too: docx's ImageRun `transformation`
 *  width/height are interpreted as pixels at the same 96 DPI mapping. */
export function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * 96);
}

function paperSize(
  id: PaperSizeId,
  name: string,
  widthMm: number,
  heightMm: number,
  description: string
): PaperSizeDefinition {
  return {
    id,
    name,
    widthMm,
    heightMm,
    widthPx: mmToPx(widthMm),
    heightPx: mmToPx(heightMm),
    description,
  };
}

export const PAPER_SIZES: PaperSizeDefinition[] = [
  paperSize("a4", "A4", 210, 297, "Standard worldwide"),
  paperSize("letter", "US Letter", 215.9, 279.4, "Standard US/Canada"),
  paperSize("legal", "US Legal", 215.9, 355.6, "Longer than Letter — contracts, legal filings"),
  paperSize("a5", "A5", 148, 210, "Half-page / notes"),
  paperSize("executive", "Executive", 184.15, 266.7, "Compact business format"),
  paperSize("b5", "B5", 176, 250, "Between A4 and A5"),
];

export const PAPER_SIZES_BY_ID: Record<PaperSizeId, PaperSizeDefinition> = PAPER_SIZES.reduce(
  (acc, size) => {
    acc[size.id] = size;
    return acc;
  },
  {} as Record<PaperSizeId, PaperSizeDefinition>
);

export const DEFAULT_PAPER_SIZE: PaperSizeId = "a4";

/** Page margin used by the live preview, the hidden full-resolution
 *  render captured for the PNG export, and (converted to mm) the Word
 *  and PDF exporters — one shared formula so the visible margin is the
 *  same in all three output formats. */
export function pagePadding(paper: PaperSizeDefinition): { paddingX: number; paddingY: number } {
  return {
    paddingX: Math.round(paper.widthPx * 0.08),
    paddingY: Math.round(paper.heightPx * 0.06),
  };
}

// ── Templates ────────────────────────────────────────────────────────────

export type TemplateId =
  | "classic-centered"
  | "left-aligned"
  | "modern-band"
  | "minimal"
  | "corporate-split"
  | "elegant-footer";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  /** Whether contact details are carried mainly in the footer region
   *  ("primary" — minimal's tiny footer, elegant-footer's detail block)
   *  or the footer is just an optional extra line under an
   *  already-complete header ("optional" — every other template). This
   *  drives how buildFooterModel weights what goes into the footer vs
   *  the header. */
  footerRole: "optional" | "primary";
  /** Inline SVG markup (as a string) previewing the layout on a
   *  100×140 page (matches the A4/Letter portrait ratio), self-contained,
   *  safe to render via dangerouslySetInnerHTML. Uses a fixed accent so
   *  the preview reads the same regardless of the user's chosen colors —
   *  only the live preview reflects primaryColor/accentColor. */
  thumbnail: string;
}

const THUMB_ACCENT = "#3B82F6";
const THUMB_HEADING = "#374151";
const THUMB_MUTED = "#9CA3AF";
const THUMB_BLOCK = "#D1D5DB";
const THUMB_BG = "#F3F4F6";
const THUMB_PAGE = "#FFFFFF";
const THUMB_BORDER = "#E5E7EB";

/** Wrap a template's inner shapes in a shared 100×140 page envelope
 *  (matches the A4/Letter portrait aspect ratio) so every thumbnail is
 *  exactly the same size and reads as a miniature page. */
function thumb(inner: string): string {
  return (
    `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
    `<rect x="0" y="0" width="100" height="140" fill="${THUMB_PAGE}" stroke="${THUMB_BORDER}" stroke-width="1"/>` +
    inner +
    `</svg>`
  );
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic-centered",
    name: "Classic Centered",
    description:
      "Logo centered at the top, company name below it, contact details in a thin line under a horizontal rule. The most traditional letterhead layout.",
    footerRole: "optional",
    thumbnail: thumb(
      `<circle cx="50" cy="18" r="8" fill="${THUMB_BLOCK}"/>` +
        `<rect x="30" y="32" width="40" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<line x1="15" y1="44" x2="85" y2="44" stroke="${THUMB_ACCENT}" stroke-width="1"/>` +
        `<rect x="25" y="49" width="50" height="3" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "left-aligned",
    name: "Left Aligned",
    description:
      "Logo top-left, contact block top-right, an accent rule beneath. A clean, modern default that reads well at a glance.",
    footerRole: "optional",
    thumbnail: thumb(
      `<rect x="8" y="8" width="16" height="16" rx="2" fill="${THUMB_BLOCK}"/>` +
        `<rect x="60" y="9" width="32" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="60" y="15" width="26" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="60" y="21" width="30" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<line x1="8" y1="30" x2="92" y2="30" stroke="${THUMB_ACCENT}" stroke-width="1.5"/>`
    ),
  },
  {
    id: "modern-band",
    name: "Modern Band",
    description:
      "A colored band across the top carries the logo and company name in reversed (white) text, with contact details below. Bold and brand-forward.",
    footerRole: "optional",
    thumbnail: thumb(
      `<rect x="0" y="0" width="100" height="22" fill="${THUMB_ACCENT}"/>` +
        `<rect x="8" y="6" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.9"/>` +
        `<rect x="22" y="8" width="45" height="6" rx="1" fill="#FFFFFF"/>` +
        `<rect x="8" y="30" width="55" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="8" y="36" width="46" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="8" y="42" width="50" height="3" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "A small logo and the company name only up top — nothing else competes for attention. Contact info lives in a tiny footer line.",
    footerRole: "primary",
    thumbnail: thumb(
      `<rect x="8" y="8" width="8" height="8" rx="1" fill="${THUMB_BLOCK}"/>` +
        `<rect x="20" y="9.5" width="45" height="5" rx="1" fill="${THUMB_HEADING}"/>` +
        `<line x1="8" y1="128" x2="92" y2="128" stroke="${THUMB_BLOCK}" stroke-width="0.75"/>` +
        `<rect x="8" y="132" width="62" height="3" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "corporate-split",
    name: "Corporate Split",
    description:
      "Logo on the left, company name and tagline centered, contact details on the right, beneath a double rule. Balanced and formal.",
    footerRole: "optional",
    thumbnail: thumb(
      `<rect x="8" y="10" width="14" height="14" rx="2" fill="${THUMB_BLOCK}"/>` +
        `<rect x="32" y="10" width="36" height="5" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="36" y="17" width="28" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="72" y="9" width="20" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="72" y="15" width="20" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="72" y="21" width="20" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<line x1="8" y1="32" x2="92" y2="32" stroke="${THUMB_ACCENT}" stroke-width="1"/>` +
        `<line x1="8" y1="35" x2="92" y2="35" stroke="${THUMB_BLOCK}" stroke-width="0.75"/>`
    ),
  },
  {
    id: "elegant-footer",
    name: "Elegant Footer",
    description:
      "A clean, uncluttered header with just the logo and company name. Most detail — address, phone, email, website, registration number — lives in a styled footer band.",
    footerRole: "primary",
    thumbnail: thumb(
      `<rect x="8" y="8" width="12" height="12" rx="2" fill="${THUMB_BLOCK}"/>` +
        `<rect x="24" y="10.5" width="45" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="0" y="112" width="100" height="28" fill="${THUMB_BG}"/>` +
        `<line x1="0" y1="112" x2="100" y2="112" stroke="${THUMB_ACCENT}" stroke-width="1.5"/>` +
        `<rect x="8" y="118" width="50" height="2.5" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="8" y="123" width="42" height="2.5" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="8" y="128" width="46" height="2.5" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="8" y="133" width="38" height="2.5" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
];

export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TemplateId, TemplateDefinition>
);

export const DEFAULT_TEMPLATE: TemplateId = "classic-centered";

// ── Doc-safe fonts ───────────────────────────────────────────────────────

export interface DocSafeFont {
  /** Human-friendly name shown in the font picker, and the exact font
   *  name written into the generated .docx (must match a font Word
   *  resolves without substitution). */
  name: string;
  /** Full CSS font-family stack for the browser preview/PDF/PNG. Includes
   *  fallbacks so rendering stays sane even if the primary isn't
   *  installed on the machine doing the rendering. */
  stack: string;
}

/** Fonts guaranteed to exist both as a browser web-safe font AND as a
 *  built-in Word font, so the live preview, the PDF, and the editable
 *  .docx all render with the same typeface — no substitution surprises
 *  when a user opens the Word file on a different machine. */
export const DOC_SAFE_FONTS: DocSafeFont[] = [
  { name: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { name: "Calibri", stack: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" },
  { name: "Times New Roman", stack: "'Times New Roman', Times, serif" },
  { name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  {
    name: "Garamond",
    stack: "Garamond, Baskerville, 'Baskerville Old Face', 'Times New Roman', serif",
  },
  { name: "Cambria", stack: "Cambria, Georgia, serif" },
];

export const DOC_SAFE_FONTS_BY_NAME: Record<string, DocSafeFont> = DOC_SAFE_FONTS.reduce(
  (acc, font) => {
    acc[font.name] = font;
    return acc;
  },
  {} as Record<string, DocSafeFont>
);

/** Default when the user hasn't picked yet — Arial is the safest default
 *  because it's a true built-in on every Word install and every OS. */
export const DEFAULT_FONT = DOC_SAFE_FONTS[0].name;

// ── Letterhead data ──────────────────────────────────────────────────────

export interface LetterheadData {
  companyName: string;
  tagline: string;
  /** Public URL to an uploaded/hosted logo. */
  logoUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  /** Company registration / tax ID. Optional. */
  registrationNumber: string;
  /** Optional footer line(s), e.g. a slogan or legal footer text. */
  footerText: string;
  showFooter: boolean;
  /** Hex color used for accents, rules, and (on modern-band) the header
   *  background. */
  primaryColor: string;
  /** Secondary hex color used for supporting accents. */
  accentColor: string;
  /** Must be one of DOC_SAFE_FONTS[].name. */
  font: string;
  template: TemplateId;
  paperSize: PaperSizeId;
  /** When true, the preview/export includes sample "letter body" text so
   *  users can see how their letterhead looks with actual content on it. */
  includeBodyPlaceholder: boolean;
}

/** Contact line shown on one row: "phone   ·   email   ·   website",
 *  skipping any that are empty. Shared by the live preview and the
 *  Word/PDF exporters so all three read identically. */
export function formatContactLine(data: LetterheadData): string {
  return [data.phone, data.email, data.website].filter(Boolean).join("   ·   ");
}

/** Address broken into up to three display lines: line 1, line 2 (if
 *  present), then "city, state/region postal code, country" collapsed
 *  onto one line with empty parts dropped. */
export function formatAddressLines(data: LetterheadData): string[] {
  const cityRow = [data.city, data.stateRegion, data.postalCode].filter(Boolean).join(", ");
  return [data.addressLine1, data.addressLine2, [cityRow, data.country].filter(Boolean).join(", ")].filter(
    Boolean
  );
}

// ── Normalized header/footer model ──────────────────────────────────────
//
// All three exporters (PDF via jspdf, Word via docx, image via
// html2canvas) are meant to look like the same letterhead. The Word and
// PDF exporters render from this shared, framework-agnostic model instead
// of each re-implementing per-template layout logic. The PNG exporter
// takes a different, equally valid route to the same consistency: it
// captures the actual live-preview DOM (which is built from this same
// LetterheadData + TEMPLATES definitions) via html2canvas, so it stays in
// sync automatically rather than needing a third from-scratch renderer.
//
// A row is one horizontal band of the header or footer. A row holds one
// or more columns laid left-to-right (e.g. a logo column beside a
// contact-details column); a column can stack a logo above its text
// (`layout: "stack"`, used for centered letterhead-style headers) or set
// it beside its text (`layout: "inline"`, logo-then-name on one line).

export type HFAlign = "left" | "center" | "right";

export interface HeaderFooterTextBlock {
  text: string;
  /** Points — shared unit. docx uses half-points (size * 2); jsPDF's
   *  setFontSize takes points directly regardless of document unit. */
  size: number;
  color: string;
  align: HFAlign;
  bold?: boolean;
}

export interface HeaderFooterLogo {
  url: string;
  /** Target rendered height in millimeters — a physical unit both
   *  exporters convert from: mmToPx() for docx (pixel-based image
   *  transformation), used directly for jsPDF (mm-unit document). */
  heightMm: number;
}

export interface HeaderFooterRule {
  color: string;
  /** Points. */
  thickness: number;
}

export interface HeaderFooterColumn {
  align: HFAlign;
  /** Relative width weight when a row has more than one column. Ignored
   *  on single-column rows, which always span the full content width. */
  width?: number;
  logo?: HeaderFooterLogo | null;
  /** "stack" = logo above text (centered letterhead header). "inline" =
   *  logo beside text, vertically aligned (band/minimal/footer headers). */
  layout?: "stack" | "inline";
  textBlocks: HeaderFooterTextBlock[];
}

export interface HeaderFooterRow {
  columns: HeaderFooterColumn[];
  /** Fill behind the whole row — the modern-band strip, the
   *  elegant-footer shaded band. Null/undefined = transparent. */
  background?: string | null;
  /** Rule drawn along the bottom edge of the row. A row with no columns
   *  and only a ruleBelow renders as a standalone divider line. */
  ruleBelow?: HeaderFooterRule | null;
  /** Extra vertical space, in points, before/after the row. */
  spaceBeforePt?: number;
  spaceAfterPt?: number;
}

export interface HeaderFooterModel {
  rows: HeaderFooterRow[];
}

function tb(text: string, size: number, color: string, align: HFAlign, bold = false): HeaderFooterTextBlock {
  return { text, size, color, align, bold };
}

const HEADING_COLOR = "#111827";
const MUTED_COLOR = "#6B7280";
const FOOTER_MUTED_COLOR = "#4B5563";
const RULE_MUTED_COLOR = "#D1D5DB";

/** Build the normalized header layout for a given template + data. */
export function buildHeaderModel(data: LetterheadData): HeaderFooterModel {
  const name = data.companyName.trim() || "Your Company Name";
  const addr = formatAddressLines(data);
  const contact = formatContactLine(data);
  const { primaryColor, accentColor } = data;

  switch (data.template) {
    case "classic-centered":
      return {
        rows: [
          {
            columns: [
              {
                align: "center",
                layout: "stack",
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 14 } : null,
                textBlocks: [
                  tb(name, 16, primaryColor, "center", true),
                  ...(data.tagline ? [tb(data.tagline, 9, MUTED_COLOR, "center")] : []),
                ],
              },
            ],
            ruleBelow: { color: accentColor, thickness: 1 },
            spaceAfterPt: 6,
          },
          ...(contact
            ? [{ columns: [{ align: "center" as const, textBlocks: [tb(contact, 8, MUTED_COLOR, "center")] }] }]
            : []),
        ],
      };

    case "left-aligned":
      return {
        rows: [
          {
            columns: [
              {
                align: "left",
                width: 1,
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 12 } : null,
                textBlocks: [],
              },
              {
                align: "right",
                width: 2,
                textBlocks: [
                  ...addr.map((line) => tb(line, 8, MUTED_COLOR, "right")),
                  ...(contact ? [tb(contact, 8, MUTED_COLOR, "right")] : []),
                ],
              },
            ],
            spaceAfterPt: 8,
          },
          {
            columns: [
              {
                align: "left",
                textBlocks: [
                  tb(name, 14, HEADING_COLOR, "left", true),
                  ...(data.tagline ? [tb(data.tagline, 9, MUTED_COLOR, "left")] : []),
                ],
              },
            ],
            ruleBelow: { color: accentColor, thickness: 1.5 },
          },
        ],
      };

    case "modern-band":
      return {
        rows: [
          {
            background: primaryColor,
            columns: [
              {
                align: "left",
                layout: "inline",
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 10 } : null,
                textBlocks: [
                  tb(name, 15, "#FFFFFF", "left", true),
                  ...(data.tagline ? [tb(data.tagline, 9, "#FFFFFF", "left")] : []),
                ],
              },
            ],
            spaceAfterPt: 8,
          },
          {
            columns: [
              {
                align: "left",
                textBlocks: [
                  ...addr.map((line) => tb(line, 8, MUTED_COLOR, "left")),
                  ...(contact ? [tb(contact, 8, MUTED_COLOR, "left")] : []),
                ],
              },
            ],
          },
        ],
      };

    case "minimal":
      return {
        rows: [
          {
            columns: [
              {
                align: "left",
                layout: "inline",
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 8 } : null,
                textBlocks: [tb(name, 13, HEADING_COLOR, "left", true)],
              },
            ],
          },
        ],
      };

    case "corporate-split":
      return {
        rows: [
          {
            columns: [
              {
                align: "left",
                width: 1,
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 11 } : null,
                textBlocks: [],
              },
              {
                align: "center",
                width: 2,
                textBlocks: [
                  tb(name, 14, HEADING_COLOR, "center", true),
                  ...(data.tagline ? [tb(data.tagline, 9, MUTED_COLOR, "center")] : []),
                ],
              },
              {
                align: "right",
                width: 1,
                textBlocks: [
                  ...addr.map((line) => tb(line, 8, MUTED_COLOR, "right")),
                  ...(contact ? [tb(contact, 8, MUTED_COLOR, "right")] : []),
                ],
              },
            ],
            ruleBelow: { color: accentColor, thickness: 1 },
          },
          { columns: [], ruleBelow: { color: RULE_MUTED_COLOR, thickness: 0.75 } },
        ],
      };

    case "elegant-footer":
      return {
        rows: [
          {
            columns: [
              {
                align: "left",
                layout: "inline",
                logo: data.logoUrl ? { url: data.logoUrl, heightMm: 10 } : null,
                textBlocks: [
                  tb(name, 15, HEADING_COLOR, "left", true),
                  ...(data.tagline ? [tb(data.tagline, 9, MUTED_COLOR, "left")] : []),
                ],
              },
            ],
          },
        ],
      };

    default:
      return { rows: [] };
  }
}

function minimalFooterRows(data: LetterheadData): HeaderFooterRow[] {
  const line = [formatAddressLines(data).join(", "), formatContactLine(data)].filter(Boolean).join("   ·   ");
  if (!line) return [];
  return [
    { columns: [], ruleBelow: { color: RULE_MUTED_COLOR, thickness: 0.75 }, spaceAfterPt: 4 },
    { columns: [{ align: "left", textBlocks: [tb(line, 7.5, MUTED_COLOR, "left")] }] },
  ];
}

function elegantFooterRows(data: LetterheadData): HeaderFooterRow[] {
  const rightCol: HeaderFooterTextBlock[] = [];
  if (data.phone) rightCol.push(tb(`Tel: ${data.phone}`, 7.5, FOOTER_MUTED_COLOR, "left"));
  if (data.email) rightCol.push(tb(data.email, 7.5, FOOTER_MUTED_COLOR, "left"));
  if (data.website) rightCol.push(tb(data.website, 7.5, FOOTER_MUTED_COLOR, "left"));
  if (data.registrationNumber) {
    rightCol.push(tb(`Reg. No: ${data.registrationNumber}`, 7.5, FOOTER_MUTED_COLOR, "left"));
  }
  const leftCol = formatAddressLines(data).map((line) => tb(line, 7.5, FOOTER_MUTED_COLOR, "left"));
  if (leftCol.length === 0 && rightCol.length === 0) return [];
  return [
    { columns: [], ruleBelow: { color: data.accentColor, thickness: 1.5 } },
    {
      background: "#F9FAFB",
      columns: [
        { align: "left", textBlocks: leftCol },
        { align: "left", textBlocks: rightCol },
      ],
      spaceBeforePt: 4,
      spaceAfterPt: 4,
    },
  ];
}

/** The optional extra footer line (the "Show footer" toggle +
 *  footerText field) — independent of the template. It appends below
 *  whatever the template's own footer region already renders. */
function extraFooterRows(data: LetterheadData): HeaderFooterRow[] {
  if (!data.showFooter || !data.footerText.trim()) return [];
  const lines = data.footerText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  return [
    {
      columns: [
        { align: "center", textBlocks: lines.map((line) => tb(line, 6.5, "#9CA3AF", "center")) },
      ],
      spaceBeforePt: 6,
    },
  ];
}

/**
 * Build the normalized footer layout for a given template + data.
 *
 * Templates with footerRole "primary" (minimal, elegant-footer) route
 * most of their contact block through here rather than the header — see
 * TEMPLATES_BY_ID in this file. Every template can additionally carry
 * the free-text "Show footer" line, appended last.
 */
export function buildFooterModel(data: LetterheadData): HeaderFooterModel {
  const role = TEMPLATES_BY_ID[data.template]?.footerRole;
  const templateRows =
    role === "primary"
      ? data.template === "minimal"
        ? minimalFooterRows(data)
        : elegantFooterRows(data)
      : [];
  return { rows: [...templateRows, ...extraFooterRows(data)] };
}
