"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Small client-side copy-to-clipboard button. Used by any server-
 * rendered surface (dashboard, create success) that needs a copy
 * action without turning the whole page into a client component.
 */
export function CopyLinkButton({
  value,
  className,
  label = "Copy link",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked (e.g. iframe without permission) — silent */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
        copied
          ? "border-success-500 text-success-700 dark:text-success-300"
          : "border-surface-200 text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200",
        className
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}
