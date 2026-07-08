"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
}

interface Props {
  bmacUrl: string | null;
  stripeOneTimeUrl: string | null;
  paystackOneTimeUrl: string | null;
  paypal: { accountName: string; email: string } | null;
  bank: BankDetails | null;
}

const PRESETS = [5, 25, 100] as const;

export function OneTimeDonation({
  bmacUrl,
  stripeOneTimeUrl,
  paystackOneTimeUrl,
  paypal,
  bank,
}: Props) {
  const [amount, setAmount] = useState<number>(25);
  const [custom, setCustom] = useState<string>("");

  const activePreset = custom === "" ? amount : null;
  const effectiveAmount = custom !== "" ? Number(custom) || 0 : amount;

  // Append ?amount=<n> to whichever URL we end up using so the
  // checkout side can pre-fill the field. BMaC's "Buy a coffee"
  // takes ?amount=N; Stripe/Paystack server routes parse the same.
  const withAmount = (url: string | null): string | null => {
    if (!url || effectiveAmount <= 0) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}amount=${effectiveAmount}`;
  };

  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        Choose an amount
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setAmount(p);
              setCustom("");
            }}
            className={cn(
              "rounded-2xl border px-3 py-3 text-center text-base font-semibold transition",
              activePreset === p
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-300"
                : "border-surface-200 text-surface-700 hover:border-primary-200 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700"
            )}
          >
            ${p}
          </button>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Custom amount</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-surface-500 dark:text-surface-400">
            $
          </span>
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="Custom amount"
            className="w-full rounded-2xl border border-surface-200 bg-white py-3 pl-7 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          />
        </div>
      </label>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <PayOption
          label="Buy Me a Coffee"
          note="Card, Apple Pay, Google Pay"
          href={withAmount(bmacUrl)}
          external
          accent="primary"
        />
        <PayOption
          label="Pay with card (Stripe)"
          note="International, all major cards"
          href={withAmount(stripeOneTimeUrl)}
          accent="accent"
        />
        <PayOption
          label="Paystack"
          note="Nigeria: card, transfer, USSD"
          href={withAmount(paystackOneTimeUrl)}
          accent="emerald"
        />
        {paypal && (
          <PayOption
            label="PayPal"
            note={`Send to ${paypal.email}`}
            href={null}
            accent="muted"
            inlineDetail={paypal.email}
          />
        )}
      </div>

      {bank && <BankDetailsCollapsible bank={bank} />}
    </div>
  );
}

function PayOption({
  label,
  note,
  href,
  external,
  accent,
  inlineDetail,
}: {
  label: string;
  note: string;
  href: string | null;
  external?: boolean;
  accent: "primary" | "accent" | "emerald" | "muted";
  inlineDetail?: string;
}) {
  const baseClass =
    "block rounded-2xl border bg-white p-4 text-left transition dark:bg-surface-900";
  const accentClass =
    accent === "primary"
      ? "border-surface-200 hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:hover:border-primary-700 dark:hover:bg-primary-500/5"
      : accent === "accent"
        ? "border-surface-200 hover:border-accent-300 hover:bg-accent-50/50 dark:border-surface-800 dark:hover:border-accent-700 dark:hover:bg-accent-500/5"
        : accent === "emerald"
          ? "border-surface-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-surface-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/5"
          : "border-surface-200 dark:border-surface-800";

  if (!href) {
    return (
      <div className={cn(baseClass, accentClass, "opacity-70")}>
        <span className="block text-sm font-semibold text-surface-900 dark:text-white">
          {label}
        </span>
        <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">
          {inlineDetail ?? note}
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(baseClass, accentClass)}
    >
      <span className="block text-sm font-semibold text-surface-900 dark:text-white">
        {label}
      </span>
      <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">
        {note}
      </span>
    </a>
  );
}

function BankDetailsCollapsible({ bank }: { bank: BankDetails }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-4 py-3 text-left text-sm font-semibold text-surface-800 transition hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-900/40 dark:text-surface-100 dark:hover:bg-surface-800/40"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true">🏦</span>
          Reveal Nigerian bank details
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <dl className="mt-3 grid gap-1.5 rounded-2xl bg-surface-50 px-4 py-3 text-sm dark:bg-surface-900/40">
          <Row label="Account name" value={bank.accountName} />
          <Row label="Bank" value={bank.bankName} />
          <Row label="Account number" value={bank.accountNumber} />
          <p className="mt-2 text-[11px] text-surface-500 dark:text-surface-400">
            After transferring, email{" "}
            <Link
              href="mailto:hello@utilityapps.site"
              className="font-medium underline decoration-dotted underline-offset-2"
            >
              hello@utilityapps.site
            </Link>{" "}
            with your name and we&rsquo;ll add you to the supporter wall (with your permission).
          </p>
        </dl>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </dt>
      <dd className="font-mono text-sm text-surface-900 dark:text-white">{value}</dd>
    </div>
  );
}
