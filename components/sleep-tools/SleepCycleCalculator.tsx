"use client";

import { useEffect, useMemo, useState } from "react";
import { BedDouble, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type Mode = "wake" | "bed";

const STORAGE_KEY = "ua-sleep-cycle-v1";
const CYCLE_MINUTES = 90;
const RECOMMENDED_CYCLES = new Set([5, 6]);

interface Suggestion {
  cycles: number;
  totalMinutes: number;
  time: string;
}

function parseTime(value: string): { h: number; m: number } | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function hoursLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function calculate({
  mode,
  baseTime,
  fallAsleepMinutes,
}: {
  mode: Mode;
  baseTime: string;
  fallAsleepMinutes: number;
}): Suggestion[] | null {
  const parsed = parseTime(baseTime);
  if (!parsed) return null;

  const base = new Date();
  base.setHours(parsed.h, parsed.m, 0, 0);

  return [3, 4, 5, 6, 7].map((cycles) => {
    const sleepMinutes = cycles * CYCLE_MINUTES;
    const totalMinutes = sleepMinutes + fallAsleepMinutes;
    const target = new Date(base);
    if (mode === "wake") {
      // working backwards from wake time
      target.setMinutes(target.getMinutes() - totalMinutes);
    } else {
      // working forwards from bedtime
      target.setMinutes(target.getMinutes() + totalMinutes);
    }
    return { cycles, totalMinutes: sleepMinutes, time: formatTime(target) };
  });
}

interface Persisted {
  mode: Mode;
  baseTime: string;
  fallAsleepMinutes: number;
}

function readPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (parsed.mode !== "wake" && parsed.mode !== "bed") return null;
    if (typeof parsed.baseTime !== "string") return null;
    if (typeof parsed.fallAsleepMinutes !== "number") return null;
    return parsed as Persisted;
  } catch {
    return null;
  }
}

export function SleepCycleCalculator() {
  const [mode, setMode] = useState<Mode>("wake");
  const [baseTime, setBaseTime] = useState("07:00");
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState(14);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = readPersisted();
    if (saved) {
      setMode(saved.mode);
      setBaseTime(saved.baseTime);
      setFallAsleepMinutes(saved.fallAsleepMinutes);
    }
    setHydrated(true);
  }, []);

  // Persist on change after hydration.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mode, baseTime, fallAsleepMinutes })
      );
    } catch {
      /* localStorage full / disabled — ignore */
    }
  }, [mode, baseTime, fallAsleepMinutes, hydrated]);

  const suggestions = useMemo(
    () => calculate({ mode, baseTime, fallAsleepMinutes }),
    [mode, baseTime, fallAsleepMinutes]
  );

  const resultsLabel =
    mode === "wake" ? "Go to bed at one of these times" : "Wake up at one of these times";

  return (
    <div className="space-y-8">
      {/* Mode toggle */}
      <div role="tablist" aria-label="Calculation mode" className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800">
        <ModeButton
          active={mode === "wake"}
          onClick={() => setMode("wake")}
          Icon={Sun}
          label="I want to wake up at"
        />
        <ModeButton
          active={mode === "bed"}
          onClick={() => setMode("bed")}
          Icon={Moon}
          label="I'm going to bed at"
        />
      </div>

      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            {mode === "wake" ? "Wake-up time" : "Bedtime"}
          </span>
          <input
            type="time"
            value={baseTime}
            onChange={(e) => setBaseTime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Time to fall asleep
          </span>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={fallAsleepMinutes}
              onChange={(e) => setFallAsleepMinutes(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-primary-500 dark:bg-surface-700"
              aria-label="Minutes to fall asleep"
            />
            <span className="w-20 text-right text-sm text-surface-600 dark:text-surface-300">
              {fallAsleepMinutes} min
            </span>
          </div>
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            Average is about 14 minutes — adjust to what's typical for you.
          </p>
        </label>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">{resultsLabel}</h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          Each option aligns with whole 90-minute sleep cycles. The highlighted rows give 7.5–9 hours of sleep, which works best for most adults.
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions?.map((s) => {
            const recommended = RECOMMENDED_CYCLES.has(s.cycles);
            return (
              <li
                key={s.cycles}
                className={cn(
                  "rounded-2xl border bg-white p-4 dark:bg-surface-900",
                  recommended
                    ? "border-indigo-300 ring-2 ring-indigo-500/15 dark:border-indigo-500/40"
                    : "border-surface-200 dark:border-surface-800"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {s.cycles} cycles
                  </span>
                  {recommended && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">{s.time}</p>
                <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                  {hoursLabel(s.totalMinutes)} of sleep
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          <BedDouble className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
          <span>
            Sleep cycles average 90 minutes but vary between 70 and 110 from person to person.
            Use these times as a starting point, then adjust by 10–15 minutes if you wake up
            groggy.
          </span>
        </p>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Sun;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-white text-indigo-700 shadow-sm dark:bg-surface-950 dark:text-indigo-300"
          : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
