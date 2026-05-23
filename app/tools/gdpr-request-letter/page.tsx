import type { Metadata } from "next";

import { GdprRequestLetter } from "@/components/legal-tools/GdprRequestLetter";
import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "gdpr-request-letter";

const TITLE = "Free GDPR Data Request Letter — Article 15/17/20 Templates";
const DESCRIPTION =
  "Generate a GDPR Subject Access Request, erasure, rectification, portability or objection letter. Send to any company.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "gdpr request letter",
    "data subject access request template",
    "gdpr erasure request",
    "right to be forgotten letter",
    "gdpr article 17 template",
    "subject access request",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "GDPR Data Request Letter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function GdprRequestLetterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="GDPR Data Request Letter"
        description="Pick which GDPR right you're exercising (access, erasure, rectification, portability, restriction, objection). The letter cites the right Article and sets the 30-day timeline."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <GdprRequestLetter />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Your six GDPR rights, summarised</h2>
      <ul>
        <li>
          <strong>Article 15 — Access</strong>: confirm what they hold and get a copy.
        </li>
        <li>
          <strong>Article 16 — Rectification</strong>: have inaccurate data corrected.
        </li>
        <li>
          <strong>Article 17 — Erasure (&ldquo;right to be forgotten&rdquo;)</strong>: ask for
          your data to be deleted.
        </li>
        <li>
          <strong>Article 18 — Restriction</strong>: pause processing while you contest accuracy
          or grounds.
        </li>
        <li>
          <strong>Article 20 — Portability</strong>: receive your data in a machine-readable
          format you can give to another service.
        </li>
        <li>
          <strong>Article 21 — Objection</strong>: object to processing — including an absolute
          right to opt out of direct marketing.
        </li>
      </ul>
      <h2>The one-month clock</h2>
      <p>
        Article 12(3) gives the recipient <strong>one calendar month</strong> from receipt to
        respond. They can extend by two more months for complex requests but only if they notify
        you within the first month with reasons. After the deadline, you can complain to your
        national supervisory authority (the ICO in the UK, the CNIL in France, etc.) — and they
        do take complaints seriously.
      </p>
      <h2>Identity verification</h2>
      <p>
        Companies sometimes ask for ID before responding. The GDPR allows this only when{" "}
        <strong>strictly necessary</strong> to verify you. Giving them your customer email,
        account number, or order ID usually identifies you well enough. Refuse blanket requests
        for passport scans unless they genuinely can&rsquo;t identify you any other way.
      </p>
      <h2>Where to send it</h2>
      <p>
        Most companies publish a privacy contact in their privacy policy — usually{" "}
        <code>privacy@company.com</code> or a DPO (Data Protection Officer) at{" "}
        <code>dpo@company.com</code>. Email is fine and creates a timestamped record. Keep a
        copy of what you sent.
      </p>
    </article>
  );
}
