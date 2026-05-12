"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Code,
  Download,
  Globe,
  Info,
  Loader2,
  RotateCcw,
  Wand2,
} from "lucide-react";

import {
  canvasToBlob,
  downloadFile,
  formatFileSize,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Mode = "url" | "html";
type OutputFormat = "png" | "jpg" | "webp" | "svg";
type Scale = 1 | 2 | 3;
type HeightMode = "auto" | "fixed";
type CaptureMode = "viewport" | "full-page";

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

const SAMPLE_HTML = `<div style="font-family: system-ui; padding: 40px; background: linear-gradient(135deg, #0066FF, #8B5CF6); color: white; border-radius: 16px;">
  <h1 style="margin: 0 0 16px; font-size: 32px;">Hello, world!</h1>
  <p style="margin: 0; font-size: 16px; opacity: 0.9;">Edit this HTML to render whatever you want.</p>
</div>`;

function pickMime(format: OutputFormat): ImageMimeType {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  // SVG fallback uses a PNG payload embedded inside an <image> tag — produce
  // the PNG bytes here and wrap externally.
  return "image/jpeg";
}

async function canvasToSvg(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataUrl = canvas.toDataURL("image/png");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
</svg>`;
  return new Blob([xml], { type: "image/svg+xml" });
}

async function encode(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  if (format === "svg") return canvasToSvg(canvas);
  return canvasToBlob(canvas, pickMime(format), quality / 100);
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function HtmlToImage() {
  const [mode, setMode] = useState<Mode>("url");

  // URL mode
  const [url, setUrl] = useState("");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("viewport");

  // HTML mode
  const [htmlCode, setHtmlCode] = useState(SAMPLE_HTML);

  // Shared
  const [width, setWidth] = useState(1280);
  const [heightMode, setHeightMode] = useState<HeightMode>("auto");
  const [fixedHeight, setFixedHeight] = useState(720);
  const [scale, setScale] = useState<Scale>(2);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [outputQuality, setOutputQuality] = useState(95);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ width: number; height: number } | null>(null);

  // ───── Cleanup result URL on unmount ─────
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureFromUrl = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
    setResultDims(null);

    try {
      const res = await fetch("/api/tools/html-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          width,
          height: heightMode === "fixed" ? fixedHeight : "auto",
          format: outputFormat === "svg" || outputFormat === "png" ? "png" : outputFormat,
          scale,
          fullPage: captureMode === "full-page",
        }),
      });
      if (!res.ok) {
        let msg = `Screenshot failed (${res.status})`;
        try {
          const body = (await res.json()) as { error?: string };
          if (body.error) msg = body.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const blob = await res.blob();

      // If the user asked for SVG, wrap the returned PNG inside an SVG shell.
      let finalBlob = blob;
      let dims = { width: 0, height: 0 };
      if (outputFormat === "svg") {
        // Decode → draw to canvas → re-encode as SVG-wrapped raster.
        const objectUrl = URL.createObjectURL(blob);
        try {
          const img = await loadImg(objectUrl);
          dims = { width: img.naturalWidth, height: img.naturalHeight };
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext("2d")!.drawImage(img, 0, 0);
          finalBlob = await encode(canvas, "svg", outputQuality);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      } else {
        // Read the natural dimensions for the result card.
        const objectUrl = URL.createObjectURL(blob);
        try {
          const img = await loadImg(objectUrl);
          dims = { width: img.naturalWidth, height: img.naturalHeight };
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }

      const objectUrl = URL.createObjectURL(finalBlob);
      setResultBlob(finalBlob);
      setResultUrl(objectUrl);
      setResultDims(dims);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screenshot failed");
    } finally {
      setIsProcessing(false);
    }
  }, [
    captureMode,
    fixedHeight,
    heightMode,
    outputFormat,
    outputQuality,
    resultUrl,
    scale,
    url,
    width,
  ]);

  const captureFromHtml = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
    setResultDims(null);

    let iframe: HTMLIFrameElement | null = null;
    try {
      iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-same-origin");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = `${width}px`;
      iframe.style.border = "0";
      iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;font-family:system-ui,sans-serif}</style></head><body>${htmlCode}</body></html>`;
      document.body.appendChild(iframe);

      await new Promise<void>((resolve, reject) => {
        const t = window.setTimeout(() => reject(new Error("HTML render timeout")), 10000);
        iframe!.onload = () => {
          window.clearTimeout(t);
          resolve();
        };
      });

      const doc = iframe.contentDocument;
      if (!doc) throw new Error("Could not access the rendered HTML.");

      // Allow images/fonts inside the iframe to settle before capturing.
      await new Promise((r) => window.setTimeout(r, 120));

      const html2canvas = (await import("html2canvas")).default;
      const renderTarget = doc.body;
      // If "auto" height, let html2canvas use the content height; otherwise clamp.
      const targetHeight = heightMode === "fixed" ? fixedHeight : undefined;

      const canvas = await html2canvas(renderTarget, {
        backgroundColor: outputFormat === "png" || outputFormat === "svg" ? null : "#ffffff",
        scale,
        width,
        height: targetHeight,
        windowWidth: width,
        windowHeight: targetHeight ?? renderTarget.scrollHeight,
        useCORS: true,
        logging: false,
      });

      const blob = await encode(canvas, outputFormat, outputQuality);
      const objectUrl = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(objectUrl);
      setResultDims({ width: canvas.width, height: canvas.height });
    } catch (err) {
      setError(err instanceof Error ? err.message : "HTML render failed");
    } finally {
      if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
      setIsProcessing(false);
    }
  }, [fixedHeight, heightMode, htmlCode, outputFormat, outputQuality, resultUrl, scale, width]);

  const run = useCallback(() => {
    if (mode === "url") void captureFromUrl();
    else void captureFromHtml();
  }, [captureFromHtml, captureFromUrl, mode]);

  const downloadResult = useCallback(() => {
    if (!resultBlob) return;
    const ext =
      outputFormat === "svg"
        ? "svg"
        : outputFormat === "jpg"
          ? "jpg"
          : outputFormat;
    downloadFile(resultBlob, `capture.${ext}`);
  }, [outputFormat, resultBlob]);

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
    setResultDims(null);
    setError(null);
  };

  const isUrlMode = mode === "url";
  const canRun =
    !isProcessing &&
    (isUrlMode ? url.trim().length > 0 : htmlCode.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Mode picker */}
      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          active={isUrlMode}
          onClick={() => {
            setMode("url");
            reset();
          }}
          icon={<Globe className="h-4 w-4" />}
          title="URL to image"
          desc="Screenshot any public webpage via our screenshot API."
        />
        <ModeCard
          active={!isUrlMode}
          onClick={() => {
            setMode("html");
            reset();
          }}
          icon={<Code className="h-4 w-4" />}
          title="HTML code to image"
          desc="Render pasted HTML + inline CSS in your browser."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Input */}
          {isUrlMode ? (
            <label className="block space-y-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Webpage URL
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                spellCheck={false}
                className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              />
            </label>
          ) : (
            <label className="block space-y-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                HTML + inline CSS
              </span>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 font-mono text-xs text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              />
            </label>
          )}

          {/* Limitations notice */}
          <div className="flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50/60 px-3 py-2 text-xs text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              {isUrlMode
                ? "Some sites block screenshots (CORS, X-Frame-Options, bot detection). If a URL fails, the error message will tell you what went wrong."
                : "HTML mode works best with self-contained markup + inline CSS. External fonts/images need CORS-enabled hosts, otherwise they'll be skipped."}
            </span>
          </div>

          {/* Processing */}
          {isProcessing && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/40 dark:bg-primary-500/10"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
                <p className="text-sm font-semibold text-surface-900 dark:text-white">
                  {isUrlMode ? "Asking the screenshot API…" : "Rendering HTML in a sandbox…"}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="inline-flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-200">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          {/* Result */}
          {resultUrl && resultBlob && resultDims && (
            <div className="space-y-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
                  Captured · {resultDims.width} × {resultDims.height} px ·{" "}
                  {formatFileSize(resultBlob.size)}
                </p>
                <button
                  type="button"
                  onClick={downloadResult}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
              {outputFormat !== "svg" ? (
                <div className="overflow-auto rounded-lg border border-white bg-white dark:border-surface-800 dark:bg-surface-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Capture preview" className="block max-w-full" />
                </div>
              ) : (
                <p className="text-[11px] text-surface-600 dark:text-surface-300">
                  SVG file ready. Open it in any browser or design tool — the
                  raster image is embedded inside an SVG &lt;image&gt; tag.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Settings sidebar */}
        <SettingsPanel
          isUrlMode={isUrlMode}
          width={width}
          setWidth={setWidth}
          heightMode={heightMode}
          setHeightMode={setHeightMode}
          fixedHeight={fixedHeight}
          setFixedHeight={setFixedHeight}
          scale={scale}
          setScale={setScale}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          outputQuality={outputQuality}
          setOutputQuality={setOutputQuality}
          captureMode={captureMode}
          setCaptureMode={setCaptureMode}
          isProcessing={isProcessing}
          canRun={canRun}
          onRun={run}
          onReset={reset}
        />
      </div>
    </div>
  );
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Decode failed"));
    img.src = src;
  });
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition",
        active
          ? "border-primary-500 bg-primary-50 text-surface-900 shadow-sm dark:border-primary-500 dark:bg-primary-500/15 dark:text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:bg-primary-50/40 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/5"
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
        {icon}
      </span>
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] text-surface-500 dark:text-surface-400">{desc}</span>
    </button>
  );
}

