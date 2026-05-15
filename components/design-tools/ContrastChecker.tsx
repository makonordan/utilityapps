"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || !/^[0-9a-f]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!f || !b) return null;
  const l1 = relativeLuminance(f);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#1E293B");
  const [bg, setBg] = useState("#F8FAFC");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  const checks = ratio
    ? [
        { label: "AA — Normal text", pass: ratio >= 4.5, need: "4.5:1" },
        { label: "AA — Large text", pass: ratio >= 3, need: "3:1" },
        { label: "AAA — Normal text", pass: ratio >= 7, need: "7:1" },
        { label: "AAA — Large text", pass: ratio >= 4.5, need: "4.5:1" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Text colour", value: fg, set: setFg },
          { label: "Background colour", value: bg, set: setBg },
        ].map((field) => (
          <div key={field.label} className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {field.label}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexToRgb(field.value) ? field.value : "#000000"}
                onChange={(e) => field.set(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-surface-300 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-900"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border border-surface-200 p-8 dark:border-surface-800"
        style={{ backgroundColor: hexToRgb(bg) ? bg : "#ffffff", color: hexToRgb(fg) ? fg : "#000000" }}
      >
        <p className="text-2xl font-bold">Large text preview (24px bold)</p>
        <p className="mt-2 text-base">
          Normal body text preview — the quick brown fox jumps over the lazy dog. Accessible
          contrast keeps this readable for everyone.
        </p>
      </div>

      {ratio ? (
        <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Contrast ratio
          </p>
          <p className="text-center font-mono text-5xl font-bold text-surface-900 dark:text-white">
            {ratio.toFixed(2)}:1
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map((c) => (
              <div
                key={c.label}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                  c.pass
                    ? "border-success-300 bg-success-50 text-success-700 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300"
                    : "border-error-300 bg-error-50 text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-200"
                )}
              >
                <span className="font-medium">{c.label}</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  {c.pass ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {c.pass ? "Pass" : "Fail"}
                  <span className="ml-1 text-[11px] opacity-70">(needs {c.need})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-error-600 dark:text-error-400">
          Enter valid 3- or 6-digit hex colours for both fields.
        </p>
      )}
    </div>
  );
}
