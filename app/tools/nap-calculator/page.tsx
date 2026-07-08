import type { Metadata } from "next";

import { NapCalculator } from "@/components/sleep-tools/NapCalculator";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "nap-calculator";

const TITLE = "Free Nap Calculator — Power, Recovery & Full-Cycle Naps";
const DESCRIPTION =
  "Find the right nap length and wake-up time based on your available time and goal. Free, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "nap calculator",
    "power nap timer",
    "best nap length",
    "90 minute nap",
    "20 minute nap",
    "recovery nap",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Nap Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [sleepToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function NapCalculatorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <SleepToolShell
        toolId={TOOL_ID}
        title="Nap Calculator"
        description="Pick how much time you have and what you need from the nap — alertness, recovery, or full restoration — and the calculator returns the recommended length and wake time."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <NapCalculator />
      </SleepToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The three nap lengths that work</h2>
      <p>
        Naps come in roughly three useful sizes. A <strong>power nap</strong> of 10–20 minutes keeps
        you in light sleep — you wake quickly with a noticeable boost in alertness, attention and
        mood. A <strong>recovery nap</strong> of about 30 minutes adds some deeper sleep; you trade
        a little grogginess for genuine recovery after a poor night. A <strong>full-cycle nap</strong>
        of 90 minutes completes a whole sleep cycle and ends in lighter sleep again, so waking is
        easy and restoration is the most complete.
      </p>

      <h2>The nap length to avoid</h2>
      <p>
        Anywhere between roughly 45 and 80 minutes is the worst zone — you wake mid-deep-sleep, your
        brain takes 20–30 minutes to clear the fog, and you feel worse than before. If you can't fit
        a full 90-minute nap, keep it to 30 minutes or under.
      </p>

      <h2>When to nap</h2>
      <p>
        The natural afternoon dip in alertness, around 1pm–3pm, is the easiest window. Napping later
        than about 4pm starts to push back your night-time sleep, especially if it's longer than 20
        minutes. If your evenings are already short on sleep, push the nap earlier or skip it.
      </p>

      <h2>The coffee nap trick</h2>
      <p>
        Drink a coffee right before lying down for a 20-minute nap. Caffeine takes about 20–30
        minutes to reach peak effect, so it arrives just as your alarm goes off — combining the
        alertness boost of the nap with the kick of the caffeine. It only works for short naps, and
        only if you can actually fall asleep with caffeine in your stomach.
      </p>
    </article>
  );
}
