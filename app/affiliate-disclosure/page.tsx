import type { Metadata } from "next";

import { A, H2, LegalPage, P, UL } from "@/components/legal/LegalPage";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Affiliate Disclosure — ${SITE_CONFIG.name}`;
const DESCRIPTION =
  "How affiliate links on UtilityApps work, how we mark them, and our commitment to editorial independence.";
const LAST_UPDATED = "2026-05-23";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/affiliate-disclosure" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/affiliate-disclosure`,
  dateModified: LAST_UPDATED,
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage
        title="Affiliate Disclosure"
        description="In plain English: how affiliate links on UtilityApps work, how we mark them, and our commitment to editorial independence."
        breadcrumbLabel="Affiliate Disclosure"
        lastUpdated={LAST_UPDATED}
      >
        <P>
          {SITE_CONFIG.name} participates in affiliate programs run by third-party merchants and
          affiliate networks. This disclosure explains, in line with the U.S. Federal Trade
          Commission&apos;s{" "}
          <A href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" external>
            Endorsement Guides
          </A>
          {" "}and equivalent rules in the UK, EU, Canada and Australia, exactly how it works.
        </P>

        <H2 id="what-is-an-affiliate-link">What is an affiliate link?</H2>
        <P>
          An affiliate link is a regular hyperlink that includes a unique identifier so the
          destination merchant or network can attribute a referral to us. When you click an
          affiliate link and complete a qualifying action — a sign-up, a purchase or an account
          opening — the merchant pays us a small commission. The price you pay is not affected.
        </P>

        <H2 id="how-we-mark-affiliate-links">How affiliate links are marked</H2>
        <UL>
          <li>
            Affiliate links use the HTML attribute <code>rel=&ldquo;sponsored noopener&rdquo;</code>{" "}
            so search engines and assistive technology can identify them.
          </li>
          <li>
            In our articles and recommendation lists, we flag affiliate links in context —
            typically with a parenthetical &ldquo;(affiliate link)&rdquo; note or a footnote.
          </li>
        </UL>

        <H2 id="editorial-independence">Editorial independence</H2>
        <P>
          We only recommend products and services we have either used personally or vetted
          carefully. No merchant pays for placement, and no review or recommendation can be
          purchased. We sometimes review products that did <em>not</em> become affiliate partners;
          that&apos;s by design.
        </P>
        <P>
          Where we earn affiliate commissions on competing products, we disclose the relationship
          on every page so you can weigh our recommendation accordingly. Our editorial process
          ranks usefulness above commission rate; the two are sometimes correlated, often not.
        </P>

        <H2 id="why-this-funds-us">Why affiliate income matters</H2>
        <P>
          {SITE_CONFIG.name} is free to use and free to keep using — no signup, no premium tier,
          no usage caps. Affiliate revenue and tasteful display advertising are how we cover the
          cost of running the Service and shipping new tools. If you find a tool useful and decide
          to try a related paid product through one of our links, you support the Service at no
          extra cost. Thank you.
        </P>

        <H2 id="your-choice">Your choice</H2>
        <P>
          You are never required to use our links. If you prefer to sign up or purchase directly,
          simply search for the merchant of your choice. The price you pay will be the same. We
          publish this disclosure to make sure your choice is informed.
        </P>

        <H2 id="contact">Contact</H2>
        <P>
          Questions about how our affiliate relationships work or a concern about a specific
          recommendation? Email{" "}
          <A href="mailto:hello@utilityapps.site" external>hello@utilityapps.site</A> or use
          our <A href="/contact">contact form</A>.
        </P>
      </LegalPage>
    </>
  );
}
