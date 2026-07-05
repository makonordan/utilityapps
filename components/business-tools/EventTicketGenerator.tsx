"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { HexColorPicker } from "react-colorful";
import {
  AlertTriangle,
  ChevronDown,
  Info,
  Link2,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

import {
  TEMPLATES,
  TEMPLATES_BY_ID,
  buildQrContent,
  generateRandomTicketId,
  type QrContentMode,
  type TemplateDefinition,
  type TemplateId,
  type TicketData,
} from "@/lib/eventTicket";
import { cn } from "@/lib/utils";

import { BulkTicketPanel } from "./BulkTicketPanel";

export type TicketMode = "single" | "bulk";

/**
 * /tools/event-ticket-generator client component.
 *
 * Left panel: 5 stacked form sections (Template, Event details, Ticket
 * details, Check-in QR, Branding). Right panel: live ticket preview
 * that re-renders on every keystroke, with a real QR code generated
 * client-side by the `qrcode` npm library.
 *
 * All rendering is browser-side. The only network call is the OPTIONAL
 * image upload (logo, banner) — the existing anonymous
 * /api/email-signature/upload endpoint accepts these uploads without
 * signup and lands them in the shared bc-avatars bucket. Users can
 * also paste an existing image URL.
 *
 * qrcode is imported dynamically inside an effect so its browser-only
 * canvas APIs never touch the server bundle.
 */

// ── Ticket-type quick-preset chips ──────────────────────────────────────

const TICKET_TYPE_PRESETS = [
  "General Admission",
  "VIP",
  "Early Bird",
  "Student",
  "Staff",
] as const;

// ── Initial state ──────────────────────────────────────────────────────

function makeInitialData(): TicketData {
  return {
    eventName: "",
    eventTagline: "",
    organizerName: "",
    venue: "",
    eventDate: "",
    eventTime: "",
    ticketType: "General Admission",
    seatInfo: "",
    price: "Free",
    // Generate a fresh random ID on mount so the preview isn't empty.
    ticketId: generateRandomTicketId(),
    attendeeName: "",
    logoUrl: "",
    backgroundImageUrl: "",
    primaryColor: "#3B82F6",
    accentColor: "#8B5CF6",
    template: "classic-stub",
    qrContent: "",
    termsText: "",
  };
}

// ── Main component ─────────────────────────────────────────────────────

export function EventTicketGenerator() {
  const [data, setData] = useState<TicketData>(makeInitialData);
  const [qrMode, setQrMode] = useState<QrContentMode>("ticket-id");
  const [verificationBaseUrl, setVerificationBaseUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [mode, setMode] = useState<TicketMode>("single");

  const qrContent = useMemo(
    () => buildQrContent(qrMode, data, verificationBaseUrl),
    [qrMode, data, verificationBaseUrl]
  );

  // Feed the resolved qrContent back into the TicketData so it's available
  // for the follow-up PDF/PNG export path without re-computing there.
  useEffect(() => {
    setData((prev) => (prev.qrContent === qrContent ? prev : { ...prev, qrContent }));
  }, [qrContent]);

  // Render the check-in QR to a data URL whenever the payload changes.
  // qrcode is loaded lazily so its canvas API never touches the server
  // bundle. Debounced by delaying the render until qrContent is truthy
  // and stable across a microtask — form updates are already batched by
  // React so an explicit debounce isn't necessary.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!qrContent) {
        setQrDataUrl("");
        return;
      }
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(qrContent, {
          width: 480,
          margin: 1,
          errorCorrectionLevel: qrMode === "json" ? "H" : "M",
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qrContent, qrMode]);

  const set = useCallback(
    <K extends keyof TicketData>(key: K, value: TicketData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const regenerateTicketId = useCallback(() => {
    setData((prev) => ({ ...prev, ticketId: generateRandomTicketId() }));
  }, []);

  const nameError = !data.eventName.trim() ? "Event name is required" : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[55%_45%]">
      {/* Mobile-first: preview above the form on small screens. */}
      <aside className="order-first lg:order-last lg:sticky lg:top-24 lg:h-fit">
        <PreviewPanel
          data={data}
          qrDataUrl={qrDataUrl}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </aside>

      <div className="space-y-6">
        <ModeToggle value={mode} onChange={setMode} />

        {nameError && (
          <p className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
            <AlertTriangle className="h-3 w-3" /> {nameError}
          </p>
        )}

        <TemplatePickerSection value={data.template} onChange={(t) => set("template", t)} />

        <EventDetailsSection data={data} onChange={set} />

        <TicketDetailsSection
          data={data}
          onChange={set}
          onRegenerateId={regenerateTicketId}
          mode={mode}
        />

        <CheckInQrSection
          mode={qrMode}
          onModeChange={setQrMode}
          verificationBaseUrl={verificationBaseUrl}
          onVerificationBaseUrlChange={setVerificationBaseUrl}
          resolvedQrContent={qrContent}
        />

        <BrandingSection data={data} onChange={set} />

        {mode === "bulk" && (
          <BulkTicketPanel
            baseData={data}
            qrMode={qrMode}
            verificationBaseUrl={verificationBaseUrl}
          />
        )}
      </div>
    </div>
  );
}

// ── Template picker ─────────────────────────────────────────────────────

function TemplatePickerSection({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}) {
  return (
    <Section
      title="Template"
      subtitle="Pick a layout — you can switch anytime without losing your details."
    >
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {TEMPLATES.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl border-2 text-left transition",
                active
                  ? "border-primary-500 shadow-glow"
                  : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
              )}
              aria-pressed={active}
            >
              <div
                className={cn(
                  "w-full",
                  t.orientation === "vertical" ? "aspect-[10/18]" : "aspect-[9/5]"
                )}
                // Thumbnails are static author-controlled SVG data — safe.
                dangerouslySetInnerHTML={{ __html: t.thumbnail }}
              />
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
                <p className="mt-0.5 text-[10px] leading-snug text-surface-500 dark:text-surface-400 line-clamp-2">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

// ── Event details section ───────────────────────────────────────────────

function EventDetailsSection({
  data,
  onChange,
}: {
  data: TicketData;
  onChange: <K extends keyof TicketData>(key: K, value: TicketData[K]) => void;
}) {
  return (
    <Section title="Event details">
      <div className="space-y-4">
        <Field label="Event name" required>
          <input
            value={data.eventName}
            onChange={(e) => onChange("eventName", e.target.value)}
            className={inputCls}
            placeholder="Lagos Design Meetup"
            maxLength={120}
          />
        </Field>
        <Field label="Tagline" hint="One-line hook shown under the title.">
          <input
            value={data.eventTagline}
            onChange={(e) => onChange("eventTagline", e.target.value)}
            className={inputCls}
            placeholder="Ship better UI, faster."
            maxLength={100}
          />
        </Field>
        <Grid>
          <Field label="Organizer">
            <input
              value={data.organizerName}
              onChange={(e) => onChange("organizerName", e.target.value)}
              className={inputCls}
              placeholder="UtilityApps"
              maxLength={80}
            />
          </Field>
          <Field label="Venue">
            <input
              value={data.venue}
              onChange={(e) => onChange("venue", e.target.value)}
              className={inputCls}
              placeholder="Impact Hub, Lagos"
              maxLength={80}
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={data.eventDate}
              onChange={(e) => onChange("eventDate", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              value={data.eventTime}
              onChange={(e) => onChange("eventTime", e.target.value)}
              className={inputCls}
            />
          </Field>
        </Grid>
      </div>
    </Section>
  );
}

// ── Ticket details section ──────────────────────────────────────────────

function TicketDetailsSection({
  data,
  onChange,
  onRegenerateId,
  mode,
}: {
  data: TicketData;
  onChange: <K extends keyof TicketData>(key: K, value: TicketData[K]) => void;
  onRegenerateId: () => void;
  /** In bulk mode, per-attendee fields (name, seat, ticket ID) are
   *  driven by the batch and hidden from this section. Ticket type,
   *  price, and terms remain here as batch defaults. */
  mode: TicketMode;
}) {
  const isBulk = mode === "bulk";
  return (
    <Section
      title={isBulk ? "Ticket defaults (apply to every ticket in the batch)" : "Ticket details"}
    >
      <div className="space-y-4">
        <Field label="Ticket type" hint={isBulk ? "Batch default — CSV rows can override per attendee." : undefined}>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {TICKET_TYPE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange("ticketType", preset)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                  data.ticketType === preset
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
                )}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            value={data.ticketType}
            onChange={(e) => onChange("ticketType", e.target.value)}
            className={inputCls}
            placeholder="General Admission"
            maxLength={40}
          />
        </Field>
        <Grid>
          {!isBulk && (
            <Field label="Seat info" hint='Optional — e.g. "Row A, Seat 12"'>
              <input
                value={data.seatInfo}
                onChange={(e) => onChange("seatInfo", e.target.value)}
                className={inputCls}
                placeholder="Row A · Seat 12"
                maxLength={60}
              />
            </Field>
          )}
          <Field label="Price" hint="Display only — no payment processing.">
            <input
              value={data.price}
              onChange={(e) => onChange("price", e.target.value)}
              className={inputCls}
              placeholder="Free"
              maxLength={40}
            />
          </Field>
          {!isBulk && (
            <Field label="Attendee name" hint="Personalise the ticket. Leave blank for bearer tickets.">
              <input
                value={data.attendeeName}
                onChange={(e) => onChange("attendeeName", e.target.value)}
                className={inputCls}
                placeholder="Daniel Makonor"
                maxLength={80}
              />
            </Field>
          )}
          {!isBulk && (
            <Field label="Ticket ID" hint="Encoded in the check-in QR.">
              <div className="flex gap-2">
                <input
                  value={data.ticketId}
                  onChange={(e) => onChange("ticketId", e.target.value)}
                  className={cn(inputCls, "font-mono uppercase")}
                  maxLength={40}
                />
                <button
                  type="button"
                  onClick={onRegenerateId}
                  title="Generate a new random ID"
                  className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-surface-200 px-3 text-xs font-semibold text-surface-700 transition hover:border-primary-300 dark:border-surface-800 dark:text-surface-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </Field>
          )}
        </Grid>
        <Field label="Terms / fine print" hint="Optional — refund policy, ID requirement, transfer rules.">
          <textarea
            value={data.termsText}
            onChange={(e) => onChange("termsText", e.target.value)}
            className={cn(inputCls, "min-h-[72px] resize-y")}
            maxLength={500}
            placeholder="Non-refundable. Valid ID required for entry."
          />
        </Field>
      </div>
    </Section>
  );
}

// ── Mode toggle ────────────────────────────────────────────────────────

function ModeToggle({
  value,
  onChange,
}: {
  value: TicketMode;
  onChange: (m: TicketMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Ticket generation mode"
      className="inline-flex rounded-2xl border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900"
    >
      {(["single", "bulk"] as const).map((m) => {
        const active = value === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "rounded-xl px-4 py-1.5 text-sm font-semibold transition",
              active
                ? "bg-primary-500 text-white shadow-sm"
                : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            )}
          >
            {m === "single" ? "Single ticket" : "Bulk tickets"}
          </button>
        );
      })}
    </div>
  );
}

// ── Check-in QR section ─────────────────────────────────────────────────

function CheckInQrSection({
  mode,
  onModeChange,
  verificationBaseUrl,
  onVerificationBaseUrlChange,
  resolvedQrContent,
}: {
  mode: QrContentMode;
  onModeChange: (m: QrContentMode) => void;
  verificationBaseUrl: string;
  onVerificationBaseUrlChange: (v: string) => void;
  resolvedQrContent: string;
}) {
  return (
    <Section title="Check-in QR">
      <div className="space-y-3">
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            What the QR encodes
          </span>
          <div className="grid gap-1.5 sm:grid-cols-3">
            <ModeButton
              active={mode === "ticket-id"}
              onClick={() => onModeChange("ticket-id")}
              title="Ticket ID"
              subtitle="Just the code. Works with any scanner."
            />
            <ModeButton
              active={mode === "url"}
              onClick={() => onModeChange("url")}
              title="Verification URL"
              subtitle="Points scanners at your own check-in page."
            />
            <ModeButton
              active={mode === "json"}
              onClick={() => onModeChange("json")}
              title="JSON payload"
              subtitle="Event + ID + name for custom scanners."
            />
          </div>
        </div>

        {mode === "url" && (
          <Field label="Verification base URL" hint="We'll append ?id=<ticket id> to this.">
            <input
              type="url"
              value={verificationBaseUrl}
              onChange={(e) => onVerificationBaseUrlChange(e.target.value)}
              className={inputCls}
              placeholder="https://myevent.com/verify"
            />
          </Field>
        )}

        {/* Honest explainer — this tool doesn't run door check-in. */}
        <div className="flex items-start gap-2 rounded-2xl border border-primary-200 bg-primary-50/60 p-3 text-xs text-primary-900 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            The QR code contains this ticket's unique ID. To check people in,{" "}
            <strong>scan the code and match the ID against your guest list</strong> —
            or use Verification URL mode to link to your own system. This tool
            creates tickets; it doesn't run the door check-in.
          </p>
        </div>

        {/* Live preview of what will actually be encoded. Useful for
            organisers wiring their own scanner — they can copy the
            expected format straight from here. */}
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            QR contents preview
          </span>
          <pre className="max-h-24 overflow-auto rounded-xl border border-surface-200 bg-surface-50 p-2.5 font-mono text-[11px] text-surface-800 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100">
            {resolvedQrContent || " "}
          </pre>
        </div>
      </div>
    </Section>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 p-3 text-left transition",
        active
          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
          : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
      )}
      aria-pressed={active}
    >
      <p
        className={cn(
          "text-xs font-semibold",
          active ? "text-primary-800 dark:text-primary-200" : "text-surface-800 dark:text-surface-100"
        )}
      >
        {title}
      </p>
      <p className="mt-0.5 text-[10px] leading-snug text-surface-500 dark:text-surface-400">
        {subtitle}
      </p>
    </button>
  );
}

