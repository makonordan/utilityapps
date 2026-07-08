"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ChevronDown, RotateCcw, ShieldAlert, Star } from "lucide-react";

import {
  STAMP_COLORS,
  STAMP_DISCLAIMER,
  STAMP_FONTS,
  STAMP_PRESETS,
  STAMP_TEXTURES,
  type DateMode,
  type StampData,
  type StampPreset,
  type StampShape,
} from "@/lib/companyStamp";
import { renderStampSvg } from "@/lib/renderStampSvg";
import { cn } from "@/lib/utils";

/**
 * /tools/company-stamp-generator client component.
 *
 * Left panel (55%): preset picker, shape, text fields, style controls.
 * Right panel (45%, reorders above the controls on mobile): live SVG
 * preview, injected via dangerouslySetInnerHTML and debounced ~150ms so
 * dragging the rotation/border-width sliders doesn't thrash re-renders.
 *
 * Everything here is 100% client-side — renderStampSvg is a pure string
 * builder, there's no upload and no server call. The export bar (PNG/SVG
 * download) is a separate, later piece; this component only covers the
 * design surface and preview.
 */

type BorderStyle = StampData["borderStyle"];

// ── Defaults ─────────────────────────────────────────────────────────────

const BASE_STAMP: StampData = {
  shape: "round",
  topText: "",
  bottomText: "",
  centerText: "",
  centerSubText: "",
  dateMode: "none",
  fixedDate: "",
  starSeparators: false,
  color: STAMP_COLORS[0].hex,
  borderStyle: "double",
  borderWidth: 5,
  fontFamily: STAMP_FONTS[0].cssStack,
  textureStyle: "clean",
  rotation: -6,
  sizePx: 500,
};

/** Fills the preset's fields (shape, text, colour, star/date defaults)
 *  onto the current data, leaving the user's border/font/texture/rotation
 *  choices untouched — picking a preset re-words the stamp, it doesn't
 *  discard styling the user already dialled in. */
function applyPreset(data: StampData, preset: StampPreset): StampData {
  return {
    ...data,
    shape: preset.shape,
    centerText: preset.centerText,
    centerSubText: preset.centerSubText ?? "",
    topText: preset.topText ?? "",
    bottomText: preset.bottomText ?? "",
    starSeparators: preset.starSeparators ?? false,
    dateMode: preset.dateMode ?? "none",
    color: preset.suggestedColor,
  };
}

const INITIAL_DATA: StampData = applyPreset(BASE_STAMP, STAMP_PRESETS[0]);

const BORDER_STYLES: { value: BorderStyle; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "dashed", label: "Dashed" },
  { value: "rope", label: "Rope" },
  { value: "none", label: "None" },
];

const SHAPES: { value: StampShape; label: string }[] = [
  { value: "round", label: "Round Seal" },
  { value: "rectangle", label: "Rectangle" },
  { value: "oval", label: "Oval" },
];

const DATE_MODES: { value: DateMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "blank-line", label: "Blank line for handwriting" },
  { value: "fixed", label: "Fixed date" },
];

// ── Main component ───────────────────────────────────────────────────────

export function CompanyStampGenerator() {
  const [data, setData] = useState<StampData>(INITIAL_DATA);
  const [previewBg, setPreviewBg] = useState<"transparent" | "document">("transparent");

  const update = useCallback(<K extends keyof StampData>(key: K, value: StampData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPresetClick = useCallback((preset: StampPreset) => {
    setData((prev) => applyPreset(prev, preset));
  }, []);

  const activePresetId = useMemo(
    () =>
      STAMP_PRESETS.find(
        (p) =>
          p.shape === data.shape &&
          p.centerText === data.centerText &&
          (p.topText ?? "") === data.topText &&
          (p.bottomText ?? "") === data.bottomText &&
          p.suggestedColor.toLowerCase() === data.color.toLowerCase()
      )?.id ?? null,
    [data.shape, data.centerText, data.topText, data.bottomText, data.color]
  );

  const debouncedData = useDebounce(data, 150);
  const svg = useMemo(() => renderStampSvg(debouncedData), [debouncedData]);

  const isCurved = data.shape !== "rectangle";

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      <div className="grid gap-6 lg:grid-cols-[55%_45%]">
        {/* Preview aside — first in DOM for mobile (preview on top),
            reordered after the controls on desktop via lg:order-last. */}
        <aside className="order-first lg:order-last lg:sticky lg:top-24 lg:h-fit">
          <PreviewPanel
            svg={svg}
            background={previewBg}
            onBackgroundChange={setPreviewBg}
          />
        </aside>

        <div className="space-y-6">
          <PresetSection activeId={activePresetId} onApply={applyPresetClick} />
          <ShapeSection value={data.shape} onChange={(v) => update("shape", v)} />
          <TextSection data={data} isCurved={isCurved} onChange={update} />
          <StyleSection data={data} onChange={update} />
        </div>
      </div>
    </div>
  );
}

// ── Disclaimer ───────────────────────────────────────────────────────────

function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
      <p>{STAMP_DISCLAIMER}</p>
    </div>
  );
}

