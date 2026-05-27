"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Two-field waitlist form — email (required) and use-case (optional).
 * The use-case field is what separates real demand signal from idle
 * tyre-kickers; we never gate signup on it, but motivated developers
 * tend to fill it.
 *
 * Includes a honeypot field (name="website") hidden via CSS so bots that
 * fill every input get silently dropped by the API.
 */

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || state.kind === "submitting") return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          useCase: useCase || undefined,
          source: "api-page",
          // The bot honeypot — humans never see this. Pulled from the
          // form's actual input element (intentionally empty in the
          // common case).
          website: (
            e.currentTarget.elements.namedItem("website") as HTMLInputElement | null
          )?.value,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok) {
        setState({
          kind: "error",
          message: data?.error ?? "Couldn't add you. Try again.",
        });
        return;
      }
      setState({ kind: "success" });
    } catch {
      setState({
        kind: "error",
        message: "Couldn't reach the server. Try again.",
      });
    }
  };

  if (state.kind === "success") {
    return (
      <div className="rounded-2xl border border-success-200 bg-success-50 p-5 text-success-800 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-300">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200">
            <Check className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold">You&rsquo;re on the list.</p>
            <p className="mt-1 text-sm">
              We&rsquo;ll email you when the API alpha opens. If you described a
              use case, that helps us prioritise which endpoints to ship first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
    >
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          Email
        </span>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.dev"
            className="block w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 pl-9 text-sm dark:border-surface-700 dark:bg-surface-950"
          />
        </div>
      </label>

      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          What would you build with it?{" "}
          <span className="font-normal text-surface-500">(optional)</span>
        </span>
        <textarea
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          rows={3}
          placeholder="Bulk PDF merging for our invoicing workflow, etc."
          className="mt-1.5 block w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-950"
        />
      </label>

      {/* Honeypot — hidden from humans, but bots tab through every input. */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.kind === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={!email.trim() || state.kind === "submitting"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition",
          !email.trim() || state.kind === "submitting"
            ? "cursor-not-allowed opacity-60"
            : "hover:from-primary-600 hover:to-accent-600"
        )}
      >
        {state.kind === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Adding…
          </>
        ) : (
          <>
            Join the waitlist <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-[11px] text-surface-500 dark:text-surface-400">
        One email when the alpha opens. No marketing. We never sell your data.
      </p>
    </form>
  );
}
