import type { Metadata } from "next";

import { A, H2, LegalPage, P, UL } from "@/components/legal/LegalPage";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Terms of Service — ${SITE_CONFIG.name}`;
const DESCRIPTION = "The terms that govern your use of UtilityApps.";
const LAST_UPDATED = "2026-05-01";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/terms`,
  dateModified: LAST_UPDATED,
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage
        title="Terms of Service"
        description="Plain-English terms for using UtilityApps. Read these alongside the Privacy Policy and Disclaimer."
        breadcrumbLabel="Terms"
        lastUpdated={LAST_UPDATED}
      >
        <P>
          Welcome to {SITE_CONFIG.name} (the &ldquo;Service&rdquo;). By accessing or using the
          Service, you agree to these Terms of Service (the &ldquo;Terms&rdquo;). If you do not
          agree, please do not use the Service.
        </P>

        <H2 id="who-we-are">1. Who we are</H2>
        <P>
          {SITE_CONFIG.name} is an independent publisher of free online utility tools, articles,
          and curated digital products. The Service is operated by the {SITE_CONFIG.author}.
        </P>

        <H2 id="free-use">2. Free use</H2>
        <P>
          All tools on the Service are free to use without a subscription, signup, or payment. We
          may display advertising, recommend digital products, or include affiliate links to fund
          ongoing development. We will never charge you for the core tools.
        </P>

        <H2 id="acceptable-use">3. Acceptable use</H2>
        <P>You agree not to:</P>
        <UL>
          <li>Use the Service for any unlawful purpose, or in violation of any applicable law.</li>
          <li>Attempt to disrupt, overload, or interfere with the Service&apos;s infrastructure.</li>
          <li>Reverse engineer, scrape at high volume, or use automated systems to extract content beyond what robots.txt and rate limits allow.</li>
          <li>Use the Service to process content that is illegal, infringing, defamatory, harassing, or that contains malware.</li>
          <li>Misrepresent your identity or impersonate any person or organization.</li>
        </UL>

        <H2 id="account">4. No account required</H2>
        <P>
          The Service does not currently offer user accounts. Bookmarks and recently used tools
          are stored anonymously on your device. You are responsible for any data you keep
          locally.
        </P>

        <H2 id="warranty">5. No warranty on calculations or content</H2>
        <P>
          The tools provide estimates and educational content, not professional advice. Financial
          calculators (loan, mortgage, tax, salary) are <strong>not financial advice</strong>;
          health calculators (BMI, calorie, macros) are <strong>not medical advice</strong>;
          development tools are provided as-is. Always verify important results against
          authoritative sources and consult a qualified professional. See our{" "}
          <A href="/disclaimer">disclaimer</A> for the full statement.
        </P>
        <P>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
          warranties of any kind, express or implied. We do not warrant that the Service will be
          uninterrupted, error-free, or that calculations will match those of any specific
          institution.
        </P>

        <H2 id="affiliates">6. Affiliate links</H2>
        <P>
          Some links on the Service are affiliate links. We may earn a commission when you
          purchase through these links, at no extra cost to you. See our{" "}
          <A href="/affiliate-disclosure">affiliate disclosure</A> for the list of platforms we
          partner with and how the program works.
        </P>

        <H2 id="ip">7. Intellectual property</H2>
        <P>
          The Service&apos;s name, logo, design, written content, and code are the property of the{" "}
          {SITE_CONFIG.author} and are protected by copyright and other intellectual property
          laws. You may quote and link to articles for personal, non-commercial use with
          attribution. You may not redistribute, repackage, or resell the Service or any
          substantial portion of its content without prior written permission.
        </P>
        <P>
          Brand names, logos, and trademarks of third parties referenced on the Service belong to
          their respective owners. Their inclusion does not imply endorsement.
        </P>

        <H2 id="ugc">8. User-submitted content</H2>
        <P>
          The Service does not currently accept user-submitted content for publication. If we add
          such functionality in the future, separate terms will apply.
        </P>

        <H2 id="liability">9. Limitation of liability</H2>
        <P>
          To the maximum extent permitted by applicable law, the {SITE_CONFIG.author} and its
          contributors shall not be liable for any indirect, incidental, special, consequential,
          or punitive damages arising out of or in connection with your use of the Service. Our
          total aggregate liability for any direct damages shall not exceed USD $100 or the amount
          you have paid us in the prior twelve months, whichever is greater.
        </P>
        <P>
          Some jurisdictions do not allow the exclusion or limitation of certain damages. In those
          jurisdictions, our liability is limited to the maximum extent permitted by law, and
          nothing in these Terms excludes liability for fraud, gross negligence, or any other
          liability that cannot lawfully be excluded.
        </P>

        <H2 id="indemnity">10. Indemnification</H2>
        <P>
          You agree to indemnify and hold harmless the {SITE_CONFIG.author} from any claim
          arising out of your violation of these Terms or misuse of the Service.
        </P>

        <H2 id="termination">11. Termination</H2>
        <P>
          We may suspend or terminate access to the Service for users who violate these Terms or
          applicable law, without prior notice. You may stop using the Service at any time.
        </P>

        <H2 id="changes">12. Changes</H2>
        <P>
          We may update these Terms from time to time. Material changes will be announced on the
          homepage and take effect 14 days after posting. Continued use after the effective date
          constitutes acceptance of the updated Terms.
        </P>

        <H2 id="law">13. Governing law</H2>
        <P>
          These Terms are governed by the laws of England and Wales, without regard to conflict of
          laws principles. Any dispute shall be resolved in the courts of London, except that
          nothing in this clause restricts your statutory rights as a consumer in your country of
          residence.
        </P>

        <H2 id="contact">14. Contact</H2>
        <P>
          Questions about these Terms?{" "}
          <A href="mailto:legal@utilityapps.site" external>legal@utilityapps.site</A> or use the{" "}
          <A href="/contact">contact form</A>.
        </P>
      </LegalPage>
    </>
  );
}
