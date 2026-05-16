import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { StudentToolShell } from "@/components/student-tools/StudentToolShell";
import { StudyTimer } from "@/components/student-tools/StudyTimer";
import { getStudentFaqs, studentToolOgUrl } from "@/lib/studentFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "study-timer";
const TITLE = "Free Study Timer — Track Study Sessions by Subject";
const DESCRIPTION =
  "A free flexible study timer. Start and stop per subject, log how long you studied, and see your daily total. Saved locally, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["study timer", "study tracker", "study session timer", "online study timer", "homework timer"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: studentToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Study Timer" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function StudyTimerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <StudentToolShell
        toolId={TOOL_ID}
        title="Study Timer"
        description="A flexible study stopwatch. Label what you're studying, start the timer, and log each session — the daily log shows total study time per subject."
        faqItems={getStudentFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>A study timer, not a Pomodoro timer</h2>
            <p>
              The Pomodoro technique uses fixed 25-minute work blocks. That&apos;s great for some
              tasks — but reading a dense chapter, working through a problem set, or writing an
              essay rarely fits a rigid cycle. This study timer is a simple stopwatch: study for
              as long as the work needs, then log the session. Over a day it builds an honest
              picture of where your time actually went.
            </p>
            <h2>Why log by subject</h2>
            <p>
              Tagging each session with a subject turns the timer into a study journal. At a
              glance you can see you spent two hours on chemistry and twenty minutes on history —
              which is usually the first step to rebalancing how you revise. The log resets each
              day and is stored only in your browser.
            </p>
          </article>
        }
      >
        <StudyTimer />
      </StudentToolShell>
    </>
  );
}
