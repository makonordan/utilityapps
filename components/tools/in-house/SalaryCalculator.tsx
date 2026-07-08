"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

type Period = "year" | "month" | "biweek" | "week" | "day" | "hour";

const PERIODS: { id: Period; label: string; perYear: number }[] = [
  { id: "year", label: "Year", perYear: 1 },
  { id: "month", label: "Month", perYear: 12 },
  { id: "biweek", label: "Two weeks", perYear: 26 },
  { id: "week", label: "Week", perYear: 52 },
  { id: "day", label: "Day (260 working)", perYear: 260 },
  { id: "hour", label: "Hour (40h × 52 wk)", perYear: 2080 },
];

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function SalaryCalculator() {
  const [amount, setAmount] = useState("85000");
  const [period, setPeriod] = useState<Period>("year");

  const periodInfo = PERIODS.find((p) => p.id === period)!;
  const annual = (Number(amount) || 0) * periodInfo.perYear;

  return (
    <ToolShell
      eyebrow="Finance"
      title="Salary Calculator"
      description="Convert between hourly, weekly, monthly, and annual pay using a 40h × 52 week year."
      onReset={() => {
        setAmount("85000");
        setPeriod("year");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <Field label="Amount ($)">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
            min="0"
          />
        </Field>
        <Field label="Per">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={INPUT_CLASS}>
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PERIODS.map((p) => {
          const v = annual / p.perYear;
          const isCurrent = p.id === period;
          return (
            <div
              key={p.id}
              className={
                isCurrent
                  ? "rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10"
                  : "rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60"
              }
            >
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${
                isCurrent ? "text-primary-700 dark:text-primary-300" : "text-surface-500 dark:text-surface-400"
              }`}>
                {p.label}
              </p>
              <p className={`mt-1 text-2xl font-bold ${
                isCurrent ? "text-primary-700 dark:text-primary-200" : "text-surface-900 dark:text-white"
              }`}>{fmtUSD(v)}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-surface-500 dark:text-surface-400">
        Gross salary only. Doesn&apos;t deduct taxes, retirement, or benefits — use the Tax Calculator for a take-home estimate.
      </p>
    </ToolShell>
  );
}
