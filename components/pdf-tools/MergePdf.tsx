"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, FileText, Loader2, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  file: File;
}

export function MergePdf() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = (files: File[]) => {
    setError(null);
    setEntries((prev) => [
      ...prev,
      ...files.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
  };

  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const out = [...prev];
      [out[idx], out[swap]] = [out[swap], out[idx]];
      return out;
    });
  };

  const merge = async () => {
    if (entries.length < 2) {
      setError("Add at least two PDFs to merge.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const entry of entries) {
        const bytes = new Uint8Array(await entry.file.arrayBuffer());
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      downloadBlob(out, "merged.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't merge those PDFs. They may be password-protected or corrupt.");
    } finally {
      setBusy(false);
    }
  };

  const totalSize = entries.reduce((sum, e) => sum + e.file.size, 0);

  return (
    <div className="space-y-5">
      <PdfDropzone
        multiple
        onFiles={add}
        label="Drop PDFs here or click to choose"
        sublabel={entries.length > 0 ? `${entries.length} file${entries.length === 1 ? "" : "s"} added · ${formatBytes(totalSize)} total` : "Add two or more to start merging"}
      />

      {entries.length > 0 && (
        <ul className="space-y-2">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900"
            >
              <FileText className="h-4 w-4 shrink-0 text-red-500" />
              <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">
                {entry.file.name}
              </span>
              <span className="text-[11px] text-surface-500 dark:text-surface-400">
                {formatBytes(entry.file.size)}
              </span>
              <button
                type="button"
                onClick={() => move(entry.id, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="rounded-lg p-1 text-surface-500 transition hover:bg-surface-100 disabled:opacity-30 dark:hover:bg-surface-800"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(entry.id, 1)}
                disabled={i === entries.length - 1}
                aria-label="Move down"
                className="rounded-lg p-1 text-surface-500 transition hover:bg-surface-100 disabled:opacity-30 dark:hover:bg-surface-800"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                aria-label="Remove"
                className="rounded-lg p-1 text-surface-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={merge}
        disabled={busy || entries.length < 2}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition",
          busy || entries.length < 2 ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
        )}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Merging…
          </>
        ) : (
          <>Merge {entries.length || ""} PDF{entries.length === 1 ? "" : "s"}</>
        )}
      </button>
    </div>
  );
}
