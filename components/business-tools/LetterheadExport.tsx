"use client";

import { useRef, useState } from "react";
import { AlertTriangle, FileText, FileType, Image as ImageIcon, Loader2 } from "lucide-react";

import {
  DEFAULT_FONT,
  DOC_SAFE_FONTS_BY_NAME,
  PAPER_SIZES_BY_ID,
  buildFooterModel,
  buildHeaderModel,
  mmToPx,
  pagePadding,
  type HFAlign,
  type HeaderFooterColumn,
  type HeaderFooterModel,
  type HeaderFooterRow,
  type HeaderFooterTextBlock,
  type LetterheadData,
} from "@/lib/letterhead";

import { LetterheadPageContent, TemplateHeader } from "./LetterheadGenerator";

/**
 * Download bar for the Letterhead Generator. Three formats, all
 * generated 100% client-side — nothing is uploaded except the logo
 * (handled separately, at edit time, by LogoPicker in
 * LetterheadGenerator.tsx).
 *
 * Word and PDF both render from the SAME normalized model
 * (buildHeaderModel/buildFooterModel in lib/letterhead.ts) via the
 * row/column walkers below, so a change to the model's per-template
 * layout automatically stays consistent between the two formats. PNG
 * takes a different, equally-consistent route: it screenshots a hidden,
 * full-resolution, unscaled copy of the exact same
 * LetterheadPageContent/TemplateHeader components the live preview
 * uses — so PNG output always matches what the user sees on screen.
 *
 * All three heavy libraries (docx, jspdf, html2canvas) are dynamically
 * imported inside their handlers, matching the lazy-import convention
 * already used by TicketExport.tsx/InvoiceGenerator.tsx elsewhere in
 * this codebase, so visitors who never click "download" never pay for
 * the bundle weight.
 */

type ExportKind = "word" | "pdf" | "png-full" | "png-header";

const PAGE_MARGIN_MM = 20;
const HEADER_MARGIN_MM = 30;
const HEADER_OFFSET_MM = 10;
const FOOTER_OFFSET_MM = 10;
const PT_TO_MM = 0.352778;

// ── Component ────────────────────────────────────────────────────────────

