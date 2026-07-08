"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

type Unit = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "bg-warning-500", text: "text-warning-700 dark:text-warning-300" },
  { max: 25, label: "Healthy weight", color: "bg-success-500", text: "text-success-700 dark:text-success-300" },
  { max: 30, label: "Overweight", color: "bg-warning-500", text: "text-warning-700 dark:text-warning-300" },
  { max: Infinity, label: "Obesity", color: "bg-error-500", text: "text-error-700 dark:text-error-300" },
];

function classify(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [pounds, setPounds] = useState("154");

  let bmi = 0;
  if (unit === "metric") {
    const h = Number(heightCm) / 100;
    const w = Number(weightKg);
    if (h > 0 && w > 0) bmi = w / (h * h);
  } else {
    const totalInches = Number(feet) * 12 + Number(inches);
    const heightMeters = totalInches * 0.0254;
    const weightKg2 = Number(pounds) * 0.453592;
    if (heightMeters > 0 && weightKg2 > 0) bmi = weightKg2 / (heightMeters * heightMeters);
  }

  const valid = Number.isFinite(bmi) && bmi > 0;
  const category = valid ? classify(bmi) : null;

  function reset() {
    setHeightCm("175");
    setWeightKg("70");
    setFeet("5");
    setInches("9");
    setPounds("154");
  }

  return (
    <ToolShell
      eyebrow="Health"
      title="BMI Calculator"
      description="Body Mass Index using WHO categories. Switch between metric and imperial."
      onReset={reset}
    >
      <div className="mb-4 inline-flex rounded-xl border border-surface-200 p-1 dark:border-surface-700">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={
              unit === u
                ? "rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white"
                : "rounded-lg px-3 py-1.5 text-xs font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            }
          >
            {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft-in/lb)"}
          </button>
        ))}
      </div>

      {unit === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Height (cm)">
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
          </Field>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Height (ft)">
            <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
          </Field>
          <Field label="Height (in)">
            <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
          </Field>
          <Field label="Weight (lb)">
            <input type="number" value={pounds} onChange={(e) => setPounds(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
          </Field>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Your BMI
        </p>
        <p className="mt-1 text-4xl font-bold text-primary-700 dark:text-primary-200">
          {valid ? bmi.toFixed(1) : "—"}
        </p>
        {category && (
          <p className={`mt-1 text-sm font-semibold ${category.text}`}>
            {category.label}
          </p>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
          WHO BMI categories
        </p>
        <ul className="space-y-1.5 text-sm">
          {[
            { label: "Underweight", range: "< 18.5", color: "bg-warning-500" },
            { label: "Healthy weight", range: "18.5 – 24.9", color: "bg-success-500" },
            { label: "Overweight", range: "25 – 29.9", color: "bg-warning-500" },
            { label: "Obesity", range: "≥ 30", color: "bg-error-500" },
          ].map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${c.color}`} />
              <span className="font-medium text-surface-800 dark:text-surface-100">{c.label}</span>
              <span className="ml-auto text-surface-500 dark:text-surface-400">{c.range}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-surface-500 dark:text-surface-400">
          BMI is a population-level screening tool, not a diagnosis. Talk to a clinician for individual health advice.
        </p>
      </div>
    </ToolShell>
  );
}
