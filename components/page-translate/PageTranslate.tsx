"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe, Loader2, RotateCcw } from "lucide-react";

import {
  applyPageTranslation,
  getSavedLang,
  restoreOriginal,
} from "@/lib/pageTranslate";
import { LANGUAGES, isTranslatorSupported, languageName } from "@/lib/translator";
import { cn } from "@/lib/utils";

/**
 * Header control that translates the whole page on-device into a language
 * of the visitor's choice. On Chrome/Edge 138+ it does the translation
 * itself; on other browsers it explains how to use the browser's own
 * built-in page translation (which covers far more languages).
 *
 * Marked [data-no-translate] so the engine never translates the control
 * itself — the picker stays readable in English.
 */
export function PageTranslate() {
  const [open, setOpen] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [active, setActive] = useState<string | null>(null); // current lang or null
  const [busyLang, setBusyLang] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Feature-detect + re-apply a saved language after mount (client only).
  useEffect(() => {
    const isSupported = isTranslatorSupported();
    setSupported(isSupported);
    if (!isSupported) return;
    const saved = getSavedLang();
    if (saved) {
      setActive(saved);
      // Re-apply silently on load so navigation keeps the page translated.
      void applyPageTranslation(saved).catch(() => setActive(null));
    }
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = async (lang: string) => {
    setBusyLang(lang);
    setProgress(0);
    try {
      await applyPageTranslation(lang, setProgress);
      setActive(lang);
      setOpen(false);
    } catch {
      // Shouldn't happen (we gate on `supported`), but fail soft.
    } finally {
      setBusyLang(null);
      setProgress(0);
    }
  };

  return (
    <div ref={rootRef} className="relative" data-no-translate>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Translate this page"
        aria-expanded={open}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-surface-600 transition hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800",
          active && "text-cyan-700 dark:text-cyan-300"
        )}
        title="Translate this page"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden text-xs font-semibold sm:inline">
          {active ? languageName(active) : "Translate"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card-hover dark:border-surface-800 dark:bg-surface-900">
          {supported === false ? (
            <UnsupportedPanel />
          ) : (
            <>
              <div className="border-b border-surface-200 px-3 py-2.5 dark:border-surface-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Translate this page
                </p>
                <p className="mt-0.5 text-[11px] text-surface-400">
                  On-device · your data stays in your browser
                </p>
              </div>

              {active && (
                <button
                  type="button"
                  onClick={() => restoreOriginal()}
                  className="flex w-full items-center gap-2 border-b border-surface-200 px-3 py-2.5 text-left text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-800 dark:text-surface-200 dark:hover:bg-surface-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Show original (English)
                </button>
              )}

              <ul className="max-h-72 overflow-y-auto py-1">
                {LANGUAGES.map((l) => {
                  const isActive = active === l.code;
                  const isBusy = busyLang === l.code;
                  return (
                    <li key={l.code}>
                      <button
                        type="button"
                        onClick={() => pick(l.code)}
                        disabled={busyLang !== null}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition",
                          isActive
                            ? "font-semibold text-cyan-700 dark:text-cyan-300"
                            : "text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800",
                          busyLang !== null && !isBusy && "opacity-50"
                        )}
                      >
                        {l.name}
                        {isBusy ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-surface-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {Math.round(progress * 100)}%
                          </span>
                        ) : (
                          isActive && <Check className="h-4 w-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="border-t border-surface-200 px-3 py-2 text-[10px] text-surface-400 dark:border-surface-800">
                First use of a language downloads a small model, then it
                works offline. Need a language not listed? Your browser&rsquo;s
                built-in translator covers more.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function UnsupportedPanel() {
  return (
    <div className="p-4 text-sm">
      <p className="flex items-center gap-2 font-semibold text-surface-800 dark:text-surface-100">
        <Globe className="h-4 w-4" /> Translate this page
      </p>
      <p className="mt-2 text-surface-600 dark:text-surface-300">
        Your browser can translate this whole page into almost any language —
        here&rsquo;s how:
      </p>
      <ul className="mt-3 space-y-2 text-xs text-surface-600 dark:text-surface-300">
        <li>
          <strong className="text-surface-800 dark:text-surface-100">Chrome / Edge:</strong>{" "}
          click the translate icon in the address bar, or right-click the page
          → Translate.
        </li>
        <li>
          <strong className="text-surface-800 dark:text-surface-100">Safari:</strong>{" "}
          tap the <span className="font-mono">aA</span> (or page-settings) icon
          in the address bar → Translate to…
        </li>
        <li>
          <strong className="text-surface-800 dark:text-surface-100">Firefox:</strong>{" "}
          use the translate icon in the address bar (Firefox 118+).
        </li>
      </ul>
      <p className="mt-3 text-[11px] text-surface-400">
        For private, on-device translation built into this page, open it in
        Chrome or Edge 138+.
      </p>
    </div>
  );
}
