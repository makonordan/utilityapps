"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { RESERVED_USERNAMES, isValidUsername } from "@/lib/businessCard/types";
import { SITE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * First-time username selection. Runs after Google sign-in when no
 * bc_users row exists yet. The username becomes part of every public
 * URL — /bc/[username] — so we constrain it tightly.
 *
 * Availability check hits POST /api/business-card/username-check
 * (no separate route; using PATCH-like reuse of the users endpoint
 * would be clearer but adds a whole new endpoint just for this).
 *
 * Simpler v1: use the provision endpoint's error response as a
 * live availability check. Debounce keystrokes at 400ms.
 */

export function UsernameSetup({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const suggestion = suggestUsername(name || email.split("@")[0]);
  const [value, setValue] = useState(suggestion);
  const [validity, setValidity] = useState<"idle" | "checking" | "valid" | "taken" | "invalid" | "reserved">("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side validation runs synchronously; server availability check
  // is deferred until submit to keep this v1 simple.
  useEffect(() => {
    setError(null);
    if (!value) {
      setValidity("idle");
      return;
    }
    if (RESERVED_USERNAMES.has(value.toLowerCase())) {
      setValidity("reserved");
      return;
    }
    if (!isValidUsername(value)) {
      setValidity("invalid");
      return;
    }
    setValidity("valid");
  }, [value]);

  const submit = async () => {
    if (validity !== "valid" || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/business-card/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: value }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
      if (!res.ok || !json.ok) {
        if (json.reason === "username-taken") {
          setValidity("taken");
          setError("That username is taken. Try another.");
        } else {
          setError(json.error ?? "Couldn't save that username.");
        }
        return;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Step 1 of 2</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
        Choose your username
      </h1>
      <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
        This becomes your permanent public URL. You&rsquo;ll share it every time you give out your card.
      </p>

      <div className="mt-6 flex items-stretch overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <span className="flex items-center bg-surface-50 px-3 text-xs text-surface-500 dark:bg-surface-800 dark:text-surface-400">
          {SITE_CONFIG.url.replace(/^https?:\/\//, "")}/bc/
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          className="flex-1 border-0 bg-transparent px-3 py-3 text-base font-mono focus:outline-none dark:text-white"
          placeholder="you"
          maxLength={30}
          autoFocus
        />
        <span className="flex items-center pr-3">
          {validity === "checking" && <Loader2 className="h-4 w-4 animate-spin text-surface-400" />}
          {validity === "valid" && <Check className="h-4 w-4 text-success-500" />}
          {(validity === "invalid" || validity === "taken" || validity === "reserved") && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </span>
      </div>

      <ul className="mt-3 space-y-1 text-[11px] text-surface-500 dark:text-surface-400">
        <li>3–30 characters</li>
        <li>Lowercase letters, numbers, and hyphens only</li>
        <li>No leading/trailing hyphens; no double hyphens</li>
      </ul>

      {validity === "invalid" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">Invalid characters or length.</p>
      )}
      {validity === "reserved" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">That name is reserved. Try another.</p>
      )}
      {error && (
        <p className={cn("mt-2 text-xs text-red-600 dark:text-red-400")}>{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={validity !== "valid" || saving}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow disabled:opacity-50"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Claim this username
      </button>

      <p className="mt-4 text-[11px] text-surface-500 dark:text-surface-400">
        Signed in as {email}
      </p>
    </div>
  );
}

function suggestUsername(seed: string): string {
  return seed
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 30);
}