export function LetterheadExport({ data }: { data: LetterheadData }) {
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fullPageRef = useRef<HTMLDivElement>(null);
  const headerOnlyRef = useRef<HTMLDivElement>(null);

  const paper = PAPER_SIZES_BY_ID[data.paperSize];
  const { paddingX, paddingY } = pagePadding(paper);
  const canExport = data.companyName.trim().length > 0;

  const withBusy = async (kind: ExportKind, fn: () => Promise<void>) => {
    if (!canExport || busy) return;
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(null);
    }
  };

  const handleWord = () =>
    withBusy("word", async () => {
      const [docx, { saveAs }] = await Promise.all([import("docx"), import("file-saver")]);
      const blob = await buildWordBlob(data, docx);
      saveAs(blob, exportFileName(data, "docx"));
    });

  const handlePdf = () =>
    withBusy("pdf", async () => {
      const { default: JsPDF } = await import("jspdf");
      const doc = await buildPdfDocument(JsPDF, data);
      doc.save(exportFileName(data, "pdf"));
    });

  const handleImage = (mode: "full" | "header") =>
    withBusy(mode === "full" ? "png-full" : "png-header", async () => {
      const { default: html2canvas } = await import("html2canvas");
      const el = mode === "full" ? fullPageRef.current : headerOnlyRef.current;
      if (!el) throw new Error("Renderer detached — try again");
      const canvas = await html2canvas(el, {
        // scale:3 keeps the PNG crisp (well above 300 DPI at typical
        // letterhead sizes) regardless of the on-screen zoom level,
        // since this hidden element is never CSS-transformed.
        scale: 3,
        useCORS: true,
        backgroundColor: mode === "full" ? "#ffffff" : null,
        logging: false,
      });
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("PNG encode failed");
      const { saveAs } = await import("file-saver");
      saveAs(blob, exportFileName(data, "png", mode === "header" ? "-header" : ""));
    });

  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Download</h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Nothing is uploaded — every format is generated in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ExportButton
          icon={FileText}
          label="Download Word (.docx)"
          hint="Editable — type your letter directly in Microsoft Word"
          busy={busy === "word"}
          disabled={!canExport}
          onClick={handleWord}
        />
        <ExportButton
          icon={FileType}
          label="Download PDF"
          hint="Print-ready fixed layout"
          busy={busy === "pdf"}
          disabled={!canExport}
          onClick={handlePdf}
        />
        <div>
          <ExportButton
            icon={ImageIcon}
            label="Download Image (PNG)"
            hint="Insert as a header image in any app"
            busy={busy === "png-full"}
            disabled={!canExport}
            onClick={() => handleImage("full")}
          />
          <button
            type="button"
            onClick={() => handleImage("header")}
            disabled={!canExport || busy !== null}
            className="mt-1.5 w-full text-center text-[11px] font-medium text-primary-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-primary-400"
          >
            {busy === "png-header" ? "Rendering…" : "Header only (transparent PNG)"}
          </button>
        </div>
      </div>

      {!canExport && (
        <p className="mt-3 text-[11px] text-surface-500 dark:text-surface-400">
          Add a company name above to enable downloads.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Hidden, full-resolution, unscaled renders captured by
          html2canvas for the PNG export. These reuse the exact same
          components as the on-screen preview, so the PNG always matches
          what's visible — no separate canvas-drawing logic to keep in
          sync. */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", top: -99999, left: -99999, pointerEvents: "none" }}
      >
        <div ref={fullPageRef} style={{ width: paper.widthPx, height: paper.heightPx }}>
          <LetterheadPageContent data={data} paper={paper} />
        </div>
        <div ref={headerOnlyRef} style={{ width: paper.widthPx, display: "inline-block" }}>
          <div style={{ padding: `${paddingY}px ${paddingX}px`, background: "transparent" }}>
            <TemplateHeader data={data} paddingX={paddingX} paddingY={paddingY} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportButton({
  icon: Icon,
  label,
  hint,
  busy,
  disabled,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="flex w-full flex-col items-start gap-2 rounded-2xl border border-surface-200 bg-white px-3.5 py-3 text-left transition hover:border-surface-300 disabled:opacity-60 dark:border-surface-800 dark:bg-surface-900"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
        </span>
        {label}
      </span>
      <span className="text-[11px] leading-snug text-surface-500 dark:text-surface-400">{hint}</span>
    </button>
  );
}

// ── Shared helpers ───────────────────────────────────────────────────────

function exportFileName(data: LetterheadData, ext: string, suffix = ""): string {
  const base = data.companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base ? `${base}-letterhead` : "letterhead"}${suffix}.${ext}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime));
}

interface LoadedImage {
  dataUrl: string;
  bytes: Uint8Array;
  width: number;
  height: number;
}

/**
 * Fetch a (possibly cross-origin) logo URL and re-encode it as PNG on a
 * canvas — normalizes any source format (jpg/webp/png) to one docx and
 * jsPDF both handle unconditionally, and preserves transparency. Reads
 * through a same-origin blob: URL rather than hot-linking the remote URL
 * into an <img crossOrigin>, so this works even when the host doesn't
 * send CORS headers for canvas reads (it still needs to allow the
 * initial fetch — Supabase's public bucket does). Returns null on any
 * failure so callers can render without a logo instead of aborting the
 * whole export.
 */
async function loadImageAsPng(url: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new window.Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Image decode failed"));
        el.src = objectUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0 || canvas.height === 0) return null;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      return { dataUrl, bytes: dataUrlToBytes(dataUrl), width: canvas.width, height: canvas.height };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getLogoImage(
  url: string,
  cache: Map<string, LoadedImage | null>
): Promise<LoadedImage | null> {
  if (cache.has(url)) return cache.get(url) ?? null;
  const img = await loadImageAsPng(url);
  cache.set(url, img);
  return img;
}

