"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import {
  DEFAULT_FONT,
  DEFAULT_LOGO_SCALE,
  DEFAULT_PAPER_SIZE,
  DEFAULT_TEMPLATE,
  DOC_SAFE_FONTS,
  DOC_SAFE_FONTS_BY_NAME,
  LOGO_SCALE_MAX,
  LOGO_SCALE_MIN,
  PAPER_SIZES,
  PAPER_SIZES_BY_ID,
  TEMPLATES,
  formatAddressLines,
  formatContactLine,
  formatRegistrationParts,
  pagePadding,
  type LetterheadData,
  type PaperSizeDefinition,
  type PaperSizeId,
  type TemplateId,
} from "@/lib/letterhead";
import { cn } from "@/lib/utils";

import { LetterheadExport } from "./LetterheadExport";

/**
 * /tools/letterhead-generator client component.
 *
 * Left: stacked form sections (Template, Paper size, Company identity,
 * Contact, Footer, Style). Right: a true-to-size live preview of the
 * page, rendered directly from `data` — it does NOT go through
 * buildHeaderModel/buildFooterModel in lib/letterhead.ts, since those are
 * stubs reserved for the PDF/Word/image export step. The preview is its
 * own lightweight per-template renderer built from the same LetterheadData
 * shape so the two stay visually consistent without sharing code that
 * doesn't exist yet.
 *
 * 100% browser-side: no auth, no database. The only network call is the
 * optional logo upload, which reuses the existing anonymous
 * /api/email-signature/upload endpoint (bc-avatars Supabase bucket) —
 * the path prefix says "email-signature" for historical reasons but the
 * bucket is shared infra, not tool-specific.
 */

function makeInitialData(): LetterheadData {
  return {
    companyName: "",
    tagline: "",
    logoUrl: "",
    logoScale: DEFAULT_LOGO_SCALE,
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateRegion: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    registrationNumber: "",
    taxId: "",
    footerText: "",
    showFooter: false,
    primaryColor: "#3B82F6",
    accentColor: "#1F2937",
    font: DEFAULT_FONT,
    template: DEFAULT_TEMPLATE,
    paperSize: DEFAULT_PAPER_SIZE,
    includeBodyPlaceholder: true,
  };
}

type ZoomMode = "fit" | "100";

// ── Component ────────────────────────────────────────────────────────────

