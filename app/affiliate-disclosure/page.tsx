import type { Metadata } from "next";

import { A, H2, H3, LegalPage, P, UL } from "@/components/legal/LegalPage";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Affiliate Disclosure — ${SITE_CONFIG.name}`;
const DESCRIPTION =
  "Affiliate programs and networks we participate in (or may participate in) across the US, UK and EU, how we mark affiliate links, and our editorial independence.";
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
        description="In plain English: how affiliate links on UtilityApps work, the programs we participate in, and our commitment to editorial independence."
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

        <H2 id="programs">Programs and networks we participate in</H2>
        <P>
          {SITE_CONFIG.name} participates in, or may participate in, the affiliate programs and
          networks below across the US, UK and EU. The list is illustrative — we join new
          programs as we cover new topics, and drop ones that no longer fit. If you are unsure
          whether a specific link is an affiliate link, the in-page label or the link&apos;s{" "}
          <code>rel</code> attribute will say so.
        </P>

        <H3 id="affiliate-networks">Affiliate networks</H3>
        <P>Aggregators that give us access to many merchants under a single account:</P>
        <UL>
          <li><strong>Impact</strong> (impact.com)</li>
          <li><strong>ShareASale</strong></li>
          <li><strong>CJ Affiliate</strong> (formerly Commission Junction)</li>
          <li><strong>Rakuten Advertising</strong></li>
          <li><strong>PartnerStack</strong></li>
          <li><strong>Awin</strong></li>
          <li><strong>FlexOffers</strong></li>
        </UL>

        <H3 id="loans-mortgages-credit">Loans, mortgages and credit</H3>
        <UL>
          <li>LendingTree</li>
          <li>Rocket Mortgage</li>
          <li>Better.com</li>
          <li>Credible</li>
          <li>LendingClub</li>
          <li>SoFi (personal loans)</li>
          <li>Upgrade</li>
          <li>CardRatings.com</li>
          <li>Credit Karma</li>
          <li>NerdWallet</li>
          <li>Discover, Chase, Capital One (via card-affiliate networks)</li>
        </UL>

        <H3 id="investing">Investing and retirement</H3>
        <UL>
          <li>SoFi Invest</li>
          <li>Robinhood</li>
          <li>M1 Finance</li>
          <li>Wealthfront</li>
          <li>Fidelity</li>
          <li>Vanguard</li>
          <li>Acorns</li>
          <li>Betterment</li>
          <li>Empower (formerly Personal Capital)</li>
        </UL>

        <H3 id="tax-accounting">Tax and freelance accounting</H3>
        <UL>
          <li>TurboTax (Intuit)</li>
          <li>H&amp;R Block</li>
          <li>FreshBooks</li>
          <li>QuickBooks</li>
        </UL>

        <H3 id="money-transfer">International money transfer</H3>
        <UL>
          <li>Wise (formerly TransferWise)</li>
          <li>Revolut</li>
          <li>OFX</li>
          <li>Remitly</li>
        </UL>

        <H3 id="productivity-writing">Productivity, writing and AI tools</H3>
        <UL>
          <li>Notion</li>
          <li>Grammarly</li>
          <li>ProWritingAid</li>
          <li>Hemingway Editor</li>
          <li>Jasper AI</li>
          <li>Scrivener</li>
        </UL>

        <H3 id="design">Design and creative software</H3>
        <UL>
          <li>Canva</li>
          <li>Adobe Creative Cloud</li>
          <li>Shutterstock</li>
          <li>Envato Elements</li>
          <li>Figma</li>
        </UL>

        <H3 id="hosting-dev">Web hosting, dev tools and infrastructure</H3>
        <UL>
          <li>Hostinger</li>
          <li>Bluehost</li>
          <li>Vercel</li>
          <li>Netlify</li>
          <li>Cloudflare</li>
          <li>DigitalOcean</li>
          <li>NameCheap</li>
          <li>GitHub Copilot</li>
          <li>JetBrains</li>
        </UL>

        <H3 id="pdf-tools">PDF and document tools</H3>
        <UL>
          <li>Adobe Acrobat</li>
          <li>PDFelement</li>
          <li>Smallpdf</li>
          <li>iLovePDF</li>
        </UL>

        <H3 id="health-fitness">Health, fitness and wellness</H3>
        <UL>
          <li>Noom</li>
          <li>MyFitnessPal Premium</li>
          <li>Fitbit</li>
          <li>Apple Fitness</li>
          <li>Whoop</li>
          <li>Daily Harvest</li>
          <li>Factor</li>
          <li>HelloFresh</li>
          <li>Examine.com</li>
          <li>Calm</li>
          <li>Headspace</li>
        </UL>

        <H3 id="sleep-home">Sleep and home essentials</H3>
        <UL>
          <li>Casper</li>
          <li>Purple</li>
          <li>Saatva</li>
          <li>Eight Sleep</li>
          <li>Hatch</li>
        </UL>

        <H3 id="education">Online courses and education</H3>
        <UL>
          <li>Coursera</li>
          <li>Udemy</li>
          <li>Skillshare</li>
          <li>Chegg</li>
        </UL>

        <H3 id="vpn-privacy">VPN and privacy</H3>
        <UL>
          <li>NordVPN</li>
          <li>ExpressVPN</li>
        </UL>

        <H3 id="travel">Travel and lodging</H3>
        <UL>
          <li>Expedia</li>
          <li>Booking.com</li>
          <li>Airbnb</li>
        </UL>

        <H3 id="cloud-storage">Cloud storage</H3>
        <UL>
          <li>Dropbox</li>
          <li>pCloud</li>
          <li>Sync.com</li>
        </UL>

        <P>
          We add and remove programs as our coverage evolves and may participate in other programs
          not listed here. This page is updated when significant changes occur.
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