function hex(color: string): string {
  return color.replace(/^#/, "").toUpperCase();
}

// ── Word (.docx) export ──────────────────────────────────────────────────
//
// docx is loaded dynamically (see handleWord above); its exports are
// passed in as `docx` here rather than imported statically at module
// scope, so this whole module stays tree-shakeable out of the initial
// bundle. Every piece of user text is passed as TextRun.text — the docx
// library XML-escapes run content when it serializes the document, so
// special characters ( & < > " ' ) are handled automatically without any
// manual escaping in this file.

type DocxModule = typeof import("docx");

async function buildWordBlob(data: LetterheadData, docx: DocxModule): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ImageRun,
    Header,
    Footer,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    BorderStyle,
    WidthType,
    TableBorders,
    convertMillimetersToTwip,
  } = docx;

  const paper = PAPER_SIZES_BY_ID[data.paperSize];
  const fontName = DOC_SAFE_FONTS_BY_NAME[data.font]?.name ?? DEFAULT_FONT;
  const imageCache = new Map<string, LoadedImage | null>();

  const headerModel = buildHeaderModel(data);
  const footerModel = buildFooterModel(data);

  const alignmentFor = (align: HFAlign) =>
    align === "center" ? AlignmentType.CENTER : align === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT;

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const ruleBorder = (color: string, thicknessPt: number) => ({
    style: BorderStyle.SINGLE,
    size: Math.max(2, Math.round(thicknessPt * 8)),
    color: hex(color),
  });

  async function textRunsFor(block: HeaderFooterTextBlock) {
    return new TextRun({
      text: block.text,
      bold: block.bold,
      color: hex(block.color),
      size: Math.round(block.size * 2),
      font: fontName,
    });
  }

  /**
   * Builds one paragraph per "line" a column renders (image, then one
   * per text block — or image+first-text-block sharing a line when
   * `layout: "inline"`). `borderBelow`, when given, is baked into the
   * LAST paragraph's own `border` option at construction time — docx's
   * Paragraph has no way to mutate a border after the fact, so the
   * caller must decide up front whether this column's row ends in a
   * rule and pass it in rather than patching afterward.
   */
  async function columnToParagraphs(
    col: HeaderFooterColumn,
    background: string | null | undefined,
    borderBelow: ReturnType<typeof ruleBorder> | undefined
  ) {
    const alignment = alignmentFor(col.align);
    const shading = background ? { fill: hex(background) } : undefined;
    const lines: (InstanceType<typeof TextRun> | InstanceType<typeof ImageRun>)[][] = [];
    // Index of the paragraph that holds ONLY the logo image (stack layout) —
    // gets a tight spacing-after override so it doesn't inherit Word's
    // default paragraph gap before the text that follows it.
    let imageOwnLineIndex = -1;

    if (col.logo) {
      const img = await getLogoImage(col.logo.url, imageCache);
      if (img) {
        const heightPx = mmToPx(col.logo.heightMm);
        const widthPx = Math.round(heightPx * (img.width / img.height));
        const imageRun = new ImageRun({
          type: "png",
          data: img.bytes,
          transformation: { width: widthPx, height: heightPx },
        });

        if (col.layout === "inline" && col.textBlocks[0]) {
          const [first, ...rest] = col.textBlocks;
          lines.push([imageRun, new TextRun({ text: " " }), await textRunsFor(first)]);
          for (const block of rest) lines.push([await textRunsFor(block)]);
        } else {
          imageOwnLineIndex = 0;
          lines.push([imageRun]);
          for (const block of col.textBlocks) lines.push([await textRunsFor(block)]);
        }
      } else {
        for (const block of col.textBlocks) lines.push([await textRunsFor(block)]);
      }
    } else {
      for (const block of col.textBlocks) lines.push([await textRunsFor(block)]);
    }

    if (lines.length === 0) lines.push([]);

    return lines.map(
      (children, i) =>
        new Paragraph({
          alignment,
          shading,
          spacing: i === imageOwnLineIndex ? { after: 20 } : undefined,
          border: i === lines.length - 1 && borderBelow ? { bottom: borderBelow } : undefined,
          children,
        })
    );
  }

  async function modelToChildren(model: HeaderFooterModel) {
    const out: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

    for (const row of model.rows) {
      const spacing = {
        before: Math.round((row.spaceBeforePt ?? 0) * 20),
        after: Math.round((row.spaceAfterPt ?? (row.ruleBelow ? 40 : 20))),
      };
      const borderBelow = row.ruleBelow ? ruleBorder(row.ruleBelow.color, row.ruleBelow.thickness) : undefined;

      if (row.columns.length === 0) {
        out.push(new Paragraph({ spacing, border: borderBelow ? { bottom: borderBelow } : undefined, children: [] }));
        continue;
      }

      if (row.columns.length === 1) {
        out.push(...(await columnToParagraphs(row.columns[0], row.background, borderBelow)));
        continue;
      }

      const totalWeight = row.columns.reduce((sum, col) => sum + (col.width ?? 1), 0);
      const cells = await Promise.all(
        row.columns.map(async (col) => {
          const paragraphs = await columnToParagraphs(col, row.background, undefined);
          return new TableCell({
            width: {
              size: Math.round(((col.width ?? 1) / totalWeight) * 100),
              type: WidthType.PERCENTAGE,
            },
            borders: row.ruleBelow
              ? { top: noBorder, left: noBorder, right: noBorder, bottom: ruleBorder(row.ruleBelow.color, row.ruleBelow.thickness) }
              : { top: noBorder, left: noBorder, right: noBorder, bottom: noBorder },
            children: paragraphs,
          });
        })
      );
      out.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: TableBorders.NONE,
          rows: [new TableRow({ children: cells })],
        })
      );
    }

    return out;
  }

  const headerChildren = await modelToChildren(headerModel);
  const footerChildren = footerModel.rows.length > 0 ? await modelToChildren(footerModel) : [];
  const bodyChildren = data.includeBodyPlaceholder
    ? buildBodyPlaceholderParagraphs(fontName, Paragraph, TextRun)
    : [new Paragraph({})];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(paper.widthMm),
              height: convertMillimetersToTwip(paper.heightMm),
            },
            margin: {
              top: convertMillimetersToTwip(HEADER_MARGIN_MM),
              bottom: convertMillimetersToTwip(PAGE_MARGIN_MM),
              left: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(25),
              header: convertMillimetersToTwip(HEADER_OFFSET_MM),
              footer: convertMillimetersToTwip(FOOTER_OFFSET_MM),
            },
          },
        },
        headers: {
          default: new Header({ children: headerChildren.length ? headerChildren : [new Paragraph({})] }),
        },
        footers: footerChildren.length > 0 ? { default: new Footer({ children: footerChildren }) } : undefined,
        children: bodyChildren,
      },
    ],
  });

  return Packer.toBlob(doc);
}

