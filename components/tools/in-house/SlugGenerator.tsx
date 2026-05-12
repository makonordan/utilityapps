"use client";

import { useMemo, useState } from "react";

import { CopyButton, Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function slugify(input: string, separator: string, lower: boolean, stripStop: boolean): string {
  const STOP_WORDS = new Set([
    "a", "an", "the", "and", "or", "of", "in", "on", "at", "to", "for", "with", "by",
  ]);

  let text = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^\p{L}\p{N}]+/gu, " ") // non-letters/digits → space
    .trim();

  if (lower) text = text.toLowerCase();

  let words = text.split(/\s+/);
  if (stripStop) {
    words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    if (words.length === 0) words = text.split(/\s+/); // don't return empty
  }
  return words.join(separator);
}

export function SlugGenerator() {
  const [input, setInput] = useState("How to Compress Images Without Losing Quality");
  const [separator, setSeparator] = useState("-");
  const [lower, setLower] = useState(true);
  const [stripStop, setStripStop] = useState(false);

  const slug = useMemo(
    () => slugify(input, separator, lower, stripStop),
    [input, separator, lower, stripStop]
  );

  return (
    <ToolShell
      eyebrow="SEO"
      title="Slug Generator"
      description="Turn any title or phrase into a clean, URL-safe slug with diacritics stripped."
      onReset={() => {
        setInput("");
        setSeparator("-");
        setLower(true);
        setStripStop(false);
      }}
    >
      <Field label="Title or phrase" htmlFor="slug-input">
        <input
          id="slug-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={INPUT_CLASS}
          placeholder="e.g. Best Free Image Compressor 2026"
        />
      </Field>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Separator">
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className={INPUT_CLASS}>
            <option value="-">- (hyphen)</option>
            <option value="_">_ (underscore)</option>
            <option value=".">. (dot)</option>
            <option value="">none</option>
          </select>
        </Field>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Options
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
              <input
                type="checkbox"
                checked={lower}
                onChange={(e) => setLower(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
              />
              Lowercase
            </label>
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
              <input
                type="checkbox"
                checked={stripStop}
                onChange={(e) => setStripStop(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
              />
              Strip stop words (a, the, in…)
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Slug
          </p>
          <CopyButton value={slug} />
        </div>
        <p className="mt-2 break-all font-mono text-base text-surface-900 dark:text-white">
          {slug || <span className="text-surface-400">—</span>}
        </p>
        <p className="mt-2 text-[11px] text-surface-500 dark:text-surface-400">
          Length: {slug.length} characters
        </p>
      </div>
    </ToolShell>
  );
}
