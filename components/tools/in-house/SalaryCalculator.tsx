"use client";

import { useMemo, useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

type Period = "year" | "month" | "biweek" | "week" | "day" | "hour";
type Country = "US" | "UK" | "SG";

const PERIODS: { id: Period; label: string; perYear: number }[] = [
  { id: "year", label: "Year", perYear: 1 },
  { id: "month", label: "Month", perYear: 12 },
  { id: "biweek", label: "Two weeks", perYear: 26 },
  { id: "week", label: "Week", perYear: 52 },
  { id: "day", label: "Day (260 working)", perYear: 260 },
  { id: "hour", label: "Hour (40h × 52 wk)", perYear: 2080 },
];

const COUNTRIES: { id: Country; label: string; currency: string; symbol: string }[] = [
  { id: "US", label: "United States", currency: "USD", symbol: "$" },
  { id: "UK", label: "United Kingdom", currency: "GBP", symbol: "£" },
  { id: "SG", label: "Singapore", currency: "SGD", symbol: "S$" },
];

function fmtMoney(n: number, currency: string): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency, maximumFractionDigits: 0 });
}

// UK income tax bands + NI, tax year 2026/27 (England & Northern Ireland rates —
// placeholder, verify against HMRC before launch). Scotland uses different bands.
const UK_PERSONAL_ALLOWANCE = 12_570;
const UK_ALLOWANCE_TAPER_START = 100_000;
const UK_TAX_BANDS = [
  { upTo: 50_270, rate: 0.20, label: "Basic rate" },
  { upTo: 125_140, rate: 0.40, label: "Higher rate" },
  { upTo: Infinity, rate: 0.45, label: "Additional rate" },
];
const UK_NI_THRESHOLD = 12_570;
const UK_NI_UPPER_THRESHOLD = 50_270;
const UK_NI_MAIN_RATE = 0.08;
const UK_NI_UPPER_RATE = 0.02;

function ukPersonalAllowance(gross: number): number {
  if (gross <= UK_ALLOWANCE_TAPER_START) return UK_PERSONAL_ALLOWANCE;
  return Math.max(0, UK_PERSONAL_ALLOWANCE - (gross - UK_ALLOWANCE_TAPER_START) / 2);
}

function ukIncomeTax(gross: number): number {
  const taxable = Math.max(0, gross - ukPersonalAllowance(gross));
  let tax = 0;
  let last = 0;
  for (const band of UK_TAX_BANDS) {
    if (taxable <= last) break;
    tax += (Math.min(taxable, band.upTo) - last) * band.rate;
    last = band.upTo;
  }
  return tax;
}

function ukNationalInsurance(gross: number): number {
  const mainSlice = Math.max(0, Math.min(gross, UK_NI_UPPER_THRESHOLD) - UK_NI_THRESHOLD);
  const upperSlice = Math.max(0, gross - UK_NI_UPPER_THRESHOLD);
  return mainSlice * UK_NI_MAIN_RATE + upperSlice * UK_NI_UPPER_RATE;
}

// Singapore CPF employee contribution, ages 55 and under, 2026 rates
// (placeholder, verify against the CPF Board before launch).
const SG_OW_CEILING_MONTHLY = 7_400;
const SG_EMPLOYEE_CPF_RATE = 0.20;
const SG_EMPLOYER_CPF_RATE = 0.17;

function sgEmployeeCpf(annualGross: number): number {
  const monthlyGross = annualGross / 12;
  const cappedMonthly = Math.min(monthlyGross, SG_OW_CEILING_MONTHLY);
  return cappedMonthly * SG_EMPLOYEE_CPF_RATE * 12;
}

export function SalaryCalculator() {
  const [amount, setAmount] = useState("85000");
  const [period, setPeriod] = useState<Period>("year");
  const [country, setCountry] = useState<Country>("US");

  const periodInfo = PERIODS.find((p) => p.id === period)!;
  const countryInfo = COUNTRIES.find((c) => c.id === country)!;
  const annual = (Number(amount) || 0) * periodInfo.perYear;

  const takeHome = useMemo(() => {
    if (country === "UK") {
      const tax = ukIncomeTax(annual);
      const ni = ukNationalInsurance(annual);
      return {
        heading: "Estimated UK take-home pay",
        deductions: [
          { label: "Income tax", value: tax },
          { label: "National Insurance (Class 1)", value: ni },
        ],
        net: annual - tax - ni,
        note: "England & Northern Ireland rates, 2026/27 tax year (Scotland uses different bands). Estimate only — excludes pension contributions, student loan repayments, and other deductions.",
      };
    }
    if (country === "SG") {
      const cpf = sgEmployeeCpf(annual);
      return {
        heading: "Estimated Singapore take-home pay",
        deductions: [{ label: `Employee CPF (${(SG_EMPLOYEE_CPF_RATE * 100).toFixed(0)}%)`, value: cpf }],
        net: annual - cpf,
        note: `Employee CPF contribution for ages 55 and under, applied up to the S$${SG_OW_CEILING_MONTHLY.toLocaleString()}/month Ordinary Wage ceiling (2026 rates). Employers additionally contribute ${(SG_EMPLOYER_CPF_RATE * 100).toFixed(0)}% on top of your pay — that's not deducted from you. Singapore personal income tax is assessed annually, not withheld per paycheck, so it isn't included here.`,
      };
    }
    return null;
  }, [country, annual]);

  return (
    <ToolShell
      eyebrow="Finance"
      title="Salary Calculator"
      description="Convert between hourly, weekly, monthly, and annual pay. Add UK income tax + National Insurance or Singapore CPF for a take-home estimate."
      onReset={() => {
        setAmount("85000");
        setPeriod("year");
        setCountry("US");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_180px_180px]">
        <Field label={`Amount (${countryInfo.symbol})`}>
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
        <Field label="Country">
          <select value={country} onChange={(e) => setCountry(e.target.value as Country)} className={INPUT_CLASS}>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
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
              }`}>{fmtMoney(v, countryInfo.currency)}</p>
            </div>
          );
        })}
      </div>

      {takeHome && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            {takeHome.heading}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Gross (annual)
              </p>
              <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">{fmtMoney(annual, countryInfo.currency)}</p>
            </div>
            <div className="rounded-2xl border border-success-200 bg-success-50 p-4 dark:border-success-500/30 dark:bg-success-500/10">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
                Estimated net (annual)
              </p>
              <p className="mt-1 text-xl font-bold text-success-700 dark:text-success-200">{fmtMoney(takeHome.net, countryInfo.currency)}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            {takeHome.deductions.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-2.5 dark:border-surface-700 dark:bg-surface-800/40"
              >
                <span className="text-surface-700 dark:text-surface-300">{d.label}</span>
                <span className="font-semibold text-surface-900 dark:text-white">{fmtMoney(d.value, countryInfo.currency)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-surface-500 dark:text-surface-400">{takeHome.note}</p>
        </div>
      )}

      <p className="mt-4 text-[11px] text-surface-500 dark:text-surface-400">
        {country === "US"
          ? "Gross salary only. Doesn't deduct taxes, retirement, or benefits — use the Tax Calculator for a US take-home estimate."
          : "Period conversions above are gross pay. Select a period, then check the take-home estimate above for the tax/contribution breakdown."}
      </p>
    </ToolShell>
  );
}
