import type { Metadata } from "next";

import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { NdaGenerator } from "@/components/legal-tools/NdaGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "nda-generator";

const TITLE = "Free NDA Generator — Mutual or One-Way Non-Disclosure Agreement";
const DESCRIPTION =
  "Generate a mutual or one-way non-disclosure agreement. Configurable parties, purpose, term and governing law. PDF or Word.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "nda generator",
    "non disclosure agreement template",
    "free nda template",
    "mutual nda",
    "unilateral nda",
    "nda online",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "NDA Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function NdaGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="NDA Generator"
        description="Build a confidentiality agreement: pick mutual or one-way, fill in parties, set the purpose and term, choose governing law. Generates client-side; both parties sign and keep a copy."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <NdaGenerator />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Mutual vs one-way — which to pick</h2>
      <p>
        <strong>Mutual</strong> NDAs protect both parties&rsquo; confidential information. Use
        for business partnerships, co-founder discussions, due diligence, merger talks, and most
        substantive business conversations. Safer than one-way because either side may end up
        sharing more than expected.
      </p>
      <p>
        <strong>One-way (unilateral)</strong> NDAs protect only one side — the Disclosing Party.
        Common when a company shares trade secrets with a contractor, interview candidate, or
        beta tester who won&rsquo;t be sharing anything substantive in return.
      </p>
      <h2>The term clause matters more than people think</h2>
      <p>
        For general business information, a 2–5 year term is normal. Courts often refuse to
        enforce NDAs with indefinite terms over ordinary commercial information — they look like
        unreasonable restraints on competition. For true trade secrets (formulas, source code,
        proprietary algorithms), an indefinite term is more defensible.
      </p>
      <h2>Be specific about the Purpose</h2>
      <p>
        The Purpose clause defines the only allowed use of the confidential information. Vague
        Purposes (&ldquo;general business discussions&rdquo;) make the NDA harder to enforce.
        Specific Purposes (&ldquo;evaluating an investment of up to USD 500,000 by Party B in
        Party A&rdquo;) are much stronger and clearer to courts.
      </p>
    </article>
  );
}
