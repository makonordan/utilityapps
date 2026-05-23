"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

/**
 * Shared UI for all six Phase-2 Office ↔ PDF tools. Every tool is the same
 * shape: pick one file, POST to /api/convert with a target, stream the
 * converted file back as a download. This component is the thin layer over
 * that flow; the per-tool page provides the title, description and target.
 */

export type ConvertTarget =
  | "pdf-to-docx"
  | "pdf-to-xlsx"
  | "pdf-to-pptx"
  | "docx-to-pdf"
  | "xlsx-to-pdf"
  | "pptx-to-pdf";

interface Props {
  /** ConvertAPI target — passed straight to /api/convert. */
  target: ConvertTarget;
  /** Comma-separated MIME types for the file <input>'s accept attribute. */
  accept: string;
  /** Dropzone label, e.g. "Drop a Word document here or click to choose". */
  dropLabel: string;
  /** Verb shown on the action button, e.g. "Convert to PDF". */
  actionLabel: string;
  /**
   * Output file extension the user will see, e.g. ".pdf". Used only for the
   * success message; the actual filename comes from the server's
   * Content-Disposition header.
   */
  outputExt: string;
}

// Browser-reported MIME types we accept on the client (server re-validates).
function isAllowed(file: File, accept: string): boolean {
  if (!accept) return true;
  const list = accept.split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(file.type);
}

export function OfficeConverter({
  target,
  accept,
  dropLabel,
  actionLabel,
  outputExt,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const pickFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!isAllowed(f, accept)) {
      setError("That file type isn't supported by this converter.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB for server conversion.");
      return;
    }
    setError(null);
    setDone(null);
    setFile(f);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("target", target);
      const res = await fetch("/api/convert", { method: "POST", body: fd });

      if (!res.ok) {
        // Try to read a JSON error payload; fall back to a status-based message.
        let message = `Conversion failed (HTTP ${res.status}).`;
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          /* not JSON — keep default */
        }
        setError(message);
        return;
      }

      // Server sets Content-Disposition with the right filename; honour it.
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/i);
      const filename =
        match?.[1] ?? file.name.replace(/\.[^.]+$/, "") + outputExt;
      const blob = await res.blob();
      downloadBlob(blob, filename, blob.type);
      setDone(filename);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the conversion server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <PdfDropzone
          onFiles={pickFile}
          accept={accept}
          label={dropLabel}
          sublabel="Up to 10 MB · processed on our server, deleted after"
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">
            {file.name}
          </span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">
            {formatBytes(file.size)}
          </span>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setDone(null);
              setError(null);
            }}
            aria-label="Remove"
            className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      {done && (
        <p className="flex items-start gap-2 rounded-xl bg-success-50 px-3 py-2.5 text-sm text-success-800 dark:bg-success-500/10 dark:text-success-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Downloaded <strong>{done}</strong>. The uploaded file has been deleted from our server.
          </span>
        </p>
      )}

      {file && (
        <button
          type="button"
          onClick={convert}
          disabled={busy}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
            busy ? "cursor-not-allowed opacity-60" : "hover:bg-red-700"
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> {actionLabel}
            </>
          )}
        </button>
      )}
    </div>
  );
}
