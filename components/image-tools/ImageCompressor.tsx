"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Options as ICOptions } from "browser-image-compression";
import {
  Archive,
  CheckCircle2,
  Download,
  FileImage,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import { ProcessingProgress } from "@/components/image-tools/ProcessingProgress";
import { BeforeAfterSlider } from "@/components/image-tools/BeforeAfterSlider";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  downloadFile,
  downloadZip,
  formatFileSize,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type FileStatus = "pending" | "processing" | "done" | "error";

interface ProcessingFile {
  id: string;
  file: File;
  originalBlob: Blob;
  compressedBlob: Blob | null;
  originalSize: number;
  compressedSize: number | null;
  status: FileStatus;
  error?: string;
  previewUrl: string;
  compressedUrl: string | null;
}

type OutputFormat = "original" | "jpeg" | "png" | "webp";
type Mode = "single" | "bulk";

const TOOL_ID = "compress-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

let __pid = 0;
const nextId = () => `cf-${++__pid}-${Date.now()}`;

function qualityLabel(q: number): string {
  if (q <= 30) return "Aggressive";
  if (q <= 60) return "Balanced";
  if (q <= 85) return "High Quality";
  return "Near Lossless";
}

function qualityHint(q: number): string {
  if (q <= 30) return "Smallest files, visible quality loss";
  if (q <= 60) return "Good size reduction with mild quality trade-off";
  if (q <= 85) return "Hard to tell from the original";
  return "Visually identical to the original";
}

function savingsTone(savedPct: number): {
  label: string;
  className: string;
} {
  if (savedPct > 70)
    return {
      label: "Excellent compression",
      className:
        "bg-success-100 text-success-800 dark:bg-success-500/15 dark:text-success-300",
    };
  if (savedPct >= 40)
    return {
      label: "Good compression",
      className:
        "bg-primary-100 text-primary-800 dark:bg-primary-500/15 dark:text-primary-200",
    };
  if (savedPct >= 10)
    return {
      label: "Moderate compression",
      className:
        "bg-warning-100 text-warning-800 dark:bg-warning-500/15 dark:text-warning-300",
    };
  return {
    label: "Already optimized",
    className:
      "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
  };
}

/**
 * Pure-string SVG minifier — strips comments, redundant whitespace and the
 * XML prolog, since browser-image-compression can't process vector files.
 */
function minifySvg(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .replace(/<\?xml[\s\S]*?\?>/g, "") // XML prolog
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "") // DOCTYPE
    .replace(/>\s+</g, "><") // whitespace between tags
    .replace(/\s{2,}/g, " ") // collapse whitespace
    .trim();
}

function suggestedOutputName(file: File, outputFormat: OutputFormat): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const isSvg = file.type === "image/svg+xml";
  if (isSvg) return `${stem}-min.svg`;

  const ext =
    outputFormat === "original"
      ? (dot > 0 ? file.name.slice(dot + 1) : "jpg")
      : outputFormat;
  return `${stem}-compressed.${ext}`;
}

