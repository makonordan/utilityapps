"use client";

import { useEffect, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";

import { AvatarUpload } from "./AvatarUpload";
import { CardView } from "./CardView";
import type {
  BcCardRow,
  BcCardType,
  BcSocialLink,
  BcTheme,
} from "@/lib/businessCard/types";
import { PLAN_LIMITS } from "@/lib/businessCard/types";
import { cn } from "@/lib/utils";

/**
 * Card editor form. Powers both the create wizard (new-card mode) and
 * the edit page (existing-card mode). Layout: form on the left, live
 * preview on the right that re-renders on every keystroke — no api
 * roundtrips needed because we reuse the same CardView component that
 * renders the public page.
 *
 * Submitting saves via POST or PATCH depending on mode.
 */

export type CardFormMode =
  | { kind: "create"; username: string }
  | { kind: "edit"; card: BcCardRow; username: string };

const THEME_LABELS: Record<BcTheme, string> = {
  minimal: "Minimal",
  gradient: "Gradient",
  dark: "Dark",
  professional: "Professional",
  creative: "Creative",
};

const SOCIAL_PLATFORM_LABELS: Record<BcSocialLink["platform"], string> = {
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  github: "GitHub",
  dribbble: "Dribbble",
  behance: "Behance",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  calendly: "Calendly",
  linktree: "Linktree",
  custom: "Website / Other",
};

export function CardForm({
  mode,
  plan = "free",
  onSaved,
}: {
  mode: CardFormMode;
  plan?: "free" | "pro" | "business";
  onSaved?: (card: BcCardRow) => void;
}) {
  const initial: Partial<BcCardRow> =
    mode.kind === "edit"
      ? mode.card
      : {
          card_type: "personal",
          full_name: "",
          brand_color_primary: "#3B82F6",
          brand_color_secondary: "#1E40AF",
          card_theme: "minimal",
          is_active: true,
          is_master_visible: true,
          vcf_include_photo: true,
          vcf_include_address: false,
          social_links: [],
        };
  const [values, setValues] = useState<Partial<BcCardRow>>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const limits = PLAN_LIMITS[plan];

  // Auto-save on edit mode; explicit submit on create.
  useEffect(() => {
    if (mode.kind !== "edit") return;
    if (!savedAt && !values.updated_at) return; // don't fire on first mount
    const t = setTimeout(async () => {
      await autosave();
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const autosave = async () => {
    if (mode.kind !== "edit") return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/business-card/cards/${mode.card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; card?: BcCardRow };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Save failed");
      } else {
        setSavedAt(new Date());
        if (json.card) setValues(json.card);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (mode.kind !== "create") return;
    if (!values.full_name?.trim()) {
      setError("Full name is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/business-card/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; card?: BcCardRow };
      if (!res.ok || !json.ok || !json.card) {
        setError(json.error ?? "Create failed");
        return;
      }
      onSaved?.(json.card);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  };

  // Merge values with sensible defaults into a BcCardRow-shaped object
  // the preview can render.
  const previewCard: BcCardRow = useMemo(
    () => ({
      id: mode.kind === "edit" ? mode.card.id : "preview",
      user_id: mode.kind === "edit" ? mode.card.user_id : "preview",
      slug: values.slug ?? "preview",
      card_type: (values.card_type ?? "personal") as BcCardType,
      is_active: values.is_active ?? true,
      is_master_visible: values.is_master_visible ?? true,
      display_order: values.display_order ?? 0,
      full_name: values.full_name?.trim() || "Your name",
      job_title: values.job_title ?? null,
      company_name: values.company_name ?? null,
      department: values.department ?? null,
      pronouns: values.pronouns ?? null,
      tagline: values.tagline ?? null,
      bio: values.bio ?? null,
      email: values.email ?? null,
      phone_primary: values.phone_primary ?? null,
      phone_secondary: values.phone_secondary ?? null,
      website: values.website ?? null,
      address_street: values.address_street ?? null,
      address_city: values.address_city ?? null,
      address_state: values.address_state ?? null,
      address_country: values.address_country ?? null,
      address_postal: values.address_postal ?? null,
      social_links: values.social_links ?? [],
      avatar_url: values.avatar_url ?? null,
      brand_color_primary: values.brand_color_primary ?? "#3B82F6",
      brand_color_secondary: values.brand_color_secondary ?? "#1E40AF",
      card_theme: (values.card_theme ?? "minimal") as BcTheme,
      logo_url: values.logo_url ?? null,
      vcf_include_photo: values.vcf_include_photo ?? true,
      vcf_include_address: values.vcf_include_address ?? false,
      vcf_notes: values.vcf_notes ?? null,
      scan_count: 0,
      view_count: 0,
      save_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
    [values, mode]
  );

  const set = <K extends keyof BcCardRow>(k: K, v: BcCardRow[K] | null) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Form */}
      <div className="space-y-8">
        <Section title="Card type">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["personal", "business", "company_department"] as BcCardType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("card_type", t)}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left text-sm transition",
                  values.card_type === t
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                    : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
                )}
              >
                <p className="font-semibold capitalize text-surface-900 dark:text-white">
                  {t === "company_department" ? "Company" : t}
                </p>
                <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">
                  {t === "personal" && "Just you — networking and personal brand"}
                  {t === "business" && "You representing a company or role"}
                  {t === "company_department" && "A team or company-level card"}
                </p>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Identity">
          <Grid>
            <Field label="Full name" required>
              <input
                value={values.full_name ?? ""}
                onChange={(e) => set("full_name", e.target.value)}
                className={inputCls}
                placeholder="Daniel Makonor"
              />
            </Field>
            <Field label="Job title">
              <input
                value={values.job_title ?? ""}
                onChange={(e) => set("job_title", e.target.value || null)}
                className={inputCls}
                placeholder="Founder"
              />
            </Field>
            {(values.card_type === "business" || values.card_type === "company_department") && (
              <>
                <Field label="Company">
                  <input
                    value={values.company_name ?? ""}
                    onChange={(e) => set("company_name", e.target.value || null)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Department">
                  <input
                    value={values.department ?? ""}
                    onChange={(e) => set("department", e.target.value || null)}
                    className={inputCls}
                  />
                </Field>
              </>
            )}
            <Field label="Pronouns">
              <input
                value={values.pronouns ?? ""}
                onChange={(e) => set("pronouns", e.target.value || null)}
                className={inputCls}
                placeholder="she/her"
              />
            </Field>
            <Field label="Tagline" hint="Max 120 chars">
              <input
                maxLength={120}
                value={values.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value || null)}
                className={inputCls}
                placeholder="Building the internet's utility drawer"
              />
            </Field>
          </Grid>
          <Field label="Bio" hint="Max 500 chars">
            <textarea
              maxLength={500}
              rows={3}
              value={values.bio ?? ""}
              onChange={(e) => set("bio", e.target.value || null)}
              className={cn(inputCls, "resize-y")}
            />
          </Field>
        </Section>

        <Section title="Contact">
          <Grid>
            <Field label="Email">
              <input
                type="email"
                value={values.email ?? ""}
                onChange={(e) => set("email", e.target.value || null)}
                className={inputCls}
              />
            </Field>
            <Field label="Phone (with country code)">
              <input
                type="tel"
                value={values.phone_primary ?? ""}
                onChange={(e) => set("phone_primary", e.target.value || null)}
                className={inputCls}
                placeholder="+234 803 772 3164"
              />
            </Field>
            <Field label="Secondary phone">
              <input
                type="tel"
                value={values.phone_secondary ?? ""}
                onChange={(e) => set("phone_secondary", e.target.value || null)}
                className={inputCls}
              />
            </Field>
            <Field label="Website">
              <input
                value={values.website ?? ""}
                onChange={(e) => set("website", e.target.value || null)}
                className={inputCls}
                placeholder="utilityapps.site"
              />
            </Field>
          </Grid>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-medium text-surface-600 dark:text-surface-300">
              Add address (optional, hidden by default)
            </summary>
            <Grid className="mt-3">
              <Field label="Street">
                <input value={values.address_street ?? ""} onChange={(e) => set("address_street", e.target.value || null)} className={inputCls} />
              </Field>
              <Field label="City">
                <input value={values.address_city ?? ""} onChange={(e) => set("address_city", e.target.value || null)} className={inputCls} />
              </Field>
              <Field label="State">
                <input value={values.address_state ?? ""} onChange={(e) => set("address_state", e.target.value || null)} className={inputCls} />
              </Field>
              <Field label="Country">
                <input value={values.address_country ?? ""} onChange={(e) => set("address_country", e.target.value || null)} className={inputCls} />
              </Field>
              <Field label="Postal code">
                <input value={values.address_postal ?? ""} onChange={(e) => set("address_postal", e.target.value || null)} className={inputCls} />
              </Field>
            </Grid>
            <p className="mt-2 text-xs text-surface-500">
              Address is shown on the public card only when &quot;Include address in saved contact&quot; is on.
            </p>
          </details>
        </Section>

        <Section title="Social links" subtitle={`Up to ${limits.maxSocialLinks} on your plan`}>
          <SocialLinksEditor
            links={values.social_links ?? []}
            limit={limits.maxSocialLinks}
            onChange={(links) => set("social_links", links)}
          />
        </Section>

        <Section title="Appearance">
          <div className="space-y-4">
            <Field label="Theme">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {limits.themes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("card_theme", t)}
                    className={cn(
                      "rounded-xl border-2 px-2 py-2 text-xs font-semibold capitalize transition",
                      values.card_theme === t
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                        : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
                    )}
                  >
                    {THEME_LABELS[t]}
                  </button>
                ))}
              </div>
            </Field>
            <Grid>
              <ColorField
                label="Primary color"
                value={values.brand_color_primary ?? "#3B82F6"}
                onChange={(v) => set("brand_color_primary", v)}
              />
              <ColorField
                label="Secondary color"
                value={values.brand_color_secondary ?? "#1E40AF"}
                onChange={(v) => set("brand_color_secondary", v)}
              />
            </Grid>
            <AvatarUpload
              label="Profile photo"
              kind="avatar"
              value={values.avatar_url ?? null}
              onUploaded={(url) => set("avatar_url", url)}
              onCleared={() => set("avatar_url", null)}
            />
            {(values.card_type === "business" || values.card_type === "company_department") && (
              <AvatarUpload
                label="Company logo"
                kind="logo"
                value={values.logo_url ?? null}
                onUploaded={(url) => set("logo_url", url)}
                onCleared={() => set("logo_url", null)}
              />
            )}
          </div>
        </Section>

        <Section title="Saved contact settings">
          <div className="space-y-3">
            <Toggle
              label="Include photo in saved contact"
              value={values.vcf_include_photo ?? true}
              onChange={(v) => set("vcf_include_photo", v)}
            />
            <Toggle
              label="Include address in saved contact"
              value={values.vcf_include_address ?? false}
              onChange={(v) => set("vcf_include_address", v)}
            />
            <Field label="Custom note (added to saved contact)" hint="Max 200 chars">
              <input
                maxLength={200}
                value={values.vcf_notes ?? ""}
                onChange={(e) => set("vcf_notes", e.target.value || null)}
                className={inputCls}
                placeholder="Met at Lagos Tech Summit"
              />
            </Field>
          </div>
        </Section>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}

        {mode.kind === "create" ? (
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create my card
          </button>
        ) : (
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {busy ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </span>
            ) : savedAt ? (
              `All changes saved at ${savedAt.toLocaleTimeString()}`
            ) : (
              "Changes save automatically"
            )}
          </p>
        )}
      </div>

      {/* Preview */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Live preview
        </p>
        <div className="rounded-3xl bg-surface-100 p-4 dark:bg-surface-900/40">
          <CardView card={previewCard} hideSaveButton isPreview />
        </div>
        <p className="mt-2 text-[11px] text-surface-500 dark:text-surface-400">
          Public URL will be{" "}
          <code className="rounded bg-surface-100 px-1 dark:bg-surface-800">
            /bc/{mode.username}/{previewCard.slug}
          </code>
        </p>
      </aside>
    </div>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────────

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

function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
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

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition",
          value ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
      <span className="text-surface-800 dark:text-surface-100">{label}</span>
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

function SocialLinksEditor({
  links,
  limit,
  onChange,
}: {
  links: BcSocialLink[];
  limit: number;
  onChange: (v: BcSocialLink[]) => void;
}) {
  const canAdd = links.length < limit;
  const add = () =>
    onChange([...links, { platform: "linkedin", url: "" }]);
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<BcSocialLink>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {links.map((l, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-200 bg-surface-50/60 p-2 dark:border-surface-800 dark:bg-surface-900/40"
        >
          <select
            value={l.platform}
            onChange={(e) => update(i, { platform: e.target.value as BcSocialLink["platform"] })}
            className="rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          >
            {Object.entries(SOCIAL_PLATFORM_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input
            value={l.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://…"
            className="min-w-[180px] flex-1 rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="rounded p-1 text-surface-500 disabled:opacity-30 hover:bg-surface-200 dark:hover:bg-surface-700"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === links.length - 1}
              className="rounded p-1 text-surface-500 disabled:opacity-30 hover:bg-surface-200 dark:hover:bg-surface-700"
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20"
              aria-label="Remove"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
      {canAdd ? (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-surface-300 px-3 py-2 text-xs font-medium text-surface-600 hover:border-primary-400 hover:text-primary-700 dark:border-surface-700 dark:text-surface-300"
        >
          <Plus className="h-3 w-3" /> Add social link
        </button>
      ) : (
        <p className="text-[11px] text-surface-500">
          You&rsquo;ve added the maximum {limit} links for your plan.
        </p>
      )}
    </div>
  );
}
