"use client";

import { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { AlertTriangle, Building2, ChevronDown, Copy, Link2, Loader2, Upload } from "lucide-react";

import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  DAY_LABELS_SHORT,
  DEFAULT_FONT,
  DEFAULT_HEADER_TEXT,
  DEFAULT_SIGN_SIZE,
  DEFAULT_STATUS_MODE,
  DEFAULT_TEMPLATE,
  DOC_SAFE_FONTS,
  DOC_SAFE_FONTS_BY_NAME,
  PRESETS,
  SIGN_PADDING_X_FRACTION,
  SIGN_PADDING_Y_FRACTION,
  SIGN_SIZES,
  SIGN_SIZES_BY_ID,
  TEMPLATES,
  applyPreset,
  computeOpenStatus,
  defaultWeek,
  formatTime12h,
  type BusinessHoursData,
  type CurrentStatusMode,
  type DayHours,
  type DayOfWeek,
  type PresetId,
  type SignSizeDefinition,
  type SignSizeId,
  type TemplateId,
} from "@/lib/businessHours";
import { cn } from "@/lib/utils";

import { BusinessHoursExport } from "./BusinessHoursExport";

/**
 * /tools/business-hours-sign client component.
 *
 * Left: stacked form sections (Template & size, Business identity, Hours,
 * Open Now badge, Style). Right: a live preview card whose aspect ratio
 * matches the chosen sign size (A4/Letter/A5 portrait vs. Square) —
 * rendered at a fixed, modest on-screen width rather than a true-to-mm
 * scaled page, same lighter-weight approach as the Receipt and Purchase
 * Order generators. Padding is expressed as a fraction of width/height
 * (SIGN_PADDING_X_FRACTION/Y_FRACTION from lib/businessHours) so it
 * stays visually consistent between this on-screen card and the
 * full-resolution PDF the exporter draws separately.
 *
 * 100% browser-side: no auth, no database. The only network call is the
 * optional logo upload, which reuses the existing anonymous
 * /api/email-signature/upload endpoint (bc-avatars Supabase bucket) —
 * shared infra, not tool-specific.
 */

function makeInitialData(): BusinessHoursData {
  return {
    businessName: "",
    tagline: "",
    logoUrl: "",
    days: defaultWeek(),
    currentStatusMode: DEFAULT_STATUS_MODE,
    headerText: DEFAULT_HEADER_TEXT,
    primaryColor: "#3B82F6",
    accentColor: "#1F2937",
    backgroundColor: "#FFFFFF",
    font: DEFAULT_FONT,
    paperSize: DEFAULT_SIGN_SIZE,
    template: DEFAULT_TEMPLATE,
  };
}

// ── Component ────────────────────────────────────────────────────────────

