import type { Metadata } from "next";

import { EditPdf } from "@/components/pdf-tools/EditPdf";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "edit-pdf";

const TITLE = "Free Edit PDF — Add Text, Boxes & Ovals to Any Page (No Upload)";
const DESCRIPTION =
  "Add text overlays and simple shapes anywhere on a PDF — pick a page, click, save. In-browser, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "edit pdf",
    "pdf editor online",
    "add text to pdf",
    "annotate pdf",
    "pdf annotation tool",
    "free pdf editor",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Edit PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function EditPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Edit PDF"
        description="Add text boxes, rectangles and ovals to a PDF — pick a tool, set its options, click on the page to place it, queue as many as you want, then save."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <EditPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What you can do here</h2>
      <p>
        Drop in a PDF, pick a page, then place new content on top: <strong>text boxes</strong>{" "}
        (with font size and colour controls), <strong>rectangles</strong> (for highlighting,
        boxing fields, or covering content), and <strong>ovals</strong>. Each addition is queued —
        you can review and remove items before applying — and all your changes are written into a
        single new PDF.
      </p>
      <h2>Why &ldquo;edit existing text&rdquo; is rare</h2>
      <p>
        Most users searching for a PDF editor want to change words already on the page. The truth
        is that <strong>PDF text isn't editable the way a Word document is</strong> — characters
        are positioned individually with embedded fonts, kerning, and ligatures, so changing a
        word usually breaks the layout. Editors that claim to handle this either fail on real-world
        PDFs or flatten the page to an image first (which destroys text searchability for the
        whole document).
      </p>
      <p>
        This tool focuses on what reliably works: adding new elements on top. For filling in form
        fields, use a dedicated form-fill tool. For redacting sensitive content, use a redaction
        tool that removes bytes from the file (covering with a white rectangle, as this tool can
        do, only hides visually — the underlying text is still in the PDF).
      </p>
      <h2>Privacy</h2>
      <p>
        Edits happen with pdf-lib in your browser. The PDF is never uploaded.
      </p>
    </article>
  );
}
