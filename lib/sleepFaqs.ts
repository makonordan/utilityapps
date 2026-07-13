/**
 * Per-tool metadata for the merged Sleep Cycle Calculator toolkit (Sleep
 * Cycle + Nap + Caffeine Cutoff + Ambient Sound Mixer), now filed under
 * Health Tools. Mirrors lib/pdfFaqs.ts so the rendered FAQ matches the
 * JSON-LD schema exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type SleepToolId = "sleep-cycle-calculator";

export interface HowToStep {
  name: string;
  text: string;
}

export const SLEEP_FAQS: Record<SleepToolId, FAQItem[]> = {
  "sleep-cycle-calculator": [
    {
      q: "How does the sleep cycle calculator work?",
      a: "It assumes 90-minute sleep cycles plus about 14 minutes to fall asleep. From a target wake time it works backwards to suggest bedtimes that align with whole cycles, so you wake at the end of a cycle rather than mid-deep-sleep. Most adults feel best after 5 or 6 complete cycles — the calculator highlights both as recommended.",
    },
    {
      q: "What length of nap is best?",
      a: "It depends on your goal. A 10–20 minute power nap boosts alertness without grogginess. A 30-minute recovery nap helps after lost sleep. A full 90-minute cycle restores deep sleep and REM. The Nap Calculator tab picks one based on your time available and goal, avoiding the 45–80 minute zone where most people wake mid-deep-sleep.",
    },
    {
      q: "What is a safe caffeine cutoff time?",
      a: "Caffeine has an average half-life of about 5 hours (3.5 hr for fast metabolisers, 7 hr for slow). The Caffeine Cutoff tab works backwards from your bedtime and usual drink to find the latest time you can have it while staying below the roughly 50 mg threshold linked to sleep disruption.",
    },
    {
      q: "What is brown noise, and why is it good for sleep?",
      a: "Brown noise (also called red or Brownian noise) is a low-frequency-weighted random sound with a deep, rumbling quality — favoured for sleep, focus, and tinnitus relief because its even low spectrum masks sharp environmental sounds without the harsh hiss of white noise. It's one of five tracks in the Sleep Sounds tab, generated live in your browser with the Web Audio API.",
    },
    {
      q: "Can I mix multiple ambient sounds together?",
      a: "Yes — the Sleep Sounds tab mixes five procedurally generated tracks (white, pink, and brown noise, plus rain and ocean waves) with independent volume sliders, so you can blend your own soundscape rather than picking just one.",
    },
    {
      q: "Does the sleep timer fade the audio out?",
      a: "Yes. Set a 10, 30, 60, or 90 minute timer and the mix fades out gently over the last 30 seconds instead of cutting off abruptly.",
    },
    {
      q: "Is anything sent to a server?",
      a: "No. All calculations and audio generation happen in your browser — nothing about your sleep schedule, naps, caffeine habits, or sound preferences is sent anywhere.",
    },
  ],
};

export const SLEEP_HOWTOS: Record<SleepToolId, HowToStep[]> = {
  "sleep-cycle-calculator": [
    { name: "Pick a tab", text: "Choose Sleep Cycle, Nap Calculator, Caffeine Cutoff, or Sleep Sounds." },
    { name: "Enter your details", text: "A wake time or bedtime, your available nap time, or your usual caffeine drink — each tab asks for just what it needs." },
    { name: "Read the result or press play", text: "Calculators return times aligned to sleep science; Sleep Sounds starts mixing ambient tracks with an optional fade-out timer." },
  ],
};

export const SLEEP_FEATURE_LISTS: Record<SleepToolId, string> = {
  "sleep-cycle-calculator":
    "90-minute cycle calculator, nap length recommender, caffeine cutoff calculator (5-hour half-life model), 5-track ambient sound mixer with brown noise and sleep timer, mobile-friendly, runs entirely in the browser",
};

export const SLEEP_TOOL_PUBLISHED = "2026-05-23";

export function getSleepFaqs(toolId: string): FAQItem[] {
  return SLEEP_FAQS[toolId as SleepToolId] ?? [];
}

export function getSleepHowTo(toolId: string): HowToStep[] {
  return SLEEP_HOWTOS[toolId as SleepToolId] ?? [];
}

export function getSleepFeatureList(toolId: string): string {
  return SLEEP_FEATURE_LISTS[toolId as SleepToolId] ?? "";
}

export function sleepToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
    type: "sleep-tool",
  });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
