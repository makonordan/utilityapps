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

type ClaimType =
  | "trademark"
  | "copyright"
  | "defamation"
  | "harassment"
  | "contract-breach"
  | "other";

const CLAIM_TYPES: { value: ClaimType; label: string }[] = [
  { value: "trademark", label: "Trademark infringement" },
  { value: "copyright", label: "Copyright infringement" },
  { value: "defamation", label: "Defamation / libel" },
  { value: "harassment", label: "Harassment" },
  { value: "contract-breach", label: "Breach of contract" },
  { value: "other", label: "Other" },
];

const CLAIM_INTROS: Record<ClaimType, string> = {
  trademark:
    "Your conduct constitutes infringement of my registered trademark and creates a likelihood of consumer confusion as to the source or sponsorship of the goods or services in question.",
  copyright:
    "Your conduct constitutes infringement of my copyright in original works of authorship that I created and own.",
  defamation:
    "Your statements are false statements of fact about me, made with knowledge of their falsity or with reckless disregard for the truth, and have caused damage to my reputation.",
  harassment:
    "Your conduct constitutes harassment, causing me distress and constituting unwanted contact and intimidation that I have asked you to stop.",
  "contract-breach":
    "Your conduct constitutes a material breach of our written agreement and a failure to perform the obligations to which you are bound.",
  other:
    "Your conduct constitutes an unlawful interference with my rights as described above.",
};

const CLAIM_DEMANDS: Record<ClaimType, string[]> = {
  trademark: [
    "Immediately cease all use of my trademark and any confusingly similar mark.",
    "Remove all infringing materials from your websites, social media, advertising, packaging, and other channels.",
    "Provide written confirmation within the deadline below that you have complied.",
    "Account for any revenue derived from the infringing use.",
  ],
  copyright: [
    "Immediately cease all use, reproduction, distribution, and display of my copyrighted works.",
    "Remove all infringing materials from your websites, social media, and any other channels under your control.",
    "Destroy or return any copies in your possession.",
    "Provide written confirmation within the deadline below that you have complied.",
  ],
  defamation: [
    "Immediately remove all defamatory statements from any platform under your control.",
    "Cease publishing or republishing the statements.",
    "Issue a written retraction in the same manner and to the same audience as the original publication.",
    "Provide written confirmation within the deadline below that you have complied.",
  ],
  harassment: [
    "Cease all contact with me, whether direct or indirect, including by phone, email, text, social media, in person, or through third parties.",
    "Do not approach me at my home, workplace, or elsewhere.",
    "Provide written confirmation within the deadline below that you understand and will comply.",
  ],
  "contract-breach": [
    "Cure the breach by performing the obligations as specified in our agreement.",
    "Provide written confirmation within the deadline below of the steps you have taken to cure the breach.",
    "Refrain from any further conduct in breach of the agreement.",
  ],
  other: [
    "Immediately cease the conduct described above.",
    "Take all reasonable steps to remedy any harm caused.",
    "Provide written confirmation within the deadline below that you have complied.",
  ],
};

