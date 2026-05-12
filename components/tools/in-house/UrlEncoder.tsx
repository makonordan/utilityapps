"use client";

import { useMemo, useState } from "react";

import { CopyButton, TEXTAREA_CLASS, ToolShell } from "./ToolShell";

type Mode = "encode" | "decode";

function transform(input: string, mode: Mode): { ok: true; value: string } | { ok: false; error: string } {
  try {
    return { ok: true, value: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input) };
  } catch {
    return { ok: false, error: "Invalid URL-encoded sequence (e.g. malformed %xx)." };
  }
}

export function UrlEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("https://utilityapps.site/?q=hello world&lang=en");

  const result = useMemo(() => transform(input, mode), [input, mode]);

  return (
    <ToolShell
      eyebrow="Developer"
      title="URL Encoder / Decoder"
      description="Percent-encode or decode any string for safe use in URLs and query strings."
      onReset={() => setInput("")}
    >
      <div className="mb-4 inline-flex rounded-xl border border-surface-200 p-1 dark:border-surface-700">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold capitalize text-white"
                : "rounded-lg px-3 py-1.5 text-xs font-medium capitalize text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            }
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Input
          </p>
          <textarea
            aria-label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className={TEXTAREA_CLASS}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
              Output
            </p>
            {result.ok && <CopyButton value={result.value} />}
          </div>
          <pre
            className={
              result.ok
                ? "min-h-[180px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-surface-200 bg-surface-50 p-3 font-mono text-sm text-surface-800 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
                : "min-h-[180px] overflow-auto rounded-xl border border-error-200 bg-error-50 p-3 font-mono text-sm text-error-800 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-200"
            }
          >
            {result.ok ? (result.value || <span className="text-surface-400">—</span>) : `× ${result.error}`}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
