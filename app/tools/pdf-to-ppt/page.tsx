import type { Metadata } from "next";

import { RetiredToolNotice } from "@/components/pdf-tools/RetiredToolNotice";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "PDF to PowerPoint — Tool Not Currently Offered | UtilityApps";
const DESCRIPTION =
  "We don't currently offer browser-side PDF → PowerPoint. PDFs lack the slide structure needed to make a useful editable deck, and a faithful version needs server-side conversion. See suggested alternatives.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/pdf-to-ppt" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/pdf-to-ppt`,
    siteName: SITE_CONFIG.name,
  },
};

export default function PdfToPptRetiredPage() {
  return (
    <RetiredToolNotice
      toolName="PDF to PowerPoint"
      reason="PDFs don't carry slide structure — there's no way to know where one slide should end and the next begin, or which elements should be editable text boxes. A useful PDF → PowerPoint conversion needs a server-side engine that reconstructs slides from layout cues. We don't run one, and the alternatives below do the job well."
      alternatives={[
        {
          label: "PDF to Word (browser-side)",
          description:
            "If you mostly want to edit the text inside, our browser-side PDF → Word gives you a starting .docx — no upload needed.",
          href: "/tools/pdf-to-word",
        },
        {
          label: "Adobe Acrobat — Convert PDF to PowerPoint",
          description:
            "Adobe's own engine. Free trial; subscription after that. Best fidelity for slide reconstruction.",
          href: "https://www.adobe.com/acrobat/online/pdf-to-ppt.html",
          external: true,
        },
        {
          label: "Smallpdf — PDF to PowerPoint",
          description:
            "Free tier with daily limits, paid for unlimited use. Solid slide detection.",
          href: "https://smallpdf.com/pdf-to-ppt",
          external: true,
        },
        {
          label: "iLovePDF — PDF to PowerPoint",
          description: "Free tier. Files uploaded to their servers; deleted after processing.",
          href: "https://www.ilovepdf.com/pdf_to_powerpoint",
          external: true,
        },
      ]}
    />
  );
}
