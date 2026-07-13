"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, FileImage, FileText, Loader2, X } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageToCanvas } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

type Tab = "jpg-to-pdf" | "pdf-to-jpg";

export function JpgPdfTool() {
  const [tab, setTab] = useState<Tab>("jpg-to-pdf");
  return (
    <div className="space-y-5">
      <div role="tablist" className="flex gap-2 rounded-xl bg-surface-100 p-1.5 dark:bg-surface-800">
        {(["jpg-to-pdf", "pdf-to-jpg"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
              tab === t
                ? "bg-white text-red-700 shadow-sm dark:bg-surface-950 dark:text-red-300"
                : "text-surface-600 dark:text-surface-300"
            )}
          >
            {t === "jpg-to-pdf" ? "Image to PDF" : "PDF → JPG"}
          </button>
        ))}
      </div>
      {tab === "jpg-to-pdf" ? <JpgToPdfPanel /> : <PdfToJpgPanel />}
    </div>
  );
}

// =========================================================== JPG → PDF

type PageSize = "auto" | "a4" | "letter";

interface ImgEntry {
  id: string;
  file: File;
  preview: string;
}

const PAGE_SIZES: Record<Exclude<PageSize, "auto">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

function JpgToPdfPanel() {
  const [images, setImages] = useState<ImgEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("auto");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = (files: File[]) => {
    const accepted = files.filter((f) => /^image\/(jpeg|png)$/.test(f.type));
    if (accepted.length === 0) {
      setError("Only PNG, JPG, and JPEG images are accepted.");
      return;
    }
    setError(null);
    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const remove = (id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const move = (id: string, dir: -1 | 1) => {
    setImages((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= prev.length) return prev;
      const out = [...prev];
      [out[idx], out[swap]] = [out[swap], out[idx]];
      return out;
    });
  };

  const convert = async () => {
    if (images.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const doc = await PDFDocument.create();
      for (const img of images) {
        const bytes = new Uint8Array(await img.file.arrayBuffer());
        const isPng = img.file.type === "image/png";
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

        let pageWidth: number;
        let pageHeight: number;
        if (pageSize === "auto") {
          pageWidth = image.width;
          pageHeight = image.height;
        } else {
          [pageWidth, pageHeight] = PAGE_SIZES[pageSize];
        }
        const page = doc.addPage([pageWidth, pageHeight] as [number, number]);

        // Fit image inside page while preserving aspect ratio.
        const ratio = Math.min(pageWidth / image.width, pageHeight / image.height);
        const drawWidth = image.width * ratio;
        const drawHeight = image.height * ratio;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;
        page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
      }
      const out = await doc.save();
      downloadBlob(out, "images.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't convert those images. Only PNG, JPG, and JPEG are supported.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PdfDropzone
        multiple
        accept="image/jpeg,image/png"
        onFiles={add}
        label="Drop images here or click to choose"
        sublabel="PNG, JPG, or JPEG, one or many"
      />

      {images.length > 0 && (
        <>
          <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img, i) => (
              <li
                key={img.id}
                className="overflow-hidden rounded-xl border border-surface-200 bg-white p-2 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={img.file.name} className="max-h-full max-w-full" />
                </div>
                <p className="mt-2 truncate text-[11px] text-surface-600 dark:text-surface-300">{img.file.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-surface-400">{formatBytes(img.file.size)}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(img.id, -1)} disabled={i === 0} aria-label="Move up" className="rounded p-0.5 text-surface-500 hover:bg-surface-100 disabled:opacity-30 dark:hover:bg-surface-800">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(img.id, 1)} disabled={i === images.length - 1} aria-label="Move down" className="rounded p-0.5 text-surface-500 hover:bg-surface-100 disabled:opacity-30 dark:hover:bg-surface-800">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => remove(img.id)} aria-label="Remove" className="rounded p-0.5 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <label className="block max-w-xs">
            <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Page size</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
            >
              <option value="auto">Auto-fit (each image&apos;s size)</option>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">US Letter (8.5 × 11 in)</option>
            </select>
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
          )}

          <button
            type="button"
            onClick={convert}
            disabled={busy}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
              busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
            )}
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Converting…</> : <><FileText className="h-4 w-4" />Convert to PDF</>}
          </button>
        </>
      )}
    </div>
  );
}

// =========================================================== PDF → JPG

function PdfToJpgPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const doc = await openPdfDocument(file);
      const total = doc.numPages;
      const base = file.name.replace(/\.pdf$/i, "");

      if (total === 1) {
        const canvas = await renderPageToCanvas(doc, 1, { scale: 2 });
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const blob = await (await fetch(dataUrl)).blob();
        downloadBlob(blob, `${base}.jpg`, "image/jpeg");
      } else {
        const zip = new JSZip();
        for (let i = 1; i <= total; i += 1) {
          const canvas = await renderPageToCanvas(doc, i, { scale: 2 });
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const blob = await (await fetch(dataUrl)).blob();
          zip.file(`${base}-page-${i}.jpg`, blob);
          setProgress(i / total);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${base}-jpgs.zip`, "application/zip");
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't convert that PDF.");
    } finally {
      setBusy(false);
      setProgress(0);
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
          <p className="rounded-xl bg-surface-50 px-3.5 py-2.5 text-sm text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
            Each page becomes a high-quality JPEG (2× render). Multiple pages bundle into a ZIP.
          </p>

          {busy && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-300">Rendering… {Math.round(progress * 100)}%</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
          )}

          <button
            type="button"
            onClick={convert}
            disabled={busy}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
              busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
            )}
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Converting…</> : <><FileImage className="h-4 w-4" />Convert to JPG</>}
          </button>
        </>
      )}
    </div>
  );
}
