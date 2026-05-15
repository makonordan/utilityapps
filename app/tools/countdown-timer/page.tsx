import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { CountdownTimer } from "@/components/productivity-tools/CountdownTimer";
import { ProductivityToolShell } from "@/components/productivity-tools/ProductivityToolShell";
import { getProductivityFaqs, productivityToolOgUrl } from "@/lib/productivityFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "countdown-timer";

const TITLE = "Free Countdown Timer to Any Date — Shareable & Embeddable";
const DESCRIPTION =
  "Count down to any date and time, free. Custom title, accent colour, end-of-countdown message. Shareable URL and iframe embed. Time-zone aware. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "countdown timer",
    "countdown to date",
    "online countdown",
    "embeddable countdown",
    "wedding countdown",
    "launch countdown",
    "free countdown timer",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: productivityToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Countdown Timer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [productivityToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function CountdownTimerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ProductivityToolShell
        toolId={TOOL_ID}
        title="Countdown Timer"
        description="Pick any future date and the countdown shows days, hours, minutes, and seconds remaining. Customise the title, message, and accent colour, then copy a shareable URL or embed snippet."
        faqItems={getProductivityFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CountdownTimer />
      </ProductivityToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What you can count down to</h2>
      <p>
        Product launches, weddings, exam dates, baby due dates, sports events,
        sale-end timers, contract deadlines — anything with a fixed future
        moment. Set the date, optionally add a label and a message that shows
        when zero hits, and you have a polished countdown ready to share.
      </p>

      <h2>Sharing and embedding</h2>
      <p>
        Every configuration produces a permanent URL with the date, title,
        message, and colour baked into the query string. Send the link in an
        email or chat, post it on social, or drop the iframe snippet into your
        own site so the countdown lives on your domain. The embedded version
        renders without the surrounding form so it fits cleanly in a hero
        section or sidebar.
      </p>

      <h2>Time zones</h2>
      <p>
        Internally the target moment is stored as a UTC timestamp. Each viewer
        sees the same moment translated into their own local time, so you don't
        need to think about who's reading from where. If you set a target of
        "1 January 09:00" in London, a viewer in Tokyo sees the countdown to
        the same exact moment (which is 18:00 their local time on the same date).
      </p>

      <h2>Privacy</h2>
      <p>
        Nothing is sent to a server. The countdown runs locally in your browser
        from a URL that contains only the date and visual settings — no
        identifiers, no tracking. Anyone with the link sees exactly the same
        countdown you do.
      </p>
    </article>
  );
}
