"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Download,
  Eraser,
  Layers,
  Loader2,
  Palette,
  Scissors,
  ShieldCheck,
  Wand2,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import { BeforeAfterSlider } from "@/components/image-tools/BeforeAfterSlider";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  canvasToBlob,
  downloadFile,
  formatFileSize,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "remove-background";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type BgChoice = "transparent" | "white" | "black" | "blur" | "custom";
type BgFormat = "png" | "jpeg" | "webp";

/** Two-phase progress: model download (only on first ever run) → inference. */
interface RemovalProgress {
  /** "model" while the ONNX model is being fetched and cached, "inference"
   *  while the cutout is being computed. */
  phase: "model" | "inference";
  /** 0..100 */
  percent: number;
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

function stemName(file: File): string {
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(0, dot) : file.name;
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  const [bgChoice, setBgChoice] = useState<BgChoice>("transparent");
  const [customColor, setCustomColor] = useState("#0066FF");
  const [bgFormat, setBgFormat] = useState<BgFormat>("png");
  const [bgQuality, setBgQuality] = useState(95);

  const [composedBlob, setComposedBlob] = useState<Blob | null>(null);
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [composeBusy, setComposeBusy] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<RemovalProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Composite cache so we don't redo identical work.
  const composeCacheRef = useRef<Map<string, { blob: Blob; url: string }>>(new Map());

  // ───── Cleanup all URLs on unmount ─────
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      for (const v of composeCacheRef.current.values()) {
        URL.revokeObjectURL(v.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    (selected: File[]) => {
      const f = selected[0];
      if (!f) return;
      // Free old URLs.
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      for (const v of composeCacheRef.current.values()) URL.revokeObjectURL(v.url);
      composeCacheRef.current.clear();

      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
      setProcessedBlob(null);
      setProcessedUrl(null);
      setComposedBlob(null);
      setComposedUrl(null);
      setError(null);
      setBgChoice("transparent");
    },
    [originalUrl, processedUrl]
  );

  // ───── Run inference in-browser ─────
  // First call downloads the ONNX model (~40 MB) from IMG.LY's CDN and
  // caches it in the browser's storage. Subsequent calls are fast — no
  // network, no API quota, no file leaving the device.
  //
  // The library is loaded via `import()` so the ~few-MB ONNX runtime
  // isn't shipped in the initial bundle. Visitors who never click the
  // button never pay the cost.
  const removeBg = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress({ phase: "model", percent: 0 });
    setError(null);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        output: { format: "image/png", quality: 1 },
        progress: (key, current, total) => {
          // The library reports progress for both phases under different
          // keys — "compute:inference" once the model is loaded and any
          // "fetch:*" event during initial model download. Map both into
          // a single 0..100 number per phase for our UI.
          if (!total || total <= 0) return;
          const percent = Math.min(100, Math.round((current / total) * 100));
          const phase: RemovalProgress["phase"] = key.startsWith("compute")
            ? "inference"
            : "model";
          setProgress({ phase, percent });
        },
      });
      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setProcessedUrl(url);
    } catch (err) {
      console.error("[RemoveBackground]", err);
      setError(
        err instanceof Error
          ? `Couldn't remove the background: ${err.message}`
          : "Couldn't remove the background. Try a smaller image or a different one."
      );
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file]);

  // ───── Compose with chosen background ─────
  const composeWithBackground = useCallback(async () => {
    if (!processedUrl || !originalUrl) return;
    if (bgChoice === "transparent") {
      setComposedBlob(null);
      setComposedUrl(null);
      return;
    }
    const cacheKey =
      bgChoice === "custom"
        ? `custom:${customColor}:${bgFormat}:${bgQuality}`
        : `${bgChoice}:${bgFormat}:${bgQuality}`;
    const cached = composeCacheRef.current.get(cacheKey);
    if (cached) {
      setComposedBlob(cached.blob);
      setComposedUrl(cached.url);
      return;
    }

    setComposeBusy(true);
    try {
      const cutout = await loadImg(processedUrl);
      const canvas = document.createElement("canvas");
      canvas.width = cutout.naturalWidth;
      canvas.height = cutout.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      if (bgChoice === "blur") {
        // Use the user's *original* photo as the background, heavily blurred.
        const orig = await loadImg(originalUrl);
        ctx.filter = "blur(24px) saturate(1.05)";
        ctx.drawImage(orig, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
      } else {
        const fill =
          bgChoice === "white"
            ? "#ffffff"
            : bgChoice === "black"
              ? "#000000"
              : customColor;
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(cutout, 0, 0);

      const mime: ImageMimeType =
        bgFormat === "png"
          ? "image/png"
          : bgFormat === "webp"
            ? "image/webp"
            : "image/jpeg";
      const blob = await canvasToBlob(canvas, mime, bgQuality / 100);
      const url = URL.createObjectURL(blob);
      composeCacheRef.current.set(cacheKey, { blob, url });
      setComposedBlob(blob);
      setComposedUrl(url);
    } catch (err) {
      console.error("[RemoveBackground/compose]", err);
    } finally {
      setComposeBusy(false);
    }
  }, [bgChoice, bgFormat, bgQuality, customColor, originalUrl, processedUrl]);

  // Re-compose whenever the user changes a background option, but only
  // after we already have a transparent result to work with.
  useEffect(() => {
    if (!processedUrl) return;
    void composeWithBackground();
  }, [composeWithBackground, processedUrl]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    for (const v of composeCacheRef.current.values()) URL.revokeObjectURL(v.url);
    composeCacheRef.current.clear();
    setFile(null);
    setOriginalUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setComposedBlob(null);
    setComposedUrl(null);
    setBgChoice("transparent");
    setError(null);
  }, [originalUrl, processedUrl]);

  const downloadTransparent = () => {
    if (!processedBlob || !file) return;
    downloadFile(processedBlob, `${stemName(file)}-no-bg.png`);
  };

  const downloadComposed = () => {
    if (!composedBlob || !file) return;
    const ext = bgFormat === "jpeg" ? "jpg" : bgFormat;
    downloadFile(composedBlob, `${stemName(file)}-bg.${ext}`);
  };

  // ───── Render ─────
  const previewUrl = bgChoice === "transparent" ? processedUrl : composedUrl;
  const previewLabel = bgChoice === "transparent" ? "Transparent" : "Background";

  return (
    <div className="space-y-6">
      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple={false}
        formatLabels={FORMAT_LABELS}
      />
      <p className="inline-flex items-start gap-2 text-[11px] text-surface-500 dark:text-surface-400">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-400" />
        Works best on portraits, products, animals, vehicles and isolated objects.
        Runs entirely in your browser — your image never leaves your device.
      </p>

      {file && originalUrl && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Preview */}
            {processedUrl ? (
              <BeforeAfterSlider
                beforeUrl={originalUrl}
                afterUrl={previewUrl ?? processedUrl}
                beforeLabel="Original"
                afterLabel={previewLabel}
              />
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

            {/* Processing state */}
            {isProcessing && <ProcessingPanel progress={progress} />}

            {/* Error */}
            {error && (
              <p className="inline-flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}

            {/* Result toolbar */}
            {processedBlob && processedUrl && file && (
              <ResultBar
                fileName={file.name}
                processedSize={processedBlob.size}
                composedSize={composedBlob?.size}
                bgChoice={bgChoice}
                composeBusy={composeBusy}
                onDownloadTransparent={downloadTransparent}
                onDownloadComposed={downloadComposed}
                bgFormat={bgFormat}
                setBgFormat={setBgFormat}
                bgQuality={bgQuality}
                setBgQuality={setBgQuality}
              />
            )}

            {/* Background options */}
            {processedBlob && (
              <BackgroundOptions
                bgChoice={bgChoice}
                setBgChoice={setBgChoice}
                customColor={customColor}
                setCustomColor={setCustomColor}
              />
            )}
          </div>

          {/* Right sidebar: action + privacy note */}
          <aside className="h-fit space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
            <header>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
                Background removal
              </h2>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                Runs locally — no upload, no API, no usage cap.
              </p>
            </header>

            <button
              type="button"
              onClick={removeBg}
              disabled={isProcessing}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Removing…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Remove background
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={isProcessing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
            >
              <Eraser className="h-3 w-3" /> Start over
            </button>

            <PrivacyNote />
          </aside>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ProcessingPanel({ progress }: { progress: RemovalProgress | null }) {
  const phaseLabel = !progress
    ? "Preparing…"
    : progress.phase === "model"
      ? "Loading AI model (first time only, then cached)…"
      : "Removing background…";
  const phaseHint = !progress
    ? "Hold on a second."
    : progress.phase === "model"
      ? "~40 MB download — happens once per browser, then it's instant."
      : "Inference runs on your device. 3–15 seconds depending on image size.";

  // When no progress event has fired yet, show an indeterminate shimmer
  // so the bar doesn't sit at 0% looking broken.
  const percent = progress?.percent ?? null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/40 dark:bg-primary-500/10"
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
          <Scissors className="h-4 w-4" />
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-500 opacity-30" />
        </span>
        <div>
          <p className="text-sm font-semibold text-surface-900 dark:text-white">
            {phaseLabel}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">{phaseHint}</p>
        </div>
        {percent !== null && (
          <span className="ml-auto text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {percent}%
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100 dark:bg-primary-500/20">
        {percent !== null ? (
          <div
            className="h-full rounded-full bg-primary-600 transition-[width] duration-200"
            style={{ width: `${percent}%` }}
          />
        ) : (
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-600" />
        )}
      </div>
    </div>
  );
}

function ResultBar({
  fileName,
  processedSize,
  composedSize,
  bgChoice,
  composeBusy,
  onDownloadTransparent,
  onDownloadComposed,
  bgFormat,
  setBgFormat,
  bgQuality,
  setBgQuality,
}: {
  fileName: string;
  processedSize: number;
  composedSize: number | undefined;
  bgChoice: BgChoice;
  composeBusy: boolean;
  onDownloadTransparent: () => void;
  onDownloadComposed: () => void;
  bgFormat: BgFormat;
  setBgFormat: (f: BgFormat) => void;
  bgQuality: number;
  setBgQuality: (n: number) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-success-200 bg-success-50/60 p-5 dark:border-success-500/40 dark:bg-success-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-success-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
            <Check className="h-3.5 w-3.5" />
            Background removed
          </p>
          <p
            className="truncate text-xs text-surface-600 dark:text-surface-300"
            title={fileName}
          >
            {fileName} · {formatFileSize(processedSize)}
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadTransparent}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <Download className="h-4 w-4" />
          Download PNG (transparent)
        </button>
      </div>

      {/* Optional: download with the chosen background */}
      {bgChoice !== "transparent" && (
        <div className="grid gap-2 rounded-xl border border-white/60 bg-white/60 p-3 dark:border-surface-800 dark:bg-surface-900/40 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              With background
            </span>
            <select
              value={bgFormat}
              onChange={(e) => setBgFormat(e.target.value as BgFormat)}
              className="rounded-md border border-surface-200 bg-white px-2 py-1 text-xs font-medium text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WEBP</option>
            </select>
            {bgFormat !== "png" && (
              <span className="inline-flex items-center gap-1">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={bgQuality}
                  onChange={(e) => setBgQuality(Number(e.target.value))}
                  className="w-20 accent-primary-600"
                />
                <span className="w-7 text-center text-[11px] font-bold tabular-nums text-primary-700 dark:text-primary-300">
                  {bgQuality}
                </span>
              </span>
            )}
            {typeof composedSize === "number" && (
              <span className="text-[11px] text-surface-500 dark:text-surface-400">
                {formatFileSize(composedSize)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onDownloadComposed}
            disabled={composeBusy || typeof composedSize !== "number"}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-300 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-500/60 dark:bg-surface-900 dark:text-primary-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
          >
            {composeBusy ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Compositing…
              </>
            ) : (
              <>
                <Download className="h-3 w-3" /> Download with background
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function BackgroundOptions({
  bgChoice,
  setBgChoice,
  customColor,
  setCustomColor,
}: {
  bgChoice: BgChoice;
  setBgChoice: (c: BgChoice) => void;
  customColor: string;
  setCustomColor: (c: string) => void;
}) {
  const choices: { id: BgChoice; label: string; preview: React.ReactNode }[] = useMemo(
    () => [
      {
        id: "transparent",
        label: "Transparent",
        preview: (
          <span className="block h-6 w-6 rounded-md border border-surface-300 bg-[conic-gradient(at_50%_50%,#fff_25%,#e5e7eb_25%,#e5e7eb_50%,#fff_50%,#fff_75%,#e5e7eb_75%)] [background-size:8px_8px] dark:border-surface-600" />
        ),
      },
      {
        id: "white",
        label: "White",
        preview: <span className="block h-6 w-6 rounded-md border border-surface-300 bg-white" />,
      },
      {
        id: "black",
        label: "Black",
        preview: <span className="block h-6 w-6 rounded-md border border-surface-300 bg-black" />,
      },
      {
        id: "blur",
        label: "Blur original",
        preview: <Layers className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
      },
      {
        id: "custom",
        label: "Custom colour",
        preview: <Palette className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
      },
    ],
    []
  );

  return (
    <div className="space-y-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Replace background
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Compositing happens locally — no extra API calls.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setBgChoice(c.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-semibold transition",
              bgChoice === c.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
            )}
          >
            {c.preview}
            {c.label}
          </button>
        ))}
      </div>
      {bgChoice === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="h-9 w-10 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            spellCheck={false}
            className="w-32 rounded-md border border-surface-200 bg-white px-2 py-1 text-xs uppercase tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}

function PrivacyNote() {
  return (
    <div className="rounded-xl border border-success-200 bg-success-50/60 p-3 dark:border-success-500/40 dark:bg-success-500/10">
      <p className="inline-flex items-start gap-2 text-[11px] text-success-800 dark:text-success-200">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          <strong>100% in your browser.</strong> Your image is never uploaded.
          No API keys, no usage cap, no signup. Works offline after the model
          loads once.
        </span>
      </p>
    </div>
  );
}
