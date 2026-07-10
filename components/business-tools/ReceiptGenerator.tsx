"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_PAYMENT_METHOD,
  DEFAULT_TEMPLATE,
  PAYMENT_METHODS,
  TEMPLATES,
  computeTotals,
  formatCurrency,
  generateReceiptNumber,
  type DiscountType,
  type LineItem,
  type PaymentMethod,
  type ReceiptData,
  type ReceiptTotals,
  type TemplateId,
} from "@/lib/receipt";
import { cn } from "@/lib/utils";

import { ReceiptExport } from "./ReceiptExport";

/**
 * /tools/receipt-generator client component.
 *
 * Left: stacked form sections (Template, Style, Currency, Business
 * details, Receipt details, Customer, Items, Discount/tax/payment,
 * Notes). Right: a lightweight live preview rendered directly from
 * `data` + `computeTotals` — receipts don't have a standard paper size
 * the way letters do, so the preview is a fixed-width "paper" card
 * rather than a true-to-mm page.
 *
 * 100% browser-side: no auth, no database. The only network call is the
 * optional logo upload, which reuses the existing anonymous
 * /api/email-signature/upload endpoint (bc-avatars Supabase bucket) —
 * shared infra, not tool-specific.
 */

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function blankItem(): LineItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function makeInitialData(): ReceiptData {
  return {
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    logoUrl: "",
    // Generated post-mount (see effect below) so the random sequence
    // number can't cause a server/client hydration mismatch.
    receiptNumber: "",
    dateIssued: todayIso(),
    customerName: "",
    customerContact: "",
    lineItems: [blankItem()],
    taxRatePercent: 0,
    discountAmount: 0,
    discountType: "flat",
    amountPaid: 0,
    paymentMethod: DEFAULT_PAYMENT_METHOD,
    currency: DEFAULT_CURRENCY,
    notes: "Thank you for your business!",
    footerText: "",
    primaryColor: "#3B82F6",
    template: DEFAULT_TEMPLATE,
  };
}

// ── Component ────────────────────────────────────────────────────────────

