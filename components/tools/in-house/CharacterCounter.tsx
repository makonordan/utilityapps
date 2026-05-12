"use client";

import { useMemo, useState } from "react";

import { TEXTAREA_CLASS, ToolShell } from "./ToolShell";

const PLATFORM_LIMITS = [
  { name: "Twitter / X post", limit: 280 },
  { name: "SMS (single)", limit: 160 },
  { name: "Meta description", limit: 160 },
  { name: "Title tag", limit: 60 },
  { name: "Bluesky post", limit: 300 },
  { name: "LinkedIn post", limit: 3000 },
  { name: "Instagram caption", limit: 2200 },
  { name: "YouTube description", limit: 5000 },
] as const;

export function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const lines = text === "" ? 0 : text.split(/\n/).length;
    const bytes = new Blob([text]).size;
    return { characters, noSpaces, lines, bytes };
  }, [text]);

  return (
    <ToolShell
      eyebrow="Text"
      title="Character Counter"
      description="Live character, byte and line counts with limits for the platforms you actually post on."
      onReset={() => setText("")}
    >
      <textarea
        aria-label="Text to count"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text…"
        className={TEXTAREA_CLASS}
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Characters", value: stats.characters },
          { label: "No spaces", value: stats.noSpaces },
          { label: "Lines", value: stats.lines },
          { label: "Bytes (UTF-8)", value: stats.bytes },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-3 dark:border-surface-700 dark:bg-surface-800/60"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {s.label}
            </p>
            <p className="mt-1 text-lg font-bold text-surface-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Platform limits
        </p>
        <ul className="space-y-2">
          {PLATFORM_LIMITS.map((p) => {
            const remaining = p.limit - stats.characters;
            const over = remaining < 0;
            const close = !over && remaining < p.limit * 0.1;
            const pct = Math.min(100, (stats.characters / p.limit) * 100);
            return (
              <li
                key={p.name}
                className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm dark:border-surface-700 dark:bg-surface-800/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-surface-800 dark:text-surface-100">{p.name}</span>
                  <span
                    className={
                      over
                        ? "font-semibold text-error-600 dark:text-error-400"
                        : close
                          ? "font-semibold text-warning-600 dark:text-warning-400"
                          : "text-surface-600 dark:text-surface-300"
                    }
                  >
                    {stats.characters} / {p.limit}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-700">
                  <div
                    className={
                      over
                        ? "h-full bg-error-500"
                        : close
                          ? "h-full bg-warning-500"
                          : "h-full bg-primary-500"
                    }
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ToolShell>
  );
}
