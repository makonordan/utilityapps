import type { Metadata } from "next";

import { SleepCycleCalculator } from "@/components/sleep-tools/SleepCycleCalculator";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "sleep-cycle-calculator";

const TITLE = "Free Sleep Cycle Calculator — Best Bedtime & Wake Times";
const DESCRIPTION =
  "Find the best bedtime or wake-up time aligned to 90-minute sleep cycles. Free, no signup, runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "sleep cycle calculator",
    "bedtime calculator",
    "wake up calculator",
    "what time should I go to bed",
    "90 minute sleep cycle",
    "sleep calculator",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Sleep Cycle Calculator" }],
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
        title="Sleep Cycle Calculator"
        description="Enter a wake-up time and see the bedtimes that align with whole 90-minute sleep cycles — or pick a bedtime and see the right wake-up times. Built around 5 or 6 complete cycles for adult sleep."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <SleepCycleCalculator />
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
        cycle, when you're already in lighter sleep, feels dramatically easier than waking
        mid-deep-sleep — the heavy, foggy &ldquo;sleep inertia&rdquo; that ruins a morning.
      </p>

      <h2>Why this calculator works backwards</h2>
      <p>
        Most people set their alarm and then go to bed whenever they happen to. If that bedtime
        falls mid-cycle, the alarm catches you in deep sleep. By working backwards from your wake
        time in 90-minute steps, the calculator suggests bedtimes that finish a clean number of
        cycles, so the alarm catches you in light sleep instead.
      </p>

      <h2>How many cycles should you actually aim for?</h2>
      <p>
        Most adults feel best after 5 or 6 complete cycles — that's 7.5 to 9 hours of sleep,
        including the 14 minutes most people take to fall asleep. The calculator highlights those as
        the recommended options. Four cycles (6 hours) is a survival minimum for the odd late night;
        seven (10.5 hours) is for genuine catch-up after a deficit.
      </p>

      <h2>What this calculator can't tell you</h2>
      <p>
        Sleep cycles vary from person to person — 70 to 110 minutes is normal. The calculator
        assumes the average. If you wake groggy at one of the suggested times, your cycles are
        probably a bit shorter or longer than 90 minutes; shift the bedtime by 10–15 minutes and try
        again for a week. Track which timing actually works for you.
      </p>
    </article>
  );
}
