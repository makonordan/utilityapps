import type { Metadata } from "next";

import { A, H2, LegalPage, P, UL } from "@/components/legal/LegalPage";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Disclaimer — ${SITE_CONFIG.name}`;
const DESCRIPTION =
  "UtilityApps tools provide estimates and educational content, not professional financial, medical, legal, or tax advice.";
const LAST_UPDATED = "2026-05-01";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/disclaimer" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/disclaimer`,
  dateModified: LAST_UPDATED,
};

export default function DisclaimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage
        title="Disclaimer"
        description="The tools and articles on UtilityApps are educational. They are not a substitute for advice from a qualified professional."
        breadcrumbLabel="Disclaimer"
        lastUpdated={LAST_UPDATED}
      >
        <P>
          The information and tools provided by {SITE_CONFIG.name} are for general informational
          and educational purposes only. While we work to keep our calculators accurate and our
          articles current, we make no warranties about the completeness, reliability, or
          accuracy of any content. Any action you take based on the information you find on the
          Service is strictly at your own risk.
        </P>

        <H2 id="financial">Financial calculators are not financial advice</H2>
        <P>
          Our financial tools — including the loan calculator, mortgage calculator, salary
          calculator, tax calculator, and currency converter — produce estimates based on the
          numbers you enter and a published formula. They do <strong>not</strong> account for your
          full financial situation, applicable fees, regional regulations, or current market
          conditions.
        </P>
        <UL>
          <li>The results are not guaranteed to match the figures any specific lender, employer, or tax authority will produce.</li>
          <li>Tax brackets, rates, and rules change every year. Always confirm with your tax authority or a qualified accountant.</li>
          <li>Loan and mortgage amortization assume regular, on-time payments and no prepayments unless specified.</li>
          <li>Currency conversion uses indicative mid-market rates that differ from what banks and card issuers actually charge.</li>
        </UL>
        <P>
          Always consult a licensed financial advisor, accountant, or attorney before making major
          financial decisions.
        </P>

        <H2 id="health">Health calculators are not medical advice</H2>
        <P>
          Our health tools — including the BMI calculator, calorie calculator, and macros
          calculator — use general formulas widely accepted in clinical practice. They do{" "}
          <strong>not</strong> account for your individual medical history, pregnancy status,
          medications, conditions, or genetic factors. They are not a diagnostic tool.
        </P>
        <UL>
          <li>BMI is a population-level screening tool. It does not measure body fat, fitness, or metabolic health, and it can misclassify athletes, older adults, and certain ethnic groups. See <A href="/blog/bmi-calculator-accuracy-limitations">our article on BMI accuracy</A>.</li>
          <li>Calorie targets are estimates with typical error margins of 5–15%. Listen to your body and adjust based on real-world results.</li>
          <li>If you have an eating disorder history, are pregnant, are nursing, or have any medical condition, consult a registered dietitian or physician before changing your diet.</li>
        </UL>
        <P>
          Always consult a qualified healthcare professional before making changes to your diet,
          exercise routine, or any aspect of your health.
        </P>

        <H2 id="legal">Tools are not legal advice</H2>
        <P>
          Articles or tools that touch on contracts, privacy, taxes, or compliance are not a
          substitute for legal advice. Laws vary by jurisdiction and change over time. Consult a
          licensed attorney for guidance on your specific situation.
        </P>

        <H2 id="estimates">Results are estimates</H2>
        <P>
          By their nature, calculators produce <em>estimates</em> based on inputs you provide and
          generic assumptions. Always cross-check important results against authoritative sources
          before acting on them.
        </P>

        <H2 id="external-links">External links</H2>
        <P>
          The Service may contain links to third-party websites or services that are not owned or
          controlled by {SITE_CONFIG.name}. We have no control over and assume no responsibility
          for the content, privacy practices, or practices of any third-party websites. Some
          external links are affiliate links — see our{" "}
          <A href="/affiliate-disclosure">affiliate disclosure</A> for details.
        </P>

        <H2 id="changes">Updates</H2>
        <P>
          This disclaimer may be updated from time to time. The &ldquo;Last updated&rdquo; date at
          the top reflects the most recent change. Continued use of the Service after a change
          means you accept the updated disclaimer.
        </P>

        <H2 id="contact">Contact</H2>
        <P>
          Questions or corrections? Email{" "}
          <A href="mailto:hello@utilityapps.site" external>hello@utilityapps.site</A> or use our{" "}
          <A href="/contact">contact form</A>.
        </P>
      </LegalPage>
    </>
  );
}
