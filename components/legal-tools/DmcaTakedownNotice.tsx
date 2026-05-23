"use client";

import { useMemo, useState } from "react";

import { LegalDocumentBuilder } from "@/components/legal-tools/LegalDocumentBuilder";
import {
  FieldText,
  FieldTextarea,
  FormSection,
} from "@/components/legal-tools/fields";
import { formatLongDate, type LegalDocument } from "@/lib/legalDocs";

export function DmcaTakedownNotice() {
  // Your details (the rights holder)
  const [yourName, setYourName] = useState("Jane Doe");
  const [yourTitle, setYourTitle] = useState("Owner");
  const [yourCompany, setYourCompany] = useState("");
  const [yourAddress, setYourAddress] = useState("123 Main Street, San Francisco, CA 94105, USA");
  const [yourEmail, setYourEmail] = useState("jane@example.com");
  const [yourPhone, setYourPhone] = useState("+1 (415) 555-0100");

  // Recipient (the service provider's DMCA agent)
  const [recipientName, setRecipientName] = useState("DMCA Agent");
  const [recipientCompany, setRecipientCompany] = useState("Hosting Provider Inc.");
  const [recipientEmail, setRecipientEmail] = useState("dmca@host.example");

  // The infringement
  const [workDescription, setWorkDescription] = useState(
    "My original photograph titled \"Sunset Over Brooklyn Bridge\", first published on 12 March 2024 at https://example.com/photos/sunset-bridge."
  );
  const [originalLocation, setOriginalLocation] = useState("https://example.com/photos/sunset-bridge");
  const [infringingUrls, setInfringingUrls] = useState(
    "https://infringer.example/blog/post-123\nhttps://infringer.example/gallery/photo-456"
  );

  const document = useMemo<LegalDocument>(() => {
    const urls = infringingUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const sections: LegalDocument["sections"] = [];

    sections.push({
      heading: "Recipient",
      body: [
        `To: ${recipientName}`,
        recipientCompany,
        `Via email: ${recipientEmail}`,
      ],
    });

    sections.push({
      heading: "Subject",
      body: [
        `Notice of Copyright Infringement under 17 U.S.C. § 512(c)(3) (Digital Millennium Copyright Act).`,
      ],
    });

    sections.push({
      heading: "Introduction",
      body: [
        `Dear ${recipientName},`,
        `I am writing to notify you of copyright infringement occurring on your service. This notice is provided in accordance with the Digital Millennium Copyright Act, 17 U.S.C. § 512(c)(3).`,
      ],
    });

    sections.push({
      heading: "1. Identification of the copyrighted work",
      body: [
        "The copyrighted work being infringed is:",
        workDescription,
        originalLocation ? `The work is originally located at: ${originalLocation}` : "",
      ].filter(Boolean) as string[],
    });

    sections.push({
      heading: "2. Identification of the infringing material",
      body: [
        "The infringing material is located at the following URL(s):",
        { type: "list", items: urls.length ? urls : ["(no URLs supplied — fill in the form to list the infringing pages)"] },
      ],
    });

    sections.push({
      heading: "3. Contact information",
      body: [
        `${yourName}${yourTitle ? `, ${yourTitle}` : ""}${yourCompany ? `, ${yourCompany}` : ""}`,
        yourAddress,
        `Email: ${yourEmail}`,
        yourPhone ? `Phone: ${yourPhone}` : "",
      ].filter(Boolean) as string[],
    });

    sections.push({
      heading: "4. Good-faith statement",
      body: [
        'I have a good-faith belief that the use of the material described above, in the manner complained of, is not authorised by the copyright owner, its agent, or the law.',
      ],
    });

    sections.push({
      heading: "5. Statement of accuracy",
      body: [
        "I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner, or am authorised to act on behalf of the copyright owner, of an exclusive right that is allegedly infringed.",
      ],
    });

    sections.push({
      heading: "6. Signature",
      body: [
        "Please remove or disable access to the infringing material identified above as required by 17 U.S.C. § 512(c)(1)(C).",
        "Thank you for your prompt attention to this matter.",
        "",
        `Sincerely,`,
        `${yourName}${yourTitle ? `, ${yourTitle}` : ""}`,
        `Dated: ${formatLongDate()}`,
        `Electronic signature: /${yourName}/`,
      ],
    });

    return {
      title: "DMCA Takedown Notice",
      subtitle: `From ${yourName} to ${recipientCompany || recipientName}`,
      effectiveLine: `Dated: ${formatLongDate()}`,
      sections,
    };
  }, [
    yourName,
    yourTitle,
    yourCompany,
    yourAddress,
    yourEmail,
    yourPhone,
    recipientName,
    recipientCompany,
    recipientEmail,
    workDescription,
    originalLocation,
    infringingUrls,
  ]);

  const form = (
    <div className="space-y-5">
      <FormSection title="Recipient (the service's DMCA agent)">
        <FieldText label="Contact name" value={recipientName} onChange={setRecipientName} />
        <FieldText label="Company / service" value={recipientCompany} onChange={setRecipientCompany} required />
        <FieldText label="Email" value={recipientEmail} onChange={setRecipientEmail} type="email" required />
      </FormSection>

      <FormSection title="The copyrighted work">
        <FieldTextarea
          label="Description of the original work"
          help="What it is, when you created it, where it was first published."
          value={workDescription}
          onChange={setWorkDescription}
          rows={3}
        />
        <FieldText
          label="URL of the original (optional)"
          value={originalLocation}
          onChange={setOriginalLocation}
          type="url"
        />
      </FormSection>

      <FormSection title="The infringing material">
        <FieldTextarea
          label="Infringing URLs (one per line)"
          help="One URL per line. The more specific, the better — page URLs, not just the homepage."
          value={infringingUrls}
          onChange={setInfringingUrls}
          rows={4}
        />
      </FormSection>

      <FormSection title="Your contact information (required by §512(c)(3))">
        <FieldText label="Full legal name" value={yourName} onChange={setYourName} required />
        <FieldText
          label="Title / role (optional)"
          help="e.g. Owner, Director, Authorised Agent"
          value={yourTitle}
          onChange={setYourTitle}
        />
        <FieldText label="Company (optional)" value={yourCompany} onChange={setYourCompany} />
        <FieldTextarea label="Postal address" value={yourAddress} onChange={setYourAddress} rows={2} />
        <FieldText label="Email" value={yourEmail} onChange={setYourEmail} type="email" required />
        <FieldText label="Phone" value={yourPhone} onChange={setYourPhone} type="tel" />
      </FormSection>
    </div>
  );

  return <LegalDocumentBuilder form={form} document={document} filenamePrefix="dmca-takedown" />;
}
