"use client";

import { useEffect, useMemo, useState } from "react";
import { Bed, Coffee, Wand2, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

type Goal = "auto" | "power" | "recovery" | "cycle";

const GOAL_LABELS: Record<Goal, string> = {
  auto: "Auto-pick",
  power: "Power nap",
  recovery: "Recovery nap",
  cycle: "Full cycle",
};

const GOAL_DESCRIPTIONS: Record<Goal, string> = {
  auto: "Let the calculator pick based on the time you have.",
  power: "10–20 min for a quick alertness boost without grogginess.",
  recovery: "30 min after a short night, accepts some sleep inertia.",
  cycle: "90 min to complete a full sleep cycle and end on light sleep.",
};

const FALL_ASLEEP_MINUTES = 8;

interface Recommendation {
  goal: Exclude<Goal, "auto">;
  napMinutes: number;
  totalMinutes: number;
  wakeTime: string;
  warning?: string;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function nowHHMM(): string {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "—";
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function recommend(goal: Goal, availableMinutes: number, startTime: string): Recommendation | null {
  if (availableMinutes <= FALL_ASLEEP_MINUTES + 5) return null;
  const napBudget = availableMinutes - FALL_ASLEEP_MINUTES;

  let chosen: Exclude<Goal, "auto">;
  let napMinutes: number;
  let warning: string | undefined;

  if (goal === "auto") {
    if (napBudget >= 90) {
      chosen = "cycle";
      napMinutes = 90;
    } else if (napBudget >= 30) {
      chosen = "recovery";
      napMinutes = 30;
    } else {
      chosen = "power";
      napMinutes = Math.min(20, napBudget);
    }
  } else if (goal === "cycle") {
    chosen = "cycle";
    napMinutes = 90;
    if (napBudget < 90) {
      warning = "Less than 90 min available — you'll wake mid-cycle and feel groggy. Consider a 20-min power nap instead.";
      napMinutes = Math.min(20, napBudget);
      chosen = "power";
    }
  } else if (goal === "recovery") {
    chosen = "recovery";
    napMinutes = 30;
    if (napBudget < 30) {
      napMinutes = Math.max(10, napBudget);
    }
  } else {
    chosen = "power";
    napMinutes = Math.min(20, Math.max(10, napBudget));
  }

  return {
    goal: chosen,
    napMinutes,
    totalMinutes: napMinutes + FALL_ASLEEP_MINUTES,
    wakeTime: addMinutes(startTime, napMinutes + FALL_ASLEEP_MINUTES),
    warning,
  };
}

export function NapCalculator() {
  const [available, setAvailable] = useState(30);
  const [goal, setGoal] = useState<Goal>("auto");
  const [startTime, setStartTime] = useState("13:00");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setStartTime(nowHHMM());
  }, []);

  const result = useMemo(() => recommend(goal, available, startTime), [goal, available, startTime]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Time available
          </span>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={available}
              onChange={(e) => setAvailable(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-indigo-500 dark:bg-surface-700"
              aria-label="Minutes available for the nap"
            />
            <span className="w-20 text-right text-sm text-surface-600 dark:text-surface-300">
              {available} min
            </span>
          </div>
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            Total minutes you can spend (includes time to fall asleep).
          </p>
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Start time
          </span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            When you'll lie down. Defaults to right now.
          </p>
        </label>
      </div>

      {/* Goal */}
      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Goal</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
            <li key={g}>
              <button
                type="button"
                onClick={() => setGoal(g)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition",
                  goal === g
                    ? "border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100"
                    : "border-surface-200 bg-white text-surface-700 hover:border-indigo-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
                )}
              >
                <span className="font-semibold">{GOAL_LABELS[g]}</span>
                <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">
                  {GOAL_DESCRIPTIONS[g]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Result */}
      {result ? (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-surface-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Your nap
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-4xl font-bold text-surface-900 dark:text-white">
              {result.napMinutes} min
            </p>
            <p className="text-sm text-surface-600 dark:text-surface-300">
              {GOAL_LABELS[result.goal]} · wake at <strong>{result.wakeTime}</strong>
            </p>
          </div>
          <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
            {GOAL_DESCRIPTIONS[result.goal]}
          </p>
          {result.warning && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              ⚠ {result.warning}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-surface-600 dark:text-surface-300">
            <div className="flex items-start gap-1.5">
              <Bed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
              <span>
                Set an alarm for the wake time — it includes about {FALL_ASLEEP_MINUTES} min to fall asleep.
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <Coffee className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
              <span>
                "Coffee nap" tip: drink a coffee right before lying down — the caffeine kicks in just as you wake.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-surface-200 bg-white p-4 text-sm text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
          You need at least 15 minutes to make a nap worthwhile.
        </p>
      )}

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Wand2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <span>
          Best nap window for most people is 1pm–3pm. Napping after 4pm can push back your night-time
          sleep — keep it short and early if you can.
        </span>
      </p>

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <span>
          Avoid 45–80 minute naps if you can. You'll usually wake mid-deep-sleep with the heaviest
          grogginess. Go shorter (≤30) or longer (90+) to ride the cycles.
        </span>
      </p>
    </div>
  );
}
