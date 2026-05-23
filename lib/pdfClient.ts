"use client";

/**
 * Client-side helpers shared by every tool in the PDF Tools category.
 * Wraps pdfjs-dist (rendering) and provides small utilities for file I/O.
 *
 * NOTE: pdfjs-dist references browser-only globals (DOMMatrix, ImageData) at
 * module load. That crashes Next.js SSR prerender even for "use client"
 * components, because client components still execute on the server during
 * static prerender. We therefore lazy-load pdfjs-dist inside the functions
 * that need it, gated behind a typeof window check.
 */

import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
function loadPdfjs(): Promise<typeof import("pdfjs-dist")> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pdfjs-dist is only available in the browser"));
  }
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      // Point pdfjs at a CDN-hosted worker matching the version we installed.
      // Keeps the Next.js bundle small — the 1MB worker isn't shipped with the page.
      if (!mod.GlobalWorkerOptions.workerSrc) {
        mod.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${mod.version}/build/pdf.worker.min.mjs`;
      }
      return mod;
    });
  }
  return pdfjsPromise;
}

/** Read a File into a Uint8Array. */
export async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

/** Open a PDF for rendering with pdfjs. */
export async function openPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfjs();
  const bytes = await fileToBytes(file);
  // pdfjs mutates the input buffer — pass a copy so callers can reuse the
  // original bytes (e.g. to feed pdf-lib for editing the same file).
  return pdfjs.getDocument({ data: bytes.slice() }).promise;
}

/** Render a single page to a canvas. */
export async function renderPageToCanvas(
  doc: PDFDocumentProxy,
  pageNumber: number,
  { scale = 1, canvas }: { scale?: number; canvas?: HTMLCanvasElement } = {}
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const out = canvas ?? document.createElement("canvas");
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  out.width = Math.floor(viewport.width);
  out.height = Math.floor(viewport.height);
  await page.render({ canvas: out, canvasContext: ctx, viewport }).promise;
  return out;
}

/** Render a single page to a JPEG data URL at the given quality. */
export async function renderPageToJpeg(
  doc: PDFDocumentProxy,
  pageNumber: number,
  { scale = 1.5, quality = 0.92 }: { scale?: number; quality?: number } = {}
): Promise<string> {
  const canvas = await renderPageToCanvas(doc, pageNumber, { scale });
  return canvas.toDataURL("image/jpeg", quality);
}

/** Render all pages to thumbnail data URLs (PNG, lower res). */
export async function renderPageThumbnails(
  doc: PDFDocumentProxy,
  { scale = 0.4 }: { scale?: number } = {}
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const canvas = await renderPageToCanvas(doc, i, { scale });
    out.push(canvas.toDataURL("image/png"));
  }
  return out;
}

/** Trigger a browser download for a blob / bytes. */
export function downloadBlob(data: Blob | Uint8Array | ArrayBuffer, filename: string, mimeType = "application/pdf") {
  const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

/** Human-readable file size. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Parse "1-3, 5, 7-10" into [1,2,3,5,7,8,9,10]. Clamps to [1, totalPages]. */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const out = new Set<number>();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const dash = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (dash) {
      const start = Math.max(1, Math.min(totalPages, Number(dash[1])));
      const end = Math.max(1, Math.min(totalPages, Number(dash[2])));
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let i = lo; i <= hi; i += 1) out.add(i);
      continue;
    }
    const single = trimmed.match(/^\d+$/);
    if (single) {
      const n = Number(single[0]);
      if (n >= 1 && n <= totalPages) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}
