"use client";

import { useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Version = "v4" | "v7" | "v1";

const VERSION_OPTIONS: { id: Version; label: string; desc: string }[] = [
  { id: "v4", label: "v4 (Random)", desc: "Opaque, the safe default" },
  { id: "v7", label: "v7 (Time-sortable)", desc: "Modern: sortable + opaque" },
  { id: "v1", label: "v1 (Time + Node)", desc: "Legacy, leaks timestamp" },
];

export function UuidGenerator() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      const mod = await import("uuid");
      const out: string[] = [];
      const fn = version === "v1" ? mod.v1 : version === "v4" ? mod.v4 : mod.v7;
      const n = Math.max(1, Math.min(1000, count));
      for (let i = 0; i < n; i++) out.push(fn());
      setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    }
  };

  const handleCopyOne = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyAll = async () => {
    if (results.length === 0) return;
    await navigator.clipboard.writeText(results.join("\n"));
    setCopied("all");
    window.setTimeout(() => setCopied(null), 1500);
  };

  const handleDownload = () => {
    if (results.length === 0) return;
    const blob = new Blob([results.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Version
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {VERSION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setVersion(opt.id)}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition",
                version === opt.id
                  ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10"
                  : "border-surface-200 hover:border-primary-300 dark:border-surface-800 dark:hover:border-primary-700"
              )}
            >
              <span className="text-sm font-semibold text-surface-900 dark:text-white">{opt.label}</span>
              <span className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">{opt.desc}</span>
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-3">
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Count (1–1000)</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
            className="w-32 rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </label>
      </div>

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
        >
          <Sparkles className="h-6 w-6" />
          Generate {count} {version.toUpperCase()} UUID{count > 1 ? "s" : ""}
        </button>
      </div>

      {error && <p className="text-sm text-error-600 dark:text-error-400">{error}</p>}

      {results.length > 0 && (
        <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {results.length} UUID{results.length > 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
              >
                {copied === "all" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copy all
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
              >
                <Download className="h-3 w-3" />
                Download .txt
              </button>
            </div>
          </div>
          <ul className="max-h-96 space-y-1 overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-xs dark:bg-surface-800">
            {results.map((id) => (
              <li key={id} className="flex items-center justify-between gap-2 px-2 py-1 hover:bg-white dark:hover:bg-surface-900">
                <span className="text-surface-900 dark:text-white">{id}</span>
                <button
                  type="button"
                  onClick={() => handleCopyOne(id)}
                  className="text-surface-500 hover:text-primary-700 dark:text-surface-400 dark:hover:text-primary-300"
                  aria-label="Copy"
                >
                  {copied === id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
