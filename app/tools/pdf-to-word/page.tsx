import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "pdf-to-word";

const TITLE = "Free PDF to Word — Convert PDF to Editable .docx Online";
const DESCRIPTION =
  "Convert PDFs into editable Word (.docx) documents. Best for digital, text-based PDFs. 10 MB limit, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "pdf to word",
    "pdf to docx",
    "convert pdf to word",
    "pdf to word free",
    "pdf to editable word",
    "pdf to word converter",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "PDF to Word" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PdfToWordPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="PDF to Word"
        description="Convert a PDF into an editable .docx. Best on digital PDFs (those generated from Word, LaTeX, etc.) — scanned PDFs need OCR first."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          target="pdf-to-docx"
          accept="application/pdf"
          dropLabel="Drop a PDF here or click to choose"
          actionLabel="Convert to Word"
          outputExt=".docx"
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What &ldquo;convert PDF to Word&rdquo; really means</h2>
      <p>
        A PDF is a fixed layout — the position of every character is hard-coded. A Word document is
        a flowing layout — text wraps and reformats based on margins and font sizes. Converting
        between them is a translation, not a perfect copy. Most modern engines do remarkably well
        on digital PDFs (those generated from Word or similar tools), reconstructing paragraphs,
        headings, lists and tables as editable elements.
      </p>
      <h2>What works well</h2>
      <ul>
        <li>Single-column reports, letters, contracts and articles</li>
        <li>Tables with clear borders (rebuilt as Word tables)</li>
        <li>Embedded images (preserved as inline images)</li>
        <li>Text formatting — bold, italic, underline, fonts, colours</li>
      </ul>
      <h2>What needs cleanup</h2>
      <ul>
        <li>Multi-column layouts often flatten to a single column</li>
        <li>Floating images and pull quotes may shift position</li>
        <li>Footnotes sometimes land at the end of the document instead of the page</li>
      </ul>
      <p>
        If your PDF is a scan or photo (image-only, no text layer), this tool can&rsquo;t extract
        text from it. Run an OCR tool first to make the text selectable, then convert.
      </p>
    </article>
  );
}
