"use client";

import { useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

type Position = "tl" | "tc" | "tr" | "bl" | "bc" | "br";
type Format = "n" | "n-of-m" | "page-n-of-m";

const POSITION_LABELS: Record<Position, string> = {
  tl: "Top left",
  tc: "Top centre",
  tr: "Top right",
  bl: "Bottom left",
  bc: "Bottom centre",
  br: "Bottom right",
};

const FORMAT_LABELS: Record<Format, string> = {
  n: "1",
  "n-of-m": "1 / 10",
  "page-n-of-m": "Page 1 of 10",
};

function formatNumber(n: number, total: number, format: Format): string {
  if (format === "n") return String(n);
  if (format === "n-of-m") return `${n} / ${total}`;
  return `Page ${n} of ${total}`;
}

export function PageNumbersPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bc");
  const [format, setFormat] = useState<Format>("n-of-m");
  const [fontSize, setFontSize] = useState(11);
  const [startNumber, setStartNumber] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, i) => {
        const text = formatNumber(startNumber + i, startNumber + total - 1, format);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 28; // ~0.4 inch
        let x = margin;
        let y = margin;
        if (position[1] === "c") x = (width - textWidth) / 2;
        if (position[1] === "r") x = width - textWidth - margin;
        if (position[0] === "t") y = height - margin - fontSize * 0.8;
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-numbered.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't add page numbers. The PDF may be password-protected.");
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Format</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              >
                {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                  <option key={f} value={f}>{FORMAT_LABELS[f]}</option>
                ))}
              </select>
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
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Font size</span>
              <input
                type="number"
                min={6}
                max={36}
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(6, Math.min(36, Number(e.target.value) || 11)))}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Start number</span>
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value) || 1))}
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
            disabled={busy}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
              busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
            )}
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Adding…</> : "Add page numbers"}
          </button>
        </>
      )}
    </div>
  );
}
