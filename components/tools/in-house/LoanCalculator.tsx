"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const months = years * 12;
  if (months <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function LoanCalculator() {
  const [principal, setPrincipal] = useState("25000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("5");

  const p = Number(principal);
  const r = Number(rate);
  const y = Number(years);
  const monthly = monthlyPayment(p, r, y);
  const total = monthly * y * 12;
  const interest = total - p;

  return (
    <ToolShell
      eyebrow="Finance"
      title="Loan Calculator"
      description="Standard amortising loan: monthly payment, total interest paid, and total cost over the term."
      onReset={() => {
        setPrincipal("25000");
        setRate("7.5");
        setYears("5");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount ($)">
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="Annual interest rate (%)">
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={INPUT_CLASS} inputMode="decimal" step="0.01" min="0" />
        </Field>
        <Field label="Term (years)">
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Monthly payment
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-200">{fmtUSD(monthly)}</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Total interest
          </p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{fmtUSD(interest)}</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Total paid
          </p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{fmtUSD(total)}</p>
        </div>
      </div>
    </ToolShell>
  );
}
