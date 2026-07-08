"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Shuffle, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

type GradientType = "linear" | "radial" | "conic";

interface Stop {
  id: string;
  color: string;
  position: number;
}

let stopCounter = 0;
const newStop = (color: string, position: number): Stop => ({
  id: `stop-${++stopCounter}`,
  color,
  position,
});

const RANDOM_COLORS = [
  "#0066FF", "#7C3AED", "#F43F5E", "#10B981", "#F59E0B",
  "#06B6D4", "#EC4899", "#14B8A6", "#8B5CF6", "#EF4444",
];

function randomColor(): string {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

export function GradientGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([newStop("#0066FF", 0), newStop("#7C3AED", 100)]);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${stopStr})`;
    if (type === "radial") return `radial-gradient(circle, ${stopStr})`;
    return `conic-gradient(from ${angle}deg, ${stopStr})`;
  }, [type, angle, stops]);

  const fullCss = `background: ${css};`;

  const updateStop = (id: string, patch: Partial<Stop>) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addStop = () => {
    const pos = stops.length > 0 ? Math.round(stops.reduce((a, s) => a + s.position, 0) / stops.length) : 50;
    setStops((prev) => [...prev, newStop(randomColor(), pos)]);
  };

  const removeStop = (id: string) => {
    setStops((prev) => (prev.length > 2 ? prev.filter((s) => s.id !== id) : prev));
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    const next: Stop[] = [];
    for (let i = 0; i < count; i++) {
      next.push(newStop(randomColor(), Math.round((i / (count - 1)) * 100)));
    }
    setStops(next);
    setAngle(Math.floor(Math.random() * 360));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div
        className="h-56 rounded-2xl border border-surface-200 shadow-inner dark:border-surface-800"
        style={{ background: css }}
      />

      <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900">
            {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                  type === t
                    ? "bg-primary-600 text-white"
                    : "text-surface-700 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {type !== "radial" && (
            <label className="flex items-center gap-2 text-xs text-surface-700 dark:text-surface-300">
              Angle
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="accent-primary-600"
              />
              <span className="w-10 font-mono">{angle}°</span>
            </label>
          )}
          <button
            type="button"
            onClick={randomize}
            className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Randomise
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Colour stops
            </p>
            <button
              type="button"
              onClick={addStop}
              className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-2.5 py-1 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              <Plus className="h-3 w-3" />
              Add stop
            </button>
          </div>
          {stops.map((s) => (
            <div key={s.id} className="grid items-center gap-2 sm:grid-cols-[44px_1fr_120px_36px]">
              <input
                type="color"
                value={s.color}
                onChange={(e) => updateStop(s.id, { color: e.target.value })}
                className="h-9 w-11 cursor-pointer rounded-lg border border-surface-300 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-900"
              />
              <input
                type="text"
                value={s.color}
                onChange={(e) => updateStop(s.id, { color: e.target.value })}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
              <label className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.position}
                  onChange={(e) => updateStop(s.id, { position: Number(e.target.value) })}
                  className="flex-1 accent-primary-600"
                />
                <span className="w-9 font-mono">{s.position}%</span>
              </label>
              <button
                type="button"
                onClick={() => removeStop(s.id)}
                disabled={stops.length <= 2}
                className="flex items-center justify-center text-surface-400 transition hover:text-error-600 disabled:opacity-30 dark:hover:text-error-400"
                aria-label="Remove stop"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">CSS</p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        <pre className="overflow-auto rounded-lg bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:bg-surface-800 dark:text-white">
          {fullCss}
        </pre>
      </div>
    </div>
  );
}
