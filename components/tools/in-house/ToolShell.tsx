"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolShellProps {
  /** Top-of-card eyebrow label, e.g. "Calculator", "Encoder". */
  eyebrow?: string;
  title: string;
  /** Short tagline shown under the title. */
  description?: string;
  children: ReactNode;
  /** Optional reset handler. Hides the reset button when omitted. */
  onReset?: () => void;
  className?: string;
}

/**
 * Standardised card wrapper for the in-house non-image tools. Keeps the
 * spacing, colours, and reset affordance consistent so each tool component
 * can focus on its own controls and output.
 */
export function ToolShell({
  eyebrow,
  title,
  description,
  children,
  onReset,
  className,
}: ToolShellProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-surface-200 bg-white p-6 shadow-card sm:p-8 dark:border-surface-800 dark:bg-surface-900",
        className
      )}
    >
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{description}</p>
          )}
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

/** Small clipboard-copy button used by encoders, generators, etc. */
export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers without clipboard API — silently no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-surface-300 dark:disabled:bg-surface-700",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** Labeled form field used across tool inputs. */
export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-surface-500 dark:text-surface-400">{hint}</p>}
    </div>
  );
}

/** Standard input class string applied to <input> and <select>. Reused across tools. */
export const INPUT_CLASS =
  "w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white";

/** Standard textarea class string. */
export const TEXTAREA_CLASS =
  "w-full min-h-[180px] rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 font-mono text-sm text-surface-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white";

/** Result card used by tools that output a single value (encoders, calculators). */
export function ResultCard({
  label,
  children,
  copyValue,
  className,
}: {
  label: string;
  children: ReactNode;
  copyValue?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          {label}
        </p>
        {copyValue !== undefined && <CopyButton value={copyValue} />}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
