"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function pmt(principal: number, annualRatePct: number, years: number): number {
  const months = years * 12;
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export function MortgageCalculator() {
  const [home, setHome] = useState("400000");
  const [down, setDown] = useState("80000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("4800");
  const [insurance, setInsurance] = useState("1500");
  const [hoa, setHoa] = useState("0");

  const homeNum = Number(home) || 0;
  const downNum = Number(down) || 0;
  const principal = Math.max(0, homeNum - downNum);
  const piPayment = pmt(principal, Number(rate), Number(years));
  const monthlyTax = (Number(tax) || 0) / 12;
  const monthlyIns = (Number(insurance) || 0) / 12;
  const monthlyHoa = Number(hoa) || 0;

  // PMI estimate: 0.5% / yr of loan amount when down payment < 20%.
  const downPct = homeNum > 0 ? (downNum / homeNum) * 100 : 0;
  const monthlyPmi = downPct < 20 ? (principal * 0.005) / 12 : 0;

  const totalPiti = piPayment + monthlyTax + monthlyIns + monthlyHoa + monthlyPmi;

  return (
    <ToolShell
      eyebrow="Finance"
      title="Mortgage Calculator"
      description="Full PITI: principal, interest, taxes, insurance, plus PMI estimate when applicable."
      onReset={() => {
        setHome("400000");
        setDown("80000");
        setRate("6.5");
        setYears("30");
        setTax("4800");
        setInsurance("1500");
        setHoa("0");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price ($)">
          <input type="number" value={home} onChange={(e) => setHome(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label={`Down payment ($)${downPct ? ` — ${downPct.toFixed(1)}%` : ""}`}>
          <input type="number" value={down} onChange={(e) => setDown(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="Interest rate (%)">
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={INPUT_CLASS} inputMode="decimal" step="0.01" min="0" />
        </Field>
        <Field label="Term (years)">
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={INPUT_CLASS} inputMode="numeric" min="1" />
        </Field>
        <Field label="Property tax / year ($)">
          <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="Insurance / year ($)">
          <input type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="HOA / month ($)" className="sm:col-span-2">
          <input type="number" value={hoa} onChange={(e) => setHoa(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Estimated monthly payment
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">{fmtUSD(totalPiti)}</p>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        {[
          { label: "Principal & interest", value: piPayment },
          { label: "Property tax", value: monthlyTax },
          { label: "Insurance", value: monthlyIns },
          monthlyPmi > 0 ? { label: "PMI estimate (down < 20%)", value: monthlyPmi } : null,
          monthlyHoa > 0 ? { label: "HOA", value: monthlyHoa } : null,
        ]
          .filter((x): x is { label: string; value: number } => x !== null)
          .map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-2.5 dark:border-surface-700 dark:bg-surface-800/40"
            >
              <span className="text-surface-700 dark:text-surface-300">{row.label}</span>
              <span className="font-semibold text-surface-900 dark:text-white">{fmtUSD(row.value)}</span>
            </div>
          ))}
      </div>
    </ToolShell>
  );
}
