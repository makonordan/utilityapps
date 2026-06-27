import type { Metadata } from "next";

import { BrowserOfficeConverter } from "@/components/pdf-tools/BrowserOfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "pdf-to-word";

const TITLE = "Free PDF to Word — Extract PDF Text into Editable .docx (Browser-Side)";
const DESCRIPTION =
  "Extract the text from a PDF into an editable .docx — runs entirely in your browser, no upload. Text-only conversion; perfect for grabbing the words out of a PDF for editing, not for preserving page layout.";

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
        description="Extract the text out of a PDF into an editable .docx — entirely in your browser, nothing uploaded. Text-only: paragraphs and headings carry over, but tables, images, and exact layout don't. Great for grabbing words to edit; not great for preserving design."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BrowserOfficeConverter
          toolId={TOOL_ID}
          target="pdf-to-word"
          accept="application/pdf"
          dropLabel="Drop a PDF here or click to choose"
          actionLabel="Convert to Word"
          outputExt=".docx"
          qualityNote="Text-only conversion: paragraphs and approximate headings carry over, but tables, images, columns, and exact formatting are not preserved. Use this when you want to edit the words, not duplicate the layout. Files never leave your browser."
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What this tool actually does</h2>
      <p>
        We extract the <em>text</em> out of your PDF and write it into a new
        Word document. The whole thing runs locally in this browser tab —
        there&rsquo;s no upload, no server, no API key. The benefit: it&rsquo;s
        free, private, and never breaks because a service is down. The cost:
        the result is plain text, not a faithful copy of the original PDF.
      </p>
      <h2>What carries over</h2>
      <ul>
        <li>The actual words of the document, in reading order</li>
        <li>Paragraph breaks (we approximate them from PDF line spacing)</li>
        <li>An attempt at headings — anything noticeably larger than body text becomes a Word heading</li>
        <li>One PDF page → one Word page (page breaks preserved)</li>
      </ul>
      <h2>What doesn&rsquo;t carry over</h2>
      <ul>
        <li>Tables → flatten to plain text rows (PDF has no table semantics)</li>
        <li>Images → dropped</li>
        <li>Multi-column layouts → text may interleave between columns</li>
        <li>Fonts, colours, exact spacing → not preserved</li>
        <li>Bold, italic, underline → mostly lost</li>
      </ul>
      <h2>When to use this</h2>
      <p>
        Pick this tool when you want to <strong>edit the words</strong> of a
        PDF — pulling a contract draft into Word for revisions, lifting an
        article to repurpose, copying text out of a long report.
      </p>
      <h2>When to use something else</h2>
      <p>
        If you need a Word document that looks like the PDF (tables intact,
        images in place, fonts preserved), use a paid service like Adobe
        Acrobat or Smallpdf. Those run a server-side Office engine that we
        can&rsquo;t replicate in a browser.
      </p>
      <p>
        If your PDF is a scan or photo (image-only, no text layer), this
        tool can&rsquo;t extract text from it. Run an OCR tool first to
        make the text selectable, then convert.
      </p>
    </article>
  );
}
