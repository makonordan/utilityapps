import type { Metadata } from "next";

import { FlightAirportHub } from "@/components/travel-tools/FlightAirportHub";
import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "flight-airport-hub";

const TITLE = "Free Flight & Airport Hub — Codes, CO₂, Bag Size, Class Compare";
const DESCRIPTION =
  "Airport code lookup, flight CO₂ calculator, cabin bag size by airline, and a long-haul cabin-class comparison — all in one travel tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "airport code lookup",
    "IATA code",
    "ICAO code",
    "flight CO2 calculator",
    "cabin bag size airline",
    "business class vs economy",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Flight & Airport Hub" }],
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
        title="Flight & Airport Hub"
        description="Four flight-planning utilities in one place: search 80 major airports by code, estimate your flight's CO₂, look up cabin-bag rules for 24 airlines, and compare cabin classes on long-haul aircraft."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <FlightAirportHub />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>IATA vs ICAO codes</h2>
      <p>
        Airports have two code systems. The <strong>IATA</strong> code is the 3-letter version
        you see on luggage tags and boarding passes — LHR, JFK, DXB. The <strong>ICAO</strong>{" "}
        code is 4 letters and used by pilots and air-traffic control — EGLL, KJFK, OMDB. The
        airport-code lookup accepts either.
      </p>

      <h2>How accurate is the flight CO₂ figure?</h2>
      <p>
        The calculator multiplies the great-circle distance by a per-passenger-kilometre emissions
        factor — 120 g/km for economy, 180 g for premium economy, 240 g for business, and 320 g
        for first. These match the order-of-magnitude figures used by major airline calculators
        (BA, Lufthansa) and offset providers. Actual numbers depend on aircraft type, load factor
        and route, so treat this as a useful comparison number rather than a precise emissions
        statement.
      </p>

      <h2>Carry-on rules vary much more than you think</h2>
      <p>
        Cabin-bag sizes range from 40×20×25 cm (Ryanair free bag) to 61×41×28 cm (Southwest).
        Most major airlines centre around 55×40×23 cm, and most enforce a weight limit too —
        anywhere from 7 kg (Emirates, Singapore) to 23 kg (British Airways). If you fly multiple
        airlines, pick a bag that fits the smallest carry-on you&apos;ll face on the trip.
      </p>

      <h2>Is upgrading worth it?</h2>
      <p>
        For a long-haul flight, the jumps that change the most are pitch (legroom) and whether the
        seat lies flat. Economy is typically 31–32&quot; pitch. Premium economy adds 5–8&quot; and
        better recline. Business is usually lie-flat above 75&quot;. First adds a suite. Compare
        across airlines on the Class tab to see whether your specific aircraft justifies the fare
        difference.
      </p>
    </article>
  );
}
