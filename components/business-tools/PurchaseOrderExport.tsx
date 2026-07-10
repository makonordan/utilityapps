"use client";

import { useState } from "react";
import { AlertTriangle, FileType, Image as ImageIcon, Loader2, Printer } from "lucide-react";

import { computePOTotals, formatCurrency, type PurchaseOrderData } from "@/lib/purchaseOrder";

/**
 * Download/print bar for the Purchase Order Generator. Three formats,
 * all generated 100% client-side — nothing is uploaded except the buyer
 * logo (handled separately, at edit time, by LogoPicker in
 * PurchaseOrderGenerator.tsx).
 *
 * PDF is drawn by hand with jsPDF + jspdf-autotable, since (unlike the
 * Letterhead tool) lib/purchaseOrder.ts has no per-template header/
 * footer model to walk — the layout math lives entirely in
 * buildPurchaseOrderPdf below. Unlike the Receipt Generator, a PO is
 * always a standard A4 sheet — there's no thermal/POS variant. PNG and
 * Print both operate on the SAME live preview DOM node (`paperRef`, the
 * #po-print-area div rendered by PurchaseOrderGenerator's PreviewPanel)
 * so both outputs always match exactly what's on screen: PNG via
 * html2canvas, Print via a scoped @media print stylesheet that hides
 * everything else on the page.
 *
 * jspdf, jspdf-autotable, html2canvas, and file-saver are all
 * dynamically imported inside their handlers, matching the lazy-import
 * convention used by ReceiptExport.tsx/LetterheadExport.tsx elsewhere in
 * this codebase, so visitors who never click "download" never pay for
 * the bundle weight.
 */

type ExportKind = "pdf" | "png" | "print";

// ── Component ────────────────────────────────────────────────────────────

