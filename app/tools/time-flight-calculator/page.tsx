import type { Metadata } from "next";

import { TimeFlightCalculator } from "@/components/travel-tools/TimeFlightCalculator";
import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "time-flight-calculator";

const TITLE = "Time Zone Converter + World Clock + Flight Arrival Calculator";
const DESCRIPTION =
  "Convert times between any two cities, pin a multi-city world clock, and calculate flight arrival times across time zones — all in one tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "time zone converter",
    "world clock",
    "flight arrival time calculator",
    "meeting time across time zones",
    "what time is it in",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Time & Flight Calculator" }],
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
        title="Time & Flight Calculator"
        description="Three time tools in one: a city-to-city time zone converter, a pinnable multi-city world clock, and a flight arrival time calculator that handles the zone crossing automatically."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <TimeFlightCalculator />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why time zones are not just integer hours</h2>
      <p>
        Most time zones are offset from UTC in whole hours, but a stubborn handful are not.
        India is +5:30. Newfoundland is −3:30. Nepal is +5:45. Daylight saving time adds another
        layer: the same New York → London call is 5 hours different in summer and 5 hours in
        winter — but the in-between weeks where one country has switched and the other has not
        give you 4 or 6 hours. The converter uses your browser&apos;s IANA database, which knows
        every rule.
      </p>

      <h2>Flight arrival math, simplified</h2>
      <p>
        For a flight from New York (JFK, UTC−4 in summer) to London (LHR, UTC+1 in summer)
        leaving at 8pm and taking 7 hours: the absolute departure is 00:00 UTC, plus 7 hours is
        07:00 UTC, which is 08:00 London. The Flight Arrival tab does this whole calculation for
        you, including DST handling.
      </p>

      <h2>Why your calculated arrival can differ from the airline&apos;s</h2>
      <p>
        Airlines publish scheduled times that include taxi, push-back, hold and approach time —
        often 20–40 minutes of padding. This calculator works with pure flight duration. Use the
        airline&apos;s schedule for the official arrival; use this tool for quick mental math
        and itinerary planning.
      </p>
    </article>
  );
}
