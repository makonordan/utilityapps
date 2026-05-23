/**
 * Per-tool metadata for the new in-house Sleep Tools. Mirrors lib/productivityFaqs
 * so the rendered FAQ matches the JSON-LD schema exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type SleepToolId =
  | "sleep-cycle-calculator"
  | "nap-calculator"
  | "caffeine-cutoff-calculator"
  | "brown-noise-generator"
  | "ambient-sound-mixer";

export interface HowToStep {
  name: string;
  text: string;
}

export const SLEEP_FAQS: Record<SleepToolId, FAQItem[]> = {
  "sleep-cycle-calculator": [
    {
      q: "How does the sleep cycle calculator work?",
      a: "It assumes 90-minute sleep cycles plus about 14 minutes to fall asleep. From a target wake time it works backwards to suggest bedtimes that align with whole cycles, so you wake at the end of a cycle rather than mid-deep-sleep.",
    },
    {
      q: "Why 90-minute cycles?",
      a: "A full sleep cycle — light sleep, deep sleep, then REM — averages roughly 90 minutes for adults. Cycles vary between 70 and 110 minutes from person to person, so the result is a good starting point, not a precise prescription.",
    },
    {
      q: "How many sleep cycles should I aim for?",
      a: "Most adults feel best after 5 or 6 complete cycles, which is 7.5 to 9 hours including fall-asleep time. The calculator highlights both as the recommended options.",
    },
    {
      q: "Why does the tool add 14 minutes to fall asleep?",
      a: "It's the average time a healthy adult takes to fall asleep. Setting the bedtime 14 minutes earlier than the cycle start means your first cycle begins close to when you actually intend to wake.",
    },
    {
      q: "Is anything sent to a server?",
      a: "No. All calculations happen in your browser. Nothing about your sleep schedule is sent anywhere.",
    },
  ],

  "nap-calculator": [
    {
      q: "What length of nap is best?",
      a: "It depends on your goal. A 10–20 minute power nap boosts alertness without grogginess. A 30-minute recovery nap helps after lost sleep. A full 90-minute cycle restores deep sleep and REM. The calculator picks one based on your time available and goal.",
    },
    {
      q: "Why does a 60-minute nap feel worse than a 90-minute one?",
      a: "At around 60 minutes you usually wake mid-deep-sleep, which causes 'sleep inertia' — that heavy, foggy feeling. A 90-minute nap completes a full cycle and ends in lighter sleep, so waking is much easier.",
    },
    {
      q: "When is the best time of day to nap?",
      a: "Most people get the strongest benefit between roughly 1pm and 3pm, during the natural post-lunch dip in alertness. Napping much later than 3pm risks pushing back your night-time sleep.",
    },
    {
      q: "How long before the nap kicks in?",
      a: "Plan an extra 5–15 minutes to fall asleep, on top of the nap length itself. The calculator factors this in when it shows the recommended wake time.",
    },
    {
      q: "Will a nap help if I didn't sleep enough last night?",
      a: "Yes. A short nap can claw back alertness, mood and reaction time. It won't fully replace lost night-time sleep, but it makes the day after a short night much more manageable.",
    },
  ],

  "caffeine-cutoff-calculator": [
    {
      q: "Why does caffeine affect sleep so much?",
      a: "Caffeine blocks adenosine, the chemical that builds sleep pressure during the day. If caffeine is still in your system at bedtime, your body has a harder time recognising that it's tired — leading to longer time to fall asleep and lighter, less restorative sleep.",
    },
    {
      q: "How long does caffeine stay in the body?",
      a: "Caffeine has an average half-life of about 5 hours in healthy adults — half is gone after 5 hours, three-quarters after 10. The calculator uses this 5-hour half-life to estimate how much remains at your bedtime.",
    },
    {
      q: "What is a safe caffeine cutoff time?",
      a: "A common rule is to stop at least 6–8 hours before bed. The calculator finds a cutoff that keeps the caffeine remaining at bedtime below about 50 mg, the rough threshold for noticeable sleep disruption.",
    },
    {
      q: "How much caffeine is in common drinks?",
      a: "A standard brewed coffee has roughly 95 mg per 240 ml cup, an espresso shot about 63 mg, a strong black tea 50 mg, a cola 30 mg, and an energy drink 80–150 mg per can.",
    },
    {
      q: "Are some people more sensitive to caffeine than others?",
      a: "Yes — caffeine metabolism varies a lot. Slow metabolisers (often due to a CYP1A2 gene variant), pregnant women, smokers quitting, and people on certain medications all process caffeine more slowly. If sleep suffers, set your personal cutoff earlier than the generic recommendation.",
    },
  ],

  "brown-noise-generator": [
    {
      q: "What is brown noise?",
      a: "Brown noise (also called red noise or Brownian noise) is a low-frequency-weighted random sound. It drops about 6 dB per octave, which gives it a much deeper, rumbling quality than white or pink noise — more like distant thunder or a strong waterfall.",
    },
    {
      q: "Why is brown noise good for sleep and focus?",
      a: "Its low, even spectrum masks sharp environmental sounds without the harsh hiss of white noise. Many people find this easier to fall asleep to and easier to keep on in the background while working.",
    },
    {
      q: "Is the noise generated live or streamed from a file?",
      a: "Generated live in your browser using the Web Audio API. Nothing streams, nothing downloads, and there is no looping artefact — the audio is produced sample by sample.",
    },
    {
      q: "Does the sleep timer fade the audio?",
      a: "Yes. When you enable the sleep timer, the noise gradually fades out over the last 30 seconds before stopping, so it doesn't cut off abruptly.",
    },
    {
      q: "Will this work offline?",
      a: "Once the page is loaded, audio plays entirely client-side. You can disconnect from the internet and the generator keeps running.",
    },
  ],

  "ambient-sound-mixer": [
    {
      q: "What sounds can I mix?",
      a: "Five procedurally generated tracks: white noise, pink noise, brown noise, a rain-like high-band shimmer, and slow ocean-wave swells. Independent volume sliders for every track.",
    },
    {
      q: "Are any audio files downloaded?",
      a: "None. Every track is synthesised live in the browser using the Web Audio API, so the page weighs almost nothing and the sound plays even offline.",
    },
    {
      q: "How is the rain track made if there are no recordings?",
      a: "It's white noise routed through a bandpass filter centred near 1.5 kHz and shaped by gentle amplitude modulation — close enough to steady rain to be relaxing without any sample-loop artefacts.",
    },
    {
      q: "Does the sleep timer apply to all tracks?",
      a: "Yes — the timer fades the master output, so every active track tapers off together. You can set 10, 30, 60 or 90 minutes.",
    },
    {
      q: "Will the audio play in the background if I switch tabs?",
      a: "On most desktop browsers, yes. On mobile, browsers often pause Web Audio when you leave the tab — that is a platform limitation, not a tool one.",
    },
  ],
};

export const SLEEP_HOWTOS: Record<SleepToolId, HowToStep[]> = {
  "sleep-cycle-calculator": [
    { name: "Pick a mode", text: "Choose whether you want suggested bedtimes for a target wake time, or suggested wake times for a chosen bedtime." },
    { name: "Enter your time", text: "Type the wake time or bedtime that's fixed for you tomorrow." },
    { name: "Read the results", text: "The calculator shows several options aligned to complete 90-minute cycles. Pick the one that gives you 5 or 6 cycles for the best balance of rest and feasibility." },
  ],
  "nap-calculator": [
    { name: "Enter your available time", text: "Type how many minutes you have free for the nap, including fall-asleep time." },
    { name: "Pick a goal", text: "Choose whether you need alertness (power nap), recovery from lost sleep, or full restoration (cycle nap)." },
    { name: "Set an alarm", text: "Use the recommended wake time as your alarm so you don't oversleep into deep-sleep grogginess." },
  ],
  "caffeine-cutoff-calculator": [
    { name: "Enter your bedtime", text: "Type your usual bedtime — the calculator works backwards from there." },
    { name: "Pick your typical drink", text: "Select coffee, tea, energy drink or enter a custom milligram amount for your last caffeine of the day." },
    { name: "Read the cutoff", text: "The tool returns the latest time you can have that drink while keeping your caffeine load below sleep-disrupting levels at bedtime." },
  ],
  "brown-noise-generator": [
    { name: "Press play", text: "Click the play button to start the generator. The first click also unlocks audio for your browser." },
    { name: "Adjust the volume", text: "Use the slider to set a comfortable level. Brown noise should be quiet enough to feel ambient, not loud enough to mask conversation." },
    { name: "Set the sleep timer", text: "Pick a duration — the audio will fade out gently as it ends so it doesn't snap off." },
  ],
  "ambient-sound-mixer": [
    { name: "Press master play", text: "Click play to start the mixer. All tracks share a single audio engine." },
    { name: "Bring up the tracks you want", text: "Each slider controls one track's volume. Leave the others at zero or muted." },
    { name: "Set the sleep timer (optional)", text: "Enable the timer to fade the master output to silence after 10, 30, 60 or 90 minutes." },
  ],
};

export const SLEEP_FEATURE_LISTS: Record<SleepToolId, string> = {
  "sleep-cycle-calculator":
    "90-minute cycle calculation, bedtime and wake-time modes, fall-asleep buffer, recommended cycle highlight, mobile-friendly",
  "nap-calculator":
    "Power, recovery and cycle nap recommendations, time-available input, wake-time output, sleep-inertia guidance",
  "caffeine-cutoff-calculator":
    "5-hour half-life model, preset drink amounts, custom milligram input, bedtime-targeted cutoff, milligrams remaining at bedtime",
  "brown-noise-generator":
    "Live Web Audio generation, volume control, sleep timer with fade-out, no downloads, works offline",
  "ambient-sound-mixer":
    "Five synthesised ambient tracks, per-track volume, master sleep timer with fade, runs entirely in the browser",
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
