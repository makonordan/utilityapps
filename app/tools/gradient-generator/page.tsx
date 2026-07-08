import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DesignToolShell } from "@/components/design-tools/DesignToolShell";
import { GradientGenerator } from "@/components/design-tools/GradientGenerator";
import { designToolOgUrl, getDesignFaqs } from "@/lib/designFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "gradient-generator";
const TITLE = "Free CSS Gradient Generator — Linear, Radial & Conic";
const DESCRIPTION =
  "Build CSS gradients free in your browser. Linear, radial, and conic with unlimited colour stops, angle control, live preview, and copy-ready CSS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["gradient generator", "css gradient", "linear gradient", "radial gradient", "conic gradient"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: designToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Gradient Generator" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function GradientGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DesignToolShell
        toolId={TOOL_ID}
        title="Gradient Generator"
        description="Design linear, radial, and conic CSS gradients with unlimited colour stops. The preview and copy-ready CSS update live as you edit."
        faqItems={getDesignFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Linear, radial, conic</h2>
            <p>
              <strong>Linear</strong> gradients blend along a straight line at the angle you set —
              the workhorse for backgrounds and buttons. <strong>Radial</strong> gradients radiate
              out from a centre point, good for spotlights and soft vignettes.{" "}
              <strong>Conic</strong> gradients sweep around a centre like a colour wheel — handy
              for pie-chart effects and modern decorative accents.
            </p>
            <h2>Colour-stop tips</h2>
            <p>
              Two stops give a clean blend. Add a third near the middle to shift where the
              transition happens. Stops with the same colour at adjacent positions create a hard
              edge (useful for stripes). Everything you build here is plain CSS — no images, no
              extra requests, and it scales to any size without pixelation.
            </p>
          </article>
        }
      >
        <GradientGenerator />
      </DesignToolShell>
    </>
  );
}