// ── Branding section ────────────────────────────────────────────────────

function BrandingSection({
  data,
  onChange,
}: {
  data: TicketData;
  onChange: <K extends keyof TicketData>(key: K, value: TicketData[K]) => void;
}) {
  return (
    <Section title="Branding">
      <div className="space-y-4">
        <ImagePicker
          label="Organizer logo"
          value={data.logoUrl}
          onChange={(url) => onChange("logoUrl", url)}
          onClear={() => onChange("logoUrl", "")}
          kind="logo"
          maxSide={300}
          maxKb={80}
        />
        <ImagePicker
          label="Event banner (optional)"
          value={data.backgroundImageUrl}
          onChange={(url) => onChange("backgroundImageUrl", url)}
          onClear={() => onChange("backgroundImageUrl", "")}
          kind="banner"
          maxSide={1200}
          maxKb={400}
          hint="Used as a background image on the Concert and Modern-Gradient templates."
        />
        <Grid>
          <ColorField
            label="Primary color"
            value={data.primaryColor}
            onChange={(v) => onChange("primaryColor", v)}
          />
          <ColorField
            label="Accent color"
            value={data.accentColor}
            onChange={(v) => onChange("accentColor", v)}
          />
        </Grid>
      </div>
    </Section>
  );
}

// ── Preview panel ───────────────────────────────────────────────────────

