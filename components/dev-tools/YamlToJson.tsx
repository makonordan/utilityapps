"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type Direction = "yaml-to-json" | "json-to-yaml";

const SAMPLE_YAML = `name: utilityapps
version: 1.0.0
features:
  - free
  - no-signup
  - browser-side
endpoints:
  api: https://utilityapps.site/api
  cdn: https://cdn.utilityapps.site
`;

const SAMPLE_JSON = JSON.stringify(
  {
    name: "utilityapps",
    version: "1.0.0",
    features: ["free", "no-signup", "browser-side"],
    endpoints: { api: "https://utilityapps.site/api", cdn: "https://cdn.utilityapps.site" },
  },
  null,
  2
);

export function YamlToJson() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const yaml = await import("js-yaml");
        if (cancelled) return;
        if (!input.trim()) {
          setOutput("");
          setError(null);
          return;
        }
        if (direction === "yaml-to-json") {
          const obj = yaml.load(input);
          setOutput(JSON.stringify(obj, null, 2));
        } else {
          const obj = JSON.parse(input);
          setOutput(yaml.dump(obj, { lineWidth: 100 }));
        }
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Conversion failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [direction, input]);

  const swapDirection = () => {
    setDirection((d) => (d === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"));
    setInput(direction === "yaml-to-json" ? SAMPLE_JSON : SAMPLE_YAML);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const inputLabel = direction === "yaml-to-json" ? "YAML" : "JSON";
  const outputLabel = direction === "yaml-to-json" ? "JSON" : "YAML";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={swapDirection}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
        >
          <ArrowLeftRight className="h-4 w-4" />
          {inputLabel} → {outputLabel}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{inputLabel}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{outputLabel}</p>
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
              error && "border-error-300 bg-error-50/40 dark:border-error-500/40 dark:bg-error-500/10"
            )}
          >
            {error ?? output ?? ""}
          </pre>
        </div>
      </div>
    </div>
  );
}
