import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DesignToolShell } from "@/components/design-tools/DesignToolShell";
import { ContrastChecker } from "@/components/design-tools/ContrastChecker";
import { designToolOgUrl, getDesignFaqs } from "@/lib/designFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "contrast-checker";
const TITLE = "Free Colour Contrast Checker — WCAG AA & AAA";
const DESCRIPTION =
  "Check colour contrast against WCAG 2.1 free in your browser. See the contrast ratio and AA/AAA pass-fail for normal and large text, with a live preview.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["contrast checker", "wcag contrast", "color contrast", "accessibility checker", "aa aaa contrast"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: designToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Contrast Checker" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function ContrastCheckerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DesignToolShell
        toolId={TOOL_ID}
        title="Contrast Checker"
        description="Pick a text colour and a background colour. The WCAG 2.1 contrast ratio and AA/AAA pass-fail badges update instantly, with a live text preview."
        faqItems={getDesignFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>What the ratios mean</h2>
            <p>
              Contrast ratio ranges from 1:1 (identical colours) to 21:1 (pure black on pure
              white). WCAG 2.1 sets the bar at <strong>4.5:1</strong> for normal text and{" "}
              <strong>3:1</strong> for large text (18.66px bold, or 24px and up) to pass{" "}
              <strong>AA</strong> — the level most accessibility laws require. <strong>AAA</strong>{" "}
              raises it to 7:1 and 4.5:1 respectively.
            </p>
            <h2>Why it matters</h2>
            <p>
              Roughly one in twelve men and one in two hundred women have some colour-vision
              deficiency, and far more people read on bright screens outdoors or with ageing eyes.
              Meeting AA contrast isn&apos;t just compliance — it measurably improves readability
              for everyone.
            </p>
          </article>
        }
      >
        <ContrastChecker />
      </DesignToolShell>
    </>
  );
}