function PreviewPanel({
  data,
  qrDataUrl,
  open,
  onOpenChange,
}: {
  data: TicketData;
  qrDataUrl: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const template = TEMPLATES_BY_ID[data.template];
  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
            Download for print-ready quality.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          className="rounded-lg border border-surface-200 p-1.5 text-surface-500 lg:hidden dark:border-surface-800 dark:text-surface-300"
          aria-label={open ? "Hide preview" : "Show preview"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
        </button>
      </div>
      {open && (
        <div className="flex justify-center rounded-2xl bg-surface-100 p-4 dark:bg-surface-950/40">
          <TicketPreview data={data} qrDataUrl={qrDataUrl} template={template} />
        </div>
      )}
    </div>
  );
}

// ── Ticket preview switch ───────────────────────────────────────────────

/** Ticket-data + QR needed by every template preview. Exported so
 *  BulkTicketPanel can reuse the same shape when driving its hidden
 *  off-screen renderer. */
export interface TicketPreviewProps {
  data: TicketData;
  qrDataUrl: string;
  template: TemplateDefinition;
}

export function TicketPreview({
  data,
  qrDataUrl,
  template,
}: TicketPreviewProps) {
  switch (template.id) {
    case "classic-stub":
      return <ClassicStubTicket data={data} qrDataUrl={qrDataUrl} />;
    case "modern-gradient":
      return <ModernGradientTicket data={data} qrDataUrl={qrDataUrl} />;
    case "concert":
      return <ConcertTicket data={data} qrDataUrl={qrDataUrl} />;
    case "vip-pass":
      return <VipPassTicket data={data} qrDataUrl={qrDataUrl} />;
    case "minimal":
      return <MinimalTicket data={data} qrDataUrl={qrDataUrl} />;
    case "wristband":
      return <WristbandTicket data={data} qrDataUrl={qrDataUrl} />;
    default:
      return <ClassicStubTicket data={data} qrDataUrl={qrDataUrl} />;
  }
}

// ── Template previews ───────────────────────────────────────────────────
//
// Each preview is intentionally self-contained rather than sharing a
// "ticket chrome" abstraction — the layouts differ enough that
// consolidation would end up as if/else soup.

function formatDate(iso: string): string {
  if (!iso) return "Date TBD";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function formatTime(t: string): string {
  if (!t) return "Time TBD";
  return t;
}

// eslint-disable-next-line @next/next/no-img-element
const QrImg = ({ src, size = 96 }: { src: string; size?: number }) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Check-in QR code"
      width={size}
      height={size}
      style={{ imageRendering: "pixelated" as const, display: "block" }}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded bg-surface-200 text-[10px] text-surface-500"
    >
      QR
    </div>
  );

/** Horizontal ticket with a perforated tear-off stub on the right. */
function ClassicStubTicket({ data, qrDataUrl }: TicketProps) {
  return (
    <div
      className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-lg"
      style={{ aspectRatio: "5 / 2" }}
    >
      <div className="flex h-full">
        {/* Body */}
        <div className="flex flex-1 flex-col p-4 text-slate-900">
          <div className="flex items-center gap-2">
            {data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="" className="h-6 w-6 object-contain" />
            )}
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: data.accentColor }}
            >
              {data.ticketType || "Admission"}
            </span>
          </div>
          <h3
            className="mt-2 text-lg font-bold leading-tight sm:text-xl"
            style={{ color: data.primaryColor }}
          >
            {data.eventName || "Your event name"}
          </h3>
          {data.eventTagline && (
            <p className="mt-0.5 text-[11px] text-slate-600">{data.eventTagline}</p>
          )}
          <div className="mt-auto grid grid-cols-3 gap-2 text-[10px]">
            <DetailBlock label="Date" value={formatDate(data.eventDate)} />
            <DetailBlock label="Time" value={formatTime(data.eventTime)} />
            <DetailBlock label="Price" value={data.price || "Free"} />
            {data.venue && <DetailBlock label="Venue" value={data.venue} />}
            {data.seatInfo && <DetailBlock label="Seat" value={data.seatInfo} />}
            {data.attendeeName && (
              <DetailBlock label="Attendee" value={data.attendeeName} />
            )}
          </div>
        </div>
        {/* Perforation */}
        <div
          aria-hidden="true"
          className="my-3 border-l-2 border-dashed border-slate-300"
        />
        {/* Stub */}
        <div className="flex w-[26%] flex-col items-center justify-center gap-1 p-2">
          <QrImg src={qrDataUrl} size={80} />
          <p className="mt-1 max-w-full break-all text-center font-mono text-[8px] leading-tight text-slate-700">
            {data.ticketId}
          </p>
          <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
            Admit One
          </p>
        </div>
      </div>
    </div>
  );
}

