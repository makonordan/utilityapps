"use client";

import { useMemo, useState } from "react";

import { CopyButton, TEXTAREA_CLASS, ToolShell } from "./ToolShell";

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

export function CaseConverter() {
  const [input, setInput] = useState("");
  const results = useMemo(() => CASES.map((c) => ({ ...c, output: c.transform(input) })), [input]);

  return (
    <ToolShell
      eyebrow="Text"
      title="Case Converter"
      description="Convert text between 11 common case styles. Output updates as you type."
      onReset={() => setInput("")}
    >
      <textarea
        aria-label="Input text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste your text…"
        className={TEXTAREA_CLASS}
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {results.map((c) => (
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
    </ToolShell>
  );
}
