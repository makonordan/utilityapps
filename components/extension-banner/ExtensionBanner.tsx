"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Puzzle, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Slim, dismissible top-of-site banner that captures emails for a possible
 * Chrome extension — a demand-validation play. Stores dismissal + a
 * "you already signed up" flag in localStorage so it doesn't nag.
 *
 * Renders nothing until after mount (avoids SSR/hydration flash and lets
 * us read localStorage). [data-no-translate] is intentionally NOT set —
 * the banner copy should translate with the rest of the page.
 */

const DISMISS_KEY = "utilityapps:ext-banner-dismissed";
const SIGNED_KEY = "utilityapps:ext-banner-signed";

type State = "idle" | "submitting" | "done" | "error";

export function ExtensionBanner() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
      const signed = localStorage.getItem(SIGNED_KEY) === "1";
      setHidden(dismissed || signed);
    } catch {
      setHidden(false);
    }
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || state === "submitting") return;
    setState("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          list: "extension",
          source: "extension-banner",
          website: (
            e.currentTarget.elements.namedItem("website") as HTMLInputElement | null
          )?.value,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok) {
        setState("error");
        setError(data?.error ?? "Couldn't sign you up. Try again.");
        return;
      }
      setState("done");
      try {
        localStorage.setItem(SIGNED_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch {
      setState("error");
      setError("Couldn't reach the server. Try again.");
    }
  };

  if (!mounted || hidden) return null;

  return (
    <div className="relative border-b border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 dark:border-cyan-500/20 dark:from-cyan-500/10 dark:to-sky-500/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-2 sm:flex-row sm:justify-center sm:gap-4 sm:px-6">
        {state === "done" ? (
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-800 dark:text-cyan-200">
            <Check className="h-4 w-4" />
            You&rsquo;re on the list — we&rsquo;ll email you when the extension launches.
          </p>
        ) : (
          <>
            <p className="inline-flex items-center gap-1.5 text-center text-sm font-medium text-surface-800 dark:text-surface-100">
              <Puzzle className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
              <span>
                <strong>Coming soon:</strong> UtilityApps Chrome Extension —
                your tools, one click away.
              </span>
            </p>
            <form onSubmit={submit} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email for extension launch notification"
                className="w-44 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 sm:w-52"
              />
              {/* Honeypot — hidden from humans, bots tab into it. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] top-[-9999px]"
              />
              <button
                type="submit"
                disabled={state === "submitting"}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white transition",
                  state === "submitting" ? "cursor-not-allowed opacity-60" : "hover:bg-cyan-700"
                )}
              >
                {state === "submitting" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Notify me
              </button>
            </form>
            {error && (
              <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-surface-500 transition hover:bg-white/60 hover:text-surface-800 dark:hover:bg-surface-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