// ── Section 1 — Presets ──────────────────────────────────────────────────

function PresetSection({
  activeId,
  onApply,
}: {
  activeId: string | null;
  onApply: (preset: StampPreset) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Start from a preset
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Legitimate business marking only — no notary, government, or bank seals.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAMP_PRESETS.map((p) => {
          const active = activeId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onApply(p)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-2xl border-2 p-3 text-left transition",
                active
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                  : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
              )}
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: p.suggestedColor }}
              />
              <span
                className={cn(
                  "text-xs font-semibold",
                  active
                    ? "text-primary-800 dark:text-primary-200"
                    : "text-surface-800 dark:text-surface-100"
                )}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Section 2 — Shape ────────────────────────────────────────────────────

function ShapeSection({
  value,
  onChange,
}: {
  value: StampShape;
  onChange: (v: StampShape) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Shape</h3>
      </header>
      <div className="grid grid-cols-3 gap-2">
        {SHAPES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            aria-pressed={value === s.value}
            className={cn(
              "rounded-2xl border-2 px-3 py-3 text-center text-xs font-semibold transition",
              value === s.value
                ? "border-primary-500 bg-primary-50 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200"
                : "border-surface-200 text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Section 3 — Text ─────────────────────────────────────────────────────

function TextSection({
  data,
  isCurved,
  onChange,
}: {
  data: StampData;
  isCurved: boolean;
  onChange: <K extends keyof StampData>(key: K, value: StampData[K]) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Text</h3>
      </header>
      <div className="space-y-4">
        <TextField
          label="Center text"
          required
          value={data.centerText}
          placeholder="APPROVED"
          onChange={(v) => onChange("centerText", v)}
        />
        <TextField
          label="Center sub-text"
          value={data.centerSubText}
          placeholder="Optional small line"
          onChange={(v) => onChange("centerSubText", v)}
        />

        {isCurved && (
          <>
            <TextField
              label="Top text (curved)"
              value={data.topText}
              placeholder="Your company name"
              onChange={(v) => onChange("topText", v)}
            />
            <TextField
              label="Bottom text (curved)"
              value={data.bottomText}
              placeholder="City or EST. 2020"
              onChange={(v) => onChange("bottomText", v)}
            />

            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <Toggle
                checked={data.starSeparators}
                onChange={(v) => onChange("starSeparators", v)}
              />
              <span className="inline-flex items-center gap-1.5 text-surface-800 dark:text-surface-100">
                <Star className="h-3.5 w-3.5 text-surface-400" />
                Star separators
              </span>
            </label>
          </>
        )}

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Date
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DATE_MODES.map((m) => (
              <SegButton
                key={m.value}
                active={data.dateMode === m.value}
                onClick={() => onChange("dateMode", m.value)}
              >
                {m.label}
              </SegButton>
            ))}
          </div>
          {data.dateMode === "fixed" && (
            <input
              type="date"
              value={data.fixedDate}
              onChange={(e) => onChange("fixedDate", e.target.value)}
              className={INPUT_CLS + " mt-2"}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ── Section 4 — Style ────────────────────────────────────────────────────

function StyleSection({
  data,
  onChange,
}: {
  data: StampData;
  onChange: <K extends keyof StampData>(key: K, value: StampData[K]) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Style</h3>
      </header>
      <div className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Ink color
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {STAMP_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange("color", c.hex)}
                aria-label={c.label}
                aria-pressed={data.color.toLowerCase() === c.hex.toLowerCase()}
                className={cn(
                  "h-8 w-8 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-white transition dark:ring-offset-surface-900",
                  data.color.toLowerCase() === c.hex.toLowerCase()
                    ? "ring-primary-500"
                    : "ring-transparent hover:ring-surface-300"
                )}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
            <CustomColorPicker value={data.color} onChange={(v) => onChange("color", v)} />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Border style
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BORDER_STYLES.map((b) => (
              <SegButton
                key={b.value}
                active={data.borderStyle === b.value}
                onClick={() => onChange("borderStyle", b.value)}
              >
                {b.label}
              </SegButton>
            ))}
          </div>
        </div>

        {data.borderStyle !== "none" && (
          <SliderRow
            label="Border width"
            value={data.borderWidth}
            min={1}
            max={14}
            step={1}
            suffix="px"
            onChange={(v) => onChange("borderWidth", v)}
          />
        )}

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Font
          </span>
          <select
            value={data.fontFamily}
            onChange={(e) => onChange("fontFamily", e.target.value)}
            className={INPUT_CLS}
          >
            {STAMP_FONTS.map((f) => (
              <option key={f.id} value={f.cssStack} style={{ fontFamily: f.cssStack }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Texture
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STAMP_TEXTURES.map((t) => (
              <SegButton
                key={t.id}
                active={data.textureStyle === t.id}
                onClick={() => onChange("textureStyle", t.id)}
              >
                {t.label}
              </SegButton>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            <span>Rotation</span>
            <button
              type="button"
              onClick={() => onChange("rotation", 0)}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] normal-case text-surface-500 transition hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100"
            >
              <RotateCcw className="h-3 w-3" /> 0°
            </button>
          </span>
          <input
            type="range"
            min={-20}
            max={20}
            step={1}
            value={data.rotation}
            onChange={(e) => onChange("rotation", Number(e.target.value))}
            className="w-full accent-primary-600"
          />
          <div className="mt-1 text-right text-[11px] text-surface-500 dark:text-surface-400">
            {data.rotation}°
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Preview panel ────────────────────────────────────────────────────────

function PreviewPanel({
  svg,
  background,
  onBackgroundChange,
}: {
  svg: string;
  background: "transparent" | "document";
  onBackgroundChange: (v: "transparent" | "document") => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <header className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
          <div className="flex gap-1.5">
            <SegButton
              active={background === "transparent"}
              onClick={() => onBackgroundChange("transparent")}
            >
              On transparent
            </SegButton>
            <SegButton
              active={background === "document"}
              onClick={() => onBackgroundChange("document")}
            >
              On document
            </SegButton>
          </div>
        </header>

        <div
          className={cn(
            "relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center overflow-hidden rounded-2xl",
            background === "transparent"
              ? "bg-[conic-gradient(at_50%_50%,#fff_25%,#e5e7eb_25%,#e5e7eb_50%,#fff_50%,#fff_75%,#e5e7eb_75%)] [background-size:20px_20px] dark:bg-[conic-gradient(at_50%_50%,#27272a_25%,#3f3f46_25%,#3f3f46_50%,#27272a_50%,#27272a_75%,#3f3f46_75%)]"
              : "bg-[#fdfcf9] dark:bg-surface-100"
          )}
        >
          {background === "document" && <DocumentLines />}
          <div
            className="relative w-3/4 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        <p className="mt-3 text-center text-[11px] text-surface-500 dark:text-surface-400">
          Downloads have a transparent background — drop the stamp straight onto your documents.
        </p>
      </div>
    </div>
  );
}

/** A handful of faint ruled lines behind the stamp so the "on document"
 *  mode reads as paper without needing an actual mockup image. */
function DocumentLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 inset-y-6 space-y-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-[2px] rounded-full bg-surface-300/60 dark:bg-surface-400/20"
        />
      ))}
    </div>
  );
}

// ── Small shared controls ────────────────────────────────────────────────

const INPUT_CLS =
  "w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white";

function TextField({
  label,
  value,
  placeholder,
  required,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLS}
      />
    </label>
  );
}

function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-500 text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
      )}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition",
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
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        <span>{label}</span>
        <span className="text-[10px] normal-case text-surface-500">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  );
}

function CustomColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-full border border-dashed border-surface-300 px-2.5 text-[11px] font-semibold text-surface-600 transition hover:border-surface-400 dark:border-surface-700 dark:text-surface-300"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: value }}
        />
        Custom
        <ChevronDown className={cn("h-3 w-3 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-2 rounded-xl border border-surface-200 bg-white p-3 shadow-lg dark:border-surface-800 dark:bg-surface-900">
          <HexColorPicker color={value} onChange={onChange} style={{ width: 180 }} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-surface-200 bg-white px-2 py-1.5 font-mono text-xs uppercase text-surface-900 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}

/** Debounce a value by `delay` ms — keeps the SVG string rebuild (and DOM
 *  injection) from firing on every keystroke or slider tick. */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
