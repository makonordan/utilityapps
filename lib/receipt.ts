/**
 * Data + constants for the Receipt Generator tool at
 * /tools/receipt-generator.
 *
 * This file is pure TypeScript — no React, no browser APIs, no client
 * directive. It's imported by both server (metadata, structured data) and
 * client (form + preview) code, and by the PDF (jspdf) and image
 * (html2canvas) exporters, so all of them agree on the same totals math
 * and the same template/currency/payment-method options.
 *
 * Everything here runs 100% in the browser. There is no auth, no
 * database, and no server round-trip — a user's business details, items,
 * and pricing never leave their device.
 */

// ── Templates ────────────────────────────────────────────────────────────

export type TemplateId = "classic" | "thermal" | "modern" | "minimal";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "A clean, traditional business receipt with a centered header and ruled item table.",
  },
  {
    id: "thermal",
    name: "Thermal",
    description: "A narrow, monospaced POS-style receipt that mimics a till printout.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "A colored header band in your brand color, with a bold total at the bottom.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "No color, no rules beyond what's needed — just the business, items, and totals.",
  },
];

export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TemplateId, TemplateDefinition>
);

export const DEFAULT_TEMPLATE: TemplateId = "classic";

// ── Currencies ───────────────────────────────────────────────────────────

export interface CurrencyDefinition {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyDefinition[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export const CURRENCIES_BY_CODE: Record<string, CurrencyDefinition> = CURRENCIES.reduce(
  (acc, c) => {
    acc[c.code] = c;
    return acc;
  },
  {} as Record<string, CurrencyDefinition>
);

export const DEFAULT_CURRENCY = "USD";

/** Formats a number as money using the currency's symbol (not the
 *  browser's Intl currency formatting, which doesn't know symbols like
 *  ₦ or KSh) with thousands separators and two decimal places. Shared by
 *  the live preview and the PDF/image exporters so amounts read
 *  identically everywhere. */
export function formatCurrency(value: number, currencyCode: string): string {
  const currency = CURRENCIES_BY_CODE[currencyCode] ?? CURRENCIES_BY_CODE[DEFAULT_CURRENCY];
  const sign = value < 0 ? "-" : "";
  const amount = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${currency.symbol}${amount}`;
}

// ── Payment methods ──────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  "Cash",
  "Card",
  "Bank Transfer",
  "Mobile Money",
  "PayPal",
  "Cheque",
  "Other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "Cash";

// ── Receipt data ─────────────────────────────────────────────────────────

export type DiscountType = "flat" | "percent";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ReceiptData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  /** Public URL to an uploaded/hosted logo. */
  logoUrl: string;
  receiptNumber: string;
  /** ISO date string (yyyy-mm-dd). */
  dateIssued: string;
  /** Optional. */
  customerName: string;
  /** Optional — phone, email, or address. */
  customerContact: string;
  lineItems: LineItem[];
  taxRatePercent: number;
  discountAmount: number;
  discountType: DiscountType;
  /** How much the customer handed over — used to compute change due. */
  amountPaid: number;
  paymentMethod: PaymentMethod;
  /** ISO 4217 code, must be one of CURRENCIES[].code. */
  currency: string;
  notes: string;
  footerText: string;
  /** Hex color used for accents on the modern template. */
  primaryColor: string;
  template: TemplateId;
}

export interface ReceiptTotals {
  subtotal: number;
  discountValue: number;
  taxableAmount: number;
  taxValue: number;
  total: number;
  /** amountPaid - total, when amountPaid exceeds total; 0 otherwise. */
  changeDue: number;
}

/** Subtotal, discount, tax, total, and change due — shared by the live
 *  preview and the PDF/image exporters so the numbers always agree.
 *  discountValue is clamped so it can never exceed the subtotal (a
 *  percent or flat discount larger than the sale just zeroes it out
 *  rather than producing a negative taxable amount). */
export function computeTotals(data: ReceiptData): ReceiptTotals {
  const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const rawDiscount =
    data.discountType === "percent" ? subtotal * (data.discountAmount / 100) : data.discountAmount;
  const discountValue = Math.min(Math.max(rawDiscount, 0), subtotal);

  const taxableAmount = subtotal - discountValue;
  const taxValue = taxableAmount * (data.taxRatePercent / 100);
  const total = taxableAmount + taxValue;
  const changeDue = data.amountPaid > total ? data.amountPaid - total : 0;

  return { subtotal, discountValue, taxableAmount, taxValue, total, changeDue };
}

/** Generates a receipt number like "RCP-2026-0001". The sequence number
 *  is randomized rather than incrementing, since this tool has no
 *  server/database to track a running count across sessions — it's a
 *  reasonable-looking default the user can overwrite. */
export function generateReceiptNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const seq = Math.floor(Math.random() * 9999) + 1;
  return `RCP-${year}-${String(seq).padStart(4, "0")}`;
}
