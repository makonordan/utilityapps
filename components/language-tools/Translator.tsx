"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  Copy,
  ExternalLink,
  Languages as LanguagesIcon,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import {
  LANGUAGES,
  checkPairAvailability,
  detectLanguage,
  googleTranslateUrl,
  isTranslatorSupported,
  languageName,
  translateText,
} from "@/lib/translator";
import { cn } from "@/lib/utils";

const MAX_CHARS = 5000;
const DEBOUNCE_MS = 700;
const AUTO = "auto";

type Phase =
  | { kind: "idle" }
  | { kind: "detecting" }
  | { kind: "downloading"; progress: number }
  | { kind: "translating" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export function Translator() {
  // null = still checking; true/false once known. Avoids a flash of the
  // fallback UI before feature detection runs (it can't run during SSR).
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSupported(isTranslatorSupported());
  }, []);

  const [source, setSource] = useState<string>(AUTO);
  const [target, setTarget] = useState<string>("es");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumps on every run so a stale async result can't overwrite a newer one.
  const runIdRef = useRef(0);

  const runTranslation = useCallback(
    async (text: string, src: string, tgt: string) => {
      const runId = ++runIdRef.current;
      if (!text.trim()) {
        setOutput("");
        setDetected(null);
        setPhase({ kind: "idle" });
        return;
      }

      // Resolve "auto" to a concrete source language via on-device detection.
      let resolvedSource = src;
      if (src === AUTO) {
        setPhase({ kind: "detecting" });
        const d = await detectLanguage(text);
        if (runId !== runIdRef.current) return;
        if (d) {
          resolvedSource = d;
          setDetected(d);
        } else {
          // Detection failed — default to English as the source guess.
          resolvedSource = "en";
          setDetected(null);
        }
      } else {
        setDetected(null);
      }

      if (resolvedSource === tgt) {
        setOutput(text);
        setPhase({ kind: "done" });
        return;
      }

      // Check whether the pair needs a download so we can show progress.
      const availability = await checkPairAvailability(resolvedSource, tgt);
      if (runId !== runIdRef.current) return;
      if (availability === "unsupported") {
        setPhase({
          kind: "error",
          message: "On-device translation isn't available in this browser.",
        });
        return;
      }
      if (availability === "unavailable") {
        setPhase({
          kind: "error",
          message: `${languageName(resolvedSource)} → ${languageName(tgt)} isn't available on this device. Try the Google Translate fallback below.`,
        });
        return;
      }

      try {
        if (availability === "downloadable" || availability === "downloading") {
          setPhase({ kind: "downloading", progress: 0 });
        } else {
          setPhase({ kind: "translating" });
        }
        const result = await translateText(text, resolvedSource, tgt, (frac) => {
          if (runId === runIdRef.current) {
            setPhase({ kind: "downloading", progress: frac });
          }
        });
        if (runId !== runIdRef.current) return;
        setOutput(result);
        setPhase({ kind: "done" });
      } catch (err) {
        if (runId !== runIdRef.current) return;
        console.error(err);
        setPhase({
          kind: "error",
          message: "Couldn't translate that. Try the Google Translate fallback below.",
        });
      }
    },
    []
  );

  // Debounced auto-translate whenever input / languages change.
  useEffect(() => {
    if (supported === false) return; // fallback UI handles input instead
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void runTranslation(input, source, target);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, source, target, supported, runTranslation]);

  const swap = () => {
    // Can't swap when source is auto-detect — use the detected language.
    const effectiveSource = source === AUTO ? detected ?? "en" : source;
    setSource(target);
    setTarget(effectiveSource);
    setInput(output);
    setOutput(input);
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  // --- Unsupported-browser fallback ---------------------------------------
  if (supported === false) {
    return <Fallback source={source} target={target} setSource={setSource} setTarget={setTarget} input={input} setInput={setInput} />;
  }

  return (
    <div className="space-y-4">
      {/* Language bar */}
      <div className="flex items-center gap-2">
        <LanguageSelect
          value={source}
          onChange={setSource}
          includeAuto
          detected={detected}
          className="flex-1"
          ariaLabel="Translate from"
        />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap languages"
          className="shrink-0 rounded-lg border border-surface-200 bg-white p-2.5 text-surface-600 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <LanguageSelect
          value={target}
          onChange={setTarget}
          className="flex-1"
          ariaLabel="Translate to"
        />
      </div>

      {/* Two panes */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            rows={9}
            placeholder="Type or paste text to translate…"
            className="block w-full resize-y rounded-xl bg-transparent px-3.5 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-surface-100"
          />
          <div className="flex items-center justify-between px-3.5 py-2 text-[11px] text-surface-400">
            <span>
              {source === AUTO && detected
                ? `Detected: ${languageName(detected)}`
                : " "}
            </span>
            <span>
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="relative rounded-xl border border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
          <div className="min-h-[210px] whitespace-pre-wrap break-words px-3.5 py-3 text-sm text-surface-900 dark:text-surface-100">
            {output || (
              <span className="text-surface-400">Translation appears here…</span>
            )}
          </div>
          {output && (
            <button
              type="button"
              onClick={copy}
              className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-cyan-700 shadow-sm transition hover:bg-cyan-50 dark:bg-surface-900 dark:text-cyan-300"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Status line */}
      <StatusLine phase={phase} />

      {/* Inline Google Translate fallback when a pair is unavailable / errors */}
      {phase.kind === "error" && input.trim() && (
        <GoogleFallbackLink
          input={input}
          source={source === AUTO ? (detected ?? "auto") : source}
          target={target}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------- subcomponents

function LanguageSelect({
  value,
  onChange,
  includeAuto,
  detected,
  className,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  includeAuto?: boolean;
  detected?: string | null;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-sm font-medium text-surface-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100",
        className
      )}
    >
      {includeAuto && (
        <option value="auto">
          Auto-detect{detected ? ` (${languageName(detected)})` : ""}
        </option>
      )}
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </select>
  );
}

function StatusLine({ phase }: { phase: Phase }) {
  if (phase.kind === "idle" || phase.kind === "done") {
    return (
      <p className="text-xs text-surface-400">
        {phase.kind === "done"
          ? "Translated on your device — nothing was uploaded."
          : " "}
      </p>
    );
  }
  if (phase.kind === "detecting") {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Detecting language…
      </p>
    );
  }
  if (phase.kind === "translating") {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Translating…
      </p>
    );
  }
  if (phase.kind === "downloading") {
    return (
      <div className="space-y-1">
        <p className="inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <Loader2 className="h-3 w-3 animate-spin" /> Downloading language pack…{" "}
          {Math.round(phase.progress * 100)}% (one-time, then it works offline)
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
          <div
            className="h-full bg-cyan-500 transition-all"
            style={{ width: `${Math.round(phase.progress * 100)}%` }}
          />
        </div>
      </div>
    );
  }
  // error
  return (
    <p className="inline-flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {phase.message}
    </p>
  );
}

function GoogleFallbackLink({
  input,
  source,
  target,
}: {
  input: string;
  source: string;
  target: string;
}) {
  return (
    <a
      href={googleTranslateUrl(input, source, target)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      Open in Google Translate
      <span className="font-normal text-surface-400">(sends text to Google)</span>
    </a>
  );
}

/** Shown when the browser has no on-device Translator API at all. Keeps
 *  the same input box but routes the translation to Google Translate. */
function Fallback({
  source,
  target,
  setSource,
  setTarget,
  input,
  setInput,
}: {
  source: string;
  target: string;
  setSource: (v: string) => void;
  setTarget: (v: string) => void;
  input: string;
  setInput: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
        <p>
          <strong>Your browser doesn&rsquo;t support on-device translation.</strong>{" "}
          That feature needs Chrome or Edge 138+ (mid-2025 or newer). You can
          still translate below — but unlike on-device mode, this sends your
          text to Google.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelect value={source} onChange={setSource} includeAuto className="flex-1" ariaLabel="Translate from" />
        <LanguageSelect value={target} onChange={setTarget} className="flex-1" ariaLabel="Translate to" />
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
        rows={8}
        placeholder="Type or paste text to translate…"
        className="block w-full resize-y rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-sm dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
      />

      <a
        href={googleTranslateUrl(input || "", source, target)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-sky-700",
          !input.trim() && "pointer-events-none opacity-50"
        )}
      >
        <LanguagesIcon className="h-4 w-4" />
        Translate in Google Translate
        <ExternalLink className="h-4 w-4" />
      </a>
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Want private, on-device translation? Open this page in Chrome or Edge.
      </p>
    </div>
  );
}
