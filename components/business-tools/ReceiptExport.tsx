"use client";

import { useState } from "react";
import { AlertTriangle, FileType, Image as ImageIcon, Loader2, Printer } from "lucide-react";

import { computeTotals, formatCurrency, type ReceiptData } from "@/lib/receipt";

/**
 * Download/print bar for the Receipt Generator. Three formats, all
 * generated 100% client-side — nothing is uploaded except the logo
 * (handled separately, at edit time, by LogoPicker in
 * ReceiptGenerator.tsx).
 *
 * PDF is drawn by hand with jsPDF + jspdf-autotable, since (unlike the
 * Letterhead tool) lib/receipt.ts has no per-template header/footer
 * model to walk — the layout math lives entirely in buildReceiptPdf
 * below. PNG and Print both operate on the SAME live preview DOM node
 * (`paperRef`, the #receipt-print-area div rendered by
 * ReceiptGenerator's PreviewPanel) so both outputs always match exactly
 * what's on screen: PNG via html2canvas, Print via a scoped @media
 * print stylesheet that hides everything else on the page.
 *
 * jspdf, jspdf-autotable, html2canvas, and file-saver are all
 * dynamically imported inside their handlers, matching the lazy-import
 * convention used by LetterheadExport.tsx/InvoiceGenerator.tsx
 * elsewhere in this codebase, so visitors who never click "download"
 * never pay for the bundle weight.
 */

type ExportKind = "pdf" | "png" | "print";

// ── Component ────────────────────────────────────────────────────────────

