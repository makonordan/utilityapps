"use client";

import { useMemo, useState } from "react";

import { TEXTAREA_CLASS, ToolShell } from "./ToolShell";

type Op = "equal" | "added" | "removed";
interface Line {
  op: Op;
  text: string;
}

// Classic LCS-based line diff. O(n*m) but fine for typical paste sizes.
function diffLines(a: string, b: string): Line[] {
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

  const out: Line[] = [];
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

export function TextDiffChecker() {
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
    <ToolShell
      eyebrow="Text"
      title="Text Diff Checker"
      description="Compare two pieces of text line-by-line. Added lines green, removed red."
      onReset={() => {
        setA("");
        setB("");
      }}
    >
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
              {line.text || " "}
            </div>
          ))
        )}
      </div>
    </ToolShell>
  );
}
