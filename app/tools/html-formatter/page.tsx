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
        seoContent={<SeoContent />}
      >
        <HtmlFormatter />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Pretty-print vs minify</h2>
      <p>
        Pretty-printing adds consistent indentation and line breaks so nested HTML is readable —
        useful when debugging a page, reviewing a template, or cleaning up markup copied from a
        page builder that outputs everything on one line. Minifying does the opposite: stripping
        whitespace, comments, and line breaks to shrink file size for production, where readability
        doesn&rsquo;t matter but every byte of page weight does.
      </p>
      <h2>Why embedded CSS and JS get formatted too</h2>
      <p>
        Real-world HTML files often carry inline <code>&lt;style&gt;</code> and{" "}
        <code>&lt;script&gt;</code> blocks. Formatting the surrounding HTML but leaving those
        blocks as a single unreadable line defeats the purpose — this tool runs dedicated CSS and
        JS formatters on those embedded blocks too, so the whole file ends up consistently
        readable.
      </p>
      <h2>Configurable indentation</h2>
      <p>
        Teams disagree on 2-space vs 4-space vs tab indentation — the formatter lets you set your
        preferred indent width so the output matches your project&rsquo;s existing style guide instead
        of forcing one convention.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        Formatting runs entirely in your browser with no signup — your markup is never uploaded to
        a server, which matters if the HTML contains unpublished or client-confidential content.
      </p>
    </article>
  );
}
