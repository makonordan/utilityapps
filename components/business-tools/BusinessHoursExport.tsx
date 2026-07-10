"use client";

import { useState } from "react";
import { AlertTriangle, FileType, Image as ImageIcon, Loader2, Printer } from "lucide-react";

import {
  DAY_LABELS,
  SIGN_PADDING_X_FRACTION,
  SIGN_PADDING_Y_FRACTION,
  SIGN_SIZES_BY_ID,
  computeOpenStatus,
  formatTime12h,
  type BusinessHoursData,
} from "@/lib/businessHours";

/**
 * Download/print bar for the Business Hours Sign Generator. Three
 * formats, all generated 100% client-side — nothing is uploaded except
 * the logo (handled separately, at edit time, by LogoPicker in
 * BusinessHoursSign.tsx).
 *
 * PDF is drawn by hand with jsPDF at the chosen sign size's real mm
 * dimensions — it's a simplified, template-aware approximation of the
 * on-screen preview (colored band for modern-card, a giant OPEN/CLOSED
 * word for bold-open-closed, a short centered rule for elegant) rather
 * than a pixel-identical replica, the same approach ReceiptExport.tsx
 * and PurchaseOrderExport.tsx take for their own PDFs. PNG and Print
 * both operate on the SAME live preview DOM node (`paperRef`, the
 * #business-hours-print-area div rendered by BusinessHoursSign's
 * PreviewPanel) so both outputs always match exactly what's on screen:
 * PNG via html2canvas, Print via a scoped @media print stylesheet that
 * hides everything else on the page — for the Square sign size this
 * naturally prints/exports as a square, since it's just capturing
 * whatever aspect ratio the preview element already is.
 *
 * jspdf, html2canvas, and file-saver are all dynamically imported inside
 * their handlers, matching the lazy-import convention used by
 * ReceiptExport.tsx/PurchaseOrderExport.tsx elsewhere in this codebase,
 * so visitors who never click "download" never pay for the bundle
 * weight.
 */

type ExportKind = "pdf" | "png" | "print";

const IMAGE_FILE_NAME = "business-hours-sign.png";
const PDF_FILE_NAME = "business-hours-sign.pdf";

// ── Component ────────────────────────────────────────────────────────────

export function BusinessHoursExport({
  data,
  paperRef,
}: {
  data: BusinessHoursData;
  paperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canExport = data.businessName.trim().length > 0;

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

  const handlePdf = () =>
    withBusy("pdf", async () => {
      const { default: JsPDF } = await import("jspdf");
      const doc = await buildBusinessHoursPdf(JsPDF, data);
      doc.save(PDF_FILE_NAME);
    });

  const handleImage = () =>
    withBusy("png", async () => {
      const el = paperRef.current;
      if (!el) throw new Error("Preview not ready — try again");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        // scale:3 keeps the PNG crisp regardless of on-screen size. The
        // captured element is whatever aspect ratio the chosen sign size
        // is (square, portrait A4, etc.), so Square exports square.
        scale: 3,
        useCORS: true,
        backgroundColor: data.backgroundColor || "#ffffff",
        logging: false,
      });
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("PNG encode failed");
      const { saveAs } = await import("file-saver");
      saveAs(blob, IMAGE_FILE_NAME);
    });

  const handlePrint = () =>
    withBusy("print", async () => {
      window.print();
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
          icon={ImageIcon}
          label="Download Image (PNG)"
          hint="Post it, or print it yourself"
          busy={busy === "png"}
          disabled={!canExport}
          onClick={handleImage}
        />
        <ExportButton
          icon={FileType}
          label="Download PDF"
          hint="Print-ready at your chosen sign size"
          busy={busy === "pdf"}
          disabled={!canExport}
          onClick={handlePdf}
        />
        <ExportButton
          icon={Printer}
          label="Print"
          hint="Opens your browser's print dialog"
          busy={busy === "print"}
          disabled={!canExport}
          onClick={handlePrint}
        />
      </div>

      {!canExport && (
        <p className="mt-3 text-[11px] text-surface-500 dark:text-surface-400">
          Add a business name above to enable downloads.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Print isolation: when the browser's print dialog renders the
          page, hide everything except #business-hours-print-area (the
          live preview element BusinessHoursSign attaches paperRef to). */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #business-hours-print-area, #business-hours-print-area * { visibility: visible; }
          #business-hours-print-area {
            position: fixed;
            inset: 0;
            margin: 0 auto;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
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

function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime));
}

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Fetch a (possibly cross-origin) logo URL and re-encode it as PNG on a
 * canvas — reads through a same-origin blob: URL rather than hot-linking
 * the remote URL into an <img crossOrigin>, so this works even when the
 * host doesn't send CORS headers for canvas reads (it still needs to
 * allow the initial fetch — Supabase's public bucket does). Returns null
 * on any failure so the PDF still generates, just without the logo.
 */
