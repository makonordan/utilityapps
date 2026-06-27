import type { Metadata } from "next";

import { BrowserOfficeConverter } from "@/components/pdf-tools/BrowserOfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "word-to-pdf";

const TITLE = "Free Word to PDF — Convert .docx to PDF Online";
const DESCRIPTION =
  "Convert Word documents (.docx / .doc) to PDF with layout and fonts preserved. 10 MB limit, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "word to pdf",
    "docx to pdf",
    "convert word to pdf",
    "doc to pdf online",
    "word to pdf free",
    "word document to pdf",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Word to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function WordToPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Word to PDF"
        description="Drop a .docx or .doc file and download a PDF — entirely in your browser. Your file is never uploaded. Best for plain documents; complex layouts with multi-column text, footnotes, or custom fonts may shift slightly."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BrowserOfficeConverter
          toolId={TOOL_ID}
          target="word-to-pdf"
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          dropLabel="Drop a Word document here or click to choose"
          actionLabel="Convert to PDF"
          outputExt=".pdf"
          qualityNote="Works great for plain docs (paragraphs, headings, lists, simple tables). Multi-column layouts, custom fonts, footnotes, and complex headers/footers may not survive exactly. Files never leave your browser."
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Word → PDF in your browser</h2>
      <p>
        Drop a .docx (or .doc) into this tool and you&rsquo;ll download a PDF a
        few seconds later — without anything being uploaded to a server. The
        whole conversion (reading the Word file, rendering its layout,
        building the PDF) runs as code inside this browser tab. No API key,
        no signup, no usage cap, no waiting in queue.
      </p>
      <h2>What gets preserved</h2>
      <ul>
        <li>Paragraph flow, headings, ordered and unordered lists</li>
        <li>Bold, italic, and underlined runs of text</li>
        <li>Simple tables (single-cell rows and columns; merged cells may flatten)</li>
        <li>Inline images embedded in the document</li>
        <li>Standard system fonts (Helvetica, Times-style serif, monospace fallbacks)</li>
      </ul>
      <h2>What gets substituted or dropped</h2>
      <ul>
        <li>Uncommon or licensed fonts → swapped for the closest system equivalent</li>
        <li>Multi-column layouts → collapse to a single column</li>
        <li>Headers and footers from Word → may shift to the document body</li>
        <li>Footnotes → land at the end of the document instead of the original page</li>
        <li>Tracked changes → accepted as if you ran &ldquo;Accept All&rdquo;</li>
        <li>Comments and macros → dropped</li>
      </ul>
      <h2>When this isn&rsquo;t the right tool</h2>
      <p>
        For pixel-perfect contract PDFs, multi-column reports with precise
        typography, or any document where the visual layout is the point, a
        server-side engine like LibreOffice (or Acrobat) will still do a
        better job. For 80% of everyday &ldquo;I just need a PDF version of
        this Word doc&rdquo; cases, this tool is fine.
      </p>
    </article>
  );
}
