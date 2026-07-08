"use client";

import { useMemo, useState } from "react";

import { LegalDocumentBuilder } from "@/components/legal-tools/LegalDocumentBuilder";
import {
  FieldSelect,
  FieldText,
  FieldTextarea,
  FormSection,
} from "@/components/legal-tools/fields";
import { formatLongDate, type LegalDocument } from "@/lib/legalDocs";

type RequestType =
  | "access"
  | "erasure"
  | "rectification"
  | "portability"
  | "restriction"
  | "objection";

const REQUEST_TYPES: { value: RequestType; label: string }[] = [
  { value: "access", label: "Access (Article 15) — get a copy of my data" },
  { value: "erasure", label: "Erasure (Article 17) — delete my data" },
  { value: "rectification", label: "Rectification (Article 16) — correct my data" },
  { value: "portability", label: "Portability (Article 20) — give me a machine-readable copy" },
  { value: "restriction", label: "Restriction (Article 18) — pause processing" },
  { value: "objection", label: "Objection (Article 21) — stop marketing / object to processing" },
];

const REQUEST_DESCRIPTIONS: Record<RequestType, string> = {
  access:
    "I request a copy of all personal data you hold about me, in accordance with my right of access under Article 15 of the GDPR. Please provide: the categories of personal data processed; the purposes of processing; the recipients or categories of recipients to whom my data has been disclosed; the retention periods; the source of the data if not collected from me; and a copy of the personal data undergoing processing.",
  erasure:
    'I request the erasure of all personal data you hold about me, in accordance with my right to erasure ("right to be forgotten") under Article 17 of the GDPR. The grounds for this request are that the personal data is no longer necessary for the purposes for which it was collected, and/or I withdraw any consent on which the processing was based, and/or I object to processing under Article 21.',
  rectification:
    "I request that you correct inaccurate personal data you hold about me, in accordance with my right to rectification under Article 16 of the GDPR. Please see the details below for the specific information that should be corrected.",
  portability:
    "I request a copy of all personal data I have provided to you, in a structured, commonly used, and machine-readable format (e.g. JSON, CSV, XML), in accordance with my right to data portability under Article 20 of the GDPR.",
  restriction:
    "I request that you restrict the processing of my personal data, in accordance with my right to restriction under Article 18 of the GDPR. The restriction should remain in place until I have confirmed the grounds for processing or, where applicable, until any outstanding issues are resolved.",
  objection:
    "I object to the processing of my personal data, in accordance with my right to object under Article 21 of the GDPR. If the processing is for direct marketing purposes, I exercise my absolute right to object under Article 21(2) and require that processing for these purposes ceases immediately.",
};