export function ReceiptExport({
  data,
  paperRef,
}: {
  data: ReceiptData;
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
      const [{ default: JsPDF }, autoTableModule] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = (autoTableModule.default ??
        (autoTableModule as unknown as { autoTable: typeof autoTableModule.default })
          .autoTable) as typeof autoTableModule.default;
      const doc = await buildReceiptPdf(JsPDF, autoTable, data);
      doc.save(exportFileName(data, "pdf"));
    });

  const handleImage = () =>
    withBusy("png", async () => {
      const el = paperRef.current;
      if (!el) throw new Error("Preview not ready — try again");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        // scale:3 keeps the PNG crisp regardless of on-screen size.
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("PNG encode failed");
      const { saveAs } = await import("file-saver");
      saveAs(blob, exportFileName(data, "png"));
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
          icon={FileType}
          label="Download PDF"
          hint="Print-ready — 80mm strip for Thermal, A4 otherwise"
          busy={busy === "pdf"}
          disabled={!canExport}
          onClick={handlePdf}
        />
        <ExportButton
          icon={ImageIcon}
          label="Download Image (PNG)"
          hint="Share as a photo or attach to a message"
          busy={busy === "png"}
          disabled={!canExport}
          onClick={handleImage}
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
          page, hide everything except #receipt-print-area (the live
          preview element ReceiptGenerator attaches paperRef to). */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area {
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

function exportFileName(data: ReceiptData, ext: string): string {
  const base = (data.receiptNumber || "receipt")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `receipt-${base || "receipt"}.${ext}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime));
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
// Hand-drawn with jsPDF + jspdf-autotable (positions in mm). Two page
// shapes: a standard A4 sheet for classic/modern/minimal, and an 80mm-
// wide strip sized to the content for thermal (POS printers feed
// continuous paper, so there's no fixed page height to match — see
// estimateThermalHeightMm).

type JsPdfCtor = typeof import("jspdf").jsPDF;
type JsPdfInstance = InstanceType<JsPdfCtor>;
type AutoTableFn = typeof import("jspdf-autotable").default;

function estimateThermalHeightMm(data: ReceiptData): number {
  const base = 55;
  const perItem = 5;
  const extra =
    (data.logoUrl ? 14 : 0) +
    (data.customerName || data.customerContact ? 12 : 0) +
    (data.notes ? 8 : 0) +
    (data.footerText ? 8 : 0);
  return Math.max(120, base + data.lineItems.length * perItem + extra);
}

async function buildReceiptPdf(
  JsPDF: JsPdfCtor,
  autoTable: AutoTableFn,
  data: ReceiptData
): Promise<JsPdfInstance> {
  const totals = computeTotals(data);
  const isThermal = data.template === "thermal";
  const width = isThermal ? 80 : 210;
  const height = isThermal ? estimateThermalHeightMm(data) : 297;
  const doc = new JsPDF({ unit: "mm", format: isThermal ? [width, height] : "a4" });

  const margin = isThermal ? 4 : 15;
  const contentWidth = width - margin * 2;
  const centered = isThermal || data.template === "classic";
  const align = centered ? "center" : "left";
  const textX = centered ? width / 2 : margin;
  const [r, g, b] = hexToRgb(data.primaryColor);

  let y = margin + (isThermal ? 2 : 0);

  // Logo
  if (data.logoUrl) {
    const img = await loadLogoAsPng(data.logoUrl);
    if (img) {
      const h = isThermal ? 12 : 16;
      const w = h * (img.width / img.height);
      const x = centered ? (width - w) / 2 : margin;
      doc.addImage(img.dataUrl, "PNG", x, y, w, h);
      y += h + 3;
    }
  }

  // Business name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isThermal ? 11 : 16);
  doc.setTextColor(15, 23, 42);
  doc.text(data.businessName || "Your Business Name", textX, y + 4, { align, maxWidth: contentWidth });
  y += isThermal ? 6 : 8;

  // Address / contact
  doc.setFont("helvetica", "normal");
  doc.setFontSize(isThermal ? 7.5 : 9.5);
  doc.setTextColor(100, 116, 139);
  const contactLines = [
    data.businessAddress,
    [data.businessPhone, data.businessEmail].filter(Boolean).join("   ·   "),
  ].filter(Boolean);
  for (const line of contactLines) {
    doc.text(line, textX, y, { align, maxWidth: contentWidth });
    y += isThermal ? 3.5 : 4.5;
  }

  y += 2;
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(isThermal ? 0.2 : 0.4);
  doc.line(margin, y, width - margin, y);
  y += isThermal ? 4 : 6;

  // Receipt # + date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(isThermal ? 7.5 : 9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Receipt #${data.receiptNumber || "-"}`, margin, y);
  doc.text(formatDate(data.dateIssued), width - margin, y, { align: "right" });
  y += isThermal ? 5 : 7;

  // Customer
  if (data.customerName || data.customerContact) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Customer", margin, y);
    y += isThermal ? 3.5 : 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    if (data.customerName) {
      doc.text(data.customerName, margin, y);
      y += isThermal ? 3.5 : 5;
    }
    if (data.customerContact) {
      doc.text(data.customerContact, margin, y);
      y += isThermal ? 3.5 : 5;
    }
    y += 1;
  }

  // Line items
  const head = [["Description", "Qty", "Unit price", "Total"]];
  const body = data.lineItems.map((li) => [
    li.description || "Item",
    String(li.quantity),
    formatCurrency(li.unitPrice, data.currency),
    formatCurrency(li.quantity * li.unitPrice, data.currency),
  ]);

  autoTable(doc, {
    startY: y,
    head,
    body,
    margin: { left: margin, right: margin },
    styles: { font: "helvetica", fontSize: isThermal ? 7 : 9, cellPadding: isThermal ? 1.2 : 2.5 },
    headStyles: { fillColor: [r, g, b], textColor: 255, fontStyle: "bold" },
    columnStyles: isThermal
      ? {
          1: { halign: "right", cellWidth: 8 },
          2: { halign: "right", cellWidth: 15 },
          3: { halign: "right", cellWidth: 15 },
        }
      : {
          1: { halign: "right", cellWidth: 18 },
          2: { halign: "right", cellWidth: 32 },
          3: { halign: "right", cellWidth: 32 },
        },
  });

  const docWithTable = doc as unknown as { lastAutoTable?: { finalY: number } };
  y = (docWithTable.lastAutoTable?.finalY ?? y + 20) + (isThermal ? 4 : 6);

  // Totals
  const totalsLabelX = isThermal ? margin : width - margin - 55;
  const totalsValueX = width - margin;
  const totalsRow = (label: string, value: string, opts?: { bold?: boolean }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(isThermal ? 7.5 : 9.5);
    doc.setTextColor(opts?.bold ? 15 : 100, opts?.bold ? 23 : 116, opts?.bold ? 42 : 139);
    doc.text(label, totalsLabelX, y);
    doc.setTextColor(15, 23, 42);
    doc.text(value, totalsValueX, y, { align: "right" });
    y += isThermal ? 3.8 : 5.5;
  };

  totalsRow("Subtotal", formatCurrency(totals.subtotal, data.currency));
  if (totals.discountValue > 0) {
    totalsRow(
      data.discountType === "percent" ? `Discount (${data.discountAmount}%)` : "Discount",
      `- ${formatCurrency(totals.discountValue, data.currency)}`
    );
  }
  if (data.taxRatePercent > 0) {
    totalsRow(`Tax (${data.taxRatePercent}%)`, formatCurrency(totals.taxValue, data.currency));
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(totalsLabelX, y, totalsValueX, y);
  y += isThermal ? 3.5 : 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(isThermal ? 9.5 : 13);
  doc.setTextColor(r, g, b);
  doc.text("Total", totalsLabelX, y);
  doc.text(formatCurrency(totals.total, data.currency), totalsValueX, y, { align: "right" });
  y += isThermal ? 5 : 8;

  if (data.amountPaid > 0) totalsRow("Amount paid", formatCurrency(data.amountPaid, data.currency));
  if (totals.changeDue > 0) {
    totalsRow("Change due", formatCurrency(totals.changeDue, data.currency), { bold: true });
  }
  totalsRow("Payment method", data.paymentMethod);

  // Notes / footer
  if (data.notes || data.footerText) {
    y += isThermal ? 2 : 4;
    if (data.notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(isThermal ? 7 : 8.5);
      doc.setTextColor(107, 114, 128);
      const wrapped = doc.splitTextToSize(data.notes, contentWidth) as string[];
      doc.text(wrapped, width / 2, y, { align: "center" });
      y += wrapped.length * (isThermal ? 3.2 : 4);
    }
    if (data.footerText) {
      y += 1.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(isThermal ? 6.5 : 7.5);
      doc.setTextColor(156, 163, 175);
      const wrapped = doc.splitTextToSize(data.footerText, contentWidth) as string[];
      doc.text(wrapped, width / 2, y, { align: "center" });
    }
  }

  return doc;
}
