"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type NewsletterFormVariant = "stacked" | "inline" | "compact";

interface Props {
  source: string;
  variant?: NewsletterFormVariant;
  buttonLabel?: string;
  successLabel?: string;
  placeholder?: string;
  className?: string;
}

type State = "idle" | "loading" | "success" | "error";

interface ApiResponse {
  success?: boolean;
  message?: string;
  alreadySubscribed?: boolean;
  error?: string;
}

export function NewsletterForm({
  source,
  variant = "inline",
  buttonLabel = "Subscribe Free",
  successLabel = "You're subscribed!",
  placeholder = "you@example.com",
  className,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || state === "loading" || state === "success") return;
    setState("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const body = (await res.json().catch(() => ({}))) as ApiResponse;
      if (!res.ok || body.success === false) {
        throw new Error(body.error ?? "Subscription failed");
      }
      setState("success");
      setMessage(body.message ?? successLabel);
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed");
    }
  }

  const inputId = `newsletter-${source.replace(/[^a-z0-9]+/gi, "-")}`;
  const layout = variant === "stacked" ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row";
  const inputClass =
    variant === "compact"
      ? "px-3 py-2 text-sm"
      : "px-3 py-2.5 text-sm";
  const buttonClass =
    variant === "compact"
      ? "px-3 py-2 text-sm"
      : "px-5 py-2.5 text-sm";

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={onSubmit} className={layout} aria-busy={state === "loading"}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={state === "loading" || state === "success"}
          className={cn(
            "flex-1 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500",
            inputClass
          )}
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
            state === "success"
              ? "bg-success-500 hover:bg-success-600"
              : "bg-primary-500 hover:bg-primary-600",
            buttonClass
          )}
        >
          {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {state === "success" ? (
            <SuccessLabel>{successLabel}</SuccessLabel>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
      </form>

      {message && (
        <p
          aria-live="polite"
          className={cn(
            "mt-2 text-xs",
            state === "success" ? "text-success-600 dark:text-success-400" : "text-warning-600 dark:text-warning-400"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

function SuccessLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5"
    >
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: [0, 1.25, 1], rotate: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex"
      >
        <CheckCircle2 className="h-4 w-4" />
      </motion.span>
      {children}
    </motion.span>
  );
}

export function NewsletterFormSpinner() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </span>
  );
}

export function NewsletterFormCheck() {
  return <Check className="h-4 w-4" />;
}
