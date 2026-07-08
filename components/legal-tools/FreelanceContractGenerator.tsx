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

type IpMode = "assignment" | "licence";

const IP_MODES: { value: IpMode; label: string }[] = [
  { value: "assignment", label: "Full assignment — client owns the work once paid" },
  { value: "licence", label: "Licence — freelancer keeps ownership, client gets a usage licence" },
];

type PaymentSchedule = "on-completion" | "milestone" | "monthly";
const PAYMENT_SCHEDULES: { value: PaymentSchedule; label: string }[] = [
  { value: "on-completion", label: "Lump sum on completion" },
  { value: "milestone", label: "Milestone payments" },
  { value: "monthly", label: "Monthly retainer" },
];

const JURISDICTIONS = [
  { value: "Delaware, USA", label: "Delaware, USA" },
  { value: "California, USA", label: "California, USA" },
  { value: "New York, USA", label: "New York, USA" },
  { value: "England and Wales, UK", label: "England and Wales, UK" },
  { value: "Ontario, Canada", label: "Ontario, Canada" },
  { value: "Australia", label: "Australia" },
];

export function FreelanceContractGenerator() {
  const [freelancer, setFreelancer] = useState("Jane Doe");
  const [freelancerAddress, setFreelancerAddress] = useState("123 Designer Way, Brooklyn, NY 11201");
  const [client, setClient] = useState("Acme Inc.");
  const [clientAddress, setClientAddress] = useState("456 Corporate Blvd, San Francisco, CA 94105");
  const [scope, setScope] = useState(
    "Design and deliver a five-page marketing website, including responsive layouts, two rounds of revisions, and final HTML/CSS assets."
  );
  const [deliverables, setDeliverables] = useState(
    "Wireframes, high-fidelity designs in Figma, exported HTML/CSS, source files."
  );
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [fee, setFee] = useState("USD 5,000");
  const [schedule, setSchedule] = useState<PaymentSchedule>("milestone");
  const [scheduleDetails, setScheduleDetails] = useState(
    "50% on signing, 50% on final delivery."
  );
  const [latePercent, setLatePercent] = useState("1.5");
  const [killFee, setKillFee] = useState("25");
  const [ipMode, setIpMode] = useState<IpMode>("assignment");
  const [allowPortfolio, setAllowPortfolio] = useState(true);
  const [jurisdiction, setJurisdiction] = useState("Delaware, USA");

  const document = useMemo<LegalDocument>(() => {
    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "Parties",
      body: [
        `This Independent Contractor Agreement (the "Agreement") is entered into on ${formatLongDate()} between:`,
        `${freelancer}, of ${freelancerAddress} (the "Contractor"); and`,
        `${client}, of ${clientAddress} (the "Client").`,
      ],
    });

    sections.push({
      heading: "Services",
      body: [
        "The Contractor agrees to provide the following services (the \"Services\"):",
        scope,
      ],
    });

    sections.push({
      heading: "Deliverables",
      body: [
        "The Contractor will deliver:",
        deliverables,
      ],
    });

    sections.push({
      heading: "Timeline",
      body: [
        startDate ? `Start date: ${startDate}.` : "Start date: to be agreed upon signing.",
        deadline ? `Target completion: ${deadline}.` : "Target completion: to be agreed upon signing.",
        "Delays caused by the Client (slow feedback, missing assets, scope changes) extend the Contractor's deadlines by an equivalent amount.",
      ],
    });

    sections.push({
      heading: "Fees and payment",
      body: [
        `Total fee: ${fee}.`,
        `Payment schedule: ${PAYMENT_SCHEDULES.find((p) => p.value === schedule)?.label}.`,
        `Payment details: ${scheduleDetails}`,
        "Invoices are payable within 14 days of issue unless otherwise agreed. The Contractor will provide invoices with bank or other agreed payment details.",
        `Late payments accrue interest at ${latePercent}% per month on the outstanding balance, or the maximum permitted by law if lower.`,
      ],
    });

    sections.push({
      heading: "Expenses",
      body: [
        "Out-of-pocket expenses (travel, paid software subscriptions, stock assets, third-party services) are reimbursable only if approved in writing by the Client in advance, against receipts.",
      ],
    });

    sections.push({
      heading: "Revisions and scope changes",
      body: [
        "The fee includes the rounds of revision specified in the scope. Additional revisions, or changes that materially expand the scope, will be quoted separately and require the Client's written approval before work begins.",
      ],
    });

    if (ipMode === "assignment") {
      sections.push({
        heading: "Intellectual property",
        body: [
          "Upon full payment of all fees due under this Agreement, the Contractor assigns to the Client all right, title, and interest in the deliverables (excluding any Contractor pre-existing tools, libraries, or know-how, which are licensed to the Client on a non-exclusive, royalty-free basis for use with the deliverables).",
          "Until full payment, the Contractor retains all rights in the deliverables.",
          allowPortfolio
            ? "The Contractor may include the final deliverables in their portfolio and use them for self-promotion, with the right to credit the Client."
            : "The Contractor will not display the deliverables in their portfolio or use them for self-promotion without the Client's written consent.",
        ],
      });
    } else {
      sections.push({
        heading: "Intellectual property",
        body: [
          "The Contractor retains ownership of all deliverables and underlying intellectual property.",
          "Upon full payment, the Contractor grants the Client a perpetual, worldwide, non-exclusive, non-transferable licence to use, display, reproduce, and modify the deliverables for the Client's internal business and marketing purposes.",
          "The Contractor may re-license, modify, and reuse the deliverables in other projects.",
          allowPortfolio
            ? "The Contractor may include the deliverables in their portfolio and self-promotion."
            : "The Contractor will not display the deliverables in their portfolio without the Client's consent.",
        ],
      });
    }

    sections.push({
      heading: "Confidentiality",
      body: [
        "The Contractor will keep confidential any non-public information the Client shares for the purpose of performing the Services and will not disclose it to any third party without the Client's consent. This obligation survives termination of this Agreement for three years.",
      ],
    });

    sections.push({
      heading: "Independent contractor status",
      body: [
        "The Contractor is an independent contractor, not an employee, partner, or agent of the Client. The Contractor is responsible for their own taxes, insurance, and benefits.",
        "Nothing in this Agreement creates an employer-employee, partnership, or joint-venture relationship.",
      ],
    });

    sections.push({
      heading: "Termination and kill fee",
      body: [
        "Either party may terminate this Agreement with 14 days' written notice. The Client may terminate immediately for material breach by the Contractor.",
        `If the Client terminates the Agreement other than for material breach by the Contractor, the Client will pay (a) all fees due for work completed up to the termination date plus (b) a kill fee of ${killFee}% of the remaining unpaid balance under this Agreement.`,
        "Upon termination, the Contractor will deliver all work in progress to the Client (subject to payment of fees due).",
      ],
    });

    sections.push({
      heading: "Warranties and limitation of liability",
      body: [
        "The Contractor warrants that the deliverables are their original work or properly licensed, and do not knowingly infringe any third-party rights.",
        "Except as expressly stated, the deliverables are provided as-is. To the maximum extent permitted by law, neither party is liable to the other for indirect, incidental, special, or consequential damages. Each party's total liability under this Agreement is limited to the total fees paid under this Agreement.",
      ],
    });

    sections.push({
      heading: "Governing law and dispute resolution",
      body: [
        `This Agreement is governed by the laws of ${jurisdiction}.`,
        "The parties will attempt to resolve any dispute through good-faith negotiation. If unresolved, the dispute will be brought in the courts of " + jurisdiction + ".",
      ],
    });

    sections.push({
      heading: "General",
      body: [
        "This Agreement is the entire agreement between the parties regarding the Services and supersedes any prior agreements on the same subject.",
        "Modifications must be in writing and signed by both parties. If any provision is held unenforceable, the remaining provisions remain in full force.",
      ],
    });

    return {
      title: "Independent Contractor Agreement",
      subtitle: `Between ${client} (Client) and ${freelancer} (Contractor)`,
      effectiveLine: `Dated: ${formatLongDate()}`,
      sections,
      signatures: [
        { role: "Client — " + client },
        { role: "Contractor — " + freelancer },
      ],
    };
  }, [
    freelancer,
    freelancerAddress,
    client,
    clientAddress,
    scope,
    deliverables,
    startDate,
    deadline,
    fee,
    schedule,
    scheduleDetails,
    latePercent,
    killFee,
    ipMode,
    allowPortfolio,
    jurisdiction,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Contractor (you)">
        <FieldText label="Your legal name or business name" value={freelancer} onChange={setFreelancer} required />
        <FieldTextarea label="Address" value={freelancerAddress} onChange={setFreelancerAddress} rows={2} />
      </FormSection>

      <FormSection title="Client">
        <FieldText label="Client legal name" value={client} onChange={setClient} required />
        <FieldTextarea label="Address" value={clientAddress} onChange={setClientAddress} rows={2} />
      </FormSection>

      <FormSection title="Scope of work">
        <FieldTextarea label="Description of services" value={scope} onChange={setScope} rows={3} />
        <FieldTextarea label="Specific deliverables" value={deliverables} onChange={setDeliverables} rows={2} />
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldText label="Start date" value={startDate} onChange={setStartDate} type="date" />
          <FieldText label="Target completion" value={deadline} onChange={setDeadline} type="date" />
        </div>
      </FormSection>

      <FormSection title="Money">
        <FieldText label="Total fee" value={fee} onChange={setFee} placeholder="USD 5,000" required />
        <FieldSelect label="Payment schedule" value={schedule} onChange={setSchedule} options={PAYMENT_SCHEDULES} />
        <FieldTextarea
          label="Schedule details"
          help="e.g. '50% on signing, 50% on final delivery' or 'USD 2,000 monthly retainer'."
          value={scheduleDetails}
          onChange={setScheduleDetails}
          rows={2}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldText label="Late fee (% per month)" value={latePercent} onChange={setLatePercent} type="number" />
          <FieldText
            label="Kill fee (% of remaining)"
            help="If client cancels mid-project."
            value={killFee}
            onChange={setKillFee}
            type="number"
          />
        </div>
      </FormSection>

      <FormSection title="Intellectual property">
        <FieldSelect label="IP terms" value={ipMode} onChange={setIpMode} options={IP_MODES} />
        <FieldCheckbox
          label="Contractor may showcase the work in their portfolio"
          checked={allowPortfolio}
          onChange={setAllowPortfolio}
        />
      </FormSection>

      <FormSection title="Governing law">
        <FieldSelect label="Jurisdiction" value={jurisdiction} onChange={setJurisdiction} options={JURISDICTIONS} />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder toolId="freelance-contract-generator" form={form} document={document} filenamePrefix="freelance-contract" />;
}
