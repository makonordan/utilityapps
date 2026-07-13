"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Bed, Coffee, Music } from "lucide-react";

import { cn } from "@/lib/utils";
import { AmbientSoundMixer } from "./AmbientSoundMixer";
import { CaffeineCutoffCalculator } from "./CaffeineCutoffCalculator";
import { NapCalculator } from "./NapCalculator";
import { SleepCycleCalculator } from "./SleepCycleCalculator";

type Tab = "cycle" | "nap" | "caffeine" | "sounds";

const TABS: { id: Tab; label: string; icon: typeof AlarmClock }[] = [
  { id: "cycle", label: "Sleep Cycle", icon: AlarmClock },
  { id: "nap", label: "Nap Calculator", icon: Bed },
  { id: "caffeine", label: "Caffeine Cutoff", icon: Coffee },
  { id: "sounds", label: "Sleep Sounds", icon: Music },
];

const TAB_QUERY_VALUES: Record<string, Tab> = {
  nap: "nap",
  caffeine: "caffeine",
  sounds: "sounds",
};

export function SleepToolkit() {
  const [tab, setTab] = useState<Tab>("cycle");

  // Deep-link support for redirected URLs, e.g.
  // /tools/sleep-cycle-calculator?tab=sounds (from the old brown-noise-generator
  // and ambient-sound-mixer URLs).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tab");
    if (requested && requested in TAB_QUERY_VALUES) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab(TAB_QUERY_VALUES[requested]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Sleep toolkit mode"
        className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800 sm:grid-cols-4"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition",
              tab === t.id
                ? "bg-white text-indigo-700 shadow-sm dark:bg-surface-950 dark:text-indigo-300"
                : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cycle" && <SleepCycleCalculator />}
      {tab === "nap" && <NapCalculator />}
      {tab === "caffeine" && <CaffeineCutoffCalculator />}
      {tab === "sounds" && <AmbientSoundMixer />}
    </div>
  );
}
