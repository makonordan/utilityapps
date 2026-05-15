import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DesignToolShell } from "@/components/design-tools/DesignToolShell";
import { CssShadowBuilder } from "@/components/design-tools/CssShadowBuilder";
import { designToolOgUrl, getDesignFaqs } from "@/lib/designFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "css-shadow-builder";
const TITLE = "Free CSS Box-Shadow Generator — Multi-Layer, Inset Support";
const DESCRIPTION =
  "Build CSS box-shadows free in your browser. Stack multiple layers, inset support, X/Y/blur/spread sliders, live preview, copy-ready CSS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["css shadow generator", "box shadow generator", "box-shadow css", "shadow builder", "css drop shadow"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: designToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "CSS Shadow Builder" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function CssShadowBuilderPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DesignToolShell
        toolId={TOOL_ID}
        title="CSS Shadow Builder"
        description="Design box-shadows with sliders for offset, blur, spread, colour, and opacity. Stack multiple layers for realistic depth — the CSS updates live."
        faqItems={getDesignFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Why layer your shadows</h2>
            <p>
              Real objects don&apos;t cast a single flat shadow. The most convincing UI depth
              comes from stacking two or three box-shadow layers: a tight, dark one close to the
              element for the contact shadow, plus a wider, softer, lighter one for ambient
              spread. CSS lets you comma-separate as many layers as you like.
            </p>
            <h2>Offset, blur, spread</h2>
            <p>
              <strong>Offset</strong> (X/Y) moves the shadow — usually a small positive Y for a
              shadow cast downward. <strong>Blur</strong> softens the edge; bigger blur reads as a
              light further away. <strong>Spread</strong> grows or shrinks the shadow before the
              blur — a slight negative spread keeps soft shadows from bleeding too far.
              <strong> Inset</strong> flips the shadow inward for pressed or recessed effects.
            </p>
          </article>
        }
      >
        <CssShadowBuilder />
      </DesignToolShell>
    </>
  );
}
