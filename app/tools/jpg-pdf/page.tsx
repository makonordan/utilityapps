import type { Metadata } from "next";

import { JpgPdfTool } from "@/components/pdf-tools/JpgPdfTool";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "jpg-pdf";

const TITLE = "Free Image to PDF Converter — PNG, JPG & JPEG to PDF (+ PDF to JPG)";
const DESCRIPTION =
  "Convert PNG, JPG, or JPEG images into one PDF, or render every PDF page as a high-quality JPEG — no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "jpeg to pdf",
    "pdf to jpg",
    "convert pdf to jpg",
    "image to pdf online free",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Image to PDF and PDF to JPG" }],
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
        title="Image to PDF & PDF to JPG"
        description="Two converters in one. Combine PNG, JPG, or JPEG images into a PDF (with reorder and page-size options), or burst a PDF into high-resolution JPEGs."
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
      <h2>Image to PDF: when this matters</h2>
      <p>
        Government forms, expense reports, and applications almost always ask for a single PDF —
        not a folder of photos. Pulling multiple receipts, scans, or screenshots — in PNG, JPG, or
        JPEG — into one PDF makes them easy to email and sensible to file. Pick{" "}
        <strong>Auto-fit</strong> page size to make each PDF page match its image, or pick{" "}
        <strong>A4 / Letter</strong> for a uniform document that prints cleanly.
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
        Both directions run in your browser. Image to PDF uses pdf-lib to embed PNG or JPEG images
        directly into a new PDF. PDF → JPG uses pdfjs (Mozilla&rsquo;s PDF renderer) to draw each page to
        a canvas, then exports the canvas as a JPEG. Nothing is uploaded.
      </p>
    </article>
  );
}
