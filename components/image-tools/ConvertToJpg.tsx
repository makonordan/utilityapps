"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  Info,
  Loader2,
  Palette,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import { ProcessingProgress } from "@/components/image-tools/ProcessingProgress";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  canvasToBlob,
  downloadFile,
  downloadZip,
  formatFileSize,
  loadAnyImageToCanvas,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "convert-to-jpg";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type FileStatus = "pending" | "processing" | "done" | "error";

interface ConvertFile {
  id: string;
  file: File;
  jpgBlob: Blob | null;
  jpgUrl: string | null;
  jpgSize: number | null;
  status: FileStatus;
  error?: string;
  previewUrl: string;
}

let __pid = 0;
const nextId = () => `cj-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function originalFormatLabel(file: File): string {
  if (file.type) {
    const sub = file.type.split("/")[1];
    if (sub) return sub.toUpperCase().replace("SVG+XML", "SVG");
  }
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(dot + 1).toUpperCase() : "—";
}

function jpgName(file: File): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  return `${stem}.jpg`;
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ConvertToJpg() {
  const [files, setFiles] = useState<ConvertFile[]>([]);
  const [jpgQuality, setJpgQuality] = useState(92);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");

  // Cleanup blob URLs on unmount.
  useEffect(() => {
    return () => {
      for (const f of files) {
        URL.revokeObjectURL(f.previewUrl);
        if (f.jpgUrl) URL.revokeObjectURL(f.jpgUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilesSelected = useCallback((selected: File[]) => {
    const next: ConvertFile[] = selected.map((f) => ({
      id: nextId(),
      file: f,
      jpgBlob: null,
      jpgUrl: null,
      jpgSize: null,
      status: "pending",
      previewUrl: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) {
        URL.revokeObjectURL(t.previewUrl);
        if (t.jpgUrl) URL.revokeObjectURL(t.jpgUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const reset = () => {
    for (const f of files) {
      URL.revokeObjectURL(f.previewUrl);
      if (f.jpgUrl) URL.revokeObjectURL(f.jpgUrl);
    }
    setFiles([]);
  };

  const convertAll = useCallback(async () => {
    const pending = files.filter((f) => f.status !== "done");
    if (pending.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);

    try {
      for (let i = 0; i < pending.length; i++) {
        const item = pending[i];
        setProgressIndex(i);
        setProgressFile(item.file.name);
        setProgress(20);

        setFiles((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "processing" } : p))
        );

        try {
          const sourceCanvas = await loadAnyImageToCanvas(item.file);
          setProgress(60);
          // Composite onto a fresh canvas filled with backgroundColor —
          // JPG can't carry alpha, so transparent regions need a flat fill.
          const out = document.createElement("canvas");
          out.width = sourceCanvas.width;
          out.height = sourceCanvas.height;
          const ctx = out.getContext("2d");
          if (!ctx) throw new Error("2D context unavailable");
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, out.width, out.height);
          ctx.drawImage(sourceCanvas, 0, 0);
          setProgress(85);

          const blob = await canvasToBlob(out, "image/jpeg", jpgQuality / 100);
          const url = URL.createObjectURL(blob);
          setProgress(100);

          setFiles((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? {
                    ...p,
                    status: "done",
                    jpgBlob: blob,
                    jpgUrl: url,
                    jpgSize: blob.size,
                  }
                : p
            )
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Conversion failed";
          setFiles((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, status: "error", error: message } : p
            )
          );
        }
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressIndex(0);
      setProgressFile("");
    }
  }, [backgroundColor, files, isProcessing, jpgQuality]);

  const downloadAll = useCallback(async () => {
    const done = files.filter((f) => f.status === "done" && f.jpgBlob);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadFile(done[0].jpgBlob!, jpgName(done[0].file));
      return;
    }
    await downloadZip(
      done.map((f) => ({ blob: f.jpgBlob!, name: jpgName(f.file) })),
      "converted-jpgs.zip"
    );
  }, [files]);

  const hasGif = useMemo(
    () => files.some((f) => f.file.type === "image/gif" || /\.gif$/i.test(f.file.name)),
    [files]
  );

  const completedCount = files.filter((f) => f.status === "done").length;
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6">
      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple
        maxFiles={20}
        formatLabels={FORMAT_LABELS}
      />

      {hasFiles && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <ResultTable files={files} onRemove={removeFile} />
            {hasGif && (
              <p className="inline-flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50/60 px-3 py-2 text-xs text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Animated GIFs: only the first frame is converted to JPG.
              </p>
            )}

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                currentFile={progressFile}
                totalFiles={files.filter((f) => f.status !== "done").length || files.length}
                processedFiles={progressIndex}
                stage="Converting"
              />
            )}

            {completedCount > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                  {completedCount} of {files.length} converted
                </span>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
                >
                  {completedCount > 1 ? (
                    <>
                      <Archive className="h-4 w-4" />
                      Download all as ZIP
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <SettingsPanel
            jpgQuality={jpgQuality}
            setJpgQuality={setJpgQuality}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            isProcessing={isProcessing}
            onConvert={convertAll}
            onReset={reset}
            hasPending={files.some((f) => f.status !== "done")}
          />
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ResultTable({
  files,
  onRemove,
}: {
  files: ConvertFile[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
            <th className="px-2 py-3 font-semibold">Format</th>
            <th className="px-2 py-3 font-semibold">Original</th>
            <th className="px-2 py-3 font-semibold">JPG</th>
            <th className="px-2 py-3 font-semibold">Diff</th>
            <th className="px-2 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
          {files.map((f) => {
            const diff =
              f.jpgSize != null ? f.jpgSize - f.file.size : null;
            const diffPct =
              f.jpgSize != null && f.file.size > 0
                ? (diff! / f.file.size) * 100
                : null;
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
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  {originalFormatLabel(f.file)}
                </td>
                <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                  {formatFileSize(f.file.size)}
                </td>
                <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                  {f.jpgSize != null ? formatFileSize(f.jpgSize) : "—"}
                </td>
                <td className="px-2 py-3 text-xs tabular-nums">
                  {diffPct == null ? (
                    <span className="text-surface-400">—</span>
                  ) : diff! < 0 ? (
                    <span className="font-semibold text-success-700 dark:text-success-400">
                      −{Math.abs(Math.round(diffPct))}%
                    </span>
                  ) : (
                    <span className="font-semibold text-warning-700 dark:text-warning-400">
                      +{Math.round(diffPct)}%
                    </span>
                  )}
                </td>
                <td className="px-2 py-3">
                  <StatusPill status={f.status} error={f.error} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {f.status === "done" && f.jpgBlob && (
                      <button
                        type="button"
                        onClick={() => downloadFile(f.jpgBlob!, jpgName(f.file))}
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

const PRESET_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Light gray", value: "#F3F4F6" },
];

function SettingsPanel({
  jpgQuality,
  setJpgQuality,
  backgroundColor,
  setBackgroundColor,
  isProcessing,
  onConvert,
  onReset,
  hasPending,
}: {
  jpgQuality: number;
  setJpgQuality: (n: number) => void;
  backgroundColor: string;
  setBackgroundColor: (c: string) => void;
  isProcessing: boolean;
  onConvert: () => void;
  onReset: () => void;
  hasPending: boolean;
}) {
  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          JPG output settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Controls applied to every file in the queue.
        </p>
      </header>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="cj-quality" className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            JPG quality
          </label>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {jpgQuality}
          </span>
        </div>
        <input
          id="cj-quality"
          type="range"
          min={1}
          max={100}
          value={jpgQuality}
          onChange={(e) => setJpgQuality(Number(e.target.value))}
          className="w-full accent-primary-600"
          disabled={isProcessing}
        />
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          92 is a good balance between quality and file size.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/40">
        <div className="flex items-start gap-2">
          <Palette className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-surface-900 dark:text-white">
              Background colour
            </p>
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              Transparent areas (PNG, WEBP, SVG) will be filled with this colour
              when converted to JPG.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_COLORS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setBackgroundColor(p.value)}
              disabled={isProcessing}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition",
                backgroundColor.toUpperCase() === p.value.toUpperCase()
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
              )}
            >
              <span
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: p.value }}
              />
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            disabled={isProcessing}
            className="h-9 w-9 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            disabled={isProcessing}
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs uppercase tabular-nums text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onConvert}
          disabled={isProcessing || !hasPending}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Convert all to JPG
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
          Reset
        </button>
      </div>
    </aside>
  );
}

function StatusPill({ status, error }: { status: FileStatus; error?: string }) {
  const map = {
    pending: { icon: <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />, label: "Pending", className: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300" },
    processing: { icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "Processing", className: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200" },
    done: { icon: <CheckCircle2 className="h-3 w-3" />, label: "Done", className: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300" },
    error: { icon: <XCircle className="h-3 w-3" />, label: "Error", className: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        s.className
      )}
      title={status === "error" ? error : undefined}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
