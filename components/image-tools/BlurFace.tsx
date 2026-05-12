"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  Brain,
  Circle as CircleIcon,
  Download,
  EyeOff,
  Loader2,
  MousePointer2,
  RotateCcw,
  Scan,
  ShieldCheck,
  Square,
  Wand2,
  X,
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
  loadImageFromFile,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "blur-face";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

/**
 * Where to load the face-api weights from.
 *
 * Models are mirrored by jsDelivr from the npm package, so we don't need to
 * commit ~1 MB of `.bin` files into `public/`. If you'd rather host the
 * models yourself (for offline use or stricter CSP), download the contents
 * of `node_modules/@vladmandic/face-api/model/` into `public/models/` and
 * change `MODEL_URL` to `"/models"`.
 */
const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Mode = "faces" | "manual" | "both";
type Shape = "rectangle" | "oval";

interface Region {
  id: string;
  /** Coordinates in *image* (natural) pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** True for AI-detected regions, false for user-drawn ones. */
  auto: boolean;
}

let __pid = 0;
const nextId = () => `r-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function clampBox(
  x: number,
  y: number,
  w: number,
  h: number,
  imgW: number,
  imgH: number
): { x: number; y: number; w: number; h: number } {
  const cx = Math.max(0, Math.min(imgW - 1, x));
  const cy = Math.max(0, Math.min(imgH - 1, y));
  const cw = Math.max(4, Math.min(imgW - cx, w));
  const ch = Math.max(4, Math.min(imgH - cy, h));
  return { x: cx, y: cy, w: cw, h: ch };
}

/**
 * Pixelate a rectangular region of `srcCanvas` (the source pixels) onto
 * `dstCtx`. If `oval` is true, the pixelated region is clipped into an
 * ellipse fitted to the box.
 */
function pixelateRegion(
  srcCanvas: HTMLCanvasElement,
  dstCtx: CanvasRenderingContext2D,
  region: Region,
  blockSize: number,
  oval: boolean
): void {
  const { x, y, w, h } = region;
  // Downsample to a tiny canvas, then blow it back up — classic pixelation.
  const tinyW = Math.max(1, Math.floor(w / blockSize));
  const tinyH = Math.max(1, Math.floor(h / blockSize));
  const tiny = document.createElement("canvas");
  tiny.width = tinyW;
  tiny.height = tinyH;
  const tctx = tiny.getContext("2d");
  if (!tctx) return;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(srcCanvas, x, y, w, h, 0, 0, tinyW, tinyH);

  dstCtx.save();
  if (oval) {
    dstCtx.beginPath();
    dstCtx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    dstCtx.clip();
  }
  dstCtx.imageSmoothingEnabled = false;
  dstCtx.drawImage(tiny, 0, 0, tinyW, tinyH, x, y, w, h);
  dstCtx.restore();
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function BlurFace() {
  // Model lifecycle
  const faceapiRef = useRef<typeof import("@vladmandic/face-api") | null>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // File + image
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  // Source-image canvas kept in memory so we can blur on demand at full res.
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Regions
  const [regions, setRegions] = useState<Region[]>([]);

  // Settings
  const [mode, setMode] = useState<Mode>("faces");
  const [blurIntensity, setBlurIntensity] = useState(15);
  const [blurShape, setBlurShape] = useState<Shape>("oval");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Detection + processing state
  const [isDetecting, setIsDetecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Display sizing (for overlay math)
  const displayRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  // ───── Load face-api on mount ─────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const faceapi = await import("@vladmandic/face-api");
        if (cancelled) return;
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        if (cancelled) return;
        faceapiRef.current = faceapi;
        setModelReady(true);
        setModelLoading(false);
      } catch (err) {
        console.error("[BlurFace/model]", err);
        if (!cancelled) {
          setModelError(
            err instanceof Error
              ? err.message
              : "Could not load the face-detection model"
          );
          setModelLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ───── Cleanup blob URLs ─────
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── Track display container size for overlay math ─────
  useLayoutEffect(() => {
    const el = displayRef.current;
    if (!el || !imageDims) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDisplaySize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [imageDims]);

  const scaleX = imageDims && displaySize.width ? displaySize.width / imageDims.w : 1;
  const scaleY = imageDims && displaySize.height ? displaySize.height / imageDims.h : 1;

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    async (selected: File[]) => {
      const f = selected[0];
      if (!f) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      const url = URL.createObjectURL(f);
      setFile(f);
      setImageUrl(url);
      setResultBlob(null);
      setResultUrl(null);
      setRegions([]);
      setError(null);
      setShowOriginal(false);

      try {
        const { img, cleanup } = await loadImageFromFile(f);
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          // Keep the source pixels in a canvas so we can blur multiple
          // times without re-decoding.
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          c.getContext("2d")!.drawImage(img, 0, 0);
          sourceCanvasRef.current = c;
          setImageDims({ w, h });
        } finally {
          cleanup();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not decode image");
      }
    },
    [imageUrl, resultUrl]
  );

  // ───── Auto-detect faces ─────
  const detectFaces = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const source = sourceCanvasRef.current;
    if (!faceapi || !source || !imageDims) return;

    setIsDetecting(true);
    setError(null);
    try {
      const opts = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: Math.max(0.1, Math.min(0.95, confidenceThreshold)),
      });
      const detections = await faceapi.detectAllFaces(source, opts);
      const auto: Region[] = detections.map((d) => {
        const box = d.box;
        // Pad slightly so the blur covers ears + chin + forehead.
        const padX = box.width * 0.08;
        const padY = box.height * 0.12;
        const c = clampBox(
          box.x - padX,
          box.y - padY,
          box.width + padX * 2,
          box.height + padY * 2,
          imageDims.w,
          imageDims.h
        );
        return { id: nextId(), x: c.x, y: c.y, w: c.w, h: c.h, auto: true };
      });
      // Replace prior auto-detected regions; keep manual ones intact.
      setRegions((prev) => [...prev.filter((r) => !r.auto), ...auto]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed");
    } finally {
      setIsDetecting(false);
    }
  }, [confidenceThreshold, imageDims]);

  // ───── Apply blur and produce a downloadable blob ─────
  const applyBlur = useCallback(async () => {
    const source = sourceCanvasRef.current;
    if (!source || !imageDims || regions.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const out = document.createElement("canvas");
      out.width = imageDims.w;
      out.height = imageDims.h;
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("2D context unavailable");
      // Start from the source pixels.
      ctx.drawImage(source, 0, 0);

      for (const r of regions) {
        pixelateRegion(source, ctx, r, blurIntensity, blurShape === "oval");
      }

      // Re-encode in the original image's MIME when possible.
      const mime =
        file?.type === "image/png" || file?.type === "image/webp"
          ? file.type
          : "image/jpeg";
      const blob = await canvasToBlob(out, mime as "image/png" | "image/jpeg" | "image/webp", 0.95);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Blur application failed");
    } finally {
      setIsProcessing(false);
    }
  }, [blurIntensity, blurShape, file?.type, imageDims, regions, resultUrl]);

  // ───── Region management ─────
  const removeRegion = (id: string) =>
    setRegions((prev) => prev.filter((r) => r.id !== id));
  const clearManual = () =>
    setRegions((prev) => prev.filter((r) => r.auto));
  const clearAll = () => setRegions([]);

  // ───── Manual drawing ─────
  const drawingRef = useRef<{
    startX: number;
    startY: number;
    id: string;
  } | null>(null);

  const allowDrawing = mode === "manual" || mode === "both";

  const onDrawPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!allowDrawing || !imageDims) return;
    // Don't start a draw if the click landed on an existing handle (X button).
    const target = e.target as HTMLElement;
    if (target.dataset.handle === "true") return;

    const layer = displayRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const startXImg = (e.clientX - rect.left) / Math.max(scaleX, 0.0001);
    const startYImg = (e.clientY - rect.top) / Math.max(scaleY, 0.0001);
    if (
      startXImg < 0 ||
      startYImg < 0 ||
      startXImg > imageDims.w ||
      startYImg > imageDims.h
    )
      return;

    const newRegion: Region = {
      id: nextId(),
      x: startXImg,
      y: startYImg,
      w: 4,
      h: 4,
      auto: false,
    };
    drawingRef.current = { startX: startXImg, startY: startYImg, id: newRegion.id };
    setRegions((prev) => [...prev, newRegion]);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onDrawPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = drawingRef.current;
    if (!drag || !imageDims) return;
    const layer = displayRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const curX = (e.clientX - rect.left) / Math.max(scaleX, 0.0001);
    const curY = (e.clientY - rect.top) / Math.max(scaleY, 0.0001);
    const x = Math.min(drag.startX, curX);
    const y = Math.min(drag.startY, curY);
    const w = Math.abs(curX - drag.startX);
    const h = Math.abs(curY - drag.startY);
    const c = clampBox(x, y, w, h, imageDims.w, imageDims.h);
    setRegions((prev) =>
      prev.map((r) => (r.id === drag.id ? { ...r, ...c } : r))
    );
  };

  const onDrawPointerUp = () => {
    const drag = drawingRef.current;
    if (drag) {
      // If the user just clicked without dragging, the box stays at the
      // minimum 4×4 — drop it as garbage.
      setRegions((prev) =>
        prev.filter((r) => !(r.id === drag.id && r.w < 12 && r.h < 12))
      );
    }
    drawingRef.current = null;
  };

  // Live preview canvas: re-render whenever regions/intensity/shape change.
  // We render into a separate visible canvas so the user sees the blur effect
  // continuously.
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const source = sourceCanvasRef.current;
    const preview = previewCanvasRef.current;
    if (!source || !preview || !imageDims) return;
    preview.width = imageDims.w;
    preview.height = imageDims.h;
    const ctx = preview.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(source, 0, 0);
    if (!showOriginal) {
      for (const r of regions) {
        pixelateRegion(source, ctx, r, blurIntensity, blurShape === "oval");
      }
    }
  }, [blurIntensity, blurShape, imageDims, regions, showOriginal]);

  // Download
  const download = useCallback(async () => {
    // Apply if we don't have a result yet, then download.
    if (!resultBlob) {
      await applyBlur();
      // The state setter above won't have flushed yet; read from the canvas
      // directly as a fallback.
      const preview = previewCanvasRef.current;
      if (!preview || !file) return;
      const blob = await canvasToBlob(preview, "image/png", 0.95);
      downloadFile(blob, suggestedName(file));
      return;
    }
    if (!file) return;
    downloadFile(resultBlob, suggestedName(file));
  }, [applyBlur, file, resultBlob]);

  const reset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    sourceCanvasRef.current = null;
    setFile(null);
    setImageUrl(null);
    setImageDims(null);
    setRegions([]);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setShowOriginal(false);
  }, [imageUrl, resultUrl]);

  const autoCount = useMemo(() => regions.filter((r) => r.auto).length, [regions]);
  const manualCount = regions.length - autoCount;

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Privacy reassurance — important framing for this tool */}
      <div className="flex items-start gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400" />
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">
            Photos never leave your browser
          </p>
          <p className="text-xs text-surface-600 dark:text-surface-300">
            The face-detection model and the blurring both run on your device.
            Nothing is uploaded — safe for personal photos, surveillance
            stills, and journalistic sources.
          </p>
        </div>
      </div>

      {/* Model loading banner */}
      {!modelReady && (
        <div
          className={cn(
            "rounded-2xl border p-4",
            modelError
              ? "border-error-300 bg-error-50/60 dark:border-error-500/40 dark:bg-error-500/10"
              : "border-primary-200 bg-primary-50/60 dark:border-primary-500/40 dark:bg-primary-500/10"
          )}
        >
          <div className="flex items-start gap-3">
            {modelError ? (
              <AlertTriangle className="mt-0.5 h-5 w-5 text-error-600 dark:text-error-400" />
            ) : (
              <Brain className="mt-0.5 h-5 w-5 text-primary-600 dark:text-primary-400" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {modelError
                  ? "Could not load the face-detection model"
                  : modelLoading
                    ? "Loading face-detection AI model…"
                    : "Model ready"}
              </p>
              <p className="text-xs text-surface-600 dark:text-surface-300">
                {modelError
                  ? modelError
                  : "First-time load is ~1 MB and is cached by your browser. Future visits are instant."}
              </p>
            </div>
          </div>
        </div>
      )}

      {!file && (
        <ImageDropZone
          onFilesSelected={onFilesSelected}
          acceptedFormats={[...CONFIG.acceptedFormats]}
          maxSizeMB={CONFIG.maxFileSizeMB}
          multiple={false}
          formatLabels={FORMAT_LABELS}
        />
      )}

      {file && imageUrl && imageDims && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Image + overlay */}
            <div className="overflow-auto rounded-2xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-800">
              <div
                ref={displayRef}
                style={{ aspectRatio: `${imageDims.w} / ${imageDims.h}` }}
                onPointerDown={onDrawPointerDown}
                onPointerMove={onDrawPointerMove}
                onPointerUp={onDrawPointerUp}
                onPointerCancel={onDrawPointerUp}
                className={cn(
                  "relative mx-auto w-full max-w-full select-none touch-none",
                  allowDrawing && "cursor-crosshair"
                )}
              >
                <canvas
                  ref={previewCanvasRef}
                  className="absolute inset-0 h-full w-full"
                />

                {/* Region overlays */}
                {regions.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      left: r.x * scaleX,
                      top: r.y * scaleY,
                      width: r.w * scaleX,
                      height: r.h * scaleY,
                    }}
                    className={cn(
                      "pointer-events-none absolute border-2 border-dashed",
                      r.auto
                        ? "border-error-500"
                        : "border-primary-500"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => removeRegion(r.id)}
                      data-handle="true"
                      title={r.auto ? "Remove detected face" : "Remove manual region"}
                      className="pointer-events-auto absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-white shadow ring-1 ring-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toolbar under image */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-surface-600 dark:text-surface-300">
                {regions.length === 0
                  ? "No regions yet."
                  : `${regions.length} region${regions.length === 1 ? "" : "s"} (${autoCount} auto · ${manualCount} manual)`}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                    showOriginal
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                      : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
                  )}
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  {showOriginal ? "Showing original" : "Show original"}
                </button>
                <button
                  type="button"
                  onClick={clearManual}
                  disabled={manualCount === 0}
                  className="text-xs font-medium text-surface-500 hover:text-error-600 disabled:opacity-40 dark:text-surface-400 dark:hover:text-error-400"
                >
                  Clear manual
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={regions.length === 0}
                  className="text-xs font-medium text-surface-500 hover:text-error-600 disabled:opacity-40 dark:text-surface-400 dark:hover:text-error-400"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Hint for manual mode */}
            {allowDrawing && (
              <p className="inline-flex items-start gap-2 rounded-lg bg-surface-50 px-3 py-2 text-[11px] text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
                <MousePointer2 className="mt-0.5 h-3 w-3 shrink-0" />
                Click-and-drag anywhere on the image to add a blur region. Click the
                X on a region to remove it.
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="inline-flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}

            {/* Result row */}
            {resultBlob && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                <p className="text-xs font-semibold text-success-700 dark:text-success-300">
                  Ready to download · {formatFileSize(resultBlob.size)}
                </p>
                <button
                  type="button"
                  onClick={download}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            )}
          </div>

          <SettingsPanel
            mode={mode}
            setMode={setMode}
            blurIntensity={blurIntensity}
            setBlurIntensity={setBlurIntensity}
            blurShape={blurShape}
            setBlurShape={setBlurShape}
            confidenceThreshold={confidenceThreshold}
            setConfidenceThreshold={setConfidenceThreshold}
            isDetecting={isDetecting}
            isProcessing={isProcessing}
            modelReady={modelReady}
            autoCount={autoCount}
            onDetect={detectFaces}
            onApply={download}
            onReset={reset}
            regions={regions}
          />
        </div>
      )}
    </div>
  );
}

function suggestedName(file: File): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot > 0 ? file.name.slice(dot + 1) : "png";
  return `${stem}-blurred.${ext}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Settings panel
