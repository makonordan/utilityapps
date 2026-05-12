"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

// Static USD-base mid-market rates as of 2026-05.
// To enable live rates: replace this constant with a fetch to a public API
// (e.g. exchangerate.host) and cache for 1 hour.
const RATES_VS_USD: Record<string, { rate: number; name: string }> = {
  USD: { rate: 1, name: "US Dollar" },
  EUR: { rate: 0.92, name: "Euro" },
  GBP: { rate: 0.79, name: "British Pound" },
  JPY: { rate: 152, name: "Japanese Yen" },
  CAD: { rate: 1.37, name: "Canadian Dollar" },
  AUD: { rate: 1.51, name: "Australian Dollar" },
  CHF: { rate: 0.91, name: "Swiss Franc" },
  CNY: { rate: 7.24, name: "Chinese Yuan" },
  INR: { rate: 83.4, name: "Indian Rupee" },
  NGN: { rate: 1450, name: "Nigerian Naira" },
  ZAR: { rate: 18.7, name: "South African Rand" },
  BRL: { rate: 5.05, name: "Brazilian Real" },
  MXN: { rate: 17.0, name: "Mexican Peso" },
  KRW: { rate: 1370, name: "South Korean Won" },
  SGD: { rate: 1.34, name: "Singapore Dollar" },
};

const CODES = Object.keys(RATES_VS_USD);

function convert(amount: number, from: string, to: string): number {
  const fromRate = RATES_VS_USD[from]?.rate ?? 1;
  const toRate = RATES_VS_USD[to]?.rate ?? 1;
  // Convert source → USD → target.
  return (amount / fromRate) * toRate;
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const a = Number(amount) || 0;
  const result = convert(a, from, to);
  const inverseRate = convert(1, to, from);
  const directRate = convert(1, from, to);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <ToolShell
      eyebrow="Finance"
      title="Currency Converter"
      description="15 major currencies, mid-market rates updated 2026-05. For real transactions, banks add a spread."
      onReset={() => {
        setAmount("100");
        setFrom("USD");
        setTo("EUR");
      }}
    >
      <Field label="Amount">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={INPUT_CLASS}
          inputMode="decimal"
          min="0"
        />
      </Field>

      <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Field label="From">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={INPUT_CLASS}>
            {CODES.map((c) => (
              <option key={c} value={c}>{c} — {RATES_VS_USD[c].name}</option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap currencies"
          className="hidden h-10 w-10 items-center justify-center self-end rounded-xl border border-surface-200 text-surface-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:inline-flex dark:border-surface-700 dark:text-surface-300 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <Field label="To">
          <select value={to} onChange={(e) => setTo(e.target.value)} className={INPUT_CLASS}>
            {CODES.map((c) => (
              <option key={c} value={c}>{c} — {RATES_VS_USD[c].name}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          {a.toLocaleString()} {from}
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">
          {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
        </p>
        <p className="mt-2 text-xs text-surface-600 dark:text-surface-300">
          1 {from} = {directRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to} ·
          1 {to} = {inverseRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {from}
        </p>
      </div>

      <p className="mt-4 text-[11px] text-surface-500 dark:text-surface-400">
        Mid-market rates as of 2026-05. Banks and card networks typically add a 1–4% spread.
      </p>
    </ToolShell>
  );
}
