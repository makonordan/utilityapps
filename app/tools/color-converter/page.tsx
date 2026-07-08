import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { ColorConverter } from "@/components/dev-tools/ColorConverter";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "color-converter";
const TITLE = "Free Colour Converter — HEX ↔ RGB ↔ HSL ↔ Named CSS Colours";
const DESCRIPTION =
  "Convert between HEX, RGB, HSL, and the 147 named CSS colours. Live preview swatch and one-click copy. No signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["color converter", "hex to rgb", "rgb to hex", "hex to hsl", "css color names"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Colour Converter" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function ColorConverterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="Colour Converter"
        description="Type any HEX, RGB, HSL, or CSS named colour. The converter shows all four formats live with a preview swatch and a one-click copy on each."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <ColorConverter />
      </DeveloperToolShell>
    </>
  );
}
