"use client";

import { useState } from "react";
import { AlertTriangle, ExternalLink, Stamp } from "lucide-react";

import {
  DESTINATION_COUNTRIES,
  OFFICIAL_LINKS,
  PASSPORT_COUNTRIES,
  VISA_DATA_REVIEWED,
  VISA_STATUS_DESCRIPTIONS,
  VISA_STATUS_LABELS,
  lookupVisa,
  type VisaStatus,
} from "@/lib/visaData";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<VisaStatus, { bg: string; border: string; text: string; ring: string }> = {
  home: {
    bg: "bg-surface-100 dark:bg-surface-800",
    border: "border-surface-300 dark:border-surface-700",
    text: "text-surface-700 dark:text-surface-200",
    ring: "ring-surface-300",
  },
  vf: {
    bg: "bg-success-50 dark:bg-success-500/10",
    border: "border-success-300 dark:border-success-500/40",
    text: "text-success-800 dark:text-success-300",
    ring: "ring-success-500/30",
  },
  eta: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-300 dark:border-sky-500/40",
    text: "text-sky-800 dark:text-sky-300",
    ring: "ring-sky-500/30",
  },
  voa: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-300 dark:border-sky-500/40",
    text: "text-sky-800 dark:text-sky-300",
    ring: "ring-sky-500/30",
  },
  evisa: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-300 dark:border-amber-500/40",
    text: "text-amber-800 dark:text-amber-300",
    ring: "ring-amber-500/30",
  },
  visa: {
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-300 dark:border-red-500/40",
    text: "text-red-800 dark:text-red-300",
    ring: "ring-red-500/30",
  },
};

export function VisaLookup() {
  const [passport, setPassport] = useState("US");
  const [destination, setDestination] = useState("FR");

  const cell = lookupVisa(passport, destination);
  const passportInfo = PASSPORT_COUNTRIES.find((c) => c.code === passport);
  const destinationInfo = DESTINATION_COUNTRIES.find((c) => c.code === destination);
  const officialUrl = OFFICIAL_LINKS[destination];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">My passport is from</span>
          <select
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-base dark:border-surface-700 dark:bg-surface-900"
          >
            {PASSPORT_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">I'm travelling to</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-base dark:border-surface-700 dark:bg-surface-900"
          >
            {DESTINATION_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {cell ? (
        <div
          className={cn(
            "rounded-2xl border p-5",
            STATUS_STYLES[cell.status].bg,
            STATUS_STYLES[cell.status].border
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={cn("text-xs font-semibold uppercase tracking-wider", STATUS_STYLES[cell.status].text)}>
                {passportInfo?.flag} {passportInfo?.name} → {destinationInfo?.flag} {destinationInfo?.name}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">
                {VISA_STATUS_LABELS[cell.status]}
              </h2>
              <p className="mt-1 text-sm text-surface-700 dark:text-surface-200">
                {VISA_STATUS_DESCRIPTIONS[cell.status]}
              </p>
            </div>
            {cell.days && (
              <span className={cn(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                STATUS_STYLES[cell.status].bg,
                STATUS_STYLES[cell.status].text,
                "ring-1",
                STATUS_STYLES[cell.status].ring
              )}>
                Up to {cell.days} days
              </span>
            )}
          </div>

          {cell.notes && (
            <p className="mt-4 rounded-lg bg-white/60 px-3 py-2 text-sm text-surface-800 dark:bg-surface-900/40 dark:text-surface-100">
              {cell.notes}
            </p>
          )}

          {officialUrl && cell.status !== "home" && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Verify on the official site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-surface-200 bg-white px-4 py-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900">
          That combination isn't in our database yet. Check the destination's official immigration
          site for current rules.
        </p>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
        <p className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>This is guidance, not a guarantee.</strong> Visa rules change frequently and
            depend on stay length, purpose and your specific passport. Always confirm with the
            destination's official immigration website before booking — use the &ldquo;Verify&rdquo; button above.
          </span>
        </p>
      </div>

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Stamp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
        <span>
          Covers short tourist visits only (typically up to 30–90 days). Work, study, long-stay,
          residency and family visas have separate processes — check the embassy. Data last reviewed{" "}
          {VISA_DATA_REVIEWED}.
        </span>
      </p>
    </div>
  );
}
