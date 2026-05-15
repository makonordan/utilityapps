import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { CronExpressionBuilder } from "@/components/dev-tools/CronExpressionBuilder";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "cron-expression-builder";
const TITLE = "Free Cron Expression Builder — Live Description + Next-Run Preview";
const DESCRIPTION =
  "Build cron expressions with a visual editor, see a plain-English description, and preview the next 5 fire times. Free, no signup, in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["cron expression", "cron builder", "cron syntax", "crontab", "online cron"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Cron Expression Builder" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function CronExpressionBuilderPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="Cron Expression Builder"
        description="Pick a preset or type the expression directly. Get a plain-English description and the next 5 fire times computed in your local timezone."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <CronExpressionBuilder />
      </DeveloperToolShell>
    </>
  );
}
