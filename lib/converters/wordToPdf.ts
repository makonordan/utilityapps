"use client";

/**
 * Browser-side Word (.docx) → PDF conversion.
 *
 * Pipeline:
 *   1. mammoth converts .docx → semantic HTML (headings, paragraphs,
 *      lists, tables, bold/italic, images stay inline)
 *   2. We inject that HTML into a hidden, fixed-width container off-screen
 *   3. jsPDF.html() rasterizes the container into a multi-page PDF
 *
 * Quality target: ~75%. Plain documents look great. Custom fonts may
 * substitute for system fonts; multi-column layouts, footnotes, complex
 * headers/footers, and pixel-perfect spacing won't survive the round-trip.
 * For documents where fidelity is critical, the user should keep a server-
 * side engine (LibreOffice/Office) — but for 80% of "I just need a PDF
 * version of this Word doc" use cases, this is sufficient.
 *
 * All libraries are dynamic-imported so visitors who don't use the tool
 * never download mammoth (~150 KB) or jsPDF (~330 KB).
 */

import { downloadBlob } from "@/lib/pdfClient";

export interface WordToPdfOptions {
  /** Optional progress callback fired at stage boundaries (0..100). */
  onProgress?: (percent: number, stage: string) => void;
}

const PAGE_WIDTH_MM = 210; // A4
const PAGE_HEIGHT_MM = 297; // A4
const PAGE_MARGIN_MM = 15;
/** ~595 CSS px = standard A4 portrait at 72dpi minus margins. The hidden
 *  container needs a fixed pixel width so jsPDF.html()'s rasterizer
 *  produces predictable line wraps. */
const CONTAINER_WIDTH_PX = 595;

export async function convertWordToPdf(
  file: File,
  options: WordToPdfOptions = {}
): Promise<Blob> {
  const { onProgress = () => {} } = options;

  onProgress(5, "Reading Word file");
  const arrayBuffer = await file.arrayBuffer();

  // mammoth's default entry resolves to a browser-safe build in Next.js's
  // bundler (it has a "browser" field). Dynamic import keeps the ~150 KB
  // library out of the initial page bundle.
  onProgress(15, "Loading converter");
  const mammoth = await import("mammoth");

  onProgress(25, "Parsing document");
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      // Map Word styles to semantic HTML so jsPDF gets clean defaults.
      // mammoth handles list nesting and bold/italic out of the box.
      styleMap: [
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Subtitle'] => h2.subtitle:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
      ],
    }
  );

  if (result.messages?.length) {
    // mammoth emits warnings (unsupported elements) — keep them out of the
    // user's face but make them findable in DevTools for debugging.
    console.info("[wordToPdf] mammoth notes:", result.messages);
  }

  onProgress(40, "Rendering to PDF");
  // Off-screen container the rasterizer reads from. Hidden via position
  // (NOT display:none — display:none has zero box and html2canvas gives up).
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "0";
  container.style.width = `${CONTAINER_WIDTH_PX}px`;
  container.style.padding = "0";
  container.style.boxSizing = "content-box";
  container.style.fontFamily = "Helvetica, Arial, sans-serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.5";
  container.style.color = "#000";
  container.style.background = "#fff";
  // Word documents use cm/inch units; jsPDF expects px-equivalent. The
  // injected stylesheet gives sensible defaults for headings, paragraphs,
  // lists and tables so the PDF doesn't look like a 1995 web page.
  const style = document.createElement("style");
  style.textContent = WORD_HTML_DEFAULTS;
  container.appendChild(style);

  const body = document.createElement("div");
  body.innerHTML = result.value || "<p><em>Empty document.</em></p>";
  container.appendChild(body);
  document.body.appendChild(container);

  try {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    await pdf.html(container, {
      margin: [PAGE_MARGIN_MM, PAGE_MARGIN_MM, PAGE_MARGIN_MM, PAGE_MARGIN_MM],
      autoPaging: "text", // page-breaks happen between paragraphs, not mid-line
      html2canvas: {
        scale: (PAGE_WIDTH_MM - PAGE_MARGIN_MM * 2) / (CONTAINER_WIDTH_PX * 0.2645),
        // 1 px ≈ 0.2645 mm; we want the container's CSS pixels to map onto
        // the printable area exactly so widths line up.
        backgroundColor: "#ffffff",
        useCORS: true,
      },
      width: PAGE_WIDTH_MM - PAGE_MARGIN_MM * 2,
      windowWidth: CONTAINER_WIDTH_PX,
    });

    onProgress(95, "Finalizing");
    const blob = pdf.output("blob");
    onProgress(100, "Done");
    return blob;
  } finally {
    container.remove();
  }
}

/** Convenience wrapper used by the tool page — convert + trigger download. */
export async function convertWordToPdfAndDownload(
  file: File,
  options: WordToPdfOptions = {}
): Promise<{ blob: Blob; filename: string }> {
  const blob = await convertWordToPdf(file, options);
  const filename = file.name.replace(/\.docx?$/i, "") + ".pdf";
  downloadBlob(blob, filename, "application/pdf");
  return { blob, filename };
}

const WORD_HTML_DEFAULTS = `
  h1, h2, h3, h4, h5, h6 {
    margin: 0.6em 0 0.3em;
    line-height: 1.2;
    page-break-after: avoid;
    font-weight: 700;
  }
  h1 { font-size: 22pt; }
  h2 { font-size: 18pt; }
  h3 { font-size: 14pt; }
  h4 { font-size: 12pt; }
  h1.title { font-size: 28pt; margin-bottom: 0.1em; }
  h2.subtitle { font-size: 16pt; font-weight: 500; color: #444; margin-top: 0; }
  p { margin: 0 0 0.6em; }
  ul, ol { margin: 0 0 0.6em 1.6em; padding: 0; }
  li { margin-bottom: 0.2em; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.6em 0;
    page-break-inside: avoid;
  }
  th, td { border: 1px solid #888; padding: 4px 6px; vertical-align: top; }
  th { background: #eee; font-weight: 700; }
  img { max-width: 100%; height: auto; }
  pre, code { font-family: ui-monospace, "Courier New", monospace; font-size: 10pt; }
  blockquote {
    margin: 0.6em 0;
    padding-left: 1em;
    border-left: 3px solid #aaa;
    color: #333;
  }
  hr { border: none; border-top: 1px solid #ccc; margin: 0.8em 0; }
`;