/** Full-bleed gradient with a clean layout. */
function ModernGradientTicket({ data, qrDataUrl }: TicketProps) {
  const bg = data.backgroundImageUrl
    ? `url(${data.backgroundImageUrl})`
    : `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.accentColor} 100%)`;
  return (
    <div
      className="w-full max-w-[520px] overflow-hidden rounded-2xl text-white shadow-lg"
      style={{
        aspectRatio: "5 / 2",
        background: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-full items-stretch bg-black/10 backdrop-blur-[1px]">
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center gap-2">
            {data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logoUrl}
                alt=""
                className="h-6 w-6 rounded-full bg-white/20 object-contain p-0.5"
              />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
              {data.ticketType || "Admission"}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-tight sm:text-2xl">
            {data.eventName || "Your event name"}
          </h3>
          {data.eventTagline && (
            <p className="mt-0.5 text-[11px] text-white/80">{data.eventTagline}</p>
          )}
          <div className="mt-auto space-y-0.5 text-[11px] text-white/85">
            <p>{formatDate(data.eventDate)} · {formatTime(data.eventTime)}</p>
            {data.venue && <p>{data.venue}</p>}
            {data.seatInfo && <p className="text-white/90">{data.seatInfo}</p>}
          </div>
        </div>
        <div className="flex w-[28%] flex-col items-center justify-center p-3">
          <div className="rounded-lg bg-white p-1.5">
            <QrImg src={qrDataUrl} size={80} />
          </div>
          <p className="mt-2 max-w-full break-all text-center font-mono text-[8px] text-white/85">
            {data.ticketId}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Image-forward layout — event banner as background, details in a
 *  white band along the bottom. */
function ConcertTicket({ data, qrDataUrl }: TicketProps) {
  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-lg"
      style={{ aspectRatio: "3 / 1.4" }}
    >
      <div className="relative h-[65%] w-full overflow-hidden bg-slate-900">
        {data.backgroundImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.backgroundImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.accentColor} 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          {data.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoUrl} alt="" className="mb-2 h-7 w-7 object-contain" />
          )}
          <span
            className="w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: data.accentColor, color: "white" }}
          >
            {data.ticketType || "Admission"}
          </span>
          <h3 className="mt-1 text-lg font-bold leading-tight sm:text-2xl">
            {data.eventName || "Your event name"}
          </h3>
          {data.eventTagline && (
            <p className="text-[11px] text-white/85">{data.eventTagline}</p>
          )}
        </div>
      </div>
      <div className="flex h-[35%] items-center justify-between px-4 py-2 text-slate-900">
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
          <DetailBlock label="Date" value={formatDate(data.eventDate)} />
          <DetailBlock label="Time" value={formatTime(data.eventTime)} />
          {data.venue && <DetailBlock label="Venue" value={data.venue} />}
          {data.seatInfo && <DetailBlock label="Seat" value={data.seatInfo} />}
        </div>
        <div className="flex items-center gap-2">
          <p className="max-w-[80px] break-all text-right font-mono text-[8px] text-slate-500">
            {data.ticketId}
          </p>
          <QrImg src={qrDataUrl} size={56} />
        </div>
      </div>
    </div>
  );
}

/** Portrait lanyard-style pass. Uses the dark chrome from the thumbnail. */
function VipPassTicket({ data, qrDataUrl }: TicketProps) {
  return (
    <div
      className="w-full max-w-[280px] overflow-hidden rounded-2xl text-white shadow-2xl"
      style={{
        aspectRatio: "3 / 5",
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
      }}
    >
      <div className="flex h-full flex-col p-4">
        {/* Lanyard hole */}
        <div className="mx-auto mb-3 h-2 w-14 rounded-full bg-white/30" />
        {/* Logo circle */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 p-2">
          {data.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoUrl} alt="" className="h-full w-full rounded-full object-contain" />
          ) : (
            <div
              className="h-full w-full rounded-full"
              style={{ background: data.primaryColor }}
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: data.accentColor }}
          >
            {data.ticketType || "VIP"}
          </span>
          <h3 className="mt-2 text-base font-bold leading-tight" style={{ color: data.primaryColor }}>
            {data.eventName || "Your event name"}
          </h3>
          {data.eventTagline && (
            <p className="mt-0.5 text-[11px] text-white/70">{data.eventTagline}</p>
          )}
        </div>
        <div className="my-3 border-t border-white/15" />
        <div className="space-y-1 text-center text-[10px] text-white/80">
          <p>{formatDate(data.eventDate)}</p>
          <p>{formatTime(data.eventTime)}</p>
          {data.venue && <p>{data.venue}</p>}
          {data.attendeeName && (
            <p className="mt-1 font-semibold text-white">{data.attendeeName}</p>
          )}
        </div>
        <div className="mt-auto flex flex-col items-center gap-1">
          <div className="rounded-md bg-white p-1">
            <QrImg src={qrDataUrl} size={90} />
          </div>
          <p className="max-w-full break-all text-center font-mono text-[8px] text-white/70">
            {data.ticketId}
          </p>
        </div>
      </div>
    </div>
  );
}

