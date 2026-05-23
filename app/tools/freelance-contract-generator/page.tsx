import type { Metadata } from "next";

import { FreelanceContractGenerator } from "@/components/legal-tools/FreelanceContractGenerator";
import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "freelance-contract-generator";

const TITLE = "Free Freelance Contract Generator — Independent Contractor Agreement";
const DESCRIPTION =
  "Build a freelance contract with scope, payment, IP, kill fee and governing law. Generated in your browser; PDF or Word.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "freelance contract template",
    "independent contractor agreement",
    "freelance agreement generator",
    "freelancer contract",
    "contractor contract template",
    "freelance contract pdf",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Freelance Contract Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function FreelanceContractGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="Freelance Contract Generator"
        description="Independent-contractor agreement with scope, payment schedule, IP terms (assignment or licence), portfolio rights, kill fee and late-fee interest. Send to your client before the work starts."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <FreelanceContractGenerator />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The four clauses that prevent most freelance disputes</h2>
      <ol>
        <li>
          <strong>Scope</strong> — exactly what you&rsquo;re delivering, in language a stranger
          could understand. Vague scope is the single biggest source of &ldquo;but I thought you
          were doing X&rdquo; arguments.
        </li>
        <li>
          <strong>Payment schedule</strong> — when, how much, and what happens if it&rsquo;s
          late. A 50/50 split (50% on signing, 50% on delivery) is the simplest healthy default
          for one-off projects.
        </li>
        <li>
          <strong>IP terms</strong> — assignment (client owns it once paid) vs licence (you keep
          ownership, client gets to use it). The right answer depends on what the work is and
          what either side reasonably expects.
        </li>
        <li>
          <strong>Kill fee</strong> — what the client pays if they cancel mid-project. 25–50% of
          the remaining balance is typical. Without it, the client can walk away with no
          financial pain, leaving you with a half-done project nobody will pay for.
        </li>
      </ol>
      <h2>Independent contractor — not an employee</h2>
      <p>
        The agreement explicitly sets the relationship as contractor, not employee. This matters
        for taxes (the client doesn&rsquo;t withhold; you handle them yourself), for benefits
        (the client doesn&rsquo;t owe sick pay, vacation, retirement), and for liability. Misclassifying
        a worker as a contractor is a regulator&rsquo;s favourite back-tax case — the clause is
        there to make the intent clear.
      </p>
      <h2>Send it before you start work</h2>
      <p>
        Verbal agreements work right up until they don&rsquo;t. The contract takes ten minutes to
        send; the dispute it prevents could take ten weeks to resolve. Make it a non-negotiable
        step in your onboarding.
      </p>
    </article>
  );
}
