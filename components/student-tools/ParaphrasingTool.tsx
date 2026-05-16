"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

// Compact synonym dictionary. Keys and values are lowercase base forms; the
// substitution preserves the original capitalisation.
const SYNONYMS: Record<string, string[]> = {
  important: ["essential", "crucial", "significant", "vital"],
  big: ["large", "substantial", "considerable", "sizeable"],
  small: ["minor", "modest", "slight", "compact"],
  good: ["strong", "effective", "solid", "favourable"],
  bad: ["poor", "weak", "unfavourable", "deficient"],
  show: ["demonstrate", "reveal", "indicate", "illustrate"],
  use: ["employ", "utilise", "apply", "leverage"],
  make: ["create", "produce", "generate", "form"],
  help: ["assist", "support", "aid", "facilitate"],
  get: ["obtain", "acquire", "receive", "gain"],
  many: ["numerous", "several", "various", "multiple"],
  also: ["additionally", "furthermore", "moreover", "likewise"],
  but: ["however", "yet", "although", "though"],
  because: ["since", "as", "given that"],
  very: ["highly", "extremely", "particularly", "notably"],
  think: ["believe", "consider", "regard", "judge"],
  said: ["stated", "noted", "remarked", "observed"],
  start: ["begin", "commence", "initiate", "launch"],
  end: ["conclude", "finish", "complete", "terminate"],
  change: ["alter", "modify", "adjust", "revise"],
  problem: ["issue", "challenge", "difficulty", "obstacle"],
  result: ["outcome", "consequence", "effect", "finding"],
  idea: ["concept", "notion", "thought", "principle"],
  way: ["method", "approach", "manner", "means"],
  hard: ["difficult", "challenging", "demanding", "tough"],
  easy: ["simple", "straightforward", "effortless", "uncomplicated"],
  fast: ["quick", "rapid", "swift", "speedy"],
  slow: ["gradual", "unhurried", "sluggish", "leisurely"],
  new: ["recent", "novel", "modern", "fresh"],
  old: ["former", "previous", "earlier", "prior"],
  often: ["frequently", "regularly", "commonly", "repeatedly"],
  clear: ["evident", "obvious", "apparent", "plain"],
  improve: ["enhance", "strengthen", "refine", "advance"],
  increase: ["raise", "boost", "expand", "grow"],
  decrease: ["reduce", "lower", "diminish", "lessen"],
  understand: ["grasp", "comprehend", "recognise", "appreciate"],
  explain: ["clarify", "describe", "outline", "detail"],
  need: ["require", "demand", "call for"],
  want: ["wish", "desire", "seek"],
  find: ["discover", "identify", "locate", "uncover"],
  build: ["construct", "develop", "assemble", "establish"],
  allow: ["enable", "permit", "let"],
  keep: ["retain", "maintain", "preserve", "hold"],
  give: ["provide", "supply", "offer", "deliver"],
  look: ["appear", "seem"],
  thing: ["element", "aspect", "item", "factor"],
  people: ["individuals", "users", "readers"],
  great: ["excellent", "outstanding", "remarkable", "superb"],
  really: ["genuinely", "truly", "particularly"],
  however: ["nevertheless", "nonetheless", "even so"],
  therefore: ["consequently", "thus", "hence", "as a result"],
};

function matchCase(original: string, replacement: string): string {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original.charAt(0) === original.charAt(0).toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function paraphrase(text: string): { output: string; changed: number } {
  let changed = 0;
  const output = text.replace(/[A-Za-z']+/g, (word) => {
    const key = word.toLowerCase();
    const options = SYNONYMS[key];
    if (!options || options.length === 0) return word;
    // Deterministic but varied: pick based on word length so re-runs are stable.
    const pick = options[word.length % options.length];
    changed++;
    return matchCase(word, pick);
  });
  return { output, changed };
}

export function ParaphrasingTool() {
  const [input, setInput] = useState(
    "This tool is very important because it can help students improve their writing and make ideas clear."
  );
  const [output, setOutput] = useState("");
  const [changedCount, setChangedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    const { output: out, changed } = paraphrase(input);
    setOutput(out);
    setChangedCount(changed);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-warning-300 bg-warning-50 px-4 py-3 text-xs text-warning-800 dark:border-warning-500/50 dark:bg-warning-500/10 dark:text-warning-200">
        This is a browser-side writing aid for rewording <strong>your own</strong> sentences. It is
        not a way to disguise someone else&apos;s work — that&apos;s plagiarism regardless of the
        tool. Always cite your sources.
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Your text
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        />
      </div>

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <button
          type="button"
          onClick={handleRun}
          disabled={!input.trim()}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          <RefreshCw className="h-6 w-6" />
          Paraphrase
        </button>
      </div>

      {output && (
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Reworded {changedCount !== null && `· ${changedCount} word${changedCount === 1 ? "" : "s"} changed`}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="rounded-lg bg-surface-50 p-3 text-sm leading-relaxed text-surface-900 dark:bg-surface-800 dark:text-white">
            {output}
          </p>
          <p className="mt-2 text-[11px] text-surface-500 dark:text-surface-400">
            Read this carefully and fix anything awkward — a synonym swap can change meaning or
            tone. The result is a starting point, not a finished sentence.
          </p>
        </div>
      )}
    </div>
  );
}
