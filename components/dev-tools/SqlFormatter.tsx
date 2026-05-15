"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

const DIALECTS = [
  "sql", "postgresql", "mysql", "mariadb", "bigquery", "snowflake",
  "redshift", "sqlite", "db2", "trino", "tsql",
] as const;

type Dialect = (typeof DIALECTS)[number];
type KeywordCase = "upper" | "lower" | "preserve";

const SAMPLE_SQL =
  `select u.id, u.email, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.created_at > '2024-01-01' group by u.id, u.email having count(o.id) > 5 order by orders desc limit 100;`;

export function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [tabWidth, setTabWidth] = useState(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!input.trim()) {
          setOutput("");
          setError(null);
          return;
        }
        const { format } = await import("sql-formatter");
        if (cancelled) return;
        const formatted = format(input, {
          language: dialect,
          tabWidth,
          keywordCase,
        });
        setOutput(formatted);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Format failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input, dialect, tabWidth, keywordCase]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Dialect</span>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as Dialect)}
              className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            >
              {DIALECTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Indent</span>
            <input
              type="number"
              min={1}
              max={8}
              value={tabWidth}
              onChange={(e) => setTabWidth(Math.max(1, Math.min(8, Number(e.target.value))))}
              className="w-20 rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Keyword case</span>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            >
              <option value="upper">UPPER</option>
              <option value="lower">lower</option>
              <option value="preserve">preserve</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">SQL</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Formatted</p>
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
              error && "border-error-300 bg-error-50/40"
            )}
          >
            {error ?? output}
          </pre>
        </div>
      </div>
    </div>
  );
}