// ──────────────────────────────────────────────────────────────────────────

function SettingsPanel({
  mode,
  setMode,
  blurIntensity,
  setBlurIntensity,
  blurShape,
  setBlurShape,
  confidenceThreshold,
  setConfidenceThreshold,
  isDetecting,
  isProcessing,
  modelReady,
  autoCount,
  onDetect,
  onApply,
  onReset,
  regions,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  blurIntensity: number;
  setBlurIntensity: (n: number) => void;
  blurShape: Shape;
  setBlurShape: (s: Shape) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (n: number) => void;
  isDetecting: boolean;
  isProcessing: boolean;
  modelReady: boolean;
  autoCount: number;
  onDetect: () => void;
  onApply: () => void;
  onReset: () => void;
  regions: Region[];
}) {
  const canAutoDetect = mode === "faces" || mode === "both";
  const canManual = mode === "manual" || mode === "both";

  return (
    <aside className="h-fit space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Blur settings
        </h2>
      </header>

      {/* Mode */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Detection mode
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <ModePill active={mode === "faces"} onClick={() => setMode("faces")}>
            <Scan className="h-3 w-3" /> Auto
          </ModePill>
          <ModePill active={mode === "manual"} onClick={() => setMode("manual")}>
            <MousePointer2 className="h-3 w-3" /> Manual
          </ModePill>
          <ModePill active={mode === "both"} onClick={() => setMode("both")}>
            Both
          </ModePill>
        </div>
      </div>

      {/* Detect button (auto modes only) */}
      {canAutoDetect && (
        <button
          type="button"
          onClick={onDetect}
          disabled={!modelReady || isDetecting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-300 bg-white px-3 py-2 text-xs font-semibold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-500/60 dark:bg-surface-900 dark:text-primary-200 dark:hover:bg-primary-500/10"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Detecting…
            </>
          ) : (
            <>
              <Scan className="h-3.5 w-3.5" />
              {autoCount > 0 ? `Re-detect (found ${autoCount})` : "Detect faces"}
            </>
          )}
        </button>
      )}

      {canManual && (
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          Manual mode: click-and-drag on the image to add a region.
        </p>
      )}

      {/* Shape */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Blur shape
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ModePill active={blurShape === "oval"} onClick={() => setBlurShape("oval")}>
            <CircleIcon className="h-3 w-3" /> Oval
          </ModePill>
          <ModePill active={blurShape === "rectangle"} onClick={() => setBlurShape("rectangle")}>
            <Square className="h-3 w-3" /> Rectangle
          </ModePill>
        </div>
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          Use Rectangle for license plates and signs; Oval for faces.
        </p>
      </div>

      {/* Intensity */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Blur intensity
          </span>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {blurIntensity}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          value={blurIntensity}
          onChange={(e) => setBlurIntensity(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
      </div>

      {/* Confidence (auto modes only) */}
      {canAutoDetect && (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Detection confidence
            </span>
            <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
              {confidenceThreshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.95}
            step={0.05}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-primary-600"
          />
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            Lower = more faces detected (with more false positives).
          </p>
        </div>
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onApply}
          disabled={isProcessing || regions.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Working…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> Apply blur & download
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isDetecting || isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Start over
        </button>
      </div>
    </aside>
  );
}

function ModePill({
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
        "inline-flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {children}
    </button>
  );
}