export function BusinessHoursSign() {
  const [data, setData] = useState<BusinessHoursData>(makeInitialData);
  const [previewOpen, setPreviewOpen] = useState(true);
  const paperRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof BusinessHoursData>(key: K, value: BusinessHoursData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateDay = (day: DayOfWeek, patch: Partial<DayHours>) =>
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    }));

  const copyToAllDays = (source: DayHours) =>
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) => ({
        ...d,
        isOpen: source.isOpen,
        openTime: source.openTime,
        closeTime: source.closeTime,
      })),
    }));

  const nameError = !data.businessName.trim() ? "Business name is required" : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[55fr_45fr]">
        {/* Mobile-first: preview appears above the form on small screens,
            becomes a sticky right-hand column at lg. */}
        <aside className="order-first min-w-0 lg:order-last lg:sticky lg:top-24 lg:h-fit">
          <PreviewPanel data={data} open={previewOpen} onOpenChange={setPreviewOpen} paperRef={paperRef} />
          <div className="mt-4">
            <BusinessHoursExport data={data} paperRef={paperRef} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          {nameError && (
            <p className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
              <AlertTriangle className="h-3 w-3" /> {nameError}
            </p>
          )}

          {/* 1 — Template & size */}
          <Section title="Template & size" subtitle="Pick a layout and the size you'll print or post it at.">
            <TemplatePicker value={data.template} onChange={(t) => set("template", t)} />
            <div className="mt-4">
              <SignSizePicker value={data.paperSize} onChange={(s) => set("paperSize", s)} />
            </div>
          </Section>

          {/* 2 — Business identity */}
          <Section title="Business identity">
            <Grid>
              <Field label="Business name" required>
                <input
                  value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  className={inputCls}
                  placeholder="Corner Café"
                  autoComplete="organization"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={data.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  className={inputCls}
                  placeholder="Fresh coffee, every day"
                />
              </Field>
            </Grid>
            <div className="mt-4">
              <LogoPicker value={data.logoUrl} onChange={(url) => set("logoUrl", url)} />
            </div>
            <div className="mt-4">
              <Field label="Header text">
                <input
                  value={data.headerText}
                  onChange={(e) => set("headerText", e.target.value)}
                  className={inputCls}
                  placeholder="Business Hours"
                />
              </Field>
            </div>
          </Section>

          {/* 3 — Hours */}
          <Section title="Hours" subtitle="Set each day's times, or start from a preset and tweak it.">
            <PresetBar onApply={(id) => set("days", applyPreset(id))} />
            <div className="mt-4 space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const value = data.days.find((d) => d.day === day) ?? { day, isOpen: false, openTime: "09:00", closeTime: "17:00", note: "" };
                return (
                  <DayRow
                    key={day}
                    value={value}
                    onChange={(patch) => updateDay(day, patch)}
                    onCopyToAll={() => copyToAllDays(value)}
                  />
                );
              })}
            </div>
          </Section>

          {/* 4 — Open Now badge */}
          <Section
            title="Open Now badge"
            subtitle="Auto reflects the viewer's current time in this live preview — a downloaded or printed sign always shows a fixed badge from the moment you generated it."
          >
            <StatusModeToggle value={data.currentStatusMode} onChange={(v) => set("currentStatusMode", v)} />
          </Section>

          {/* 5 — Style */}
          <Section title="Style">
            <div className="space-y-4">
              <Field label="Font">
                <select value={data.font} onChange={(e) => set("font", e.target.value)} className={inputCls}>
                  {DOC_SAFE_FONTS.map((f) => (
                    <option key={f.name} value={f.name} style={{ fontFamily: f.stack }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Grid>
                <ColorField label="Primary color" value={data.primaryColor} onChange={(v) => set("primaryColor", v)} />
                <ColorField label="Accent color" value={data.accentColor} onChange={(v) => set("accentColor", v)} />
              </Grid>
              <ColorField
                label="Background color"
                value={data.backgroundColor}
                onChange={(v) => set("backgroundColor", v)}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ── Preview panel ────────────────────────────────────────────────────────

function PreviewPanel({
  data,
  open,
  onOpenChange,
  paperRef,
}: {
  data: BusinessHoursData;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  paperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const size = SIGN_SIZES_BY_ID[data.paperSize];
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
              BusinessHoursExport's print stylesheet and html2canvas call. */}
          <div ref={paperRef} id="business-hours-print-area">
            <SignFrame size={size}>
              <SignContent data={data} />
            </SignFrame>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sign preview ─────────────────────────────────────────────────────────

const SIGN_PREVIEW_WIDTH = 420;

function SignFrame({ size, children }: { size: SignSizeDefinition; children: React.ReactNode }) {
  const height = Math.round(SIGN_PREVIEW_WIDTH * (size.heightPx / size.widthPx));
  return (
    <div
      className="mx-auto overflow-hidden rounded-2xl border border-surface-200 shadow-lg"
      style={{ width: SIGN_PREVIEW_WIDTH, height, maxWidth: "100%" }}
    >
      {children}
    </div>
  );
}

/** Shared padding for every template's outer content area — a fraction
 *  of the element's own width/height, so it matches whatever resolution
 *  it's rendered at (this 420px preview card, or the exporter's
 *  full-resolution paper). */
const SIGN_PAD_STYLE: React.CSSProperties = {
  padding: `${SIGN_PADDING_Y_FRACTION * 100}% ${SIGN_PADDING_X_FRACTION * 100}%`,
};

interface TemplateProps {
  data: BusinessHoursData;
  fontStack: string;
  showBadge: boolean;
  badgeOpen: boolean;
}

export function SignContent({ data }: { data: BusinessHoursData }) {
  const fontStack = DOC_SAFE_FONTS_BY_NAME[data.font]?.stack ?? DOC_SAFE_FONTS[0].stack;
  const status = computeOpenStatus(data.days);
  const showBadge = data.currentStatusMode !== "hidden";
  const badgeOpen = data.currentStatusMode === "auto" ? status.isOpenNow : data.currentStatusMode === "open";
  const props: TemplateProps = { data, fontStack, showBadge, badgeOpen };

  switch (data.template) {
    case "modern-card":
      return <ModernCardTemplate {...props} />;
    case "bold-open-closed":
      return <BoldOpenClosedTemplate {...props} />;
    case "elegant":
      return <ElegantTemplate {...props} />;
    default:
      return <ClassicListTemplate {...props} />;
  }
}

function LogoOrPlaceholder({ url, size, light }: { url: string; size: number; light?: boolean }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" style={{ height: size, maxWidth: size * 2.5 }} className="object-contain" />
    );
  }
  return (
    <div
      style={{ height: size, width: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-dashed",
        light ? "border-white/40 text-white/40" : "border-surface-300 text-surface-300"
      )}
    >
      <Building2 style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}

function BusinessName({ data, style }: { data: BusinessHoursData; style?: React.CSSProperties }) {
  return (
    <span style={{ color: data.businessName ? undefined : "#9CA3AF", ...style }} className={cn(!data.businessName && "italic")}>
      {data.businessName || "Your Business Name"}
    </span>
  );
}

function StatusBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{ background: isOpen ? "#DCFCE7" : "#FEE2E2", color: isOpen ? "#15803D" : "#B91C1C" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: isOpen ? "#22C55E" : "#EF4444" }} />
      {isOpen ? "Open Now" : "Closed"}
    </span>
  );
}

function DaysListDisplay({
  data,
  align = "left",
}: {
  data: BusinessHoursData;
  align?: "left" | "center";
}) {
  return (
    <div className="w-full" style={{ maxWidth: 300, margin: align === "center" ? "0 auto" : undefined }}>
      {data.days.map((d) => (
        <div key={d.day} className="flex items-start justify-between gap-3" style={{ padding: "3px 0", fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "#111827" }}>{DAY_LABELS[d.day]}</span>
          <span style={{ color: "#4B5563", textAlign: "right" }}>
            {d.isOpen ? `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}` : "Closed"}
            {d.note && (
              <span style={{ display: "block", fontSize: 10.5, fontStyle: "italic", color: "#9CA3AF" }}>{d.note}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ClassicListTemplate({ data, fontStack, showBadge, badgeOpen }: TemplateProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center overflow-hidden text-center"
      style={{ fontFamily: fontStack, background: data.backgroundColor, ...SIGN_PAD_STYLE }}
    >
      <LogoOrPlaceholder url={data.logoUrl} size={44} />
      <BusinessName data={data} style={{ marginTop: 8, fontSize: 19, fontWeight: 700 }} />
      {data.tagline && <p style={{ marginTop: 2, fontSize: 11, color: "#6B7280" }}>{data.tagline}</p>}
      {showBadge && (
        <div style={{ marginTop: 10 }}>
          <StatusBadge isOpen={badgeOpen} />
        </div>
      )}
      <div style={{ marginTop: 14, width: "100%", borderTop: `1.5px solid ${data.primaryColor}` }} />
      <p
        style={{
          marginTop: 10,
          fontSize: 13,
          fontWeight: 700,
          color: data.primaryColor,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {data.headerText}
      </p>
      <div style={{ marginTop: 10, flex: 1, overflow: "hidden" }}>
        <DaysListDisplay data={data} align="center" />
      </div>
    </div>
  );
}

function ModernCardTemplate({ data, fontStack, showBadge, badgeOpen }: TemplateProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden" style={{ fontFamily: fontStack, background: data.backgroundColor }}>
      <div
        className="flex items-center justify-between gap-3"
        style={{ background: data.primaryColor, padding: `${SIGN_PADDING_Y_FRACTION * 100}% ${SIGN_PADDING_X_FRACTION * 100}%` }}
      >
        <div className="flex items-center gap-2.5">
          <LogoOrPlaceholder url={data.logoUrl} size={36} light />
          <div>
            <BusinessName data={data} style={{ display: "block", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }} />
            {data.tagline && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>{data.tagline}</span>}
          </div>
        </div>
        {showBadge && <StatusBadge isOpen={badgeOpen} />}
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: `${SIGN_PADDING_Y_FRACTION * 100}% ${SIGN_PADDING_X_FRACTION * 100}%` }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: data.accentColor,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {data.headerText}
        </p>
        {data.days.map((d, i) => (
          <div
            key={d.day}
            className="flex items-start justify-between gap-3"
            style={{
              fontSize: 12.5,
              padding: "4px 6px",
              background: i % 2 === 1 ? `${data.accentColor}14` : "transparent",
              borderRadius: 6,
            }}
          >
            <span style={{ fontWeight: 600, color: "#111827" }}>{DAY_LABELS[d.day]}</span>
            <span style={{ textAlign: "right", color: "#4B5563" }}>
              {d.isOpen ? `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}` : "Closed"}
              {d.note && (
                <span style={{ display: "block", fontSize: 10, fontStyle: "italic", color: "#9CA3AF" }}>{d.note}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoldOpenClosedTemplate({ data, fontStack }: TemplateProps) {
  const status = computeOpenStatus(data.days);
  const showBigWord = data.currentStatusMode !== "hidden";
  const isOpen = data.currentStatusMode === "auto" ? status.isOpenNow : data.currentStatusMode === "open";
  const bigColor = isOpen ? "#16A34A" : "#DC2626";

  return (
    <div
      className="flex h-full w-full flex-col items-center overflow-hidden text-center"
      style={{ fontFamily: fontStack, background: data.backgroundColor, ...SIGN_PAD_STYLE }}
    >
      <div className="flex items-center gap-2">
        <LogoOrPlaceholder url={data.logoUrl} size={26} />
        <BusinessName data={data} style={{ fontSize: 13, fontWeight: 700 }} />
      </div>
      <p style={{ marginTop: 10, fontSize: 42, fontWeight: 800, letterSpacing: 2, lineHeight: 1, color: showBigWord ? bigColor : data.primaryColor }}>
        {showBigWord ? (isOpen ? "OPEN" : "CLOSED") : data.headerText}
      </p>
      {showBigWord && data.currentStatusMode === "auto" && (
        <p style={{ marginTop: 4, fontSize: 11, color: "#6B7280" }}>{status.nextChange}</p>
      )}
      <div style={{ marginTop: 14, width: "100%", flex: 1, overflow: "hidden", borderTop: "1px solid #E5E7EB", paddingTop: 10 }}>
        <DaysListDisplay data={data} align="center" />
      </div>
    </div>
  );
}

function ElegantTemplate({ data, fontStack, showBadge, badgeOpen }: TemplateProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden text-center"
      style={{ fontFamily: fontStack, background: data.backgroundColor, ...SIGN_PAD_STYLE }}
    >
      <LogoOrPlaceholder url={data.logoUrl} size={40} />
      <BusinessName
        data={data}
        style={{ marginTop: 10, fontSize: 20, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase" }}
      />
      {data.tagline && <p style={{ marginTop: 4, fontSize: 11, letterSpacing: 1, color: "#9CA3AF" }}>{data.tagline}</p>}
      {showBadge && (
        <div style={{ marginTop: 10 }}>
          <StatusBadge isOpen={badgeOpen} />
        </div>
      )}
      <div style={{ marginTop: 16, width: 40, borderTop: `1px solid ${data.accentColor}` }} />
      <p style={{ marginTop: 14, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: data.primaryColor }}>
        {data.headerText}
      </p>
      <div style={{ marginTop: 10, flex: 1, overflow: "hidden" }}>
        <DaysListDisplay data={data} align="center" />
      </div>
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
    case "classic-list":
      return (
        <div className="flex h-full w-full flex-col items-center gap-1 bg-white p-3">
          <div className="h-3 w-3 rounded-full" style={{ background: BLOCK }} />
          <div className="h-1.5 w-10 rounded-full" style={{ background: HEADING }} />
          <div className="mt-1 h-px w-full" style={{ background: ACCENT }} />
          <div className="mt-1 h-1 w-6 rounded-full" style={{ background: MUTED }} />
          <div className="h-1 w-6 rounded-full" style={{ background: MUTED }} />
          <div className="h-1 w-6 rounded-full" style={{ background: MUTED }} />
        </div>
      );
    case "modern-card":
      return (
        <div className="flex h-full w-full flex-col bg-white">
          <div className="h-6 w-full" style={{ background: ACCENT }} />
          <div className="flex flex-1 flex-col gap-1 p-2">
            <div className="mt-1 h-1 w-full rounded-full" style={{ background: MUTED }} />
            <div className="h-1 w-full rounded-full" style={{ background: MUTED }} />
            <div className="h-1 w-8 rounded-full" style={{ background: MUTED }} />
          </div>
        </div>
      );
    case "bold-open-closed":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-white p-3">
          <div className="h-1 w-8 rounded-full" style={{ background: MUTED }} />
          <div className="h-4 w-16 rounded" style={{ background: "#16A34A" }} />
          <div className="h-1 w-10 rounded-full" style={{ background: MUTED }} />
        </div>
      );
    case "elegant":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-white p-3">
          <div className="h-1.5 w-10 rounded-full" style={{ background: HEADING }} />
          <div className="h-px w-6" style={{ background: BLOCK }} />
          <div className="h-1 w-8 rounded-full" style={{ background: MUTED }} />
        </div>
      );
    default:
      return null;
  }
}

function TemplatePicker({ value, onChange }: { value: TemplateId; onChange: (t: TemplateId) => void }) {
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
              active ? "border-primary-500 shadow-glow" : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
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
                  active ? "text-primary-600 dark:text-primary-400" : "text-surface-800 dark:text-surface-100"
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

// ── Sign size picker ─────────────────────────────────────────────────────

function SignSizePicker({ value, onChange }: { value: SignSizeId; onChange: (s: SignSizeId) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SIGN_SIZES.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition",
              active
                ? "border-primary-500 bg-primary-50/60 dark:bg-primary-500/10"
                : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
            )}
          >
            <p className={cn("text-sm font-semibold", active ? "text-primary-700 dark:text-primary-400" : "text-surface-800 dark:text-surface-100")}>
              {s.name}
            </p>
            <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">
              {s.widthMm} × {s.heightMm} mm
            </p>
            <p className="mt-1 text-[10px] leading-snug text-surface-400 dark:text-surface-500">{s.description}</p>
          </button>
        );
      })}
    </div>
  );
}

// ── Hours editor ─────────────────────────────────────────────────────────

function PresetBar({ onApply }: { onApply: (id: PresetId) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onApply(p.id)}
          title={p.description}
          className="rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function DaySwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition",
        checked ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function DayRow({
  value,
  onChange,
  onCopyToAll,
}: {
  value: DayHours;
  onChange: (patch: Partial<DayHours>) => void;
  onCopyToAll: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-200 p-2.5 dark:border-surface-800">
      <span className="w-9 shrink-0 text-xs font-semibold text-surface-700 dark:text-surface-200">
        {DAY_LABELS_SHORT[value.day]}
      </span>
      <DaySwitch checked={value.isOpen} onChange={(v) => onChange({ isOpen: v })} />
      <input
        type="time"
        value={value.openTime}
        onChange={(e) => onChange({ openTime: e.target.value })}
        disabled={!value.isOpen}
        className={cn(inputCls, "w-[110px] px-2 py-1.5 text-xs disabled:opacity-40")}
      />
      <span className="text-xs text-surface-400">–</span>
      <input
        type="time"
        value={value.closeTime}
        onChange={(e) => onChange({ closeTime: e.target.value })}
        disabled={!value.isOpen}
        className={cn(inputCls, "w-[110px] px-2 py-1.5 text-xs disabled:opacity-40")}
      />
      <input
        value={value.note}
        onChange={(e) => onChange({ note: e.target.value })}
        placeholder="By appointment"
        className={cn(inputCls, "min-w-[120px] flex-1 px-2 py-1.5 text-xs")}
      />
      <button
        type="button"
        onClick={onCopyToAll}
        aria-label={`Copy ${DAY_LABELS[value.day]}'s hours to all days`}
        title="Copy this day's hours to all days"
        className="flex items-center justify-center rounded-lg p-1 text-surface-400 transition hover:text-primary-600 dark:hover:text-primary-400"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Open Now badge mode ──────────────────────────────────────────────────

const STATUS_MODE_OPTIONS: { id: CurrentStatusMode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "open", label: "Force Open" },
  { id: "closed", label: "Force Closed" },
  { id: "hidden", label: "Hide" },
];

function StatusModeToggle({ value, onChange }: { value: CurrentStatusMode; onChange: (v: CurrentStatusMode) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-0.5 rounded-xl border border-surface-200 p-0.5 dark:border-surface-800">
      {STATUS_MODE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          aria-pressed={value === opt.id}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
            value === opt.id
              ? "bg-primary-600 text-white"
              : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Logo picker (upload + paste URL) ─────────────────────────────────────

function LogoPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
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
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="hidden" />
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
 *  on the modern-card template where a flattened white background would
 *  look broken. Non-PNG sources are re-encoded as JPEG. */
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

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">{subtitle}</p>}
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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">{label}</span>
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
        <span className="flex-1 text-left font-mono text-sm text-surface-900 dark:text-white">{value.toUpperCase()}</span>
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
