"use client";

import { useMemo, useState } from "react";

import { LegalDocumentBuilder } from "@/components/legal-tools/LegalDocumentBuilder";
import {
  FieldCheckbox,
  FieldSelect,
  FieldText,
  FieldTextarea,
  FormSection,
} from "@/components/legal-tools/fields";
import { formatLongDate, type LegalDocument } from "@/lib/legalDocs";

type Jurisdiction = "us" | "eu" | "uk" | "ca" | "au" | "global";

const JURISDICTIONS: { value: Jurisdiction; label: string }[] = [
  { value: "global", label: "Global (default — covers EU + US baseline)" },
  { value: "us", label: "United States (CCPA / state laws)" },
  { value: "eu", label: "European Union (GDPR)" },
  { value: "uk", label: "United Kingdom (UK GDPR + DPA 2018)" },
  { value: "ca", label: "Canada (PIPEDA)" },
  { value: "au", label: "Australia (Privacy Act)" },
];

export function PrivacyPolicyGenerator() {
  const [company, setCompany] = useState("Acme Inc.");
  const [website, setWebsite] = useState("https://example.com");
  const [email, setEmail] = useState("privacy@example.com");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("global");
  const [collectsAccount, setCollectsAccount] = useState(true);
  const [collectsPayment, setCollectsPayment] = useState(false);
  const [usesCookies, setUsesCookies] = useState(true);
  const [usesAnalytics, setUsesAnalytics] = useState(true);
  const [usesMarketingEmail, setUsesMarketingEmail] = useState(false);
  const [usesAds, setUsesAds] = useState(false);
  const [thirdParties, setThirdParties] = useState(
    "Stripe (payments), Google Analytics (analytics), Mailchimp (email)"
  );

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];
    const isEU = jurisdiction === "eu" || jurisdiction === "uk" || jurisdiction === "global";
    const isUS = jurisdiction === "us" || jurisdiction === "global";

    sections.push({
      heading: "Introduction",
      body: [
        `This Privacy Policy explains how ${company} ("we", "us", or "our") collects, uses, and protects personal information you provide when you visit ${website} or use our services.`,
        `We are committed to handling your data responsibly. If you have any questions about this policy or our data practices, contact us at ${email}.`,
      ],
    });

    const collected: string[] = [];
    if (collectsAccount) {
      collected.push("Account information you provide (name, email address, password, profile details).");
    }
    if (collectsPayment) {
      collected.push("Payment information — handled by our payment processor; we do not store full card details on our servers.");
    }
    collected.push("Technical data automatically collected when you visit our service (IP address, browser type, device information, pages visited, timestamps).");
    if (usesCookies) {
      collected.push("Cookies and similar tracking technologies (see our Cookie Policy for details).");
    }
    if (usesMarketingEmail) {
      collected.push("Email address and communication preferences when you subscribe to our newsletter or marketing emails.");
    }
    sections.push({
      heading: "Information we collect",
      body: [
        "We collect the following categories of information when you use our service:",
        { type: "list", items: collected },
      ],
    });

    const purposes: string[] = [
      "To provide, operate, and improve our service.",
      "To respond to your enquiries and provide customer support.",
      "To detect, prevent, and address technical issues, fraud, and abuse.",
      "To comply with legal obligations.",
    ];
    if (collectsAccount) purposes.push("To create and manage your account.");
    if (collectsPayment) purposes.push("To process payments and send receipts.");
    if (usesAnalytics) purposes.push("To analyse usage and improve features (aggregated, where possible).");
    if (usesMarketingEmail) purposes.push("To send marketing and product updates, where you have opted in.");
    if (usesAds) purposes.push("To deliver and measure online advertising.");

    sections.push({
      heading: "How we use your information",
      body: [
        "We use the information we collect for the following purposes:",
        { type: "list", items: purposes },
      ],
    });

    if (isEU) {
      sections.push({
        heading: "Legal basis for processing (EU/UK users)",
        body: [
          "Under the GDPR (and UK GDPR), we rely on the following legal bases:",
          {
            type: "list",
            items: [
              "Contract — to provide the service you have signed up for.",
              "Consent — for marketing emails and non-essential cookies, where you have opted in.",
              "Legitimate interests — to operate, secure, and improve our service, where this does not override your rights.",
              "Legal obligation — to comply with tax, accounting, and other legal requirements.",
            ],
          },
        ],
      });
    }

    const sharing: string[] = [
      "Service providers acting on our behalf (hosting, analytics, payment processing, customer support) under appropriate confidentiality and data-processing terms.",
    ];
    if (thirdParties.trim()) {
      sharing.push(`Specifically: ${thirdParties.trim()}.`);
    }
    sharing.push("Authorities and other parties where required by law, to enforce our terms, or to protect rights, property, or safety.");
    sharing.push("Other parties in connection with a merger, acquisition, or sale of all or part of our assets, with notice to you.");
    sections.push({
      heading: "How we share your information",
      body: [
        "We do not sell your personal information. We share it only in the following circumstances:",
        { type: "list", items: sharing },
      ],
    });

    if (usesCookies) {
      sections.push({
        heading: "Cookies and tracking",
        body: [
          "We use cookies and similar technologies to operate the service, remember your preferences, and (where you consent) measure usage and serve relevant content.",
          "You can control cookies through your browser settings. Disabling some cookies may affect functionality.",
        ],
      });
    }

    sections.push({
      heading: "Data retention",
      body: [
        "We retain personal information only as long as necessary to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements.",
        collectsAccount
          ? "Account data is retained while your account is active and for a reasonable period after deletion for backup, fraud-prevention, and legal-compliance reasons."
          : "Where we collect personal data through contact forms or enquiries, we retain it only for as long as needed to respond and meet any legal record-keeping requirements.",
      ],
    });

    if (isEU) {
      sections.push({
        heading: "Your rights (EU/UK users)",
        body: [
          "If you are in the EU or UK, you have the following rights regarding your personal data:",
          {
            type: "list",
            items: [
              "Access — request a copy of the personal data we hold about you.",
              "Rectification — correct inaccurate or incomplete data.",
              "Erasure — ask us to delete your data, subject to legal exceptions.",
              "Restriction — ask us to limit how we process your data.",
              "Portability — receive your data in a machine-readable format.",
              "Objection — object to processing based on legitimate interests, or to direct marketing at any time.",
              "Withdraw consent — where processing is based on consent, withdraw it at any time.",
              "Complain to a supervisory authority — your national data protection regulator.",
            ],
          },
          `To exercise any of these rights, contact us at ${email}.`,
        ],
      });
    }

    if (isUS) {
      sections.push({
        heading: "Your rights (US users)",
        body: [
          "Depending on the US state you live in (California, Colorado, Virginia, Connecticut, Utah, and others), you may have the right to:",
          {
            type: "list",
            items: [
              "Know what personal information we collect, sell, or disclose.",
              "Request deletion of your personal information.",
              "Opt out of the sale or sharing of your personal information.",
              "Correct inaccurate personal information.",
              "Non-discrimination for exercising your rights.",
            ],
          },
          `To exercise any of these rights, contact us at ${email}. We will verify your identity before responding.`,
        ],
      });
    }

    sections.push({
      heading: "Security",
      body: [
        "We use industry-standard administrative, technical, and physical safeguards designed to protect your personal information against unauthorised access, alteration, disclosure, or destruction. No method of transmission over the internet is fully secure; we cannot guarantee absolute security.",
      ],
    });

    sections.push({
      heading: "Children",
      body: [
        "Our service is not directed to children under 13 (or under 16 in the EU/UK). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.",
      ],
    });

    sections.push({
      heading: "International transfers",
      body: [
        "Our service may be operated from, and data processed in, countries other than your own. Where we transfer personal data internationally, we use appropriate safeguards such as Standard Contractual Clauses or equivalent mechanisms.",
      ],
    });

    sections.push({
      heading: "Changes to this policy",
      body: [
        "We may update this Privacy Policy from time to time. We will post the updated version on this page with a new effective date. Material changes will be communicated by email or service notification where appropriate.",
      ],
    });

    sections.push({
      heading: "Contact us",
      body: [
        `For privacy questions, requests, or complaints, contact us at ${email}.`,
        `${company}`,
      ],
    });

    return {
      title: "Privacy Policy",
      subtitle: company,
      effectiveLine: `Effective: ${formatLongDate()}`,
      sections,
    };
  }, [
    company,
    website,
    email,
    jurisdiction,
    collectsAccount,
    collectsPayment,
    usesCookies,
    usesAnalytics,
    usesMarketingEmail,
    usesAds,
    thirdParties,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Business">
        <FieldText label="Company / brand name" value={company} onChange={setCompany} required />
        <FieldText label="Website URL" value={website} onChange={setWebsite} type="url" />
        <FieldText label="Privacy contact email" value={email} onChange={setEmail} type="email" required />
        <FieldSelect
          label="Primary jurisdiction"
          help="Picks which rights and legal-basis language to include."
          value={jurisdiction}
          onChange={setJurisdiction}
          options={JURISDICTIONS}
        />
      </FormSection>

      <FormSection title="Data you collect">
        <FieldCheckbox
          label="User accounts (name, email, password)"
          checked={collectsAccount}
          onChange={setCollectsAccount}
        />
        <FieldCheckbox
          label="Payments (handled by a third-party processor)"
          checked={collectsPayment}
          onChange={setCollectsPayment}
        />
        <FieldCheckbox
          label="Cookies / similar tracking"
          checked={usesCookies}
          onChange={setUsesCookies}
        />
        <FieldCheckbox
          label="Analytics (Google Analytics, Plausible, etc.)"
          checked={usesAnalytics}
          onChange={setUsesAnalytics}
        />
        <FieldCheckbox
          label="Marketing email / newsletter"
          checked={usesMarketingEmail}
          onChange={setUsesMarketingEmail}
        />
        <FieldCheckbox
          label="Advertising / ad networks"
          checked={usesAds}
          onChange={setUsesAds}
        />
      </FormSection>

      <FormSection title="Third parties">
        <FieldTextarea
          label="Named processors (comma-separated)"
          help="GDPR requires you to disclose major processors. List the obvious ones."
          value={thirdParties}
          onChange={setThirdParties}
          rows={2}
          placeholder="Stripe (payments), Google Analytics (analytics), …"
        />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder toolId="privacy-policy-generator" form={form} document={document} filenamePrefix="privacy-policy" />;
}
