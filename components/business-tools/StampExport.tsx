"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Clipboard,
  Download,
  FileCode,
  Image as ImageIcon,
  Info,
  Loader2,
} from "lucide-react";

import type { StampData } from "@/lib/companyStamp";
import { renderStampSvg } from "@/lib/renderStampSvg";
import { cn } from "@/lib/utils";

import { SegButton } from "./CompanyStampGenerator";

/**
 * Export bar for the Company Stamp Generator — PNG (transparent,
 * rasterized to a chosen resolution), SVG (raw vector), and copy-to-
 * clipboard PNG. Everything renders client-side: renderStampSvg builds
 * the SVG string, an off-DOM <img> + <canvas> rasterizes it, and the
 * result either downloads via a temporary <a> or goes straight to the
 * clipboard. Nothing is uploaded anywhere.
 *
 * PNG export re-renders the SVG at the target export size rather than
 * reusing the (smaller) live-preview SVG, and scales `borderWidth`
 * proportionally — border width is an absolute px stroke in StampData,
 * not a fraction of sizePx, so exporting at 2400px with the same
 * stroke value used for a 500px preview would look hairline-thin
 * without this.
 */

const PNG_SIZES = [
  { value: 300, label: "Small 300px" },
  { value: 600, label: "Medium 600px" },
  { value: 1200, label: "Large 1200px" },
  { value: 2400, label: "Print 2400px" },
] as const;

type ExportKind = "png" | "svg" | "copy";

export function StampExport({ data }: { data: StampData }) {
  const [pngSize, setPngSize] = useState<number>(600);
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyResult, setCopyResult] = useState<"ok" | "fail" | null>(null);

  const withBusy = async (kind: ExportKind, fn: () => Promise<void>) => {
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(null);
    }
  };

  const downloadPng = () =>
    withBusy("png", async () => {
      const exportData = scaleForExport(data, pngSize);
      const svg = renderStampSvg(exportData);
      const blob = await rasterizeSvgToPng(svg);
      downloadBlob(blob, stampFilename(data, "png"));
    });

  const downloadSvg = () =>
    withBusy("svg", async () => {
      const svg = renderStampSvg(data);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, stampFilename(data, "svg"));
    });

  const copyPng = () =>
    withBusy("copy", async () => {
      setCopyResult(null);
      if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
        setCopyResult("fail");
        return;
      }
      const exportData = scaleForExport(data, pngSize);
      const svg = renderStampSvg(exportData);
      const blob = await rasterizeSvgToPng(svg);
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopyResult("ok");
      } catch {
        setCopyResult("fail");
      } finally {
        window.setTimeout(() => setCopyResult(null), 2500);
      }
    });

  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Download &amp; export
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Everything renders in your browser — nothing is uploaded.
        </p>
      </header>

      <div className="mb-3">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          PNG size
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PNG_SIZES.map((s) => (
            <SegButton key={s.value} active={pngSize === s.value} onClick={() => setPngSize(s.value)}>
              {s.label}
            </SegButton>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
          Higher = crisper for print. Applies to PNG download and copy.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <ExportButton
          primary
          onClick={downloadPng}
          busy={busy === "png"}
          disabled={busy !== null}
          icon={ImageIcon}
          label="Download PNG"
          hint="Transparent background"
        />
        <ExportButton
          onClick={downloadSvg}
          busy={busy === "svg"}
          disabled={busy !== null}
          icon={FileCode}
          label="Download SVG"
          hint="Vector, fully editable"
        />
        <ExportButton
          onClick={copyPng}
          busy={busy === "copy"}
          disabled={busy !== null}
          icon={copyResult === "ok" ? Check : Clipboard}
          label={copyResult === "ok" ? "Copied!" : copyResult === "fail" ? "Copy failed" : "Copy PNG"}
          hint="Paste into Word, Docs, etc."
        />
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {copyResult === "fail" && !error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Your browser doesn&rsquo;t support copying images to the clipboard. Use Download PNG instead.</span>
        </p>
      )}

      <p className="mt-3 flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-[11px] text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Tip: the PNG has a transparent background — insert it as an image in Word, Google Docs, or a PDF editor and place it over your document.
        </span>
      </p>
    </section>
  );
}

// ── Export button ────────────────────────────────────────────────────────

function ExportButton({
  primary,
  onClick,
  busy,
  disabled,
  icon: Icon,
  label,
  hint,
}: {
  primary?: boolean;
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition disabled:opacity-60",
        primary
          ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow hover:from-primary-600 hover:to-accent-600"
          : "border border-surface-200 bg-white text-surface-800 hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          primary
            ? "bg-white/20 text-white"
            : "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-[11px] leading-snug",
            primary ? "text-white/85" : "text-surface-500 dark:text-surface-400"
          )}
        >
          {hint}
        </p>
      </div>
    </button>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

/** Re-scales border width for a different export resolution. Font sizes
 *  and every other measurement inside renderStampSvg are already
 *  fractions of `sizePx`, so they scale automatically — borderWidth is
 *  the one absolute-pixel value the user sets directly via the slider. */
function scaleForExport(data: StampData, targetSize: number): StampData {
  const baseSize = data.sizePx > 0 ? data.sizePx : 500;
  const ratio = targetSize / baseSize;
  return {
    ...data,
    sizePx: targetSize,
    borderWidth: data.borderWidth > 0 ? Math.max(0.5, data.borderWidth * ratio) : data.borderWidth,
  };
}

function stampFilename(data: StampData, ext: "png" | "svg"): string {
  const slug = slugify(data.centerText) || "stamp";
  return `stamp-${slug}.${ext}`;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Width/height as rendered — read back from the SVG string rather than
 *  recomputed from shape formulas, so this stays correct even if
 *  renderStampSvg's internal aspect ratios ever change. */
function extractSvgSize(svg: string): { width: number; height: number } {
  const w = svg.match(/width="([\d.]+)"/);
  const h = svg.match(/height="([\d.]+)"/);
  return {
    width: w ? parseFloat(w[1]) : 500,
    height: h ? parseFloat(h[1]) : 500,
  };
}

/** Rasterizes an SVG string to a transparent PNG Blob via an off-DOM
 *  <img> + <canvas>. The canvas is never filled with a background
 *  color, so the alpha channel from the SVG's own transparent
 *  background carries straight through to the PNG. Browser-only —
 *  every caller is a click handler, so this never runs during SSR, but
 *  guard explicitly since the file also gets statically analyzed. */
async function rasterizeSvgToPng(svg: string): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Export only works in the browser");
  }
  const { width, height } = extractSvgSize(svg);
  const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not rasterize the stamp"));
    img.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported in this browser");
  // Deliberately no fillRect — the canvas starts fully transparent and
  // stays that way anywhere the SVG doesn't paint.
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG encoding failed"));
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
