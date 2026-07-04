"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  AlertTriangle,
  ChevronDown,
  Globe,
  Link2,
  Loader2,
  Monitor,
  Plus,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";

import { SignatureExport } from "./SignatureExport";

import {
  CalendlyIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@/components/icons/SocialIcons";
import {
  DEFAULT_FONT_STACK,
  TEMPLATES,
  WEB_SAFE_FONTS,
  type SignatureData,
  type SocialLink,
  type SocialPlatform,
  type TemplateId,
} from "@/lib/emailSignature";
import {
  generateSignatureHtml,
  generateSignaturePlainText,
} from "@/lib/generateSignatureHtml";
import { cn } from "@/lib/utils";

/**
 * /tools/email-signature-generator client component.
 *
 * Left: stacked form sections (Template, Details, Contact, Photo+Logo,
 * Social, Style, Extras). Right: live preview that re-renders the
 * bulletproof HTML from generateSignatureHtml on every keystroke.
 *
 * All rendering happens in-browser. The only network call is the
 * OPTIONAL image upload — signed-in users can hit
 * /api/business-card/upload (which drops the image into the
 * bc-avatars Supabase Storage bucket and returns a public URL);
 * everyone else can paste a URL to a photo they already host.
 *
 * The tool has no auth of its own, no database writes, no server
 * rendering step for the signature itself. Refresh the page and the
 * form resets — this is intentional (auth-gated persistence would
 * defeat the "instantly copy, no signup" positioning of the tool).
 */

const INITIAL_DATA: SignatureData = {
  fullName: "",
  jobTitle: "",
  company: "",
  department: "",
  email: "",
  phone: "",
  mobile: "",
  website: "",
  address: "",
  photoUrl: "",
  logoUrl: "",
  socialLinks: [],
  ctaText: "",
  ctaUrl: "",
  disclaimer: "",
  primaryColor: "#3B82F6",
  textColor: "#1F2937",
  font: DEFAULT_FONT_STACK,
  template: "classic-left",
};

const MAX_SOCIAL_LINKS = 8;

// ── Platform picker metadata ─────────────────────────────────────────────

type PlatformIcon = React.ComponentType<{ className?: string }>;

const PLATFORM_ICONS: Record<SocialPlatform, PlatformIcon> = {
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  github: GithubIcon,
  whatsapp: WhatsappIcon,
  calendly: CalendlyIcon,
  website: Globe,
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter / X",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  github: "GitHub",
  whatsapp: "WhatsApp",
  calendly: "Calendly",
  website: "Website",
};

const PLATFORM_ORDER: SocialPlatform[] = [
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "youtube",
  "github",
  "whatsapp",
  "calendly",
  "website",
];

// ── Component ────────────────────────────────────────────────────────────

export function EmailSignatureGenerator() {
  const [data, setData] = useState<SignatureData>(INITIAL_DATA);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewOpen, setPreviewOpen] = useState(true);

  const html = useMemo(() => generateSignatureHtml(data), [data]);
  const plainText = useMemo(() => generateSignaturePlainText(data), [data]);

  const nameError = !data.fullName.trim() ? "Full name is required" : null;
  const contactWarning =
    !data.email.trim() && !data.phone.trim() && !data.mobile.trim()
      ? "Add at least one contact method — an email or phone — so recipients can reach you."
      : null;

  const set = useCallback(
    <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[55%_45%]">
        {/* Mobile-first: preview appears above the form on small screens */}
        <aside className="order-first lg:order-last lg:sticky lg:top-24 lg:h-fit">
          <PreviewPanel
            html={html}
            mode={previewMode}
            onModeChange={setPreviewMode}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        </aside>

      <div className="space-y-6">
        {(nameError || contactWarning) && (
          <ValidationBanner name={nameError} contact={contactWarning} />
        )}

        {/* 1 — Template */}
        <Section title="Template" subtitle="Pick a layout — you can switch anytime without losing your details.">
          <TemplatePicker value={data.template} onChange={(t) => set("template", t)} />
        </Section>

        {/* 2 — Your details */}
        <Section title="Your details">
          <Grid>
            <Field label="Full name" required>
              <input
                value={data.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className={inputCls}
                placeholder="Daniel Makonor"
                autoComplete="name"
              />
            </Field>
            <Field label="Job title">
              <input
                value={data.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                className={inputCls}
                placeholder="Founder"
                autoComplete="organization-title"
              />
            </Field>
            <Field label="Company">
              <input
                value={data.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputCls}
                placeholder="UtilityApps"
                autoComplete="organization"
              />
            </Field>
            <Field label="Department">
              <input
                value={data.department}
                onChange={(e) => set("department", e.target.value)}
                className={inputCls}
                placeholder="Product & Engineering"
              />
            </Field>
          </Grid>
        </Section>

        {/* 3 — Contact */}
        <Section title="Contact">
          <Grid>
            <Field label="Email">
              <input
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls}
                placeholder="you@company.com"
                autoComplete="email"
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
            <Field label="Mobile">
              <input
                type="tel"
                value={data.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                className={inputCls}
                placeholder="+234 803 772 3164"
              />
            </Field>
            <Field label="Website">
              <input
                type="url"
                value={data.website}
                onChange={(e) => set("website", e.target.value)}
                className={inputCls}
                placeholder="utilityapps.site"
                autoComplete="url"
              />
            </Field>
          </Grid>
          <Field label="Address" hint="One or more lines — press Enter to break">
            <textarea
              value={data.address}
              onChange={(e) => set("address", e.target.value)}
              className={cn(inputCls, "min-h-[72px] resize-y")}
              placeholder="123 Main St&#10;Lagos, Nigeria"
            />
          </Field>
        </Section>

        {/* 4 — Photo & Logo */}
        <Section title="Photo & Logo">
          <div className="space-y-4">
            <ImagePicker
              label="Profile photo"
              value={data.photoUrl}
              onChange={(url) => set("photoUrl", url)}
              kind="avatar"
            />
            <ImagePicker
              label="Company logo"
              value={data.logoUrl}
              onChange={(url) => set("logoUrl", url)}
              kind="logo"
            />
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              Images must be publicly hosted to display in emails — we host yours automatically when you upload.
            </p>
          </div>
        </Section>

        {/* 5 — Social links */}
        <Section
          title="Social links"
          subtitle={`Add up to ${MAX_SOCIAL_LINKS} — icons render at 24 × 24 in the signature.`}
        >
          <SocialLinksEditor
            links={data.socialLinks}
            onChange={(links) => set("socialLinks", links)}
          />
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
                {WEB_SAFE_FONTS.map((f) => (
                  <option key={f.stack} value={f.stack} style={{ fontFamily: f.stack }}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
            <Grid>
              <ColorField
                label="Accent color"
                value={data.primaryColor}
                onChange={(v) => set("primaryColor", v)}
              />
              <ColorField
                label="Text color"
                value={data.textColor}
                onChange={(v) => set("textColor", v)}
              />
            </Grid>
          </div>
        </Section>

        {/* 7 — Extras */}
        <details className="group rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Extras</h3>
              <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                Optional CTA button and legal disclaimer.
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-surface-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 space-y-4">
            <Grid>
              <Field label="CTA button text" hint='e.g. "Book a call"'>
                <input
                  value={data.ctaText}
                  onChange={(e) => set("ctaText", e.target.value)}
                  className={inputCls}
                  placeholder="Book a call"
                  maxLength={40}
                />
              </Field>
              <Field label="CTA button URL">
                <input
                  type="url"
                  value={data.ctaUrl}
                  onChange={(e) => set("ctaUrl", e.target.value)}
                  className={inputCls}
                  placeholder="https://cal.com/you/30min"
                />
              </Field>
            </Grid>
            <Field
              label="Disclaimer / confidentiality"
              hint="Small print shown below the signature — legal, GDPR, or a note."
            >
              <textarea
                value={data.disclaimer}
                onChange={(e) => set("disclaimer", e.target.value)}
                className={cn(inputCls, "min-h-[72px] resize-y")}
                maxLength={500}
                placeholder="This email and any attachments are confidential…"
              />
            </Field>
          </div>
        </details>
        </div>
      </div>

      {/* Copy CTAs + reassurance strip + per-client install guide. Sits
          as a full-width row so the export flow gets the same
          horizontal space regardless of template. */}
      <SignatureExport html={html} plainText={plainText} />
    </div>
  );
}

// ── Preview panel ────────────────────────────────────────────────────────

function PreviewPanel({
  html,
  mode,
  onModeChange,
  open,
  onOpenChange,
}: {
  html: string;
  mode: "desktop" | "mobile";
  onModeChange: (m: "desktop" | "mobile") => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const maxWidth = mode === "mobile" ? "360px" : "560px";

  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Live preview
          </p>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
            This is exactly what recipients see.
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
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")}
          />
        </button>
      </div>

      {open && (
        <>
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-inner dark:border-surface-800">
            {/* The signature renders here. dangerouslySetInnerHTML is
                fine because generateSignatureHtml escapes every user
                string before interpolation. */}
            <div
              style={{ maxWidth, margin: "0 auto" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Desktop/mobile toggle only — copy buttons live in
              SignatureExport below the whole layout now. */}
          <div className="mt-3 flex items-center justify-start">
            <div className="inline-flex rounded-xl border border-surface-200 p-0.5 dark:border-surface-800">
              <button
                type="button"
                onClick={() => onModeChange("desktop")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                  mode === "desktop"
                    ? "bg-primary-600 text-white"
                    : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
                )}
              >
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => onModeChange("mobile")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                  mode === "mobile"
                    ? "bg-primary-600 text-white"
                    : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
                )}
              >
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-snug text-surface-500 dark:text-surface-400">
            Outlook may show photos as squares instead of circles — this is normal and expected.
          </p>
        </>
      )}
    </div>
  );
}

// ── Validation banner ────────────────────────────────────────────────────

function ValidationBanner({
  name,
  contact,
}: {
  name: string | null;
  contact: string | null;
}) {
  return (
    <div className="space-y-2">
      {name && (
        <p className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="h-3 w-3" /> {name}
        </p>
      )}
      {contact && (
        <p className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="h-3 w-3 shrink-0" /> {contact}
        </p>
      )}
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
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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
              className="aspect-[7/4] w-full"
              // TEMPLATES[i].thumbnail is a static inline SVG string
              // authored in lib/emailSignature.ts — no user input.
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

// ── Image picker (upload + paste URL) ────────────────────────────────────

function ImagePicker({
  label,
  value,
  onChange,
  kind,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: "avatar" | "logo";
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
      const blob = await compressForSignature(f);
      const form = new FormData();
      form.append("file", blob, filenameFor(f, blob));
      form.append("kind", kind);
      const res = await fetch("/api/business-card/upload", {
        method: "POST",
        body: form,
      });
      const json = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };
      if (res.status === 401) {
        setError(
          "Sign in with Google (top right) to upload — or paste an image URL below instead."
        );
        return;
      }
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

  const shape = kind === "avatar" ? "rounded-full" : "rounded-xl";

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
              "h-16 w-16 shrink-0 border border-surface-200 object-cover dark:border-surface-800",
              shape
            )}
          />
        ) : (
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center border-2 border-dashed border-surface-300 text-surface-400 dark:border-surface-700",
              shape
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
      {error && (
        <p className="mt-2 text-[11px] text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/** Compress + resize to signature-safe dimensions. Target: 200 px on
 *  the longest side, JPEG q iteratively reduced until under 50 KB.
 *  Signatures are tiny in real emails — big images bloat every reply
 *  chain the recipient sends. */
async function compressForSignature(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const largest = Math.max(bitmap.width, bitmap.height);
  const scale = largest > 200 ? 200 / largest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  let quality = 0.9;
  let out: Blob | null = null;
  // Try progressively lower quality until the file is under 50 KB or
  // we've bottomed out at 0.35. Under-quality photos still read fine
  // at 200 px, and signature images are almost always small crops.
  while (quality > 0.3) {
    out = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (out && out.size <= 50 * 1024) break;
    quality -= 0.15;
  }
  return out ?? file;
}

function filenameFor(original: File, blob: Blob): string {
  const base = original.name.replace(/\.[^.]+$/, "") || "signature";
  const ext =
    blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] ?? "jpg";
  return `${base}.${ext}`;
}

// ── Social-links editor ──────────────────────────────────────────────────

function SocialLinksEditor({
  links,
  onChange,
}: {
  links: SocialLink[];
  onChange: (next: SocialLink[]) => void;
}) {
  const canAdd = links.length < MAX_SOCIAL_LINKS;
  const add = () => onChange([...links, { platform: "linkedin", url: "" }]);
  const update = (i: number, patch: Partial<SocialLink>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {links.map((l, i) => {
        const Icon = PLATFORM_ICONS[l.platform];
        return (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-200 bg-surface-50/60 p-2 dark:border-surface-800 dark:bg-surface-900/40"
          >
            <PlatformSelect
              value={l.platform}
              onChange={(p) => update(i, { platform: p })}
            />
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-surface-200 bg-white px-2 dark:border-surface-700 dark:bg-surface-900">
              <Icon className="h-3.5 w-3.5 shrink-0 text-surface-500" />
              <input
                value={l.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder={`https://…/${l.platform === "website" ? "" : l.platform + "/username"}`}
                className="min-w-[140px] flex-1 bg-transparent py-1 text-xs text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-surface-500 hover:bg-surface-200 disabled:opacity-30 dark:hover:bg-surface-700"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === links.length - 1}
                className="rounded p-1 text-surface-500 hover:bg-surface-200 disabled:opacity-30 dark:hover:bg-surface-700"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20"
                aria-label="Remove link"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
      {canAdd ? (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-surface-300 px-3 py-2 text-xs font-medium text-surface-600 transition hover:border-primary-400 hover:text-primary-700 dark:border-surface-700 dark:text-surface-300"
        >
          <Plus className="h-3 w-3" /> Add social link
        </button>
      ) : (
        <p className="text-[11px] text-surface-500 dark:text-surface-400">
          You&rsquo;ve added the maximum {MAX_SOCIAL_LINKS} links.
        </p>
      )}
    </div>
  );
}

function PlatformSelect({
  value,
  onChange,
}: {
  value: SocialPlatform;
  onChange: (p: SocialPlatform) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SocialPlatform)}
      className="rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs text-surface-800 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
    >
      {PLATFORM_ORDER.map((p) => (
        <option key={p} value={p}>
          {PLATFORM_LABELS[p]}
        </option>
      ))}
    </select>
  );
}

// ── Section / Field / Color / Grid primitives ────────────────────────────

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
