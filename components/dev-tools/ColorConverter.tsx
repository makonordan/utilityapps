"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

// CSS Color Module Level 4 named colours.
const NAMED_COLORS: Record<string, string> = {
  aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4",
  azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000",
  blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a",
  burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e",
  coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c",
  cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc",
  darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3",
  deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969",
  dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22",
  fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700",
  goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f",
  grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c",
  indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa",
  lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6",
  lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3",
  lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899",
  lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32",
  linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585",
  midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5",
  navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000",
  olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6",
  palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093",
  papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb",
  plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", rebeccapurple: "#663399",
  red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513",
  salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee",
  sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd",
  slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f",
  steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8",
  tomato: "#ff6347", transparent: "#00000000", turquoise: "#40e0d0", violet: "#ee82ee",
  wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

interface RGBA { r: number; g: number; b: number; a: number; }

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  // Named
  if (NAMED_COLORS[s]) return parseColor(NAMED_COLORS[s]);
  // Hex
  let m = /^#?([0-9a-f]{3,8})$/i.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length === 4) h = h.split("").map((c) => c + c).join("");
    if (h.length === 6) h += "ff";
    if (h.length !== 8) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }
  // rgb/rgba
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/.exec(s);
  if (m) {
    const a = m[4] ? (m[4].endsWith("%") ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])) : 1;
    return { r: clamp(Number(m[1]), 0, 255), g: clamp(Number(m[2]), 0, 255), b: clamp(Number(m[3]), 0, 255), a: clamp(a, 0, 1) };
  }
  // hsl/hsla
  m = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+%?))?\s*\)$/.exec(s);
  if (m) {
    const a = m[4] ? (m[4].endsWith("%") ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])) : 1;
    return { ...hslToRgb(Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100), a: clamp(a, 0, 1) };
  }
  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mp = l - c / 2;
  let r = 0, g = 0, b = 0;
  const hh = ((h % 360) + 360) % 360;
  if (hh < 60) { r = c; g = x; b = 0; }
  else if (hh < 120) { r = x; g = c; b = 0; }
  else if (hh < 180) { r = 0; g = c; b = x; }
  else if (hh < 240) { r = 0; g = x; b = c; }
  else if (hh < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { r: Math.round((r + mp) * 255), g: Math.round((g + mp) * 255), b: Math.round((b + mp) * 255) };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let s = 0, h = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function toHex({ r, g, b, a }: RGBA): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a < 1 ? `${base}${h(Math.round(a * 255))}` : base;
}

function findClosestNamed(rgba: RGBA): string | null {
  let best: { name: string; dist: number } | null = null;
  for (const [name, hex] of Object.entries(NAMED_COLORS)) {
    if (name === "transparent") continue;
    const c = parseColor(hex)!;
    const d = (c.r - rgba.r) ** 2 + (c.g - rgba.g) ** 2 + (c.b - rgba.b) ** 2;
    if (best === null || d < best.dist) best = { name, dist: d };
  }
  return best?.name ?? null;
}

export function ColorConverter() {
  const [input, setInput] = useState("#0066ff");
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => parseColor(input), [input]);

  const formats = useMemo(() => {
    if (!parsed) return null;
    const hsl = rgbToHsl(parsed);
    const hex = toHex(parsed);
    const rgb = parsed.a < 1
      ? `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a.toFixed(3)})`
      : `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;
    const hslStr = parsed.a < 1
      ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${parsed.a.toFixed(3)})`
      : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const named = findClosestNamed(parsed);
    return { hex, rgb, hslStr, named };
  }, [parsed]);

  const swatchStyle = parsed
    ? { backgroundColor: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})` }
    : { backgroundColor: "#fff" };

  // Sync input when user picks via the native colour picker.
  const [picker, setPicker] = useState("#0066ff");
  useEffect(() => {
    if (parsed) setPicker(`#${[parsed.r, parsed.g, parsed.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`);
  }, [parsed]);

  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Input
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="color"
            value={picker}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-lg border border-surface-300 bg-white p-1 dark:border-surface-700 dark:bg-surface-900"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#0066ff or rgb(0, 102, 255) or hotpink"
            className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </div>
        {!parsed && input.trim() && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-error-600 dark:text-error-400">
            <AlertTriangle className="h-3 w-3" />
            Could not parse that as HEX, RGB, HSL, or a named CSS colour.
          </p>
        )}
      </div>

      {parsed && formats && (
        <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl border border-surface-300 shadow-md dark:border-surface-700" style={swatchStyle} />
            <div className="text-sm text-surface-700 dark:text-surface-200">
              <p>Preview swatch</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Closest named: <strong>{formats.named}</strong></p>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              { key: "hex", label: "HEX", value: formats.hex },
              { key: "rgb", label: "RGB", value: formats.rgb },
              { key: "hsl", label: "HSL", value: formats.hslStr },
              { key: "named", label: "Named", value: formats.named ?? "" },
            ].map((row) => (
              <li
                key={row.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-surface-200 bg-white px-3 py-2 dark:border-surface-700 dark:bg-surface-900"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{row.label}</span>
                <span className="flex-1 truncate font-mono text-sm text-surface-900 dark:text-white">{row.value}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(row.key, row.value)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-surface-600 hover:text-primary-700 dark:text-surface-300 dark:hover:text-primary-300"
                >
                  {copied === row.key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === row.key ? "Copied" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
