"use client";

import { useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

type Position = "tl" | "tc" | "tr" | "ml" | "mc" | "mr" | "bl" | "bc" | "br";

const POSITION_LABELS: Record<Position, string> = {
  tl: "Top left", tc: "Top centre", tr: "Top right",
  ml: "Middle left", mc: "Centre", mr: "Middle right",
  bl: "Bottom left", bc: "Bottom centre", br: "Bottom right",
};

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

export function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState("#dc2626");
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<Position>("mc");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async () => {
    if (!file || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = hexToRgb(color);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;
        const margin = 36;

        let x = margin;
        let y = margin;
        if (position[1] === "c") x = (width - textWidth) / 2;
        if (position[1] === "r") x = width - textWidth - margin;
        if (position[0] === "m") y = (height - textHeight) / 2;
        if (position[0] === "t") y = height - textHeight - margin;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(rotation),
        });
      }

      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't add the watermark. The PDF may be password-protected.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <PdfDropzone onFiles={(files) => setFile(files[0])} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">{formatBytes(file.size)}</span>
          <button type="button" onClick={() => setFile(null)} aria-label="Remove" className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <>
          <label className="block">
            <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Watermark text</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={64}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Font size</span>
              <input
                type="number"
                min={12}
                max={200}
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(12, Math.min(200, Number(e.target.value) || 60)))}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Colour</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-1.5 block h-10 w-full cursor-pointer rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Position</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              >
                {(Object.keys(POSITION_LABELS) as Position[]).map((p) => (
                  <option key={p} value={p}>{POSITION_LABELS[p]}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Opacity ({Math.round(opacity * 100)}%)</span>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-200 accent-red-500 dark:bg-surface-700"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Rotation</span>
              <input
                type="number"
                min={-180}
                max={180}
                step={5}
                value={rotation}
                onChange={(e) => setRotation(Math.max(-180, Math.min(180, Number(e.target.value) || 0)))}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
          )}

          <button
            type="button"
            onClick={apply}
            disabled={busy || !text.trim()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
              busy || !text.trim() ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
            )}
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Applying…</> : "Apply watermark"}
          </button>
        </>
      )}
    </div>
  );
}
