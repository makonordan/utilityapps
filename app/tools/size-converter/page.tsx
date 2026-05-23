import type { Metadata } from "next";

import { SizeConverter } from "@/components/travel-tools/SizeConverter";
import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "size-converter";

const TITLE = "International Size Converter — Clothing & Shoes US/UK/EU/JP";
const DESCRIPTION =
  "Convert clothing and shoe sizes between US, UK, EU and Japan. Men, women and kids — instant cross-region lookup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "size converter",
    "us to eu size",
    "uk to us shoe size",
    "japanese size conversion",
    "clothing size chart",
    "shoe size converter",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Size Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [travelToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function Page() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <TravelToolShell
        toolId={TOOL_ID}
        title="International Size Converter"
        description="Pick a category — women's, men's, or kids' clothing or shoes — type your usual size, and the table updates to show the equivalent in US, UK, EU and Japanese sizing."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <SizeConverter />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why size numbers don&apos;t match</h2>
      <p>
        US sizing is based on a historical inch-based scale. UK sizing is similar but offset by
        2–4 sizes (a US 8 is roughly a UK 12 for women&apos;s clothing). EU sizing usually maps
        to chest or bust measurements in centimetres. Japanese sizing tends to track real
        body measurements directly in cm. None of them line up neatly with the others — hence
        the tables.
      </p>

      <h2>Brand variation is the real headache</h2>
      <p>
        Even within one country, a size 8 in one brand can fit like a 6 in another and a 10 in a
        third. Cuts vary by fashion era, by line within a brand, and by country of manufacture.
        The conversions here are typical mappings — for anything where fit matters, check the
        brand&apos;s own size chart against your body measurements (bust, waist, hip in cm).
      </p>

      <h2>Kids&apos; sizing is by height, not age</h2>
      <p>
        EU and Japanese kids&apos; clothing is sized by the child&apos;s height in centimetres (a
        110 is for a child about 110 cm tall). US and UK sizing uses age (5, 6, 7&hellip;) which
        is much less accurate because children grow at different rates. Measure your child&apos;s
        height before buying.
      </p>
    </article>
  );
}
