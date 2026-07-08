import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { HtmlFormatter } from "@/components/dev-tools/HtmlFormatter";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "html-formatter";
const TITLE = "Free HTML Formatter — Pretty-Print and Minify Online";
const DESCRIPTION =
  "Pretty-print or minify HTML free in your browser. Embedded JS and CSS are formatted too. Configurable indent. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["html formatter", "html beautifier", "html minifier", "pretty print html", "online html formatter"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "HTML Formatter" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function HtmlFormatterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="HTML Formatter"
        description="Pretty-print HTML with configurable indent, or minify it back down. Embedded JavaScript and CSS are formatted with their own parsers."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <HtmlFormatter />
      </DeveloperToolShell>
    </>
  );
}
