import type { Metadata } from "next";

import { DistanceCoordinates } from "@/components/travel-tools/DistanceCoordinates";
import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "distance-coordinates";

const TITLE = "Distance & Coordinates Toolkit — Cities, Lat/Lng, GPS, Driving";
const DESCRIPTION =
  "Great-circle city distance, decimal/DMS/Google Maps coordinate converter, GPS-to-city lookup, and driving time estimator — all in one travel tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "distance calculator",
    "city to city distance",
    "coordinate converter",
    "decimal degrees to dms",
    "gps coordinates lookup",
    "driving time estimator",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Distance & Coordinates Toolkit" }],
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
        title="Distance & Coordinates Toolkit"
        description="Four geography utilities in one place: great-circle distance between any two of 80 major cities, paste-anything coordinate converter, GPS-to-nearest-city lookup, and a quick driving-time estimator with rest stops."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <DistanceCoordinates />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What &ldquo;great-circle distance&rdquo; means</h2>
      <p>
        The shortest distance between two points on a sphere is along a great circle — a circle
        whose plane passes through the centre of the Earth. The tool calculates that distance
        using the Haversine formula, which is the same approach airlines use to compute route
        lengths. Driving distance from the same city pair will be longer because roads bend
        around terrain and political borders.
      </p>

      <h2>Three coordinate formats, one tool</h2>
      <p>
        The converter accepts <strong>decimal degrees</strong> (40.7128, −74.0060),{" "}
        <strong>degrees-minutes-seconds</strong> (40°42&apos;46&quot;N 74°00&apos;21&quot;W) and
        <strong> Google Maps links</strong>. Paste any of them and the tool returns the other
        formats plus ready-to-share Google Maps and OpenStreetMap URLs.
      </p>

      <h2>When GPS lookup helps</h2>
      <p>
        Photos taken with location services on store coordinates in their EXIF data. Friends
        share &ldquo;here I am&rdquo; pings as raw numbers. Drone logs, GPS watches and survey
        equipment all output coordinates. The GPS Lookup tab tells you which major city is
        closest and what time zone that puts you in — useful context when the numbers alone
        don&apos;t mean anything.
      </p>

      <h2>Driving time is rarely just distance ÷ speed</h2>
      <p>
        For a realistic estimate, factor in rest stops every 2 hours and an average speed below
        the speed limit — highway with light traffic is usually 90–110 km/h average, not the
        130 km/h limit. The Driving tab adds rest-stop minutes so the total reflects what
        you&apos;ll actually spend on the road.
      </p>
    </article>
  );
}
