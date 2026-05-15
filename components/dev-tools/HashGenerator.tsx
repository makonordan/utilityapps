"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

type Algo = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

const ALGORITHMS: Algo[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeHash(algo: Algo, input: ArrayBuffer | string): Promise<string> {
  const data = typeof input === "string" ? new TextEncoder().encode(input).buffer : input;
  if (algo === "MD5") {
    const md5Mod = await import("js-md5");
    const md5 = (md5Mod as unknown as { default: (b: ArrayBuffer) => string }).default ?? md5Mod.md5;
    return typeof md5 === "function" ? md5(data) : (md5Mod as unknown as { md5: (b: ArrayBuffer) => string }).md5(data);
  }
  const algoMap: Record<Exclude<Algo, "MD5">, string> = {
    "SHA-1": "SHA-1",
    "SHA-256": "SHA-256",
    "SHA-512": "SHA-512",
  };
  const digest = await crypto.subtle.digest(algoMap[algo as Exclude<Algo, "MD5">], data);
  return bufferToHex(digest);
}

export function HashGenerator() {
  const [text, setText] = useState("hello, world");
  const [file, setFile] = useState<File | null>(null);
  const [enabled, setEnabled] = useState<Set<Algo>>(new Set(ALGORITHMS));
  const [hashes, setHashes] = useState<Partial<Record<Algo, string>>>({});
  const [copied, setCopied] = useState<Algo | null>(null);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setComputing(true);
      try {
        const input: ArrayBuffer | string = file ? await file.arrayBuffer() : text;
        const next: Partial<Record<Algo, string>> = {};
        for (const algo of ALGORITHMS) {
          if (!enabled.has(algo)) continue;
          next[algo] = await computeHash(algo, input);
          if (cancelled) return;
        }
        if (!cancelled) setHashes(next);
      } catch {
        if (!cancelled) setHashes({});
      } finally {
        if (!cancelled) setComputing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, file, enabled]);

  const toggleAlgo = (a: Algo) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  const handleCopy = async (a: Algo) => {
    const v = hashes[a];
    if (!v) return;
    await navigator.clipboard.writeText(v);
    setCopied(a);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Source</p>
        {!file ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            placeholder="Type or paste text to hash"
          />
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800">
            <span className="truncate text-surface-900 dark:text-white">{file.name}</span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs font-semibold text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
            >
              Use text instead
            </button>
          </div>
        )}
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300">
          <Upload className="h-3.5 w-3.5" />
          Hash a file instead
          <input
            type="file"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-3 flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAlgo(a)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                enabled.has(a)
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 hover:border-primary-300 dark:border-surface-700 dark:text-surface-300"
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {ALGORITHMS.filter((a) => enabled.has(a)).map((a) => (
            <li key={a} className="rounded-lg border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{a}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(a)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-surface-600 hover:text-primary-700 dark:text-surface-300 dark:hover:text-primary-300"
                >
                  {copied === a ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === a ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="break-all font-mono text-xs text-surface-900 dark:text-white">
                {computing && !hashes[a] ? "computing…" : hashes[a] ?? ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
