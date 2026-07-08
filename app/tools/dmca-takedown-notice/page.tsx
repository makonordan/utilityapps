import type { Metadata } from "next";

import { DmcaTakedownNotice } from "@/components/legal-tools/DmcaTakedownNotice";
import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "dmca-takedown-notice";

const TITLE = "Free DMCA Takedown Notice Generator — §512(c)(3) Compliant";
const DESCRIPTION =
  "Generate a DMCA takedown notice with all six elements required by 17 U.S.C. § 512(c)(3). Email it to the host.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "dmca takedown notice generator",
    "dmca template",
    "copyright takedown notice",
    "dmca notice template",
    "free dmca generator",
    "section 512 dmca",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "DMCA Takedown Notice Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function DmcaTakedownNoticePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="DMCA Takedown Notice Generator"
        description="Build a takedown notice that includes all six elements required by 17 U.S.C. § 512(c)(3): your signature, the work, the infringing URLs, your contact info, the good-faith statement, and the perjury statement."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <DmcaTakedownNotice />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What a DMCA takedown notice does</h2>
      <p>
        A DMCA takedown notice is a formal request, defined by the US Digital Millennium
        Copyright Act § 512(c)(3), asking an online service provider (a host, a platform, an
        ISP) to remove copyrighted material that was posted without permission. Sending one in
        good faith generally requires the service to remove the content quickly to maintain
        their own &ldquo;safe harbor&rdquo; protection from liability.
      </p>
      <h2>Where to send it</h2>
      <p>
        Most platforms publish a DMCA agent contact. Common patterns:
      </p>
      <ul>
        <li><code>dmca@platform.com</code> or <code>copyright@platform.com</code></li>
        <li>A web form at <code>platform.com/dmca</code> or <code>platform.com/copyright</code></li>
        <li>For US-registered services, a publicly designated agent on the{" "}
          <a href="https://www.copyright.gov/dmca-directory/" target="_blank" rel="noopener nofollow">US Copyright Office&rsquo;s DMCA agent directory</a></li>
      </ul>
      <h2>What happens after you send it</h2>
      <ol>
        <li>The service typically removes the content within a few days (often within hours).</li>
        <li>They notify the uploader, who may submit a counter-notice asserting they had the right to post the content.</li>
        <li>
          If the uploader files a counter-notice, the service can restore the content within 10–14
          business days unless you file a lawsuit and notify the service.
        </li>
      </ol>
      <h2>A note on bad-faith notices</h2>
      <p>
        Section 512(f) allows people who are harmed by a knowingly false DMCA notice to recover
        damages and legal fees. Sending notices about content you don&rsquo;t own, or about uses
        that are clearly fair use, is risky. The good-faith statement isn&rsquo;t cosmetic — it&rsquo;s
        the part that protects you legally, and it&rsquo;s only true if it&rsquo;s actually true.
      </p>
    </article>
  );
}
