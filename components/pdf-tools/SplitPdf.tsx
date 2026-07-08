"use client";

import { useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, parsePageRanges } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

type Mode = "range" | "each";

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("range");
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUpload = async (files: File[]) => {
    setError(null);
    const f = files[0];
    setFile(f);
    setRange("");
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch {
      setError("Couldn't open that PDF. It may be password-protected or corrupt.");
      setFile(null);
      setPageCount(0);
    }
  };

  const split = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);

      if (mode === "range") {
        const pages = parsePageRanges(range, src.getPageCount());
        if (pages.length === 0) {
          setError("Enter at least one valid page (e.g. 1-3, 5).");
          setBusy(false);
          return;
        }
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, pages.map((n) => n - 1));
        copied.forEach((p) => out.addPage(p));
        const bytesOut = await out.save();
        downloadBlob(bytesOut, file.name.replace(/\.pdf$/i, "") + "-split.pdf");
      } else {
        // One PDF per page → zip.
        const zip = new JSZip();
        const baseName = file.name.replace(/\.pdf$/i, "");
        for (let i = 0; i < src.getPageCount(); i += 1) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(src, [i]);
          out.addPage(page);
          const bytesOut = await out.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, bytesOut);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${baseName}-pages.zip`, "application/zip");
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't split that PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <PdfDropzone onFiles={setUpload} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">
            {pageCount} pages · {formatBytes(file.size)}
          </span>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPageCount(0);
              setRange("");
            }}
            aria-label="Remove"
            className="rounded-lg p-1 text-surface-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <>
          <div role="tablist" className="flex gap-2 rounded-xl bg-surface-100 p-1.5 dark:bg-surface-800">
            {(["range", "each"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  mode === m
                    ? "bg-white text-red-700 shadow-sm dark:bg-surface-950 dark:text-red-300"
                    : "text-surface-600 dark:text-surface-300"
                )}
              >
                {m === "range" ? "Extract page range" : "Split each page"}
              </button>
            ))}
          </div>

          {mode === "range" ? (
            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
                Pages to extract
              </span>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder={`e.g. 1-3, 5, 7-${pageCount}`}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              />
              <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
                Comma-separated list of pages or ranges between 1 and {pageCount}.
              </p>
            </label>
          ) : (
            <p className="rounded-xl bg-surface-50 px-3.5 py-2.5 text-sm text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
              Every page will become its own PDF, bundled into a ZIP. {pageCount} files will be created.
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
          )}

          <button
            type="button"
            onClick={split}
            disabled={busy}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
              busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
            )}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Splitting…
              </>
            ) : mode === "range" ? (
              "Extract pages"
            ) : (
              "Split into ZIP"
            )}
          </button>
        </>
      )}
    </div>
  );
}
