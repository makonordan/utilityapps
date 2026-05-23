"use client";

import { useMemo, useState } from "react";

import { LegalDocumentBuilder } from "@/components/legal-tools/LegalDocumentBuilder";
import {
  FieldCheckbox,
  FieldText,
  FieldTextarea,
  FormSection,
} from "@/components/legal-tools/fields";
import { formatLongDate, type LegalDocument } from "@/lib/legalDocs";

export function CookiePolicyGenerator() {
  const [company, setCompany] = useState("Acme Inc.");
  const [website, setWebsite] = useState("https://example.com");
  const [email, setEmail] = useState("privacy@example.com");
  const [hasNecessary, setHasNecessary] = useState(true);
  const [hasPreference, setHasPreference] = useState(true);
  const [hasAnalytics, setHasAnalytics] = useState(true);
  const [hasAdvertising, setHasAdvertising] = useState(false);
  const [hasSocial, setHasSocial] = useState(false);
  const [analyticsProviders, setAnalyticsProviders] = useState("Google Analytics");
  const [advertisingProviders, setAdvertisingProviders] = useState("Google Ads, Meta Pixel");
  const [hasConsentBanner, setHasConsentBanner] = useState(true);

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "What are cookies?",
      body: [
        `This Cookie Policy explains how ${company} ("we") uses cookies and similar technologies on ${website}.`,
        "Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, to remember preferences, and to provide analytics and advertising functionality.",
        'We also use other tracking technologies sometimes called "similar technologies", which include pixel tags, web beacons, local storage, and SDKs. For simplicity, this policy refers to all of these as "cookies".',
      ],
    });

    sections.push({
      heading: "How we use cookies",
      body: [
        "We use cookies for the following purposes, grouped into the categories below. You can control most categories through your browser settings or, where available, our consent banner.",
      ],
    });

    const categories: { type: "list"; items: string[] }[] = [];
    if (hasNecessary) {
      categories.push({
        type: "list",
        items: [
          "Strictly necessary cookies — required for the site to function. These include session cookies, security tokens, and load-balancing cookies. They do not require consent because the site cannot work without them.",
        ],
      });
    }
    if (hasPreference) {
      categories.push({
        type: "list",
        items: [
          "Preference cookies — remember choices you make (language, theme, region) so we can personalise your experience. Without them you would need to re-set preferences on every visit.",
        ],
      });
    }
    if (hasAnalytics) {
      categories.push({
        type: "list",
        items: [
          `Analytics cookies — measure how visitors use the site, which pages are popular, and how features perform. We use the following analytics services: ${analyticsProviders}. Where required, we ask for your consent before setting these cookies.`,
        ],
      });
    }
    if (hasAdvertising) {
      categories.push({
        type: "list",
        items: [
          `Advertising cookies — used by us and partners to deliver relevant advertising and measure ad performance. We use the following ad services: ${advertisingProviders}. These require your consent in the EU/UK and may be subject to opt-out rights in California and other US states.`,
        ],
      });
    }
    if (hasSocial) {
      categories.push({
        type: "list",
        items: [
          "Social media cookies — set by embedded social media widgets (Facebook, LinkedIn, X/Twitter, YouTube). They enable you to share content and may be used by the social networks for their own purposes.",
        ],
      });
    }

    sections.push({
      heading: "Cookie categories we use",
      body: categories,
    });

    if (hasConsentBanner) {
      sections.push({
        heading: "How to manage cookies on this site",
        body: [
          "When you first visit the site, our consent banner asks which cookie categories you want to allow. You can change your preferences at any time through the cookie settings link in the page footer.",
          "You can also block or delete cookies through your browser settings. Most browsers let you refuse cookies entirely or be notified before they are set. Useful links: chrome://settings/cookies, edge://settings/cookies, about:preferences#privacy (Firefox), Safari → Preferences → Privacy.",
          "Disabling strictly necessary cookies may prevent the site from working correctly.",
        ],
      });
    } else {
      sections.push({
        heading: "How to manage cookies",
        body: [
          "You can block or delete cookies through your browser settings. Most browsers let you refuse cookies entirely or be notified before they are set.",
          "Useful links: chrome://settings/cookies, edge://settings/cookies, about:preferences#privacy (Firefox), Safari → Preferences → Privacy.",
          "Disabling strictly necessary cookies may prevent the site from working correctly.",
        ],
      });
    }

    sections.push({
      heading: "Cookies set by third parties",
      body: [
        "Some cookies on our site are set by third parties (analytics providers, ad networks, embedded video players). We do not control these cookies; the third party's privacy policy applies. We list the major providers below:",
        {
          type: "list",
          items: [
            ...(hasAnalytics ? [`Analytics: ${analyticsProviders}`] : []),
            ...(hasAdvertising ? [`Advertising: ${advertisingProviders}`] : []),
            ...(hasSocial ? ["Social: Facebook, LinkedIn, X/Twitter, YouTube (where embedded)"] : []),
          ],
        },
      ],
    });

    sections.push({
      heading: "Your rights",
      body: [
        "EU/UK users (GDPR + ePrivacy): you have the right to refuse non-essential cookies, to withdraw consent at any time, and to access, correct, or delete personal data we hold.",
        "California users (CCPA): you have the right to opt out of the sale or sharing of personal information collected through cookies.",
        `To exercise any of these rights, contact us at ${email}.`,
      ],
    });

    sections.push({
      heading: "Changes to this policy",
      body: [
        "We may update this Cookie Policy from time to time to reflect changes in our practices or applicable law. We will post the updated version on this page with a new effective date.",
      ],
    });

    sections.push({
      heading: "Contact",
      body: [
        `Questions about our use of cookies? Email ${email}.`,
        company,
      ],
    });

    return {
      title: "Cookie Policy",
      subtitle: company,
      effectiveLine: `Effective: ${formatLongDate()}`,
      sections,
    };
  }, [
    company,
    website,
    email,
    hasNecessary,
    hasPreference,
    hasAnalytics,
    hasAdvertising,
    hasSocial,
    analyticsProviders,
    advertisingProviders,
    hasConsentBanner,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Business">
        <FieldText label="Company / brand name" value={company} onChange={setCompany} required />
        <FieldText label="Website URL" value={website} onChange={setWebsite} type="url" />
        <FieldText label="Privacy contact email" value={email} onChange={setEmail} type="email" required />
      </FormSection>

      <FormSection title="Cookie categories you use">
        <FieldCheckbox label="Strictly necessary (sessions, security)" checked={hasNecessary} onChange={setHasNecessary} />
        <FieldCheckbox label="Preferences (language, theme)" checked={hasPreference} onChange={setHasPreference} />
        <FieldCheckbox label="Analytics" checked={hasAnalytics} onChange={setHasAnalytics} />
        <FieldCheckbox label="Advertising" checked={hasAdvertising} onChange={setHasAdvertising} />
        <FieldCheckbox label="Social media (embedded widgets)" checked={hasSocial} onChange={setHasSocial} />
        <FieldCheckbox label="I show a cookie consent banner" checked={hasConsentBanner} onChange={setHasConsentBanner} />
      </FormSection>

      {(hasAnalytics || hasAdvertising) && (
        <FormSection title="Third-party providers">
          {hasAnalytics && (
            <FieldTextarea
              label="Analytics providers"
              value={analyticsProviders}
              onChange={setAnalyticsProviders}
              rows={2}
              placeholder="Google Analytics, Plausible, …"
            />
          )}
          {hasAdvertising && (
            <FieldTextarea
              label="Advertising providers"
              value={advertisingProviders}
              onChange={setAdvertisingProviders}
              rows={2}
              placeholder="Google Ads, Meta Pixel, …"
            />
          )}
        </FormSection>
      )}
    </div>
  );

  return <LegalDocumentBuilder form={form} document={document} filenamePrefix="cookie-policy" />;
}
