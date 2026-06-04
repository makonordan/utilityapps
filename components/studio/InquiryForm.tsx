"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  CONTACT_PREF_OPTIONS,
  INDUSTRY_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/studio";
import type {
  StudioBudget,
  StudioCompanySize,
  StudioContactPref,
  StudioTimeline,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

/**
 * Discovery-call fallback form.
 *
 * Posts to /api/studio/inquiry. On success, redirects to /studio/thank-you
 * so back-button doesn't resubmit. Includes a honeypot field — bots tab
 * into hidden inputs while humans don't see them, which catches ~95% of
 * spam without showing a CAPTCHA.
 */
export function InquiryForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("Real Estate");
  const [industryOther, setIndustryOther] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("Custom Calculator/Tool");
  const [projectTypeOther, setProjectTypeOther] = useState<string>("");
  const [companySize, setCompanySize] = useState<StudioCompanySize>("small");
  const [timeline, setTimeline] = useState<StudioTimeline>("within_month");
  const [budget, setBudget] = useState<StudioBudget>("open");
  const [contactPref, setContactPref] = useState<StudioContactPref>("email");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get("website") as string | null)?.length) {
      // Honeypot tripped → silently succeed without sending.
      router.push("/studio/thank-you");
      return;
    }

    const resolvedIndustry =
      industry === "Other" ? industryOther.trim() || "Other" : industry;
    const resolvedProjectType =
      projectType === "Something else"
        ? projectTypeOther.trim() || "Something else"
        : projectType;

    const payload = {
      name: (fd.get("name") as string).trim(),
      email: (fd.get("email") as string).trim(),
      company: (fd.get("company") as string).trim(),
      role: ((fd.get("role") as string) ?? "").trim(),
      company_size: companySize,
      industry: resolvedIndustry,
      project_type: resolvedProjectType,
      project_description: (fd.get("project_description") as string).trim(),
      timeline,
      budget_range: budget,
      referral_source: ((fd.get("referral_source") as string) ?? "").trim() || null,
      preferred_contact: contactPref,
      whatsapp_number: ((fd.get("whatsapp_number") as string) ?? "").trim() || null,
    };

    setSubmitting(true);
    track("studio_form_submitted", { project_type: payload.project_type });
    try {
      const res = await fetch("/api/studio/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Something went wrong. Please try again or email us.");
        setSubmitting(false);
        return;
      }
      router.push("/studio/thank-you");
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} onFocus={onFirstFocus} className="space-y-8" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px]"
      />

      <FormSection title="About you">
        <Grid>
          <Field label="Full name" required>
            <input
              required
              type="text"
              name="name"
              autoComplete="name"
              className={inputClass}
            />
          </Field>
          <Field label="Email" required>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className={inputClass}
            />
          </Field>
          <Field label="Company name" required>
            <input required type="text" name="company" className={inputClass} />
          </Field>
          <Field label="Your role" required>
            <input
              required
              type="text"
              name="role"
              placeholder="e.g. Founder, Head of Ops"
              className={inputClass}
            />
          </Field>
          <Field label="WhatsApp number" hint="Optional — include country code">
            <input
              type="tel"
              name="whatsapp_number"
              placeholder="+234…"
              autoComplete="tel"
              className={inputClass}
            />
          </Field>
        </Grid>
      </FormSection>

      <FormSection title="About your company">
        <Grid>
          <Field label="Company size" required>
            <Select
              value={companySize}
              onChange={(v) => setCompanySize(v as StudioCompanySize)}
              options={COMPANY_SIZE_OPTIONS}
            />
          </Field>
          <Field label="Industry" required>
            <Select
              value={industry}
              onChange={setIndustry}
              options={INDUSTRY_OPTIONS.map((v) => ({ value: v, label: v }))}
            />
          </Field>
          {industry === "Other" && (
            <Field label="Tell us your industry" required>
              <input
                required
                type="text"
                value={industryOther}
                onChange={(e) => setIndustryOther(e.target.value)}
                className={inputClass}
              />
            </Field>
          )}
        </Grid>
      </FormSection>

      <FormSection title="About your project">
        <Field label="What kind of project?" required>
          <Select
            value={projectType}
            onChange={setProjectType}
            options={PROJECT_TYPE_OPTIONS.map((v) => ({ value: v, label: v }))}
          />
        </Field>
        {projectType === "Something else" && (
          <Field label="Tell us what you'd like to build" required>
            <input
              required
              type="text"
              value={projectTypeOther}
              onChange={(e) => setProjectTypeOther(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}
        <Field
          label="Describe your project"
          required
          hint="20–2000 characters. What it does, who uses it, what success looks like."
        >
          <textarea
            required
            minLength={20}
            maxLength={2000}
            name="project_description"
            rows={6}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
        <Grid>
          <Field label="Ideal timeline" required>
            <Select
              value={timeline}
              onChange={(v) => setTimeline(v as StudioTimeline)}
              options={TIMELINE_OPTIONS}
            />
          </Field>
          <Field label="Budget range" required>
            <Select
              value={budget}
              onChange={(v) => setBudget(v as StudioBudget)}
              options={BUDGET_OPTIONS}
            />
          </Field>
          <Field label="How did you hear about us?" hint="Optional">
            <input
              type="text"
              name="referral_source"
              placeholder="Google, friend, Twitter…"
              className={inputClass}
            />
          </Field>
        </Grid>
      </FormSection>

      <FormSection title="Contact preference">
        <Field label="How should we follow up?" required>
          <Select
            value={contactPref}
            onChange={(v) => setContactPref(v as StudioContactPref)}
            options={CONTACT_PREF_OPTIONS}
          />
        </Field>
      </FormSection>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow transition sm:w-auto",
          submitting ? "cursor-wait opacity-70" : "hover:from-primary-600 hover:to-accent-600"
        )}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send my project details →
      </button>
    </form>
  );
}

let firstFocusSent = false;
function onFirstFocus() {
  if (firstFocusSent) return;
  firstFocusSent = true;
  track("studio_form_started", {});
}

function track(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}

const inputClass =
  "w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-white";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block text-[11px] text-surface-500 dark:text-surface-400">{hint}</span>
      )}
    </label>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={inputClass}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
