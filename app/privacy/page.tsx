import type { Metadata } from "next";

import { A, H2, H3, LegalPage, P, UL } from "@/components/legal/LegalPage";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How UtilityApps collects, uses, and protects your data. GDPR and CCPA compliant.";
const LAST_UPDATED = "2026-05-01";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["privacy policy", "data protection", "GDPR compliance", "CCPA compliance"],
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/privacy`,
  dateModified: LAST_UPDATED,
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage
        title="Privacy Policy"
        description="UtilityApps is built privacy-first. This policy explains exactly what data we collect, why, and how to remove it."
        breadcrumbLabel="Privacy"
        lastUpdated={LAST_UPDATED}
      >
        <P>
          This Privacy Policy applies to the {SITE_CONFIG.name} website at <A href="/" >{SITE_CONFIG.url}</A> and all
          subdomains we operate (collectively, the &ldquo;Service&rdquo;). It is written to comply
          with the EU General Data Protection Regulation (GDPR), the UK Data Protection Act, the
          California Consumer Privacy Act (CCPA / CPRA), and equivalent regulations in other
          jurisdictions. Where local law grants you greater protections, those apply.
        </P>

        <H2 id="summary">Summary</H2>
        <UL>
          <li>We do not require an account to use any tool on the Service.</li>
          <li>Most tools run entirely in your browser; your inputs and files never leave your device.</li>
          <li>We collect a minimal set of anonymous analytics to know which tools to build next.</li>
          <li>We never sell your personal data.</li>
          <li>You can delete your data at any time — see <A href="#your-rights">Your rights</A>.</li>
        </UL>

        <H2 id="data-we-collect">1. Data we collect</H2>
        <H3 id="anonymous-analytics">Anonymous tool analytics</H3>
        <P>
          When you use a tool, we record an anonymous event that includes the tool ID, an
          approximate device class (mobile / desktop / tablet), country derived from IP at request
          time (then discarded), and a random session identifier stored in your browser&apos;s local
          storage. This identifier is generated locally and is not linked to your name, email, or
          IP address. We use these events to rank trending tools and decide which ones to improve.
        </P>
        <P>
          We rely on Supabase (a Postgres database hosted in the EU/US) for storage. The Supabase
          tables backing analytics are <code>tool_usage</code>, <code>search_queries</code>,
          <code>tool_ratings</code>, and <code>blog_views</code>. Aggregate counts older than 13
          months are deleted automatically.
        </P>

        <H3 id="apps-directory-analytics">Apps directory analytics</H3>
        <P>
          The /apps software directory (invoicing and accounting software, with more categories
          planned) uses the same anonymous approach. We log which listing or comparison page you
          viewed, which affiliate link you clicked, whether you found a review helpful, which
          filters you used, and the searches you ran (including searches that returned nothing —
          that tells us what to add next), each tagged with an approximate device class and a
          country derived server-side from the request at the time (then discarded). None of this
          requires an account, and none of it is linked to your name, email, or IP address — we
          never store your IP address. A helpful-vote flag is kept in your browser&apos;s local
          storage so we don&apos;t ask twice, not to identify you.
        </P>
        <P>
          These events live in Supabase tables (<code>app_searches</code>, <code>app_events</code>,{" "}
          <code>app_suggestions</code>) that anyone can write to but nobody can read directly —
          aggregate reads (top searches, most-viewed listings, etc.) happen only through our admin
          tooling. If you use the optional &ldquo;suggest software&rdquo; box, the software name,
          URL, and reason you provide are stored the same way; the email field there is entirely
          optional and only used if you want a reply.
        </P>

        <H3 id="bookmarks">Bookmarks and recently used tools</H3>
        <P>
          When you bookmark a tool or use one, we store the tool ID and a timestamp on your device
          via <code>localStorage</code>, plus optionally in Supabase keyed to the random session ID
          described above. Clearing your browser data removes everything stored locally.
        </P>

        <H3 id="newsletter">Newsletter subscribers</H3>
        <P>
          If you subscribe to our newsletter, we store the email address you provide, the page or
          context you subscribed from (e.g. &ldquo;footer&rdquo;, &ldquo;blog-sidebar&rdquo;), and a
          timestamp. We use this to send the weekly newsletter and a one-time welcome email. We
          send through Resend (a transactional email provider). You can unsubscribe with one click
          from any email; doing so removes you from the list.
        </P>

        <H3 id="contact-form">Contact form</H3>
        <P>
          If you write to us through the contact form, we receive your name, email, subject, and
          message. We use this only to reply. Messages are retained for up to 24 months, then
          deleted, unless they document a security or compliance matter we&apos;re required to keep.
        </P>

        <H3 id="server-logs">Server logs</H3>
        <P>
          Our hosting provider (Vercel) automatically logs technical request data — IP address,
          User-Agent, response status, and response time — for up to 24 hours for abuse detection,
          then aggregates and discards them.
        </P>

        <H3 id="adsense">Advertising cookies (Google AdSense)</H3>
        <P>
          Some pages display ads served by Google AdSense. AdSense and its partners may use cookies
          to deliver relevant ads, frequency-cap ads you&apos;ve already seen, and report ad
          performance. These cookies are set by Google, not us. You can opt out of personalized
          advertising at <A href="https://adssettings.google.com" external>Google Ads Settings</A>.
          For EU/UK users we present a consent banner that allows you to reject non-essential
          cookies.
        </P>

        <H3 id="affiliate-links">Affiliate links</H3>
        <P>
          Some links to third-party stores (Gumroad, Etsy, Amazon, Shopify) are affiliate links. We
          may earn a commission if you purchase through them, at no extra cost to you. The
          affiliate platform sets its own cookies on its own domain to attribute the sale; those
          cookies are governed by the platform&apos;s privacy policy. See{" "}
          <A href="/affiliate-disclosure">our affiliate disclosure</A> for details.
        </P>

        <H2 id="legal-basis">2. Legal basis for processing (GDPR)</H2>
        <UL>
          <li>
            <strong>Legitimate interests</strong>: anonymous analytics, server logs, and contact
            form replies.
          </li>
          <li>
            <strong>Consent</strong>: non-essential cookies (advertising, optional analytics) and
            newsletter subscriptions. You may withdraw consent at any time.
          </li>
          <li>
            <strong>Contractual necessity</strong>: when you purchase a digital product through one
            of our affiliate partners, the partner processes the transaction under its own terms.
          </li>
        </UL>

        <H2 id="data-sharing">3. Who we share data with</H2>
        <P>We share data only with the service providers necessary to operate the Service:</P>
        <UL>
          <li>
            <strong>Vercel</strong> — hosting and CDN. Standard server logs.
          </li>
          <li>
            <strong>Supabase</strong> — database for anonymous analytics, bookmarks, and newsletter list.
          </li>
          <li>
            <strong>Resend</strong> — transactional and newsletter email delivery.
          </li>
          <li>
            <strong>OpenAI</strong> — when you use the AI search, your search query is sent to
            OpenAI for intent classification. OpenAI does not retain queries from API usage past 30 days.
          </li>
          <li>
            <strong>Google AdSense</strong> — only where ads are displayed and only with your consent
            (EU/UK).
          </li>
        </UL>
        <P>
          We do not sell or rent personal data. We do not share data with marketing or data-broker
          third parties.
        </P>

        <H2 id="international-transfers">4. International transfers</H2>
        <P>
          We process data primarily in the United States and the European Union. Where we transfer
          personal data out of the EU/UK, we use Standard Contractual Clauses approved by the
          European Commission and the UK Information Commissioner.
        </P>

        <H2 id="retention">5. Retention</H2>
        <UL>
          <li>Anonymous analytics events: 13 months, then deleted.</li>
          <li>Newsletter list: until you unsubscribe.</li>
          <li>Contact form messages: up to 24 months.</li>
          <li>Server logs: up to 24 hours.</li>
          <li>Bookmarks: as long as you keep them, or until you clear local storage.</li>
        </UL>

        <H2 id="your-rights">6. Your rights</H2>
        <P>You have the right to:</P>
        <UL>
          <li>Access the data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Delete your data (right to erasure).</li>
          <li>Export your data in a portable format.</li>
          <li>Object to processing or withdraw consent.</li>
          <li>
            Lodge a complaint with your local data protection authority. EU/UK residents may
            contact their national DPA; California residents may contact the California Attorney
            General.
          </li>
        </UL>
        <P>
          California residents have additional CCPA/CPRA rights, including the right to know what
          personal information we have collected, to delete it, and to opt out of any sale or
          sharing of personal data — although as noted, we do not sell or share personal data for
          cross-context behavioral advertising.
        </P>
        <P>
          To exercise any of these rights, email <A href="mailto:hello@utilityapps.site" external>hello@utilityapps.site</A>.
          We respond within 30 days.
        </P>

        <H2 id="children">7. Children</H2>
        <P>
          The Service is not directed to children under 13 (or the equivalent minimum age in your
          jurisdiction). We do not knowingly collect personal information from children. If you
          believe a child has provided personal information, contact us and we will delete it.
        </P>

        <H2 id="security">8. Security</H2>
        <P>
          We use industry-standard security measures, including encrypted transport (TLS 1.2+),
          encrypted at-rest storage at our infrastructure providers, and least-privilege access
          controls. No system is perfectly secure; if we ever experience a breach affecting your
          data, we will notify you within 72 hours where required by law.
        </P>

        <H2 id="changes">9. Changes to this policy</H2>
        <P>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the
          top reflects the most recent change. Material changes will be announced on the
          homepage and via the newsletter at least 30 days before they take effect.
        </P>

        <H2 id="contact">10. Contact</H2>
        <P>
          For privacy questions or data requests:{" "}
          <A href="mailto:hello@utilityapps.site" external>hello@utilityapps.site</A>. For all
          other inquiries, see our <A href="/contact">contact page</A>.
        </P>
      </LegalPage>
    </>
  );
}
