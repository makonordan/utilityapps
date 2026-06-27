"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { formatBytes } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

/**
 * UI shell for the three browser-side Office↔PDF conversions:
 * Word→PDF, Excel→PDF, PDF→Word (text-only).
 *
 * Mirrors the shape of OfficeConverter (the older server-backed component)
 * so the per-tool page wiring stays nearly identical: pick a file, click,
 * download. The actual conversion is delegated to one of the
 * `lib/converters/*` modules that runs entirely in the browser.
 *
 * Differences from OfficeConverter (worth noting):
 *   - No server round-trip → no 10 MB cap, no rate limit, no auth check
 *   - File-size guidance is a soft warning, not a hard rejection
 *   - Progress comes from the converter module, not HTTP body bytes
 *   - The "your file uploads" warning is gone — files never leave
 */

export type BrowserConvertTarget = "word-to-pdf" | "excel-to-pdf" | "pdf-to-word";

interface Props {
  /** Which converter to use — drives the imported lib + filename suffix. */
  target: BrowserConvertTarget;
  /** Comma-separated MIME types for the file <input>'s accept attribute. */
  accept: string;
  /** Dropzone label. */
  dropLabel: string;
  /** Verb on the convert button. */
  actionLabel: string;
  /** Output extension (display only — converter sets the real filename). */
  outputExt: string;
  /** Visible warning explaining trade-offs (e.g. "text-only", "data tables"). */
  qualityNote: string;
  /** Soft file-size warning threshold (MB). Larger files still convert. */
  warnSizeMB?: number;
  /**
   * Tool ID — when set, a successful conversion fires a completion event
   * so the admin dashboard's completion-rate column reflects browser-side
   * tools too.
   */
  toolId?: string;
}

const EXTENSIONS_BY_TARGET: Record<BrowserConvertTarget, string[]> = {
  "word-to-pdf": [".docx", ".doc"],
  "excel-to-pdf": [".xlsx", ".xls"],
  "pdf-to-word": [".pdf"],
};

function isAllowed(file: File, target: BrowserConvertTarget): boolean {
  const lower = file.name.toLowerCase();
  return EXTENSIONS_BY_TARGET[target].some((ext) => lower.endsWith(ext));
}

export function BrowserOfficeConverter({
  target,
  accept,
  dropLabel,
  actionLabel,
  outputExt,
  qualityNote,
  warnSizeMB = 25,
  toolId,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  const pickFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!isAllowed(f, target)) {
      setError(
        `That file isn't a ${EXTENSIONS_BY_TARGET[target].join(" or ")} document.`
      );
      return;
    }
    setError(null);
    setDone(null);
    setProgress(null);
    setFile(f);
    setSizeWarning(
      f.size > warnSizeMB * 1024 * 1024
        ? `Large file (${formatBytes(f.size)}) — conversion may take 30+ seconds. Your browser stays responsive but the tab will work hard.`
        : null
    );
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setDone(null);
    setProgress({ percent: 0, stage: "Starting" });
    try {
      const onProgress = (percent: number, stage: string) =>
        setProgress({ percent, stage });

      let result: { blob: Blob; filename: string };
      // Dynamic imports keep each converter's deps out of the bundle of
      // pages that don't use it. A user who only ever uses Word→PDF
      // never downloads SheetJS.
      if (target === "word-to-pdf") {
        const mod = await import("@/lib/converters/wordToPdf");
        result = await mod.convertWordToPdfAndDownload(file, { onProgress });
      } else if (target === "excel-to-pdf") {
        const mod = await import("@/lib/converters/excelToPdf");
        result = await mod.convertExcelToPdfAndDownload(file, { onProgress });
      } else {
        const mod = await import("@/lib/converters/pdfToWord");
        result = await mod.convertPdfToWordAndDownload(file, { onProgress });
      }

      setDone(result.filename);
      setProgress(null);

      if (toolId) {
        void import("@/lib/track").then(({ trackToolCompletionClient }) =>
          trackToolCompletionClient(toolId)
        );
      }
    } catch (err) {
      console.error("[BrowserOfficeConverter]", err);
      setError(
        err instanceof Error
          ? `Couldn't convert: ${err.message}`
          : "Couldn't convert this file. It may be corrupt, password-protected, or in an unsupported format."
      );
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Quality-trade-off banner — important context for users coming from
          a paid conversion service, since they may expect higher fidelity. */}
      <p className="flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50/60 px-3 py-2.5 text-xs text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-primary-300" />
        <span>
          <strong>Browser-side conversion.</strong> {qualityNote}
        </span>
      </p>

      {!file ? (
        <PdfDropzone
          onFiles={pickFile}
          accept={accept}
          label={dropLabel}
          sublabel="Runs entirely in your browser — your file is never uploaded."
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">
            {file.name}
          </span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">
            {formatBytes(file.size)}
          </span>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setDone(null);
              setError(null);
              setProgress(null);
              setSizeWarning(null);
            }}
            aria-label="Remove"
            className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {sizeWarning && (
        <p className="rounded-xl border border-warning-200 bg-warning-50 px-3 py-2 text-xs text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
          {sizeWarning}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      {done && (
        <p className="flex items-start gap-2 rounded-xl bg-success-50 px-3 py-2.5 text-sm text-success-800 dark:bg-success-500/10 dark:text-success-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Downloaded <strong>{done}</strong>. Nothing was uploaded — the
            conversion ran inside this tab.
          </span>
        </p>
      )}

      {progress && (
        <div className="space-y-2 rounded-xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/40 dark:bg-primary-500/10">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="font-medium text-surface-900 dark:text-white">
              {progress.stage}
            </span>
            <span className="font-bold tabular-nums text-primary-700 dark:text-primary-300">
              {progress.percent}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-500/20">
            <div
              className="h-full rounded-full bg-primary-600 transition-[width] duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={convert}
          disabled={busy}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
            busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> {actionLabel}
            </>
          )}
        </button>
      )}

      {/* Display-only hint for users browsing the page before picking a file. */}
      {!file && (
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          Output: {outputExt} file. Conversion happens entirely in your browser.
        </p>
      )}
    </div>
  );
}
