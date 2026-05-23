"use client";

import { useState } from "react";
import { FileText, Loader2, Minimize2, X } from "lucide-react";
import { PDFDocument, PageSizes } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageToCanvas } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

type Quality = "high" | "medium" | "low";

const QUALITY_VALUES: Record<Quality, { jpeg: number; scale: number }> = {
  high: { jpeg: 0.9, scale: 1.5 },
  medium: { jpeg: 0.75, scale: 1.2 },
  low: { jpeg: 0.5, scale: 1.0 },
};

const QUALITY_LABELS: Record<Quality, string> = {
  high: "High — best look, modest savings",
  medium: "Medium — balanced",
  low: "Low — smallest file",
};

interface Result {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
}

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      const doc = await openPdfDocument(file);
      const out = await PDFDocument.create();
      const { jpeg, scale } = QUALITY_VALUES[quality];
      const total = doc.numPages;
      for (let i = 1; i <= total; i += 1) {
        const canvas = await renderPageToCanvas(doc, i, { scale });
        const dataUrl = canvas.toDataURL("image/jpeg", jpeg);
        const imageBytes = dataUrlToBytes(dataUrl);
        const image = await out.embedJpg(imageBytes);
        // Keep original aspect; pick a reasonable page size matching the image.
        const page = out.addPage([image.width, image.height] as [number, number]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        setProgress(i / total);
      }
      const bytesOut = await out.save();
      setResult({ bytes: bytesOut, originalSize: file.size, newSize: bytesOut.length });
    } catch (err) {
      console.error(err);
      setError("Couldn't compress that PDF.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const download = () => {
    if (!result || !file) return;
    downloadBlob(result.bytes, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");
  };

  // Reference PageSizes so the import isn't unused (helpful when iterating).
  void PageSizes;

  return (
    <div className="space-y-5">
      {!file ? (
        <PdfDropzone onFiles={(files) => { setFile(files[0]); setResult(null); }} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">{formatBytes(file.size)}</span>
          <button type="button" onClick={() => { setFile(null); setResult(null); }} aria-label="Remove" className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <>
          <fieldset className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
            <legend className="px-1 text-sm font-semibold text-surface-700 dark:text-surface-200">Quality</legend>
            <div className="mt-2 space-y-2">
              {(Object.keys(QUALITY_VALUES) as Quality[]).map((q) => (
                <label key={q} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-50 dark:hover:bg-surface-800">
                  <input
                    type="radio"
                    name="quality"
                    value={q}
                    checked={quality === q}
                    onChange={() => setQuality(q)}
                    className="h-4 w-4 accent-red-500"
                  />
                  <span className="text-sm text-surface-800 dark:text-surface-100">
                    <strong className="capitalize">{q}</strong> — {QUALITY_LABELS[q].split(" — ")[1]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            ⚠ Compression flattens pages to images — selectable text is lost. Keep the original if
            you need searchable text.
          </p>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
          )}

          {busy && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-300">Compressing… {Math.round(progress * 100)}%</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          )}

          {result && (
            <div className="rounded-2xl border border-success-200 bg-success-50 p-4 dark:border-success-500/40 dark:bg-success-500/10">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {formatBytes(result.originalSize)} → <strong className="text-success-700 dark:text-success-300">{formatBytes(result.newSize)}</strong> (
                {Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100))}% smaller)
              </p>
              <button
                type="button"
                onClick={download}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Download compressed PDF
              </button>
            </div>
          )}

          {!result && (
            <button
              type="button"
              onClick={compress}
              disabled={busy}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
                busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
              )}
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Compressing…</> : <><Minimize2 className="h-4 w-4" />Compress PDF</>}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
