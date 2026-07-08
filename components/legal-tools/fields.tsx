"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small set of shared form primitives used by all Legal tool forms.
 * Keeps every tool's form visually consistent without dragging in a
 * heavier form library.
 */

const INPUT_CLS =
  "mt-1 block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-100";

const LABEL_CLS =
  "block text-sm font-semibold text-surface-700 dark:text-surface-200";

const HELP_CLS = "mt-1 text-xs text-surface-500 dark:text-surface-400";

interface BaseProps {
  label: string;
  help?: string;
  className?: string;
}

export function FieldText({
  label,
  help,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "date" | "number" | "tel";
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={LABEL_CLS}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLS}
      />
      {help && <p className={HELP_CLS}>{help}</p>}
    </label>
  );
}

export function FieldTextarea({
  label,
  help,
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={LABEL_CLS}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={cn(INPUT_CLS, "resize-y")}
      />
      {help && <p className={HELP_CLS}>{help}</p>}
    </label>
  );
}

export function FieldSelect<T extends string>({
  label,
  help,
  value,
  onChange,
  options,
  className,
}: BaseProps & {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className={cn("block", className)}>
      <span className={LABEL_CLS}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={INPUT_CLS}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {help && <p className={HELP_CLS}>{help}</p>}
    </label>
  );
}

export function FieldCheckbox({
  label,
  help,
  checked,
  onChange,
  className,
}: Omit<BaseProps, "label"> & {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-2.5", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-700"
      />
      <span className="flex-1">
        <span className="text-sm text-surface-800 dark:text-surface-100">{label}</span>
        {help && <span className={cn(HELP_CLS, "block")}>{help}</span>}
      </span>
    </label>
  );
}

/** Stacks form sections with consistent spacing + a small heading. */
export function FormSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      {title && (
        <legend className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          {title}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
