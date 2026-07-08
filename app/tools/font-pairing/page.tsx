import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DesignToolShell } from "@/components/design-tools/DesignToolShell";
import { FontPairing } from "@/components/design-tools/FontPairing";
import { designToolOgUrl, getDesignFaqs } from "@/lib/designFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "font-pairing";
const TITLE = "Free Font Pairing Tool — Curated Google Font Combinations";
const DESCRIPTION =
  "Browse curated Google Font pairings with live previews. Each pairing comes with copy-ready link tag and font-family CSS. Free, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["font pairing", "google font pairing", "font combinations", "font pairs", "typography pairing"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: designToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Font Pairing" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function FontPairingPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DesignToolShell
        toolId={TOOL_ID}
        title="Font Pairing"
        description="Curated heading + body font combinations, previewed with the real Google Fonts. Copy the link tag and font-family CSS for the pairing you like."
        faqItems={getDesignFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>What makes a good pairing</h2>
            <p>
              The classic rule is <em>contrast with harmony</em>. The heading and body should
              differ enough to create clear hierarchy — a distinctive display face against a
              quiet, highly readable text face — but share underlying proportions so they feel
              like they belong together. Pairing two attention-seeking fonts, or two nearly
              identical ones, both fail.
            </p>
            <h2>Serif heading, sans body — and vice versa</h2>
            <p>
              A serif heading over a sans-serif body reads as editorial and trustworthy. A
              sans-serif heading over a serif body feels modern with a readable, traditional
              text block. Matched superfamilies (like DM Serif Display + DM Sans) are the
              safest bet — they were literally designed to work together.
            </p>
            <h2>About the fonts</h2>
            <p>
              Every font here is from Google Fonts, free for commercial use under open licences.
              The previews load the actual fonts, so what you see is exactly what ships.
            </p>
          </article>
        }
      >
        <FontPairing />
      </DesignToolShell>
    </>
  );
}
