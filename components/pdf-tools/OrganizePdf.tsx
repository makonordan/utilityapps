"use client";

import { useEffect, useState, type DragEvent } from "react";
import { FileText, GripVertical, Loader2, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageThumbnails } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

interface Page {
  /** Original 0-based page index in the source PDF. */
  originalIndex: number;
  thumb: string;
}

export function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!file) {
      setPages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await openPdfDocument(file);
        const thumbs = await renderPageThumbnails(doc, { scale: 0.35 });
        if (!cancelled) {
          setPages(thumbs.map((thumb, i) => ({ originalIndex: i, thumb })));
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Couldn't open that PDF.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const remove = (i: number) => setPages((prev) => prev.filter((_, idx) => idx !== i));

  const onDragStart = (e: DragEvent<HTMLLIElement>, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: DragEvent<HTMLLIElement>, dropIdx: number) => {
    e.preventDefault();
    if (dragIndex == null || dragIndex === dropIdx) return;
    setPages((prev) => {
      const out = [...prev];
      const [moved] = out.splice(dragIndex, 1);
      out.splice(dropIdx, 0, moved);
      return out;
    });
    setDragIndex(null);
  };

  const apply = async () => {
    if (!file || pages.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p.originalIndex));
      copied.forEach((p) => out.addPage(p));
      const bytesOut = await out.save();
      downloadBlob(bytesOut, file.name.replace(/\.pdf$/i, "") + "-organized.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't save the reorganized PDF.");
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
          <span className="text-[11px] text-surface-500 dark:text-surface-400">{pages.length} pages · {formatBytes(file.size)}</span>
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

      {pages.length > 0 && (
        <>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Drag pages to reorder. Click <X className="inline h-3 w-3 align-text-bottom" /> to delete.
          </p>

          <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((page, i) => (
              <li
                key={`${page.originalIndex}-${i}`}
                draggable
                onDragStart={(e) => onDragStart(e, i)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, i)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-white p-2 transition dark:bg-surface-900",
                  dragIndex === i
                    ? "border-red-400 opacity-50"
                    : "border-surface-200 hover:border-red-300 dark:border-surface-800"
                )}
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.thumb} alt={`Page ${i + 1}`} className="max-h-full max-w-full" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-surface-600 dark:text-surface-300">
                  <span className="inline-flex items-center gap-1">
                    <GripVertical className="h-3 w-3 cursor-move text-surface-400" />
                    Page {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove page ${i + 1}`}
                    className="rounded-md p-1 text-surface-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
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
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : `Save (${pages.length} page${pages.length === 1 ? "" : "s"})`}
          </button>
        </>
      )}
    </div>
  );
}
