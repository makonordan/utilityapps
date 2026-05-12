"use client";

import { useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

const TIP_PRESETS = [10, 15, 18, 20, 25];

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("2");

  const billNum = Number(bill) || 0;
  const tipNum = Number(tipPercent) || 0;
  const peopleNum = Math.max(1, Math.floor(Number(people) || 1));

  const tipAmount = (billNum * tipNum) / 100;
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  return (
    <ToolShell
      eyebrow="Calculator"
      title="Tip Calculator"
      description="Split bills and tips fairly across any group size, with one-tap presets."
      onReset={() => {
        setBill("50");
        setTipPercent("18");
        setPeople("2");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bill amount ($)">
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
            min="0"
          />
        </Field>
        <Field label="Tip (%)">
          <input
            type="number"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className={INPUT_CLASS}
            inputMode="decimal"
            min="0"
          />
        </Field>
        <Field label="People">
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className={INPUT_CLASS}
            inputMode="numeric"
            min="1"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TIP_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setTipPercent(String(p))}
            className={
              Number(tipPercent) === p
                ? "rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-surface-200 px-3 py-1 text-xs font-medium text-surface-700 hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
            }
          >
            {p}%
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Total bill
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-200">{fmtUSD(total)}</p>
          <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
            Tip: {fmtUSD(tipAmount)}
          </p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Per person ({peopleNum})
          </p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{fmtUSD(perPerson)}</p>
          <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
            Tip per person: {fmtUSD(tipPerPerson)}
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
