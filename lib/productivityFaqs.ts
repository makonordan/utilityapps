/**
 * Per-tool metadata for the new in-house Productivity Tools (barcode-generator,
 * pomodoro-timer, countdown-timer, invoice-generator). Mirrors lib/imageFaqs
 * and lib/videoFaqs so the rendered FAQ matches the JSON-LD schema exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type ProductivityToolId =
  | "barcode-generator"
  | "pomodoro-timer"
  | "countdown-timer"
  | "invoice-generator";

export interface HowToStep {
  name: string;
  text: string;
}

export const PRODUCTIVITY_FAQS: Record<ProductivityToolId, FAQItem[]> = {
  "barcode-generator": [
    {
      q: "Is the barcode generator free?",
      a: "Yes — every barcode format is free to generate, with no signup, no quota, and no watermark on the output.",
    },
    {
      q: "Which barcode formats are supported?",
      a: "Code 128 (default), Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF (Interleaved 2 of 5), MSI, and Pharmacode. Pick the format that matches what your scanner expects.",
    },
    {
      q: "Are my codes uploaded to a server?",
      a: "No. Barcodes are rendered on a canvas in your browser, then exported as PNG or SVG. Nothing leaves your device.",
    },
    {
      q: "What's the difference between Code 128 and EAN-13?",
      a: "Code 128 is a general-purpose linear barcode used for shipping, inventory, and asset tracking — it accepts any printable ASCII characters. EAN-13 is the 13-digit format printed on retail products worldwide. Use EAN-13 for retail, Code 128 for everything else.",
    },
    {
      q: "Can I export the barcode as SVG?",
      a: "Yes — toggle the format selector to SVG before downloading. SVG scales to any size without pixelation, ideal for print labels.",
    },
    {
      q: "Does the generator validate check digits?",
      a: "Yes. EAN, UPC, and ITF formats validate their check digits automatically. If your input has the wrong number of digits or an invalid check digit, the preview will show an error before you download.",
    },
  ],

  "pomodoro-timer": [
    {
      q: "Is the Pomodoro timer free?",
      a: "Yes — completely free, no signup, no ads in the timer area, no quota.",
    },
    {
      q: "What is the Pomodoro Technique?",
      a: "A time-management method developed by Francesco Cirillo in the late 1980s. You work in focused 25-minute intervals (called 'Pomodoros') separated by 5-minute breaks, with a longer 15–30 minute break after every four intervals. Most people find it dramatically improves focus.",
    },
    {
      q: "Can I customise the work and break lengths?",
      a: "Yes. Click Settings to set work duration, short break, long break, and the number of Pomodoros before a long break. Defaults are the classic 25 / 5 / 15 / 4.",
    },
    {
      q: "Will my task log persist if I close the tab?",
      a: "Yes. Tasks and Pomodoro counts are stored in your browser's local storage, so they're still there next time you open the page on the same device. Clearing browser data wipes them.",
    },
    {
      q: "Does the timer keep running when the tab is in the background?",
      a: "Yes — the timer is driven by absolute timestamps, not setInterval ticks, so it stays accurate even if the browser throttles the tab. A sound plays and the page title updates when each interval ends.",
    },
    {
      q: "Will I get a notification when an interval ends?",
      a: "Yes — the page title flashes, an alert tone plays, and (if you grant permission) a desktop notification fires. Toggle each in Settings.",
    },
  ],

  "countdown-timer": [
    {
      q: "Is the countdown timer free?",
      a: "Yes — free with no signup, no quota, no watermark.",
    },
    {
      q: "Can I count down to any date?",
      a: "Yes — pick any future date and time, including the time zone. The timer shows days, hours, minutes, and seconds remaining and updates every second.",
    },
    {
      q: "Can I embed the countdown on my own site?",
      a: "Yes — once you've set a date, the embed code panel reveals an iframe snippet you can drop into any HTML page or CMS. The embedded version inherits your colour and label.",
    },
    {
      q: "What happens when the countdown hits zero?",
      a: "The timer flips to 'Time's up!' with a pulsing accent. If you supplied a 'When done' message, that's displayed too.",
    },
    {
      q: "Can I share the countdown with someone?",
      a: "Yes — every configuration produces a shareable URL. Copy it, send it, and the recipient sees the same countdown to the same moment.",
    },
    {
      q: "Will the countdown stay accurate across time zones?",
      a: "Yes. Internally it's stored as a UTC timestamp; each viewer's browser converts that to their local clock. Setting a London 9 AM target shows the correct local time to a viewer in New York or Tokyo.",
    },
  ],

  "invoice-generator": [
    {
      q: "Is the invoice generator free?",
      a: "Yes — free with no signup, no quota, no watermark on the PDF. Generate as many invoices as you need.",
    },
    {
      q: "Does it work offline?",
      a: "Yes — once the page is loaded, everything runs locally. The PDF is rendered in your browser using jsPDF, so you can keep generating invoices on a flight.",
    },
    {
      q: "Can I add my logo?",
      a: "Yes — upload a PNG, JPG, or SVG logo and it appears in the invoice header. The logo is embedded directly in the PDF; nothing is uploaded to a server.",
    },
    {
      q: "What currencies are supported?",
      a: "Every common world currency, with the symbol auto-formatted (USD $, EUR €, GBP £, NGN ₦, INR ₹, JPY ¥, etc.). Pick the one your client pays in.",
    },
    {
      q: "Can I save the invoice to send later?",
      a: "Yes — your invoice details are saved automatically to local storage in your browser, so reopening the page brings back the last invoice you were working on. Use the Reset button to clear it.",
    },
    {
      q: "Will the invoice be tax-compliant in my country?",
      a: "The invoice includes the standard fields most jurisdictions require (issuer details, client details, item lines with quantity and unit price, subtotal, tax rate, total, due date). For specific compliance (e.g. fiscal IDs, e-invoicing standards), check your local accounting rules.",
    },
  ],
};

export const PRODUCTIVITY_HOWTOS: Record<ProductivityToolId, HowToStep[]> = {
  "barcode-generator": [
    { name: "Pick a format", text: "Choose Code 128 for general use, EAN-13 for retail products, or any other supported symbology." },
    { name: "Type the data", text: "Enter the value to encode. EAN/UPC formats expect a fixed digit count; Code 128 accepts any printable ASCII." },
    { name: "Tweak the look", text: "Adjust the bar height, line width, and whether to display the human-readable text below the bars." },
    { name: "Download", text: "Click Download to save the barcode as PNG (raster) or SVG (vector, infinitely scalable)." },
  ],
  "pomodoro-timer": [
    { name: "Add a task", text: "Type what you're going to work on and press Add. The task moves to the active queue." },
    { name: "Start the timer", text: "Click Start to begin a 25-minute focus interval. The page title updates with the remaining time so you can see it from any tab." },
    { name: "Take the break", text: "When work ends, the timer auto-switches to a 5-minute short break. Stretch, hydrate, look out the window." },
    { name: "Repeat", text: "After four work intervals you get a longer 15-minute break. Customise any duration in Settings." },
    { name: "Review", text: "Tasks track their completed Pomodoros, so you can see at a glance how long each one actually took." },
  ],
  "countdown-timer": [
    { name: "Pick a date", text: "Choose the target date and time. The picker uses your local time zone by default." },
    { name: "Add a label", text: "Optionally add a title and a short message that displays when the countdown reaches zero." },
    { name: "Customise the look", text: "Pick an accent colour. The shareable URL bakes in your settings so anyone with the link sees the same configuration." },
    { name: "Share or embed", text: "Copy the share link to send to someone, or grab the iframe embed snippet to drop into your own site." },
  ],
  "invoice-generator": [
    { name: "Fill issuer + client details", text: "Enter your business name, address, and contact info. Repeat for the client. Both panels save automatically." },
    { name: "Add line items", text: "Type each service or product, the quantity, and the unit price. Totals update live as you type." },
    { name: "Set tax + payment terms", text: "Add a tax rate (or leave blank), pick a currency, set a due date, and add payment instructions." },
    { name: "Upload your logo", text: "Optional — drop a logo image. It embeds directly in the PDF, no upload to a server." },
    { name: "Download the PDF", text: "Click Download invoice to generate a clean, branded PDF you can email straight to your client." },
  ],
};

export const PRODUCTIVITY_FEATURE_LISTS: Record<ProductivityToolId, string> = {
  "barcode-generator":
    "Code 128, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, ITF, MSI, Pharmacode, PNG and SVG export, in-browser, no upload",
  "pomodoro-timer":
    "Customisable 25/5/15 intervals, task log, persistent local storage, audio + desktop notifications, accurate background timer",
  "countdown-timer":
    "Days/hours/minutes/seconds, time-zone aware, shareable URL, embeddable iframe, custom accent colour, end-of-countdown message",
  "invoice-generator":
    "Branded PDF export, logo upload, multi-currency, tax + discount, auto-saving form, line-item totals, professional template",
};

export const PRODUCTIVITY_TOOL_PUBLISHED = "2026-05-15";

export function getProductivityFaqs(toolId: string): FAQItem[] {
  return PRODUCTIVITY_FAQS[toolId as ProductivityToolId] ?? [];
}

export function getProductivityHowTo(toolId: string): HowToStep[] {
  return PRODUCTIVITY_HOWTOS[toolId as ProductivityToolId] ?? [];
}

export function getProductivityFeatureList(toolId: string): string {
  return PRODUCTIVITY_FEATURE_LISTS[toolId as ProductivityToolId] ?? "";
}

export function productivityToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
    type: "productivity-tool",
  });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
