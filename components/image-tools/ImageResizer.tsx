"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ChevronDown,
  Download,
  FileImage,
  Layers,
  Link2,
  Link2Off,
  Loader2,
  Maximize2,
  Percent,
  RotateCcw,
  Sparkles,
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
  getImageDimensions,
  imageToCanvas,
  loadImageFromFile,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "resize-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Mode = "single" | "bulk";
type ResizeMode = "pixels" | "percentage";
type OutputFormat = "original" | "jpeg" | "png" | "webp";
type FileStatus = "pending" | "processing" | "done" | "error";

interface BulkFile {
  id: string;
  file: File;
  originalDims: { width: number; height: number };
  resultBlob: Blob | null;
  resultUrl: string | null;
  resultDims: { width: number; height: number } | null;
  status: FileStatus;
  error?: string;
  previewUrl: string;
}

interface Preset {
  label: string;
  width: number;
  height: number;
}

const STANDARD_PRESETS: Preset[] = [
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "HD", width: 1280, height: 720 },
  { label: "4K", width: 3840, height: 2160 },
  { label: "Square 1:1", width: 1080, height: 1080 },
  { label: "800×600", width: 800, height: 600 },
  { label: "640×480", width: 640, height: 480 },
];

const SOCIAL_PRESETS: Preset[] = [
  { label: "Instagram Post", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "Facebook Cover", width: 820, height: 312 },
  { label: "Twitter/X Header", width: 1500, height: 500 },
  { label: "LinkedIn Banner", width: 1584, height: 396 },
  { label: "YouTube Thumbnail", width: 1280, height: 720 },
  { label: "Pinterest Pin", width: 1000, height: 1500 },
];

let __pid = 0;
const nextId = () => `rs-${++__pid}-${Date.now()}`;

function pickOutputMime(originalType: string, output: OutputFormat): ImageMimeType {
  if (output === "original") {
    if (originalType === "image/png") return "image/png";
    if (originalType === "image/webp") return "image/webp";
    if (originalType === "image/gif") return "image/gif";
    return "image/jpeg";
  }
  return `image/${output}` as ImageMimeType;
}

function suggestedName(file: File, w: number, h: number, output: OutputFormat): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext =
    output === "original"
      ? (dot > 0 ? file.name.slice(dot + 1) : "jpg")
      : output === "jpeg"
        ? "jpg"
        : output;
  return `${stem}-${w}x${h}.${ext}`;
}

