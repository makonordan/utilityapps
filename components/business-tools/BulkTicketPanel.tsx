"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

import {
  TEMPLATES_BY_ID,
  buildQrContent,
  generateTicketId,
  type QrContentMode,
  type TicketData,
} from "@/lib/eventTicket";
import { cn } from "@/lib/utils";

import { TicketPreview } from "./EventTicketGenerator";

/**
 * Bulk-mode ticket generator. Sits below the shared form sections
 * (template, event details, batch defaults, branding) and drives its
 * own state for the batch of attendees + the actual PDF export.
 *
 * Two input methods, both producing the same ParsedAttendee[] shape
 * that the render loop iterates over:
 *
 *   1. Quantity — "generate N numbered tickets". Sequential
 *      ticket IDs via generateTicketId(prefix, i). No attendee
 *      names; bearer tickets.
 *   2. Named list — pasted names (one per line) or a CSV with
 *      columns name,ticketType,seatInfo. First-row header
 *      auto-detected. Each row becomes a personalised ticket with
 *      its own name + optional per-row ticket type + seat.
 *
 * Generation renders each ticket into an off-screen container using
 * the same TicketPreview component the visible preview uses, snapshots
 * it with html2canvas, and appends the PNG as a page to a jsPDF
 * document. Progress state updates on every ticket so the "Generating
 * ticket 45 of 100" message is real, not simulated.
 *
 * All state lives in this component. Nothing is uploaded to any
 * server — the browser holds every attendee entry, generates every QR
 * locally, rasters every ticket in a hidden div, and streams the
 * final PDF straight to the user's disk via jsPDF's save().
 */

const MAX_TICKETS = 500;
const DEFAULT_QUANTITY = 50;
const DEFAULT_PREFIX = "EVT";

interface ParsedAttendee {
  name: string;
  /** Empty string = fall back to batch default. */
  ticketType: string;
  seatInfo: string;
  ticketId: string;
}

type BulkMethod = "quantity" | "named";

