"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Archive,
  Bold,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Italic,
  Layers,
  Loader2,
  RotateCcw,
  Stamp,
  Type,
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
  loadImageFromFile,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "watermark-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type WatermarkType = "text" | "image";
type FileStatus = "pending" | "processing" | "done" | "error";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "tile";

interface TextOptions {
  text: string;
  font: string;
  size: number; // px
  color: string;
  bold: boolean;
  italic: boolean;
}

interface ProcessFile {
  id: string;
  file: File;
  previewUrl: string;
  outBlob: Blob | null;
  outUrl: string | null;
  status: FileStatus;
  error?: string;
}

type OutputFormat = "original" | "png" | "jpeg" | "webp";

const FONTS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Courier New",
  "Impact",
  "Comic Sans MS",
  "Tahoma",
];

let __pid = 0;
const nextId = () => `wm-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function pickOutputMime(originalType: string, output: OutputFormat): ImageMimeType {
  if (output === "original") {
    if (originalType === "image/png") return "image/png";
    if (originalType === "image/webp") return "image/webp";
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
  return `${stem}-watermarked.${ext}`;
}

/**
 * Convert percentage-margin (0..100) into pixels, then compute the anchor
 * point on the image for the given position.
 */
function getAnchor(
  position: Exclude<Position, "tile">,
  imgW: number,
  imgH: number,
  marginPct: number
): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
  // Margin is interpreted as a percentage of the smaller image dimension.
  const margin = (Math.min(imgW, imgH) * marginPct) / 100;
  const cx = imgW / 2;
  const cy = imgH / 2;
  const left = margin;
  const right = imgW - margin;
  const top = margin;
  const bottom = imgH - margin;

  switch (position) {
    case "top-left":
      return { x: left, y: top, align: "left", baseline: "top" };
    case "top-center":
      return { x: cx, y: top, align: "center", baseline: "top" };
    case "top-right":
      return { x: right, y: top, align: "right", baseline: "top" };
    case "center-left":
      return { x: left, y: cy, align: "left", baseline: "middle" };
    case "center":
      return { x: cx, y: cy, align: "center", baseline: "middle" };
    case "center-right":
      return { x: right, y: cy, align: "right", baseline: "middle" };
    case "bottom-left":
      return { x: left, y: bottom, align: "left", baseline: "bottom" };
    case "bottom-center":
      return { x: cx, y: bottom, align: "center", baseline: "bottom" };
    case "bottom-right":
      return { x: right, y: bottom, align: "right", baseline: "bottom" };
  }
}

function fontString(opts: TextOptions): string {
  const style = opts.italic ? "italic " : "";
  const weight = opts.bold ? "bold " : "normal ";
  return `${style}${weight}${opts.size}px ${opts.font}, sans-serif`;
}

/** Draw a watermark (text or image) onto a fresh copy of `baseCanvas`. */
function drawWatermark(
  baseCanvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  opts: {
    type: WatermarkType;
    text: TextOptions;
    imageEl: HTMLImageElement | null;
    position: Position;
    margin: number;
    opacity: number;
    rotation: number;
    scale: number;
  }
): void {
  const { type, text, imageEl, position, margin, opacity, rotation, scale } = opts;
  const w = baseCanvas.width;
  const h = baseCanvas.height;
  const alpha = Math.max(0, Math.min(1, opacity / 100));

  ctx.save();
  ctx.globalAlpha = alpha;

  // ── Tile mode ──
  if (position === "tile") {
    // For text: lay out a 6×6 grid of strings at 30° tilt by default.
    if (type === "text" && text.text.trim()) {
      ctx.font = fontString({ ...text, size: Math.max(12, text.size) });
      ctx.fillStyle = text.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const metrics = ctx.measureText(text.text);
      const stepX = Math.max(metrics.width + 80, w / 4);
      const stepY = Math.max(text.size * 3, h / 5);
      ctx.translate(w / 2, h / 2);
      ctx.rotate(((rotation || 30) * Math.PI) / 180);
      const cols = Math.ceil(w / stepX) + 4;
      const rows = Math.ceil(h / stepY) + 4;
      for (let r = -rows; r <= rows; r++) {
        for (let c = -cols; c <= cols; c++) {
          ctx.fillText(text.text, c * stepX, r * stepY);
        }
      }
    } else if (type === "image" && imageEl) {
      const tileW = (w * scale) / 100;
      const ratio = imageEl.naturalWidth / imageEl.naturalHeight || 1;
      const tileH = tileW / ratio;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(((rotation || 30) * Math.PI) / 180);
      const stepX = tileW + 40;
      const stepY = tileH + 40;
      const cols = Math.ceil(w / stepX) + 4;
      const rows = Math.ceil(h / stepY) + 4;
      for (let r = -rows; r <= rows; r++) {
        for (let c = -cols; c <= cols; c++) {
          ctx.drawImage(imageEl, c * stepX - tileW / 2, r * stepY - tileH / 2, tileW, tileH);
        }
      }
    }
    ctx.restore();
    return;
  }

  // ── Single placement ──
  const anchor = getAnchor(position, w, h, margin);
  ctx.translate(anchor.x, anchor.y);
  if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);

  if (type === "text" && text.text.trim()) {
    ctx.font = fontString(text);
    ctx.fillStyle = text.color;
    ctx.textAlign = anchor.align;
    ctx.textBaseline = anchor.baseline;
    ctx.fillText(text.text, 0, 0);
  } else if (type === "image" && imageEl) {
    const wmW = (w * scale) / 100;
    const ratio = imageEl.naturalWidth / imageEl.naturalHeight || 1;
    const wmH = wmW / ratio;
    // Adjust origin to honour the alignment of the anchor (left / center / right + top / middle / bottom).
    let ox = 0;
    let oy = 0;
    if (anchor.align === "center") ox = -wmW / 2;
    else if (anchor.align === "right") ox = -wmW;
    if (anchor.baseline === "middle") oy = -wmH / 2;
    else if (anchor.baseline === "bottom") oy = -wmH;
    ctx.drawImage(imageEl, ox, oy, wmW, wmH);
  }

  ctx.restore();
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function WatermarkImage() {
  const [files, setFiles] = useState<ProcessFile[]>([]);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>("text");
  const [textOptions, setTextOptions] = useState<TextOptions>({
    text: "© Your Brand",
    font: "Arial",
    size: 48,
    color: "#FFFFFF",
    bold: true,
    italic: false,
  });
  const [imageWatermarkFile, setImageWatermarkFile] = useState<File | null>(null);
  const [imageWatermarkUrl, setImageWatermarkUrl] = useState<string | null>(null);
  const imageWatermarkElRef = useRef<HTMLImageElement | null>(null);

  const [position, setPosition] = useState<Position>("bottom-right");
  const [margin, setMargin] = useState(4);
  const [opacity, setOpacity] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(20);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");

  // Preview canvas (debounced redraw)
  const previewRef = useRef<HTMLCanvasElement>(null);
  const previewBaseRef = useRef<HTMLCanvasElement | null>(null);
  const [previewDims, setPreviewDims] = useState<{ w: number; h: number } | null>(null);

  // ───── Cleanup on unmount ─────
  useEffect(() => {
    return () => {
      for (const f of files) {
        URL.revokeObjectURL(f.previewUrl);
        if (f.outUrl) URL.revokeObjectURL(f.outUrl);
      }
      if (imageWatermarkUrl) URL.revokeObjectURL(imageWatermarkUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback((selected: File[]) => {
    const next: ProcessFile[] = selected.map((f) => ({
      id: nextId(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      outBlob: null,
      outUrl: null,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...next]);
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

  const onWatermarkImageSelected = useCallback(
    async (selected: File[]) => {
      const f = selected[0];
      if (!f) return;
      if (imageWatermarkUrl) URL.revokeObjectURL(imageWatermarkUrl);
      const url = URL.createObjectURL(f);
      setImageWatermarkFile(f);
      setImageWatermarkUrl(url);
      // Preload into an HTMLImageElement so we can draw it.
      const img = new Image();
      img.onload = () => {
        imageWatermarkElRef.current = img;
      };
      img.src = url;
    },
    [imageWatermarkUrl]
  );

  // ───── Preview canvas: load first file as base ─────
  useEffect(() => {
    const first = files[0];
    if (!first) {
      previewBaseRef.current = null;
      setPreviewDims(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { img, cleanup } = await loadImageFromFile(first.file);
        if (cancelled) {
          cleanup();
          return;
        }
        // Fit to a reasonable preview size for performance.
        const maxW = 900;
        const scaleFit = Math.min(1, maxW / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scaleFit);
        const h = Math.round(img.naturalHeight * scaleFit);
        const base = document.createElement("canvas");
        base.width = w;
        base.height = h;
        const ctx = base.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        cleanup();
        previewBaseRef.current = base;
        setPreviewDims({ w, h });
      } catch {
        previewBaseRef.current = null;
        setPreviewDims(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [files]);

  // ───── Debounced preview redraw ─────
  useEffect(() => {
    const t = window.setTimeout(() => {
      const canvas = previewRef.current;
      const base = previewBaseRef.current;
      if (!canvas || !base || !previewDims) return;
      canvas.width = previewDims.w;
      canvas.height = previewDims.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(base, 0, 0);
      drawWatermark(canvas, ctx, {
        type: watermarkType,
        text: textOptions,
        imageEl: imageWatermarkElRef.current,
        position,
        margin,
        opacity,
        rotation,
        scale,
      });
    }, 300);
    return () => window.clearTimeout(t);
  }, [
    imageWatermarkUrl,
    margin,
    opacity,
    position,
    previewDims,
    rotation,
    scale,
    textOptions,
    watermarkType,
  ]);

  // ───── Process all files ─────
  const applyAll = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;
    if (watermarkType === "text" && !textOptions.text.trim()) return;
    if (watermarkType === "image" && !imageWatermarkElRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProgressIndex(i);
        setProgressFile(item.file.name);
        setProgress(20);

        setFiles((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "processing" } : p))
        );

        try {
          const { img, cleanup } = await loadImageFromFile(item.file);
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("2D context unavailable");
            ctx.drawImage(img, 0, 0);
            setProgress(50);
            // Scale the text size to the source resolution so the watermark
            // matches the size the user previewed regardless of preview scale.
            const previewW = previewBaseRef.current?.width ?? canvas.width;
            const scaleFromPreview = canvas.width / previewW;
            const scaledText: TextOptions = {
              ...textOptions,
              size: Math.max(8, Math.round(textOptions.size * scaleFromPreview)),
            };
            drawWatermark(canvas, ctx, {
              type: watermarkType,
              text: scaledText,
              imageEl: imageWatermarkElRef.current,
              position,
              margin,
              opacity,
              rotation,
              scale,
            });
            setProgress(80);
            const mime = pickOutputMime(item.file.type, outputFormat);
            const blob = await canvasToBlob(canvas, mime, quality / 100);
            const url = URL.createObjectURL(blob);
            setFiles((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? { ...p, status: "done", outBlob: blob, outUrl: url }
                  : p
              )
            );
            setProgress(100);
          } finally {
            cleanup();
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Watermark failed";
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
    files,
    imageWatermarkElRef,
    isProcessing,
    margin,
    opacity,
    outputFormat,
    position,
    quality,
    rotation,
    scale,
    textOptions,
    watermarkType,
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
      "watermarked-images.zip"
    );
  }, [files, outputFormat]);

  const reset = useCallback(() => {
    for (const f of files) {
      URL.revokeObjectURL(f.previewUrl);
      if (f.outUrl) URL.revokeObjectURL(f.outUrl);
    }
    setFiles([]);
  }, [files]);

  const completedCount = files.filter((f) => f.status === "done").length;
  const hasFiles = files.length > 0;
  const canApply =
    hasFiles &&
    !isProcessing &&
    ((watermarkType === "text" && !!textOptions.text.trim()) ||
      (watermarkType === "image" && !!imageWatermarkElRef.current));

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
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {/* Live preview */}
            <div className="space-y-2 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Preview · first image
              </p>
              <div className="overflow-auto rounded-lg border border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800">
                <canvas ref={previewRef} className="block max-w-full" />
              </div>
            </div>

            <ResultTable files={files} outputFormat={outputFormat} onRemove={removeFile} />

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                currentFile={progressFile}
                totalFiles={files.length}
                processedFiles={progressIndex}
                stage="Watermarking"
              />
            )}

            {completedCount > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                  {completedCount} of {files.length} watermarked
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
            watermarkType={watermarkType}
            setWatermarkType={setWatermarkType}
            textOptions={textOptions}
            setTextOptions={setTextOptions}
            imageWatermarkFile={imageWatermarkFile}
            imageWatermarkUrl={imageWatermarkUrl}
            onWatermarkImageSelected={onWatermarkImageSelected}
            position={position}
            setPosition={setPosition}
            margin={margin}
            setMargin={setMargin}
            opacity={opacity}
            setOpacity={setOpacity}
            rotation={rotation}
            setRotation={setRotation}
            scale={scale}
            setScale={setScale}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            quality={quality}
            setQuality={setQuality}
            isProcessing={isProcessing}
            canApply={canApply}
            onApply={applyAll}
            onReset={reset}
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
  files: ProcessFile[];
  outputFormat: OutputFormat;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
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

const POSITION_GRID: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function SettingsPanel(props: {
  watermarkType: WatermarkType;
  setWatermarkType: (t: WatermarkType) => void;
  textOptions: TextOptions;
  setTextOptions: (o: TextOptions) => void;
  imageWatermarkFile: File | null;
  imageWatermarkUrl: string | null;
  onWatermarkImageSelected: (files: File[]) => void;
  position: Position;
  setPosition: (p: Position) => void;
  margin: number;
  setMargin: (n: number) => void;
  opacity: number;
  setOpacity: (n: number) => void;
  rotation: number;
  setRotation: (n: number) => void;
  scale: number;
  setScale: (n: number) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  quality: number;
  setQuality: (n: number) => void;
  isProcessing: boolean;
  canApply: boolean;
  onApply: () => void;
  onReset: () => void;
}) {
  const {
    watermarkType,
    setWatermarkType,
    textOptions,
    setTextOptions,
    imageWatermarkFile,
    imageWatermarkUrl,
    onWatermarkImageSelected,
    position,
    setPosition,
    margin,
    setMargin,
    opacity,
    setOpacity,
    rotation,
    setRotation,
    scale,
    setScale,
    outputFormat,
    setOutputFormat,
    quality,
    setQuality,
    isProcessing,
    canApply,
    onApply,
    onReset,
  } = props;

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Watermark settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Applied to every file in the queue.
        </p>
      </header>

      {/* Type toggle */}
      <div className="inline-flex w-full rounded-lg bg-surface-100 p-0.5 dark:bg-surface-800">
        <ToggleTab active={watermarkType === "text"} onClick={() => setWatermarkType("text")}>
          <Type className="h-3.5 w-3.5" /> Text
        </ToggleTab>
        <ToggleTab active={watermarkType === "image"} onClick={() => setWatermarkType("image")}>
          <ImageIcon className="h-3.5 w-3.5" /> Image
        </ToggleTab>
      </div>

      {/* Text panel */}
      {watermarkType === "text" && (
        <div className="space-y-3">
          <Field label="Watermark text">
            <input
              type="text"
              value={textOptions.text}
              onChange={(e) => setTextOptions({ ...textOptions, text: e.target.value })}
              placeholder="Enter your watermark text"
              className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
          </Field>
          <Field label="Font">
            <select
              value={textOptions.font}
              onChange={(e) => setTextOptions({ ...textOptions, font: e.target.value })}
              className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Font size · ${textOptions.size}px`}>
            <input
              type="range"
              min={12}
              max={200}
              value={textOptions.size}
              onChange={(e) => setTextOptions({ ...textOptions, size: Number(e.target.value) })}
              className="w-full accent-primary-600"
            />
          </Field>
          <div className="flex items-center gap-2">
            <ToggleBtn
              active={textOptions.bold}
              onClick={() => setTextOptions({ ...textOptions, bold: !textOptions.bold })}
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </ToggleBtn>
            <ToggleBtn
              active={textOptions.italic}
              onClick={() => setTextOptions({ ...textOptions, italic: !textOptions.italic })}
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </ToggleBtn>
            <input
              type="color"
              value={textOptions.color}
              onChange={(e) => setTextOptions({ ...textOptions, color: e.target.value })}
              className="ml-auto h-7 w-9 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
              title="Text colour"
            />
          </div>
        </div>
      )}

      {/* Image panel */}
      {watermarkType === "image" && (
        <div className="space-y-2">
          {imageWatermarkUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageWatermarkUrl}
                alt="watermark"
                className="h-12 w-12 rounded-md border border-surface-200 bg-white object-contain dark:border-surface-700 dark:bg-surface-900"
              />
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-medium text-surface-900 dark:text-white"
                  title={imageWatermarkFile?.name}
                >
                  {imageWatermarkFile?.name}
                </p>
                <p className="text-[11px] text-surface-500 dark:text-surface-400">
                  {imageWatermarkFile && formatFileSize(imageWatermarkFile.size)}
                </p>
              </div>
            </div>
          ) : (
            <ImageDropZone
              onFilesSelected={onWatermarkImageSelected}
              acceptedFormats={["image/png", "image/jpeg", "image/webp", "image/svg+xml"]}
              maxSizeMB={5}
              multiple={false}
              formatLabels={["PNG", "JPG", "WEBP", "SVG"]}
            />
          )}
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            PNG with transparency works best for logos and signatures.
          </p>
        </div>
      )}

      {/* Position grid + tile */}
      <Field label="Position">
        <div className="grid grid-cols-3 gap-1.5">
          {POSITION_GRID.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPosition(p)}
              title={p.replace("-", " ")}
              className={cn(
                "flex h-9 items-center justify-center rounded-md border text-[10px] font-semibold transition",
                position === p
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-500 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400"
              )}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-current" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPosition("tile")}
          className={cn(
            "mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition",
            position === "tile"
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
              : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
          )}
        >
          <Layers className="h-3.5 w-3.5" /> Tile across image
        </button>
      </Field>

      <Slider label="Margin" value={margin} min={0} max={20} unit="%" onChange={setMargin} />
      <Slider label="Opacity" value={opacity} min={0} max={100} unit="%" onChange={setOpacity} />
      <Slider label="Rotation" value={rotation} min={-180} max={180} unit="°" onChange={setRotation} />
      {watermarkType === "image" && (
        <Slider label="Scale" value={scale} min={5} max={80} unit="%" onChange={setScale} />
      )}

      {/* Output */}
      <Field label="Output format">
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
      </Field>
      {outputFormat !== "png" && outputFormat !== "original" && (
        <Slider label="Quality" value={quality} min={1} max={100} onChange={setQuality} />
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onApply}
          disabled={!canApply}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Watermarking…
            </>
          ) : (
            <>
              <Stamp className="h-4 w-4" /> Apply watermark
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

function ToggleTab({
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
        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "bg-white text-surface-900 shadow-sm dark:bg-surface-900 dark:text-white"
          : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
      )}
    >
      {children}
    </button>
  );
}

function ToggleBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
          {value}
          {unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
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
