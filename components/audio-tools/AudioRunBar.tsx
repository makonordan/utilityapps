"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AudioRunResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  durationMs?: number;
}

interface AudioRunBarProps {
  canRun: boolean;
  isRunning: boolean;
  progress: number;
  status: string;
  error: string | null;
  result: AudioRunResult | null;
  onRun: () => void;
  runLabel: string;
  disabledHint?: string;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioRunBar({
  canRun,
  isRunning,
  progress,
  status,
  error,
  result,
  onRun,
  runLabel,
  disabledHint,
  className,
}: AudioRunBarProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canRun && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [canRun]);

  const state: "ready" | "running" | "disabled" = isRunning ? "running" : canRun ? "ready" : "disabled";

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={cardRef}
        className={cn(
          "rounded-2xl border-2 p-5 transition-colors",
          state === "running" && "border-primary-300 bg-primary-50/60 dark:border-primary-500/50 dark:bg-primary-500/10",
          state === "ready" && "border-primary-400 bg-gradient-to-br from-primary-50 to-white dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900",
          state === "disabled" && "border-dashed border-surface-300 bg-surface-50/60 dark:border-surface-700 dark:bg-surface-800/40"
        )}
      >
        <div className="space-y-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">Run</p>
            <p
              className={cn(
                "text-sm",
                state === "disabled" ? "text-surface-500 dark:text-surface-400" : "text-surface-700 dark:text-surface-200"
              )}
            >
              {state === "running"
                ? status || "Working…"
                : state === "ready"
                  ? `Ready! Click the blue "${runLabel}" button below to start.`
                  : (disabledHint ?? "Upload an audio file to start.")}
            </p>
          </div>
          <button
            type="button"
            onClick={onRun}
            disabled={state !== "ready"}
            aria-label={isRunning ? "Working" : runLabel}
            className={cn(
              "inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold shadow-lg transition focus:outline-none",
              state === "ready" &&
                "bg-primary-600 text-white ring-4 ring-primary-300/60 hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-primary-500/70 cursor-pointer",
              state === "running" && "bg-primary-600 text-white opacity-90 cursor-wait",
              state === "disabled" && "bg-surface-300 text-surface-700 cursor-not-allowed dark:bg-surface-700 dark:text-surface-300"
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Working…
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                {runLabel}
              </>
            )}
          </button>
        </div>

        {isRunning && (
          <div className="mt-4 space-y-1.5">
            <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-200"
                style={{ width: `${Math.max(2, Math.round(progress * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              {Math.round(progress * 100)}% — {status}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/60 dark:bg-error-500/10 dark:text-error-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {result && !isRunning && <ResultCard result={result} />}
    </div>
  );
}

function ResultCard({ result }: { result: AudioRunResult }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const objectUrl = URL.createObjectURL(result.blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [result.blob]);

  return (
    <div className="overflow-hidden rounded-2xl border border-success-300 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
      <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">Result</p>
      <p className="mt-1 truncate text-sm font-semibold text-surface-900 dark:text-white" title={result.filename}>
        {result.filename}
      </p>
      <p className="text-xs text-surface-700 dark:text-surface-300">
        {formatBytes(result.blob.size)}
        {result.durationMs !== undefined && ` · processed in ${(result.durationMs / 1000).toFixed(1)} s`}
      </p>
      {url && (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={url} controls className="mt-3 w-full" />
          <a
            href={url}
            download={result.filename}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </>
      )}
    </div>
  );
}
