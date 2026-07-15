"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { submitAppSuggestion } from "@/lib/apps/analytics";

type State = "idle" | "loading" | "success" | "error";

/** "Suggest software to add" box — anonymous, email optional. Never a gate;
 *  purely a way for visitors to tell us what's missing from the directory. */
export function AppSuggestionForm({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || state === "loading") return;
    setState("loading");
    setError(null);
    const res = await submitAppSuggestion({
      suggestedName: name.trim(),
      suggestedUrl: url.trim() || undefined,
      reason: reason.trim() || undefined,
      email: email.trim() || undefined,
    });
    if (!res.success) {
      setState("error");
      setError(res.error ?? "Couldn't submit — try again");
      return;
    }
    setState("success");
    setName("");
    setUrl("");
    setReason("");
    setEmail("");
  }

  if (state === "success") {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-success-200 bg-success-50 p-6 text-sm text-success-800 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-300">
          Thanks — we read every suggestion.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">
          Suggest software we&apos;re missing
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          Know a tool that should be here? Tell us — no account needed.
        </p>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Software name"
            className="rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-950 dark:text-white dark:placeholder:text-surface-500"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Website (optional)"
            className="rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-950 dark:text-white dark:placeholder:text-surface-500"
          />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why should we add it? (optional)"
            rows={2}
            className="sm:col-span-2 rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-950 dark:text-white dark:placeholder:text-surface-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional — only if you want a reply)"
            className="rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-950 dark:text-white dark:placeholder:text-surface-500"
          />
          <button
            type="submit"
            disabled={state === "loading" || !name.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send suggestion
          </button>
        </form>
        {error && (
          <p className="mt-2 text-xs text-warning-600 dark:text-warning-400" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
