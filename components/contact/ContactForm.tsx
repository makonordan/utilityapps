"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { cn } from "@/lib/utils";

const SUBJECTS = [
  "General inquiry",
  "Tool request",
  "Bug report",
  "Press / Partnership",
  "Privacy / data request",
  "Other",
] as const;

type State = "idle" | "loading" | "success" | "error";

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading" || state === "success") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(), // honeypot
    };

    setState("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as ApiResponse;
      if (!res.ok || body.success === false) {
        throw new Error(body.error ?? "Could not send your message");
      }
      setState("success");
      setMessage(body.message ?? "Thanks — we'll get back to you within two business days.");
      form.reset();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not send your message");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-3xl border border-success-200 bg-success-50/60 p-8 text-center dark:border-success-500/30 dark:bg-success-500/10"
      >
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-success-500 to-primary-500 text-white shadow-glow">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">
          Message sent
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{message}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — bots fill this; humans don't see it. */}
      <div aria-hidden="true" className="absolute -left-[5000px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Your name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" required>
        <select id="subject" name="subject" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            What&apos;s this about?
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder="Tell us what you need. The more specific, the faster we can help."
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send message
      </button>

      {state === "error" && message && (
        <p aria-live="polite" className="text-xs text-warning-600 dark:text-warning-400">
          {message}
        </p>
      )}

      <p className="text-xs text-surface-500 dark:text-surface-400">
        We typically reply within two business days. For privacy or data requests, email{" "}
        <a
          href="mailto:privacy@utilityapps.site"
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          privacy@utilityapps.site
        </a>
        .
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-surface-300 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500";

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
        {label}
        {required && <span className="ml-0.5 text-warning-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
