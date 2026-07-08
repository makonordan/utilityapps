import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { StudentToolShell } from "@/components/student-tools/StudentToolShell";
import { ParaphrasingTool } from "@/components/student-tools/ParaphrasingTool";
import { getStudentFaqs, studentToolOgUrl } from "@/lib/studentFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "paraphrasing-tool";
const TITLE = "Free Paraphrasing Tool — Reword Your Writing Online";
const DESCRIPTION =
  "A free browser-side paraphrasing tool that rewords your own sentences with synonym substitution. A writing aid for clearer, less repetitive prose. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["paraphrasing tool", "paraphraser", "reword text", "rewrite sentences", "sentence rephraser"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: studentToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Paraphrasing Tool" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function ParaphrasingToolPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <StudentToolShell
        toolId={TOOL_ID}
        title="Paraphrasing Tool"
        description="Reword your own sentences with synonym substitution — a writing aid for when a sentence feels clunky or repetitive. Review and edit the result before using it."
        faqItems={getStudentFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>What paraphrasing is — and isn't</h2>
            <p>
              Paraphrasing means restating an idea in your own words. It&apos;s a legitimate,
              everyday writing skill — useful when your own draft is wordy, repetitive, or
              awkward. What it is <em>not</em> is a way to take someone else&apos;s work, reword
              it, and submit it as your own. That&apos;s plagiarism whether you change every word
              or none. If an idea isn&apos;t yours, cite it.
            </p>
            <h2>How this tool works</h2>
            <p>
              It runs entirely in your browser using a built-in thesaurus, swapping common words
              for synonyms while preserving capitalisation. Because there&apos;s no AI involved,
              it&apos;s instant and private — but also basic. A synonym swap can subtly shift
              meaning or tone, so always read the output and edit it into a sentence you&apos;d
              actually write.
            </p>
          </article>
        }
      >
        <ParaphrasingTool />
      </StudentToolShell>
    </>
  );
}
