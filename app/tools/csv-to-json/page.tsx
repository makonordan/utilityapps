import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { CsvToJson } from "@/components/dev-tools/CsvToJson";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "csv-to-json";
const TITLE = "Free CSV to JSON Converter — Live, In-Browser, RFC 4180";
const DESCRIPTION =
  "Convert CSV to JSON free in your browser. Auto-detects separators (comma, semicolon, tab, pipe), handles quoted values, header toggle. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["csv to json", "csv parser", "csv converter", "online csv", "convert csv"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "CSV to JSON" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function CsvToJsonPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="CSV to JSON"
        description="Paste any CSV table and get an array of objects. Auto-detects the separator, handles quoted values per RFC 4180, and lets you toggle header detection."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <CsvToJson />
      </DeveloperToolShell>
    </>
  );
}
