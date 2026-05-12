"use client";

import { useMemo, useState } from "react";

import { CopyButton, Field, INPUT_CLASS, TEXTAREA_CLASS, ToolShell } from "./ToolShell";

type Mode = "format" | "minify";

function tryParse(input: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (!input.trim()) return { ok: false, error: "Paste JSON to format." };
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    return { ok: false, error: message };
  }
}

export function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "UtilityApps",\n  "tools": ["loan", "bmi"],\n  "free": true\n}');
  const [indent, setIndent] = useState("2");
  const [mode, setMode] = useState<Mode>("format");

  const result = useMemo(() => tryParse(input), [input]);

  let output = "";
  if (result.ok) {
    if (mode === "format") {
      const i = indent === "tab" ? "\t" : Number(indent);
      output = JSON.stringify(result.value, null, i as never);
    } else {
      output = JSON.stringify(result.value);
    }
  }

  const stats = useMemo(() => {
    if (!result.ok) return null;
    const original = new Blob([input]).size;
    const minified = new Blob([JSON.stringify(result.value)]).size;
    return { original, minified, savings: original - minified };
  }, [input, result]);

  return (
    <ToolShell
      eyebrow="Developer"
      title="JSON Formatter & Validator"
      description="Pretty-print, minify, and validate JSON in your browser. Nothing is sent to a server."
      onReset={() => setInput("")}
    >
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="inline-flex rounded-xl border border-surface-200 p-1 dark:border-surface-700">
          {(["format", "minify"] as const).map((m) => (
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
        {mode === "format" && (
          <Field label="Indent" className="w-32">
            <select value={indent} onChange={(e) => setIndent(e.target.value)} className={INPUT_CLASS}>
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </Field>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Input
          </p>
          <textarea
            aria-label="JSON input"
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
            {result.ok && <CopyButton value={output} />}
          </div>
          <pre
            className={
              result.ok
                ? "min-h-[180px] overflow-auto rounded-xl border border-surface-200 bg-surface-50 p-3 font-mono text-sm text-surface-800 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
                : "min-h-[180px] overflow-auto rounded-xl border border-error-200 bg-error-50 p-3 font-mono text-sm text-error-800 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-200"
            }
          >
            {result.ok ? output : `× ${result.error}`}
          </pre>
        </div>
      </div>

      {stats && (
        <p className="mt-4 text-xs text-surface-600 dark:text-surface-300">
          Original: <strong>{stats.original} B</strong> · Minified:{" "}
          <strong>{stats.minified} B</strong>
          {stats.savings > 0 && <> · Saved <strong>{stats.savings} B</strong></>}
        </p>
      )}
    </ToolShell>
  );
}
