"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, RotateCcw, Trash2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceState {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;

  fromName: string;
  fromAddress: string;
  fromEmail: string;

  toName: string;
  toAddress: string;
  toEmail: string;

  lineItems: LineItem[];
  taxRatePercent: number;
  discountAmount: number;
  notes: string;
  paymentTerms: string;

  // Data URL for the logo (PNG/JPG/SVG).
  logoDataUrl: string | null;
}

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "NGN", symbol: "₦" },
  { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "$" },
  { code: "AUD", symbol: "$" },
  { code: "JPY", symbol: "¥" },
  { code: "CNY", symbol: "¥" },
  { code: "ZAR", symbol: "R" },
];

const STORAGE_KEY = "ua-invoice-v1";

function blankItem(): LineItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_STATE: InvoiceState = {
  invoiceNumber: "INV-001",
  issueDate: todayIso(),
  dueDate: plusDays(todayIso(), 14),
  currency: "USD",
  fromName: "",
  fromAddress: "",
  fromEmail: "",
  toName: "",
  toAddress: "",
  toEmail: "",
  lineItems: [blankItem()],
  taxRatePercent: 0,
  discountAmount: 0,
  notes: "",
  paymentTerms: "Payment due within 14 days.",
  logoDataUrl: null,
};

function loadFromStorage(): InvoiceState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<InvoiceState>;
    return { ...DEFAULT_STATE, ...parsed, lineItems: parsed.lineItems ?? [blankItem()] };
  } catch {
    return DEFAULT_STATE;
  }
}

function formatMoney(value: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
}

