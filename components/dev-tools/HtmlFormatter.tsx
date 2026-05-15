"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type Mode = "pretty" | "minify";

const SAMPLE = `<!DOCTYPE html><html><head><title>Hello</title></head><body><div class="container"><h1>UtilityApps</h1><p>200+ free tools</p><ul><li>JWT</li><li>Regex</li><li>YAML</li></ul></body></html>`;

export function HtmlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("pretty");
  const [indent, setIndent] = useState(2);
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
        if (mode === "minify") {
          // Lightweight minify: collapse whitespace between tags, keep content.
          const min = input
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/>\s+</g, "><")
            .replace(/\s+/g, " ")
            .trim();
          if (cancelled) return;
          setOutput(min);
          setError(null);
        } else {
          const beautify = await import("js-beautify");
          if (cancelled) return;
          const html = beautify.html(input, {
            indent_size: indent,
            wrap_line_length: 120,
            preserve_newlines: false,
            indent_inner_html: false,
            end_with_newline: true,
          });
          setOutput(html);
          setError(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Format failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input, mode, indent]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900">
            {(["pretty", "minify"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                  mode === m
                    ? "bg-primary-600 text-white"
                    : "text-surface-700 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-300"
                )}
              >
                {m === "pretty" ? "Pretty-print" : "Minify"}
              </button>
            ))}
          </div>
          {mode === "pretty" && (
            <label className="flex items-center gap-2 text-xs text-surface-700 dark:text-surface-300">
              Indent
              <input
                type="number"
                min={1}
                max={8}
                value={indent}
                onChange={(e) => setIndent(Math.max(1, Math.min(8, Number(e.target.value))))}
                className="w-16 rounded-lg border border-surface-300 bg-white px-2 py-1 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
              spaces
            </label>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Input</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Output</p>
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
