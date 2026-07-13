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
        seoContent={<SeoContent />}
      >
        <ColorConverter />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why the same colour has four different-looking values</h2>
      <p>
        HEX (<code>#3b82f6</code>), RGB (<code>rgb(59, 130, 246)</code>), and HSL (<code>hsl(217,
        91%, 60%)</code>) all describe the identical colour — they just encode it differently. HEX
        and RGB store raw red/green/blue channel values; HSL stores hue, saturation and lightness,
        which is often more intuitive for tweaking a colour by hand (e.g. darkening by lowering
        lightness) without recalculating three separate channel values.
      </p>
      <h2>When to reach for HSL over HEX</h2>
      <p>
        If you&rsquo;re building a colour palette or theme system, HSL makes it trivial to generate
        consistent shades and tints of the same hue — keep hue and saturation fixed and vary
        lightness. HEX and RGB are more common in design handoffs and CSS written by hand, since
        most design tools default to HEX.
      </p>
      <h2>The 147 named CSS colours</h2>
      <p>
        CSS supports 147 standard named colours (<code>rebeccapurple</code>,{" "}
        <code>cornflowerblue</code>, and so on) that map to exact HEX values under the hood. The
        converter recognises all of them and converts freely between a name and its HEX/RGB/HSL
        equivalents.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        Conversion happens instantly in your browser with no signup — nothing you type is sent to
        a server.
      </p>
    </article>
  );
}
