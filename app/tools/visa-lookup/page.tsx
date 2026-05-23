import type { Metadata } from "next";

import { TravelToolShell } from "@/components/travel-tools/TravelToolShell";
import { VisaLookup } from "@/components/travel-tools/VisaLookup";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getTravelFaqs, travelToolOgUrl } from "@/lib/travelFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "visa-lookup";

const TITLE = "Visa Requirement Lookup — Tourist Visa by Passport & Destination";
const DESCRIPTION =
  "Quick visa-status lookup for short tourist visits. Pick your passport and destination — get the typical category and the official link to verify.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "visa requirement",
    "do I need a visa",
    "tourist visa lookup",
    "visa free countries",
    "e-visa",
    "visa on arrival",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: travelToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Visa Lookup" }],
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
        title="Visa Requirement Lookup"
        description="Pick your passport and destination — the tool returns the typical visa category for short tourist visits, plain-English instructions and a link straight to the official immigration site to verify."
        faqItems={getTravelFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <VisaLookup />
      </TravelToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The five visa categories you&apos;ll meet</h2>
      <p>
        <strong>Visa-free</strong>: just show your passport at the border. <strong>ETA</strong>:
        an electronic travel authorisation — apply online before flying (ESTA for the US, ETA for
        Australia and Canada). <strong>Visa on arrival</strong>: buy at the border on entry.{" "}
        <strong>e-Visa</strong>: apply online, get an electronic visa, takes a few days.{" "}
        <strong>Visa required</strong>: apply at an embassy in advance — allow weeks.
      </p>

      <h2>The 90/180 Schengen rule</h2>
      <p>
        Across the Schengen area (most of the EU plus Iceland, Norway, Switzerland and a few
        others), most tourist passports get 90 days of stay in any rolling 180-day window. That
        90-day budget is shared across all Schengen countries — three weeks in Spain and a month
        in France count together. Plan trip lengths around it if you visit Europe often.
      </p>

      <h2>Why we always show the official link</h2>
      <p>
        Visa rules change frequently — countries strike new agreements, lengthen or shorten
        stays, and add electronic systems. The result on this page is the typical category as of
        the &ldquo;last reviewed&rdquo; date, but the official immigration site is the
        authoritative source. Check it before you book.
      </p>

      <h2>What we don&apos;t cover</h2>
      <p>
        Work, study, long-stay, residency and family visas all have separate processes and are
        outside the scope of this tool. So are border-rule changes that apply only to specific
        nationalities (e.g. waivers for diplomats, dual citizens, or special categories). For
        anything beyond a short tourist visit, check the embassy.
      </p>
    </article>
  );
}
