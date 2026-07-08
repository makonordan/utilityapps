"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface MatchInfo {
  start: number;
  end: number;
  match: string;
  groups: { index: number; name?: string; value: string }[];
}

const FLAGS: { id: string; label: string; desc: string }[] = [
  { id: "g", label: "g", desc: "Global — find all matches" },
  { id: "i", label: "i", desc: "Case-insensitive" },
  { id: "m", label: "m", desc: "Multiline (^/$ match line boundaries)" },
  { id: "s", label: "s", desc: "Dotall (. matches newline)" },
  { id: "u", label: "u", desc: "Unicode" },
  { id: "y", label: "y", desc: "Sticky" },
];

const SAFETY_TIMEOUT_MS = 2000;

function tryRegex(pattern: string, flags: string, text: string): { matches?: MatchInfo[]; error?: string } {
  if (!pattern) return { matches: [] };
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid regex" };
  }
  const matches: MatchInfo[] = [];
  const start = performance.now();
  let m: RegExpExecArray | null;
  let lastIndex = -1;
  while ((m = re.exec(text)) !== null) {
    if (performance.now() - start > SAFETY_TIMEOUT_MS) {
      return { error: "Pattern took too long to evaluate (potential catastrophic backtracking)." };
    }
    if (re.lastIndex === lastIndex) {
      // zero-length match; advance to avoid infinite loop
      re.lastIndex++;
    }
    lastIndex = re.lastIndex;
    const groups = (m.groups ?? {}) as Record<string, string>;
    matches.push({
      start: m.index,
      end: m.index + m[0].length,
      match: m[0],
      groups: m.slice(1).map((value, i) => ({
        index: i + 1,
        name: Object.keys(groups).find((k) => groups[k] === value),
        value: value ?? "",
      })),
    });
    if (matches.length > 5000) break;
  }
  return { matches };
}

function highlight(text: string, matches: MatchInfo[]): React.ReactNode {
  if (matches.length === 0) return text;
  const out: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) out.push(text.slice(cursor, m.start));
    out.push(
      <mark
        key={`m-${i}`}
        className="rounded bg-warning-200 text-surface-900 dark:bg-warning-500/40 dark:text-white"
      >
        {text.slice(m.start, m.end)}
      </mark>
    );
    cursor = m.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+\\.\\w+)\\b");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g", "i"]));
  const [text, setText] = useState(
    "Send queries to support@example.com or hello@acme.io.\nWe also accept sales@company.io."
  );

  const flagString = useMemo(() => Array.from(flags).join(""), [flags]);
  const result = useMemo(() => tryRegex(pattern, flagString, text), [pattern, flagString, text]);

  const toggleFlag = (id: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Pattern</p>
        <div className="flex items-center gap-2 rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-sm dark:border-surface-700 dark:bg-surface-800">
          <span className="text-surface-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 bg-transparent outline-none text-surface-900 dark:text-white"
          />
          <span className="text-surface-500">/{flagString}</span>
        </div>
        {result.error && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-error-600 dark:text-error-400">
            <AlertTriangle className="h-3 w-3" /> {result.error}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFlag(f.id)}
              title={f.desc}
              className={cn(
                "rounded-md border px-2 py-1 text-xs font-mono font-semibold transition",
                flags.has(f.id)
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 hover:border-primary-300 dark:border-surface-700 dark:text-surface-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Test text</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        />
        {result.matches && (
          <div className="mt-3 rounded-lg border border-surface-200 bg-surface-50 p-3 font-mono text-sm whitespace-pre-wrap dark:border-surface-700 dark:bg-surface-800">
            {highlight(text, result.matches)}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {result.matches?.length ?? 0} match{result.matches?.length === 1 ? "" : "es"}
        </p>
        {result.matches && result.matches.length > 0 ? (
          <ul className="space-y-2">
            {result.matches.slice(0, 100).map((m, i) => (
              <li key={i} className="rounded-lg border border-surface-200 bg-surface-50 p-3 text-xs dark:border-surface-700 dark:bg-surface-800">
                <p className="font-mono text-surface-900 dark:text-white">
                  <span className="text-surface-500">[{m.start}–{m.end}]</span> "{m.match}"
                </p>
                {m.groups.length > 0 && (
                  <ul className="mt-1 space-y-0.5 pl-4 text-surface-600 dark:text-surface-300">
                    {m.groups.map((g) => (
                      <li key={g.index} className="font-mono">
                        {g.name ? `<${g.name}>` : `$${g.index}`} = "{g.value}"
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {result.matches.length > 100 && (
              <li className="text-xs italic text-surface-500">…and {result.matches.length - 100} more.</li>
            )}
          </ul>
        ) : (
          <p className="text-xs text-surface-500 dark:text-surface-400">No matches.</p>
        )}
      </div>
    </div>
  );
}
