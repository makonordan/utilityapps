/**
 * Renders a StampData object to a standalone SVG string for the Company
 * Stamp Generator (/tools/company-stamp-generator).
 *
 * Pure TypeScript. No React, no browser APIs, no 'use client'. The
 * returned string is a complete, self-contained <svg> — safe to inject
 * into the DOM for live preview, or wrap in a data: URL and draw onto a
 * <canvas> for PNG export.
 *
 * ── The curved-text trick ──
 *
 * Top and bottom arc text both use <textPath>, walked from the arc's
 * left end to its right end so reading order is left-to-right with no
 * string reversal. But "left end to right end" alone isn't enough to
 * keep glyphs upright — a browser orients each glyph to the path's
 * local tangent, and which of the two arcs connecting those endpoints
 * gets drawn (hugging the top of the circle vs. the bottom) is chosen
 * by the elliptical-arc sweep-flag. Get the wrong sweep for a given
 * span and the text renders upside-down even though the path still
 * visually traces the correct side of the ring. Verified empirically
 * (rendered a lone "R" at each position and inspected the pixels):
 * the top arc wants sweep=1, the bottom arc wants sweep=0 — they are
 * NOT symmetric under the naive "just mirror the angles" assumption.
 */

import { STAMP_TEXTURES_BY_ID, type StampData, type StampTexture } from "./companyStamp";

type BorderStyle = StampData["borderStyle"];

// Rough advance width of a bold-caps glyph, as a fraction of font-size.
// Measured against Arial Black at various letter-spacings (0.68–0.82);
// pick the high end so long presets shrink a little more than strictly
// necessary rather than risk overflowing the border.
const AVG_CHAR_WIDTH_RATIO = 0.82;

// ── Formatting / escaping ───────────────────────────────────────────────

function fx(n: number): string {
  return Number.isFinite(n) ? n.toFixed(2) : "0";
}

function escapeXml(input: string): string {
  return (input ?? "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return ch;
    }
  });
}

// ── Geometry ─────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

/** Point on a circle at `thetaDeg` degrees clockwise from the top (12 o'clock). */
function circlePoint(cx: number, cy: number, r: number, thetaDeg: number): Point {
  const t = (thetaDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
}

/** Point on an ellipse at `thetaDeg` degrees clockwise from the top. */
function ellipsePoint(cx: number, cy: number, rx: number, ry: number, thetaDeg: number): Point {
  const t = (thetaDeg * Math.PI) / 180;
  return { x: cx + rx * Math.sin(t), y: cy - ry * Math.cos(t) };
}

/** Arc path from thetaA to thetaB (degrees; order matters — the path is
 *  walked A→B, which is what textPath uses for reading order). `sweep`
 *  picks which of the two possible arcs between the points is drawn. See
 *  file header for why the top and bottom arcs need different values. */
function circleArcPath(
  cx: number,
  cy: number,
  r: number,
  thetaA: number,
  thetaB: number,
  sweep: 0 | 1
): string {
  const p1 = circlePoint(cx, cy, r, thetaA);
  const p2 = circlePoint(cx, cy, r, thetaB);
  const largeArc = Math.abs(thetaB - thetaA) > 180 ? 1 : 0;
  return `M ${fx(p1.x)} ${fx(p1.y)} A ${fx(r)} ${fx(r)} 0 ${largeArc} ${sweep} ${fx(p2.x)} ${fx(p2.y)}`;
}

function ellipseArcPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  thetaA: number,
  thetaB: number,
  sweep: 0 | 1
): string {
  const p1 = ellipsePoint(cx, cy, rx, ry, thetaA);
  const p2 = ellipsePoint(cx, cy, rx, ry, thetaB);
  const largeArc = Math.abs(thetaB - thetaA) > 180 ? 1 : 0;
  return `M ${fx(p1.x)} ${fx(p1.y)} A ${fx(rx)} ${fx(ry)} 0 ${largeArc} ${sweep} ${fx(p2.x)} ${fx(p2.y)}`;
}

// ── Font fitting ─────────────────────────────────────────────────────────
//
// No canvas/DOM text measurement is available in this pure-TS module, so
// fit is estimated from an average glyph-width ratio. Good enough to keep
// long presets ("FOR DEPOSIT ONLY", a long company name) from overflowing.

