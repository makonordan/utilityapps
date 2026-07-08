"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface FontSpec {
  /** Google Fonts family name, e.g. "Playfair Display". */
  family: string;
  weight: number;
}

interface Pairing {
  id: string;
  heading: FontSpec;
  body: FontSpec;
  vibe: string;
}

const PAIRINGS: Pairing[] = [
  { id: "editorial", heading: { family: "Playfair Display", weight: 700 }, body: { family: "Source Sans 3", weight: 400 }, vibe: "Elegant editorial" },
  { id: "modern-serif", heading: { family: "Montserrat", weight: 700 }, body: { family: "Merriweather", weight: 400 }, vibe: "Modern + readable serif" },
  { id: "geometric", heading: { family: "Poppins", weight: 600 }, body: { family: "Inter", weight: 400 }, vibe: "Clean geometric" },
  { id: "bold-condensed", heading: { family: "Oswald", weight: 600 }, body: { family: "Lato", weight: 400 }, vibe: "Bold condensed headline" },
  { id: "warm", heading: { family: "Lora", weight: 700 }, body: { family: "Roboto", weight: 400 }, vibe: "Warm serif + neutral sans" },
  { id: "superfamily", heading: { family: "DM Serif Display", weight: 400 }, body: { family: "DM Sans", weight: 400 }, vibe: "Matched superfamily" },
  { id: "techy", heading: { family: "Space Grotesk", weight: 700 }, body: { family: "IBM Plex Sans", weight: 400 }, vibe: "Techy + modern" },
  { id: "friendly", heading: { family: "Fredoka", weight: 600 }, body: { family: "Nunito Sans", weight: 400 }, vibe: "Friendly + rounded" },
];

function familyParam(spec: FontSpec): string {
  return `family=${spec.family.replace(/ /g, "+")}:wght@${spec.weight}`;
}

function googleFontsLink(pairing: Pairing): string {
  return `https://fonts.googleapis.com/css2?${familyParam(pairing.heading)}&${familyParam(pairing.body)}&display=swap`;
}

function snippet(pairing: Pairing): string {
  return `<link href="${googleFontsLink(pairing)}" rel="stylesheet">

/* CSS */
h1, h2, h3 { font-family: "${pairing.heading.family}", serif; }
body       { font-family: "${pairing.body.family}", sans-serif; }`;
}

export function FontPairing() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load every pairing's fonts once via a single combined stylesheet link.
  useEffect(() => {
    const families = new Set<string>();
    for (const p of PAIRINGS) {
      families.add(familyParam(p.heading));
      families.add(familyParam(p.body));
    }
    const href = `https://fonts.googleapis.com/css2?${Array.from(families).join("&")}&display=swap`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.fontPairing = "true";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  const handleCopy = async (pairing: Pairing) => {
    await navigator.clipboard.writeText(snippet(pairing));
    setCopiedId(pairing.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      {PAIRINGS.map((p) => (
        <div
          key={p.id}
          className="overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
        >
          <div className="border-b border-surface-100 p-6 dark:border-surface-800">
            <p
              className="text-3xl text-surface-900 sm:text-4xl dark:text-white"
              style={{ fontFamily: `"${p.heading.family}", serif`, fontWeight: p.heading.weight }}
            >
              The quick brown fox
            </p>
            <p
              className="mt-3 text-base text-surface-600 dark:text-surface-300"
              style={{ fontFamily: `"${p.body.family}", sans-serif`, fontWeight: p.body.weight }}
            >
              Jumps over the lazy dog. Good typography pairs a distinctive heading with a highly
              readable body — contrast in character, harmony in proportion.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
            <div className="text-xs text-surface-600 dark:text-surface-300">
              <span className="font-semibold text-surface-900 dark:text-white">{p.heading.family}</span>
              {" + "}
              <span className="font-semibold text-surface-900 dark:text-white">{p.body.family}</span>
              <span className="ml-2 rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                {p.vibe}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(p)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              {copiedId === p.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedId === p.id ? "Copied" : "Copy code"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