function buildBodyPlaceholderParagraphs(
  fontName: string,
  Paragraph: DocxModule["Paragraph"],
  TextRun: DocxModule["TextRun"]
) {
  const muted = "6B7280";
  const faint = "D1D5DB";
  const mk = (text: string, color: string, before = 0) =>
    new Paragraph({
      spacing: { before, after: 40 },
      children: [new TextRun({ text, color, size: 23, font: fontName })],
    });
  return [
    mk("January 1, 2026", muted),
    mk("Recipient Name", muted, 200),
    mk("Recipient Company", muted),
    mk("Recipient Address", muted),
    mk("Dear [Recipient Name],", muted, 200),
    mk(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      faint,
      160
    ),
    mk(
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      faint,
      120
    ),
    mk("Sincerely,", muted, 200),
    mk("[Your Name]", muted, 200),
  ];
}

// ── PDF export ───────────────────────────────────────────────────────────
//
// jsPDF has no arbitrary-font-embedding without shipping a converted TTF,
// so DOC_SAFE_FONTS map onto jsPDF's built-in Helvetica/Times families
// here — Word gets the real font (see buildWordBlob above); PDF gets the
// closest built-in. Positions are computed by walking the same
// HeaderFooterModel rows top-down (header) and bottom-up (footer, via a
// measure-then-place pass) that the Word exporter walks.