async function resizeToBlob(
  file: File,
  targetW: number,
  targetH: number,
  outputFormat: OutputFormat,
  quality: number
): Promise<Blob> {
  const { img, cleanup } = await loadImageFromFile(file);
  try {
    const canvas = imageToCanvas(img, targetW, targetH);
    const mime = pickOutputMime(file.type, outputFormat);
    return await canvasToBlob(canvas, mime, quality / 100);
  } finally {
    cleanup();
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ImageResizer() {
  const [mode, setMode] = useState<Mode>("single");

  // Single mode state
  const [file, setFile] = useState<File | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ width: number; height: number } | null>(null);

  // Bulk mode state
  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([]);

  // Shared controls
  const [resizeMode, setResizeMode] = useState<ResizeMode>("pixels");
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [scalePercent, setScalePercent] = useState(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(90);

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  // UI
  const [showSocial, setShowSocial] = useState(false);

  // ───── Aspect ratio derived ─────
  const aspectRatio = useMemo(() => {
    if (!originalDims || !originalDims.height) return null;
    return originalDims.width / originalDims.height;
  }, [originalDims]);

  // Cleanup all blob URLs on unmount.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      for (const b of bulkFiles) {
        URL.revokeObjectURL(b.previewUrl);
        if (b.resultUrl) URL.revokeObjectURL(b.resultUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    async (selected: File[]) => {
      if (mode === "single") {
        const f = selected[0];
        if (!f) return;
        // Free previous URLs.
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultBlob(null);
        setResultUrl(null);
        setResultDims(null);

        const url = URL.createObjectURL(f);
        setFile(f);
        setPreviewUrl(url);
        try {
          const dims = await getImageDimensions(f);
          setOriginalDims(dims);
          setTargetWidth(dims.width);
          setTargetHeight(dims.height);
        } catch {
          setOriginalDims(null);
        }
      } else {
        // Sequential — keeps peak memory predictable on phones, since each
        // getImageDimensions briefly decodes the image into memory.
        const items: BulkFile[] = [];
        for (const f of selected) {
          let dims = { width: 0, height: 0 };
          try {
            dims = await getImageDimensions(f);
          } catch {
            /* ignore */
          }
          items.push({
            id: nextId(),
            file: f,
            originalDims: dims,
            resultBlob: null,
            resultUrl: null,
            resultDims: null,
            status: "pending",
            previewUrl: URL.createObjectURL(f),
          });
        }
        setBulkFiles((prev) => [...prev, ...items]);
      }
    },
    [mode, previewUrl, resultUrl]
  );

  // ───── Width/Height linked editing ─────
  const onWidthChange = (w: number) => {
    setTargetWidth(w);
    if (maintainAspectRatio && aspectRatio && w > 0) {
      setTargetHeight(Math.round(w / aspectRatio));
    }
  };
  const onHeightChange = (h: number) => {
    setTargetHeight(h);
    if (maintainAspectRatio && aspectRatio && h > 0) {
      setTargetWidth(Math.round(h * aspectRatio));
    }
  };

  const applyPreset = (p: Preset) => {
    setResizeMode("pixels");
    if (maintainAspectRatio && aspectRatio) {
      // Fit the longest side of the preset, preserving the *original* image's ratio
      // — usually what people want from a "preset" applied to their own photo.
      const fitByWidth = p.width / aspectRatio <= p.height;
      if (fitByWidth) {
        setTargetWidth(p.width);
        setTargetHeight(Math.round(p.width / aspectRatio));
      } else {
        setTargetHeight(p.height);
        setTargetWidth(Math.round(p.height * aspectRatio));
      }
    } else {
      setTargetWidth(p.width);
      setTargetHeight(p.height);
    }
  };

  // ───── Compute the actual target dims used for processing ─────
  const effectiveTarget = useMemo(() => {
    if (!originalDims) return null;
    if (resizeMode === "pixels") {
      const w = Math.max(1, Math.round(targetWidth));
      const h = Math.max(1, Math.round(targetHeight));
      return { width: w, height: h };
    }
    const factor = Math.max(1, scalePercent) / 100;
    return {
      width: Math.max(1, Math.round(originalDims.width * factor)),
      height: Math.max(1, Math.round(originalDims.height * factor)),
    };
  }, [originalDims, resizeMode, scalePercent, targetHeight, targetWidth]);

  // ───── Processing ─────
  const runSingle = useCallback(async () => {
    if (!file || !effectiveTarget) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);
    setProgressFile(file.name);
    try {
      // Indeterminate-ish progress for single file (canvas resize is fast).
      setProgress(40);
      const blob = await resizeToBlob(
        file,
        effectiveTarget.width,
        effectiveTarget.height,
        outputFormat,
        quality
      );
      setProgress(95);
      const url = URL.createObjectURL(blob);
      // Free previous result if any.
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(blob);
      setResultUrl(url);
      setResultDims({ width: effectiveTarget.width, height: effectiveTarget.height });
      setProgress(100);
    } catch (err) {
      console.error("[ImageResizer]", err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [effectiveTarget, file, outputFormat, quality, resultUrl]);

  const runBulk = useCallback(async () => {
    const pending = bulkFiles.filter((b) => b.status !== "done");
    if (pending.length === 0) return;
    abortRef.current = { aborted: false };
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);
    try {
      for (let i = 0; i < pending.length; i++) {
        if (abortRef.current.aborted) break;
        const item = pending[i];
        setProgressIndex(i);
        setProgressFile(item.file.name);
        setProgress(0);

        setBulkFiles((prev) =>
          prev.map((b) => (b.id === item.id ? { ...b, status: "processing" } : b))
        );

        try {
          // Per-file target — for bulk we honour the same controls. With
          // percentage mode we scale relative to that file's own original.
          const target =
            resizeMode === "percentage"
              ? {
                  width: Math.max(
                    1,
                    Math.round(item.originalDims.width * (scalePercent / 100))
                  ),
                  height: Math.max(
                    1,
                    Math.round(item.originalDims.height * (scalePercent / 100))
                  ),
                }
              : { width: targetWidth, height: targetHeight };

          setProgress(40);
          const blob = await resizeToBlob(
            item.file,
            target.width,
            target.height,
            outputFormat,
            quality
          );
          setProgress(95);
          const url = URL.createObjectURL(blob);
          setBulkFiles((prev) =>
            prev.map((b) =>
              b.id === item.id
                ? {
                    ...b,
                    status: "done",
                    resultBlob: blob,
                    resultUrl: url,
                    resultDims: target,
                  }
                : b
            )
          );
          setProgress(100);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Resize failed";
          setBulkFiles((prev) =>
            prev.map((b) =>
              b.id === item.id ? { ...b, status: "error", error: message } : b
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
  }, [bulkFiles, outputFormat, quality, resizeMode, scalePercent, targetHeight, targetWidth]);

  const cancelBulk = () => {
    abortRef.current.aborted = true;
  };

  const downloadAll = useCallback(async () => {
    const done = bulkFiles.filter((b) => b.status === "done" && b.resultBlob);
    if (done.length === 0) return;
    await downloadZip(
      done.map((b) => ({
        blob: b.resultBlob!,
        name: suggestedName(
          b.file,
          b.resultDims?.width ?? 0,
          b.resultDims?.height ?? 0,
          outputFormat
        ),
      })),
      "resized-images.zip"
    );
  }, [bulkFiles, outputFormat]);

  const resetAll = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    for (const b of bulkFiles) {
      URL.revokeObjectURL(b.previewUrl);
      if (b.resultUrl) URL.revokeObjectURL(b.resultUrl);
    }
    setFile(null);
    setOriginalDims(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setResultDims(null);
    setBulkFiles([]);
  }, [bulkFiles, previewUrl, resultUrl]);

  const setModeAndReset = (m: Mode) => {
    if (m === mode) return;
    resetAll();
    setMode(m);
  };

  const hasContent = mode === "single" ? !!file : bulkFiles.length > 0;

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="inline-flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
        <ModeTab active={mode === "single"} onClick={() => setModeAndReset("single")}>
          <FileImage className="h-4 w-4" />
          Single image
        </ModeTab>
        <ModeTab active={mode === "bulk"} onClick={() => setModeAndReset("bulk")}>
          <Layers className="h-4 w-4" />
          Bulk
        </ModeTab>
      </div>

      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple={mode === "bulk"}
        maxFiles={20}
        formatLabels={FORMAT_LABELS}
      />

      {hasContent && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {mode === "single" && file && previewUrl && originalDims ? (
              <SingleResizeView
                file={file}
                originalDims={originalDims}
                previewUrl={previewUrl}
                resultUrl={resultUrl}
                resultBlob={resultBlob}
                resultDims={resultDims}
                outputFormat={outputFormat}
              />
            ) : (
              <BulkResizeTable files={bulkFiles} outputFormat={outputFormat} />
            )}

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                currentFile={progressFile}
                totalFiles={mode === "bulk" ? bulkFiles.filter((b) => b.status !== "done").length || bulkFiles.length : 1}
                processedFiles={progressIndex}
                stage="Resizing"
                onCancel={mode === "bulk" ? cancelBulk : undefined}
              />
            )}

            {mode === "bulk" && bulkFiles.some((b) => b.status === "done") && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                  {bulkFiles.filter((b) => b.status === "done").length} of{" "}
                  {bulkFiles.length} resized
                </span>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
                >
                  <Archive className="h-4 w-4" />
                  Download all as ZIP
                </button>
              </div>
            )}
          </div>

          <ResizeSettings
            mode={mode}
            resizeMode={resizeMode}
            setResizeMode={setResizeMode}
            targetWidth={targetWidth}
            targetHeight={targetHeight}
            onWidthChange={onWidthChange}
            onHeightChange={onHeightChange}
            scalePercent={scalePercent}
            setScalePercent={setScalePercent}
            maintainAspectRatio={maintainAspectRatio}
            setMaintainAspectRatio={setMaintainAspectRatio}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            quality={quality}
            setQuality={setQuality}
            originalDims={originalDims}
            effectiveTarget={effectiveTarget}
            isProcessing={isProcessing}
            onRun={mode === "single" ? runSingle : runBulk}
            onReset={resetAll}
            onApplyPreset={applyPreset}
            showSocial={showSocial}
            setShowSocial={setShowSocial}
          />
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ModeTab({
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

function SingleResizeView({
  file,
  originalDims,
  previewUrl,
  resultUrl,
  resultBlob,
  resultDims,
  outputFormat,
}: {
  file: File;
  originalDims: { width: number; height: number };
  previewUrl: string;
  resultUrl: string | null;
  resultBlob: Blob | null;
  resultDims: { width: number; height: number } | null;
  outputFormat: OutputFormat;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
          {file.name}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Original: {originalDims.width} × {originalDims.height} px ·{" "}
          {formatFileSize(file.size)}
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultUrl ?? previewUrl}
          alt="Image preview"
          className="block max-h-[480px] w-full object-contain"
        />
      </div>

      {resultBlob && resultDims && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Original"
              value={`${originalDims.width}×${originalDims.height}`}
            />
            <Stat
              label="New size"
              value={`${resultDims.width}×${resultDims.height}`}
              accent="text-primary-700 dark:text-primary-300"
            />
            <Stat label="File before" value={formatFileSize(file.size)} />
            <Stat label="File after" value={formatFileSize(resultBlob.size)} />
          </div>

          <button
            type="button"
            onClick={() =>
              downloadFile(
                resultBlob,
                suggestedName(file, resultDims.width, resultDims.height, outputFormat)
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <Download className="h-4 w-4" />
            Download ({resultDims.width}×{resultDims.height})
          </button>
        </div>
      )}
    </div>
  );
}

function BulkResizeTable({
  files,
  outputFormat,
}: {
  files: BulkFile[];
  outputFormat: OutputFormat;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
            <th className="px-2 py-3 font-semibold">Original</th>
            <th className="px-2 py-3 font-semibold">New</th>
            <th className="px-2 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
          {files.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.previewUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-surface-200 object-cover dark:border-surface-700"
                  />
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium text-surface-900 dark:text-white"
                      title={b.file.name}
                    >
                      {b.file.name}
                    </p>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400">
                      {formatFileSize(b.file.size)}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                {b.originalDims.width || "—"}×{b.originalDims.height || "—"}
              </td>
              <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                {b.resultDims ? `${b.resultDims.width}×${b.resultDims.height}` : "—"}
              </td>
              <td className="px-2 py-3 text-xs">
                <FileStatusPill status={b.status} error={b.error} />
              </td>
              <td className="px-4 py-3 text-right">
                {b.status === "done" && b.resultBlob && b.resultDims && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile(
                        b.resultBlob!,
                        suggestedName(
                          b.file,
                          b.resultDims!.width,
                          b.resultDims!.height,
                          outputFormat
                        )
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-2 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResizeSettings({
  mode,
  resizeMode,
  setResizeMode,
  targetWidth,
  targetHeight,
  onWidthChange,
  onHeightChange,
  scalePercent,
  setScalePercent,
  maintainAspectRatio,
  setMaintainAspectRatio,
  outputFormat,
  setOutputFormat,
  quality,
  setQuality,
  originalDims,
  effectiveTarget,
  isProcessing,
  onRun,
  onReset,
  onApplyPreset,
  showSocial,
  setShowSocial,
}: {
  mode: Mode;
  resizeMode: ResizeMode;
  setResizeMode: (m: ResizeMode) => void;
  targetWidth: number;
  targetHeight: number;
  onWidthChange: (n: number) => void;
  onHeightChange: (n: number) => void;
  scalePercent: number;
  setScalePercent: (n: number) => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (b: boolean) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  quality: number;
  setQuality: (n: number) => void;
  originalDims: { width: number; height: number } | null;
  effectiveTarget: { width: number; height: number } | null;
  isProcessing: boolean;
  onRun: () => void;
  onReset: () => void;
  onApplyPreset: (p: Preset) => void;
  showSocial: boolean;
  setShowSocial: (b: boolean) => void;
}) {
  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Resize settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Resize by exact pixels or as a percentage of the original.
        </p>
      </header>

      {/* Resize mode toggle */}
      <div className="inline-flex rounded-lg bg-surface-100 p-0.5 dark:bg-surface-800">
        <ResizeModeBtn
          active={resizeMode === "pixels"}
          onClick={() => setResizeMode("pixels")}
        >
          <Maximize2 className="h-3 w-3" /> Pixels
        </ResizeModeBtn>
        <ResizeModeBtn
          active={resizeMode === "percentage"}
          onClick={() => setResizeMode("percentage")}
        >
          <Percent className="h-3 w-3" /> Percent
        </ResizeModeBtn>
      </div>

      {resizeMode === "pixels" ? (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <NumberField
              label="Width"
              suffix="px"
              value={targetWidth}
              onChange={onWidthChange}
              disabled={isProcessing}
            />
            <button
              type="button"
              title={maintainAspectRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
              onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
              className={cn(
                "mb-0.5 flex h-9 w-9 items-center justify-center rounded-lg border transition",
                maintainAspectRatio
                  ? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400"
              )}
            >
              {maintainAspectRatio ? (
                <Link2 className="h-4 w-4" />
              ) : (
                <Link2Off className="h-4 w-4" />
              )}
            </button>
            <NumberField
              label="Height"
              suffix="px"
              value={targetHeight}
              onChange={onHeightChange}
              disabled={isProcessing}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <NumberField
            label="Scale"
            suffix="%"
            value={scalePercent}
            onChange={setScalePercent}
            disabled={isProcessing}
            min={1}
            max={400}
          />
          {originalDims && (
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              New size will be:{" "}
              <span className="font-semibold text-surface-900 dark:text-white">
                {Math.max(1, Math.round((originalDims.width * scalePercent) / 100))} ×{" "}
                {Math.max(1, Math.round((originalDims.height * scalePercent) / 100))} px
              </span>
            </p>
          )}
        </div>
      )}

      {/* Standard presets */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Common sizes
        </p>
        <div className="flex flex-wrap gap-1.5">
          {STANDARD_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onApplyPreset(p)}
              disabled={isProcessing}
              className="rounded-full border border-surface-200 px-2.5 py-1 text-[11px] font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Social presets */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => setShowSocial(!showSocial)}
          className="flex w-full items-center justify-between text-xs font-semibold text-surface-700 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-300"
        >
          <span>Social media presets</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", showSocial && "rotate-180")}
          />
        </button>
        {showSocial && (
          <div className="flex flex-wrap gap-1.5">
            {SOCIAL_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onApplyPreset(p)}
                disabled={isProcessing}
                title={`${p.width} × ${p.height}`}
                className="rounded-full border border-surface-200 px-2.5 py-1 text-[11px] font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Output format */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Output format
        </label>
        <select
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

      {/* Quality */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Quality
          </label>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {quality}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-primary-600"
          disabled={isProcessing}
        />
      </div>

      {effectiveTarget && (
        <p className="rounded-lg bg-surface-50 px-3 py-2 text-[11px] text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          Output: <strong>{effectiveTarget.width} × {effectiveTarget.height} px</strong>
        </p>
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onRun}
          disabled={isProcessing || (mode === "single" && !originalDims)}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Resizing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {mode === "bulk" ? "Resize all" : "Resize image"}
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

function ResizeModeBtn({
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
        "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "bg-white text-surface-900 shadow-sm dark:bg-surface-900 dark:text-white"
          : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
      )}
    >
      {children}
    </button>
  );
}

function NumberField({
  label,
  suffix,
  value,
  onChange,
  disabled,
  min,
  max,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
      <span className="mt-1 inline-flex w-full items-center rounded-lg border border-surface-200 bg-white pr-2 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          disabled={disabled}
          min={min}
          max={max}
          className="w-full rounded-lg bg-transparent px-3 py-2 text-sm tabular-nums text-surface-900 focus:outline-none dark:text-white"
        />
        <span className="text-[11px] font-medium text-surface-500 dark:text-surface-400">
          {suffix}
        </span>
      </span>
    </label>
  );
}

function FileStatusPill({ status, error }: { status: FileStatus; error?: string }) {
  const map = {
    pending: { label: "Pending", className: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300" },
    processing: { label: "Processing…", className: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200" },
    done: { label: "Done", className: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300" },
    error: { label: "Error", className: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", s.className)}
      title={status === "error" ? error : undefined}
    >
      {s.label}
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
