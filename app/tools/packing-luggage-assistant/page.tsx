import type { Metadata } from "next";

import { PackingLuggageAssistant } from "@/components/travel-tools/PackingLuggageAssistant";
import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "packing-luggage-assistant";

const TITLE = "Free Packing List Generator + Liquids & Luggage Size Checker";
const DESCRIPTION =
  "A trip-specific packing checklist, 100 ml liquids rule checker, and luggage-size pass/fail against 24 major airlines — all in one free tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "packing list generator",
    "100ml liquids rule checker",
    "carry on size checker",
    "airline luggage size",
    "travel packing checklist",
    "carry on liquids",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Packing & Luggage Assistant" }],
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
        title="Packing & Luggage Assistant"
        description="Three travel checks in one tool: a trip-specific packing checklist, a 100 ml liquid-rule checker, and a luggage-size pass/fail against the carry-on limits of 24 major airlines."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <PackingLuggageAssistant />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>One tool for three packing headaches</h2>
      <p>
        Every trip has the same three packing questions: <em>What should I bring?</em>{" "}
        <em>Will my toiletries pass security?</em> <em>Will my bag fit in the overhead bin?</em>
        Most people answer them with three different searches and still pack wrong. This tool
        answers all three on one page.
      </p>

      <h2>The 100 ml liquids rule (and why your travel-size still fails)</h2>
      <p>
        Each container of liquid, gel or aerosol in your carry-on must be 100 ml or less and fit
        with everything else in a single resealable bag of about 1 L total capacity. The size on
        the container counts, not how full it is — a half-empty 150 ml bottle still fails. Pour
        into 100 ml travel bottles or move it to checked baggage.
      </p>

      <h2>Carry-on sizes are not standardised</h2>
      <p>
        Airline carry-on limits range from 40×20×25 cm (Ryanair, free bag only) to 61×41×28 cm
        (Southwest). A bag that flies free with one carrier can be charged or gate-checked with
        another. The Luggage Size tab shows pass/fail across 24 major airlines so you can pick a
        bag that works on every airline you fly.
      </p>

      <h2>Your checklist saves itself</h2>
      <p>
        The packing list persists in your browser&apos;s local storage — close the page and come
        back to a half-packed list. Nothing is uploaded; clearing browser data wipes the list.
      </p>
    </article>
  );
}
