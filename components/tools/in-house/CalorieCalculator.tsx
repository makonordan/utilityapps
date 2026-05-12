"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

type Unit = "metric" | "imperial";
type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Goal = "lose" | "maintain" | "gain";

const ACTIVITY_FACTORS: Record<Activity, { factor: number; label: string; desc: string }> = {
  "sedentary": { factor: 1.2, label: "Sedentary", desc: "Little or no exercise" },
  "light": { factor: 1.375, label: "Lightly active", desc: "1–3 days/week of light exercise" },
  "moderate": { factor: 1.55, label: "Moderately active", desc: "3–5 days/week of moderate exercise" },
  "active": { factor: 1.725, label: "Very active", desc: "6–7 days/week of hard exercise" },
  "very-active": { factor: 1.9, label: "Extremely active", desc: "Physical job + daily training" },
};

const GOAL_DELTA: Record<Goal, { delta: number; label: string; macro: string }> = {
  lose: { delta: -500, label: "Lose ~0.5 kg / week", macro: "protein-focused, lower carbs" },
  maintain: { delta: 0, label: "Maintain weight", macro: "balanced macros" },
  gain: { delta: 300, label: "Gain ~0.3 kg / week", macro: "carb-focused, surplus protein" },
};

export function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [pounds, setPounds] = useState("154");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  // Mifflin-St Jeor — most accurate of the common BMR formulas.
  const ageNum = Number(age);
  let weight = unit === "metric" ? Number(weightKg) : Number(pounds) * 0.453592;
  let height = unit === "metric" ? Number(heightCm) : (Number(feet) * 12 + Number(inches)) * 2.54;
  if (!Number.isFinite(weight)) weight = 0;
  if (!Number.isFinite(height)) height = 0;

  const bmr =
    weight > 0 && height > 0 && ageNum > 0
      ? sex === "male"
        ? 10 * weight + 6.25 * height - 5 * ageNum + 5
        : 10 * weight + 6.25 * height - 5 * ageNum - 161
      : 0;

  const tdee = bmr * ACTIVITY_FACTORS[activity].factor;
  const target = tdee + GOAL_DELTA[goal].delta;

  // Macro split: 30% protein, 40% carbs, 30% fat for maintenance.
  const proteinPctByGoal = goal === "lose" ? 0.4 : goal === "gain" ? 0.25 : 0.3;
  const fatPctByGoal = 0.3;
  const carbPctByGoal = 1 - proteinPctByGoal - fatPctByGoal;
  const proteinGrams = (target * proteinPctByGoal) / 4;
  const carbGrams = (target * carbPctByGoal) / 4;
  const fatGrams = (target * fatPctByGoal) / 9;

  function reset() {
    setUnit("metric");
    setSex("male");
    setAge("30");
    setHeightCm("175");
    setWeightKg("70");
    setFeet("5");
    setInches("9");
    setPounds("154");
    setActivity("moderate");
    setGoal("maintain");
  }

  return (
    <ToolShell
      eyebrow="Health"
      title="Calorie Calculator"
      description="Mifflin-St Jeor BMR + TDEE with goal-aware calorie target and macro split."
      onReset={reset}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-surface-200 p-1 dark:border-surface-700">
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
              {u === "metric" ? "Metric" : "Imperial"}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-xl border border-surface-200 p-1 dark:border-surface-700">
          {(["male", "female"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSex(s)}
              className={
                sex === s
                  ? "rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold capitalize text-white"
                  : "rounded-lg px-3 py-1.5 text-xs font-medium capitalize text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Age">
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={INPUT_CLASS} inputMode="numeric" />
        </Field>
        {unit === "metric" ? (
          <>
            <Field label="Height (cm)">
              <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
            </Field>
            <Field label="Weight (kg)">
              <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
            </Field>
          </>
        ) : (
          <>
            <Field label="Height (ft / in)">
              <div className="flex gap-2">
                <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
                <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
              </div>
            </Field>
            <Field label="Weight (lb)">
              <input type="number" value={pounds} onChange={(e) => setPounds(e.target.value)} className={INPUT_CLASS} inputMode="decimal" />
            </Field>
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Activity level">
          <select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className={INPUT_CLASS}>
            {Object.entries(ACTIVITY_FACTORS).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — {v.desc}</option>
            ))}
          </select>
        </Field>
        <Field label="Goal">
          <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className={INPUT_CLASS}>
            {Object.entries(GOAL_DELTA).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">BMR</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{Math.round(bmr)} kcal</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">TDEE (maintenance)</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{Math.round(tdee)} kcal</p>
        </div>
        <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">Target ({GOAL_DELTA[goal].label})</p>
          <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-200">{Math.round(target)} kcal</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Suggested macros
        </p>
        <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">{GOAL_DELTA[goal].macro}</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
          <li className="rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-800/60">
            <span className="block text-[11px] font-semibold uppercase text-surface-500 dark:text-surface-400">Protein</span>
            <span className="font-bold text-surface-900 dark:text-white">{Math.round(proteinGrams)} g</span>
            <span className="ml-2 text-xs text-surface-500">({Math.round(proteinPctByGoal * 100)}%)</span>
          </li>
          <li className="rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-800/60">
            <span className="block text-[11px] font-semibold uppercase text-surface-500 dark:text-surface-400">Carbs</span>
            <span className="font-bold text-surface-900 dark:text-white">{Math.round(carbGrams)} g</span>
            <span className="ml-2 text-xs text-surface-500">({Math.round(carbPctByGoal * 100)}%)</span>
          </li>
          <li className="rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-800/60">
            <span className="block text-[11px] font-semibold uppercase text-surface-500 dark:text-surface-400">Fat</span>
            <span className="font-bold text-surface-900 dark:text-white">{Math.round(fatGrams)} g</span>
            <span className="ml-2 text-xs text-surface-500">({Math.round(fatPctByGoal * 100)}%)</span>
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
