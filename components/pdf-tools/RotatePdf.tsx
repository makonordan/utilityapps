"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, RotateCw, X } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageThumbnails } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [rotations, setRotations] = useState<number[]>([]); // 0 / 90 / 180 / 270 per page
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setThumbs([]);
      setRotations([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await openPdfDocument(file);
        const t = await renderPageThumbnails(doc, { scale: 0.35 });
        if (!cancelled) {
          setThumbs(t);
          setRotations(new Array(t.length).fill(0));
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Couldn't open that PDF. It may be password-protected or corrupt.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const rotate = (i: number) => {
    setRotations((prev) => prev.map((r, idx) => (idx === i ? (r + 90) % 360 : r)));
  };

  const rotateAll = (delta: 90 | 180 | 270) => {
    setRotations((prev) => prev.map((r) => (r + delta) % 360));
  };

  const apply = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((page, i) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotations[i]) % 360));
      });
      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-rotated.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't save the rotated PDF.");
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
          <span className="text-[11px] text-surface-500 dark:text-surface-400">{thumbs.length} pages · {formatBytes(file.size)}</span>
          <button type="button" onClick={() => setFile(null)} aria-label="Remove" className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {loading && (
        <p className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
          <Loader2 className="h-4 w-4 animate-spin" /> Rendering thumbnails…
        </p>
      )}

      {thumbs.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => rotateAll(90)} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-red-300 dark:border-surface-700 dark:bg-surface-900">
              Rotate all 90°
            </button>
            <button type="button" onClick={() => rotateAll(180)} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-red-300 dark:border-surface-700 dark:bg-surface-900">
              Rotate all 180°
            </button>
            <button type="button" onClick={() => rotateAll(270)} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-red-300 dark:border-surface-700 dark:bg-surface-900">
              Rotate all 270°
            </button>
            <button type="button" onClick={() => setRotations(new Array(thumbs.length).fill(0))} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-red-300 dark:border-surface-700 dark:bg-surface-900">
              Reset
            </button>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {thumbs.map((src, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => rotate(i)}
                  className="group relative block w-full overflow-hidden rounded-xl border border-surface-200 bg-white p-2 transition hover:border-red-400 dark:border-surface-800 dark:bg-surface-900"
                  title="Click to rotate 90°"
                >
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Page ${i + 1}`}
                      className="max-h-full max-w-full transition-transform"
                      style={{ transform: `rotate(${rotations[i]}deg)` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-surface-600 dark:text-surface-300">
                    <span>Page {i + 1}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                      <RotateCw className="h-3 w-3" />
                      {rotations[i]}°
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

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
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : "Save rotated PDF"}
          </button>
        </>
      )}
    </div>
  );
}