function fitArcFontSize(
  text: string,
  radius: number,
  halfSpanDeg: number,
  baseFontSize: number,
  minFontSize: number
): number {
  const trimmed = text.trim();
  if (!trimmed) return baseFontSize;
  const arcLength = radius * ((halfSpanDeg * 2 * Math.PI) / 180);
  const estimatedWidth = trimmed.length * baseFontSize * AVG_CHAR_WIDTH_RATIO;
  const budget = arcLength * 0.92;
  if (estimatedWidth <= budget) return baseFontSize;
  return Math.max(minFontSize, baseFontSize * (budget / estimatedWidth));
}

function fitLinearFontSize(
  text: string,
  maxWidth: number,
  baseFontSize: number,
  minFontSize: number
): number {
  const trimmed = text.trim();
  if (!trimmed) return baseFontSize;
  const estimatedWidth = trimmed.length * baseFontSize * AVG_CHAR_WIDTH_RATIO;
  if (estimatedWidth <= maxWidth) return baseFontSize;
  return Math.max(minFontSize, baseFontSize * (maxWidth / estimatedWidth));
}

// ── Borders ──────────────────────────────────────────────────────────────

function circleRing(
  cx: number,
  cy: number,
  r: number,
  strokeWidth: number,
  color: string,
  dashArray?: string,
  linecap: "butt" | "round" = "butt"
): string {
  if (r <= 0) return "";
  const dash = dashArray ? ` stroke-dasharray="${dashArray}"` : "";
  const cap = linecap !== "butt" ? ` stroke-linecap="${linecap}"` : "";
  return `<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${fx(r)}" fill="none" stroke="${color}" stroke-width="${fx(strokeWidth)}"${dash}${cap} />`;
}

function buildCircleBorder(
  cx: number,
  cy: number,
  r: number,
  borderStyle: BorderStyle,
  borderWidth: number,
  color: string
): string {
  switch (borderStyle) {
    case "none":
      return "";
    case "double": {
      const gap = Math.max(3, borderWidth * 2.2);
      return (
        circleRing(cx, cy, r, borderWidth, color) +
        circleRing(cx, cy, Math.max(2, r - gap), Math.max(1, borderWidth * 0.6), color)
      );
    }
    case "dashed":
      return circleRing(cx, cy, r, borderWidth, color, `${fx(borderWidth * 2.4)} ${fx(borderWidth * 1.6)}`);
    case "rope":
      return circleRing(
        cx,
        cy,
        r,
        borderWidth * 1.7,
        color,
        `${fx(borderWidth * 0.6)} ${fx(borderWidth * 1.1)}`,
        "round"
      );
    case "single":
    default:
      return circleRing(cx, cy, r, borderWidth, color);
  }
}

function ellipseRing(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  strokeWidth: number,
  color: string,
  dashArray?: string,
  linecap: "butt" | "round" = "butt"
): string {
  if (rx <= 0 || ry <= 0) return "";
  const dash = dashArray ? ` stroke-dasharray="${dashArray}"` : "";
  const cap = linecap !== "butt" ? ` stroke-linecap="${linecap}"` : "";
  return `<ellipse cx="${fx(cx)}" cy="${fx(cy)}" rx="${fx(rx)}" ry="${fx(ry)}" fill="none" stroke="${color}" stroke-width="${fx(strokeWidth)}"${dash}${cap} />`;
}

function buildEllipseBorder(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  borderStyle: BorderStyle,
  borderWidth: number,
  color: string
): string {
  switch (borderStyle) {
    case "none":
      return "";
    case "double": {
      const gap = Math.max(3, borderWidth * 2.2);
      return (
        ellipseRing(cx, cy, rx, ry, borderWidth, color) +
        ellipseRing(cx, cy, Math.max(2, rx - gap), Math.max(2, ry - gap), Math.max(1, borderWidth * 0.6), color)
      );
    }
    case "dashed":
      return ellipseRing(cx, cy, rx, ry, borderWidth, color, `${fx(borderWidth * 2.4)} ${fx(borderWidth * 1.6)}`);
    case "rope":
      return ellipseRing(
        cx,
        cy,
        rx,
        ry,
        borderWidth * 1.7,
        color,
        `${fx(borderWidth * 0.6)} ${fx(borderWidth * 1.1)}`,
        "round"
      );
    case "single":
    default:
      return ellipseRing(cx, cy, rx, ry, borderWidth, color);
  }
}

function rectRing(
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  strokeWidth: number,
  color: string,
  dashArray?: string,
  linecap: "butt" | "round" = "butt"
): string {
  if (w <= 0 || h <= 0) return "";
  const dash = dashArray ? ` stroke-dasharray="${dashArray}"` : "";
  const cap = linecap !== "butt" ? ` stroke-linecap="${linecap}"` : "";
  return `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(w)}" height="${fx(h)}" rx="${fx(rx)}" fill="none" stroke="${color}" stroke-width="${fx(strokeWidth)}"${dash}${cap} />`;
}

