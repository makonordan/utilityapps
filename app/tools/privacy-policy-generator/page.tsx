import type { Metadata } from "next";

import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { PrivacyPolicyGenerator } from "@/components/legal-tools/PrivacyPolicyGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "privacy-policy-generator";

const TITLE = "Free Privacy Policy Generator — GDPR & CCPA-Aware Template";
const DESCRIPTION =
  "Generate a privacy policy in under a minute — GDPR/CCPA-aware, configurable for your data and processors, download as PDF or Word.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "privacy policy generator",
    "free privacy policy",
    "gdpr privacy policy",
    "ccpa privacy policy",
    "privacy policy for website",
    "privacy policy template",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Privacy Policy Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PrivacyPolicyGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="Privacy Policy Generator"
        description="Pick your jurisdiction, tick what data you collect, list the third-party services that touch it. The generator builds a complete privacy policy you can paste into your /privacy page."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <PrivacyPolicyGenerator />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What this generator covers</h2>
      <p>
        The output is a generic, plain-English privacy policy aimed at the most common
        SaaS / e-commerce / content-site setup. It includes the disclosures that GDPR (EU/UK) and
        CCPA (California) commonly require: purposes of processing, lawful bases, data subject
        rights, cookies, retention, third-party processors, international transfers, and a
        contact for data requests.
      </p>
      <h2>What it doesn&rsquo;t cover</h2>
      <ul>
        <li>Industry-specific rules (healthcare HIPAA, financial GLBA, child-directed COPPA)</li>
        <li>Specific contract terms with named third parties</li>
        <li>Country-specific legal nuances beyond the jurisdiction you pick</li>
        <li>Cookie-banner consent flow (you still need a banner — the policy describes what you do)</li>
      </ul>
      <h2>How to use the output</h2>
      <ol>
        <li>Read it end-to-end and make sure every clause is accurate for your business.</li>
        <li>Have a privacy lawyer review it — especially before launch and before raising any kind of round.</li>
        <li>Publish at <code>/privacy</code> on your site and link in your footer.</li>
        <li>Update it whenever your data practices change.</li>
      </ol>
    </article>
  );
}
