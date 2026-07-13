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
        seoContent={<SeoContent />}
      >
        <SqlFormatter />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why SQL dialect matters for formatting</h2>
      <p>
        Postgres, MySQL, BigQuery, Snowflake, Redshift, SQLite, and T-SQL share the same core SQL
        grammar but diverge on quoting rules, reserved keywords, and dialect-specific syntax
        (BigQuery&rsquo;s backtick-quoted identifiers, T-SQL&rsquo;s square-bracket identifiers, and so on).
        Formatting with the wrong dialect assumed can misplace tokens around syntax the formatter
        doesn&rsquo;t recognise — selecting your actual database&rsquo;s dialect keeps the output correct as
        well as pretty.
      </p>
      <h2>Reading long queries is a real productivity cost</h2>
      <p>
        A 200-line query with inconsistent indentation and no keyword casing convention is slow to
        review and easy to introduce a bug into during an edit. Consistent formatting — aligned
        clauses, uniform keyword case, predictable indentation — makes it much faster to spot a
        missing <code>JOIN</code> condition or a misplaced <code>WHERE</code> clause during review.
      </p>
      <h2>Keyword case: a team style choice</h2>
      <p>
        Some teams write SQL keywords in <code>UPPERCASE</code> to visually separate them from
        column and table names; others prefer lowercase for a less shouty style. Neither is more
        &ldquo;correct&rdquo; — the formatter supports both so the output matches your team&rsquo;s existing SQL
        style guide.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        Formatting happens entirely in your browser with no signup — your queries (which may
        reference internal table or column names) are never uploaded to a server.
      </p>
    </article>
  );
}
