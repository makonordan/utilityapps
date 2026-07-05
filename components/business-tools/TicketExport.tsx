"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  Mail,
  Paperclip,
  X,
} from "lucide-react";

import {
  TEMPLATES_BY_ID,
  buildQrContent,
  type QrContentMode,
  type TemplateDefinition,
  type TicketData,
} from "@/lib/eventTicket";
import { cn } from "@/lib/utils";

import { TicketPreview } from "./EventTicketGenerator";

/**
 * Single-ticket export UI: PDF (ticket-sized), PDF (full A4 page with
 * ticket centred + crop marks), high-res PNG, and an "Email this
 * ticket" flow that combines a fresh PNG download with a mailto: link
 * pre-filled with the event details.
 *
 * Every path renders the ticket into a hidden off-screen container
 * (the same TicketPreview component the visible preview uses) and
 * snapshots it with html2canvas at scale 3 so the printed / emailed
 * output is ~300 DPI at a 5.5" long side — sharp enough for print
 * without generating multi-megabyte PNGs that choke email clients.
 *
 * The QR is regenerated at 800 px for exports so it stays crisp; the
 * on-screen preview uses a 480 px QR to keep the paint cost low as
 * the user types.
 *
 * Nothing hits a server. Even the "email" flow is creator-driven:
 * the browser triggers a PNG download, then opens the user's default
 * mail client with a pre-filled subject and body. The user attaches
 * the downloaded PNG and sends from their own inbox. No SMTP, no
 * mailing lists, no attendee data leaving the device.
 */

// ── Constants ────────────────────────────────────────────────────────────

/** Long side of the ticket in mm (~5.5"). Used for the ticket-size PDF;
 *  short side is computed from the actual canvas aspect ratio so every
 *  template respects its own proportions. */
const TICKET_LONG_SIDE_MM = 140;

/** Off-screen renderer width. Matches BulkTicketPanel so both share
 *  the same visual scale. */
const HIDDEN_LANDSCAPE_WIDTH = 960;
const HIDDEN_PORTRAIT_WIDTH = 480;

type ExportKind = "pdf-ticket" | "pdf-full" | "png" | "email";

// ── Component ────────────────────────────────────────────────────────────