function buildRectBorder(
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  borderStyle: BorderStyle,
  borderWidth: number,
  color: string
): string {
  switch (borderStyle) {
    case "none":
      return "";
    case "double": {
      const gap = Math.max(3, borderWidth * 2.2);
      return (
        rectRing(x, y, w, h, rx, borderWidth, color) +
        rectRing(
          x + gap,
          y + gap,
          Math.max(0, w - gap * 2),
          Math.max(0, h - gap * 2),
          Math.max(0, rx - gap),
          Math.max(1, borderWidth * 0.6),
          color
        )
      );
    }
    case "dashed":
      return rectRing(x, y, w, h, rx, borderWidth, color, `${fx(borderWidth * 2.4)} ${fx(borderWidth * 1.6)}`);
    case "rope":
      return rectRing(
        x,
        y,
        w,
        h,
        rx,
        borderWidth * 1.7,
        color,
        `${fx(borderWidth * 0.6)} ${fx(borderWidth * 1.1)}`,
        "round"
      );
    case "single":
    default:
      return rectRing(x, y, w, h, rx, borderWidth, color);
  }
}

// ── Text elements ────────────────────────────────────────────────────────

function textEl(
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fontFamily: string,
  color: string,
  weight: number,
  letterSpacing: number
): string {
  const safe = escapeXml(text || "");
  const ls = letterSpacing ? ` letter-spacing="${fx(letterSpacing)}"` : "";
  return `<text x="${fx(x)}" y="${fx(y)}" font-family="${fontFamily}" font-size="${fx(fontSize)}" font-weight="${weight}" fill="${color}" text-anchor="middle" dominant-baseline="middle"${ls}>${safe}</text>`;
}

/** Curved text along a pre-built arc path via <textPath>. Includes both
 *  `href` and `xlink:href` since some standalone SVG rasterizers (used
 *  for PNG export) still only honor the latter. */
function renderArcText(
  id: string,
  pathD: string,
  text: string,
  fontSize: number,
  fontFamily: string,
  color: string
): string {
  const safeText = escapeXml(text);
  return (
    `<path id="${id}" d="${pathD}" fill="none" stroke="none" />` +
    `<text font-family="${fontFamily}" font-size="${fx(fontSize)}" font-weight="700" fill="${color}" letter-spacing="${fx(fontSize * 0.09)}">` +
    `<textPath href="#${id}" xlink:href="#${id}" startOffset="50%" text-anchor="middle">${safeText}</textPath>` +
    `</text>`
  );
}

function renderStarAt(p: Point, size: number, color: string): string {
  return `<text x="${fx(p.x)}" y="${fx(p.y)}" font-size="${fx(size)}" fill="${color}" text-anchor="middle" dominant-baseline="middle">★</text>`;
}

/** Center block shared by all three shapes: big center text, optional
 *  small sub-text line, optional date line/rule — vertically stacked and
 *  centered as a group around `cy`. */
function renderCenterBlock(
  cx: number,
  cy: number,
  data: StampData,
  color: string,
  centerFontSizeBase: number,
  subFontSize: number,
  maxWidth: number
): string {
  const centerFontSize = fitLinearFontSize(
    data.centerText,
    maxWidth,
    centerFontSizeBase,
    centerFontSizeBase * 0.45
  );
  const hasSub = !!data.centerSubText.trim();
  const hasFixedDate = data.dateMode === "fixed" && !!data.fixedDate.trim();
  const hasBlankLine = data.dateMode === "blank-line";
  const lineGap = subFontSize * 1.35;

  let blockHeight = centerFontSize;
  if (hasSub) blockHeight += lineGap;
  if (hasFixedDate || hasBlankLine) blockHeight += lineGap;

  let y = cy - blockHeight / 2 + centerFontSize / 2;
  const parts: string[] = [];
  parts.push(
    textEl(cx, y, data.centerText, centerFontSize, data.fontFamily, color, 700, centerFontSize * 0.03)
  );
  y += lineGap;

  if (hasSub) {
    parts.push(textEl(cx, y, data.centerSubText, subFontSize, data.fontFamily, color, 400, 0));
    y += lineGap;
  }

  if (hasFixedDate) {
    parts.push(textEl(cx, y, data.fixedDate, subFontSize, data.fontFamily, color, 400, 0));
  } else if (hasBlankLine) {
    const lineWidth = Math.min(maxWidth, subFontSize * 6.5);
    const lineY = y - subFontSize * 0.3;
    parts.push(
      `<line x1="${fx(cx - lineWidth / 2)}" y1="${fx(lineY)}" x2="${fx(cx + lineWidth / 2)}" y2="${fx(lineY)}" stroke="${color}" stroke-width="${fx(Math.max(1, subFontSize * 0.08))}" />`
    );
  }

  return parts.join("");
}

