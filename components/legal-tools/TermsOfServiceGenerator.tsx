"use client";

import { useMemo, useState } from "react";

import { LegalDocumentBuilder } from "@/components/legal-tools/LegalDocumentBuilder";
import {
  FieldCheckbox,
  FieldSelect,
  FieldText,
  FormSection,
} from "@/components/legal-tools/fields";
import { formatLongDate, type LegalDocument } from "@/lib/legalDocs";

type ServiceType = "saas" | "ecommerce" | "marketplace" | "content" | "app";

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: "saas", label: "SaaS / web app (subscription or freemium)" },
  { value: "ecommerce", label: "E-commerce / online store" },
  { value: "marketplace", label: "Marketplace (multiple sellers)" },
  { value: "content", label: "Content site / blog / publication" },
  { value: "app", label: "Mobile app" },
];

const JURISDICTIONS = [
  { value: "delaware", label: "Delaware, USA" },
  { value: "california", label: "California, USA" },
  { value: "new-york", label: "New York, USA" },
  { value: "england", label: "England and Wales, UK" },
  { value: "ontario", label: "Ontario, Canada" },
  { value: "ireland", label: "Republic of Ireland" },
  { value: "singapore", label: "Singapore" },
  { value: "australia", label: "Australia" },
];

export function TermsOfServiceGenerator() {
  const [company, setCompany] = useState("Acme Inc.");
  const [website, setWebsite] = useState("https://example.com");
  const [email, setEmail] = useState("support@example.com");
  const [serviceType, setServiceType] = useState<ServiceType>("saas");
  const [jurisdiction, setJurisdiction] = useState<string>("delaware");
  const [minAge, setMinAge] = useState("13");
  const [hasFreeTrial, setHasFreeTrial] = useState(false);
  const [hasArbitration, setHasArbitration] = useState(false);
  const [hasUserContent, setHasUserContent] = useState(false);

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];
    const jurisdictionLabel = JURISDICTIONS.find((j) => j.value === jurisdiction)?.label ?? jurisdiction;

    sections.push({
      heading: "Acceptance of terms",
      body: [
        `These Terms of Service ("Terms") govern your use of ${website} (the "Service") provided by ${company} ("we", "us", or "our"). By accessing or using the Service, you agree to be bound by these Terms.`,
        `If you do not agree to these Terms, you may not access or use the Service.`,
      ],
    });

    sections.push({
      heading: "Eligibility",
      body: [
        `You must be at least ${minAge} years old to use the Service. By using the Service, you represent and warrant that you meet this requirement and have the legal capacity to enter into these Terms.`,
      ],
    });

    sections.push({
      heading: "Accounts",
      body: [
        "When you create an account, you agree to provide accurate information and keep it up to date. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.",
        `Notify us immediately at ${email} if you suspect any unauthorised access to your account.`,
      ],
    });

    if (hasFreeTrial) {
      sections.push({
        heading: "Free trial",
        body: [
          "If we offer a free trial, the trial is provided as-is for the period stated at signup. You may be required to provide payment information; we will not charge you until the trial ends, and we will give reasonable notice before doing so.",
          "You may cancel the trial at any time before it ends without being charged.",
        ],
      });
    }

    if (serviceType === "saas" || serviceType === "app") {
      sections.push({
        heading: "Subscriptions and billing",
        body: [
          "Paid plans are billed in advance on a recurring basis (monthly or annual). By providing payment information, you authorise us to charge the applicable fees on the schedule shown at signup.",
          "Fees are non-refundable except where required by law or explicitly stated. You can cancel at any time; cancellation takes effect at the end of the current billing period.",
        ],
      });
    }

    if (serviceType === "ecommerce" || serviceType === "marketplace") {
      sections.push({
        heading: "Orders, pricing and returns",
        body: [
          "All orders are subject to acceptance and availability. We reserve the right to refuse any order, including for suspected fraud or pricing errors.",
          "Prices are shown at checkout and exclude applicable taxes and shipping fees unless stated. Our return and refund policy is published separately and forms part of these Terms.",
        ],
      });
    }

    sections.push({
      heading: "Acceptable use",
      body: [
        "You agree not to use the Service to:",
        {
          type: "list",
          items: [
            "Violate any law or regulation, or infringe any third-party right.",
            "Upload or transmit malicious code, viruses, or harmful data.",
            "Reverse engineer, scrape, or attempt unauthorised access to the Service.",
            "Impersonate another person, misrepresent your affiliation, or harass other users.",
            "Use the Service in a way that disrupts or burdens it disproportionately.",
          ],
        },
        "We may suspend or terminate accounts that violate these rules.",
      ],
    });

    sections.push({
      heading: "Intellectual property",
      body: [
        `All content, code, designs, logos, and trademarks of the Service are owned by ${company} or our licensors and are protected by intellectual property laws.`,
        "We grant you a limited, non-exclusive, non-transferable, revocable licence to use the Service for its intended purpose. No other rights are granted.",
      ],
    });

    if (hasUserContent || serviceType === "marketplace" || serviceType === "content") {
      sections.push({
        heading: "User content",
        body: [
          "If the Service allows you to submit content (posts, listings, comments, files), you retain ownership of that content but grant us a worldwide, non-exclusive, royalty-free licence to host, display, and distribute it as needed to operate the Service.",
          "You are responsible for the content you submit and warrant that you have the right to share it and that it does not violate any law or third-party right. We may remove content that violates these Terms.",
        ],
      });
    }

    sections.push({
      heading: "Third-party services",
      body: [
        "The Service may link to or integrate with third-party services. We are not responsible for the content, policies, or practices of any third party. Your use of third-party services is governed by their own terms.",
      ],
    });

    sections.push({
      heading: "Disclaimers",
      body: [
        'The Service is provided "AS IS" and "AS AVAILABLE", without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
        "We do not warrant that the Service will be uninterrupted, error-free, or secure, or that any defects will be corrected.",
      ],
    });

    sections.push({
      heading: "Limitation of liability",
      body: [
        `To the maximum extent permitted by law, ${company} will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or use, arising out of or related to the Service.`,
        "Our total liability for any claim arising from these Terms or the Service will not exceed the greater of (a) the amount you paid us in the twelve months before the claim arose, or (b) USD 100.",
      ],
    });

    sections.push({
      heading: "Indemnification",
      body: [
        `You agree to indemnify and hold ${company} harmless from any claims, losses, liabilities, damages, costs, and expenses (including reasonable legal fees) arising from your use of the Service, your content, or your breach of these Terms.`,
      ],
    });

    sections.push({
      heading: "Termination",
      body: [
        "We may suspend or terminate your access to the Service at any time, for any reason, with or without notice, including if we believe you have violated these Terms.",
        "Upon termination, your right to use the Service ends. Sections of these Terms that by their nature should survive termination (intellectual property, disclaimers, limitation of liability, indemnification, dispute resolution) will continue to apply.",
      ],
    });

    sections.push({
      heading: "Changes to these Terms",
      body: [
        "We may modify these Terms from time to time. We will post the updated version on this page with a new effective date. Material changes will be notified by email or in-product notice. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.",
      ],
    });

    sections.push({
      heading: "Governing law",
      body: [
        `These Terms are governed by the laws of ${jurisdictionLabel}, without regard to its conflict-of-laws principles.`,
      ],
    });

    if (hasArbitration) {
      sections.push({
        heading: "Dispute resolution and arbitration",
        body: [
          "You and we agree to attempt to resolve any dispute through good-faith negotiation before initiating any formal proceeding.",
          `Any dispute not resolved by negotiation will be finally settled by binding arbitration administered by an established arbitration body under its rules, seated in ${jurisdictionLabel}. The arbitration will be conducted in English. Either party may seek injunctive relief in court for intellectual property matters.`,
          "Class actions are not permitted. You waive any right to participate in a class arbitration or class action against us.",
        ],
      });
    } else {
      sections.push({
        heading: "Dispute resolution",
        body: [
          `Any dispute arising from these Terms or the Service will be brought exclusively in the courts located in ${jurisdictionLabel}, and you consent to the personal jurisdiction of those courts.`,
        ],
      });
    }

    sections.push({
      heading: "Miscellaneous",
      body: [
        "If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue in full force.",
        "Our failure to enforce a provision is not a waiver of our right to enforce it later.",
        "These Terms constitute the entire agreement between you and us regarding the Service and supersede any prior agreements on the same subject.",
      ],
    });

    sections.push({
      heading: "Contact",
      body: [
        `If you have questions about these Terms, contact us at ${email}.`,
        company,
      ],
    });

    return {
      title: "Terms of Service",
      subtitle: company,
      effectiveLine: `Effective: ${formatLongDate()}`,
      sections,
    };
  }, [
    company,
    website,
    email,
    serviceType,
    jurisdiction,
    minAge,
    hasFreeTrial,
    hasArbitration,
    hasUserContent,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Business">
        <FieldText label="Company / brand name" value={company} onChange={setCompany} required />
        <FieldText label="Website URL" value={website} onChange={setWebsite} type="url" />
        <FieldText label="Support email" value={email} onChange={setEmail} type="email" required />
      </FormSection>

      <FormSection title="Your service">
        <FieldSelect label="Service type" value={serviceType} onChange={setServiceType} options={SERVICE_TYPES} />
        <FieldSelect label="Governing law" value={jurisdiction} onChange={setJurisdiction} options={JURISDICTIONS} />
        <FieldText
          label="Minimum age"
          help="13 is the COPPA threshold in the US; 16 is GDPR for marketing emails."
          value={minAge}
          onChange={setMinAge}
          type="number"
        />
      </FormSection>

      <FormSection title="Optional clauses">
        <FieldCheckbox
          label="Include free trial section"
          checked={hasFreeTrial}
          onChange={setHasFreeTrial}
        />
        <FieldCheckbox
          label="Include user-generated-content licence"
          help="If users can post comments, listings, or upload files."
          checked={hasUserContent}
          onChange={setHasUserContent}
        />
        <FieldCheckbox
          label="Mandatory binding arbitration + class action waiver"
          help="Common for US SaaS; check with a lawyer — these are aggressive clauses."
          checked={hasArbitration}
          onChange={setHasArbitration}
        />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder form={form} document={document} filenamePrefix="terms-of-service" />;
}