export function LetterheadGenerator() {
  const [data, setData] = useState<LetterheadData>(makeInitialData);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [zoom, setZoom] = useState<ZoomMode>("fit");

  const set = useCallback(<K extends keyof LetterheadData>(key: K, value: LetterheadData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const nameError = !data.companyName.trim() ? "Company name is required" : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mobile-first: preview appears above the form on small screens,
            becomes a sticky right-hand column at lg. */}
        <aside className="order-first min-w-0 lg:order-last lg:sticky lg:top-24 lg:h-fit">
          <PreviewPanel
            data={data}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            zoom={zoom}
            onZoomChange={setZoom}
          />
          <div className="mt-4">
            <LetterheadExport data={data} />
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

          {/* 2 — Paper size */}
          <Section title="Paper size">
            <PaperSizePicker value={data.paperSize} onChange={(s) => set("paperSize", s)} />
            <p className="mt-3 text-[11px] leading-snug text-surface-500 dark:text-surface-400">
              Choose the size your printer or region uses. A4 is standard worldwide; US Letter for
              US/Canada.
            </p>
          </Section>

          {/* 3 — Company identity */}
          <Section title="Company identity">
            <Grid>
              <Field label="Company name" required>
                <input
                  value={data.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  className={inputCls}
                  placeholder="UtilityApps Inc."
                  autoComplete="organization"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={data.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  className={inputCls}
                  placeholder="Free tools, no signup"
                />
              </Field>
            </Grid>
            <div className="mt-4">
              <LogoPicker value={data.logoUrl} onChange={(url) => set("logoUrl", url)} />
              <p className="mt-2 text-[11px] leading-snug text-surface-500 dark:text-surface-400">
                Use a PNG logo with a transparent background for best results.
              </p>
            </div>
            {data.logoUrl && (
              <div className="mt-4">
                <LogoSizeSlider value={data.logoScale} onChange={(v) => set("logoScale", v)} />
              </div>
            )}
          </Section>

          {/* 4 — Contact & registration */}
          <Section title="Contact & registration">
            <Grid>
              <Field label="Address line 1">
                <input
                  value={data.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)}
                  className={inputCls}
                  placeholder="123 Business Street"
                  autoComplete="address-line1"
                />
              </Field>
              <Field label="Address line 2">
                <input
                  value={data.addressLine2}
                  onChange={(e) => set("addressLine2", e.target.value)}
                  className={inputCls}
                  placeholder="Suite 400"
                  autoComplete="address-line2"
                />
              </Field>
              <Field label="City">
                <input
                  value={data.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputCls}
                  placeholder="Lagos"
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="State / Region">
                <input
                  value={data.stateRegion}
                  onChange={(e) => set("stateRegion", e.target.value)}
                  className={inputCls}
                  placeholder="Lagos State"
                  autoComplete="address-level1"
                />
              </Field>
              <Field label="Postal code">
                <input
                  value={data.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  className={inputCls}
                  placeholder="100001"
                  autoComplete="postal-code"
                />
              </Field>
              <Field label="Country">
                <input
                  value={data.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={inputCls}
                  placeholder="Nigeria"
                  autoComplete="country-name"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                  placeholder="+234 803 772 3164"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                  placeholder="hello@company.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Website">
                <input
                  type="url"
                  value={data.website}
                  onChange={(e) => set("website", e.target.value)}
                  className={inputCls}
                  placeholder="company.com"
                  autoComplete="url"
                />
              </Field>
              <Field label="Company registration number" hint="Optional">
                <input
                  value={data.registrationNumber}
                  onChange={(e) => set("registrationNumber", e.target.value)}
                  className={inputCls}
                  placeholder="RC 123456"
                />
              </Field>
              <Field label="Tax ID / VAT number" hint="Optional">
                <input
                  value={data.taxId}
                  onChange={(e) => set("taxId", e.target.value)}
                  className={inputCls}
                  placeholder="TIN 0123456789"
                />
              </Field>
            </Grid>
          </Section>

          {/* 5 — Footer */}
          <Section
            title="Footer"
            subtitle="An optional extra line under the page — a disclaimer, registration details, or a confidentiality note."
          >
            <Toggle
              label="Show footer"
              checked={data.showFooter}
              onChange={(v) => set("showFooter", v)}
            />
            {data.showFooter && (
              <Field label="Footer text" hint="Shown at the bottom of every page." className="mt-4">
                <textarea
                  value={data.footerText}
                  onChange={(e) => set("footerText", e.target.value)}
                  className={cn(inputCls, "min-h-[72px] resize-y")}
                  placeholder="This document is confidential and intended solely for the addressee."
                />
              </Field>
            )}
          </Section>

          {/* 6 — Style */}
          <Section title="Style">
            <div className="space-y-4">
              <Field label="Font">
                <select
                  value={data.font}
                  onChange={(e) => set("font", e.target.value)}
                  className={inputCls}
                >
                  {DOC_SAFE_FONTS.map((f) => (
                    <option key={f.name} value={f.name} style={{ fontFamily: f.stack }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Grid>
                <ColorField
                  label="Primary color"
                  value={data.primaryColor}
                  onChange={(v) => set("primaryColor", v)}
                />
                <ColorField
                  label="Accent color"
                  value={data.accentColor}
                  onChange={(v) => set("accentColor", v)}
                />
              </Grid>
              <Toggle
                label="Include sample letter body text"
                hint="Adds placeholder date, recipient, and paragraph lines so you can see a full letter — not included in a blank Word template unless you want it."
                checked={data.includeBodyPlaceholder}
                onChange={(v) => set("includeBodyPlaceholder", v)}
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
  zoom,
  onZoomChange,
}: {
  data: LetterheadData;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  zoom: ZoomMode;
  onZoomChange: (z: ZoomMode) => void;
}) {
  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
            Preview — actual export is full resolution and print-ready.
          </p>
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
        <>
          <div className="mb-3 flex items-center justify-end">
            <div className="inline-flex rounded-xl border border-surface-200 p-0.5 dark:border-surface-800">
              <button
                type="button"
                onClick={() => onZoomChange("fit")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                  zoom === "fit"
                    ? "bg-primary-600 text-white"
                    : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
                )}
              >
                Fit
              </button>
              <button
                type="button"
                onClick={() => onZoomChange("100")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                  zoom === "100"
                    ? "bg-primary-600 text-white"
                    : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
                )}
              >
                100%
              </button>
            </div>
          </div>

          <div className="overflow-auto rounded-2xl border border-surface-200 bg-surface-100 p-4 dark:border-surface-800 dark:bg-surface-950">
            <LetterheadPage data={data} zoom={zoom} />
          </div>
        </>
      )}
    </div>
  );
}

// ── True-to-size page preview ────────────────────────────────────────────

function LetterheadPage({ data, zoom }: { data: LetterheadData; zoom: ZoomMode }) {
  const paper = PAPER_SIZES_BY_ID[data.paperSize];
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale =
    zoom === "100" ? 1 : containerWidth > 0 ? Math.min(containerWidth / paper.widthPx, 1) : 0.5;
  const scaledWidth = Math.round(paper.widthPx * scale);
  const scaledHeight = Math.round(paper.heightPx * scale);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="relative mx-auto bg-white shadow-lg"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          className="absolute left-0 top-0 overflow-hidden"
          style={{
            width: paper.widthPx,
            height: paper.heightPx,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <LetterheadPageContent data={data} paper={paper} />
        </div>
      </div>
    </div>
  );
}

export function LetterheadPageContent({
  data,
  paper,
}: {
  data: LetterheadData;
  paper: PaperSizeDefinition;
}) {
  const fontStack = DOC_SAFE_FONTS_BY_NAME[data.font]?.stack ?? DOC_SAFE_FONTS[0].stack;
  const { paddingX, paddingY } = pagePadding(paper);
  const hasCustomFooter = data.showFooter && data.footerText.trim().length > 0;

  return (
    <div
      className="relative h-full w-full bg-white text-surface-900"
      style={{ fontFamily: fontStack }}
    >
      <div style={{ padding: `${paddingY}px ${paddingX}px` }}>
        <TemplateHeader data={data} paddingX={paddingX} paddingY={paddingY} />
        {data.includeBodyPlaceholder && <BodyPlaceholder />}
      </div>

      {(data.template === "minimal" || data.template === "elegant-footer") && (
        <TemplateFooter data={data} paddingX={paddingX} paddingY={paddingY} />
      )}

      {hasCustomFooter && (
        <p
          className="absolute inset-x-0 text-center text-[9px] leading-snug text-surface-400"
          style={{ bottom: Math.round(paddingY * 0.4), padding: `0 ${paddingX}px` }}
        >
          {data.footerText}
        </p>
      )}
    </div>
  );
}

function LogoOrPlaceholder({
  data,
  size,
  rounded = true,
}: {
  data: LetterheadData;
  size: number;
  rounded?: boolean;
}) {
  const scaledSize = size * data.logoScale;
  if (data.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.logoUrl}
        alt=""
        style={{ height: scaledSize, maxWidth: scaledSize * 2.5 }}
        className="object-contain"
      />
    );
  }
  return (
    <div
      style={{ height: scaledSize, width: scaledSize }}
      className={cn(
        "flex shrink-0 items-center justify-center border border-dashed border-surface-300 text-surface-300",
        rounded && "rounded-lg"
      )}
    >
      <Building2 style={{ width: scaledSize * 0.5, height: scaledSize * 0.5 }} />
    </div>
  );
}

function CompanyName({ data, style }: { data: LetterheadData; style?: React.CSSProperties }) {
  return (
    <span
      style={{ color: data.companyName ? undefined : "#9CA3AF", ...style }}
      className={cn(!data.companyName && "italic")}
    >
      {data.companyName || "Your Company Name"}
    </span>
  );
}

export function TemplateHeader({
  data,
  paddingX,
  paddingY,
}: {
  data: LetterheadData;
  paddingX: number;
  paddingY: number;
}) {
  const { primaryColor, accentColor } = data;
  const registration = formatRegistrationParts(data);

  switch (data.template) {
    case "classic-centered": {
      const detailLines = [...formatAddressLines(data), ...registration];
      return (
        <div className="flex flex-col items-center text-center">
          <LogoOrPlaceholder data={data} size={56} />
          <CompanyName
            data={data}
            style={{ marginTop: 6, fontSize: 20, fontWeight: 700, color: primaryColor }}
          />
          {data.tagline && (
            <p style={{ marginTop: 4, fontSize: 11, color: "#6B7280" }}>{data.tagline}</p>
          )}
          <div
            style={{ marginTop: 14, width: "100%", borderTop: `1.5px solid ${accentColor}` }}
          />
          <p style={{ marginTop: 8, fontSize: 10, color: "#6B7280" }}>{formatContactLine(data)}</p>
          {detailLines.length > 0 && (
            <p style={{ marginTop: 2, fontSize: 9, color: "#9CA3AF" }}>{detailLines.join("   ·   ")}</p>
          )}
        </div>
      );
    }

    case "left-aligned":
      return (
        <div>
          <div className="flex items-start justify-between gap-3">
            <LogoOrPlaceholder data={data} size={48} />
            <div className="text-right" style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.6 }}>
              {formatAddressLines(data).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {(data.phone || data.email || data.website) && <p>{formatContactLine(data)}</p>}
              {registration.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <CompanyName
            data={data}
            style={{ display: "block", marginTop: 6, fontSize: 18, fontWeight: 700 }}
          />
          {data.tagline && (
            <p style={{ marginTop: 2, fontSize: 11, color: "#6B7280" }}>{data.tagline}</p>
          )}
          <div style={{ marginTop: 10, borderTop: `2px solid ${accentColor}` }} />
        </div>
      );

    case "modern-band":
      return (
        <div>
          {/* Negative margin cancels the page's own padding so the band
              bleeds edge-to-edge instead of reading as a rounded panel. */}
          <div
            className="flex items-center gap-2"
            style={{
              background: primaryColor,
              margin: `-${paddingY}px -${paddingX}px 0`,
              padding: `${Math.round(paddingY * 0.55)}px ${paddingX}px`,
            }}
          >
            <LogoOrPlaceholder data={data} size={36} />
            <div>
              <span
                style={{ display: "block", fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}
                className={cn(!data.companyName && "italic opacity-80")}
              >
                {data.companyName || "Your Company Name"}
              </span>
              {data.tagline && (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>{data.tagline}</span>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 10, color: "#6B7280", lineHeight: 1.7 }}>
            {formatAddressLines(data).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {(data.phone || data.email || data.website) && <p>{formatContactLine(data)}</p>}
            {registration.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="flex items-center gap-2">
          <LogoOrPlaceholder data={data} size={32} />
          <div>
            <CompanyName data={data} style={{ display: "block", fontSize: 16, fontWeight: 600 }} />
            {data.tagline && (
              <span style={{ fontSize: 9.5, color: "#6B7280" }}>{data.tagline}</span>
            )}
          </div>
        </div>
      );

    case "corporate-split":
      return (
        <div>
          <div className="flex items-start justify-between gap-2">
            <LogoOrPlaceholder data={data} size={44} />
            <div className="flex-1 text-center">
              <CompanyName data={data} style={{ fontSize: 17, fontWeight: 700 }} />
              {data.tagline && (
                <p style={{ marginTop: 2, fontSize: 11, color: "#6B7280" }}>{data.tagline}</p>
              )}
            </div>
            <div className="text-right" style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.6 }}>
              {formatAddressLines(data).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {(data.phone || data.email || data.website) && <p>{formatContactLine(data)}</p>}
              {registration.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12, borderTop: `1.5px solid ${accentColor}` }} />
          <div style={{ marginTop: 2, borderTop: "1px solid #E5E7EB" }} />
        </div>
      );

    case "elegant-footer":
      return (
        <div className="flex items-center gap-2">
          <LogoOrPlaceholder data={data} size={40} />
          <div>
            <CompanyName data={data} style={{ display: "block", fontSize: 18, fontWeight: 700 }} />
            {data.tagline && (
              <span style={{ fontSize: 11, color: "#6B7280" }}>{data.tagline}</span>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}

/** Footer region for the two templates whose design puts the bulk of the
 *  contact block in a footer band rather than the header (see
 *  TEMPLATES[i].footerRole === "primary" in lib/letterhead.ts). */
function TemplateFooter({
  data,
  paddingX,
  paddingY,
}: {
  data: LetterheadData;
  paddingX: number;
  paddingY: number;
}) {
  if (data.template === "minimal") {
    return (
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ padding: `0 ${paddingX}px ${Math.round(paddingY * 0.6)}px` }}
      >
        <div style={{ borderTop: "0.75px solid #D1D5DB", paddingTop: 6 }}>
          <p style={{ fontSize: 9, color: "#6B7280" }}>
            {[formatAddressLines(data).join(", "), formatContactLine(data), ...formatRegistrationParts(data)]
              .filter(Boolean)
              .join("   ·   ")}
          </p>
        </div>
      </div>
    );
  }

  // elegant-footer
  return (
    <div
      className="absolute inset-x-0 bottom-0"
      style={{ background: "#F9FAFB", borderTop: `2px solid ${data.accentColor}` }}
    >
      <div
        className="grid grid-cols-2 gap-x-6 gap-y-1"
        style={{ padding: `${Math.round(paddingY * 0.6)}px ${paddingX}px`, fontSize: 9.5, color: "#4B5563" }}
      >
        {formatAddressLines(data).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {data.phone && <p>Tel: {data.phone}</p>}
        {data.email && <p>{data.email}</p>}
        {data.website && <p>{data.website}</p>}
        {formatRegistrationParts(data).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function BodyPlaceholder() {
  return (
    <div style={{ marginTop: 36, fontSize: 11.5, color: "#6B7280", lineHeight: 1.7 }}>
      <p>January 1, 2026</p>
      <div style={{ marginTop: 18 }}>
        <p>Recipient Name</p>
        <p>Recipient Company</p>
        <p>Recipient Address</p>
      </div>
      <p style={{ marginTop: 18 }}>Dear [Recipient Name],</p>
      <div style={{ marginTop: 12, color: "#D1D5DB" }} className="space-y-2.5">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <p style={{ marginTop: 18 }}>Sincerely,</p>
      <p style={{ marginTop: 24 }}>[Your Name]</p>
    </div>
  );
}

// ── Template picker ──────────────────────────────────────────────────────

function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (t: TemplateId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            <div
              className="aspect-[100/140] w-full bg-surface-50 dark:bg-surface-950"
              // t.thumbnail is a static inline SVG string authored in
              // lib/letterhead.ts — no user input.
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
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Paper size picker ────────────────────────────────────────────────────

function PaperSizePicker({
  value,
  onChange,
}: {
  value: PaperSizeId;
  onChange: (s: PaperSizeId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PAPER_SIZES.map((s) => {
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
            <p
              className={cn(
                "text-sm font-semibold",
                active
                  ? "text-primary-700 dark:text-primary-400"
                  : "text-surface-800 dark:text-surface-100"
              )}
            >
              {s.name}
            </p>
            <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">
              {s.widthMm} × {s.heightMm} mm
            </p>
            <p className="mt-1 text-[10px] leading-snug text-surface-400 dark:text-surface-500">
              {s.description}
            </p>
          </button>
        );
      })}
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

// ── Logo size slider ─────────────────────────────────────────────────────

function LogoSizeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const percent = Math.round(value * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Logo size
        </span>
        <span className="text-xs font-semibold text-surface-700 dark:text-surface-200">{percent}%</span>
      </div>
      <input
        type="range"
        min={LOGO_SCALE_MIN * 100}
        max={LOGO_SCALE_MAX * 100}
        step={5}
        value={percent}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full accent-primary-600"
        aria-label="Logo size"
      />
      <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
        Resizes the logo in the preview and in every downloaded format.
      </p>
    </div>
  );
}

/** Resize to max ~400 px on the longest side. PNGs stay PNG so
 *  transparency survives — logos are placed over colored bands (see the
 *  modern-band template) where a flattened white background would look
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

// ── Section / Field / Color / Toggle / Grid primitives ───────────────────

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

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition",
          checked ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
      <span>
        <span className="block text-sm text-surface-800 dark:text-surface-100">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[11px] leading-snug text-surface-500 dark:text-surface-400">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