// ── Ink texture filter ───────────────────────────────────────────────────

function buildTextureFilter(id: string, texture: StampTexture): string {
  if (texture.roughness <= 0) return "";
  return (
    `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${fx(texture.roughness)}" numOctaves="2" seed="7" result="stamp-noise" />` +
    `<feDisplacementMap in="SourceGraphic" in2="stamp-noise" scale="${fx(texture.displacementScale)}" xChannelSelector="R" yChannelSelector="G" />` +
    `</filter>`
  );
}

// ── Shape renderers ──────────────────────────────────────────────────────

interface ShapeResult {
  width: number;
  height: number;
  body: string;
}

function renderRoundSeal(
  uid: string,
  size: number,
  data: StampData,
  color: string,
  borderWidth: number,
  fontFamily: string
): ShapeResult {
  const width = size;
  const height = size;
  const cx = width / 2;
  const cy = height / 2;

  const outerR = size / 2 - borderWidth - Math.max(4, size * 0.02);
  const border = buildCircleBorder(cx, cy, outerR, data.borderStyle, borderWidth, color);

  const textRadius = outerR - borderWidth * 2 - size * 0.05;
  const span = 78; // degrees, half-span of the top/bottom arcs
  const baseArcFont = size * 0.075;
  const minArcFont = size * 0.035;

  let arcs = "";
  if (data.topText.trim()) {
    const fs = fitArcFontSize(data.topText, textRadius, span, baseArcFont, minArcFont);
    const d = circleArcPath(cx, cy, textRadius, -span, span, 1);
    arcs += renderArcText(`${uid}-top`, d, data.topText, fs, fontFamily, color);
  }
  if (data.bottomText.trim()) {
    const fs = fitArcFontSize(data.bottomText, textRadius, span, baseArcFont, minArcFont);
    const d = circleArcPath(cx, cy, textRadius, 180 + span, 180 - span, 0);
    arcs += renderArcText(`${uid}-bottom`, d, data.bottomText, fs, fontFamily, color);
  }

  let stars = "";
  if (data.starSeparators) {
    const starSize = size * 0.045;
    stars += renderStarAt(circlePoint(cx, cy, textRadius, 90), starSize, color);
    stars += renderStarAt(circlePoint(cx, cy, textRadius, 270), starSize, color);
  }

  const centerFontSize = size * 0.14;
  const subFontSize = centerFontSize * 0.38;
  const centerBlock = renderCenterBlock(cx, cy, data, color, centerFontSize, subFontSize, textRadius * 1.1);

  return { width, height, body: border + arcs + stars + centerBlock };
}

function renderOvalSeal(
  uid: string,
  size: number,
  data: StampData,
  color: string,
  borderWidth: number,
  fontFamily: string
): ShapeResult {
  const width = size;
  const height = Math.round(size * 0.68);
  const cx = width / 2;
  const cy = height / 2;

  const outerRx = width / 2 - borderWidth - Math.max(4, size * 0.02);
  const outerRy = height / 2 - borderWidth - Math.max(3, size * 0.015);
  const border = buildEllipseBorder(cx, cy, outerRx, outerRy, data.borderStyle, borderWidth, color);

  const textRx = outerRx - borderWidth * 2 - size * 0.035;
  const textRy = outerRy - borderWidth * 2 - size * 0.03;
  const approxRadius = (textRx + textRy) / 2;
  const span = 75;
  const baseArcFont = height * 0.16;
  const minArcFont = height * 0.07;

  let arcs = "";
  if (data.topText.trim()) {
    const fs = fitArcFontSize(data.topText, approxRadius, span, baseArcFont, minArcFont);
    const d = ellipseArcPath(cx, cy, textRx, textRy, -span, span, 1);
    arcs += renderArcText(`${uid}-top`, d, data.topText, fs, fontFamily, color);
  }
  if (data.bottomText.trim()) {
    const fs = fitArcFontSize(data.bottomText, approxRadius, span, baseArcFont, minArcFont);
    const d = ellipseArcPath(cx, cy, textRx, textRy, 180 + span, 180 - span, 0);
    arcs += renderArcText(`${uid}-bottom`, d, data.bottomText, fs, fontFamily, color);
  }

  let stars = "";
  if (data.starSeparators) {
    const starSize = height * 0.09;
    stars += renderStarAt(ellipsePoint(cx, cy, textRx, textRy, 90), starSize, color);
    stars += renderStarAt(ellipsePoint(cx, cy, textRx, textRy, 270), starSize, color);
  }

  const centerFontSize = height * 0.26;
  const subFontSize = centerFontSize * 0.4;
  const centerBlock = renderCenterBlock(cx, cy, data, color, centerFontSize, subFontSize, textRx * 1.3);

  return { width, height, body: border + arcs + stars + centerBlock };
}

