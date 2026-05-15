"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Check,
  Download,
  Loader2,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import { BeforeAfterSlider } from "@/components/image-tools/BeforeAfterSlider";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import { formatFileSize, getImageDimensions } from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "upscale-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

type Scale = "2x" | "4x";

// Loose Upscaler type — the package's types are deeply nested generics, and
// this component never crosses the SDK boundary in a way that needs them.
interface UpscalerLike {
  ready: Promise<void>;
  upscale: (
    image: HTMLImageElement | string,
    options?: {
      progress?: (rate: number) => void;
      patchSize?: number;
      padding?: number;
    }
  ) => Promise<string>;
  dispose?: () => Promise<void> | void;
}

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = src;
  });
}

async function dataURLToBlob(dataUrl: string): Promise<Blob> {
  // base64 → blob without depending on fetch().
  const [header, payload] = dataUrl.split(",");
  if (!payload) throw new Error("Invalid data URL");
  const mimeMatch = /data:([^;]+);base64/.exec(header);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bytes = atob(payload);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function originalName(file: File, w: number, h: number): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  return `${stem}-upscaled-${w}x${h}.png`;
}

function isOomError(err: unknown): boolean {
  const m = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return m.includes("memory") || m.includes("oom") || m.includes("alloc");
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ImageUpscaler() {
  const upscalerRef = useRef<UpscalerLike | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [originalSize, setOriginalSize] = useState(0);

  const [scale, setScale] = useState<Scale>("2x");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [upscaledBlob, setUpscaledBlob] = useState<Blob | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [upscaledDims, setUpscaledDims] = useState<{ width: number; height: number } | null>(null);

  // ───── Load model on mount ─────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Tensorflow first so the backend is registered before the model loads.
        await import("@tensorflow/tfjs");
        const { default: Upscaler } = await import("upscaler");
        const { default: DefaultModel } = await import(
          "@upscalerjs/default-model"
        );
        if (cancelled) return;
        const u = new Upscaler({ model: DefaultModel }) as unknown as UpscalerLike;
        await u.ready;
        if (cancelled) {
          await u.dispose?.();
          return;
        }
        upscalerRef.current = u;
        setModelLoaded(true);
        setModelLoading(false);
      } catch (err) {
        console.error("[ImageUpscaler/model]", err);
        if (!cancelled) {
          setModelError(
            err instanceof Error
              ? err.message
              : "Could not load the AI model"
          );
          setModelLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      upscalerRef.current?.dispose?.();
      upscalerRef.current = null;
    };
  }, []);

  // ───── Cleanup blob URLs on unmount ─────
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (upscaledUrl) URL.revokeObjectURL(upscaledUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    async (selected: File[]) => {
      const f = selected[0];
      if (!f) return;
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (upscaledUrl) URL.revokeObjectURL(upscaledUrl);

      const url = URL.createObjectURL(f);
      setFile(f);
      setOriginalUrl(url);
      setOriginalSize(f.size);
      setUpscaledBlob(null);
      setUpscaledUrl(null);
      setUpscaledDims(null);
      setError(null);

      try {
        const dims = await getImageDimensions(f);
        setOriginalDims(dims);
      } catch {
        setOriginalDims(null);
      }
    },
    [originalUrl, upscaledUrl]
  );

  // ───── Upscale ─────
  const upscale = useCallback(async () => {
    const u = upscalerRef.current;
    if (!u || !file || !originalUrl) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setStage(scale === "4x" ? "Pass 1 of 2 (2× upscale)" : "Upscaling 2×");

    try {
      let img = await loadImg(originalUrl);
      // Pass 1
      let result = await u.upscale(img, {
        // Tile size: 64 keeps memory low while still being fast enough.
        patchSize: 64,
        padding: 4,
        progress: (rate: number) => {
          // For 4x, first pass is 0..50% of total.
          setProgress(scale === "4x" ? Math.round(rate * 50) : Math.round(rate * 100));
        },
      });

      // Pass 2 (only for 4×)
      if (scale === "4x") {
        setStage("Pass 2 of 2 (final 2× upscale)");
        img = await loadImg(result);
        result = await u.upscale(img, {
          patchSize: 64,
          padding: 4,
          progress: (rate: number) => {
            setProgress(50 + Math.round(rate * 50));
          },
        });
      }

      const blob = await dataURLToBlob(result);
      const finalImg = await loadImg(result);

      setUpscaledBlob(blob);
      setUpscaledUrl(result);
      setUpscaledDims({
        width: finalImg.naturalWidth,
        height: finalImg.naturalHeight,
      });
      setProgress(100);
    } catch (err) {
      console.error("[ImageUpscaler/upscale]", err);
      if (isOomError(err)) {
        setError(
          "Image too large for your device. Try a smaller image, or use 2× instead of 4×."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Upscaling failed. Try again with a smaller image."
        );
      }
    } finally {
      setIsProcessing(false);
      setStage("");
    }
  }, [file, originalUrl, scale]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (upscaledUrl) URL.revokeObjectURL(upscaledUrl);
    setFile(null);
    setOriginalUrl(null);
    setOriginalDims(null);
    setOriginalSize(0);
    setUpscaledBlob(null);
    setUpscaledUrl(null);
    setUpscaledDims(null);
    setError(null);
    setProgress(0);
  }, [originalUrl, upscaledUrl]);

  const downloadResult = useCallback(() => {
    if (!upscaledBlob || !file || !upscaledDims) return;
    const url = URL.createObjectURL(upscaledBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = originalName(file, upscaledDims.width, upscaledDims.height);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [file, upscaledBlob, upscaledDims]);

  // Derived: warning thresholds
  const isLargeImage =
    !!originalDims && originalDims.width * originalDims.height > 2_000_000;
  const isOverRecommendedMP =
    !!originalDims && originalDims.width * originalDims.height > 1_000_000;

  return (
    <div className="space-y-6">
      {/* Step 1 — model loading banner (shown while loading or on error) */}
      {!modelLoaded && (
        <div
          className={cn(
            "rounded-2xl border p-5",
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
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {modelError
                  ? "Could not load the AI model"
                  : modelLoading
                    ? "Loading AI model — first time only (~12 MB)"
                    : "Model ready"}
              </p>
              <p className="text-xs text-surface-600 dark:text-surface-300">
                {modelError
                  ? modelError
                  : "The model loads once and is cached in your browser, so it's instant on every visit after this one."}
              </p>
              {modelLoading && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-500/20">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — upload */}
      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple={false}
        formatLabels={FORMAT_LABELS}
      />
      <div className="flex flex-wrap gap-2 text-[11px] text-surface-500 dark:text-surface-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2.5 py-1 dark:bg-surface-800">
          <Sparkles className="h-3 w-3 text-primary-600 dark:text-primary-400" />
          AI-Enhanced
        </span>
        <span>Best results: 1 megapixel or smaller (e.g. 1000 × 1000 px).</span>
      </div>

      {file && originalUrl && originalDims && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {upscaledUrl && upscaledDims ? (
              <>
                <BeforeAfterSlider
                  beforeUrl={originalUrl}
                  afterUrl={upscaledUrl}
                  beforeLabel="Original"
                  afterLabel="Upscaled"
                />
                <ResultStats
                  originalDims={originalDims}
                  upscaledDims={upscaledDims}
                  originalSize={originalSize}
                  upscaledSize={upscaledBlob?.size ?? 0}
                  onDownload={downloadResult}
                />
              </>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt={file.name}
                  className="block max-h-[480px] w-full object-contain"
                />
              </div>
            )}

            {/* Warning row */}
            {isLargeImage && !upscaledUrl && (
              <p className="inline-flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50/60 px-3 py-2 text-xs text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Images over 2 MP may take several minutes to process on slower devices.
              </p>
            )}
            {!isLargeImage && isOverRecommendedMP && !upscaledUrl && (
              <p className="text-[11px] text-surface-500 dark:text-surface-400">
                Tip: this image is over 1 MP — processing will take longer than usual.
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-300">
                {error}
              </p>
            )}

            {isProcessing && (
              <ProcessingPanel stage={stage} progress={progress} />
            )}
          </div>

          <SettingsPanel
            scale={scale}
            setScale={setScale}
            originalDims={originalDims}
            modelReady={modelLoaded}
            isProcessing={isProcessing}
            onRun={upscale}
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

function ProcessingPanel({ stage, progress }: { stage: string; progress: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/40 dark:bg-primary-500/10"
    >
      <div className="flex items-start gap-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
          <Brain className="h-4 w-4" />
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-500 opacity-30" />
        </span>
        <div className="flex-1 space-y-1.5">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">
            Processing with AI… this may take 30–60 seconds
          </p>
          <p className="text-xs text-surface-600 dark:text-surface-300">
            {stage} · Please keep this tab active during processing.
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-500/20">
            <div
              className="h-full rounded-full bg-primary-600 transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultStats({
  originalDims,
  upscaledDims,
  originalSize,
  upscaledSize,
  onDownload,
}: {
  originalDims: { width: number; height: number };
  upscaledDims: { width: number; height: number };
  originalSize: number;
  upscaledSize: number;
  onDownload: () => void;
}) {
  const factor = Math.round(upscaledDims.width / originalDims.width);
  return (
    <div className="space-y-3 rounded-2xl border border-success-200 bg-success-50/60 p-5 dark:border-success-500/40 dark:bg-success-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
          <Check className="h-3.5 w-3.5" />
          AI Enhanced · {factor}× larger
        </span>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <Download className="h-4 w-4" />
          Download upscaled image ({upscaledDims.width}×{upscaledDims.height})
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Original" value={`${originalDims.width}×${originalDims.height}`} />
        <Stat
          label="Upscaled"
          value={`${upscaledDims.width}×${upscaledDims.height}`}
          accent="text-primary-700 dark:text-primary-300"
        />
        <Stat label="Source size" value={formatFileSize(originalSize)} />
        <Stat label="Upscaled size" value={formatFileSize(upscaledSize)} />
      </div>
    </div>
  );
}

function SettingsPanel({
  scale,
  setScale,
  originalDims,
  modelReady,
  isProcessing,
  onRun,
  onReset,
}: {
  scale: Scale;
  setScale: (s: Scale) => void;
  originalDims: { width: number; height: number };
  modelReady: boolean;
  isProcessing: boolean;
  onRun: () => void;
  onReset: () => void;
}) {
  const factor = scale === "2x" ? 2 : 4;
  const projectedW = originalDims.width * factor;
  const projectedH = originalDims.height * factor;

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Upscale settings
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          AI runs on your device. The first run after a refresh is slower.
        </p>
      </header>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Scale factor
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ScaleBtn active={scale === "2x"} onClick={() => setScale("2x")} label="2× Upscale" />
          <ScaleBtn active={scale === "4x"} onClick={() => setScale("4x")} label="4× Upscale" />
        </div>
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          Your <strong>{originalDims.width}×{originalDims.height}</strong> image will become{" "}
          <strong className="text-primary-700 dark:text-primary-300">
            {projectedW}×{projectedH}
          </strong>{" "}
          ({factor}×). 4× runs the model twice.
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onRun}
          disabled={!modelReady || isProcessing}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Upscaling…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> Upscale image
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
          Start over
        </button>
      </div>
    </aside>
  );
}

function ScaleBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-2 text-sm font-bold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {label}
    </button>
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
    <div className="rounded-lg border border-white bg-white/60 px-3 py-2 dark:border-surface-800 dark:bg-surface-900/40">
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
