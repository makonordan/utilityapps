import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { SqlFormatter } from "@/components/dev-tools/SqlFormatter";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "sql-formatter";
const TITLE = "Free SQL Formatter — Multi-Dialect Query Beautifier";
const DESCRIPTION =
  "Format SQL queries free in your browser. Postgres, MySQL, BigQuery, Snowflake, Redshift, SQLite, T-SQL and more. Configurable indent and keyword case.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["sql formatter", "sql beautifier", "format sql", "online sql formatter", "postgres formatter"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "SQL Formatter" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function SqlFormatterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="SQL Formatter"
        description="Pretty-print SQL with the dialect of your database — Postgres, MySQL, BigQuery, Snowflake, T-SQL and more. Configurable indent and keyword case."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <SqlFormatter />
      </DeveloperToolShell>
    </>
  );
}
