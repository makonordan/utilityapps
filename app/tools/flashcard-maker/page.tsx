import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { StudentToolShell } from "@/components/student-tools/StudentToolShell";
import { FlashcardMaker } from "@/components/student-tools/FlashcardMaker";
import { getStudentFaqs, studentToolOgUrl } from "@/lib/studentFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "flashcard-maker";
const TITLE = "Free Flashcard Maker — Create & Study Decks Online";
const DESCRIPTION =
  "Make flashcard decks free in your browser. Flip-card study mode, known/learning tracking, JSON export and import. Saved locally, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["flashcard maker", "flashcards online", "study flashcards", "create flashcards", "flashcard app"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: studentToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Flashcard Maker" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function FlashcardMakerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <StudentToolShell
        toolId={TOOL_ID}
        title="Flashcard Maker"
        description="Build flashcard decks, then study them with a flip-card mode that tracks what you know and what you're still learning. Decks are saved in your browser and export to a file."
        faqItems={getStudentFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Why flashcards work</h2>
            <p>
              Flashcards leverage two of the best-evidenced learning techniques: <em>active
              recall</em> (forcing yourself to retrieve an answer rather than re-reading it) and
              <em> spaced repetition</em> (revisiting cards you find hard more often). The
              question-then-flip format on this tool is built around active recall — you commit
              to an answer before you reveal it.
            </p>
            <h2>Your decks, your data</h2>
            <p>
              Decks are stored in your browser&apos;s local storage on this device. They survive
              refreshes and revisits, but they aren&apos;t synced anywhere — so for anything
              important, use Export to save the deck as a JSON file. You can import that file on
              another device or keep it as a backup.
            </p>
          </article>
        }
      >
        <FlashcardMaker />
      </StudentToolShell>
    </>
  );
}
