"use client";

import { useMemo, useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

type Filing = "single" | "married";

// US Federal income tax brackets, 2026 (placeholder — verify before launch).
const BRACKETS_2026 = {
  single: [
    { upTo: 11_600, rate: 0.10 },
    { upTo: 47_150, rate: 0.12 },
    { upTo: 100_525, rate: 0.22 },
    { upTo: 191_950, rate: 0.24 },
    { upTo: 243_725, rate: 0.32 },
    { upTo: 609_350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23_200, rate: 0.10 },
    { upTo: 94_300, rate: 0.12 },
    { upTo: 201_050, rate: 0.22 },
    { upTo: 383_900, rate: 0.24 },
    { upTo: 487_450, rate: 0.32 },
    { upTo: 731_200, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION = { single: 14_600, married: 29_200 };

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function calcTax(taxable: number, filing: Filing) {
  let owed = 0;
  let last = 0;
  const breakdown: { range: string; rate: number; tax: number }[] = [];
  for (const b of BRACKETS_2026[filing]) {
    if (taxable <= last) break;
    const slice = Math.min(taxable, b.upTo) - last;
    const tax = slice * b.rate;
    owed += tax;
    breakdown.push({
      range: `${fmtUSD(last)} – ${b.upTo === Infinity ? "+" : fmtUSD(b.upTo)}`,
      rate: b.rate,
      tax,
    });
    last = b.upTo;
  }
  return { owed, breakdown };
}

export function TaxCalculator() {
  const [income, setIncome] = useState("85000");
  const [filing, setFiling] = useState<Filing>("single");

  const { taxable, tax, marginal, effective, breakdown } = useMemo(() => {
    const inc = Math.max(0, Number(income) || 0);
    const taxable = Math.max(0, inc - STANDARD_DEDUCTION[filing]);
    const { owed, breakdown } = calcTax(taxable, filing);
    let marginal = 0;
    let last = 0;
    for (const b of BRACKETS_2026[filing]) {
      if (taxable > last) marginal = b.rate;
      last = b.upTo;
    }
    return {
      taxable,
      tax: owed,
      marginal,
      effective: inc > 0 ? owed / inc : 0,
      breakdown,
    };
  }, [income, filing]);

  const takeHome = (Number(income) || 0) - tax;

  return (
    <ToolShell
      eyebrow="Finance"
      title="US Federal Income Tax Calculator"
      description="2026 federal brackets only. Doesn't include state, FICA, or local taxes — use as a rough estimate."
      onReset={() => {
        setIncome("85000");
        setFiling("single");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <Field label="Annual gross income ($)">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
            min="0"
          />
        </Field>
        <Field label="Filing status">
          <select value={filing} onChange={(e) => setFiling(e.target.value as Filing)} className={INPUT_CLASS}>
            <option value="single">Single</option>
            <option value="married">Married, filing jointly</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Taxable income
          </p>
          <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">{fmtUSD(taxable)}</p>
          <p className="mt-1 text-[11px] text-surface-500">After std. deduction ({fmtUSD(STANDARD_DEDUCTION[filing])})</p>
        </div>
        <div className="rounded-2xl border border-error-200 bg-error-50 p-4 dark:border-error-500/30 dark:bg-error-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-error-700 dark:text-error-300">
            Federal tax
          </p>
          <p className="mt-1 text-xl font-bold text-error-700 dark:text-error-200">{fmtUSD(tax)}</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Marginal rate
          </p>
          <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">{(marginal * 100).toFixed(0)}%</p>
        </div>
        <div className="rounded-2xl border border-success-200 bg-success-50 p-4 dark:border-success-500/30 dark:bg-success-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
            Take-home (federal)
          </p>
          <p className="mt-1 text-xl font-bold text-success-700 dark:text-success-200">{fmtUSD(takeHome)}</p>
          <p className="mt-1 text-[11px] text-surface-500">Effective: {(effective * 100).toFixed(1)}%</p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Bracket breakdown
          </p>
          <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Range</th>
                  <th className="px-4 py-2 text-left font-semibold">Rate</th>
                  <th className="px-4 py-2 text-right font-semibold">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-700 dark:bg-surface-900">
                {breakdown.map((b) => (
                  <tr key={b.range}>
                    <td className="px-4 py-2 text-surface-700 dark:text-surface-200">{b.range}</td>
                    <td className="px-4 py-2 text-surface-700 dark:text-surface-200">{(b.rate * 100).toFixed(0)}%</td>
                    <td className="px-4 py-2 text-right font-semibold text-surface-900 dark:text-white">{fmtUSD(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] text-surface-500 dark:text-surface-400">
        Brackets reflect tax year 2026. Excludes FICA (Social Security + Medicare ≈ 7.65%), state income tax, and credits like EITC. Talk to a CPA for actual filing.
      </p>
    </ToolShell>
  );
}
