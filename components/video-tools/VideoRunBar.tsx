"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, Loader2, Sparkles } from "lucide-react";

import { formatVideoSize } from "@/lib/videoTools";
import { cn } from "@/lib/utils";

export interface VideoRunResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  /** Used for the "shrunk from X to Y" line on the compressor + similar tools. */
  originalSize?: number;
  durationMs?: number;
  /** When set, the result is rendered as <audio> instead of <video>. */
  audio?: boolean;
}

interface VideoRunBarProps {
  /** Whether the user has provided enough input to allow running. */
  canRun: boolean;
  isRunning: boolean;
  /** 0..1 — combined download + transcode estimate, owned by the caller. */
  progress: number;
  /** Short status sentence, e.g. "Loading video engine…" or "Encoding…". */
  status: string;
  error: string | null;
  result: VideoRunResult | null;
  onRun: () => void;
  /** Button label, e.g. "Compress video" or "Trim video". */
  runLabel: string;
  /** Used for the disabled-state explainer above the run button. */
  disabledHint?: string;
  className?: string;
}

export function VideoRunBar({
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
}: VideoRunBarProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // When a file is loaded for the first time, scroll the run card into view so
  // the user immediately sees the next step. Doesn't re-fire on each render
  // because canRun stays true once a file is loaded.
  useEffect(() => {
    if (canRun && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [canRun]);

  // Pick a single visual state so the className composition stays simple and
  // never accidentally evaluates to "white-on-white".
  const state: "ready" | "running" | "disabled" = isRunning
    ? "running"
    : canRun
      ? "ready"
      : "disabled";

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
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
              Run
            </p>
            <p
              className={cn(
                "text-sm",
                state === "disabled"
                  ? "text-surface-500 dark:text-surface-400"
                  : "text-surface-700 dark:text-surface-200"
              )}
            >
              {state === "running"
                ? status || "Working…"
                : state === "ready"
                  ? `Ready! Click the blue "${runLabel}" button below to start.`
                  : (disabledHint ?? "Upload a video to start.")}
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
              state === "running" &&
                "bg-primary-600 text-white opacity-90 cursor-wait",
              state === "disabled" &&
                "bg-surface-300 text-surface-700 cursor-not-allowed dark:bg-surface-700 dark:text-surface-300"
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

function ResultCard({ result }: { result: VideoRunResult }) {
  // Create the blob URL once per result, revoke when the result changes or on unmount.
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    const objectUrl = URL.createObjectURL(result.blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [result.blob]);

  const sizeDelta =
    result.originalSize !== undefined
      ? `${formatVideoSize(result.originalSize)} → ${formatVideoSize(result.blob.size)}`
      : formatVideoSize(result.blob.size);
  const savings =
    result.originalSize !== undefined && result.originalSize > 0
      ? Math.round(((result.originalSize - result.blob.size) / result.originalSize) * 100)
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-success-300 bg-success-50/60 dark:border-success-500/40 dark:bg-success-500/10">
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_220px]">
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          {result.audio ? (
            <div className="flex h-full w-full items-center justify-center bg-surface-900 px-4">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              {url && <audio src={url} controls className="w-full" />}
            </div>
          ) : (
            url && <video src={url} className="h-full w-full object-contain" controls />
          )}
        </div>
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
              Result
            </p>
            <p
              className="truncate text-sm font-semibold text-surface-900 dark:text-white"
              title={result.filename}
            >
              {result.filename}
            </p>
            <p className="text-xs text-surface-700 dark:text-surface-300">{sizeDelta}</p>
            {savings !== null && (
              <p className="text-xs font-semibold text-success-700 dark:text-success-300">
                {savings >= 0 ? `Saved ${savings}%` : `Grew ${Math.abs(savings)}%`}
              </p>
            )}
            {result.durationMs !== undefined && (
              <p className="text-[11px] text-surface-500 dark:text-surface-400">
                Processed in {(result.durationMs / 1000).toFixed(1)} s
              </p>
            )}
          </div>
          {url && (
            <a
              href={url}
              download={result.filename}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