type JsPdfCtor = typeof import("jspdf").jsPDF;
type JsPdfInstance = InstanceType<JsPdfCtor>;

function pdfFontFamily(fontName: string): "helvetica" | "times" {
  return ["Times New Roman", "Georgia", "Garamond", "Cambria"].includes(fontName) ? "times" : "helvetica";
}

function textBlockHeightMm(block: Pick<HeaderFooterTextBlock, "size">): number {
  return block.size * PT_TO_MM * 1.4;
}

function columnContentHeightMm(col: HeaderFooterColumn): number {
  const textHeight = col.textBlocks.reduce((sum, b) => sum + textBlockHeightMm(b), 0);
  if (!col.logo) return textHeight;
  if (col.layout === "inline") return Math.max(col.logo.heightMm, textHeight);
  return col.logo.heightMm + 1.5 + textHeight;
}

function rowHeightMm(row: HeaderFooterRow): number {
  const contentHeight = row.columns.length > 0 ? Math.max(...row.columns.map(columnContentHeightMm)) : 0;
  const before = (row.spaceBeforePt ?? 0) * PT_TO_MM;
  const after = (row.spaceAfterPt ?? (row.ruleBelow ? 3 : 2)) * PT_TO_MM;
  const rulePad = row.ruleBelow ? 2.4 : 0;
  return before + contentHeight + rulePad + after;
}

function measureModelHeightMm(model: HeaderFooterModel): number {
  return model.rows.reduce((sum, row) => sum + rowHeightMm(row), 0);
}

async function drawColumnPdf(
  doc: JsPdfInstance,
  col: HeaderFooterColumn,
  opts: {
    x: number;
    width: number;
    y: number;
    fontFamily: string;
    imageCache: Map<string, LoadedImage | null>;
  }
): Promise<void> {
  let textX = opts.x;
  let textWidth = opts.width;
  let textY = opts.y;

  if (col.logo) {
    const img = await getLogoImage(col.logo.url, opts.imageCache);
    if (img) {
      const h = col.logo.heightMm;
      const w = h * (img.width / img.height);
      const logoX =
        col.align === "right"
          ? opts.x + opts.width - w
          : col.align === "center"
            ? opts.x + (opts.width - w) / 2
            : opts.x;
      doc.addImage(img.dataUrl, "PNG", logoX, opts.y, w, h);
      if (col.layout === "inline") {
        textX = logoX + w + 1.5;
        textWidth = opts.width - (logoX + w + 1.5 - opts.x);
        textY = opts.y + h / 2 + 1.2;
      } else {
        textY = opts.y + h + 1.5;
      }
    }
  }

  if (col.textBlocks.length === 0) return;
  const align = col.align === "center" ? "center" : col.align === "right" ? "right" : "left";
  const drawX = col.align === "center" ? textX + textWidth / 2 : col.align === "right" ? textX + textWidth : textX;

  for (const block of col.textBlocks) {
    textY += textBlockHeightMm(block) * 0.78;
    doc.setFont(opts.fontFamily, block.bold ? "bold" : "normal");
    doc.setFontSize(block.size);
    doc.setTextColor(block.color);
    doc.text(block.text, drawX, textY, { align, maxWidth: textWidth });
    textY += textBlockHeightMm(block) * 0.22;
  }
}

