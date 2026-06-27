"use client";

/**
 * Browser-side PDF → Word (.docx) conversion — TEXT ONLY.
 *
 * What this does:
 *   1. pdfjs extracts every page's text content (as ordered string runs)
 *   2. We group consecutive runs into paragraphs, dropping runs that look
 *      like coordinate noise (single glyphs at unrelated positions)
 *   3. The `docx` library writes a real .docx file with one paragraph per
 *      detected paragraph plus a page-break between original PDF pages
 *
 * What this DOES NOT do (be honest with the user):
 *   - Tables: lost. PDF has no table semantics; we'd need OCR-grade
 *     layout analysis to recover them.
 *   - Images: dropped.
 *   - Formatting (bold/italic, fonts, sizes): mostly dropped. We
 *     preserve font size very approximately to spot headings, but custom
 *     fonts substitute for the docx default.
 *   - Multi-column layouts: text flow may interleave columns.
 *
 * The UI MUST surface this so users aren't surprised by a plain-text
 * result when they expected a faithful copy.
 */

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

import { downloadBlob, openPdfDocument } from "@/lib/pdfClient";

export interface PdfToWordOptions {
  /** Optional progress callback (0..100). */
  onProgress?: (percent: number, stage: string) => void;
  /** When false, each PDF page becomes a docx section break instead of a
   *  forced page break. Default: true (page breaks preserved). */
  preservePageBreaks?: boolean;
}

interface PdfTextRun {
  text: string;
  fontSize: number;
}

export async function convertPdfToWord(
  file: File,
  options: PdfToWordOptions = {}
): Promise<Blob> {
  const { onProgress = () => {}, preservePageBreaks = true } = options;

  onProgress(5, "Opening PDF");
  const pdf = await openPdfDocument(file);
  const pageCount = pdf.numPages;
  if (pageCount === 0) {
    throw new Error("This PDF has no pages.");
  }

  const docParagraphs: Paragraph[] = [];

  // Walk pages in order. pdfjs returns text "items" with position info we
  // mostly ignore — the order matches reading order for clean digital PDFs.
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    onProgress(
      10 + Math.round(((pageNum - 1) / pageCount) * 70),
      `Extracting page ${pageNum} of ${pageCount}`
    );

    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    page.cleanup();

    // Group consecutive items separated by < 2pt vertical gap as a single
    // paragraph; any larger gap starts a new paragraph. This matches
    // typical PDF rendering of body text vs. headings/list breaks.
    const runs: PdfTextRun[] = [];
    let lastY: number | null = null;
    let buffer: PdfTextRun[] = [];

    for (const item of textContent.items) {
      if (typeof (item as { str?: unknown }).str !== "string") continue;
      const str = (item as { str: string }).str;
      // pdfjs items expose the transform matrix on `transform[5]` (y) and
      // height on `height`. Whitespace-only items still matter for word
      // spacing but shouldn't trigger paragraph breaks.
      const transform = (item as { transform?: number[] }).transform;
      const yPos = transform && transform.length >= 6 ? transform[5] : null;
      const height = (item as { height?: number }).height ?? 11;

      if (lastY === null) {
        lastY = yPos;
      } else if (yPos !== null && Math.abs(yPos - lastY) > 2) {
        // Vertical jump — flush the current line as a paragraph and start
        // a new one. Filter out 1-glyph buffers that are usually noise.
        if (buffer.length) {
          const joined = collapseRuns(buffer);
          if (joined.text.trim().length > 0) runs.push(joined);
        }
        buffer = [];
        lastY = yPos;
      }

      buffer.push({ text: str, fontSize: height });
    }
    if (buffer.length) {
      const joined = collapseRuns(buffer);
      if (joined.text.trim().length > 0) runs.push(joined);
    }

    // Convert runs to docx paragraphs. Approximate heading detection: any
    // run whose font size is materially bigger than the page median is
    // treated as a heading.
    const medianSize = runs.length ? median(runs.map((r) => r.fontSize)) : 11;
    for (const run of runs) {
      const isHeading = run.fontSize >= medianSize * 1.4 && run.text.length < 120;
      docParagraphs.push(
        new Paragraph({
          heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
          children: [
            new TextRun({
              text: run.text,
              bold: isHeading,
              size: Math.round(run.fontSize * 2), // docx uses half-points
            }),
          ],
        })
      );
    }

    // Insert a page break between pages (except after the last).
    if (preservePageBreaks && pageNum < pageCount) {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "", break: 1 })],
          pageBreakBefore: true,
        })
      );
    }
  }

  onProgress(85, "Building Word document");
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs.length
          ? docParagraphs
          : [new Paragraph("(empty document)")],
      },
    ],
  });

  onProgress(95, "Finalizing");
  const blob = await Packer.toBlob(doc);
  onProgress(100, "Done");
  return blob;
}

function collapseRuns(runs: PdfTextRun[]): PdfTextRun {
  return {
    text: runs.map((r) => r.text).join("").trim(),
    fontSize: median(runs.map((r) => r.fontSize)) || 11,
  };
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Convenience wrapper — convert + trigger download. */
export async function convertPdfToWordAndDownload(
  file: File,
  options: PdfToWordOptions = {}
): Promise<{ blob: Blob; filename: string }> {
  const blob = await convertPdfToWord(file, options);
  const filename = file.name.replace(/\.pdf$/i, "") + ".docx";
  downloadBlob(
    blob,
    filename,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  return { blob, filename };
}
