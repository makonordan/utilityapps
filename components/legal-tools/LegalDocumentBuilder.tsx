"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Download, FileDown, FileText, Loader2 } from "lucide-react";

import {
  downloadFile,
  renderToDocx,
  renderToHtml,
  renderToPdf,
  slugify,
  type LegalDocument,
} from "@/lib/legalDocs";
import { cn } from "@/lib/utils";

/**
 * Two-pane builder used by every Legal tool. The tool component:
 *   1. renders its own form on the left (passed as `form`)
 *   2. passes a `document` object (built from form state) to the right side
 *
 * The shared parts — live HTML preview, "Download PDF / Word" buttons,
 * "not legal advice" footer in the preview — live here so individual
 * tools stay focused on their template logic.
 */
interface Props {
  /** The form fields go in the left column. */
  form: ReactNode;
  /** The current document state, re-derived from the form on every render. */
  document: LegalDocument;
  /** Filename prefix (no extension). Defaults to a slug of the title. */
  filenamePrefix?: string;
}

export function LegalDocumentBuilder({ form, document, filenamePrefix }: Props) {
  const [downloading, setDownloading] = useState<null | "pdf" | "docx">(null);
  const [error, setError] = useState<string | null>(null);

  const previewHtml = useMemo(() => renderToHtml(document), [document]);
  const base = filenamePrefix ?? slugify(document.title);

  const downloadPdf = async () => {
    setError(null);
    setDownloading("pdf");
    try {
      const bytes = await renderToPdf(document);
      downloadFile(bytes, `${base}.pdf`, "application/pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const downloadDocx = async () => {
    setError(null);
    setDownloading("docx");
    try {
      const blob = await renderToDocx(document);
      downloadFile(
        blob,
        `${base}.docx`,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    } catch (err) {
      console.error(err);
      setError("Couldn't generate the Word document. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Form column */}
      <div className="space-y-5">
        <div className="rounded-xl border border-surface-200 bg-white p-4 sm:p-5 dark:border-surface-800 dark:bg-surface-900">
          {form}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={downloadPdf}
            disabled={downloading !== null}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition",
              downloading !== null ? "cursor-not-allowed opacity-60" : "hover:bg-blue-800"
            )}
          >
            {downloading === "pdf" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Building PDF…
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Download PDF
              </>
            )}
          </button>
          <button
            type="button"
            onClick={downloadDocx}
            disabled={downloading !== null}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-700 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition dark:border-blue-400 dark:bg-surface-900 dark:text-blue-200",
              downloading !== null ? "cursor-not-allowed opacity-60" : "hover:bg-blue-50 dark:hover:bg-blue-500/15"
            )}
          >
            {downloading === "docx" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Building Word…
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" /> Download Word
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* Live preview column */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          <span>Live preview</span>
          <span className="inline-flex items-center gap-1 normal-case text-[10px] text-surface-400">
            <Download className="h-3 w-3" /> Renders the same as your downloads
          </span>
        </div>
        <div className="max-h-[640px] overflow-y-auto rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-950">
          <div
            className="legal-preview prose prose-sm prose-surface max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
}