export function BulkTicketPanel({
  baseData,
  qrMode,
  verificationBaseUrl,
}: {
  baseData: TicketData;
  qrMode: QrContentMode;
  verificationBaseUrl: string;
}) {
  const [method, setMethod] = useState<BulkMethod>("quantity");

  // ── Quantity-mode inputs
  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);
  const [prefix, setPrefix] = useState<string>(DEFAULT_PREFIX);

  // ── Named-list mode inputs
  const [rawList, setRawList] = useState<string>("");

  // ── Generation state
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [lastFilename, setLastFilename] = useState<string | null>(null);

  // Hidden off-screen renderer state — updated per ticket during
  // generation so html2canvas can snapshot each one in turn.
  const [renderedTicket, setRenderedTicket] = useState<{
    data: TicketData;
    qrDataUrl: string;
  } | null>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  // ── Compute the effective attendee list from the active method.
  const attendees = useMemo<ParsedAttendee[]>(() => {
    if (method === "quantity") {
      const n = Math.max(0, Math.min(MAX_TICKETS, Math.floor(quantity)));
      const out: ParsedAttendee[] = [];
      for (let i = 1; i <= n; i++) {
        out.push({
          name: "",
          ticketType: "",
          seatInfo: "",
          ticketId: generateTicketId(prefix || DEFAULT_PREFIX, i),
        });
      }
      return out;
    }
    // Named-list mode: parse rawList + assign sequential IDs.
    const parsed = parseAttendeeList(rawList);
    return parsed.map((p, i) => ({
      ...p,
      ticketId: generateTicketId(prefix || DEFAULT_PREFIX, i + 1),
    }));
  }, [method, quantity, prefix, rawList]);

  const removeAttendee = useCallback(
    (index: number) => {
      if (method !== "named") return;
      // Rewrite the raw list minus the removed row so the parsed
      // attendees array stays consistent with what the textarea shows.
      const lines = rawList.split(/\r?\n/);
      const isCsv = lines.some((l) => l.includes(","));
      const start = isCsv && /^\s*name/i.test(lines[0] ?? "") ? 1 : 0;
      const dataRows = lines.slice(start);
      const withoutIndex = dataRows.filter((_, i) => i !== index);
      const header = start > 0 ? [lines[0]] : [];
      setRawList([...header, ...withoutIndex].join("\n"));
    },
    [method, rawList]
  );

  const overCap = attendees.length > MAX_TICKETS;
  const canGenerate =
    attendees.length > 0 && !overCap && !progress;

  // ── Bulk generation ──────────────────────────────────────────────────

  const generateAll = useCallback(async () => {
    if (!canGenerate) return;
    if (!baseData.eventName.trim()) {
      setGenerateError("Event name is required.");
      return;
    }
    setGenerateError(null);
    setLastFilename(null);

    // Dynamic imports so the browser-only libraries never touch the
    // server bundle.
    const [{ default: QRCode }, jsPdfModule, html2canvasModule] = await Promise.all([
      import("qrcode"),
      import("jspdf"),
      import("html2canvas"),
    ]);
    const JsPdf = jsPdfModule.default;
    const html2canvas = html2canvasModule.default;

    const template = TEMPLATES_BY_ID[baseData.template];
    const isPortrait = template.orientation === "vertical";
    const pdf = new JsPdf({
      orientation: isPortrait ? "portrait" : "landscape",
      unit: "mm",
      format: "a4",
    });
    // A4: 210 × 297 mm. Portrait template → tall page, ticket takes
    // most of the top half. Landscape template → wide page, ticket
    // centred in the top area.
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    setProgress({ current: 0, total: attendees.length });

    try {
      for (let i = 0; i < attendees.length; i++) {
        const attendee = attendees[i];
        // Build the merged TicketData for this attendee. Empty per-row
        // fields fall back to the batch defaults from baseData.
        const ticketData: TicketData = {
          ...baseData,
          ticketId: attendee.ticketId,
          attendeeName: attendee.name || baseData.attendeeName,
          ticketType: attendee.ticketType || baseData.ticketType,
          seatInfo: attendee.seatInfo || baseData.seatInfo,
        };
        const qrContent = buildQrContent(qrMode, ticketData, verificationBaseUrl);
        ticketData.qrContent = qrContent;

        const qrDataUrl = await QRCode.toDataURL(qrContent, {
          width: 480,
          margin: 1,
          errorCorrectionLevel: qrMode === "json" ? "H" : "M",
          color: { dark: "#000000", light: "#FFFFFF" },
        });

        setRenderedTicket({ data: ticketData, qrDataUrl });
        setProgress({ current: i + 1, total: attendees.length });

        // Wait for React commit + a browser paint so html2canvas sees
        // the freshly-rendered ticket, not the previous one.
        await nextPaint();

        const container = hiddenRef.current;
        if (!container) throw new Error("Hidden renderer detached");
        const canvas = await html2canvas(container, {
          backgroundColor: "#ffffff",
          useCORS: true,
          scale: 2,
          logging: false,
        });
        const imgData = canvas.toDataURL("image/png");

        // Fit the ticket to the page keeping its aspect ratio, top-
        // centred with a 12mm margin. Keeps room for a "cut here" line
        // and organiser notes.
        const margin = 12;
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

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", drawX, drawY, drawW, drawH);
        // Ticket ID printed below in mono for scanability if someone
        // tears the ticket without the QR.
        pdf.setFontSize(9);
        pdf.setTextColor(120);
        pdf.text(
          `#${attendee.ticketId}${attendee.name ? "  ·  " + attendee.name : ""}`,
          pageWidth / 2,
          drawY + drawH + 6,
          { align: "center" }
        );
      }

      const safeEventName =
        baseData.eventName
          .trim()
          .replace(/[^\w\d]+/g, "-")
          .toLowerCase()
          .slice(0, 40) || "event";
      const filename = `tickets-${safeEventName}-${attendees.length}.pdf`;
      pdf.save(filename);
      setLastFilename(filename);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Ticket generation failed."
      );
    } finally {
      setProgress(null);
      setRenderedTicket(null);
    }
  }, [
    canGenerate,
    baseData,
    qrMode,
    verificationBaseUrl,
    attendees,
  ]);

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Bulk generation
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Pick a method, review the batch, then generate one PDF with a page per ticket. Everything runs in your browser — no attendee list ever reaches our servers.
        </p>
      </header>

      <div className="space-y-4">
        <MethodToggle value={method} onChange={setMethod} />

        {method === "quantity" ? (
          <QuantityInputs
            quantity={quantity}
            onQuantityChange={setQuantity}
            prefix={prefix}
            onPrefixChange={setPrefix}
          />
        ) : (
          <NamedListInputs
            rawList={rawList}
            onRawListChange={setRawList}
            prefix={prefix}
            onPrefixChange={setPrefix}
          />
        )}

        <AttendeeCount
          count={attendees.length}
          max={MAX_TICKETS}
          overCap={overCap}
        />

        {attendees.length > 0 && (
          <AttendeeTable
            attendees={attendees}
            method={method}
            onRemove={removeAttendee}
          />
        )}

        {generateError && (
          <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{generateError}</span>
          </p>
        )}

        {progress && (
          <ProgressBar current={progress.current} total={progress.total} />
        )}

        {lastFilename && !progress && (
          <p className="flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-3 py-2 text-xs text-success-800 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-200">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              Downloaded <strong>{lastFilename}</strong>. Reload the page to reset the form or click Generate again to make another batch.
            </span>
          </p>
        )}

        <button
          type="button"
          onClick={generateAll}
          disabled={!canGenerate}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60",
            "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-glow"
          )}
        >
          {progress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating ticket {progress.current} of {progress.total}…
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              Generate {attendees.length || 0} tickets
            </>
          )}
        </button>
      </div>

      {/* Off-screen renderer — sized to the template aspect so
          html2canvas captures a clean ticket without page chrome. Kept
          absolutely-positioned with a large negative offset so it never
          hits the viewport. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -99999,
          left: -99999,
          width:
            TEMPLATES_BY_ID[baseData.template].orientation === "vertical"
              ? 480
              : 960,
          background: "#ffffff",
          padding: 24,
          pointerEvents: "none",
        }}
      >
        <div ref={hiddenRef}>
          {renderedTicket && (
            <TicketPreview
              data={renderedTicket.data}
              qrDataUrl={renderedTicket.qrDataUrl}
              template={TEMPLATES_BY_ID[renderedTicket.data.template]}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ── Method toggle ─────────────────────────────────────────────────────────

function MethodToggle({
  value,
  onChange,
}: {
  value: BulkMethod;
  onChange: (m: BulkMethod) => void;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-2">
      <MethodCard
        active={value === "quantity"}
        onClick={() => onChange("quantity")}
        icon={Users}
        title="Quantity"
        subtitle="Generate N numbered tickets. No names — bearer tickets with sequential IDs."
      />
      <MethodCard
        active={value === "named"}
        onClick={() => onChange("named")}
        icon={FileText}
        title="Named list / CSV"
        subtitle="Paste one name per line, or a CSV with name, ticketType, seatInfo columns."
      />
    </div>
  );
}

function MethodCard({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 p-3 text-left transition",
        active
          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
          : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
      )}
      aria-pressed={active}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
          active ? "bg-primary-600" : "bg-surface-400 dark:bg-surface-700"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p
          className={cn(
            "text-xs font-semibold",
            active ? "text-primary-800 dark:text-primary-200" : "text-surface-800 dark:text-surface-100"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-surface-500 dark:text-surface-400">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

// ── Quantity inputs ──────────────────────────────────────────────────────

function QuantityInputs({
  quantity,
  onQuantityChange,
  prefix,
  onPrefixChange,
}: {
  quantity: number;
  onQuantityChange: (n: number) => void;
  prefix: string;
  onPrefixChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Quantity
        </span>
        <input
          type="number"
          min={1}
          max={MAX_TICKETS}
          value={quantity}
          onChange={(e) => {
            const raw = e.target.value;
            const n = raw === "" ? 0 : Math.max(0, Math.floor(Number(raw)));
            onQuantityChange(Number.isFinite(n) ? n : 0);
          }}
          className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
        />
        <span className="block text-[11px] text-surface-500">
          Number of tickets to generate. Max {MAX_TICKETS}.
        </span>
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Ticket ID prefix
        </span>
        <input
          value={prefix}
          onChange={(e) => onPrefixChange(e.target.value)}
          maxLength={8}
          className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 font-mono text-sm uppercase text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          placeholder="EVT"
        />
        <span className="block text-[11px] text-surface-500">
          IDs will read like <code>{(prefix || "EVT").toUpperCase()}-{new Date().getFullYear()}-00001</code>.
        </span>
      </label>
    </div>
  );
}

// ── Named list inputs ───────────────────────────────────────────────────

function NamedListInputs({
  rawList,
  onRawListChange,
  prefix,
  onPrefixChange,
}: {
  rawList: string;
  onRawListChange: (v: string) => void;
  prefix: string;
  onPrefixChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/\.(csv|txt)$/i.test(f.name) && !/text\/csv|text\/plain/.test(f.type)) {
      // Accept anyway if extension unusual — org's export could be
      // named differently. Just warn quietly by not erroring.
    }
    const text = await f.text();
    onRawListChange(text);
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Names or CSV
          </span>
          <textarea
            value={rawList}
            onChange={(e) => onRawListChange(e.target.value)}
            placeholder={`Ada Lovelace\nAlan Turing\nGrace Hopper\n\n…or a CSV:\nname,ticketType,seatInfo\nAda Lovelace,VIP,A1\nAlan Turing,General,B4`}
            className="min-h-[160px] w-full resize-y rounded-xl border border-surface-200 bg-white px-3 py-2.5 font-mono text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          />
        </label>
        <div className="space-y-2 sm:pt-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-primary-300 dark:border-surface-800 dark:text-surface-200"
          >
            <Upload className="h-3 w-3" />
            Upload CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={onFile}
            className="hidden"
          />
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            .csv or .txt — replaces the textarea contents.
          </p>
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Ticket ID prefix
        </span>
        <input
          value={prefix}
          onChange={(e) => onPrefixChange(e.target.value)}
          maxLength={8}
          className="w-full max-w-xs rounded-xl border border-surface-200 bg-white px-3 py-2.5 font-mono text-sm uppercase text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          placeholder="EVT"
        />
      </label>

      <div className="flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50/60 p-3 text-[11px] text-primary-900 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          First row is treated as a header only if it starts with <code>name</code>. Any of the three columns (name, ticketType, seatInfo) can be left blank — batch defaults from the sections above fill them in.
        </p>
      </div>
    </div>
  );
}

// ── Attendee count / cap indicator ──────────────────────────────────────

function AttendeeCount({
  count,
  max,
  overCap,
}: {
  count: number;
  max: number;
  overCap: boolean;
}) {
  if (count === 0) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-xs",
        overCap
          ? "border border-red-200 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
          : "border border-surface-200 bg-surface-50 text-surface-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
      )}
    >
      {overCap ? (
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-600" />
      )}
      <span>
        <strong>{count.toLocaleString()}</strong> ticket{count === 1 ? "" : "s"} in this batch{" "}
        {overCap && (
          <>
            —{" "}
            <span className="font-semibold">
              exceeds the {max} browser-safe limit. Trim the list or split into multiple batches.
            </span>
          </>
        )}
      </span>
    </div>
  );
}

// ── Preview table ───────────────────────────────────────────────────────

function AttendeeTable({
  attendees,
  method,
  onRemove,
}: {
  attendees: ParsedAttendee[];
  method: BulkMethod;
  onRemove: (index: number) => void;
}) {
  const showRemove = method === "named";
  // Cap the visible rows so an 500-row textarea doesn't blow out the
  // form; expose a count of hidden rows if truncated.
  const DISPLAY_CAP = 25;
  const shown = attendees.slice(0, DISPLAY_CAP);
  const hiddenRows = attendees.length - shown.length;

  return (
    <div className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-surface-50 text-[10px] uppercase tracking-wider text-surface-500 dark:bg-surface-900/60 dark:text-surface-400">
            <tr>
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Seat</th>
              <th className="px-3 py-2 font-semibold">Ticket ID</th>
              {showRemove && <th className="px-3 py-2" aria-label="Remove" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {shown.map((a, i) => (
              <tr key={`${a.ticketId}-${i}`}>
                <td className="px-3 py-2 font-mono text-surface-500">{i + 1}</td>
                <td className="px-3 py-2 text-surface-900 dark:text-surface-100">
                  {a.name || <span className="text-surface-400">—</span>}
                </td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-300">
                  {a.ticketType || <span className="text-surface-400">default</span>}
                </td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-300">
                  {a.seatInfo || <span className="text-surface-400">—</span>}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-surface-800 dark:text-surface-200">
                  {a.ticketId}
                </td>
                {showRemove && (
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="inline-flex items-center rounded-md p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      aria-label={`Remove ${a.name || `ticket ${i + 1}`}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenRows > 0 && (
        <p className="border-t border-surface-100 bg-surface-50 px-3 py-2 text-[11px] text-surface-500 dark:border-surface-800 dark:bg-surface-900/60 dark:text-surface-400">
          Showing the first {DISPLAY_CAP} of {attendees.length}. All will be generated when you click below.
        </p>
      )}
    </div>
  );
}

// ── Progress bar ────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / Math.max(total, 1)) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-semibold text-surface-800 dark:text-surface-100">
          Generating…
        </span>
        <span className="tabular-nums text-surface-500">
          {current} / {total} · {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── CSV / name-list parser ──────────────────────────────────────────────

/**
 * Parse the pasted textarea contents into an attendee list. Handles
 * both name-per-line and CSV (name,ticketType,seatInfo) forms. First-
 * row header auto-detected: if the first row starts with the literal
 * word "name" (case-insensitive) it's treated as a header. Empty rows
 * are dropped.
 */
function parseAttendeeList(text: string): Omit<ParsedAttendee, "ticketId">[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const anyCommas = lines.some((l) => l.includes(","));
  const start = anyCommas && /^\s*name/i.test(lines[0]) ? 1 : 0;
  const rows = lines.slice(start);
  return rows
    .map((line): Omit<ParsedAttendee, "ticketId"> => {
      if (!anyCommas) {
        return { name: line, ticketType: "", seatInfo: "" };
      }
      const cols = parseCsvRow(line);
      return {
        name: (cols[0] ?? "").trim(),
        ticketType: (cols[1] ?? "").trim(),
        seatInfo: (cols[2] ?? "").trim(),
      };
    })
    .filter((a) => a.name);
}

/** Minimal CSV row parser — handles unquoted, quoted, and quote-
 *  escaped ("") fields. Doesn't support embedded newlines inside
 *  quotes, which would need a whole-file parser rather than a
 *  per-line one; that's fine for our use case (rows come from
 *  spreadsheet exports where each row is a single line). */
function parseCsvRow(row: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuote = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (inQuote) {
      if (ch === '"' && row[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuote = false;
      } else {
        current += ch;
      }
    } else if (ch === ",") {
      out.push(current);
      current = "";
    } else if (ch === '"' && current === "") {
      inQuote = true;
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

// ── Async helpers ───────────────────────────────────────────────────────

/** Wait for React to commit + the browser to paint. Double
 *  requestAnimationFrame is the reliable cross-browser signal that a
 *  DOM update from setState has been rendered — html2canvas snapshots
 *  what's currently painted, so we need to wait for the ticket to
 *  actually appear before capturing. */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}