function renderRectangleStamp(
  size: number,
  data: StampData,
  color: string,
  borderWidth: number,
  fontFamily: string
): ShapeResult {
  const width = size;
  const height = Math.round(size * 0.55);
  const pad = Math.max(6, size * 0.03);
  const x = pad;
  const y = pad;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const rx = Math.max(4, size * 0.015);
  const border = buildRectBorder(x, y, w, h, rx, data.borderStyle, borderWidth, color);

  const cx = width / 2;
  const innerPad = borderWidth * 2 + size * 0.02;
  const topFontSize = height * 0.12;
  const bottomFontSize = topFontSize;
  const hasTop = !!data.topText.trim();
  const hasBottom = !!data.bottomText.trim();

  let straps = "";
  if (hasTop) {
    const topY = y + innerPad + topFontSize * 0.6;
    straps += textEl(cx, topY, data.topText, topFontSize, fontFamily, color, 700, topFontSize * 0.15);
  }
  if (hasBottom) {
    const bottomY = y + h - innerPad - bottomFontSize * 0.4;
    straps += textEl(cx, bottomY, data.bottomText, bottomFontSize, fontFamily, color, 700, bottomFontSize * 0.15);
  }

  const centerFontSize = height * 0.32;
  const subFontSize = centerFontSize * 0.36;
  const centerY = height / 2 + (hasTop ? topFontSize * 0.35 : 0) - (hasBottom ? bottomFontSize * 0.2 : 0);
  const centerBlock = renderCenterBlock(cx, centerY, data, color, centerFontSize, subFontSize, w * 0.85);

  return { width, height, body: border + straps + centerBlock };
}

// ── Entry point ──────────────────────────────────────────────────────────

const DEFAULT_FONT_STACK = "'Arial Black', Arial, Helvetica, sans-serif";
const HEX_COLOR_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/;

export function renderStampSvg(data: StampData): string {
  const uid = `stamp-${Math.random().toString(36).slice(2, 9)}`;
  const size = data.sizePx > 0 ? data.sizePx : 400;
  const color = HEX_COLOR_RE.test(data.color) ? data.color : "#1A1A1A";
  const borderWidth = data.borderWidth > 0 ? data.borderWidth : Math.round(size * 0.012);
  const fontFamily = data.fontFamily?.trim() || DEFAULT_FONT_STACK;
  const texture = STAMP_TEXTURES_BY_ID[data.textureStyle] ?? STAMP_TEXTURES_BY_ID.clean;
  const rotation = Number.isFinite(data.rotation) ? data.rotation : 0;

  let shape: ShapeResult;
  switch (data.shape) {
    case "rectangle":
      shape = renderRectangleStamp(size, data, color, borderWidth, fontFamily);
      break;
    case "oval":
      shape = renderOvalSeal(uid, size, data, color, borderWidth, fontFamily);
      break;
    case "round":
    default:
      shape = renderRoundSeal(uid, size, data, color, borderWidth, fontFamily);
      break;
  }

  const { width, height, body } = shape;
  const cx = width / 2;
  const cy = height / 2;

  const filterId = `${uid}-texture`;
  const filterDef = buildTextureFilter(filterId, texture);
  const filterAttr = filterDef ? ` filter="url(#${filterId})"` : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${fx(width)} ${fx(height)}" width="${fx(width)}" height="${fx(height)}">` +
    (filterDef ? `<defs>${filterDef}</defs>` : "") +
    `<g transform="rotate(${fx(rotation)} ${fx(cx)} ${fx(cy)})" opacity="${fx(texture.opacity)}"${filterAttr}>` +
    body +
    `</g>` +
    `</svg>`
  );
}
