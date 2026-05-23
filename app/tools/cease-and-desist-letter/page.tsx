import type { Metadata } from "next";

import { CeaseAndDesistLetter } from "@/components/legal-tools/CeaseAndDesistLetter";
import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "cease-and-desist-letter";

const TITLE = "Free Cease and Desist Letter Generator — IP, Defamation, Harassment";
const DESCRIPTION =
  "Generate a cease and desist letter for trademark, copyright, defamation, harassment or breach claims. PDF or Word.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "cease and desist letter template",
    "free cease and desist letter",
    "cease and desist generator",
    "trademark cease and desist",
    "defamation cease and desist",
    "harassment cease and desist",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Cease and Desist Letter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function CeaseAndDesistLetterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="Cease and Desist Letter"
        description="A formal written demand to stop a specific behaviour — trademark or copyright infringement, defamation, harassment, contract breach. Names the conduct, sets a deadline, and warns of escalation."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CeaseAndDesistLetter />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What a cease and desist letter actually does</h2>
      <p>
        It&rsquo;s not a court order — only a judge can issue those. It&rsquo;s a written notice
        that puts the recipient on record: you have identified specific wrongful conduct, you have
        the legal standing to object, and you intend to act if it continues. Three things follow
        from that.
      </p>
      <ul>
        <li>
          <strong>It often works.</strong> A surprising number of recipients didn&rsquo;t realise
          their behaviour was wrong or risky, and stop when called out.
        </li>
        <li>
          <strong>It builds your paper trail.</strong> Courts and regulators look kindly on people
          who tried to resolve a dispute before suing. A dated, specific letter that was ignored is
          stronger evidence than &ldquo;they should have known&rdquo;.
        </li>
        <li>
          <strong>It triggers a litigation hold.</strong> Once they receive it, the recipient has a
          duty to preserve evidence. Destroying records after that can be spoliation, which courts
          punish.
        </li>
      </ul>
      <h2>Be specific or it&rsquo;s noise</h2>
      <p>
        Generic &ldquo;please stop doing the bad thing&rdquo; letters get ignored. The letter is
        only useful if it names the conduct (with dates and URLs), states a clear legal basis
        (trademark, copyright, defamation), demands specific actions (take down this URL,
        retract this statement), and sets a deadline.
      </p>
      <h2>When a template isn&rsquo;t enough</h2>
      <p>
        If the dispute involves a sophisticated commercial party, a federal lawsuit, or
        significant damages — say, ongoing IP infringement that&rsquo;s costing real revenue —
        a letter from a lawyer on letterhead carries more weight and is much harder to ignore.
        The template gives you a credible first step; a lawyer&rsquo;s involvement signals you&rsquo;re
        prepared to escalate.
      </p>
    </article>
  );
}
