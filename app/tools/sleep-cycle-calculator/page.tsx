import type { Metadata } from "next";

import { SleepToolkit } from "@/components/sleep-tools/SleepToolkit";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "sleep-cycle-calculator";

const TITLE = "Free Sleep Cycle Calculator, Nap Timer, Caffeine Cutoff & Brown Noise";
const DESCRIPTION =
  "Find the best bedtime by sleep cycle, time a nap, calculate your caffeine cutoff, and play brown noise or other ambient sleep sounds — free, no signup, in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "sleep cycle calculator",
    "bedtime calculator",
    "wake up calculator",
    "what time should I go to bed",
    "90 minute sleep cycle",
    "nap calculator",
    "caffeine cutoff calculator",
    "brown noise",
    "brown noise generator",
    "ambient sound mixer",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Sleep Cycle Calculator, Nap Timer, Caffeine Cutoff & Brown Noise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [sleepToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function SleepCycleCalculatorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <SleepToolShell
        toolId={TOOL_ID}
        title="Sleep Cycle, Nap, Caffeine Cutoff & Sleep Sounds"
        description="Four sleep tools in one: a 90-minute sleep-cycle calculator for bedtime/wake times, a nap timer, a caffeine cutoff calculator, and an ambient sound mixer with brown noise, pink noise, rain and ocean waves."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <SleepToolkit />
      </SleepToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What a sleep cycle actually is</h2>
      <p>
        Sleep is not one continuous state. Across the night your brain moves through repeating cycles
        of light sleep, deep sleep, and REM sleep. Each full cycle takes roughly 90 minutes in
        adults — sometimes 70, sometimes 110, but 90 is a useful average. Waking at the end of a
        cycle, when you&rsquo;re already in lighter sleep, feels dramatically easier than waking
        mid-deep-sleep — the heavy, foggy &ldquo;sleep inertia&rdquo; that ruins a morning. Most adults feel
        best after 5 or 6 complete cycles — 7.5 to 9 hours including the ~14 minutes it takes to
        fall asleep — which the Sleep Cycle tab highlights as the recommended options.
      </p>

      <h2>Napping without the grogginess</h2>
      <p>
        The same 90-minute-cycle logic applies to naps. A 10–20 minute power nap boosts alertness
        without grogginess; a 30-minute recovery nap helps after a short night; a full 90-minute nap
        completes a cycle and ends in light sleep. The Nap Calculator tab picks a length based on
        how much time you have and what you need, steering you away from the 45–80 minute zone
        where most people wake mid-deep-sleep.
      </p>

      <h2>Timing your last cup of caffeine</h2>
      <p>
        Caffeine has an average half-life of about 5 hours, so an afternoon coffee can still be
        active in your system at bedtime. The Caffeine Cutoff tab works backwards from your bedtime
        and your usual drink to find the latest time you can have it while keeping your caffeine
        load below the roughly 50 mg threshold associated with disrupted sleep.
      </p>

      <h2>Brown noise and other ambient sleep sounds</h2>
      <p>
        The Sleep Sounds tab mixes five procedurally-generated tracks — brown noise, pink noise,
        white noise, a rain-like texture, and slow ocean swells — synthesised live via the Web
        Audio API. Brown noise in particular is a favourite for sleep, deep focus, and tinnitus
        relief because its low, even spectrum masks sharp environmental sounds without the harsh
        hiss of white noise. A built-in sleep timer fades the mix out gently instead of cutting off.
      </p>

      <h2>What these tools can&rsquo;t tell you</h2>
      <p>
        Sleep cycles and caffeine metabolism vary from person to person — the calculators use solid
        population averages, not a measurement of your own physiology. If a suggested bedtime or
        cutoff leaves you groggy, adjust by 10–15 minutes and track what actually works for you
        over a week or two.
      </p>
    </article>
  );
}
