"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  FlipHorizontal,
  FlipVertical,
  Loader2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Square,
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
  getImageDimensions,
  loadImageFromFile,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "rotate-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type FileStatus = "pending" | "processing" | "done" | "skipped" | "error";
type Orientation = "all" | "landscape" | "portrait" | "square";
type OutputFormat = "original" | "png" | "jpeg" | "webp";

interface RotateFile {
  id: string;
  file: File;
  previewUrl: string;
  origDims: { width: number; height: number } | null;
  outBlob: Blob | null;
  outUrl: string | null;
  status: FileStatus;
  error?: string;
}

let __pid = 0;
const nextId = () => `rt-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function pickOutputMime(originalType: string, output: OutputFormat): ImageMimeType {
  if (output === "original") {
    if (originalType === "image/png") return "image/png";
    if (originalType === "image/webp") return "image/webp";
    if (originalType === "image/gif") return "image/gif";
    return "image/jpeg";
  }
  return `image/${output}` as ImageMimeType;
}

function outName(file: File, output: OutputFormat): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext =
    output === "original"
      ? (dot > 0 ? file.name.slice(dot + 1) : "jpg")
      : output === "jpeg"
        ? "jpg"
        : output;
  return `${stem}-rotated.${ext}`;
}

function classifyOrientation(w: number, h: number): Orientation {
  if (w === h) return "square";
  return w > h ? "landscape" : "portrait";
}

/**
 * Rotate (and optionally flip) an image onto a fresh canvas. Returns the
 * canvas — caller is responsible for encoding it.
 *
 * Handles the bounding-box expansion needed for non-90° rotations and fills
 * the resulting triangular gaps with `bgColor`.
 */
function rotateImageOntoCanvas(
  img: HTMLImageElement,
  angleDeg: number,
  flipH: boolean,
  flipV: boolean,
  bgColor: string
): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const newW = Math.max(1, Math.ceil(w * cos + h * sin));
  const newH = Math.max(1, Math.ceil(w * sin + h * cos));

  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  // Only fill the background if a non-90°-multiple rotation could create gaps,
  // OR if the user picked a lossy output format (no transparency).
  const isAxisAligned = angleDeg % 90 === 0;
  if (!isAxisAligned) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, newW, newH);
  }

  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  if (flipH || flipV) {
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, -w / 2, -h / 2);
  return canvas;
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function RotateImage() {
  const [files, setFiles] = useState<RotateFile[]>([]);

  const [rotationAngle, setRotationAngle] = useState<0 | 90 | 180 | 270>(90);
  const [useCustom, setUseCustom] = useState(false);
  const [customAngle, setCustomAngle] = useState(0);

  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [orientationFilter, setOrientationFilter] = useState<Orientation>("all");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");

  // Cleanup blob URLs on unmount.
  useEffect(() => {
    return () => {
      for (const f of files) {
        URL.revokeObjectURL(f.previewUrl);
        if (f.outUrl) URL.revokeObjectURL(f.outUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake (dimensions async per file) ─────
  const onFilesSelected = useCallback((selected: File[]) => {
    const next: RotateFile[] = selected.map((f) => ({
      id: nextId(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      origDims: null,
      outBlob: null,
      outUrl: null,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...next]);

    next.forEach((item) => {
      getImageDimensions(item.file)
        .then((dims) =>
          setFiles((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, origDims: dims } : p))
          )
        )
        .catch(() => {
          /* leave dims null */
        });
    });
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) {
        URL.revokeObjectURL(t.previewUrl);
        if (t.outUrl) URL.revokeObjectURL(t.outUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const reset = () => {
    for (const f of files) {
      URL.revokeObjectURL(f.previewUrl);
      if (f.outUrl) URL.revokeObjectURL(f.outUrl);
    }
    setFiles([]);
  };

  // ───── Quick-button helpers ─────
  const applyQuickRotation = (angle: 90 | 180 | 270) => {
    setUseCustom(false);
    setRotationAngle(angle);
  };

  // ───── Effective angle for live preview + processing ─────
  const effectiveAngle = useCustom ? customAngle : rotationAngle;

  // ───── Live CSS transform string for the first file preview ─────
  const previewTransform = useMemo(() => {
    return `rotate(${effectiveAngle}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;
  }, [effectiveAngle, flipH, flipV]);

  // ───── Per-file orientation filter check ─────
  const shouldProcess = useCallback(
    (f: RotateFile) => {
      if (orientationFilter === "all") return true;
      if (!f.origDims) return true; // unknown → process to be safe
      return classifyOrientation(f.origDims.width, f.origDims.height) === orientationFilter;
    },
    [orientationFilter]
  );

  // ───── Process all matching files ─────
  const rotateAll = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProgressIndex(i);
        setProgressFile(item.file.name);
        setProgress(15);

        if (!shouldProcess(item)) {
          setFiles((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, status: "skipped" } : p
            )
          );
          continue;
        }

        setFiles((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "processing" } : p))
        );

        try {
          const { img, cleanup } = await loadImageFromFile(item.file);
          try {
            setProgress(55);
            const canvas = rotateImageOntoCanvas(
              img,
              effectiveAngle,
              flipH,
              flipV,
              bgColor
            );
            const mime = pickOutputMime(item.file.type, outputFormat);
            const blob = await canvasToBlob(canvas, mime, quality / 100);
            const url = URL.createObjectURL(blob);
            setProgress(100);

            setFiles((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? {
                      ...p,
                      status: "done",
                      outBlob: blob,
                      outUrl: url,
                    }
                  : p
              )
            );
          } finally {
            cleanup();
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Rotation failed";
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
  }, [
    bgColor,
    effectiveAngle,
    files,
    flipH,
    flipV,
    isProcessing,
    outputFormat,
    quality,
    shouldProcess,
  ]);

  const downloadAll = useCallback(async () => {
    const done = files.filter((f) => f.status === "done" && f.outBlob);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadFile(done[0].outBlob!, outName(done[0].file, outputFormat));
      return;
    }
    await downloadZip(
      done.map((f) => ({ blob: f.outBlob!, name: outName(f.file, outputFormat) })),
      "rotated-images.zip"
    );
  }, [files, outputFormat]);

  const completedCount = files.filter((f) => f.status === "done").length;
  const matchedCount = files.filter(shouldProcess).length;
  const isCustomNonOrtho = useCustom && customAngle % 90 !== 0;
  const hasFiles = files.length > 0;
  const first = files[0];

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
            {/* Preview — CSS transform, no canvas re-render */}
            {first && (
              <div className="space-y-2 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Preview · first image (live CSS transform)
                </p>
                <div className="flex items-center justify-center overflow-hidden rounded-lg border border-surface-200 bg-surface-100 p-6 dark:border-surface-700 dark:bg-surface-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first.previewUrl}
                    alt={first.file.name}
                    style={{
                      transform: previewTransform,
                      transition: "transform 220ms ease-out",
                      backgroundColor: isCustomNonOrtho ? bgColor : "transparent",
                    }}
                    className="max-h-72 max-w-full origin-center object-contain"
                  />
                </div>
              </div>
            )}

            <ResultTable files={files} outputFormat={outputFormat} onRemove={removeFile} />

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                currentFile={progressFile}
                totalFiles={files.length}
                processedFiles={progressIndex}
                stage="Rotating"
              />
            )}

            {completedCount > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                  {completedCount} of {files.length} rotated
                </span>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
                >
                  {completedCount > 1 ? (
                    <>
                      <Archive className="h-4 w-4" /> Download all as ZIP
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <SettingsPanel
            useCustom={useCustom}
            setUseCustom={setUseCustom}
            rotationAngle={rotationAngle}
            customAngle={customAngle}
            setCustomAngle={setCustomAngle}
            applyQuickRotation={applyQuickRotation}
            flipH={flipH}
            setFlipH={setFlipH}
            flipV={flipV}
            setFlipV={setFlipV}
            orientationFilter={orientationFilter}
            setOrientationFilter={setOrientationFilter}
            bgColor={bgColor}
            setBgColor={setBgColor}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            quality={quality}
            setQuality={setQuality}
            isProcessing={isProcessing}
            onRotate={rotateAll}
            onReset={reset}
            matchedCount={matchedCount}
            totalCount={files.length}
            showBgColor={isCustomNonOrtho}
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
  outputFormat,
  onRemove,
}: {
  files: RotateFile[];
  outputFormat: OutputFormat;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
            <th className="px-2 py-3 font-semibold">Orientation</th>
            <th className="px-2 py-3 font-semibold">Size</th>
            <th className="px-2 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
          {files.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.outUrl ?? f.previewUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-surface-200 object-cover dark:border-surface-700"
                  />
                  <p
                    className="truncate text-sm font-medium text-surface-900 dark:text-white"
                    title={f.file.name}
                  >
                    {f.file.name}
                  </p>
                </div>
              </td>
              <td className="px-2 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                {f.origDims
                  ? classifyOrientation(f.origDims.width, f.origDims.height)
                  : "—"}
              </td>
              <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                {formatFileSize(f.file.size)}
                {f.outBlob ? ` → ${formatFileSize(f.outBlob.size)}` : ""}
              </td>
              <td className="px-2 py-3">
                <StatusPill status={f.status} error={f.error} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {f.status === "done" && f.outBlob && (
                    <button
                      type="button"
                      onClick={() => downloadFile(f.outBlob!, outName(f.file, outputFormat))}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsPanel(props: {
  useCustom: boolean;
  setUseCustom: (b: boolean) => void;
  rotationAngle: 0 | 90 | 180 | 270;
  customAngle: number;
  setCustomAngle: (n: number) => void;
  applyQuickRotation: (angle: 90 | 180 | 270) => void;
  flipH: boolean;
  setFlipH: (b: boolean) => void;
  flipV: boolean;
  setFlipV: (b: boolean) => void;
  orientationFilter: Orientation;
  setOrientationFilter: (o: Orientation) => void;
  bgColor: string;
  setBgColor: (c: string) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  quality: number;
  setQuality: (n: number) => void;
  isProcessing: boolean;
  onRotate: () => void;
  onReset: () => void;
  matchedCount: number;
  totalCount: number;
  showBgColor: boolean;
}) {
  const {
    useCustom,
    setUseCustom,
    rotationAngle,
    customAngle,
    setCustomAngle,
    applyQuickRotation,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    orientationFilter,
    setOrientationFilter,
    bgColor,
    setBgColor,
    outputFormat,
    setOutputFormat,
    quality,
    setQuality,
    isProcessing,
    onRotate,
    onReset,
    matchedCount,
    totalCount,
    showBgColor,
  } = props;

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Rotation settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Applied to every file in the queue.
        </p>
      </header>

      {/* Quick rotation buttons */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Quick rotation
        </p>
        <div className="grid grid-cols-3 gap-2">
          <QuickBtn
            active={!useCustom && rotationAngle === 270}
            onClick={() => applyQuickRotation(270)}
            label="90° Left"
            icon={<RotateCcw className="h-4 w-4" />}
          />
          <QuickBtn
            active={!useCustom && rotationAngle === 90}
            onClick={() => applyQuickRotation(90)}
            label="90° Right"
            icon={<RotateCw className="h-4 w-4" />}
          />
          <QuickBtn
            active={!useCustom && rotationAngle === 180}
            onClick={() => applyQuickRotation(180)}
            label="180°"
            icon={<Square className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Flips */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Flip
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ToggleBtn
            active={flipH}
            onClick={() => setFlipH(!flipH)}
            icon={<FlipHorizontal className="h-4 w-4" />}
            label="Horizontal"
          />
          <ToggleBtn
            active={flipV}
            onClick={() => setFlipV(!flipV)}
            icon={<FlipVertical className="h-4 w-4" />}
            label="Vertical"
          />
        </div>
      </div>

      {/* Custom angle */}
      <div className="space-y-1.5">
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-surface-700 dark:text-surface-200">
          <input
            type="checkbox"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="h-4 w-4 accent-primary-600"
          />
          Custom angle
        </label>
        {useCustom && (
          <div className="space-y-2 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Angle
              </span>
              <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
                {customAngle}°
              </span>
            </div>
            <input
              type="range"
              min={-360}
              max={360}
              value={customAngle}
              onChange={(e) => setCustomAngle(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <input
              type="number"
              min={-360}
              max={360}
              value={customAngle}
              onChange={(e) => setCustomAngle(Number(e.target.value) || 0)}
              className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
            {showBgColor && (
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Gap fill colour
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    spellCheck={false}
                    className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs uppercase tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-surface-500 dark:text-surface-400">
                  Non-90° rotations create triangular gaps — this colour fills them.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orientation filter */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Rotate only ({matchedCount} / {totalCount})
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {(["all", "landscape", "portrait", "square"] as Orientation[]).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrientationFilter(o)}
              className={cn(
                "rounded-md border px-2 py-1 text-[11px] font-semibold capitalize transition",
                orientationFilter === o
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Output format */}
      <label className="block space-y-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Output format
        </span>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
          className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        >
          <option value="original">Keep original</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
          <option value="webp">WEBP</option>
        </select>
      </label>
      {outputFormat !== "png" && outputFormat !== "original" && (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Quality
            </span>
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
          />
        </div>
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onRotate}
          disabled={isProcessing || matchedCount === 0}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Rotating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Rotate all
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}

function QuickBtn({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusPill({ status, error }: { status: FileStatus; error?: string }) {
  const map = {
    pending: { icon: <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />, label: "Pending", className: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300" },
    processing: { icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "Processing", className: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200" },
    done: { icon: <CheckCircle2 className="h-3 w-3" />, label: "Done", className: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300" },
    skipped: { icon: <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />, label: "Skipped", className: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300" },
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
