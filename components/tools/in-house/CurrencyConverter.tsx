"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeftRight, RefreshCw } from "lucide-react";

import { useExchangeRates } from "@/hooks/useExchangeRates";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

// Pretty names for the most-used codes. Anything not in this map falls back
// to just the ISO code in the dropdown — still readable and the API can
// return ~160 currencies, so a full names table would be heavy for little
// gain.
const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  NGN: "Nigerian Naira",
  GHS: "Ghanaian Cedi",
  KES: "Kenyan Shilling",
  ZAR: "South African Rand",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  EGP: "Egyptian Pound",
};

function convertVia(rates: Record<string, number>, amount: number, from: string, to: string): number {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return 0;
  // The API returns USD-base rates: 1 USD = rates[CCY]. Convert source → USD → target.
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

function formatTimestamp(input: string | null): string {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CurrencyConverter() {
  const { rates, lastUpdated, source, loading, error, refresh } = useExchangeRates();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");

  // Sorted code list driven entirely by what the API returned. USD floats
  // to the top because it's the most common starting point.
  const codes = useMemo(() => {
    if (!rates) return [];
    return Object.keys(rates).sort((a, b) => {
      if (a === "USD") return -1;
      if (b === "USD") return 1;
      return a.localeCompare(b);
    });
  }, [rates]);

  const a = Number(amount) || 0;
  const result = rates ? convertVia(rates, a, from, to) : 0;
  const directRate = rates ? convertVia(rates, 1, from, to) : 0;
  const inverseRate = rates ? convertVia(rates, 1, to, from) : 0;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <ToolShell
      eyebrow="Finance"
      title="Currency Converter"
      description="Live mid-market rates from ExchangeRate-API, refreshed daily. Banks add a 1–4% spread on real transactions."
      onReset={() => {
        setAmount("100");
        setFrom("USD");
        setTo("NGN");
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
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={INPUT_CLASS}
            disabled={loading || codes.length === 0}
          >
            {codes.length === 0 ? (
              <option>{loading ? "Loading…" : "No rates"}</option>
            ) : (
              codes.map((c) => (
                <option key={c} value={c}>
                  {c}
                  {CURRENCY_NAMES[c] ? ` — ${CURRENCY_NAMES[c]}` : ""}
                </option>
              ))
            )}
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
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={INPUT_CLASS}
            disabled={loading || codes.length === 0}
          >
            {codes.length === 0 ? (
              <option>{loading ? "Loading…" : "No rates"}</option>
            ) : (
              codes.map((c) => (
                <option key={c} value={c}>
                  {c}
                  {CURRENCY_NAMES[c] ? ` — ${CURRENCY_NAMES[c]}` : ""}
                </option>
              ))
            )}
          </select>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          {a.toLocaleString()} {from}
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">
          {loading && !rates
            ? "…"
            : `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`}
        </p>
        {rates && (
          <p className="mt-2 text-xs text-surface-600 dark:text-surface-300">
            1 {from} = {directRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to} ·
            1 {to} = {inverseRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {from}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-error-50 px-3 py-2 text-xs text-error-800 dark:bg-error-500/15 dark:text-error-200">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-200 pt-3 text-[11px] text-surface-500 dark:border-surface-800 dark:text-surface-400">
        <span>
          Rates updated: <strong>{formatTimestamp(lastUpdated)}</strong>
          {source === "fallback" && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-warning-800 dark:bg-warning-500/15 dark:text-warning-200">
              <AlertTriangle className="h-3 w-3" />
              cached fallback — live update unavailable
            </span>
          )}
          {source === "live" && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-success-800 dark:bg-success-500/15 dark:text-success-200">
              live
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2 py-1 font-semibold text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
        >
          <RefreshCw className={loading ? "h-3 w-3 animate-spin" : "h-3 w-3"} />
          Refresh rates
        </button>
      </div>
    </ToolShell>
  );
}