async function loadLogoAsPng(url: string): Promise<LoadedImage | null> {
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
      return { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16) || 0;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// ── PDF export ───────────────────────────────────────────────────────────
//
// Hand-drawn with jsPDF (positions in mm) at the chosen sign size's real
// physical dimensions. Every measurement is derived from the paper's own
// widthMm so the layout scales sensibly across A4, Letter, A5, and the
// square format.

type JsPdfCtor = typeof import("jspdf").jsPDF;
type JsPdfInstance = InstanceType<JsPdfCtor>;

function drawStatusWord(
  doc: JsPdfInstance,
  isOpen: boolean,
  x: number,
  y: number,
  align: "left" | "center" | "right"
) {
  const [r, g, b] = isOpen ? [21, 128, 61] : [185, 28, 28];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(r, g, b);
  doc.text(isOpen ? "● OPEN NOW" : "● CLOSED", x, y, { align });
}

async function buildBusinessHoursPdf(JsPDF: JsPdfCtor, data: BusinessHoursData): Promise<JsPdfInstance> {
  const size = SIGN_SIZES_BY_ID[data.paperSize];
  const widthMm = size.widthMm;
  const heightMm = size.heightMm;
  const marginX = widthMm * SIGN_PADDING_X_FRACTION;
  const marginY = heightMm * SIGN_PADDING_Y_FRACTION;
  const contentWidth = widthMm - marginX * 2;
  const centerX = widthMm / 2;

  const doc = new JsPDF({ unit: "mm", format: [widthMm, heightMm] });

  const [pr, pg, pb] = hexToRgb(data.primaryColor);
  const [ar, ag, ab] = hexToRgb(data.accentColor);
  const [br, bgG, bb] = hexToRgb(data.backgroundColor || "#FFFFFF");

  doc.setFillColor(br, bgG, bb);
  doc.rect(0, 0, widthMm, heightMm, "F");

  const status = computeOpenStatus(data.days);
  const showBadge = data.currentStatusMode !== "hidden";
  const isOpen = data.currentStatusMode === "auto" ? status.isOpenNow : data.currentStatusMode === "open";

  const isModern = data.template === "modern-card";
  const isBold = data.template === "bold-open-closed";
  const isElegant = data.template === "elegant";

  let y = marginY;

  if (isModern) {
    const bandHeight = heightMm * 0.15;
    doc.setFillColor(pr, pg, pb);
    doc.rect(0, 0, widthMm, bandHeight, "F");

    let logoW = 0;
    if (data.logoUrl) {
      const img = await loadLogoAsPng(data.logoUrl);
      if (img) {
        const h = bandHeight * 0.5;
        const w = h * (img.width / img.height);
        doc.addImage(img.dataUrl, "PNG", marginX, bandHeight / 2 - h / 2, w, h);
        logoW = w + 4;
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(widthMm * 0.075);
    doc.setTextColor(255, 255, 255);
    doc.text(data.businessName || "Your Business Name", marginX + logoW, bandHeight / 2 + 1, {
      maxWidth: contentWidth - logoW - 30,
    });
    if (data.tagline) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(widthMm * 0.035);
      doc.text(data.tagline, marginX + logoW, bandHeight / 2 + 6, { maxWidth: contentWidth - logoW - 30 });
    }
    if (showBadge) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(isOpen ? "● OPEN NOW" : "● CLOSED", widthMm - marginX, bandHeight / 2 + 1.5, { align: "right" });
    }
    y = bandHeight + marginY * 0.7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(widthMm * 0.03);
    doc.setTextColor(ar, ag, ab);
    doc.text(data.headerText.toUpperCase(), marginX, y);
    y += 6;
  } else {
    if (data.logoUrl) {
      const img = await loadLogoAsPng(data.logoUrl);
      if (img) {
        const h = widthMm * 0.09;
        const w = h * (img.width / img.height);
        doc.addImage(img.dataUrl, "PNG", centerX - w / 2, y, w, h);
        y += h + 3;
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(isBold ? widthMm * 0.04 : widthMm * 0.065);
    doc.setTextColor(17, 24, 39);
    doc.text(data.businessName || "Your Business Name", centerX, y + 5, { align: "center", maxWidth: contentWidth });
    y += isBold ? 7 : 9;

    if (data.tagline && !isBold) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(widthMm * 0.032);
      doc.setTextColor(107, 114, 128);
      doc.text(data.tagline, centerX, y, { align: "center", maxWidth: contentWidth });
      y += 6;
    }

    if (isBold) {
      const word = showBadge ? (isOpen ? "OPEN" : "CLOSED") : data.headerText.toUpperCase();
      const wordRgb: [number, number, number] = showBadge ? (isOpen ? [22, 163, 74] : [220, 38, 38]) : [pr, pg, pb];
      doc.setFont("helvetica", "bold");
      doc.setFontSize(widthMm * 0.15);
      doc.setTextColor(wordRgb[0], wordRgb[1], wordRgb[2]);
      y += widthMm * 0.11;
      doc.text(word, centerX, y, { align: "center" });
      y += 6;
      if (showBadge && data.currentStatusMode === "auto") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(widthMm * 0.028);
        doc.setTextColor(107, 114, 128);
        doc.text(status.nextChange, centerX, y, { align: "center" });
        y += 6;
      }
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(marginX, y, widthMm - marginX, y);
      y += 6;
    } else {
      if (showBadge) {
        drawStatusWord(doc, isOpen, centerX, y, "center");
        y += 6;
      }
      if (isElegant) {
        doc.setDrawColor(ar, ag, ab);
        doc.setLineWidth(0.3);
        doc.line(centerX - 8, y, centerX + 8, y);
        y += 7;
      } else {
        doc.setDrawColor(pr, pg, pb);
        doc.setLineWidth(0.6);
        doc.line(marginX, y, widthMm - marginX, y);
        y += 6;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(widthMm * 0.032);
      doc.setTextColor(pr, pg, pb);
      doc.text(data.headerText.toUpperCase(), centerX, y, { align: "center" });
      y += 7;
    }
  }

  // Days list — centered column, capped at 70% of content width so it
  // reads as a tidy list even on the wide Letter/A4 sizes.
  const listWidth = Math.min(contentWidth, widthMm * 0.7);
  const listX = centerX - listWidth / 2;
  const rowHeight = Math.max(6, widthMm * 0.045);

  for (const d of data.days) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(widthMm * 0.03);
    doc.setTextColor(17, 24, 39);
    doc.text(DAY_LABELS[d.day], listX, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(widthMm * 0.03);
    doc.setTextColor(75, 85, 99);
    const hoursText = d.isOpen ? `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}` : "Closed";
    doc.text(hoursText, listX + listWidth, y, { align: "right" });

    if (d.note) {
      y += rowHeight * 0.55;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(widthMm * 0.024);
      doc.setTextColor(156, 163, 175);
      doc.text(d.note, listX + listWidth, y, { align: "right" });
      y += rowHeight * 0.65;
    } else {
      y += rowHeight;
    }
  }

  return doc;
}
