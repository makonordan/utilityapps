import type { Metadata } from "next";

import { JpgPdfTool } from "@/components/pdf-tools/JpgPdfTool";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "jpg-pdf";

const TITLE = "Free JPG to PDF & PDF to JPG — Both Directions, In Browser";
const DESCRIPTION =
  "Convert JPGs into one PDF, or render every PDF page as a high-quality JPEG — no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "jpg to pdf",
    "pdf to jpg",
    "image to pdf",
    "pdf to image",
    "convert pdf to jpg",
    "jpg to pdf online free",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "JPG to PDF and PDF to JPG" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function JpgPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="JPG ↔ PDF"
        description="Two converters in one. Combine images into a PDF (with reorder and page-size options), or burst a PDF into high-resolution JPEGs."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <JpgPdfTool />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>JPG → PDF: when this matters</h2>
      <p>
        Government forms, expense reports, and applications almost always ask for a single PDF —
        not a folder of photos. Pulling multiple receipts, scans, or screenshots into one PDF makes
        them easy to email and sensible to file. Pick <strong>Auto-fit</strong> page size to make
        each PDF page match its image, or pick <strong>A4 / Letter</strong> for a uniform document
        that prints cleanly.
      </p>
      <h2>PDF → JPG: when this matters</h2>
      <p>
        Sometimes you need an image of a PDF page — to paste into a slide deck, embed in a
        Notion page, share on social media, or open with a basic image viewer. The exporter
        renders each page at 2× device resolution (great for retina screens) and saves as JPEG at
        ~92% quality, a sweet spot for text-heavy pages.
      </p>
      <h2>Privacy</h2>
      <p>
        Both directions run in your browser. JPG → PDF uses pdf-lib to embed images directly into a
        new PDF. PDF → JPG uses pdfjs (Mozilla's PDF renderer) to draw each page to a canvas, then
        exports the canvas as a JPEG. Nothing is uploaded.
      </p>
    </article>
  );
}
