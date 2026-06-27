import type { Metadata } from "next";

import { RetiredToolNotice } from "@/components/pdf-tools/RetiredToolNotice";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "PowerPoint to PDF — Tool Not Currently Offered | UtilityApps";
const DESCRIPTION =
  "We don't currently offer browser-side PowerPoint → PDF conversion. Rendering .pptx faithfully needs a full slide engine we don't run. See suggested alternatives below.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/ppt-to-pdf" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/ppt-to-pdf`,
    siteName: SITE_CONFIG.name,
  },
};

export default function PptToPdfRetiredPage() {
  return (
    <RetiredToolNotice
      toolName="PowerPoint to PDF"
      reason="PowerPoint decks (.pptx) are layout-heavy: custom fonts, embedded media, complex shapes, animations. Rendering them to PDF faithfully needs a real PowerPoint-compatible engine, which doesn't run in a browser. The easiest path right now is to use PowerPoint itself (File → Export → PDF) or one of the dedicated services below."
      alternatives={[
        {
          label: "PowerPoint itself — File → Export → PDF",
          description:
            "If you have PowerPoint installed, this gives the highest fidelity by far — it's the same engine that rendered the slides.",
          href: "https://support.microsoft.com/en-us/office/save-powerpoint-presentations-as-pdf-files-9b5c786b-9c6e-4a36-8b3a-91eb9b2c4f5a",
          external: true,
        },
        {
          label: "Google Slides — File → Download → PDF",
          description:
            "Upload your .pptx to Google Slides, then download as PDF. Free, decent fidelity for most decks.",
          href: "https://slides.google.com",
          external: true,
        },
        {
          label: "Smallpdf — PowerPoint to PDF",
          description:
            "Free tier with daily limits, paid for unlimited. Good fidelity since they run server-side rendering.",
          href: "https://smallpdf.com/ppt-to-pdf",
          external: true,
        },
        {
          label: "iLovePDF — PowerPoint to PDF",
          description: "Free tier. Files uploaded to their servers; deleted after processing.",
          href: "https://www.ilovepdf.com/powerpoint_to_pdf",
          external: true,
        },
      ]}
    />
  );
}