export function GdprRequestLetter() {
  const [requestType, setRequestType] = useState<RequestType>("access");
  const [yourName, setYourName] = useState("Jane Doe");
  const [yourAddress, setYourAddress] = useState("123 Main Street, London, EC1A 1BB, UK");
  const [yourEmail, setYourEmail] = useState("jane@example.com");
  const [accountIdentifier, setAccountIdentifier] = useState(
    "My customer account is associated with the email jane@example.com."
  );
  const [recipientCompany, setRecipientCompany] = useState("Acme Inc.");
  const [recipientAddress, setRecipientAddress] = useState(
    "Data Protection Officer, Acme Inc., 456 Corporate Blvd, Dublin 2, Ireland"
  );
  const [recipientEmail, setRecipientEmail] = useState("privacy@acme.example");
  const [specificData, setSpecificData] = useState("");

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "Recipient",
      body: [
        `To: Data Protection Officer / Privacy Team`,
        recipientCompany,
        recipientAddress,
        `Via email: ${recipientEmail}`,
      ],
    });

    sections.push({
      heading: "Subject",
      body: [
        `Data Subject Request — ${REQUEST_TYPES.find((r) => r.value === requestType)?.label.split(" — ")[0]}`,
      ],
    });

    sections.push({
      heading: "Introduction",
      body: [
        `Dear Sir/Madam,`,
        `I am writing to make a formal request as a data subject under the EU/UK General Data Protection Regulation (the "GDPR").`,
      ],
    });

    sections.push({
      heading: "1. My request",
      body: [REQUEST_DESCRIPTIONS[requestType]],
    });

    if (specificData.trim()) {
      sections.push({
        heading: "2. Specific data this request relates to",
        body: [specificData],
      });
    }

    sections.push({
      heading: specificData.trim() ? "3. My identity" : "2. My identity",
      body: [
        `My name: ${yourName}`,
        `Address: ${yourAddress}`,
        `Email: ${yourEmail}`,
        accountIdentifier,
        "I include the above information to help you identify my records. Please request additional identity verification only if it is strictly necessary to fulfil this request, and provide reasoning if so.",
      ],
    });

    const nextNum = specificData.trim() ? 4 : 3;
    sections.push({
      heading: `${nextNum}. Response timeline`,
      body: [
        "Please confirm receipt of this request promptly. Under Article 12(3) of the GDPR you are required to provide a response without undue delay and in any event within one calendar month of receipt. If you require an extension, you must notify me within that period and explain the reasons.",
        "If you do not intend to comply, please explain your reasons and inform me of my right to complain to a supervisory authority and to seek a judicial remedy.",
      ],
    });

    sections.push({
      heading: `${nextNum + 1}. Format and delivery`,
      body: [
        requestType === "portability"
          ? "Please provide the data in a structured, commonly used, machine-readable format (e.g. JSON or CSV) via secure download or email attachment."
          : `Please send your response by email to ${yourEmail}, and where applicable include a written summary.`,
      ],
    });

    sections.push({
      heading: `${nextNum + 2}. No fee`,
      body: [
        "Article 12(5) of the GDPR provides that responses to data subject requests must be provided free of charge, except where requests are manifestly unfounded, excessive, or repetitive. I do not consider this request to fall within those categories.",
      ],
    });

    sections.push({
      heading: `${nextNum + 3}. Closing`,
      body: [
        "Thank you for your prompt attention to this request.",
        "",
        "Yours faithfully,",
        yourName,
        `Dated: ${formatLongDate()}`,
      ],
    });

    return {
      title: "GDPR Data Subject Request",
      subtitle: `From ${yourName} to ${recipientCompany}`,
      effectiveLine: `Dated: ${formatLongDate()}`,
      sections,
    };
  }, [
    requestType,
    yourName,
    yourAddress,
    yourEmail,
    accountIdentifier,
    recipientCompany,
    recipientAddress,
    recipientEmail,
    specificData,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Request type">
        <FieldSelect
          label="Which GDPR right are you exercising?"
          value={requestType}
          onChange={setRequestType}
          options={REQUEST_TYPES}
        />
      </FormSection>

      <FormSection title="You (the data subject)">
        <FieldText label="Full legal name" value={yourName} onChange={setYourName} required />
        <FieldTextarea label="Postal address" value={yourAddress} onChange={setYourAddress} rows={2} />
        <FieldText label="Email" value={yourEmail} onChange={setYourEmail} type="email" required />
        <FieldTextarea
          label="How they can identify your account"
          help="e.g. customer number, registered email, order ID. The more they can tie you to a record, the less likely they ask for ID."
          value={accountIdentifier}
          onChange={setAccountIdentifier}
          rows={2}
        />
      </FormSection>

      <FormSection title="Recipient">
        <FieldText label="Company name" value={recipientCompany} onChange={setRecipientCompany} required />
        <FieldTextarea
          label="Postal address"
          help="The company's data protection contact; check their privacy policy for the right address."
          value={recipientAddress}
          onChange={setRecipientAddress}
          rows={2}
        />
        <FieldText label="Privacy / DPO email" value={recipientEmail} onChange={setRecipientEmail} type="email" required />
      </FormSection>

      {(requestType === "rectification" || requestType === "erasure" || requestType === "objection") && (
        <FormSection title="Specific data (optional)">
          <FieldTextarea
            label={
              requestType === "rectification"
                ? "What needs correcting?"
                : requestType === "erasure"
                ? "Specific records you want deleted (optional)"
                : "Specific processing you're objecting to (e.g. direct marketing)"
            }
            value={specificData}
            onChange={setSpecificData}
            rows={3}
          />
        </FormSection>
      )}
    </div>
  );

  return <LegalDocumentBuilder toolId="gdpr-request-letter" form={form} document={document} filenamePrefix="gdpr-request" />;
}