/** White + slim accent stripe on the left. Typographic. */
function MinimalTicket({ data, qrDataUrl }: TicketProps) {
  return (
    <div
      className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
      style={{ aspectRatio: "5 / 2" }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: data.primaryColor }}
      />
      <div className="flex h-full pl-5 pr-4 py-4">
        <div className="flex flex-1 flex-col">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: data.accentColor }}
          >
            {data.ticketType || "Admission"}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-tight text-slate-900 sm:text-xl">
            {data.eventName || "Your event name"}
          </h3>
          {data.eventTagline && (
            <p className="mt-0.5 text-[11px] text-slate-500">{data.eventTagline}</p>
          )}
          <div className="mt-auto space-y-0.5 text-[11px] text-slate-700">
            <p>
              <span className="font-semibold">{formatDate(data.eventDate)}</span>
              {" · "}
              <span>{formatTime(data.eventTime)}</span>
            </p>
            {data.venue && <p>{data.venue}</p>}
            {data.seatInfo && <p className="text-slate-500">{data.seatInfo}</p>}
            {data.attendeeName && (
              <p className="mt-1 text-slate-900">Admits: {data.attendeeName}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pl-3">
          <QrImg src={qrDataUrl} size={80} />
          <p className="max-w-[100px] break-all text-center font-mono text-[8px] text-slate-500">
            {data.ticketId}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Long thin horizontal band. Rounded ends; QR on the right end. */
function WristbandTicket({ data, qrDataUrl }: TicketProps) {
  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-full text-white shadow-md"
      style={{
        aspectRatio: "8 / 1",
        background: `linear-gradient(90deg, ${data.primaryColor} 0%, ${data.accentColor} 100%)`,
      }}
    >
      <div className="flex h-full items-center justify-between pl-6 pr-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="truncate text-sm font-bold leading-tight sm:text-base">
              {data.eventName || "Your event name"}
            </p>
            <p className="hidden text-[10px] text-white/80 sm:inline">
              {data.ticketType || "Admission"}
            </p>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-white/90">
            {formatDate(data.eventDate)} · {formatTime(data.eventTime)}
            {data.venue ? ` · ${data.venue}` : ""}
          </p>
        </div>
        {/* QR square on the right end. Wristband stock is thin — keep tiny. */}
        <div className="ml-2 flex h-full items-center justify-center rounded-full bg-white p-1.5">
          <QrImg src={qrDataUrl} size={40} />
        </div>
      </div>
    </div>
  );
}

interface TicketProps {
  data: TicketData;
  qrDataUrl: string;
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="truncate text-[11px] font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// ── Image picker ────────────────────────────────────────────────────────

function ImagePicker({
  label,
  value,
  onChange,
  onClear,
  kind,
  maxSide,
  maxKb,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onClear: () => void;
  kind: "logo" | "banner";
  maxSide: number;
  maxKb: number;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setErr("Only JPG, PNG, or WEBP.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const blob = await compressImage(f, maxSide, maxKb);
      const form = new FormData();
      form.append("file", blob, `${kind}.jpg`);
      // The public /api/email-signature/upload endpoint accepts logo /
      // avatar as kind. Bucket it as "logo" so tickets don't collide
      // with avatar uploads.
      form.append("kind", "logo");
      const res = await fetch("/api/email-signature/upload", {
        method: "POST",
        body: form,
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        setErr(json.error ?? "Upload failed");
        return;
      }
      onChange(json.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const shape = kind === "logo" ? "rounded-full" : "rounded-xl";

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className={cn(
              "shrink-0 border border-surface-200 object-cover dark:border-surface-800",
              shape,
              kind === "logo" ? "h-16 w-16" : "h-16 w-28"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center border-2 border-dashed border-surface-300 text-surface-400 dark:border-surface-700",
              shape,
              kind === "logo" ? "h-16 w-16" : "h-16 w-28"
            )}
          >
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
              onClick={onClear}
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
      {hint && !err && (
        <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">{hint}</p>
      )}
      {err && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{err}</p>}
    </div>
  );
}

/** Client-side compression targeted at a max side + max KB. Iteratively
 *  drops JPEG quality until under the target file size. */
async function compressImage(file: File, maxSide: number, maxKb: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const largest = Math.max(bitmap.width, bitmap.height);
  const scale = largest > maxSide ? maxSide / largest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const targetBytes = maxKb * 1024;
  let quality = 0.9;
  let out: Blob | null = null;
  while (quality > 0.35) {
    out = await new Promise<Blob | null>((r) =>
      canvas.toBlob((b) => r(b), "image/jpeg", quality)
    );
    if (out && out.size <= targetBytes) break;
    quality -= 0.15;
  }
  return out ?? file;
}

// ── Shared primitives ──────────────────────────────────────────────────

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
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
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
