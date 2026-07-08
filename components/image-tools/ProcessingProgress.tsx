"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProcessingProgressProps {
  /** 0..100 */
  progress: number;
  currentFile: string;
  totalFiles: number;
  processedFiles: number;
  /** Verb shown in the header e.g. "Compressing", "Converting". */
  stage: string;
  onCancel?: () => void;
  className?: string;
}

function formatRemaining(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "calculating…";
  if (seconds < 1) return "<1s left";
  if (seconds < 60) return `~${Math.round(seconds)}s left`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s === 0 ? `~${m}m left` : `~${m}m ${s}s left`;
}

function truncateMiddle(name: string, max = 36): string {
  if (name.length <= max) return name;
  const head = Math.ceil((max - 1) / 2);
  const tail = Math.floor((max - 1) / 2);
  return `${name.slice(0, head)}…${name.slice(name.length - tail)}`;
}

export function ProcessingProgress({
  progress,
  currentFile,
  totalFiles,
  processedFiles,
  stage,
  onCancel,
  className,
}: ProcessingProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const startedAt = useRef<number>(Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  // Linear extrapolation: if 30 % done in 6 s, total ≈ 20 s, remaining ≈ 14 s.
  const elapsedMs = now - startedAt.current;
  const ratePerMs = clamped > 0 ? clamped / elapsedMs : 0;
  const remainingMs = ratePerMs > 0 ? (100 - clamped) / ratePerMs : Infinity;
  const remainingSecs = remainingMs / 1000;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white">
          <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
          <span>{stage}…</span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-xs font-medium text-surface-600 transition hover:border-error-300 hover:bg-error-50 hover:text-error-700 dark:border-surface-700 dark:text-surface-300 dark:hover:border-error-500/60 dark:hover:bg-error-500/10 dark:hover:text-error-200"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-[width] duration-300 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-surface-600 dark:text-surface-300">
          <span className="font-medium text-surface-900 dark:text-white">
            {totalFiles > 1
              ? `Processing ${processedFiles + 1} of ${totalFiles} files`
              : "Processing file"}
          </span>
          <span className="tabular-nums">{Math.round(clamped)}%</span>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px] text-surface-500 dark:text-surface-400">
          <span className="truncate" title={currentFile}>
            {truncateMiddle(currentFile)}
          </span>
          <span className="tabular-nums">{formatRemaining(remainingSecs)}</span>
        </div>
      </div>
    </div>
  );
}