export function TicketExport({
  data,
  template,
  qrMode,
  verificationBaseUrl,
}: {
  data: TicketData;
  template: TemplateDefinition;
  qrMode: QrContentMode;
  verificationBaseUrl: string;
}) {
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailBanner, setEmailBanner] = useState<{ filename: string } | null>(null);
  const [rendered, setRendered] = useState<{ data: TicketData; qrDataUrl: string } | null>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const canExport = useMemo(
    () => data.eventName.trim().length > 0 && !busy,
    [data.eventName, busy]
  );

  /** Set up the hidden off-screen ticket → snapshot it. Returns the
   *  raw canvas so callers can decide PNG vs PDF vs Blob. */
  const renderCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const [{ default: QRCode }, html2canvasModule] = await Promise.all([
      import("qrcode"),
      import("html2canvas"),
    ]);
    const html2canvas = html2canvasModule.default;

    const qrContent = buildQrContent(qrMode, data, verificationBaseUrl);
    const exportData: TicketData = { ...data, qrContent };
    const qrDataUrl = await QRCode.toDataURL(qrContent, {
      // 800 px source is well above the on-screen 480 px — plenty of
      // headroom for print at 300 DPI on a 20 mm QR (~236 px).
      width: 800,
      margin: 1,
      errorCorrectionLevel: qrMode === "json" ? "H" : "M",
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    setRendered({ data: exportData, qrDataUrl });
    await nextPaint();

    const container = hiddenRef.current;
    if (!container) return null;
    return html2canvas(container, {
      // scale 3 lands the printed output above 300 DPI at a 5.5" long
      // side without blowing PNG file sizes past ~500 KB per ticket.
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  }, [data, qrMode, verificationBaseUrl]);

  const withBusy = async (kind: ExportKind, fn: () => Promise<void>) => {
    if (!canExport) return;
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(null);
      setRendered(null);
    }
  };

  // ── Download flows ────────────────────────────────────────────────────

  const downloadPng = () =>
    withBusy("png", async () => {
      const canvas = await renderCanvas();
      if (!canvas) throw new Error("Renderer detached");
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("PNG encode failed");
      downloadBlob(blob, `ticket-${data.ticketId || "unlabeled"}.png`);
    });

  const downloadTicketSizePdf = () =>
    withBusy("pdf-ticket", async () => {
      const canvas = await renderCanvas();
      if (!canvas) throw new Error("Renderer detached");
      const jsPdfModule = await import("jspdf");
      const JsPdf = jsPdfModule.default;
      const aspect = canvas.width / canvas.height;
      const [widthMm, heightMm] =
        aspect >= 1
          ? [TICKET_LONG_SIDE_MM, TICKET_LONG_SIDE_MM / aspect]
          : [TICKET_LONG_SIDE_MM * aspect, TICKET_LONG_SIDE_MM];
      const pdf = new JsPdf({
        orientation: aspect >= 1 ? "landscape" : "portrait",
        unit: "mm",
        // Custom page size = the ticket itself, so what prints is
        // exactly what someone with a ticket-sized cutter or perforator
        // needs.
        format: [widthMm, heightMm],
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        widthMm,
        heightMm
      );
      pdf.save(`ticket-${data.ticketId || "unlabeled"}-print.pdf`);
    });

  const downloadFullPagePdf = () =>
    withBusy("pdf-full", async () => {
      const canvas = await renderCanvas();
      if (!canvas) throw new Error("Renderer detached");
      const jsPdfModule = await import("jspdf");
      const JsPdf = jsPdfModule.default;
      const isPortrait = template.orientation === "vertical";
      const pdf = new JsPdf({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const usableW = pageWidth - margin * 2;
      const usableH = pageHeight - margin * 2;
      const imgRatio = canvas.width / canvas.height;
      const usableRatio = usableW / usableH;
      let drawW: number;
      let drawH: number;
      if (imgRatio >= usableRatio) {
        drawW = usableW;
        drawH = usableW / imgRatio;
      } else {
        drawH = usableH;
        drawW = usableH * imgRatio;
      }
      const drawX = (pageWidth - drawW) / 2;
      const drawY = margin;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", drawX, drawY, drawW, drawH);

      // Human-readable footer under the ticket so if the perforation
      // tears off and only the ticket survives, the ID + attendee
      // still ties back to the guest list.
      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(
        `Ticket ID: ${data.ticketId || "unlabeled"}${data.attendeeName ? "  ·  " + data.attendeeName : ""}`,
        pageWidth / 2,
        drawY + drawH + 8,
        { align: "center" }
      );

      pdf.save(`ticket-${data.ticketId || "unlabeled"}-page.pdf`);
    });

  const emailTicket = () =>
    withBusy("email", async () => {
      // 1. Render + download the PNG first so the file lands on disk
      //    before the mail client takes over.
      const canvas = await renderCanvas();
      if (!canvas) throw new Error("Renderer detached");
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("PNG encode failed");
      const filename = `ticket-${data.ticketId || "unlabeled"}.png`;
      downloadBlob(blob, filename);

      // 2. Tiny beat so Chrome doesn't collapse the download + mailto
      //    into a single navigation event and drop one.
      await new Promise((r) => setTimeout(r, 150));

      // 3. Open the user's mail client with the ticket details
      //    pre-filled. mailto: can't attach files, so the download
      //    above is what the user attaches manually — the persistent
      //    banner below tells them exactly what to do.
      const subject = `Your ticket for ${data.eventName || "the event"}`;
      const body = buildEmailBody(data);
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      setEmailBanner({ filename });
    });

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <section className="mt-4 rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Download
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Print-ready PDF or high-resolution PNG. QR is regenerated at 800 px so it stays crisp.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <ExportButton
          primary
          onClick={downloadTicketSizePdf}
          busy={busy === "pdf-ticket"}
          disabled={!canExport}
          icon={FileText}
          label="PDF · Ticket size"
          hint="5.5″ long side — for a ticket-sized cutter"
        />
        <ExportButton
          onClick={downloadFullPagePdf}
          busy={busy === "pdf-full"}
          disabled={!canExport}
          icon={FileText}
          label="PDF · Full page"
          hint="A4 with the ticket centred — home-printer friendly"
        />
        <ExportButton
          onClick={downloadPng}
          busy={busy === "png"}
          disabled={!canExport}
          icon={ImageIcon}
          label="PNG · High-res"
          hint="~2000 px wide, ready to attach"
        />
        <ExportButton
          onClick={emailTicket}
          busy={busy === "email"}
          disabled={!canExport}
          icon={Mail}
          label="Email this ticket"
          hint="Opens your mail client with details pre-filled"
        />
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {emailBanner && (
        <div className="mt-3 flex items-start justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-3 py-3 text-xs text-primary-900 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
          <div className="flex items-start gap-2">
            <Paperclip className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Your ticket <strong>{emailBanner.filename}</strong> has downloaded. Attach it to the email that just opened, then send.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmailBanner(null)}
            aria-label="Dismiss"
            className="shrink-0 rounded-md p-1 text-primary-700 hover:bg-primary-100 dark:text-primary-200 dark:hover:bg-primary-500/20"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <PrivacyNote />

      {/* Off-screen renderer. Fixed positioning + huge negative offset
          keeps it off-screen; pointer-events:none stops it stealing
          focus. Width is set per template orientation so the aspect
          ratio matches the visible preview. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -99999,
          left: -99999,
          width:
            template.orientation === "vertical"
              ? HIDDEN_PORTRAIT_WIDTH
              : HIDDEN_LANDSCAPE_WIDTH,
          background: "#ffffff",
          padding: 24,
          pointerEvents: "none",
        }}
      >
        <div ref={hiddenRef}>
          {rendered && (
            <TicketPreview
              data={rendered.data}
              qrDataUrl={rendered.qrDataUrl}
              template={TEMPLATES_BY_ID[rendered.data.template]}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

function ExportButton({
  primary,
  onClick,
  busy,
  disabled,
  icon: Icon,
  label,
  hint,
}: {
  primary?: boolean;
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition disabled:opacity-60",
        primary
          ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow hover:from-primary-600 hover:to-accent-600"
          : "border border-surface-200 bg-white text-surface-800 hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          primary ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {label}
          {busy && <span className="text-[10px] font-normal opacity-70">rendering…</span>}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[11px] leading-snug",
            primary ? "text-white/85" : "text-surface-500 dark:text-surface-400"
          )}
        >
          {hint}
        </p>
      </div>
    </button>
  );
}

function PrivacyNote() {
  return (
    <p className="mt-3 flex items-start gap-2 rounded-xl border border-success-200 bg-success-50/50 px-3 py-2 text-[11px] text-success-800 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-200">
      <Info className="mt-0.5 h-3 w-3 shrink-0 text-success-600 dark:text-success-400" />
      <span>
        <strong>You send the tickets from your own email — we never see or store your guest list.</strong>{" "}
        The Email button opens your default mail client with the details pre-filled and downloads a PNG copy for you to attach. Nothing about the recipient touches our servers.
      </span>
    </p>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

function buildEmailBody(data: TicketData): string {
  const lines: string[] = [];
  lines.push(`Hi${data.attendeeName ? " " + data.attendeeName.trim() : ""},`);
  lines.push("");
  lines.push(`Your ticket for ${data.eventName || "the event"} is attached.`);
  lines.push("");
  if (data.eventDate) lines.push(`Date: ${data.eventDate}`);
  if (data.eventTime) lines.push(`Time: ${data.eventTime}`);
  if (data.venue) lines.push(`Venue: ${data.venue}`);
  if (data.ticketType) lines.push(`Ticket type: ${data.ticketType}`);
  if (data.seatInfo) lines.push(`Seat: ${data.seatInfo}`);
  if (data.ticketId) lines.push(`Ticket ID: ${data.ticketId}`);
  lines.push("");
  lines.push(
    "Your ticket is attached to this email. Please bring the QR code (printed or on your phone) to check in at the door."
  );
  if (data.termsText?.trim()) {
    lines.push("");
    lines.push("Fine print: " + data.termsText.trim());
  }
  lines.push("");
  lines.push(
    `See you there${data.organizerName ? ",\n" + data.organizerName : "!"}`
  );
  return lines.join("\n");
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime));
}

/** Wait for React commit + a browser paint before html2canvas grabs
 *  the DOM. Double rAF is the reliable cross-browser way to know a
 *  setState-driven update has actually rendered. */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

