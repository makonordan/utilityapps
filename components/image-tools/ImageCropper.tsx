"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Crop as CropIcon,
  Download,
  Grid3X3,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  canvasToBlob,
  downloadFile,
  formatFileSize,
  getImageDimensions,
  loadImageFromFile,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "crop-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type CropMode = "visual" | "pixels";
type OutputFormat = "original" | "jpeg" | "png" | "webp";
type Handle = "tl" | "t" | "tr" | "r" | "br" | "b" | "bl" | "l" | "body";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AspectOption {
  label: string;
  /** width / height; null = free */
  ratio: number | null;
}

const ASPECT_RATIOS: AspectOption[] = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "9:16", ratio: 9 / 16 },
  { label: "3:4", ratio: 3 / 4 },
];

const MIN_CROP = 20;

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

function suggestedName(file: File, w: number, h: number, output: OutputFormat): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext =
    output === "original"
      ? (dot > 0 ? file.name.slice(dot + 1) : "jpg")
      : output === "jpeg"
        ? "jpg"
        : output;
  return `${stem}-cropped-${w}x${h}.${ext}`;
}

function clampCrop(
  rect: CropRect,
  imgW: number,
  imgH: number
): CropRect {
  let { x, y, w, h } = rect;
  w = Math.max(MIN_CROP, Math.min(w, imgW));
  h = Math.max(MIN_CROP, Math.min(h, imgH));
  x = Math.max(0, Math.min(x, imgW - w));
  y = Math.max(0, Math.min(y, imgH - h));
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** Compute a centred starting crop rect that fits the locked aspect ratio. */
function defaultCrop(imgW: number, imgH: number, ratio: number | null): CropRect {
  let w = imgW * 0.8;
  let h = imgH * 0.8;
  if (ratio != null) {
    // Fit largest rect with the given ratio inside 80% of image.
    if (w / h > ratio) {
      w = h * ratio;
    } else {
      h = w / ratio;
    }
  }
  return clampCrop(
    { x: (imgW - w) / 2, y: (imgH - h) / 2, w, h },
    imgW,
    imgH
  );
}

/**
 * Apply a handle drag with optional aspect-ratio constraint.
 *
 * For corner handles: dx drives the change and dy is derived from the ratio.
 * For edge handles with a locked ratio: the perpendicular dimension grows
 * symmetrically around the perpendicular centre line.
 */
function applyHandleDrag(
  handle: Handle,
  start: CropRect,
  dxImg: number,
  dyImg: number,
  imgW: number,
  imgH: number,
  ratio: number | null
): CropRect {
  // Body = pure translation.
  if (handle === "body") {
    return clampCrop(
      { x: start.x + dxImg, y: start.y + dyImg, w: start.w, h: start.h },
      imgW,
      imgH
    );
  }

  // Free (no AR lock): per-handle edge adjustments.
  if (ratio == null) {
    const r = { ...start };
    if (handle === "tl") {
      r.x = start.x + dxImg;
      r.y = start.y + dyImg;
      r.w = start.w - dxImg;
      r.h = start.h - dyImg;
    } else if (handle === "tr") {
      r.y = start.y + dyImg;
      r.w = start.w + dxImg;
      r.h = start.h - dyImg;
    } else if (handle === "br") {
      r.w = start.w + dxImg;
      r.h = start.h + dyImg;
    } else if (handle === "bl") {
      r.x = start.x + dxImg;
      r.w = start.w - dxImg;
      r.h = start.h + dyImg;
    } else if (handle === "t") {
      r.y = start.y + dyImg;
      r.h = start.h - dyImg;
    } else if (handle === "r") {
      r.w = start.w + dxImg;
    } else if (handle === "b") {
      r.h = start.h + dyImg;
    } else if (handle === "l") {
      r.x = start.x + dxImg;
      r.w = start.w - dxImg;
    }
    // Flip negative dimensions (when handle crosses the opposite edge).
    if (r.w < 0) {
      r.x = r.x + r.w;
      r.w = -r.w;
    }
    if (r.h < 0) {
      r.y = r.y + r.h;
      r.h = -r.h;
    }
    return clampCrop(r, imgW, imgH);
  }

  // Aspect-locked: derive the off-axis dimension from the ratio.
  if (handle === "tl" || handle === "tr" || handle === "br" || handle === "bl") {
    // Compute new width from dx; derive height from ratio. Anchor opposite corner.
    const signX = handle === "tr" || handle === "br" ? 1 : -1; // dx grows width?
    const newW = Math.max(MIN_CROP, start.w + signX * dxImg);
    const newH = newW / ratio;
    let newX = start.x;
    let newY = start.y;
    if (handle === "tl") {
      newX = start.x + start.w - newW;
      newY = start.y + start.h - newH;
    } else if (handle === "tr") {
      newY = start.y + start.h - newH;
    } else if (handle === "bl") {
      newX = start.x + start.w - newW;
    } /* br: anchor top-left, x/y stay */
    return clampCrop({ x: newX, y: newY, w: newW, h: newH }, imgW, imgH);
  }

  // Edge handle with AR lock — grow perpendicular dim symmetrically.
  if (handle === "r" || handle === "l") {
    const signX = handle === "r" ? 1 : -1;
    const newW = Math.max(MIN_CROP, start.w + signX * dxImg);
    const newH = newW / ratio;
    const cx = handle === "r" ? start.x : start.x + start.w; // anchor opposite edge
    const cy = start.y + start.h / 2;
    const newX = handle === "r" ? cx : cx - newW;
    const newY = cy - newH / 2;
    return clampCrop({ x: newX, y: newY, w: newW, h: newH }, imgW, imgH);
  }
  // t / b
  const signY = handle === "b" ? 1 : -1;
  const newH = Math.max(MIN_CROP, start.h + signY * dyImg);
  const newW = newH * ratio;
  const cx = start.x + start.w / 2;
  const cy = handle === "b" ? start.y : start.y + start.h; // anchor opposite edge
  const newY = handle === "b" ? cy : cy - newH;
  const newX = cx - newW / 2;
  return clampCrop({ x: newX, y: newY, w: newW, h: newH }, imgW, imgH);
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 100, h: 100 });
  const [aspectRatio, setAspectRatio] = useState<AspectOption>(ASPECT_RATIOS[0]);
  const [cropMode, setCropMode] = useState<CropMode>("visual");
  const [showGrid, setShowGrid] = useState(true);

  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(95);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ───── Cleanup blob URLs ─────
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    async (selected: File[]) => {
      const f = selected[0];
      if (!f) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(null);
      setResultUrl(null);

      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
      try {
        const dims = await getImageDimensions(f);
        setOriginalDims(dims);
        setCrop(defaultCrop(dims.width, dims.height, aspectRatio.ratio));
      } catch {
        setOriginalDims(null);
      }
    },
    [aspectRatio.ratio, previewUrl, resultUrl]
  );

  // ───── Aspect ratio change → re-fit crop ─────
  const onAspectChange = (opt: AspectOption) => {
    setAspectRatio(opt);
    if (originalDims && opt.ratio != null) {
      // Re-fit the current crop's centre to the new ratio.
      const cx = crop.x + crop.w / 2;
      const cy = crop.y + crop.h / 2;
      let w = crop.w;
      let h = w / opt.ratio;
      if (h > originalDims.height) {
        h = originalDims.height;
        w = h * opt.ratio;
      }
      const newCrop = clampCrop(
        { x: cx - w / 2, y: cy - h / 2, w, h },
        originalDims.width,
        originalDims.height
      );
      setCrop(newCrop);
    }
  };

  // ───── Visual editor refs ─────
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<{
    handle: Handle;
    startPointerX: number;
    startPointerY: number;
    startCrop: CropRect;
  } | null>(null);

  // Track displayed image size for scale calc.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || !originalDims) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [originalDims]);

  const scaleX = originalDims && containerSize.width ? containerSize.width / originalDims.width : 1;
  const scaleY = originalDims && containerSize.height ? containerSize.height / originalDims.height : 1;

  // ───── Pointer handlers ─────
  const onHandlePointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!originalDims) return;
    dragRef.current = {
      handle,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startCrop: { ...crop },
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !originalDims) return;
      e.preventDefault();
      const dxDisp = e.clientX - drag.startPointerX;
      const dyDisp = e.clientY - drag.startPointerY;
      // Convert display delta → image-coord delta.
      const dxImg = scaleX > 0 ? dxDisp / scaleX : 0;
      const dyImg = scaleY > 0 ? dyDisp / scaleY : 0;
      const next = applyHandleDrag(
        drag.handle,
        drag.startCrop,
        dxImg,
        dyImg,
        originalDims.width,
        originalDims.height,
        aspectRatio.ratio
      );
      setCrop(next);
    },
    [aspectRatio.ratio, originalDims, scaleX, scaleY]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  // ───── Pixel mode edits ─────
  const onPixelChange = (key: keyof CropRect, value: number) => {
    if (!originalDims) return;
    const proposed = { ...crop, [key]: Math.max(0, value) };
    if (aspectRatio.ratio != null) {
      if (key === "w") proposed.h = proposed.w / aspectRatio.ratio;
      else if (key === "h") proposed.w = proposed.h * aspectRatio.ratio;
    }
    setCrop(clampCrop(proposed, originalDims.width, originalDims.height));
  };

  // ───── Process crop ─────
  const runCrop = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const { img, cleanup } = await loadImageFromFile(file);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = crop.w;
        canvas.height = crop.h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not acquire 2D context");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
        const mime = pickOutputMime(file.type, outputFormat);
        const blob = await canvasToBlob(canvas, mime, quality / 100);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        const url = URL.createObjectURL(blob);
        setResultBlob(blob);
        setResultUrl(url);
      } finally {
        cleanup();
      }
    } catch (err) {
      console.error("[ImageCropper]", err);
    } finally {
      setIsProcessing(false);
    }
  }, [crop, file, outputFormat, quality, resultUrl]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalDims(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
  }, [previewUrl, resultUrl]);

  return (
    <div className="space-y-6">
      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple={false}
        formatLabels={FORMAT_LABELS}
      />

      {file && previewUrl && originalDims && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Mode tabs */}
            <div className="inline-flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
              <ModeTab active={cropMode === "visual"} onClick={() => setCropMode("visual")}>
                <CropIcon className="h-4 w-4" /> Visual
              </ModeTab>
              <ModeTab active={cropMode === "pixels"} onClick={() => setCropMode("pixels")}>
                Pixels
              </ModeTab>
            </div>

            {/* Editor */}
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-3 dark:border-surface-800 dark:bg-surface-800/40">
              <div
                ref={containerRef}
                style={{ aspectRatio: `${originalDims.width} / ${originalDims.height}` }}
                className="relative mx-auto w-full max-w-full select-none overflow-hidden rounded-xl bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={file.name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover"
                />

                {/* Dark mask outside the crop area — four boxes */}
                <Mask scaleX={scaleX} scaleY={scaleY} crop={crop} imgW={originalDims.width} imgH={originalDims.height} />

                {/* Crop rect overlay (visible only in visual mode) */}
                {cropMode === "visual" && (
                  <div
                    style={{
                      left: crop.x * scaleX,
                      top: crop.y * scaleY,
                      width: crop.w * scaleX,
                      height: crop.h * scaleY,
                    }}
                    className="absolute touch-none cursor-move"
                    onPointerDown={onHandlePointerDown("body")}
                  >
                    {/* Border */}
                    <div className="pointer-events-none absolute inset-0 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />

                    {/* Rule-of-thirds grid */}
                    {showGrid && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-y-0 left-1/3 w-px bg-white/60" />
                        <div className="absolute inset-y-0 left-2/3 w-px bg-white/60" />
                        <div className="absolute inset-x-0 top-1/3 h-px bg-white/60" />
                        <div className="absolute inset-x-0 top-2/3 h-px bg-white/60" />
                      </div>
                    )}

                    {/* Dimensions badge */}
                    <div className="pointer-events-none absolute -top-7 left-0 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                      {Math.round(crop.w)} × {Math.round(crop.h)} px
                    </div>

                    {/* Handles */}
                    <HandleDot pos="tl" onPointerDown={onHandlePointerDown("tl")} />
                    <HandleDot pos="t" onPointerDown={onHandlePointerDown("t")} />
                    <HandleDot pos="tr" onPointerDown={onHandlePointerDown("tr")} />
                    <HandleDot pos="r" onPointerDown={onHandlePointerDown("r")} />
                    <HandleDot pos="br" onPointerDown={onHandlePointerDown("br")} />
                    <HandleDot pos="b" onPointerDown={onHandlePointerDown("b")} />
                    <HandleDot pos="bl" onPointerDown={onHandlePointerDown("bl")} />
                    <HandleDot pos="l" onPointerDown={onHandlePointerDown("l")} />
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-surface-600 dark:text-surface-300">
                  Source: {originalDims.width} × {originalDims.height} px · {formatFileSize(file.size)}
                </p>
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition",
                    showGrid
                      ? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                      : "border-surface-200 bg-white text-surface-600 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
                  )}
                >
                  <Grid3X3 className="h-3 w-3" />
                  Rule of thirds
                </button>
              </div>
            </div>

            {/* Pixel mode inputs */}
            {cropMode === "pixels" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <PixelField
                  label="X offset"
                  value={crop.x}
                  onChange={(v) => onPixelChange("x", v)}
                  max={originalDims.width - MIN_CROP}
                />
                <PixelField
                  label="Y offset"
                  value={crop.y}
                  onChange={(v) => onPixelChange("y", v)}
                  max={originalDims.height - MIN_CROP}
                />
                <PixelField
                  label="Width"
                  value={crop.w}
                  onChange={(v) => onPixelChange("w", v)}
                  max={originalDims.width}
                />
                <PixelField
                  label="Height"
                  value={crop.h}
                  onChange={(v) => onPixelChange("h", v)}
                  max={originalDims.height}
                />
              </div>
            )}

            {/* Result */}
            {resultBlob && resultUrl && (
              <div className="space-y-3 rounded-2xl border border-success-200 bg-success-50/60 p-5 dark:border-success-500/40 dark:bg-success-500/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
                  Crop ready
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Cropped result"
                  className="block max-h-72 w-full rounded-lg border border-white object-contain dark:border-surface-800"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-surface-700 dark:text-surface-200">
                    {Math.round(crop.w)} × {Math.round(crop.h)} px ·{" "}
                    {formatFileSize(resultBlob.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile(
                        resultBlob,
                        suggestedName(file, Math.round(crop.w), Math.round(crop.h), outputFormat)
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          <CropSettings
            aspectRatio={aspectRatio}
            onAspectChange={onAspectChange}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            quality={quality}
            setQuality={setQuality}
            isProcessing={isProcessing}
            onCrop={runCrop}
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

function Mask({
  scaleX,
  scaleY,
  crop,
  imgW,
  imgH,
}: {
  scaleX: number;
  scaleY: number;
  crop: CropRect;
  imgW: number;
  imgH: number;
}) {
  const dx = crop.x * scaleX;
  const dy = crop.y * scaleY;
  const dw = crop.w * scaleX;
  const dh = crop.h * scaleY;
  const totalW = imgW * scaleX;
  const totalH = imgH * scaleY;
  const dim = "bg-black/60";

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className={cn("absolute", dim)} style={{ left: 0, top: 0, width: totalW, height: dy }} />
      <div className={cn("absolute", dim)} style={{ left: 0, top: dy + dh, width: totalW, height: totalH - dy - dh }} />
      <div className={cn("absolute", dim)} style={{ left: 0, top: dy, width: dx, height: dh }} />
      <div className={cn("absolute", dim)} style={{ left: dx + dw, top: dy, width: totalW - dx - dw, height: dh }} />
    </div>
  );
}

const HANDLE_STYLES: Record<Exclude<Handle, "body">, { className: string; cursor: string }> = {
  tl: { className: "-left-1.5 -top-1.5", cursor: "cursor-nwse-resize" },
  t: { className: "left-1/2 -top-1.5 -translate-x-1/2", cursor: "cursor-ns-resize" },
  tr: { className: "-right-1.5 -top-1.5", cursor: "cursor-nesw-resize" },
  r: { className: "-right-1.5 top-1/2 -translate-y-1/2", cursor: "cursor-ew-resize" },
  br: { className: "-right-1.5 -bottom-1.5", cursor: "cursor-nwse-resize" },
  b: { className: "left-1/2 -bottom-1.5 -translate-x-1/2", cursor: "cursor-ns-resize" },
  bl: { className: "-left-1.5 -bottom-1.5", cursor: "cursor-nesw-resize" },
  l: { className: "-left-1.5 top-1/2 -translate-y-1/2", cursor: "cursor-ew-resize" },
};

function HandleDot({
  pos,
  onPointerDown,
}: {
  pos: Exclude<Handle, "body">;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const s = HANDLE_STYLES[pos];
  return (
    <div
      onPointerDown={onPointerDown}
      className={cn(
        "absolute z-10 h-3 w-3 rounded-full border-2 border-white bg-primary-600 shadow-md ring-1 ring-black/30 touch-none",
        s.className,
        s.cursor
      )}
    />
  );
}

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

function PixelField({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        min={0}
        max={max}
        className="mt-1 w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm tabular-nums text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
      />
    </label>
  );
}

function CropSettings({
  aspectRatio,
  onAspectChange,
  outputFormat,
  setOutputFormat,
  quality,
  setQuality,
  isProcessing,
  onCrop,
  onReset,
}: {
  aspectRatio: AspectOption;
  onAspectChange: (opt: AspectOption) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  quality: number;
  setQuality: (n: number) => void;
  isProcessing: boolean;
  onCrop: () => void;
  onReset: () => void;
}) {
  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Crop settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Drag the handles, or switch to Pixels for exact values.
        </p>
      </header>

      {/* Aspect ratio chips */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Aspect ratio
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ASPECT_RATIOS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onAspectChange(opt)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                opt.label === aspectRatio.label
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:border-primary-500"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
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

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onCrop}
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Cropping…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Crop image
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

