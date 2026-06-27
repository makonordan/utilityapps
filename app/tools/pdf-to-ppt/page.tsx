import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "pdf-to-ppt";

const TITLE = "Free PDF to PowerPoint — Convert PDF to Editable .pptx Online";
const DESCRIPTION =
  "Turn a PDF into a PowerPoint deck — each page becomes a slide with editable text where possible. 10 MB limit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "pdf to powerpoint",
    "pdf to pptx",
    "convert pdf to ppt",
    "pdf to slides",
    "pdf to powerpoint free",
    "pdf to ppt",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "PDF to PowerPoint" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PdfToPptPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="PDF to PowerPoint"
        description="Convert a PDF into an editable PowerPoint deck — each page becomes a slide. Text comes through as editable text boxes where possible."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          toolId={TOOL_ID}
          target="pdf-to-pptx"
          accept="application/pdf"
          dropLabel="Drop a PDF here or click to choose"
          actionLabel="Convert to PowerPoint"
          outputExt=".pptx"
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>When PDF → PowerPoint is useful</h2>
      <p>
        Useful when you&rsquo;ve received a deck as a PDF and want to remix it, when you&rsquo;re
        repurposing a report into a presentation, or when you want to annotate a PDF in
        PowerPoint&rsquo;s richer UI. Less useful when the source PDF was never a presentation —
        flowing reports or long-form documents convert to ugly &ldquo;one slide per page&rdquo;
        decks that aren&rsquo;t really usable as slides.
      </p>
      <h2>How the conversion works</h2>
      <ul>
        <li>Each PDF page becomes its own slide</li>
        <li>Text from digital PDFs typically converts to editable text boxes</li>
        <li>Images, shapes and lines are preserved as separate PowerPoint objects</li>
        <li>Complex backgrounds may fall back to a slide-background image</li>
      </ul>
      <h2>Limits</h2>
      <ul>
        <li>Scanned PDFs become images per slide — run OCR first if you need editable text</li>
        <li>Page orientation is mapped to PowerPoint&rsquo;s default 16:9 widescreen</li>
        <li>Multi-column PDFs may flow oddly across the slide — expect to reformat</li>
      </ul>
    </article>
  );
}
