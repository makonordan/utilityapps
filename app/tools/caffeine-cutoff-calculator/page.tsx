import type { Metadata } from "next";

import { CaffeineCutoffCalculator } from "@/components/sleep-tools/CaffeineCutoffCalculator";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "caffeine-cutoff-calculator";

const TITLE = "Caffeine Cutoff Calculator — Last Coffee Time for Better Sleep";
const DESCRIPTION =
  "Find your latest safe coffee time and the caffeine left at bedtime, based on a 5-hour caffeine half-life.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "caffeine calculator",
    "caffeine half life",
    "last coffee time",
    "caffeine cutoff",
    "how long does caffeine last",
    "caffeine and sleep",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Caffeine Cutoff Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [sleepToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function CaffeineCutoffCalculatorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <SleepToolShell
        toolId={TOOL_ID}
        title="Caffeine Cutoff Calculator"
        description="Tell the calculator your bedtime and your drink — it returns the latest time you can have that coffee, tea or energy drink while keeping the caffeine left in your system below the sleep-disrupting threshold."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CaffeineCutoffCalculator />
      </SleepToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>How caffeine actually keeps you awake</h2>
      <p>
        Throughout the day, a chemical called adenosine builds up in your brain. Adenosine binds to
        receptors that make you feel sleepy. Caffeine has a near-identical shape and blocks those
        receptors — your brain still produces adenosine, but it can't bind, so you don't feel the
        accumulated sleep pressure. The moment the caffeine clears, all that adenosine binds at once
        and you crash.
      </p>

      <h2>The 5-hour half-life</h2>
      <p>
        Caffeine has an average half-life of about 5 hours in healthy adults. That means if you
        drink a 100 mg coffee at 3pm, around 50 mg is still in you at 8pm and 25 mg at 1am. The
        calculator uses this exponential decay to find the latest time you can drink without leaving
        too much caffeine in your system at bedtime.
      </p>

      <h2>Why slow metabolisers should be especially careful</h2>
      <p>
        Caffeine metabolism varies enormously between people, mostly because of a liver enzyme
        called CYP1A2. Slow metabolisers — about half the population — can hold caffeine for 7+
        hours. Pregnant women metabolise it even more slowly. People who quit smoking suddenly find
        their tolerance crashes because nicotine sped up their metabolism. If caffeine routinely
        wrecks your sleep, set your personal cutoff at least a few hours earlier than the generic
        recommendation.
      </p>

      <h2>The 50 mg threshold</h2>
      <p>
        Studies find that even modest amounts of caffeine at bedtime — around 50 mg — measurably
        reduce sleep efficiency, delay sleep onset and cut deep sleep. That's why the calculator
        targets keeping you under 50 mg of caffeine remaining when you go to bed, not zero. If
        you're particularly sensitive, treat the recommended cutoff as a ceiling and aim earlier.
      </p>
    </article>
  );
}