export function CeaseAndDesistLetter() {
  // Sender
  const [yourName, setYourName] = useState("Jane Doe");
  const [yourAddress, setYourAddress] = useState("123 Main Street, San Francisco, CA 94105");
  const [yourEmail, setYourEmail] = useState("jane@example.com");

  // Recipient
  const [recipientName, setRecipientName] = useState("John Smith");
  const [recipientAddress, setRecipientAddress] = useState("789 Oak Avenue, Los Angeles, CA 90001");

  // Claim
  const [claimType, setClaimType] = useState<ClaimType>("trademark");
  const [conductDescription, setConductDescription] = useState(
    "On 15 April 2026, you began selling t-shirts under the name \"AcmeCo\" through your Shopify store at https://acmecocopy.example, using a logo nearly identical to my registered trademark."
  );
  const [datesAndPlaces, setDatesAndPlaces] = useState(
    "The infringing products have been available for sale at https://acmecocopy.example since at least 15 April 2026."
  );
  const [evidence, setEvidence] = useState(
    "Screenshots of the infringing listings have been preserved and are available on request."
  );
  const [deadlineDays, setDeadlineDays] = useState("14");

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "Recipient",
      body: [`To: ${recipientName}`, recipientAddress],
    });

    sections.push({
      heading: "Subject",
      body: [
        `Cease and Desist — ${CLAIM_TYPES.find((c) => c.value === claimType)?.label}`,
        `Dated: ${formatLongDate()}`,
      ],
    });

    sections.push({
      heading: "1. Notice",
      body: [
        `Dear ${recipientName},`,
        "This letter is a formal demand that you immediately cease and desist from the conduct described below. Please read it carefully and respond by the deadline indicated.",
      ],
    });

    sections.push({
      heading: "2. Description of the conduct",
      body: [
        "The conduct that gives rise to this letter is as follows:",
        conductDescription,
        datesAndPlaces,
      ],
    });

    sections.push({
      heading: "3. Legal basis",
      body: [
        CLAIM_INTROS[claimType],
        evidence ? `Evidence of the conduct: ${evidence}` : "",
      ].filter(Boolean) as string[],
    });

    sections.push({
      heading: "4. Required actions",
      body: [
        "You are required to:",
        { type: "list", items: CLAIM_DEMANDS[claimType] },
      ],
    });

    sections.push({
      heading: "5. Deadline",
      body: [
        `You have ${deadlineDays} days from the date of this letter to comply with the demands above and to provide written confirmation of your compliance to ${yourEmail}.`,
      ],
    });

    sections.push({
      heading: "6. Consequences of non-compliance",
      body: [
        "If you do not comply by the deadline, I reserve the right to take all available legal and equitable remedies, including but not limited to:",
        {
          type: "list",
          items: [
            "Filing a lawsuit seeking injunctive relief, damages, and recovery of legal costs.",
            "Reporting the conduct to relevant platforms, payment processors, or regulators.",
            "Seeking statutory damages where available.",
          ],
        },
        "This letter is sent without prejudice to my rights, all of which are expressly reserved.",
      ],
    });

    sections.push({
      heading: "7. Preservation of evidence",
      body: [
        "You are hereby on notice to preserve all documents, communications, electronic files, and other materials relating to the conduct described above. The destruction or alteration of such evidence after receipt of this letter may constitute spoliation and may be presented to a court.",
      ],
    });

    sections.push({
      heading: "8. Contact",
      body: [
        `Please direct your written response to ${yourEmail}.`,
        "I would prefer to resolve this matter amicably without legal action, but I am prepared to pursue all available remedies if necessary.",
        "",
        "Sincerely,",
        yourName,
        yourAddress,
        yourEmail,
      ],
    });

    return {
      title: "Cease and Desist Letter",
      subtitle: `From ${yourName} to ${recipientName}`,
      effectiveLine: `Dated: ${formatLongDate()}`,
      sections,
    };
  }, [
    yourName,
    yourAddress,
    yourEmail,
    recipientName,
    recipientAddress,
    claimType,
    conductDescription,
    datesAndPlaces,
    evidence,
    deadlineDays,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="You (the sender)">
        <FieldText label="Your name" value={yourName} onChange={setYourName} required />
        <FieldTextarea label="Your address" value={yourAddress} onChange={setYourAddress} rows={2} />
        <FieldText label="Email for replies" value={yourEmail} onChange={setYourEmail} type="email" required />
      </FormSection>

      <FormSection title="Recipient">
        <FieldText label="Recipient name" value={recipientName} onChange={setRecipientName} required />
        <FieldTextarea label="Recipient address" value={recipientAddress} onChange={setRecipientAddress} rows={2} />
      </FormSection>

      <FormSection title="The claim">
        <FieldSelect label="Type of claim" value={claimType} onChange={setClaimType} options={CLAIM_TYPES} />
        <FieldTextarea
          label="Describe the conduct"
          help="What they're doing that's wrongful. Be specific."
          value={conductDescription}
          onChange={setConductDescription}
          rows={3}
        />
        <FieldTextarea
          label="Dates and places"
          help="When and where the conduct happened (URLs, addresses, dates)."
          value={datesAndPlaces}
          onChange={setDatesAndPlaces}
          rows={2}
        />
        <FieldTextarea
          label="Evidence (optional)"
          help="Note any screenshots, records, or witnesses you can produce."
          value={evidence}
          onChange={setEvidence}
          rows={2}
        />
        <FieldText
          label="Deadline (days)"
          help="How long they have to comply before you escalate."
          value={deadlineDays}
          onChange={setDeadlineDays}
          type="number"
        />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder form={form} document={document} filenamePrefix="cease-and-desist" />;
}