export function InvoiceGenerator() {
  const [state, setState] = useState<InvoiceState>(DEFAULT_STATE);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setState(loadFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = useMemo(
    () => state.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0),
    [state.lineItems]
  );
  const tax = subtotal * (state.taxRatePercent / 100);
  const total = subtotal + tax - state.discountAmount;

  const update = <K extends keyof InvoiceState>(key: K, value: InvoiceState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setState((s) => ({
      ...s,
      lineItems: s.lineItems.map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));

  const addItem = () => setState((s) => ({ ...s, lineItems: [...s.lineItems, blankItem()] }));
  const removeItem = (id: string) =>
    setState((s) => ({
      ...s,
      lineItems: s.lineItems.length > 1 ? s.lineItems.filter((li) => li.id !== id) : s.lineItems,
    }));

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => update("logoDataUrl", typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (window.confirm("Clear all invoice fields? Saved details will be wiped.")) {
      setState({ ...DEFAULT_STATE, invoiceNumber: state.invoiceNumber });
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = (autoTableModule.default ?? (autoTableModule as unknown as { autoTable: typeof autoTableModule.default }).autoTable) as typeof autoTableModule.default;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = margin;

      // Logo (top-left).
      if (state.logoDataUrl) {
        try {
          const fmt = state.logoDataUrl.startsWith("data:image/png") ? "PNG" :
                      state.logoDataUrl.startsWith("data:image/svg") ? "SVG" : "JPEG";
          if (fmt !== "SVG") {
            doc.addImage(state.logoDataUrl, fmt, margin, y, 80, 80);
          }
        } catch {
          /* skip on decode failure */
        }
      }

      // INVOICE heading (top-right).
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(15, 23, 42);
      doc.text("INVOICE", pageWidth - margin, y + 24, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`# ${state.invoiceNumber}`, pageWidth - margin, y + 42, { align: "right" });
      doc.text(`Issued: ${state.issueDate}`, pageWidth - margin, y + 56, { align: "right" });
      doc.text(`Due: ${state.dueDate}`, pageWidth - margin, y + 70, { align: "right" });

      y += 110;

      // From / To columns.
      const colWidth = (pageWidth - margin * 2 - 20) / 2;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("FROM", margin, y);
      doc.text("BILL TO", margin + colWidth + 20, y);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(state.fromName || "Your business", margin, y + 16);
      doc.text(state.toName || "Client name", margin + colWidth + 20, y + 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const fromLines = (state.fromAddress + (state.fromEmail ? `\n${state.fromEmail}` : "")).split("\n");
      const toLines = (state.toAddress + (state.toEmail ? `\n${state.toEmail}` : "")).split("\n");
      fromLines.forEach((line, i) => doc.text(line, margin, y + 32 + i * 14));
      toLines.forEach((line, i) => doc.text(line, margin + colWidth + 20, y + 32 + i * 14));

      y += 32 + Math.max(fromLines.length, toLines.length) * 14 + 20;

      // Line items table.
      const tableHead = [["Description", "Qty", "Unit price", "Total"]];
      const tableBody = state.lineItems.map((li) => [
        li.description || "—",
        String(li.quantity),
        formatMoney(li.unitPrice, state.currency),
        formatMoney(li.quantity * li.unitPrice, state.currency),
      ]);

      autoTable(doc, {
        startY: y,
        head: tableHead,
        body: tableBody,
        margin: { left: margin, right: margin },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          1: { halign: "right", cellWidth: 50 },
          2: { halign: "right", cellWidth: 90 },
          3: { halign: "right", cellWidth: 90 },
        },
      });

      // Totals (right-aligned beneath table).
      const docWithLastTable = doc as unknown as { lastAutoTable?: { finalY: number } };
      const afterTableY = docWithLastTable.lastAutoTable?.finalY ?? y + 100;
      let totalsY = afterTableY + 20;

      const totalsX = pageWidth - margin - 200;
      const valueX = pageWidth - margin;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal", totalsX, totalsY);
      doc.setTextColor(15, 23, 42);
      doc.text(formatMoney(subtotal, state.currency), valueX, totalsY, { align: "right" });
      totalsY += 16;

      if (state.taxRatePercent > 0) {
        doc.setTextColor(100, 116, 139);
        doc.text(`Tax (${state.taxRatePercent.toFixed(2)}%)`, totalsX, totalsY);
        doc.setTextColor(15, 23, 42);
        doc.text(formatMoney(tax, state.currency), valueX, totalsY, { align: "right" });
        totalsY += 16;
      }

      if (state.discountAmount > 0) {
        doc.setTextColor(100, 116, 139);
        doc.text("Discount", totalsX, totalsY);
        doc.setTextColor(15, 23, 42);
        doc.text(`- ${formatMoney(state.discountAmount, state.currency)}`, valueX, totalsY, { align: "right" });
        totalsY += 16;
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(totalsX, totalsY, valueX, totalsY);
      totalsY += 16;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("Total", totalsX, totalsY);
      doc.text(formatMoney(total, state.currency), valueX, totalsY, { align: "right" });
      totalsY += 30;

      // Notes / payment terms.
      if (state.notes || state.paymentTerms) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        if (state.paymentTerms) {
          doc.text("Payment terms", margin, totalsY);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(71, 85, 105);
          const wrapped = doc.splitTextToSize(state.paymentTerms, pageWidth - margin * 2);
          doc.text(wrapped, margin, totalsY + 14);
          totalsY += 14 + wrapped.length * 12 + 16;
        }
        if (state.notes) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text("Notes", margin, totalsY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          const wrapped = doc.splitTextToSize(state.notes, pageWidth - margin * 2);
          doc.text(wrapped, margin, totalsY + 14);
        }
      }

      doc.save(`${state.invoiceNumber || "invoice"}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl border border-surface-200 bg-white p-5 sm:grid-cols-4 dark:border-surface-800 dark:bg-surface-900">
        <Field label="Invoice #">
          <input
            value={state.invoiceNumber}
            onChange={(e) => update("invoiceNumber", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Issue date">
          <input
            type="date"
            value={state.issueDate}
            onChange={(e) => update("issueDate", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Due date">
          <input
            type="date"
            value={state.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Currency">
          <select
            value={state.currency}
            onChange={(e) => update("currency", e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="From (your business)">
          <Field label="Name">
            <input value={state.fromName} onChange={(e) => update("fromName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Address">
            <textarea
              rows={3}
              value={state.fromAddress}
              onChange={(e) => update("fromAddress", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={state.fromEmail}
              onChange={(e) => update("fromEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </Card>
        <Card title="Bill to (client)">
          <Field label="Name">
            <input value={state.toName} onChange={(e) => update("toName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Address">
            <textarea
              rows={3}
              value={state.toAddress}
              onChange={(e) => update("toAddress", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={state.toEmail}
              onChange={(e) => update("toEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </Card>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Line items
          </p>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Add row
          </button>
        </div>
        <div className="space-y-2">
          {state.lineItems.map((li, idx) => (
            <div key={li.id} className="grid gap-2 sm:grid-cols-[1fr_90px_120px_120px_36px]">
              <input
                value={li.description}
                onChange={(e) => updateItem(li.id, { description: e.target.value })}
                placeholder={`Item ${idx + 1}`}
                className={inputClass}
              />
              <input
                type="number"
                min={0}
                step={1}
                value={li.quantity}
                onChange={(e) => updateItem(li.id, { quantity: Math.max(0, Number(e.target.value)) })}
                className={cn(inputClass, "text-right")}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={li.unitPrice}
                onChange={(e) => updateItem(li.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
                className={cn(inputClass, "text-right")}
              />
              <p className="flex items-center justify-end text-sm font-semibold text-surface-900 dark:text-white">
                {formatMoney(li.quantity * li.unitPrice, state.currency)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(li.id)}
                className="flex items-center justify-center rounded-lg text-surface-400 transition hover:text-error-600 disabled:opacity-30 dark:hover:text-error-400"
                disabled={state.lineItems.length === 1}
                aria-label="Remove row"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Tax & discount">
          <Field label="Tax rate (%)">
            <input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={state.taxRatePercent}
              onChange={(e) => update("taxRatePercent", Math.max(0, Math.min(100, Number(e.target.value))))}
              className={inputClass}
            />
          </Field>
          <Field label="Discount amount">
            <input
              type="number"
              min={0}
              step="0.01"
              value={state.discountAmount}
              onChange={(e) => update("discountAmount", Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
          </Field>
        </Card>
        <Card title="Logo (optional)">
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-300 px-4 py-6 text-center text-xs text-surface-500 transition hover:border-primary-400 dark:border-surface-700 dark:text-surface-400">
            <Upload className="h-5 w-5" />
            {state.logoDataUrl ? "Replace logo" : "Upload logo (PNG / JPG)"}
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogoUpload(f);
                e.target.value = "";
              }}
            />
          </label>
          {state.logoDataUrl && (
            <div className="mt-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.logoDataUrl} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain" />
              <button
                type="button"
                onClick={() => update("logoDataUrl", null)}
                className="text-xs font-semibold text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
              >
                Remove
              </button>
            </div>
          )}
        </Card>
      </div>

      <Card title="Payment terms & notes">
        <Field label="Payment terms">
          <textarea
            rows={2}
            value={state.paymentTerms}
            onChange={(e) => update("paymentTerms", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Notes (optional)">
          <textarea
            rows={2}
            value={state.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Card>

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm text-surface-700 dark:text-surface-200">
            Total due:{" "}
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              {formatMoney(total, state.currency)}
            </span>
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset form
          </button>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          <Download className="h-6 w-6" />
          {isGenerating ? "Generating PDF…" : "Download invoice PDF"}
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{title}</p>
      {children}
    </div>
  );
}