export function PurchaseOrderExport({
  data,
  paperRef,
}: {
  data: PurchaseOrderData;
  paperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canExport = data.buyerName.trim().length > 0 && data.supplierName.trim().length > 0;

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
      const doc = await buildPurchaseOrderPdf(JsPDF, autoTable, data);
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
          hint="Print-ready A4 purchase order"
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
          Add a buyer name and a supplier name above to enable downloads.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Print isolation: when the browser's print dialog renders the
          page, hide everything except #po-print-area (the live preview
          element PurchaseOrderGenerator attaches paperRef to). */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #po-print-area, #po-print-area * { visibility: visible; }
          #po-print-area {
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

function exportFileName(data: PurchaseOrderData, ext: string): string {
  const base = data.poNumber
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `purchase-order-${base || "unnumbered"}.${ext}`;
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
// Hand-drawn with jsPDF + jspdf-autotable (positions in mm), always on a
// standard A4 sheet.

type JsPdfCtor = typeof import("jspdf").jsPDF;
type JsPdfInstance = InstanceType<JsPdfCtor>;
type AutoTableFn = typeof import("jspdf-autotable").default;

async function buildPurchaseOrderPdf(
  JsPDF: JsPdfCtor,
  autoTable: AutoTableFn,
  data: PurchaseOrderData
): Promise<JsPdfInstance> {
  const totals = computePOTotals(data);
  const width = 210;
  const margin = 15;
  const contentWidth = width - margin * 2;
  const [r, g, b] = hexToRgb(data.primaryColor);
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  let y = margin;

  // Logo (top-left).
  if (data.buyerLogoUrl) {
    const img = await loadLogoAsPng(data.buyerLogoUrl);
    if (img) {
      const h = 16;
      const w = h * (img.width / img.height);
      doc.addImage(img.dataUrl, "PNG", margin, y, w, h);
    }
  }

  // "PURCHASE ORDER" heading + PO # (top-right).
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(r, g, b);
  doc.text("PURCHASE ORDER", width - margin, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`# ${data.poNumber || "-"}`, width - margin, y + 14, { align: "right" });
  doc.text(`PO date: ${formatDate(data.poDate) || "-"}`, width - margin, y + 20, { align: "right" });
  if (data.expectedDeliveryDate) {
    doc.text(`Expected delivery: ${formatDate(data.expectedDeliveryDate)}`, width - margin, y + 26, {
      align: "right",
    });
  }

  y += 34;

  // Buyer name under the logo.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(data.buyerName || "Your Company", margin, y);
  y += 6;

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.5);
  doc.line(margin, y, width - margin, y);
  y += 8;

  // Buyer / Supplier two-column blocks.
  const colWidth = (contentWidth - 16) / 2;
  const buyerX = margin;
  const supplierX = margin + colWidth + 16;
  const blockTopY = y;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("BUYER", buyerX, y);
  doc.text("SUPPLIER", supplierX, y);
  y += 6;

  const buyerLines = [
    data.buyerAddress,
    [data.buyerPhone, data.buyerEmail].filter(Boolean).join("   ·   "),
  ].filter(Boolean);
  const supplierLines = [
    data.supplierName || "Supplier Name",
    data.supplierAddress,
    [data.supplierPhone, data.supplierEmail].filter(Boolean).join("   ·   "),
  ].filter(Boolean);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  buyerLines.forEach((line, i) => doc.text(line, buyerX, y + i * 5, { maxWidth: colWidth }));
  doc.setFont("helvetica", "bold");
  doc.text(supplierLines[0] ?? "Supplier Name", supplierX, y, { maxWidth: colWidth });
  doc.setFont("helvetica", "normal");
  supplierLines.slice(1).forEach((line, i) => doc.text(line, supplierX, y + (i + 1) * 5, { maxWidth: colWidth }));

  y = blockTopY + 6 + Math.max(buyerLines.length, supplierLines.length) * 5 + 6;

  // Ship to (optional).
  if (data.shippingAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("SHIP TO", margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const wrapped = doc.splitTextToSize(data.shippingAddress, contentWidth) as string[];
    doc.text(wrapped, margin, y);
    y += wrapped.length * 5 + 4;
  }
  if (data.shippingMethod) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Shipping method: ${data.shippingMethod}`, margin, y);
    y += 6;
  }

  y += 4;

  // Line items.
  const head = [["Description", "SKU", "Qty", "Unit price", "Total"]];
  const body = data.lineItems.map((li) => [
    li.description || "Item",
    li.sku || "-",
    String(li.quantity),
    formatCurrency(li.unitPrice, data.currency),
    formatCurrency(li.quantity * li.unitPrice, data.currency),
  ]);

  autoTable(doc, {
    startY: y,
    head,
    body,
    margin: { left: margin, right: margin },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [r, g, b], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      1: { cellWidth: 26 },
      2: { halign: "right", cellWidth: 16 },
      3: { halign: "right", cellWidth: 28 },
      4: { halign: "right", cellWidth: 28 },
    },
  });

  const docWithTable = doc as unknown as { lastAutoTable?: { finalY: number } };
  y = (docWithTable.lastAutoTable?.finalY ?? y + 20) + 6;

  // Totals.
  const totalsLabelX = width - margin - 55;
  const totalsValueX = width - margin;
  const totalsRow = (label: string, value: string, opts?: { bold?: boolean }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(opts?.bold ? 15 : 100, opts?.bold ? 23 : 116, opts?.bold ? 42 : 139);
    doc.text(label, totalsLabelX, y);
    doc.setTextColor(15, 23, 42);
    doc.text(value, totalsValueX, y, { align: "right" });
    y += 5.5;
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
  if (totals.shippingCost > 0) {
    totalsRow("Shipping", formatCurrency(totals.shippingCost, data.currency));
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(totalsLabelX, y, totalsValueX, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(r, g, b);
  doc.text("Total", totalsLabelX, y);
  doc.text(formatCurrency(totals.total, data.currency), totalsValueX, y, { align: "right" });
  y += 12;

  // Terms & conditions / notes.
  if (data.termsAndConditions) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Terms & conditions", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    const wrapped = doc.splitTextToSize(data.termsAndConditions, contentWidth) as string[];
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4 + 6;
  }

  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Notes", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    const wrapped = doc.splitTextToSize(data.notes, contentWidth) as string[];
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4 + 6;
  }

  // Authorized-by signature line.
  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 70, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Authorized by", margin, y);
  if (data.authorizedBy) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(data.authorizedBy, margin, y + 5);
  }

  return doc;
}
