import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { RegexTester } from "@/components/dev-tools/RegexTester";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "regex-tester";
const TITLE = "Free Regex Tester Online — Live Highlighting + Capture Groups";
const DESCRIPTION =
  "Test JavaScript regex patterns live in your browser. Live match highlighting, named + numbered capture groups, all standard flags. No signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["regex tester", "regex online", "regular expression tester", "javascript regex", "regex debugger"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Regex Tester" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function RegexTesterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="Regex Tester"
        description="Type a JavaScript regex, toggle the flags, paste your test text. Matches highlight in the source and list with capture groups below — updated as you type."
        faqItems={getDevFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>JavaScript regex flavour</h2>
            <p>
              The tester uses the browser&apos;s native <code>RegExp</code> engine — ECMAScript regex.
              Most features (character classes, quantifiers, anchors, capture groups) match other
              flavours like PCRE, Python <code>re</code>, and .NET, but a few differ: ECMAScript
              has named groups via <code>(?&lt;name&gt;...)</code>, supports lookbehind, and
              doesn&apos;t have atomic groups.
            </p>
            <h2>Watch out for catastrophic backtracking</h2>
            <p>
              Patterns like <code>(a+)+b</code> against an input of many <code>a</code>s without a
              terminating <code>b</code> can take exponential time. The tester aborts after 2
              seconds to keep your browser responsive — if you hit that, simplify the pattern
              (avoid nested quantifiers).
            </p>
          </article>
        }
      >
        <RegexTester />
      </DeveloperToolShell>
    </>
  );
}
