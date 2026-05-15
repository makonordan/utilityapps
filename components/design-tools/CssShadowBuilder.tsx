"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  alpha: number;
  inset: boolean;
}

let layerCounter = 0;
const newLayer = (): ShadowLayer => ({
  id: `layer-${++layerCounter}`,
  x: 0,
  y: 8,
  blur: 24,
  spread: -6,
  color: "#0f172a",
  alpha: 0.18,
  inset: false,
});

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function layerToCss(l: ShadowLayer): string {
  return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.alpha)}`;
}

export function CssShadowBuilder() {
  const [layers, setLayers] = useState<ShadowLayer[]>([newLayer()]);
  const [copied, setCopied] = useState(false);

  const boxShadow = useMemo(() => layers.map(layerToCss).join(", "), [layers]);
  const fullCss = `box-shadow: ${boxShadow};`;

  const update = (id: string, patch: Partial<ShadowLayer>) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addLayer = () => setLayers((prev) => [...prev, newLayer()]);
  const removeLayer = (id: string) =>
    setLayers((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center rounded-2xl border border-surface-200 bg-surface-100 py-16 dark:border-surface-800 dark:bg-surface-800">
        <div
          className="h-40 w-64 rounded-2xl bg-white dark:bg-surface-900"
          style={{ boxShadow }}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Shadow layers
          </p>
          <button
            type="button"
            onClick={addLayer}
            className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-2.5 py-1 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <Plus className="h-3 w-3" />
            Add layer
          </button>
        </div>

        {layers.map((l, idx) => (
          <div key={l.id} className="space-y-3 rounded-xl border border-surface-200 p-3 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-surface-700 dark:text-surface-200">Layer {idx + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                  <input
                    type="checkbox"
                    checked={l.inset}
                    onChange={(e) => update(l.id, { inset: e.target.checked })}
                    className="h-3.5 w-3.5 accent-primary-600"
                  />
                  Inset
                </label>
                <button
                  type="button"
                  onClick={() => removeLayer(l.id)}
                  disabled={layers.length <= 1}
                  className="text-surface-400 transition hover:text-error-600 disabled:opacity-30 dark:hover:text-error-400"
                  aria-label="Remove layer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { key: "x" as const, label: "X offset", min: -100, max: 100 },
                { key: "y" as const, label: "Y offset", min: -100, max: 100 },
                { key: "blur" as const, label: "Blur", min: 0, max: 150 },
                { key: "spread" as const, label: "Spread", min: -50, max: 50 },
              ].map((ctrl) => (
                <label key={ctrl.key} className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-surface-600 dark:text-surface-400">
                    {ctrl.label}: {l[ctrl.key]}px
                  </span>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    value={l[ctrl.key]}
                    onChange={(e) => update(l.id, { [ctrl.key]: Number(e.target.value) })}
                    className="accent-primary-600"
                  />
                </label>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                Colour
                <input
                  type="color"
                  value={l.color}
                  onChange={(e) => update(l.id, { color: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-lg border border-surface-300 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-900"
                />
              </label>
              <label className="flex flex-1 items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                Opacity: {Math.round(l.alpha * 100)}%
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={l.alpha}
                  onChange={(e) => update(l.id, { alpha: Number(e.target.value) })}
                  className="flex-1 accent-primary-600"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">CSS</p>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        <pre className="overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:bg-surface-800 dark:text-white">
          {fullCss}
        </pre>
      </div>
    </div>
  );
}
