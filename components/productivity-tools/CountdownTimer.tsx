"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { SITE_CONFIG, cn } from "@/lib/utils";

interface State {
  target: string; // ISO datetime-local string (e.g. "2027-01-01T00:00")
  title: string;
  whenDoneMessage: string;
  accent: string;
}

const ACCENT_OPTIONS = [
  { id: "primary", color: "#0066FF", label: "Blue" },
  { id: "accent", color: "#7C3AED", label: "Purple" },
  { id: "success", color: "#10B981", label: "Green" },
  { id: "warning", color: "#F59E0B", label: "Amber" },
  { id: "rose", color: "#F43F5E", label: "Rose" },
];

function defaultTarget(): string {
  // Default to one week from now, rounded to the next hour.
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setMinutes(0, 0, 0);
  return toLocalInputValue(d);
}

function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function readFromUrl(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (!params.has("t")) return null;
  return {
    target: params.get("t") ?? "",
    title: params.get("title") ?? "",
    whenDoneMessage: params.get("done") ?? "",
    accent: params.get("accent") ?? "primary",
  };
}

function buildShareUrl(state: State): string {
  const params = new URLSearchParams();
  params.set("t", state.target);
  if (state.title) params.set("title", state.title);
  if (state.whenDoneMessage) params.set("done", state.whenDoneMessage);
  if (state.accent !== "primary") params.set("accent", state.accent);
  const path = `/tools/countdown-timer?${params.toString()}`;
  if (typeof window !== "undefined") return new URL(path, window.location.origin).toString();
  return `${SITE_CONFIG.url}${path}`;
}

function buildEmbedSnippet(url: string): string {
  return `<iframe src="${url}&embed=1" width="100%" height="240" frameborder="0" loading="lazy" allow="autoplay" title="Countdown"></iframe>`;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function diff(targetIso: string): Remaining {
  const targetMs = new Date(targetIso).getTime();
  const now = Date.now();
  const total = Math.max(0, targetMs - now);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, total };
}

export function CountdownTimer() {
  const [state, setState] = useState<State>({
    target: defaultTarget(),
    title: "",
    whenDoneMessage: "",
    accent: "primary",
  });
  const [remaining, setRemaining] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [copied, setCopied] = useState<"share" | "embed" | null>(null);

  // Hydrate from URL once on mount.
  useEffect(() => {
    const fromUrl = readFromUrl();
    if (fromUrl) {
      setState((prev) => ({
        target: fromUrl.target || prev.target,
        title: fromUrl.title || prev.title,
        whenDoneMessage: fromUrl.whenDoneMessage || prev.whenDoneMessage,
        accent: fromUrl.accent || prev.accent,
      }));
    }
  }, []);

  // Recompute every 250ms — second-resolution display, fast enough to feel live.
  useEffect(() => {
    const tick = () => setRemaining(diff(state.target));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state.target]);

  const accent = useMemo(
    () => ACCENT_OPTIONS.find((a) => a.id === state.accent) ?? ACCENT_OPTIONS[0],
    [state.accent]
  );

  const isDone = remaining.total === 0;
  const shareUrl = buildShareUrl(state);
  const embedSnippet = buildEmbedSnippet(shareUrl);

  const handleCopy = async (kind: "share" | "embed") => {
    const text = kind === "share" ? shareUrl : embedSnippet;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore clipboard errors */
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border-2 p-8 text-center transition-colors"
        style={{ borderColor: `${accent.color}55`, backgroundColor: `${accent.color}0a` }}
      >
        {state.title && (
          <p className="text-sm font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-200">
            {state.title}
          </p>
        )}
        {isDone ? (
          <div className="mt-4 space-y-2">
            <p
              className="text-5xl font-bold tracking-tight sm:text-6xl"
              style={{ color: accent.color }}
            >
              Time's up!
            </p>
            {state.whenDoneMessage && (
              <p className="text-lg text-surface-700 dark:text-surface-200">{state.whenDoneMessage}</p>
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Days", value: remaining.days },
              { label: "Hours", value: remaining.hours },
              { label: "Minutes", value: remaining.minutes },
              { label: "Seconds", value: remaining.seconds },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p
                  className="font-mono text-5xl font-bold tracking-tight tabular-nums sm:text-6xl"
                  style={{ color: accent.color }}
                >
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Settings
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Target date & time</span>
            <input
              type="datetime-local"
              value={state.target}
              onChange={(e) => setState((s) => ({ ...s, target: e.target.value }))}
              className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Title (optional)</span>
            <input
              type="text"
              value={state.title}
              onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
              placeholder="Launch day"
              className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
            When the countdown finishes (optional)
          </span>
          <input
            type="text"
            value={state.whenDoneMessage}
            onChange={(e) => setState((s) => ({ ...s, whenDoneMessage: e.target.value }))}
            placeholder="🎉 We're live!"
            className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
        </label>
        <div>
          <p className="text-xs font-medium text-surface-700 dark:text-surface-300">Accent colour</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setState((s) => ({ ...s, accent: opt.id }))}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                  state.accent === opt.id
                    ? "border-surface-900 dark:border-white"
                    : "border-surface-200 dark:border-surface-700"
                )}
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: opt.color }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Share or embed
        </p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Share link</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleCopy("share")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              {copied === "share" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied === "share" ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Embed snippet</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              readOnly
              value={embedSnippet}
              rows={2}
              className="flex-1 resize-none rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleCopy("embed")}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              {copied === "embed" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === "embed" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            Drop the snippet into any HTML page or CMS to embed this exact countdown.
          </p>
        </div>
      </div>
    </div>
  );
}
