import type { Metadata } from "next";

import { RetiredToolNotice } from "@/components/pdf-tools/RetiredToolNotice";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "PDF to Excel — Tool Not Currently Offered | UtilityApps";
const DESCRIPTION =
  "We don't currently offer a reliable PDF → Excel conversion. PDFs have no native table structure, and recovering them well needs server-side software we don't run. See suggested alternatives for accurate table extraction.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Soft-deprecated: keep the URL alive for inbound links but tell Google
  // not to surface this in search since we no longer rank for it well.
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/pdf-to-excel" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/pdf-to-excel`,
    siteName: SITE_CONFIG.name,
  },
};

export default function PdfToExcelRetiredPage() {
  return (
    <RetiredToolNotice
      toolName="PDF to Excel"
      reason="Pulling tables out of a PDF cleanly needs a real layout engine — PDFs store text positions, not table structure. The browser-only version we could ship would treat each line as a row and lose any sense of columns, which would frustrate more than it helps. Until we can run server-side conversion again, we recommend the alternatives below."
      alternatives={[
        {
          label: "PDF to Word (browser-side)",
          description:
            "If you mostly want the text out of the PDF, our browser-side PDF → Word does the job — text-only, no upload.",
          href: "/tools/pdf-to-word",
        },
        {
          label: "Adobe Acrobat — Convert PDF to Excel",
          description:
            "Adobe's own engine. Free trial; subscription after that. Best fidelity for tables.",
          href: "https://www.adobe.com/acrobat/online/pdf-to-excel.html",
          external: true,
        },
        {
          label: "Smallpdf — PDF to Excel",
          description:
            "Free tier with daily limits, paid subscription for unlimited use. Solid table detection.",
          href: "https://smallpdf.com/pdf-to-excel",
          external: true,
        },
        {
          label: "iLovePDF — PDF to Excel",
          description:
            "Free tier, decent table detection. Files uploaded to their servers.",
          href: "https://www.ilovepdf.com/pdf_to_excel",
          external: true,
        },
      ]}
    />
  );
}
