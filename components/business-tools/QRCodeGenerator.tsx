"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import { HexColorPicker } from "react-colorful";
import {
  AlertTriangle,
  Bitcoin,
  Calendar,
  Check,
  ChevronDown,
  Clipboard,
  Contact,
  Copy,
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Smartphone,
  Trash2,
  Type as TypeIcon,
  Upload,
  Wifi,
} from "lucide-react";

import {
  ERROR_CORRECTION_LEVELS,
  ERROR_CORRECTION_LEVELS_BY_ID,
  QR_STYLE_PRESETS,
  QR_TYPES,
  QR_TYPES_BY_ID,
  encode,
  recommendedErrorCorrection,
  type CornerStyle,
  type DotStyle,
  type ErrorCorrectionId,
  type QrField,
  type QrType,
  type QrTypeId,
} from "@/lib/qrCodeTypes";
import { cn } from "@/lib/utils";

/**
 * /tools/qr-code-generator client component.
 *
 * Left panel: content-type picker + dynamic form driven by
 * QR_TYPES[i].fields. Right panel: live QR preview (rendered by
 * qr-code-styling on a canvas), style controls, logo upload, contrast
 * warning, and PNG/SVG/JPG downloads at 4 preset sizes.
 *
 * Every part of the pipeline runs in the browser. There's no server
 * call — no auth, no persistence, no upload. Even the logo becomes a
 * data URL that lives entirely in memory and gets composed onto the
 * QR canvas by qr-code-styling.
 *
 * qr-code-styling is imported dynamically inside effects, not at the
 * module top level, so its browser-only APIs (canvas, DOMParser)
 * don't get pulled into the server bundle.
 */

// ── Icon map for the type picker ─────────────────────────────────────────

type IconComponent = ComponentType<{ className?: string }>;

const TYPE_ICONS: Record<QrTypeId, IconComponent> = {
  url: LinkIcon,
  text: TypeIcon,
  wifi: Wifi,
  vcard: Contact,
  email: Mail,
  sms: MessageSquare,
  phone: Phone,
  whatsapp: MessageCircle,
  event: Calendar,
  geo: MapPin,
  crypto: Bitcoin,
  app: Smartphone,
};

// ── Styling state ────────────────────────────────────────────────────────

interface Styling {
  foregroundColor: string;
  backgroundColor: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  /** Data URL for the embedded logo, or "" for no logo. */
  logoUrl: string;
  /** Fraction of the QR area the logo covers. 0.15 – 0.35 is sensible. */
  logoSize: number;
  errorCorrection: ErrorCorrectionId;
  margin: number;
  /** When true, backgroundOptions.color is set to "transparent" instead
   *  of backgroundColor — affects the downloaded PNG (SVG always has
   *  transparent unfilled areas). */
  transparent: boolean;
}

const INITIAL_STYLING: Styling = {
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
  dotStyle: "square",
  cornerStyle: "square",
  logoUrl: "",
  logoSize: 0.25,
  errorCorrection: "M",
  margin: 4,
  transparent: false,
};

// ── Download sizes ───────────────────────────────────────────────────────

const SIZES = [
  { label: "Small", value: 500, hint: "Web / email inline" },
  { label: "Medium", value: 1000, hint: "Business cards" },
  { label: "Large", value: 2000, hint: "Flyers, packaging" },
  { label: "Print", value: 4000, hint: "Posters, signs" },
] as const;

// ── Dot & corner style options for the toggles ───────────────────────────

const DOT_STYLE_OPTIONS: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy round" },
  { value: "extra-rounded", label: "Extra round" },
];

const CORNER_STYLE_OPTIONS: { value: CornerStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Dot" },
];

// ── Main component ───────────────────────────────────────────────────────