function buildOptions(
  quality: number,
  outputFormat: OutputFormat,
  maxWidthHeight: number,
  stripMetadata: boolean,
  signal: AbortSignal,
  onProgress: (p: number) => void
): ICOptions {
  return {
    // Quality buckets the user spec called for.
    maxSizeMB: quality < 30 ? 0.1 : quality < 60 ? 0.5 : 2,
    maxWidthOrHeight: maxWidthHeight > 0 ? maxWidthHeight : undefined,
    useWebWorker: true,
    fileType: outputFormat === "original" ? undefined : `image/${outputFormat}`,
    initialQuality: Math.min(1, Math.max(0.05, quality / 100)),
    preserveExif: !stripMetadata,
    signal,
    onProgress,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ImageCompressor() {
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [maxWidthHeight, setMaxWidthHeight] = useState(0);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<Mode>("single");

  // Live progress bookkeeping for the ProcessingProgress component.
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");

  // Used to cancel an in-flight compression run.
  const abortRef = useRef<AbortController | null>(null);

  // Free all object URLs on unmount.
  useEffect(() => {
    return () => {
      for (const f of files) {
        URL.revokeObjectURL(f.previewUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      }
    };
    // We intentionally only run this on unmount. Per-file cleanup happens
    // inline when files are replaced/removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake from the drop zone ─────
  const onFilesSelected = useCallback(
    (selected: File[]) => {
      const newItems: ProcessingFile[] = selected.map((f) => ({
        id: nextId(),
        file: f,
        originalBlob: f,
        compressedBlob: null,
        originalSize: f.size,
        compressedSize: null,
        status: "pending",
        previewUrl: URL.createObjectURL(f),
        compressedUrl: null,
      }));

      setFiles((prev) => {
        if (mode === "single") {
          for (const p of prev) {
            URL.revokeObjectURL(p.previewUrl);
            if (p.compressedUrl) URL.revokeObjectURL(p.compressedUrl);
          }
          return newItems.slice(0, 1);
        }
        return [...prev, ...newItems];
      });
    },
    [mode]
  );

  // ───── Compress a single file (used by both modes) ─────
  const compressOne = useCallback(
    async (item: ProcessingFile, signal: AbortSignal): Promise<ProcessingFile> => {
      setProgressFile(item.file.name);

      const onProgress = (p: number) => setProgress(p);

      try {
        let resultBlob: Blob;

        if (item.file.type === "image/svg+xml") {
          // SVG: text-minify on the main thread.
          const text = await item.file.text();
          const minified = minifySvg(text);
          resultBlob = new Blob([minified], { type: "image/svg+xml" });
          onProgress(100);
        } else {
          const opts = buildOptions(
            quality,
            outputFormat,
            maxWidthHeight,
            stripMetadata,
            signal,
            onProgress
          );
          // Dynamic import keeps ~30 kB of WASM/worker code off the initial
          // page bundle. The module is cached by the bundler after first use.
          const { default: imageCompression } = await import(
            "browser-image-compression"
          );
          resultBlob = await imageCompression(item.file, opts);
        }

        const compressedUrl = URL.createObjectURL(resultBlob);
        return {
          ...item,
          status: "done",
          compressedBlob: resultBlob,
          compressedSize: resultBlob.size,
          compressedUrl,
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Compression failed";
        return { ...item, status: "error", error: message };
      }
    },
    [maxWidthHeight, outputFormat, quality, stripMetadata]
  );

  // ───── Process all pending files sequentially ─────
  const runCompression = useCallback(async () => {
    const pending = files.filter((f) => f.status === "pending" || f.status === "error");
    if (pending.length === 0 || isProcessing) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);

    try {
      for (let i = 0; i < pending.length; i++) {
        if (controller.signal.aborted) break;
        setProgressIndex(i);
        const item = pending[i];

        // Mark as processing.
        setFiles((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: "processing" } : p
          )
        );

        const updated = await compressOne(item, controller.signal);

        setFiles((prev) =>
          prev.map((p) => {
            if (p.id !== item.id) return p;
            // Free the previous compressed URL if we're replacing it (e.g. retry).
            if (p.compressedUrl && p.compressedUrl !== updated.compressedUrl) {
              URL.revokeObjectURL(p.compressedUrl);
            }
            return updated;
          })
        );
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressIndex(0);
      setProgressFile("");
      abortRef.current = null;
    }
  }, [compressOne, files, isProcessing]);

  const cancelProcessing = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const resetAll = useCallback(() => {
    for (const p of files) {
      URL.revokeObjectURL(p.previewUrl);
      if (p.compressedUrl) URL.revokeObjectURL(p.compressedUrl);
    }
    setFiles([]);
    setProgress(0);
  }, [files]);

  const downloadAllZip = useCallback(async () => {
    const completed = files.filter((f) => f.status === "done" && f.compressedBlob);
    if (completed.length === 0) return;
    await downloadZip(
      completed.map((f) => ({
        blob: f.compressedBlob!,
        name: suggestedOutputName(f.file, outputFormat),
      })),
      "compressed-images.zip"
    );
  }, [files, outputFormat]);

  const setModeAndReset = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return;
      resetAll();
      setMode(newMode);
    },
    [mode, resetAll]
  );

  // ───── Derived state ─────
  const hasFiles = files.length > 0;
  const completed = useMemo(
    () => files.filter((f) => f.status === "done"),
    [files]
  );
  const totalOriginal = useMemo(
    () => files.reduce((sum, f) => sum + f.originalSize, 0),
    [files]
  );
  const totalCompressed = useMemo(
    () => completed.reduce((sum, f) => sum + (f.compressedSize ?? 0), 0),
    [completed]
  );
  const overallSavedPct =
    totalOriginal > 0 && completed.length > 0
      ? Math.max(0, ((totalOriginal - totalCompressed) / totalOriginal) * 100)
      : 0;

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <ModeTabs mode={mode} onChange={setModeAndReset} />

      {/* Drop zone */}
      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple={mode === "bulk"}
        maxFiles={20}
        formatLabels={FORMAT_LABELS}
      />

      {/* Settings + action panel */}
      {hasFiles && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {mode === "single" ? (
              <SingleFileView file={files[0]} outputFormat={outputFormat} onRemove={removeFile} />
            ) : (
              <BulkFileTable
                files={files}
                outputFormat={outputFormat}
                onRemove={removeFile}
              />
            )}

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                currentFile={progressFile}
                totalFiles={files.filter((f) => f.status !== "done").length || files.length}
                processedFiles={progressIndex}
                stage="Compressing"
                onCancel={cancelProcessing}
              />
            )}

            {/* Bulk summary + zip download */}
            {mode === "bulk" && completed.length > 0 && (
              <BulkSummary
                completedCount={completed.length}
                totalCount={files.length}
                originalBytes={totalOriginal}
                compressedBytes={totalCompressed}
                savedPct={overallSavedPct}
                onDownloadZip={downloadAllZip}
              />
            )}
          </div>

          <SettingsPanel
            quality={quality}
            setQuality={setQuality}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            maxWidthHeight={maxWidthHeight}
            setMaxWidthHeight={setMaxWidthHeight}
            stripMetadata={stripMetadata}
            setStripMetadata={setStripMetadata}
            isProcessing={isProcessing}
            onCompress={runCompression}
            onReset={resetAll}
            mode={mode}
            pendingCount={files.filter((f) => f.status !== "done").length}
          />
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
      <ModeTabButton active={mode === "single"} onClick={() => onChange("single")}>
        <FileImage className="h-4 w-4" />
        Single image
      </ModeTabButton>
      <ModeTabButton active={mode === "bulk"} onClick={() => onChange("bulk")}>
        <Layers className="h-4 w-4" />
        Bulk (up to 20)
      </ModeTabButton>
    </div>
  );
}

function ModeTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition",
        active
          ? "bg-white text-surface-900 shadow-sm dark:bg-surface-900 dark:text-white"
          : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function SingleFileView({
  file,
  outputFormat,
  onRemove,
}: {
  file: ProcessingFile;
  outputFormat: OutputFormat;
  onRemove: (id: string) => void;
}) {
  const isDone = file.status === "done" && file.compressedBlob && file.compressedUrl;
  const savedBytes = isDone ? file.originalSize - (file.compressedSize ?? 0) : 0;
  const savedPct =
    isDone && file.originalSize > 0 ? (savedBytes / file.originalSize) * 100 : 0;
  const tone = savingsTone(savedPct);

  return (
    <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold text-surface-900 dark:text-white"
            title={file.file.name}
          >
            {file.file.name}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {formatFileSize(file.originalSize)} · {file.file.type || "image"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="text-xs font-medium text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
        >
          Remove
        </button>
      </div>

      {isDone && file.compressedUrl ? (
        <div className="space-y-4">
          <BeforeAfterSlider
            beforeUrl={file.previewUrl}
            afterUrl={file.compressedUrl}
            beforeLabel="Original"
            afterLabel="Compressed"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Original" value={formatFileSize(file.originalSize)} />
            <Stat label="Compressed" value={formatFileSize(file.compressedSize ?? 0)} />
            <Stat
              label="Saved"
              value={`${Math.round(savedPct)}%`}
              accent="text-success-600 dark:text-success-400"
            />
            <Stat label="Reduction" value={formatFileSize(Math.max(0, savedBytes))} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                tone.className
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {tone.label}
            </span>
            <button
              type="button"
              onClick={() => {
                if (!file.compressedBlob) return;
                downloadFile(file.compressedBlob, suggestedOutputName(file.file, outputFormat));
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.previewUrl}
            alt={file.file.name}
            className="block max-h-96 w-full object-contain"
          />
        </div>
      )}

      {file.status === "error" && (
        <p className="rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-300">
          {file.error ?? "Compression failed"}
        </p>
      )}
    </div>
  );
}

function BulkFileTable({
  files,
  outputFormat,
  onRemove,
}: {
  files: ProcessingFile[];
  outputFormat: OutputFormat;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
            <th className="px-2 py-3 font-semibold">Original</th>
            <th className="px-2 py-3 font-semibold">Compressed</th>
            <th className="px-2 py-3 font-semibold">Saved</th>
            <th className="px-2 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
          {files.map((f) => {
            const savedBytes =
              f.compressedSize != null ? Math.max(0, f.originalSize - f.compressedSize) : 0;
            const savedPct =
              f.compressedSize != null && f.originalSize > 0
                ? (savedBytes / f.originalSize) * 100
                : 0;
            return (
              <tr key={f.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.previewUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-md border border-surface-200 object-cover dark:border-surface-700"
                    />
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium text-surface-900 dark:text-white"
                        title={f.file.name}
                      >
                        {f.file.name}
                      </p>
                      <p className="text-[11px] text-surface-500 dark:text-surface-400">
                        {f.file.type || "image"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                  {formatFileSize(f.originalSize)}
                </td>
                <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                  {f.compressedSize != null ? formatFileSize(f.compressedSize) : "—"}
                </td>
                <td className="px-2 py-3 text-xs tabular-nums">
                  {f.status === "done" ? (
                    <span className="font-semibold text-success-700 dark:text-success-400">
                      −{Math.round(savedPct)}%
                    </span>
                  ) : (
                    <span className="text-surface-400">—</span>
                  )}
                </td>
                <td className="px-2 py-3">
                  <StatusPill status={f.status} error={f.error} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {f.status === "done" && f.compressedBlob && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile(
                            f.compressedBlob!,
                            suggestedOutputName(f.file, outputFormat)
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-2 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(f.id)}
                      className="text-xs font-medium text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BulkSummary({
  completedCount,
  totalCount,
  originalBytes,
  compressedBytes,
  savedPct,
  onDownloadZip,
}: {
  completedCount: number;
  totalCount: number;
  originalBytes: number;
  compressedBytes: number;
  savedPct: number;
  onDownloadZip: () => void | Promise<void>;
}) {
  const tone = savingsTone(savedPct);
  return (
    <div className="rounded-2xl border border-success-200 bg-success-50/60 p-5 dark:border-success-500/40 dark:bg-success-500/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
            {completedCount} of {totalCount} compressed
          </p>
          <p className="text-base font-semibold text-surface-900 dark:text-white">
            {formatFileSize(originalBytes)} → {formatFileSize(compressedBytes)}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              tone.className
            )}
          >
            {Math.round(savedPct)}% smaller · {tone.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onDownloadZip}
          className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
        >
          <Archive className="h-4 w-4" />
          Download all as ZIP
        </button>
      </div>
    </div>
  );
}

function SettingsPanel({
  quality,
  setQuality,
  outputFormat,
  setOutputFormat,
  maxWidthHeight,
  setMaxWidthHeight,
  stripMetadata,
  setStripMetadata,
  isProcessing,
  onCompress,
  onReset,
  mode,
  pendingCount,
}: {
  quality: number;
  setQuality: (n: number) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  maxWidthHeight: number;
  setMaxWidthHeight: (n: number) => void;
  stripMetadata: boolean;
  setStripMetadata: (b: boolean) => void;
  isProcessing: boolean;
  onCompress: () => void;
  onReset: () => void;
  mode: Mode;
  pendingCount: number;
}) {
  const ctaLabel =
    mode === "bulk"
      ? `Compress all${pendingCount > 0 ? ` (${pendingCount})` : ""}`
      : "Compress image";

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Compression settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Lower quality = smaller files. Tweak and recompress to taste.
        </p>
      </header>

      {/* Quality slider */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="ic-quality" className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Quality
          </label>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {quality} · {qualityLabel(quality)}
          </span>
        </div>
        <input
          id="ic-quality"
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-primary-600"
          disabled={isProcessing}
        />
        <p className="text-[11px] text-surface-500 dark:text-surface-400">{qualityHint(quality)}</p>
      </div>

      {/* Output format */}
      <div className="space-y-1.5">
        <label htmlFor="ic-format" className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Output format
        </label>
        <select
          id="ic-format"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
          disabled={isProcessing}
          className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        >
          <option value="original">Keep original</option>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      {/* Max dimension */}
      <div className="space-y-1.5">
        <label htmlFor="ic-maxdim" className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Max width or height (px) <span className="text-surface-400">— optional</span>
        </label>
        <input
          id="ic-maxdim"
          type="number"
          min={0}
          step={50}
          placeholder="No limit"
          value={maxWidthHeight || ""}
          onChange={(e) => setMaxWidthHeight(Number(e.target.value) || 0)}
          disabled={isProcessing}
          className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        />
      </div>

      {/* Strip metadata toggle */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 px-3 py-2.5 dark:border-surface-700">
        <input
          type="checkbox"
          checked={stripMetadata}
          onChange={(e) => setStripMetadata(e.target.checked)}
          disabled={isProcessing}
          className="mt-0.5 h-4 w-4 accent-primary-600"
        />
        <span className="text-xs text-surface-700 dark:text-surface-200">
          <span className="block font-semibold text-surface-900 dark:text-white">
            Strip metadata
          </span>
          Removes EXIF, GPS and camera info — recommended for shared images.
        </span>
      </label>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onCompress}
          disabled={isProcessing || pendingCount === 0}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Compressing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {ctaLabel}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset & start over
        </button>
      </div>
    </aside>
  );
}

function StatusPill({ status, error }: { status: FileStatus; error?: string }) {
  const map = {
    pending: {
      icon: <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />,
      label: "Pending",
      className:
        "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
    },
    processing: {
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      label: "Processing",
      className:
        "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200",
    },
    done: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Done",
      className:
        "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300",
    },
    error: {
      icon: <XCircle className="h-3 w-3" />,
      label: "Error",
      className: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300",
    },
  } as const;
  const { icon, label, className } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        className
      )}
      title={status === "error" ? error : undefined}
    >
      {icon}
      {label}
    </span>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 dark:border-surface-800 dark:bg-surface-800/40">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm font-bold tabular-nums text-surface-900 dark:text-white",
          accent
        )}
      >
        {value}
      </p>
    </div>
  );
}