export function ReceiptGenerator() {
  const [data, setData] = useState<ReceiptData>(makeInitialData);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const descRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const paperRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof ReceiptData>(key: K, value: ReceiptData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    // Generated post-mount, not in the lazy useState initializer, so the
    // random sequence number can't cause a server/client hydration
    // mismatch on this controlled input's value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    set("receiptNumber", generateReceiptNumber());
  }, [set]);

  useEffect(() => {
    if (pendingFocusId && descRefs.current[pendingFocusId]) {
      descRefs.current[pendingFocusId]?.focus();
      setPendingFocusId(null);
    }
  }, [pendingFocusId, data.lineItems]);

  const totals = computeTotals(data);
  const nameError = !data.businessName.trim() ? "Business name is required" : null;

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));

  const addItem = (focus = false) => {
    const item = blankItem();
    setData((prev) => ({ ...prev, lineItems: [...prev.lineItems, item] }));
    if (focus) setPendingFocusId(item.id);
  };

  const removeItem = (id: string) =>
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length > 1 ? prev.lineItems.filter((li) => li.id !== id) : prev.lineItems,
    }));

  const onItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[55fr_45fr]">
        {/* Mobile-first: preview appears above the form on small screens,
            becomes a sticky right-hand column at lg. */}
        <aside className="order-first min-w-0 lg:order-last lg:sticky lg:top-24 lg:h-fit">
          <PreviewPanel
            data={data}
            totals={totals}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            paperRef={paperRef}
          />
          <div className="mt-4">
            <ReceiptExport data={data} paperRef={paperRef} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          {nameError && (
            <p className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
              <AlertTriangle className="h-3 w-3" /> {nameError}
            </p>
          )}

          {/* 1 — Template */}
          <Section title="Template" subtitle="Pick a layout — you can switch anytime without losing your details.">
            <TemplatePicker value={data.template} onChange={(t) => set("template", t)} />
          </Section>

          {/* 2 — Style */}
          <Section title="Style">
            <ColorField label="Accent color" value={data.primaryColor} onChange={(v) => set("primaryColor", v)} />
          </Section>

          {/* 3 — Currency */}
          <Section title="Currency">
            <Field label="Currency">
              <select
                value={data.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputCls}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          {/* 4 — Business details */}
          <Section title="Business details">
            <Grid>
              <Field label="Business name" required>
                <input
                  value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  className={inputCls}
                  placeholder="Corner Store Ltd."
                  autoComplete="organization"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={data.businessPhone}
                  onChange={(e) => set("businessPhone", e.target.value)}
                  className={inputCls}
                  placeholder="+234 803 772 3164"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => set("businessEmail", e.target.value)}
                  className={inputCls}
                  placeholder="hello@business.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Address">
                <input
                  value={data.businessAddress}
                  onChange={(e) => set("businessAddress", e.target.value)}
                  className={inputCls}
                  placeholder="123 Market Street, Lagos"
                  autoComplete="street-address"
                />
              </Field>
            </Grid>
            <div className="mt-4">
              <LogoPicker value={data.logoUrl} onChange={(url) => set("logoUrl", url)} />
            </div>
          </Section>

          {/* 5 — Receipt details */}
          <Section title="Receipt details">
            <Grid>
              <Field label="Receipt number">
                <input
                  value={data.receiptNumber}
                  onChange={(e) => set("receiptNumber", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Date issued">
                <input
                  type="date"
                  value={data.dateIssued}
                  onChange={(e) => set("dateIssued", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Payment method">
                <select
                  value={data.paymentMethod}
                  onChange={(e) => set("paymentMethod", e.target.value as PaymentMethod)}
                  className={inputCls}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            </Grid>
          </Section>

          {/* 6 — Customer */}
          <Section title="Customer" subtitle="Optional.">
            <Grid>
              <Field label="Customer name">
                <input
                  value={data.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  className={inputCls}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Contact">
                <input
                  value={data.customerContact}
                  onChange={(e) => set("customerContact", e.target.value)}
                  className={inputCls}
                  placeholder="Phone or email"
                />
              </Field>
            </Grid>
          </Section>

          {/* 7 — Items */}
          <Section title="Items" subtitle="Press Enter in any field to add another row.">
            <div className="space-y-2">
              <div className="hidden gap-2 px-1 text-[11px] font-medium uppercase tracking-wider text-surface-500 sm:grid sm:grid-cols-[1fr_70px_100px_100px_32px] dark:text-surface-400">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Unit price</span>
                <span className="text-right">Total</span>
                <span />
              </div>
              {data.lineItems.map((li, idx) => (
                <div key={li.id} className="grid gap-2 sm:grid-cols-[1fr_70px_100px_100px_32px]">
                  <input
                    ref={(el) => {
                      descRefs.current[li.id] = el;
                    }}
                    value={li.description}
                    onChange={(e) => updateItem(li.id, { description: e.target.value })}
                    onKeyDown={onItemKeyDown}
                    placeholder={`Item ${idx + 1}`}
                    className={inputCls}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={li.quantity}
                    onChange={(e) => updateItem(li.id, { quantity: Math.max(0, Number(e.target.value)) })}
                    onKeyDown={onItemKeyDown}
                    className={cn(inputCls, "text-right")}
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={li.unitPrice}
                    onChange={(e) => updateItem(li.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
                    onKeyDown={onItemKeyDown}
                    className={cn(inputCls, "text-right")}
                  />
                  <p className="flex items-center justify-end px-1 text-sm font-semibold text-surface-900 dark:text-white">
                    {formatCurrency(li.quantity * li.unitPrice, data.currency)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(li.id)}
                    disabled={data.lineItems.length === 1}
                    aria-label="Remove item"
                    className="flex items-center justify-center rounded-lg text-surface-400 transition hover:text-red-600 disabled:opacity-30 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addItem(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              <Plus className="h-3.5 w-3.5" />
              Add item
            </button>
          </Section>

          {/* 8 — Discount, tax & payment */}
          <Section title="Discount, tax & payment">
            <Grid>
              <Field label="Discount">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={data.discountAmount}
                    onChange={(e) => set("discountAmount", Math.max(0, Number(e.target.value)))}
                    className={cn(inputCls, "flex-1")}
                  />
                  <DiscountTypeToggle value={data.discountType} onChange={(v) => set("discountType", v)} />
                </div>
              </Field>
              <Field label="Tax rate (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={data.taxRatePercent}
                  onChange={(e) => set("taxRatePercent", Math.max(0, Math.min(100, Number(e.target.value))))}
                  className={inputCls}
                />
              </Field>
              <Field label="Amount paid" hint="Used to calculate change due.">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={data.amountPaid}
                  onChange={(e) => set("amountPaid", Math.max(0, Number(e.target.value)))}
                  className={inputCls}
                />
              </Field>
            </Grid>
          </Section>

          {/* 9 — Notes & footer */}
          <Section title="Notes & footer">
            <Grid>
              <Field label="Notes" hint="Shown above the footer, e.g. a thank-you message.">
                <textarea
                  value={data.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className={cn(inputCls, "min-h-[64px] resize-y")}
                  placeholder="Thank you for your business!"
                />
              </Field>
              <Field label="Footer text" hint="Small print at the very bottom, e.g. a return policy.">
                <textarea
                  value={data.footerText}
                  onChange={(e) => set("footerText", e.target.value)}
                  className={cn(inputCls, "min-h-[64px] resize-y")}
                  placeholder="All sales are final."
                />
              </Field>
            </Grid>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ── Preview panel ────────────────────────────────────────────────────────

function PreviewPanel({
  data,
  totals,
  open,
  onOpenChange,
  paperRef,
}: {
  data: ReceiptData;
  totals: ReceiptTotals;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  paperRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">Updates as you type.</p>
        </div>
        {/* Collapse on mobile only — the preview eats a lot of vertical
            space before the form. Hidden on lg where the preview is a
            sticky sidebar. */}
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          className="rounded-lg border border-surface-200 p-1.5 text-surface-500 transition hover:border-surface-300 lg:hidden dark:border-surface-800 dark:text-surface-300"
          aria-label={open ? "Hide preview" : "Show preview"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
        </button>
      </div>

      {open && (
        <div className="overflow-auto rounded-2xl border border-surface-200 bg-surface-100 p-6 dark:border-surface-800 dark:bg-surface-950">
          {/* id + ref are the print/PNG capture target — see
              ReceiptExport's print stylesheet and html2canvas call. */}
          <div ref={paperRef} id="receipt-print-area">
            <ReceiptPaper data={data} totals={totals} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Receipt paper preview ────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function ReceiptPaper({ data, totals }: { data: ReceiptData; totals: ReceiptTotals }) {
  const isThermal = data.template === "thermal";
  const isModern = data.template === "modern";
  const isMinimal = data.template === "minimal";
  const isClassic = data.template === "classic";
  const money = (v: number) => formatCurrency(v, data.currency);

  return (
    <div
      className={cn(
        "mx-auto border border-surface-200 bg-white text-surface-900 shadow-lg",
        isThermal ? "rounded-sm font-mono text-[11px]" : "rounded-2xl text-sm"
      )}
      style={{ width: isThermal ? 300 : 380, maxWidth: "100%" }}
    >
      {isModern ? (
        <div className="rounded-t-2xl px-5 py-4" style={{ background: data.primaryColor }}>
          <ReceiptHeader data={data} light />
        </div>
      ) : (
        <div className={cn("px-5 pt-5", isThermal && "px-3 pt-3")}>
          <ReceiptHeader data={data} centered={isClassic || isThermal} />
          {!isMinimal && (
            <div
              className="mt-3"
              style={{
                borderTopWidth: isThermal ? 1 : 1.5,
                borderTopStyle: isThermal ? "dashed" : "solid",
                borderTopColor: isThermal ? "#D1D5DB" : data.primaryColor,
              }}
            />
          )}
        </div>
      )}

      <div className={cn("space-y-4 px-5 py-4", isThermal && "space-y-3 px-3 py-3")}>
        <div
          className={cn(
            "flex justify-between text-xs text-surface-500 dark:text-surface-400",
            isThermal && "flex-col gap-0.5 text-[10px]"
          )}
        >
          <span>Receipt #{data.receiptNumber || "—"}</span>
          <span>{formatDate(data.dateIssued)}</span>
        </div>

        {(data.customerName || data.customerContact) && (
          <div className="text-xs text-surface-600">
            <p className="font-semibold text-surface-800">Customer</p>
            {data.customerName && <p>{data.customerName}</p>}
            {data.customerContact && <p>{data.customerContact}</p>}
          </div>
        )}

        {isThermal ? <ThermalItems data={data} money={money} /> : <TableItems data={data} money={money} />}

        <div className={cn("border-t border-surface-200 pt-3", isThermal && "border-dashed pt-2")}>
          <TotalsBlock data={data} totals={totals} money={money} accent={data.primaryColor} isThermal={isThermal} />
        </div>

        {data.notes && (
          <p className={cn("text-center text-xs text-surface-500", isThermal && "text-[10px]")}>{data.notes}</p>
        )}
        {data.footerText && (
          <p className={cn("text-center text-[10px] text-surface-400", isThermal && "text-[9px]")}>
            {data.footerText}
          </p>
        )}
      </div>
    </div>
  );
}

function ReceiptHeader({
  data,
  light,
  centered,
}: {
  data: ReceiptData;
  light?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", centered && "flex-col text-center")}>
      {data.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.logoUrl} alt="" className="h-10 w-10 shrink-0 object-contain" />
      ) : (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed",
            light ? "border-white/40 text-white/40" : "border-surface-300 text-surface-300"
          )}
        >
          <Building2 className="h-5 w-5" />
        </div>
      )}
      <div>
        <p
          className={cn(
            "font-bold",
            light ? "text-white" : "text-surface-900",
            !data.businessName && "italic opacity-60"
          )}
        >
          {data.businessName || "Your Business Name"}
        </p>
        <div className={cn("text-[11px] leading-snug", light ? "text-white/80" : "text-surface-500")}>
          {data.businessAddress && <p>{data.businessAddress}</p>}
          {(data.businessPhone || data.businessEmail) && (
            <p>{[data.businessPhone, data.businessEmail].filter(Boolean).join("   ·   ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TableItems({ data, money }: { data: ReceiptData; money: (v: number) => string }) {
  return (
    <div className="text-xs">
      <div className="grid grid-cols-[1fr_36px_64px_64px] gap-2 border-b border-surface-200 pb-1.5 font-semibold text-surface-500">
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Total</span>
      </div>
      <div className="divide-y divide-surface-100">
        {data.lineItems.map((li) => (
          <div key={li.id} className="grid grid-cols-[1fr_36px_64px_64px] gap-2 py-1.5">
            <span className="truncate text-surface-800">{li.description || "Item"}</span>
            <span className="text-right text-surface-600">{li.quantity}</span>
            <span className="text-right text-surface-600">{money(li.unitPrice)}</span>
            <span className="text-right font-medium text-surface-900">{money(li.quantity * li.unitPrice)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThermalItems({ data, money }: { data: ReceiptData; money: (v: number) => string }) {
  return (
    <div className="space-y-1.5 border-y border-dashed border-surface-300 py-2">
      {data.lineItems.map((li) => (
        <div key={li.id}>
          <p className="truncate">{li.description || "Item"}</p>
          <div className="flex justify-between text-surface-500">
            <span>
              {li.quantity} x {money(li.unitPrice)}
            </span>
            <span className="text-surface-900">{money(li.quantity * li.unitPrice)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TotalsBlock({
  data,
  totals,
  money,
  accent,
  isThermal,
}: {
  data: ReceiptData;
  totals: ReceiptTotals;
  money: (v: number) => string;
  accent: string;
  isThermal: boolean;
}) {
  const row = (label: string, value: string, opts?: { bold?: boolean; muted?: boolean }) => (
    <div key={label} className={cn("flex justify-between", opts?.bold && "font-bold")}>
      <span className={cn(opts?.muted ? "text-surface-500" : "text-surface-600")}>{label}</span>
      <span className={cn(!opts?.bold && "text-surface-800")}>{value}</span>
    </div>
  );

  return (
    <div className={cn("space-y-1", isThermal ? "text-[11px]" : "text-xs")}>
      {row("Subtotal", money(totals.subtotal))}
      {totals.discountValue > 0 &&
        row(
          data.discountType === "percent" ? `Discount (${data.discountAmount}%)` : "Discount",
          `- ${money(totals.discountValue)}`
        )}
      {data.taxRatePercent > 0 && row(`Tax (${data.taxRatePercent}%)`, money(totals.taxValue))}
      <div className="my-1.5 border-t" style={{ borderColor: accent }} />
      <div className="flex items-baseline justify-between text-base font-bold" style={{ color: accent }}>
        <span>Total</span>
        <span>{money(totals.total)}</span>
      </div>
      {data.amountPaid > 0 && row("Amount paid", money(data.amountPaid))}
      {totals.changeDue > 0 && row("Change due", money(totals.changeDue), { bold: true })}
      {row("Payment method", data.paymentMethod, { muted: true })}
    </div>
  );
}

// ── Template picker ──────────────────────────────────────────────────────

function TemplateThumb({ id }: { id: TemplateId }) {
  const ACCENT = "#3B82F6";
  const HEADING = "#374151";
  const MUTED = "#9CA3AF";
  const BLOCK = "#D1D5DB";

  switch (id) {
    case "classic":
      return (
        <div className="flex h-full w-full flex-col items-center gap-1.5 bg-white p-3">
          <div className="h-3 w-3 rounded-full" style={{ background: BLOCK }} />
          <div className="h-1.5 w-10 rounded-full" style={{ background: HEADING }} />
          <div className="mt-1 h-px w-full" style={{ background: ACCENT }} />
          <div className="mt-1 h-1 w-8 rounded-full" style={{ background: MUTED }} />
          <div className="h-1 w-8 rounded-full" style={{ background: MUTED }} />
          <div className="h-1 w-6 rounded-full" style={{ background: MUTED }} />
        </div>
      );
    case "thermal":
      return (
        <div className="flex h-full w-full items-start justify-center bg-white p-2">
          <div
            className="flex h-full w-8 flex-col items-center gap-1 border-x border-dashed p-1"
            style={{ borderColor: BLOCK }}
          >
            <div className="mt-1 h-1 w-6 rounded-full" style={{ background: HEADING }} />
            <div className="mt-1 h-px w-6" style={{ background: MUTED }} />
            <div className="h-0.5 w-5 rounded-full" style={{ background: MUTED }} />
            <div className="h-0.5 w-5 rounded-full" style={{ background: MUTED }} />
            <div className="h-0.5 w-5 rounded-full" style={{ background: MUTED }} />
          </div>
        </div>
      );
    case "modern":
      return (
        <div className="flex h-full w-full flex-col bg-white">
          <div className="h-6 w-full" style={{ background: ACCENT }} />
          <div className="flex flex-1 flex-col items-center gap-1 p-2">
            <div className="mt-1 h-1 w-8 rounded-full" style={{ background: MUTED }} />
            <div className="h-1 w-6 rounded-full" style={{ background: MUTED }} />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-white p-3">
          <div className="h-1.5 w-10 rounded-full" style={{ background: HEADING }} />
          <div className="h-px w-8" style={{ background: BLOCK }} />
          <div className="h-1 w-8 rounded-full" style={{ background: MUTED }} />
          <div className="h-1 w-6 rounded-full" style={{ background: MUTED }} />
        </div>
      );
    default:
      return null;
  }
}

function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (t: TemplateId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TEMPLATES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "group flex flex-col overflow-hidden rounded-2xl border-2 text-left transition",
              active
                ? "border-primary-500 shadow-glow"
                : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
            )}
            aria-pressed={active}
          >
            <div className="aspect-[4/5] w-full bg-surface-50 dark:bg-surface-950">
              <TemplateThumb id={t.id} />
            </div>
            <div className="border-t border-surface-100 bg-white p-2 dark:border-surface-800 dark:bg-surface-900">
              <p
                className={cn(
                  "text-xs font-semibold",
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-surface-800 dark:text-surface-100"
                )}
              >
                {t.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Discount type toggle ─────────────────────────────────────────────────

function DiscountTypeToggle({
  value,
  onChange,
}: {
  value: DiscountType;
  onChange: (v: DiscountType) => void;
}) {
  const options: DiscountType[] = ["flat", "percent"];
  return (
    <div className="inline-flex shrink-0 rounded-xl border border-surface-200 p-0.5 dark:border-surface-800">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            value === opt
              ? "bg-primary-600 text-white"
              : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          )}
        >
          {opt === "flat" ? "Flat" : "%"}
        </button>
      ))}
    </div>
  );
}

// ── Logo picker (upload + paste URL) ─────────────────────────────────────

function LogoPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setError("Only JPG, PNG, or WEBP images.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const blob = await compressLogo(f);
      const form = new FormData();
      form.append("file", blob, filenameFor(f, blob));
      form.append("kind", "logo");
      const res = await fetch("/api/email-signature/upload", {
        method: "POST",
        body: form,
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    onChange("");
    setError(null);
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        Logo
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl border border-surface-200 bg-surface-50 object-contain p-1 dark:border-surface-800 dark:bg-surface-950"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-surface-300 text-surface-400 dark:border-surface-700">
            <Upload className="h-5 w-5" />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 disabled:opacity-60 dark:border-surface-800 dark:text-surface-200"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFile}
          className="hidden"
        />
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-50 px-2.5 py-1.5 text-xs dark:border-surface-800 dark:bg-surface-900/40">
        <Link2 className="h-3 w-3 shrink-0 text-surface-500" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="flex-1 bg-transparent text-xs text-surface-800 placeholder:text-surface-400 focus:outline-none dark:text-surface-100"
        />
      </div>
      {error && <p className="mt-2 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

/** Resize to max ~400 px on the longest side. PNGs stay PNG so
 *  transparency survives — logos are placed over the colored header band
 *  on the modern template where a flattened white background would look
 *  broken. Non-PNG sources are re-encoded as JPEG. */
async function compressLogo(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const largest = Math.max(bitmap.width, bitmap.height);
  const scale = largest > 400 ? 400 / largest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const isPng = file.type === "image/png";
  const out = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), isPng ? "image/png" : "image/jpeg", isPng ? undefined : 0.9)
  );
  return out ?? file;
}

function filenameFor(original: File, blob: Blob): string {
  const base = original.name.replace(/\.[^.]+$/, "") || "logo";
  const ext = blob.type === "image/jpeg" ? "jpg" : (blob.type.split("/")[1] ?? "png");
  return `${base}.${ext}`;
}

// ── Section / Field / Grid / Color primitives ────────────────────────────

const inputCls =
  "w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-surface-500">{hint}</span>}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2 dark:border-surface-800 dark:bg-surface-900"
      >
        <span
          aria-hidden
          className="h-6 w-6 shrink-0 rounded-full ring-1 ring-surface-300 dark:ring-surface-700"
          style={{ background: value }}
        />
        <span className="flex-1 text-left font-mono text-sm text-surface-900 dark:text-white">
          {value.toUpperCase()}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <HexColorPicker color={value} onChange={onChange} style={{ width: "100%" }} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputCls, "mt-2 font-mono uppercase")}
          />
        </div>
      )}
    </div>
  );
}
