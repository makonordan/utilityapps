"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "success" | "error";

export function ComingSoonNotify({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `coming-soon:${toolId}` }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Subscription failed");
      setState("success");
      setMessage(`We'll email you when ${toolName} ships.`);
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed");
    }
  }

  return (
    <section className="rounded-3xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-primary-50/40 p-8 text-center shadow-card sm:p-12 dark:border-surface-800 dark:from-surface-900 dark:via-surface-950 dark:to-primary-500/10">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
        {toolName} is coming soon
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-surface-600 dark:text-surface-300">
        We&apos;re building this one next. Drop your email and we&apos;ll let you know the moment it
        launches — no spam, no other emails.
      </p>

      <form onSubmit={onSubmit} className="mx-auto mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
        <label htmlFor={`notify-${toolId}`} className="sr-only">
          Email
        </label>
        <input
          id={`notify-${toolId}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={state === "loading" || state === "success"}
          className="flex-1 rounded-xl border border-surface-300 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {state === "success" ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {state === "success" ? "On the list" : "Notify me"}
        </button>
      </form>

      {message && (
        <p
          aria-live="polite"
          className={cn(
            "mt-3 text-xs",
            state === "success" ? "text-success-500" : "text-warning-500"
          )}
        >
          {message}
        </p>
      )}
    </section>
  );
}
