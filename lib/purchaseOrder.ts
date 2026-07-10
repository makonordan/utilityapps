/**
 * Data + constants for the Purchase Order Generator tool at
 * /tools/purchase-order-generator.
 *
 * This file is pure TypeScript — no React, no browser APIs, no client
 * directive. It's imported by both server (metadata, structured data) and
 * client (form + preview) code, and by the PDF (jspdf) and image
 * (html2canvas) exporters, so all of them agree on the same totals math
 * and the same template/currency options.
 *
 * Everything here runs 100% in the browser. There is no auth, no
 * database, and no server round-trip — buyer and supplier details never
 * leave the device.
 */

export { CURRENCIES, CURRENCIES_BY_CODE, DEFAULT_CURRENCY, formatCurrency, type DiscountType } from "./receipt";

import type { DiscountType } from "./receipt";

// ── Templates ────────────────────────────────────────────────────────────

export type TemplateId = "standard" | "modern-header" | "minimal";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "standard",
    name: "Standard",
    description: "A clean, traditional purchase order with side-by-side buyer/supplier blocks and a ruled item table.",
  },
  {
    id: "modern-header",
    name: "Modern Header",
    description: "A colored header band in your brand color, with buyer and supplier details below it.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "No color, no rules beyond what's needed — just the parties, items, and totals.",
  },
];

export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TemplateId, TemplateDefinition>
);

export const DEFAULT_TEMPLATE: TemplateId = "standard";

// ── Purchase order data ──────────────────────────────────────────────────

export interface POItem {
  id: string;
  description: string;
  /** Stock-keeping unit / product code. Optional. */
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderData {
  // Buyer (your company) — the party issuing the PO.
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  /** Public URL to an uploaded/hosted logo. */
  buyerLogoUrl: string;

  // Supplier / vendor — the party fulfilling the order.
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supplierEmail: string;

  // PO meta.
  poNumber: string;
  /** ISO date string (yyyy-mm-dd). */
  poDate: string;
  /** ISO date string (yyyy-mm-dd). Optional. */
  expectedDeliveryDate: string;
  /** Optional — defaults to buyerAddress when left blank. */
  shippingAddress: string;
  /** e.g. "Standard ground", "Express", "Freight". Optional. */
  shippingMethod: string;

  // Items.
  lineItems: POItem[];
  taxRatePercent: number;
  shippingCost: number;
  discountAmount: number;
  discountType: DiscountType;

  /** ISO 4217 code, must be one of CURRENCIES[].code. */
  currency: string;
  termsAndConditions: string;
  notes: string;
  /** Name of the person who approved/issued the PO. */
  authorizedBy: string;

  /** Hex color used for accents on the modern-header template. */
  primaryColor: string;
  template: TemplateId;
}

export interface POTotals {
  subtotal: number;
  discountValue: number;
  taxValue: number;
  shippingCost: number;
  total: number;
}

/** Subtotal, discount, tax, shipping, and total — shared by the live
 *  preview and the PDF/image exporters so the numbers always agree.
 *  discountValue is clamped so it can never exceed the subtotal, and tax
 *  is computed on the discounted (subtotal - discount) amount, not the
 *  raw subtotal. Shipping cost is added after tax, since shipping is
 *  usually not itself taxed on a PO. */
export function computePOTotals(data: PurchaseOrderData): POTotals {
  const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const rawDiscount =
    data.discountType === "percent" ? subtotal * (data.discountAmount / 100) : data.discountAmount;
  const discountValue = Math.min(Math.max(rawDiscount, 0), subtotal);

  const taxableAmount = subtotal - discountValue;
  const taxValue = taxableAmount * (data.taxRatePercent / 100);
  const shippingCost = Math.max(data.shippingCost, 0);
  const total = taxableAmount + taxValue + shippingCost;

  return { subtotal, discountValue, taxValue, shippingCost, total };
}

/** Generates a PO number like "PO-2026-0001". The sequence number is
 *  randomized rather than incrementing, since this tool has no
 *  server/database to track a running count across sessions — it's a
 *  reasonable-looking default the user can overwrite. */
export function generatePONumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const seq = Math.floor(Math.random() * 9999) + 1;
  return `PO-${year}-${String(seq).padStart(4, "0")}`;
}