export function QRCodeGenerator() {
  const [activeType, setActiveType] = useState<QrTypeId>("url");
  const [fieldValues, setFieldValues] = useState<Record<string, string | boolean>>({});
  const [styling, setStyling] = useState<Styling>(INITIAL_STYLING);
  const [size, setSize] = useState<number>(1000);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<"png" | "svg" | "jpeg" | "copy" | null>(null);
  const [copyResult, setCopyResult] = useState<"ok" | "fail" | null>(null);

  const type = QR_TYPES_BY_ID[activeType];

  // Compute the encoded payload from the current form values.
  const qrData = useMemo(
    () => encode(activeType, fieldValues),
    [activeType, fieldValues]
  );

  // Contrast for the warning banner.
  const contrast = useMemo(
    () =>
      contrastRatio(
        styling.foregroundColor,
        styling.transparent ? "#FFFFFF" : styling.backgroundColor
      ),
    [styling.foregroundColor, styling.backgroundColor, styling.transparent]
  );

  // Switch type: reset field values + errors so the previous type's
  // stale entries don't leak into the new payload.
  const changeType = useCallback((id: QrTypeId) => {
    setActiveType(id);
    setFieldValues({});
    setErrors({});
  }, []);

  const setField = useCallback((key: string, value: string | boolean) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    for (const f of type.fields) {
      if (f.required) {
        const raw = fieldValues[f.key];
        const empty = typeof raw === "boolean" ? false : !String(raw ?? "").trim();
        if (empty) next[f.key] = `${f.label} is required`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [type, fieldValues]);

  const setStyle = useCallback(<K extends keyof Styling>(key: K, value: Styling[K]) => {
    setStyling((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Auto-raise error correction when a logo is embedded — the logo
  // covers a chunk of the code and the extra redundancy keeps it
  // scannable. Auto-lower when the logo is removed if the level is
  // still at H (the level users would only choose because of the logo).
  useEffect(() => {
    const wanted = recommendedErrorCorrection(!!styling.logoUrl);
    if (styling.logoUrl && styling.errorCorrection !== "H") {
      setStyling((prev) => ({ ...prev, errorCorrection: "H" }));
    } else if (!styling.logoUrl && styling.errorCorrection === "H") {
      setStyling((prev) => ({ ...prev, errorCorrection: wanted }));
    }
  }, [styling.logoUrl]);

  const runDownload = useCallback(
    async (extension: "png" | "svg" | "jpeg") => {
      if (!validate()) return;
      if (!qrData) return;
      setBusy(extension);
      try {
        // Fresh instance at the requested download size so the preview
        // never has to visibly re-render at 4000px.
        const Module = await import("qr-code-styling");
        const QRCodeStyling = Module.default as unknown as QrCodeStylingCtor;
        const inst = new QRCodeStyling(buildOptions(qrData, styling, size));
        await inst.download({
          name: `qr-code-${activeType}`,
          extension,
        });
      } finally {
        setBusy(null);
      }
    },
    [validate, qrData, styling, size, activeType]
  );

  const copyImage = useCallback(async () => {
    if (!validate()) return;
    if (!qrData) return;
    setBusy("copy");
    setCopyResult(null);
    try {
      const Module = await import("qr-code-styling");
      const QRCodeStyling = Module.default as unknown as QrCodeStylingCtor;
      const inst = new QRCodeStyling(buildOptions(qrData, styling, 1000));
      const raw = await inst.getRawData("png");
      if (!raw) throw new Error("no data");
      // Node Buffer vs browser Blob — qr-code-styling returns Buffer in
      // some builds. Normalise to Blob.
      const blob =
        raw instanceof Blob
          ? raw
          : new Blob([raw as unknown as ArrayBuffer], { type: "image/png" });
      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        "write" in navigator.clipboard
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopyResult("ok");
      } else {
        setCopyResult("fail");
      }
    } catch {
      setCopyResult("fail");
    } finally {
      setBusy(null);
      window.setTimeout(() => setCopyResult(null), 2500);
    }
  }, [validate, qrData, styling]);

  return (
    <div className="grid gap-6 lg:grid-cols-[55%_45%]">
      {/* Preview aside — first in DOM order for mobile-first, moved to
          the right column on lg via order-last + sticky. */}
      <aside className="order-first lg:order-last lg:sticky lg:top-24 lg:h-fit">
        <QrPreviewPanel
          data={qrData}
          styling={styling}
          contrast={contrast}
          size={size}
          onStyleChange={setStyle}
          onLogoRemove={() => setStyle("logoUrl", "")}
          onSizeChange={setSize}
          onDownload={runDownload}
          onCopy={copyImage}
          busy={busy}
          copyResult={copyResult}
        />
      </aside>

      <div className="space-y-6">
        <TypeSelector value={activeType} onChange={changeType} />
        <FieldsForm
          type={type}
          values={fieldValues}
          errors={errors}
          onChange={setField}
        />
      </div>
    </div>
  );
}

// ── Type selector ────────────────────────────────────────────────────────

function TypeSelector({
  value,
  onChange,
}: {
  value: QrTypeId;
  onChange: (id: QrTypeId) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          What's the QR for?
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          Pick a content type — scanners switch UX (add contact, join WiFi, open Maps) based on which you choose.
        </p>
      </header>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {QR_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.id];
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-2xl border-2 p-3 text-left transition",
                active
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                  : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
              )}
              aria-pressed={active}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm",
                  active ? "bg-primary-600" : "bg-surface-400 dark:bg-surface-700"
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  active
                    ? "text-primary-800 dark:text-primary-200"
                    : "text-surface-800 dark:text-surface-100"
                )}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Fields form ──────────────────────────────────────────────────────────

function FieldsForm({
  type,
  values,
  errors,
  onChange,
}: {
  type: QrType;
  values: Record<string, string | boolean>;
  errors: Record<string, string>;
  onChange: (key: string, value: string | boolean) => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          {type.name} details
        </h3>
        <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
          {type.description}
        </p>
      </header>
      <div className="space-y-4">
        {type.fields.map((f) => (
          <FieldRow
            key={`${type.id}-${f.key}`}
            field={f}
            value={values[f.key]}
            error={errors[f.key]}
            onChange={(v) => onChange(f.key, v)}
          />
        ))}
        {type.id === "whatsapp" && (
          <p className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-[11px] text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200">
            Include the country code (e.g. <code>+2348037723164</code>) with no spaces or dashes — WhatsApp's link format requires it.
          </p>
        )}
      </div>
    </section>
  );
}

function FieldRow({
  field,
  value,
  error,
  onChange,
}: {
  field: QrField;
  value: string | boolean | undefined;
  error?: string;
  onChange: (v: string | boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const strValue = typeof value === "string" ? value : "";
  const boolValue = typeof value === "boolean" ? value : false;

  // Non-standard rendering for checkbox — it's a toggle row, not a
  // label-above-input row.
  if (field.type === "checkbox") {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <button
            type="button"
            role="switch"
            aria-checked={boolValue}
            onClick={() => onChange(!boolValue)}
            className={cn(
              "relative h-6 w-10 shrink-0 rounded-full transition",
              boolValue ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                boolValue ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
          <span className="text-surface-800 dark:text-surface-100">{field.label}</span>
        </label>
        {field.hint && (
          <p className="mt-1 pl-14 text-[11px] text-surface-500 dark:text-surface-400">
            {field.hint}
          </p>
        )}
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white";

  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between gap-2 text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        <span>
          {field.label}
          {field.required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      </span>

      {field.type === "select" ? (
        <select
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={cn(inputCls, "min-h-[80px] resize-y")}
        />
      ) : field.type === "password" ? (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(inputCls, "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-surface-500 transition hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      ) : (
        <input
          type={field.type}
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
      )}

      {field.hint && !error && (
        <span className="block text-[11px] text-surface-500 dark:text-surface-400">
          {field.hint}
        </span>
      )}
      {error && (
        <span className="block text-[11px] font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

// ── Preview panel ────────────────────────────────────────────────────────

function QrPreviewPanel({
  data,
  styling,
  contrast,
  size,
  onStyleChange,
  onLogoRemove,
  onSizeChange,
  onDownload,
  onCopy,
  busy,
  copyResult,
}: {
  data: string;
  styling: Styling;
  contrast: number;
  size: number;
  onStyleChange: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
  onLogoRemove: () => void;
  onSizeChange: (n: number) => void;
  onDownload: (ext: "png" | "svg" | "jpeg") => void;
  onCopy: () => void;
  busy: "png" | "svg" | "jpeg" | "copy" | null;
  copyResult: "ok" | "fail" | null;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <header className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
        </header>
        <LiveQrCanvas data={data} styling={styling} />
        {contrast < 3 && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Low contrast (ratio {contrast.toFixed(1)}:1)</strong> — this QR may not scan reliably. Use a darker foreground on a lighter background (aim for 3:1 or higher).
            </span>
          </p>
        )}
      </div>

      <StyleControls
        styling={styling}
        onChange={onStyleChange}
        onLogoRemove={onLogoRemove}
      />

      <DownloadPanel
        size={size}
        onSizeChange={onSizeChange}
        onDownload={onDownload}
        onCopy={onCopy}
        busy={busy}
        copyResult={copyResult}
        transparent={styling.transparent}
        onToggleTransparent={(v) => onStyleChange("transparent", v)}
        disabled={!data}
      />

      <ScannabilityReminder />
    </div>
  );
}

// ── Live QR canvas ───────────────────────────────────────────────────────

const PREVIEW_SIZE = 300;

function LiveQrCanvas({ data, styling }: { data: string; styling: Styling }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Type kept loose — qr-code-styling doesn't ship stellar types.
  const instanceRef = useRef<QrCodeStylingInstance | null>(null);
  const debouncedData = useDebounce(data, 200);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!containerRef.current) return;
      const Module = await import("qr-code-styling");
      if (cancelled || !containerRef.current) return;
      const QRCodeStyling = Module.default as unknown as QrCodeStylingCtor;
      const opts = buildOptions(debouncedData || "https://utilityapps.site", styling, PREVIEW_SIZE);
      if (!instanceRef.current) {
        instanceRef.current = new QRCodeStyling(opts);
        instanceRef.current.append(containerRef.current);
      } else {
        instanceRef.current.update(opts);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedData, styling]);

  if (!debouncedData) {
    return (
      <div className="relative">
        <div
          ref={containerRef}
          aria-hidden="true"
          className="mx-auto flex h-[300px] w-[300px] items-center justify-center opacity-20 blur-sm"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-2xl bg-white/80 px-4 py-3 text-center text-xs font-medium text-surface-600 shadow backdrop-blur dark:bg-surface-900/80 dark:text-surface-300">
            Fill in the details to generate your QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex h-[300px] w-[300px] items-center justify-center rounded-2xl bg-white p-2 dark:bg-surface-100"
    />
  );
}

// ── Style controls ───────────────────────────────────────────────────────

function StyleControls({
  styling,
  onChange,
  onLogoRemove,
}: {
  styling: Styling;
  onChange: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
  onLogoRemove: () => void;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Style</h3>
      </header>
      <div className="space-y-4">
        <PresetGrid current={styling} onApply={onChange} />

        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Foreground"
            value={styling.foregroundColor}
            onChange={(v) => onChange("foregroundColor", v)}
          />
          <ColorField
            label="Background"
            value={styling.backgroundColor}
            onChange={(v) => onChange("backgroundColor", v)}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Dot style
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DOT_STYLE_OPTIONS.map((o) => (
              <SegButton
                key={o.value}
                active={styling.dotStyle === o.value}
                onClick={() => onChange("dotStyle", o.value)}
              >
                {o.label}
              </SegButton>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Corner style
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CORNER_STYLE_OPTIONS.map((o) => (
              <SegButton
                key={o.value}
                active={styling.cornerStyle === o.value}
                onClick={() => onChange("cornerStyle", o.value)}
              >
                {o.label}
              </SegButton>
            ))}
          </div>
        </div>

        <LogoPicker
          value={styling.logoUrl}
          onChange={(url) => onChange("logoUrl", url)}
          onClear={onLogoRemove}
        />
        {styling.logoUrl && (
          <p className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-[11px] text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200">
            Logo added — error correction raised to <strong>H</strong> to keep the code scannable.
          </p>
        )}

        <div>
          <span className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
            <span>Error correction</span>
            <span className="text-[10px] normal-case text-surface-500">
              {ERROR_CORRECTION_LEVELS_BY_ID[styling.errorCorrection]?.percent}% recovery
            </span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ERROR_CORRECTION_LEVELS.map((l) => (
              <SegButton
                key={l.id}
                active={styling.errorCorrection === l.id}
                onClick={() => onChange("errorCorrection", l.id)}
              >
                {l.id} · {l.name}
              </SegButton>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
            {ERROR_CORRECTION_LEVELS_BY_ID[styling.errorCorrection]?.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function PresetGrid({
  current,
  onApply,
}: {
  current: Styling;
  onApply: <K extends keyof Styling>(key: K, value: Styling[K]) => void;
}) {
  const apply = (id: string) => {
    const preset = QR_STYLE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    onApply("dotStyle", preset.dotStyle);
    onApply("cornerStyle", preset.cornerStyle);
    onApply("foregroundColor", preset.colors.dark);
    onApply("backgroundColor", preset.colors.light);
  };
  // Roughly detect an active preset — if all four match. Otherwise nothing is highlighted.
  const activeId = QR_STYLE_PRESETS.find(
    (p) =>
      p.dotStyle === current.dotStyle &&
      p.cornerStyle === current.cornerStyle &&
      p.colors.dark.toLowerCase() === current.foregroundColor.toLowerCase() &&
      p.colors.light.toLowerCase() === current.backgroundColor.toLowerCase()
  )?.id;

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        Presets
      </span>
      <div className="flex flex-wrap gap-1.5">
        {QR_STYLE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => apply(p.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              activeId === p.id
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
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
            className="mt-2 w-full rounded-lg border border-surface-200 bg-white px-2 py-1.5 font-mono text-sm uppercase text-surface-900 dark:border-surface-800 dark:bg-surface-900 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}

// ── Logo picker ──────────────────────────────────────────────────────────

function LogoPicker({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/^image\/(jpeg|png|webp|svg\+xml)$/.test(f.type)) {
      setErr("Only JPG, PNG, WEBP, or SVG.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const dataUrl = await compressLogo(f);
      onChange(dataUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to read image");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
        Logo (optional)
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg border border-surface-200 object-contain p-1 dark:border-surface-800"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-surface-300 text-surface-400 dark:border-surface-700">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
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
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={onFile}
          className="hidden"
        />
      </div>
      {err && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{err}</p>}
    </div>
  );
}

/** Compress + resize the uploaded logo to ~200×200 as a data URL. All
 *  local — the QR renderer accepts data URLs so we don't need to
 *  upload anywhere. */
async function compressLogo(file: File): Promise<string> {
  // SVG can be inlined as-is (small + vector) — no canvas conversion needed.
  if (file.type === "image/svg+xml") {
    return fileToDataUrl(file);
  }
  const bitmap = await createImageBitmap(file);
  const largest = Math.max(bitmap.width, bitmap.height);
  const scale = largest > 200 ? 200 / largest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fileToDataUrl(file);
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

// ── Download panel ───────────────────────────────────────────────────────

function DownloadPanel({
  size,
  onSizeChange,
  onDownload,
  onCopy,
  busy,
  copyResult,
  transparent,
  onToggleTransparent,
  disabled,
}: {
  size: number;
  onSizeChange: (n: number) => void;
  onDownload: (ext: "png" | "svg" | "jpeg") => void;
  onCopy: () => void;
  busy: "png" | "svg" | "jpeg" | "copy" | null;
  copyResult: "ok" | "fail" | null;
  transparent: boolean;
  onToggleTransparent: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Download</h3>
      </header>

      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Size
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onSizeChange(s.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition",
                size === s.value
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
              )}
              title={s.hint}
            >
              {s.label} · {s.value}px
            </button>
          ))}
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-3 text-xs">
        <button
          type="button"
          role="switch"
          aria-checked={transparent}
          onClick={() => onToggleTransparent(!transparent)}
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition",
            transparent ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              transparent ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </button>
        <span className="text-surface-700 dark:text-surface-200">
          Transparent background <span className="text-surface-500">(PNG / SVG only)</span>
        </span>
      </label>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <DownloadBtn
          onClick={() => onDownload("png")}
          busy={busy === "png"}
          disabled={disabled}
          primary
        >
          <Download className="h-4 w-4" /> PNG
        </DownloadBtn>
        <DownloadBtn
          onClick={() => onDownload("svg")}
          busy={busy === "svg"}
          disabled={disabled}
        >
          <Download className="h-4 w-4" /> SVG
        </DownloadBtn>
        <DownloadBtn
          onClick={() => onDownload("jpeg")}
          busy={busy === "jpeg"}
          disabled={disabled}
        >
          <Download className="h-4 w-4" /> JPG
        </DownloadBtn>
      </div>

      <button
        type="button"
        onClick={onCopy}
        disabled={disabled || busy === "copy"}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-surface-200 px-4 py-2 text-xs font-semibold text-surface-800 transition hover:border-surface-300 disabled:opacity-60 dark:border-surface-800 dark:text-surface-100"
      >
        {busy === "copy" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : copyResult === "ok" ? (
          <Check className="h-4 w-4 text-success-600" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
        {copyResult === "ok" ? "Copied to clipboard" : copyResult === "fail" ? "Copy failed — try again" : "Copy QR image"}
      </button>
    </section>
  );
}

function DownloadBtn({
  onClick,
  busy,
  disabled,
  primary,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold transition disabled:opacity-60",
        primary
          ? "bg-primary-600 text-white hover:bg-primary-700"
          : "border border-surface-200 text-surface-800 hover:border-surface-300 dark:border-surface-800 dark:text-surface-100"
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

// ── Scannability reminder ────────────────────────────────────────────────

function ScannabilityReminder() {
  return (
    <section className="rounded-3xl border border-success-200 bg-success-50/60 p-4 text-xs text-success-900 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-100">
      <p className="flex items-start gap-2">
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-400" />
        <span>
          <strong>Test your QR code before printing</strong> — scan it with your phone camera to confirm it works. Keep good contrast between the code and the background, and don't shrink below ~2 cm when printed.
        </span>
      </p>
    </section>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

/** Build the qr-code-styling options object from our styling state.
 *  Centralised so the preview, the copy handler, and each download
 *  share the exact same configuration. */
function buildOptions(data: string, styling: Styling, size: number): QrCodeStylingOptions {
  return {
    width: size,
    height: size,
    type: "canvas",
    data: data || "https://utilityapps.site",
    image: styling.logoUrl || undefined,
    qrOptions: {
      errorCorrectionLevel: styling.errorCorrection,
      margin: styling.margin,
    },
    dotsOptions: {
      color: styling.foregroundColor,
      type: styling.dotStyle,
    },
    cornersSquareOptions: {
      color: styling.foregroundColor,
      type: styling.cornerStyle,
    },
    cornersDotOptions: {
      color: styling.foregroundColor,
    },
    backgroundOptions: {
      color: styling.transparent ? "transparent" : styling.backgroundColor,
    },
    imageOptions: {
      imageSize: styling.logoSize,
      margin: 4,
      crossOrigin: "anonymous",
      hideBackgroundDots: true,
    },
  };
}

/** Debounce a value by `delay` ms — used to keep the QR canvas from
 *  re-rendering on every keystroke of a URL/text field. */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** WCAG relative luminance for a hex colour. Returns 0..1. */
function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const norm = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * norm(rgb.r) + 0.7152 * norm(rgb.g) + 0.0722 * norm(rgb.b);
}

/** WCAG contrast ratio between two hex colours. Symmetric — order
 *  doesn't matter. */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// ── qr-code-styling shim types ───────────────────────────────────────────

/** qr-code-styling ships weak types. We only touch a small surface —
 *  append(), update(), download(), getRawData() — so keep the shape
 *  local rather than importing (and pinning to) the library's types. */
interface QrCodeStylingOptions {
  width?: number;
  height?: number;
  type?: "canvas" | "svg";
  data?: string;
  image?: string;
  qrOptions?: {
    errorCorrectionLevel?: ErrorCorrectionId;
    margin?: number;
    typeNumber?: number;
  };
  dotsOptions?: { color?: string; type?: DotStyle };
  cornersSquareOptions?: { color?: string; type?: CornerStyle };
  cornersDotOptions?: { color?: string };
  backgroundOptions?: { color?: string };
  imageOptions?: {
    imageSize?: number;
    margin?: number;
    crossOrigin?: string;
    hideBackgroundDots?: boolean;
  };
}

interface QrCodeStylingInstance {
  append(el: HTMLElement): void;
  update(options: QrCodeStylingOptions): void;
  download(opts: { name?: string; extension?: "png" | "svg" | "jpeg" }): Promise<void> | void;
  getRawData(ext?: "png" | "svg" | "jpeg"): Promise<Blob | ArrayBuffer | null>;
}

interface QrCodeStylingCtor {
  new (opts: QrCodeStylingOptions): QrCodeStylingInstance;
}
