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
        seoContent={<SeoContent />}
      >
        <CsvToJson />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why &ldquo;just split on commas&rdquo; breaks real CSV files</h2>
      <p>
        A naive comma-split fails the moment a field contains a comma inside quotes (e.g. an
        address like <code>&quot;123 Main St, Apt 4&quot;</code>), an escaped quote, or a value
        spanning multiple lines. This converter follows RFC 4180 — the closest thing CSV has to a
        formal spec — so quoted fields, embedded commas, and escaped quotes are parsed correctly
        instead of silently corrupting your data.
      </p>
      <h2>Auto-detecting the separator</h2>
      <p>
        Not every &ldquo;CSV&rdquo; actually uses commas — exports from European spreadsheet software often
        use semicolons (since commas are the decimal separator there), and some systems export
        tab- or pipe-delimited files with a <code>.csv</code> extension anyway. The converter
        samples your pasted data and picks the most likely separator automatically, rather than
        forcing you to specify it up front.
      </p>
      <h2>Header row handling</h2>
      <p>
        With headers, each row becomes an object keyed by column name — the natural shape for
        JSON. Without a header row, the converter falls back to either an array of arrays or
        generic <code>column1</code>, <code>column2</code> keys, which you can toggle depending on
        what your downstream code expects.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        Parsing happens entirely in your browser — no signup, and your CSV data (which may contain
        sensitive rows) is never uploaded to a server.
      </p>
    </article>
  );
}
