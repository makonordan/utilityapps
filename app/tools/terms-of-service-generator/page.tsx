import type { Metadata } from "next";

import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TermsOfServiceGenerator } from "@/components/legal-tools/TermsOfServiceGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "terms-of-service-generator";

const TITLE = "Free Terms of Service Generator — Customisable ToS Template";
const DESCRIPTION =
  "Generate Terms of Service for your SaaS, store, marketplace, content site or app. Configurable clauses, PDF or Word download.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "terms of service generator",
    "terms and conditions generator",
    "free terms of service",
    "tos template",
    "website terms generator",
    "saas terms of service",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Terms of Service Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function TermsOfServiceGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="Terms of Service Generator"
        description="Describe your service, pick a governing-law jurisdiction, toggle optional clauses (free trial, user content, mandatory arbitration). The generator builds a contract you can paste at /terms."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <TermsOfServiceGenerator />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What a Terms of Service does for you</h2>
      <p>
        Your Terms of Service is the contract between you and every user of your service. It sets
        the rules — what users may do, what they may not, how disputes are resolved, who owns
        what, what happens when accounts are terminated. Without one, every disagreement falls
        back to default law, which usually doesn&rsquo;t favour the business.
      </p>
      <h2>Clauses worth understanding before you ship them</h2>
      <ul>
        <li>
          <strong>Limitation of liability</strong> — caps your maximum exposure in a dispute.
          Most courts will enforce a reasonable cap (e.g. fees paid in last 12 months); a $0 cap
          is usually unenforceable.
        </li>
        <li>
          <strong>Mandatory arbitration + class action waiver</strong> — pushes disputes out of
          court and forbids class actions. Aggressive, common in US SaaS, and increasingly
          challenged in court. Only ship after a lawyer review.
        </li>
        <li>
          <strong>User-content licence</strong> — required if users can post anything (comments,
          listings, uploads). Without it, you don&rsquo;t have the legal right to display what
          they post.
        </li>
        <li>
          <strong>Governing law</strong> — picks which jurisdiction&rsquo;s courts and laws apply
          to disputes. Affects everything from consumer-rights minimums to which sales taxes you
          must collect.
        </li>
      </ul>
      <h2>ToS and Privacy Policy are separate documents</h2>
      <p>
        Combining them into one &ldquo;Terms and Policies&rdquo; page is a common mistake. They
        serve different legal purposes (contract vs disclosure) and have different audiences and
        legal standards. Keep them on separate pages and link to both in your footer.
      </p>
    </article>
  );
}