async function drawModelPdf(
  doc: JsPdfInstance,
  model: HeaderFooterModel,
  opts: { xLeft: number; xRight: number; y: number; fontFamily: string; imageCache: Map<string, LoadedImage | null> }
): Promise<number> {
  let y = opts.y;
  const totalWidth = opts.xRight - opts.xLeft;

  for (const row of model.rows) {
    y += (row.spaceBeforePt ?? 0) * PT_TO_MM;
    const contentHeight = row.columns.length > 0 ? Math.max(...row.columns.map(columnContentHeightMm)) : 0;

    if (row.background) {
      doc.setFillColor(row.background);
      doc.rect(opts.xLeft, y - 1.5, totalWidth, contentHeight + 3, "F");
    }

    if (row.columns.length > 0) {
      const totalWeight = row.columns.reduce((sum, col) => sum + (col.width ?? 1), 0);
      const gap = 4;
      const usableWidth = totalWidth - gap * (row.columns.length - 1);
      let cx = opts.xLeft;
      for (const col of row.columns) {
        const colWidth = usableWidth * ((col.width ?? 1) / totalWeight);
        await drawColumnPdf(doc, col, {
          x: cx,
          width: colWidth,
          y,
          fontFamily: opts.fontFamily,
          imageCache: opts.imageCache,
        });
        cx += colWidth + gap;
      }
    }

    y += contentHeight;

    if (row.ruleBelow) {
      y += 1.2;
      doc.setDrawColor(row.ruleBelow.color);
      doc.setLineWidth(Math.max(0.15, row.ruleBelow.thickness * PT_TO_MM));
      doc.line(opts.xLeft, y, opts.xRight, y);
      y += 1.2;
    }

    y += (row.spaceAfterPt ?? 2) * PT_TO_MM;
  }

  return y;
}

function drawBodyPlaceholderPdf(
  doc: JsPdfInstance,
  opts: { x: number; y: number; width: number; fontFamily: string }
): void {
  let y = opts.y;
  const line = (text: string, size: number, color: string, gapBefore: number) => {
    y += gapBefore;
    doc.setFont(opts.fontFamily, "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, opts.width) as string[];
    doc.text(lines, opts.x, y);
    y += lines.length * size * PT_TO_MM * 1.4;
  };
  line("January 1, 2026", 10.5, "#6B7280", 4);
  line("Recipient Name", 10.5, "#6B7280", 8);
  line("Recipient Company", 10.5, "#6B7280", 1);
  line("Recipient Address", 10.5, "#6B7280", 1);
  line("Dear [Recipient Name],", 10.5, "#6B7280", 8);
  line(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    10.5,
    "#D1D5DB",
    6
  );
  line(
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    10.5,
    "#D1D5DB",
    4
  );
  line("Sincerely,", 10.5, "#6B7280", 8);
  line("[Your Name]", 10.5, "#6B7280", 8);
}

async function buildPdfDocument(JsPDF: JsPdfCtor, data: LetterheadData): Promise<JsPdfInstance> {
  const paper = PAPER_SIZES_BY_ID[data.paperSize];
  const fontFamily = pdfFontFamily(DOC_SAFE_FONTS_BY_NAME[data.font]?.name ?? DEFAULT_FONT);
  const doc = new JsPDF({ unit: "mm", format: [paper.widthMm, paper.heightMm] });
  doc.setFont(fontFamily, "normal");

  const imageCache = new Map<string, LoadedImage | null>();
  const headerModel = buildHeaderModel(data);
  const footerModel = buildFooterModel(data);
  const xLeft = PAGE_MARGIN_MM;
  const xRight = paper.widthMm - PAGE_MARGIN_MM;

  const afterHeaderY = await drawModelPdf(doc, headerModel, {
    xLeft,
    xRight,
    y: HEADER_OFFSET_MM,
    fontFamily,
    imageCache,
  });

  if (data.includeBodyPlaceholder) {
    drawBodyPlaceholderPdf(doc, { x: xLeft, y: afterHeaderY + 6, width: xRight - xLeft, fontFamily });
  }

  if (footerModel.rows.length > 0) {
    const footerHeight = measureModelHeightMm(footerModel);
    const footerY = paper.heightMm - FOOTER_OFFSET_MM - footerHeight;
    await drawModelPdf(doc, footerModel, {
      xLeft,
      xRight,
      y: Math.max(afterHeaderY + 4, footerY),
      fontFamily,
      imageCache,
    });
  }

  return doc;
}
