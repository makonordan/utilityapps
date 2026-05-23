import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
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
        description="Drop a .docx or .doc file and download a faithful PDF. Layout, fonts and tables are preserved by our server-side rendering engine."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          target="docx-to-pdf"
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          dropLabel="Drop a Word document here or click to choose"
          actionLabel="Convert to PDF"
          outputExt=".pdf"
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why Word → PDF needs a server</h2>
      <p>
        Word documents reference fonts, embed images, and rely on a layout engine that mirrors how
        Microsoft Word paginates the page. Producing a PDF that matches what you see in Word
        requires a full Word-compatible rendering engine — something far too heavy to run in the
        browser. So Word ↔ PDF is the exception to our usual &ldquo;everything in your browser&rdquo;
        promise: the file is uploaded to our conversion partner, converted, and deleted right after.
      </p>
      <h2>What gets preserved</h2>
      <ul>
        <li>Paragraph and page layout, including page breaks and section breaks</li>
        <li>Common system fonts (Calibri, Arial, Times New Roman, Helvetica, Courier)</li>
        <li>Tables, lists, footnotes and embedded images</li>
        <li>Headers, footers and page numbers from Word</li>
      </ul>
      <h2>What gets substituted or dropped</h2>
      <ul>
        <li>Uncommon or licensed fonts → swapped for the closest equivalent</li>
        <li>Tracked changes → accepted (as if you ran &ldquo;Accept All&rdquo;)</li>
        <li>Comments and macros → dropped</li>
      </ul>
    </article>
  );
}
