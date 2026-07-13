"use client";

import { useEffect, useMemo, useState } from "react";

import { CopyButton, TEXTAREA_CLASS, ToolShell } from "./ToolShell";
import { cn } from "@/lib/utils";

// ============================================================ Analyze (word + character counts)

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

function analyse(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim().length === 0 ? 0 : text.split(/[.!?]+(?=\s|$)/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text === "" ? 0 : text.split(/\n/).length;
  const bytes = new Blob([text]).size;
  // Average reading speed: 238 wpm (Brysbaert 2019). Speaking: 130 wpm.
  const readingMinutes = words / 238;
  const speakingMinutes = words / 130;
  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    bytes,
    readingTime: formatMinutes(readingMinutes),
    speakingTime: formatMinutes(speakingMinutes),
  };
}

function formatMinutes(m: number): string {
  if (m < 1 / 60) return "< 1 sec";
  if (m < 1) return `${Math.round(m * 60)} sec`;
  const minutes = Math.floor(m);
  const seconds = Math.round((m - minutes) * 60);
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`;
}

// ============================================================ Case conversion

type CaseId =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternate"
  | "inverse";

interface CaseDef {
  id: CaseId;
  name: string;
  description: string;
  transform: (input: string) => string;
}

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const CASES: CaseDef[] = [
  { id: "upper", name: "UPPER CASE", description: "Every letter uppercase.", transform: (s) => s.toUpperCase() },
  { id: "lower", name: "lower case", description: "Every letter lowercase.", transform: (s) => s.toLowerCase() },
  {
    id: "title",
    name: "Title Case",
    description: "Capitalises every word.",
    transform: (s) =>
      s
        .toLowerCase()
        .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1)),
  },
  {
    id: "sentence",
    name: "Sentence case",
    description: "Capitalises the first letter of each sentence.",
    transform: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    name: "camelCase",
    description: "First word lowercase, subsequent words capitalised.",
    transform: (s) =>
      splitWords(s)
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(""),
  },
  {
    id: "pascal",
    name: "PascalCase",
    description: "Every word capitalised, no spaces.",
    transform: (s) =>
      splitWords(s)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(""),
  },
  {
    id: "snake",
    name: "snake_case",
    description: "Lowercase words joined by underscores.",
    transform: (s) => splitWords(s).map((w) => w.toLowerCase()).join("_"),
  },
  {
    id: "kebab",
    name: "kebab-case",
    description: "Lowercase words joined by hyphens.",
    transform: (s) => splitWords(s).map((w) => w.toLowerCase()).join("-"),
  },
  {
    id: "constant",
    name: "CONSTANT_CASE",
    description: "Uppercase words joined by underscores.",
    transform: (s) => splitWords(s).map((w) => w.toUpperCase()).join("_"),
  },
  {
    id: "alternate",
    name: "aLtErNaTiNg cAsE",
    description: "Alternating upper and lower per character.",
    transform: (s) =>
      Array.from(s)
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
  {
    id: "inverse",
    name: "InVeRsE CaSe",
    description: "Swaps every character's case.",
    transform: (s) =>
      Array.from(s)
        .map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()))
        .join(""),
  },
];

// ============================================================ Diff checker

type DiffOp = "equal" | "added" | "removed";
interface DiffLine {
  op: DiffOp;
  text: string;
}

// Classic LCS-based line diff. O(n*m) but fine for typical paste sizes.
function diffLines(a: string, b: string): DiffLine[] {
  const A = a.split("\n");
  const B = b.split("\n");
  const m = A.length;
  const n = B.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) {
      out.push({ op: "equal", text: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: "removed", text: A[i] });
      i++;
    } else {
      out.push({ op: "added", text: B[j] });
      j++;
    }
  }
  while (i < m) out.push({ op: "removed", text: A[i++] });
  while (j < n) out.push({ op: "added", text: B[j++] });
  return out;
}

// ============================================================ Tabs shell

type Tab = "analyze" | "compare";

const TABS: { id: Tab; label: string }[] = [
  { id: "analyze", label: "Count & Convert" },
  { id: "compare", label: "Compare Texts" },
];

export function TextToolkit() {
  const [tab, setTab] = useState<Tab>("analyze");

  // Deep-link support for redirected URLs, e.g. /tools/word-counter?tab=compare
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.get("tab") === "compare") setTab("compare");
  }, []);

  return (
    <ToolShell
      eyebrow="Text"
      title="Text Toolkit"
      description="Count words and characters, convert case, and compare two texts — all in one place."
    >
      <div
        role="tablist"
        aria-label="Text toolkit mode"
        className="mb-6 inline-flex rounded-xl border border-surface-200 bg-surface-50 p-1 dark:border-surface-700 dark:bg-surface-800/60"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              tab === t.id
                ? "bg-white text-primary-700 shadow-sm dark:bg-surface-950 dark:text-primary-300"
                : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "analyze" ? <AnalyzePanel /> : <ComparePanel />}
    </ToolShell>
  );
}

function AnalyzePanel() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyse(text), [text]);
  const caseResults = useMemo(() => CASES.map((c) => ({ ...c, output: c.transform(text) })), [text]);

  return (
    <div>
      <textarea
        aria-label="Text to count and convert"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className={TEXTAREA_CLASS}
      />

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Bytes (UTF-8)", value: stats.bytes },
          { label: "Reading time", value: stats.readingTime },
          { label: "Speaking time", value: stats.speakingTime },
        ].map((item) => (
          <li
            key={item.label}
            className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-3 dark:border-surface-700 dark:bg-surface-800/60"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-bold text-surface-900 dark:text-white">{item.value}</p>
          </li>
        ))}
      </ul>

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

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Convert case
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {caseResults.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-surface-200 bg-surface-50/60 p-3 dark:border-surface-700 dark:bg-surface-800/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">{c.name}</p>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">{c.description}</p>
                </div>
                <CopyButton value={c.output} />
              </div>
              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-2 font-mono text-xs text-surface-800 dark:bg-surface-900 dark:text-surface-100">
                {c.output || <span className="text-surface-400">—</span>}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparePanel() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => diffLines(a, b), [a, b]);
  const summary = useMemo(() => {
    let added = 0;
    let removed = 0;
    let equal = 0;
    for (const r of result) {
      if (r.op === "added") added++;
      else if (r.op === "removed") removed++;
      else equal++;
    }
    return { added, removed, equal };
  }, [result]);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Original
          </p>
          <textarea
            aria-label="Original text"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Paste the original text…"
            className={TEXTAREA_CLASS}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Changed
          </p>
          <textarea
            aria-label="Changed text"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Paste the new text…"
            className={TEXTAREA_CLASS}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Summary
        </span>
        <span className="rounded-full bg-success-50 px-2.5 py-0.5 font-semibold text-success-700 dark:bg-success-500/15 dark:text-success-300">
          +{summary.added} added
        </span>
        <span className="rounded-full bg-error-50 px-2.5 py-0.5 font-semibold text-error-700 dark:bg-error-500/15 dark:text-error-300">
          −{summary.removed} removed
        </span>
        <span className="rounded-full bg-surface-100 px-2.5 py-0.5 font-semibold text-surface-700 dark:bg-surface-700 dark:text-surface-200">
          {summary.equal} unchanged
        </span>
      </div>

      <div className="mt-4 max-h-[400px] overflow-auto rounded-xl border border-surface-200 bg-surface-50 p-3 font-mono text-sm dark:border-surface-700 dark:bg-surface-900">
        {result.length === 0 ? (
          <p className="text-surface-500">Enter text on both sides to see the diff.</p>
        ) : (
          result.map((line, idx) => (
            <div
              key={idx}
              className={
                line.op === "added"
                  ? "bg-success-50 text-success-800 dark:bg-success-500/10 dark:text-success-200"
                  : line.op === "removed"
                    ? "bg-error-50 text-error-800 line-through opacity-90 dark:bg-error-500/10 dark:text-error-200"
                    : "text-surface-700 dark:text-surface-300"
              }
            >
              <span className="mr-2 select-none text-surface-400">
                {line.op === "added" ? "+" : line.op === "removed" ? "−" : " "}
              </span>
              {line.text || " "}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
