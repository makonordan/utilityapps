import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { StudentToolShell } from "@/components/student-tools/StudentToolShell";
import { CitationGenerator } from "@/components/student-tools/CitationGenerator";
import { getStudentFaqs, studentToolOgUrl } from "@/lib/studentFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "citation-generator";
const TITLE = "Free Citation Generator — APA, MLA & Chicago";
const DESCRIPTION =
  "Generate APA 7, MLA 9, and Chicago citations free in your browser. Cite websites, books, and journal articles. No signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["citation generator", "apa citation", "mla citation", "chicago citation", "reference generator", "bibliography generator"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: studentToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Citation Generator" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function CitationGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <StudentToolShell
        toolId={TOOL_ID}
        title="Citation Generator"
        description="Fill in the source details once and get APA 7, MLA 9, and Chicago citations side by side. Cite websites, books, or journal articles."
        faqItems={getStudentFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Three styles, one form</h2>
            <p>
              <strong>APA</strong> is standard in the sciences and social sciences,{" "}
              <strong>MLA</strong> in the humanities and literature, and <strong>Chicago</strong>{" "}
              in history and some publishing. They differ in author formatting, where the date
              sits, and punctuation — this tool handles all three from a single set of inputs so
              you can paste whichever your assignment requires.
            </p>
            <h2>Always verify</h2>
            <p>
              This generator nails the common case, but citation styles have many edge rules —
              multiple authors, corporate authors, editions, missing dates, DOIs. Treat the output
              as a fast, accurate first draft and double-check anything unusual against your
              course style guide.
            </p>
          </article>
        }
      >
        <CitationGenerator />
      </StudentToolShell>
    </>
  );
}
