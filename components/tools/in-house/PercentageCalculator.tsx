"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ResultCard, ToolShell } from "./ToolShell";

type Mode = "percentOf" | "isWhatPercent" | "percentChange";

const MODES: { id: Mode; label: string }[] = [
  { id: "percentOf", label: "What is X% of Y?" },
  { id: "isWhatPercent", label: "X is what % of Y?" },
  { id: "percentChange", label: "% change from X to Y" },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [x, setX] = useState("20");
  const [y, setY] = useState("80");

  const a = Number(x);
  const b = Number(y);
  const valid = !Number.isNaN(a) && !Number.isNaN(b);

  let result = NaN;
  let formula = "";
  if (valid) {
    if (mode === "percentOf") {
      result = (a / 100) * b;
      formula = `${fmt(a)}% of ${fmt(b)} = ${fmt(result)}`;
    } else if (mode === "isWhatPercent") {
      result = (a / b) * 100;
      formula = `${fmt(a)} is ${fmt(result)}% of ${fmt(b)}`;
    } else {
      result = ((b - a) / a) * 100;
      formula = `From ${fmt(a)} to ${fmt(b)} is a ${fmt(result)}% change`;
    }
  }

  return (
    <ToolShell
      eyebrow="Calculator"
      title="Percentage Calculator"
      description="Three of the most common percentage problems, in one calculator."
      onReset={() => {
        setX("20");
        setY("80");
      }}
    >
      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={
              mode === m.id
                ? "rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                : "rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-200"
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={mode === "percentChange" ? "From (X)" : mode === "isWhatPercent" ? "Number (X)" : "Percent (%)"}>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
          />
        </Field>
        <Field label={mode === "percentChange" ? "To (Y)" : mode === "isWhatPercent" ? "Total (Y)" : "Number (Y)"}>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
          />
        </Field>
      </div>

      <div className="mt-5">
        <ResultCard label="Result" copyValue={fmt(result)}>
          <p className="text-3xl font-bold text-primary-700 dark:text-primary-200">{fmt(result)}</p>
          {valid && <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{formula}</p>}
        </ResultCard>
      </div>
    </ToolShell>
  );
}
