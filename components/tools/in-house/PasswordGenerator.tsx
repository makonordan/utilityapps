"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { CopyButton, Field, INPUT_CLASS, ToolShell } from "./ToolShell";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const AMBIGUOUS = /[O0Il1|`'"]/g;

function pickRandom(set: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return set.charAt(arr[0] % set.length);
}

function shuffle(s: string): string {
  const arr = Array.from(s);
  for (let i = arr.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function strengthLabel(entropy: number): { label: string; color: string } {
  if (entropy < 28) return { label: "Very weak", color: "bg-error-500" };
  if (entropy < 40) return { label: "Weak", color: "bg-warning-500" };
  if (entropy < 60) return { label: "Reasonable", color: "bg-warning-400" };
  if (entropy < 80) return { label: "Strong", color: "bg-success-500" };
  return { label: "Very strong", color: "bg-success-600" };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  // `seed` is bumped by the "New" button to force a fresh roll without
  // changing other options. Combined with the option deps below, the
  // password is derived purely from state via useMemo — no setState in
  // an effect, which would otherwise trigger a cascading re-render.
  const [seed, setSeed] = useState(0);

  const password = useMemo(() => {
    // The deps list intentionally includes `seed` so React re-runs this
    // memo when the user clicks "New" even if no other input changed.
    void seed;
    const guaranteed: string[] = [];
    let pool = "";
    if (includeLower) {
      pool += LOWER;
      guaranteed.push(pickRandom(LOWER));
    }
    if (includeUpper) {
      pool += UPPER;
      guaranteed.push(pickRandom(UPPER));
    }
    if (includeDigits) {
      pool += DIGITS;
      guaranteed.push(pickRandom(DIGITS));
    }
    if (includeSymbols) {
      pool += SYMBOLS;
      guaranteed.push(pickRandom(SYMBOLS));
    }
    if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, "");
    if (!pool) return "";
    const remaining = Math.max(0, length - guaranteed.length);
    const filler: string[] = [];
    for (let i = 0; i < remaining; i++) filler.push(pickRandom(pool));
    return shuffle([...guaranteed.slice(0, length), ...filler].join(""));
  }, [length, includeUpper, includeLower, includeDigits, includeSymbols, excludeAmbiguous, seed]);

  const generate = () => setSeed((s) => s + 1);

  const poolSize =
    (includeLower ? 26 : 0) +
    (includeUpper ? 26 : 0) +
    (includeDigits ? 10 : 0) +
    (includeSymbols ? SYMBOLS.length : 0);
  const entropy = poolSize > 0 ? Math.log2(poolSize) * length : 0;
  const strength = strengthLabel(entropy);

  return (
    <ToolShell
      eyebrow="Developer"
      title="Password Generator"
      description="Cryptographically secure passwords using window.crypto. Configure length and character sets."
      onReset={() => {
        setLength(16);
        setIncludeUpper(true);
        setIncludeLower(true);
        setIncludeDigits(true);
        setIncludeSymbols(true);
        setExcludeAmbiguous(false);
      }}
    >
      <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            Generated password
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generate}
              aria-label="Regenerate"
              className="inline-flex items-center gap-1 rounded-xl border border-primary-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 dark:border-primary-500/40 dark:bg-surface-900 dark:text-primary-200 dark:hover:bg-primary-500/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New
            </button>
            <CopyButton value={password} />
          </div>
        </div>
        <p className="mt-3 break-all font-mono text-lg text-surface-900 dark:text-white">
          {password || <span className="text-surface-400">—</span>}
        </p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
            <span className="text-surface-500 dark:text-surface-400">Strength</span>
            <span className="text-surface-700 dark:text-surface-200">{strength.label} · ~{Math.round(entropy)} bits</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
            <div className={`h-full ${strength.color}`} style={{ width: `${Math.min(100, entropy)}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={`Length (${length})`}>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <input
            type="number"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Math.max(6, Math.min(64, Number(e.target.value) || 6)))}
            className={INPUT_CLASS}
          />
        </Field>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Character sets
          </p>
          <div className="space-y-2">
            {[
              { label: "Lowercase (a-z)", value: includeLower, set: setIncludeLower },
              { label: "Uppercase (A-Z)", value: includeUpper, set: setIncludeUpper },
              { label: "Digits (0-9)", value: includeDigits, set: setIncludeDigits },
              { label: "Symbols (!@#…)", value: includeSymbols, set: setIncludeSymbols },
              { label: "Exclude ambiguous (O0Il1|)", value: excludeAmbiguous, set: setExcludeAmbiguous },
            ].map((c) => (
              <label key={c.label} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
                <input
                  type="checkbox"
                  checked={c.value}
                  onChange={(e) => c.set(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
