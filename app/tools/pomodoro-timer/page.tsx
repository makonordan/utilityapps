import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { PomodoroTimer } from "@/components/productivity-tools/PomodoroTimer";
import { ProductivityToolShell } from "@/components/productivity-tools/ProductivityToolShell";
import { getProductivityFaqs, productivityToolOgUrl } from "@/lib/productivityFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "pomodoro-timer";

const TITLE = "Free Pomodoro Timer Online — 25/5 Focus Timer with Task Log";
const DESCRIPTION =
  "A free online Pomodoro timer with a built-in task log. Customise work, short break, and long break durations. Sound + desktop notifications. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "pomodoro timer",
    "online pomodoro",
    "focus timer",
    "25 minute timer",
    "study timer",
    "pomodoro technique",
    "tomato timer",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: productivityToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Pomodoro Timer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [productivityToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PomodoroTimerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ProductivityToolShell
        toolId={TOOL_ID}
        title="Pomodoro Timer"
        description="Focus in 25-minute intervals separated by short breaks. Built-in task log tracks how many Pomodoros each task takes. Settings saved locally — close and come back."
        faqItems={getProductivityFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <PomodoroTimer />
      </ProductivityToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>How the Pomodoro Technique works</h2>
      <p>
        The technique was developed in the late 1980s by Francesco Cirillo,
        named after the tomato-shaped kitchen timer he used as a student. The
        rules are simple: pick a task, work on only that task for 25 minutes
        without interruption, take a 5-minute break, and repeat. After four
        intervals, take a longer 15–30 minute break.
      </p>

      <h2>Why it works</h2>
      <p>
        Three reasons. First, the strict time-box reduces decision fatigue —
        you don't have to decide whether you're tired or want to switch tasks,
        you just commit to 25 more minutes. Second, the upcoming break makes
        focused work feel finite, which is psychologically much easier than
        "work until done". Third, the task log forces honest estimates: when
        you see a "30 minute" task actually took six Pomodoros, your future
        estimates calibrate fast.
      </p>

      <h2>Customising the intervals</h2>
      <p>
        25 / 5 / 15 is the classic, but the technique works at almost any
        ratio that respects the principle of focused work followed by short
        recovery. Programmers who need deep concentration often use 50 / 10
        intervals; designers and writers who want frequent context switches
        sometimes prefer 15 / 3. Open Settings and adjust to whatever
        rhythm matches the work you're doing.
      </p>

      <h2>Privacy and data</h2>
      <p>
        Your tasks and Pomodoro counts are stored only in your browser's local
        storage on this device — nothing is sent to a server. Clearing browser
        data wipes them. The timer itself uses absolute timestamps so it stays
        accurate even when the browser throttles a background tab.
      </p>
    </article>
  );
}