function SettingsPanel(props: {
  isUrlMode: boolean;
  width: number;
  setWidth: (n: number) => void;
  heightMode: HeightMode;
  setHeightMode: (m: HeightMode) => void;
  fixedHeight: number;
  setFixedHeight: (n: number) => void;
  scale: Scale;
  setScale: (s: Scale) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  outputQuality: number;
  setOutputQuality: (n: number) => void;
  captureMode: CaptureMode;
  setCaptureMode: (m: CaptureMode) => void;
  isProcessing: boolean;
  canRun: boolean;
  onRun: () => void;
  onReset: () => void;
}) {
  const {
    isUrlMode,
    width,
    setWidth,
    heightMode,
    setHeightMode,
    fixedHeight,
    setFixedHeight,
    scale,
    setScale,
    outputFormat,
    setOutputFormat,
    outputQuality,
    setOutputQuality,
    captureMode,
    setCaptureMode,
    isProcessing,
    canRun,
    onRun,
    onReset,
  } = props;

  return (
    <aside className="h-fit space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Capture settings
        </h2>
      </header>

      {/* Capture mode (URL only) */}
      {isUrlMode && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Capture mode
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Pill active={captureMode === "viewport"} onClick={() => setCaptureMode("viewport")}>
              Viewport
            </Pill>
            <Pill active={captureMode === "full-page"} onClick={() => setCaptureMode("full-page")}>
              Full page
            </Pill>
          </div>
        </div>
      )}

      {/* Width */}
      <label className="block space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Width
          </span>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {width}px
          </span>
        </div>
        <input
          type="range"
          min={360}
          max={2560}
          step={20}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
      </label>

      {/* Height mode */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Height
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Pill active={heightMode === "auto"} onClick={() => setHeightMode("auto")}>
            Auto
          </Pill>
          <Pill active={heightMode === "fixed"} onClick={() => setHeightMode("fixed")}>
            Fixed
          </Pill>
        </div>
        {heightMode === "fixed" && (
          <input
            type="number"
            min={120}
            max={4096}
            value={fixedHeight}
            onChange={(e) => setFixedHeight(Number(e.target.value) || 720)}
            className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        )}
      </div>

      {/* Scale (DPR) */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
          Pixel scale
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <Pill key={s} active={scale === s} onClick={() => setScale(s as Scale)}>
              {s}×{s === 2 ? " · retina" : ""}
            </Pill>
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
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
          <option value="svg">SVG (raster wrapped)</option>
        </select>
      </label>
      {outputFormat !== "png" && outputFormat !== "svg" && (
        <label className="block space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Quality
            </span>
            <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
              {outputQuality}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={outputQuality}
            onChange={(e) => setOutputQuality(Number(e.target.value))}
            className="w-full accent-primary-600"
          />
        </label>
      )}

      {!isUrlMode && (
        <p className="inline-flex items-start gap-2 rounded-lg bg-surface-50 px-3 py-2 text-[11px] text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          HTML mode renders locally — your code never leaves the browser.
        </p>
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onRun}
          disabled={!canRun}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Working…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> {isUrlMode ? "Convert URL" : "Render and convert"}
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
          Clear result
        </button>
      </div>
    </aside>
  );
}

function Pill({
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
        "rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {children}
    </button>
  );
}

