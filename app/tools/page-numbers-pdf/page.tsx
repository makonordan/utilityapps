import type { Metadata } from "next";

import { PageNumbersPdf } from "@/components/pdf-tools/PageNumbersPdf";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "page-numbers-pdf";

const TITLE = "Free Add Page Numbers to PDF — Three Formats, Six Positions";
const DESCRIPTION =
  "Add page numbers to a PDF — pick a format, position and start number. In-browser, no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "add page numbers to pdf",
    "pdf page numbering",
    "number pdf pages",
    "pdf numbering tool",
    "page numbers pdf online",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Add page numbers to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PageNumbersPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Add Page Numbers to PDF"
        description="Stamp page numbers on every page — three formats, six positions, custom start number for resumed numbering."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <PageNumbersPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Which format to pick</h2>
      <p>
        <strong>&ldquo;1&rdquo;</strong> alone is the most common — it adds the least visual weight
        and works for almost any document. <strong>&ldquo;1 / 10&rdquo;</strong> is useful when a
        reader benefits from knowing the total length (manuals, handouts).{" "}
        <strong>&ldquo;Page 1 of 10&rdquo;</strong> is wordy but unambiguous — good for printed
        reports that get photocopied and reassembled.
      </p>
      <h2>Position</h2>
      <p>
        <strong>Bottom-centre</strong> is the universal default for reports, theses, and books — it
        keeps numbers visible without competing with running headers.{" "}
        <strong>Top-right</strong> works well for academic papers where the bottom is reserved for
        footnotes. <strong>Bottom-right</strong> mimics the convention of paginated articles.
      </p>
      <h2>Starting number</h2>
      <p>
        If the first page is a cover sheet or table of contents that shouldn't be numbered as
        &ldquo;1&rdquo;, set the start number to whatever value you want the first stamped page to
        show. The tool numbers all pages — but lets you pick where the count begins.
      </p>
    </article>
  );
}
