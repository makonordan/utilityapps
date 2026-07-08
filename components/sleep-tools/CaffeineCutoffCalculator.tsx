"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Coffee } from "lucide-react";

import { cn } from "@/lib/utils";

type DrinkId = "espresso" | "coffee" | "energy" | "black-tea" | "cola" | "custom";

interface Drink {
  label: string;
  mg: number;
}

const DRINKS: Record<DrinkId, Drink> = {
  espresso: { label: "Espresso (1 shot)", mg: 63 },
  coffee: { label: "Brewed coffee (240 ml)", mg: 95 },
  energy: { label: "Energy drink (250 ml)", mg: 80 },
  "black-tea": { label: "Strong black tea (240 ml)", mg: 50 },
  cola: { label: "Cola (330 ml)", mg: 32 },
  custom: { label: "Custom amount", mg: 100 },
};

type Sensitivity = "slow" | "normal" | "fast";

const HALF_LIFE_HOURS: Record<Sensitivity, number> = {
  slow: 7,
  normal: 5,
  fast: 3.5,
};

const SLEEP_THRESHOLD_MG = 50;

function parseTime(value: string): { h: number; m: number } | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function nowDate(): Date {
  return new Date();
}

function bedtimeDateFor(bedtime: string): Date {
  const parsed = parseTime(bedtime);
  if (!parsed) return new Date();
  const now = nowDate();
  const dt = new Date(now);
  dt.setHours(parsed.h, parsed.m, 0, 0);
  // If bedtime has already passed today, treat it as tomorrow.
  if (dt.getTime() <= now.getTime()) {
    dt.setDate(dt.getDate() + 1);
  }
  return dt;
}

function remainingMg(initialMg: number, hoursElapsed: number, halfLifeHours: number): number {
  if (hoursElapsed <= 0) return initialMg;
  return initialMg * Math.pow(0.5, hoursElapsed / halfLifeHours);
}

function hoursBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 36e5;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function cutoffTimeFor(
  bedtime: Date,
  doseMg: number,
  halfLifeHours: number,
  thresholdMg: number
): Date | null {
  if (doseMg <= thresholdMg) {
    // Already under threshold even with no decay — caffeine load is fine any time.
    return null;
  }
  // Solve mg * 0.5^(t / half) = threshold  ->  t = half * log2(mg / threshold)
  const hoursBefore = halfLifeHours * Math.log2(doseMg / thresholdMg);
  const cutoff = new Date(bedtime.getTime() - hoursBefore * 36e5);
  return cutoff;
}

export function CaffeineCutoffCalculator() {
  const [bedtime, setBedtime] = useState("23:00");
  const [drink, setDrink] = useState<DrinkId>("coffee");
  const [customMg, setCustomMg] = useState(100);
  const [sensitivity, setSensitivity] = useState<Sensitivity>("normal");
  const [drinkTime, setDrinkTime] = useState("15:00");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    // default drink time to now for honesty
    const d = nowDate();
    setDrinkTime(
      `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
    );
  }, []);

  const doseMg = drink === "custom" ? customMg : DRINKS[drink].mg;
  const halfLife = HALF_LIFE_HOURS[sensitivity];

  const bedtimeDate = useMemo(() => bedtimeDateFor(bedtime), [bedtime]);

  const cutoff = useMemo(
    () => cutoffTimeFor(bedtimeDate, doseMg, halfLife, SLEEP_THRESHOLD_MG),
    [bedtimeDate, doseMg, halfLife]
  );

  // Caffeine remaining at bedtime if you had this drink at the chosen drinkTime.
  const projected = useMemo(() => {
    const parsed = parseTime(drinkTime);
    if (!parsed) return null;
    const d = new Date();
    d.setHours(parsed.h, parsed.m, 0, 0);
    // If drinkTime is later than bedtimeDate, this is the wrong day combo — skip.
    if (d.getTime() > bedtimeDate.getTime()) return null;
    const hours = hoursBetween(d, bedtimeDate);
    return remainingMg(doseMg, hours, halfLife);
  }, [doseMg, drinkTime, bedtimeDate, halfLife]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Bedtime
          </span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Caffeine sensitivity
          </span>
          <select
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value as Sensitivity)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          >
            <option value="fast">Fast metaboliser — 3.5 hr half-life</option>
            <option value="normal">Normal — 5 hr half-life</option>
            <option value="slow">Slow metaboliser — 7 hr half-life</option>
          </select>
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            If caffeine usually keeps you up, pick Slow.
          </p>
        </label>
      </div>

      {/* Drink */}
      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Your drink</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(DRINKS) as DrinkId[]).map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setDrink(id)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition",
                  drink === id
                    ? "border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100"
                    : "border-surface-200 bg-white text-surface-700 hover:border-indigo-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
                )}
              >
                <span className="font-semibold">{DRINKS[id].label}</span>
                <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">
                  {id === "custom" ? `${customMg} mg` : `${DRINKS[id].mg} mg caffeine`}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {drink === "custom" && (
          <label className="mt-3 block max-w-xs">
            <span className="block text-xs font-semibold text-surface-700 dark:text-surface-200">
              Caffeine amount (mg)
            </span>
            <input
              type="number"
              min={5}
              max={600}
              step={5}
              value={customMg}
              onChange={(e) => setCustomMg(Math.max(5, Math.min(600, Number(e.target.value) || 0)))}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
        )}
      </div>

      {/* Cutoff result */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          Latest safe cutoff
        </p>
        {cutoff ? (
          <>
            <p className="mt-2 text-4xl font-bold text-surface-900 dark:text-white">
              {formatTime(cutoff)}
            </p>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
              Drink your last {doseMg} mg of caffeine by this time and your system should be below
              the sleep-disrupting threshold of {SLEEP_THRESHOLD_MG} mg by bedtime ({formatTime(bedtimeDate)}).
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
            At {doseMg} mg, you're already at or under the {SLEEP_THRESHOLD_MG} mg threshold — drink whenever you like.
          </p>
        )}
      </div>

      {/* Projected at bedtime if you drink at drinkTime */}
      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">
          What if you have it at a specific time?
        </p>
        <label className="mt-2 block max-w-xs">
          <span className="block text-xs font-semibold text-surface-700 dark:text-surface-200">
            Drink time
          </span>
          <input
            type="time"
            value={drinkTime}
            onChange={(e) => setDrinkTime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2 text-base text-surface-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </label>

        {projected !== null && (
          <div
            className={cn(
              "mt-3 rounded-xl border p-4",
              projected > SLEEP_THRESHOLD_MG
                ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
                : "border-success-200 bg-success-50 dark:border-success-500/40 dark:bg-success-500/10"
            )}
          >
            <p className="text-sm font-semibold text-surface-900 dark:text-white">
              About {projected.toFixed(0)} mg still in your system at bedtime
            </p>
            <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
              {projected > SLEEP_THRESHOLD_MG ? (
                <>
                  <AlertTriangle className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Above the {SLEEP_THRESHOLD_MG} mg sleep-disruption threshold. Move your drink earlier or
                  pick a smaller dose.
                </>
              ) : (
                <>Comfortably below the {SLEEP_THRESHOLD_MG} mg threshold — should be fine for sleep.</>
              )}
            </p>
          </div>
        )}
      </div>

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Coffee className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <span>
          Estimates use a single-compartment model with a 5-hour half-life (3.5 hr for fast
          metabolisers, 7 hr for slow). Real metabolism varies with genetics, pregnancy,
          medication and smoking. Treat the cutoff as a starting point, not a prescription.
        </span>
      </p>
    </div>
  );
}
