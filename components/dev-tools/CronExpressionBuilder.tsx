"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

const PRESETS: { id: string; label: string; expr: string }[] = [
  { id: "every-min", label: "Every minute", expr: "* * * * *" },
  { id: "every-hour", label: "Every hour", expr: "0 * * * *" },
  { id: "every-day-9", label: "Every day at 9 AM", expr: "0 9 * * *" },
  { id: "weekdays-8", label: "Weekdays at 8 AM", expr: "0 8 * * 1-5" },
  { id: "monday-9", label: "Mondays at 9 AM", expr: "0 9 * * 1" },
  { id: "first-of-month", label: "1st of month at midnight", expr: "0 0 1 * *" },
  { id: "every-15-min", label: "Every 15 minutes", expr: "*/15 * * * *" },
  { id: "every-sunday", label: "Every Sunday at midnight", expr: "0 0 * * 0" },
];

export function CronExpressionBuilder() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ default: cronstrue }, parserMod] = await Promise.all([
          import("cronstrue"),
          import("cron-parser"),
        ]);
        if (cancelled) return;
        const desc = cronstrue.toString(expr, { use24HourTimeFormat: false });
        setDescription(desc);
        const parser = (parserMod as unknown as { default: typeof parserMod }).default ?? parserMod;
        // cron-parser exports `parseExpression`.
        const intervalCtor = (parser as unknown as { parseExpression: (e: string) => { next: () => { toDate: () => Date } } }).parseExpression(expr);
        const upcoming: string[] = [];
        for (let i = 0; i < 5; i++) {
          const d = intervalCtor.next().toDate();
          upcoming.push(
            d.toLocaleString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
        setNextRuns(upcoming);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid cron expression.");
        setDescription("");
        setNextRuns([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [expr]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(expr);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const fields = useMemo(() => expr.split(/\s+/), [expr]);
  const fieldLabels = ["Minute", "Hour", "Day (month)", "Month", "Day (week)"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Presets</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setExpr(p.expr)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition",
                expr === p.expr
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 hover:border-primary-300 dark:border-surface-800 dark:hover:border-primary-700"
              )}
            >
              {p.label}
              <span className="mt-1 block font-mono text-[10px] text-surface-500 dark:text-surface-400">{p.expr}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">Cron expression</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-2 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-3 grid gap-1 sm:grid-cols-5">
          {fieldLabels.map((label, i) => (
            <div key={label} className="rounded-lg border border-surface-200 bg-white p-2 text-center text-xs dark:border-surface-700 dark:bg-surface-900">
              <p className="text-[10px] uppercase tracking-wider text-surface-500 dark:text-surface-400">{label}</p>
              <p className="mt-0.5 font-mono font-semibold text-surface-900 dark:text-white">{fields[i] ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Description</p>
        <p className={cn(
          "rounded-lg border px-3 py-2 text-sm",
          error
            ? "border-error-300 bg-error-50/40 text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-200"
            : "border-surface-200 bg-surface-50 text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        )}>
          {error ?? description ?? ""}
        </p>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Next 5 fire times (your local timezone)
        </p>
        {nextRuns.length > 0 ? (
          <ul className="space-y-1 font-mono text-sm">
            {nextRuns.map((d, i) => (
              <li key={i} className="rounded border border-surface-200 bg-surface-50 px-3 py-1.5 text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white">
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-surface-500 dark:text-surface-400">No fire times computed.</p>
        )}
      </div>
    </div>
  );
}
