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

type NdaType = "mutual" | "one-way";

const NDA_TYPES: { value: NdaType; label: string }[] = [
  { value: "mutual", label: "Mutual — both parties share confidential information" },
  { value: "one-way", label: "One-way — only the Disclosing Party shares" },
];

const JURISDICTIONS = [
  { value: "Delaware, USA", label: "Delaware, USA" },
  { value: "California, USA", label: "California, USA" },
  { value: "New York, USA", label: "New York, USA" },
  { value: "England and Wales, UK", label: "England and Wales, UK" },
  { value: "Ontario, Canada", label: "Ontario, Canada" },
  { value: "Singapore", label: "Singapore" },
];

export function NdaGenerator() {
  const [ndaType, setNdaType] = useState<NdaType>("mutual");
  const [partyA, setPartyA] = useState("Acme Inc.");
  const [partyAAddress, setPartyAAddress] = useState("123 Main Street, San Francisco, CA 94105");
  const [partyB, setPartyB] = useState("Jane Doe");
  const [partyBAddress, setPartyBAddress] = useState("456 Oak Avenue, New York, NY 10001");
  const [purpose, setPurpose] = useState(
    "discussing a potential business relationship and evaluating each other's products and services"
  );
  const [termYears, setTermYears] = useState("3");
  const [jurisdiction, setJurisdiction] = useState("Delaware, USA");

  const document = useMemo<LegalDocument>(() => {
    const isMutual = ndaType === "mutual";
    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "Parties",
      body: [
        `This Non-Disclosure Agreement (the "Agreement") is entered into on ${formatLongDate()} between:`,
        `${partyA}, of ${partyAAddress} (${isMutual ? '"Party A"' : '"Disclosing Party"'}); and`,
        `${partyB}, of ${partyBAddress} (${isMutual ? '"Party B"' : '"Receiving Party"'}).`,
        isMutual
          ? 'Each party may be referred to individually as a "Party" and collectively as the "Parties".'
          : 'The Parties may be referred to individually as a "Party" and collectively as the "Parties".',
      ],
    });

    sections.push({
      heading: "Purpose",
      body: [
        `The Parties wish to exchange confidential information for the purpose of ${purpose} (the "Purpose").`,
        isMutual
          ? "Each Party may disclose its own Confidential Information to the other for the Purpose."
          : "The Disclosing Party will share Confidential Information with the Receiving Party for the Purpose.",
      ],
    });

    sections.push({
      heading: "Definition of Confidential Information",
      body: [
        '"Confidential Information" means any non-public information that the disclosing party shares with the receiving party, whether orally, in writing, electronically, or by inspection, and whether or not marked as confidential, including without limitation:',
        {
          type: "list",
          items: [
            "Business plans, financials, customer and supplier lists, pricing, and marketing strategies.",
            "Technical information, source code, algorithms, designs, prototypes, and research data.",
            "Personnel information and unpublished products or services.",
            "Any information that, by its nature or the circumstances of disclosure, a reasonable person would treat as confidential.",
          ],
        },
        "Confidential Information does not include information that: (a) is or becomes publicly known through no fault of the receiving party; (b) was rightfully known to the receiving party without confidentiality obligations before disclosure; (c) is independently developed by the receiving party without use of the disclosing party's Confidential Information; or (d) is rightfully received from a third party without confidentiality obligations.",
      ],
    });

    sections.push({
      heading: "Obligations",
      body: [
        `The ${isMutual ? "receiving Party" : "Receiving Party"} shall:`,
        {
          type: "list",
          items: [
            "Use Confidential Information solely for the Purpose.",
            "Hold Confidential Information in strict confidence and use at least the same degree of care it uses to protect its own confidential information, and no less than a reasonable degree of care.",
            "Not disclose Confidential Information to any third party without the disclosing party's prior written consent.",
            "Limit access to Confidential Information to employees, contractors, and advisors who need it for the Purpose and are bound by confidentiality obligations at least as protective as those in this Agreement.",
            "Not reverse engineer, decompile, or disassemble any tangible Confidential Information.",
          ],
        },
      ],
    });

    sections.push({
      heading: "Required disclosures",
      body: [
        `If ${isMutual ? "either Party" : "the Receiving Party"} is required by law, regulation, or court order to disclose Confidential Information, it shall (where legally permitted) give the disclosing party prompt written notice so that the disclosing party may seek a protective order or other remedy, and shall disclose only the portion of Confidential Information legally required.`,
      ],
    });

    sections.push({
      heading: "Term and survival",
      body: [
        `This Agreement begins on the date first written above and continues until terminated by either Party upon 30 days' written notice.`,
        `The obligations of confidentiality survive termination of this Agreement and continue for ${termYears} years from the date of disclosure of the relevant Confidential Information.`,
      ],
    });

    sections.push({
      heading: "Return or destruction",
      body: [
        `Upon written request or upon termination of this Agreement, the ${isMutual ? "receiving Party" : "Receiving Party"} shall promptly return or destroy all Confidential Information in its possession, and certify destruction in writing if requested. The receiving party may retain one archival copy solely for legal-compliance purposes.`,
      ],
    });

    sections.push({
      heading: "No licence; no warranty",
      body: [
        "No licence to or right in any Confidential Information is granted by this Agreement, except the limited right to use Confidential Information for the Purpose.",
        'Confidential Information is provided "AS IS" without any warranty, express or implied. The disclosing party makes no representations regarding the accuracy or completeness of its Confidential Information.',
      ],
    });

    sections.push({
      heading: "Remedies",
      body: [
        "The Parties acknowledge that breach of this Agreement may cause irreparable harm for which monetary damages would not be a sufficient remedy. The disclosing party is entitled to seek injunctive relief in addition to all other remedies available at law or in equity.",
      ],
    });

    sections.push({
      heading: "No obligation",
      body: [
        "Nothing in this Agreement obligates either Party to enter into any further business arrangement or to disclose any particular Confidential Information.",
      ],
    });

    sections.push({
      heading: "General",
      body: [
        "This Agreement is the entire understanding between the Parties regarding its subject matter and supersedes all prior agreements and discussions on that subject.",
        `This Agreement is governed by the laws of ${jurisdiction}, without regard to its conflict-of-laws principles. The Parties consent to the exclusive jurisdiction of the courts located in ${jurisdiction}.`,
        "Any modification must be in writing and signed by both Parties. If any provision is held unenforceable, the remaining provisions remain in full force.",
        "Neither Party may assign this Agreement without the other's prior written consent, except to a successor in connection with a merger, acquisition, or sale of substantially all assets.",
      ],
    });

    return {
      title: "Non-Disclosure Agreement",
      subtitle: isMutual ? `Between ${partyA} and ${partyB} (mutual)` : `Between ${partyA} (Disclosing) and ${partyB} (Receiving)`,
      effectiveLine: `Dated: ${formatLongDate()}`,
      sections,
      signatures: [
        { role: isMutual ? "Party A — " + partyA : "Disclosing Party — " + partyA },
        { role: isMutual ? "Party B — " + partyB : "Receiving Party — " + partyB },
      ],
    };
  }, [ndaType, partyA, partyAAddress, partyB, partyBAddress, purpose, termYears, jurisdiction]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Type">
        <FieldSelect label="NDA type" value={ndaType} onChange={setNdaType} options={NDA_TYPES} />
      </FormSection>

      <FormSection title={ndaType === "mutual" ? "Party A" : "Disclosing Party"}>
        <FieldText label="Name" value={partyA} onChange={setPartyA} required />
        <FieldTextarea label="Address" value={partyAAddress} onChange={setPartyAAddress} rows={2} />
      </FormSection>

      <FormSection title={ndaType === "mutual" ? "Party B" : "Receiving Party"}>
        <FieldText label="Name" value={partyB} onChange={setPartyB} required />
        <FieldTextarea label="Address" value={partyBAddress} onChange={setPartyBAddress} rows={2} />
      </FormSection>

      <FormSection title="Terms">
        <FieldTextarea
          label="Purpose of sharing"
          help="Be specific — the NDA is enforceable only for this purpose."
          value={purpose}
          onChange={setPurpose}
          rows={2}
        />
        <FieldText
          label="Confidentiality period (years)"
          help="Typical: 2–5 years for general business info; longer for trade secrets."
          value={termYears}
          onChange={setTermYears}
          type="number"
        />
        <FieldSelect label="Governing law" value={jurisdiction} onChange={setJurisdiction} options={JURISDICTIONS} />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder toolId="nda-generator" form={form} document={document} filenamePrefix="nda" />;
}
