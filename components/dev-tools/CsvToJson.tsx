"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

const SAMPLE_CSV = `name,age,city
Daniel,29,Lagos
Ada,31,Abuja
Tunde,26,Port Harcourt`;

type Sep = "," | ";" | "\t" | "|";
const SEPARATORS: { id: Sep; label: string }[] = [
  { id: ",", label: "Comma ," },
  { id: ";", label: "Semicolon ;" },
  { id: "\t", label: "Tab" },
  { id: "|", label: "Pipe |" },
];

function detectSeparator(text: string): Sep {
  const first = text.split(/\r?\n/, 1)[0] ?? "";
  let best: Sep = ",";
  let bestCount = -1;
  for (const sep of [",", ";", "\t", "|"] as Sep[]) {
    const count = first.split(sep).length;
    if (count > bestCount) {
      best = sep;
      bestCount = count;
    }
  }
  return best;
}

function parseCsv(text: string, sep: Sep): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === sep) {
        row.push(cur);
        cur = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        cur = "";
        rows.push(row);
        row = [];
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export function CsvToJson() {
  const [input, setInput] = useState(SAMPLE_CSV);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [sep, setSep] = useState<Sep>(detectSeparator(SAMPLE_CSV));
  const [autoDetect, setAutoDetect] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (autoDetect) setSep(detectSeparator(input));
  }, [input, autoDetect]);

  const result = useMemo(() => {
    if (!input.trim()) return { json: "", error: null as string | null };
    try {
      const rows = parseCsv(input, sep);
      if (rows.length === 0) return { json: "[]", error: null };
      const [headers, ...body] = hasHeaders ? [rows[0], ...rows.slice(1)] : [
        rows[0].map((_, i) => `column${i + 1}`),
        ...rows,
      ];
      const objects = body.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] ?? "";
        });
        return obj;
      });
      return { json: JSON.stringify(objects, null, 2), error: null };
    } catch (e) {
      return { json: "", error: e instanceof Error ? e.message : "Parse failed." };
    }
  }, [input, sep, hasHeaders]);

  const handleCopy = async () => {
    if (!result.json) return;
    await navigator.clipboard.writeText(result.json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={hasHeaders}
              onChange={(e) => setHasHeaders(e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            First row is headers
          </label>
          <label className="flex items-center gap-2 text-xs text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            Auto-detect separator
          </label>
          <select
            value={sep}
            onChange={(e) => {
              setAutoDetect(false);
              setSep(e.target.value as Sep);
            }}
            className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          >
            {SEPARATORS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">CSV</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">JSON</p>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-surface-600 hover:text-primary-700 dark:text-surface-300 dark:hover:text-primary-300"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre
            className={cn(
              "h-[26rem] overflow-auto whitespace-pre rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white",
              result.error && "border-error-300 bg-error-50/40"
            )}
          >
            {result.error ?? result.json}
          </pre>
        </div>
      </div>
    </div>
  );
}
