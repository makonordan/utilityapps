import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "ppt-to-pdf";

const TITLE = "Free PowerPoint to PDF — Convert .pptx Decks to PDF Online";
const DESCRIPTION =
  "Convert PowerPoint decks (.pptx / .ppt) into PDFs — one slide per page. 10 MB limit, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "powerpoint to pdf",
    "pptx to pdf",
    "convert ppt to pdf",
    "slides to pdf",
    "powerpoint to pdf free",
    "ppt to pdf",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "PowerPoint to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PptToPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="PowerPoint to PDF"
        description="Drop a .pptx or .ppt and get a PDF with one slide per page. Aspect ratio (16:9 or 4:3) follows the source deck."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          toolId={TOOL_ID}
          target="pptx-to-pdf"
          accept="application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
          dropLabel="Drop a PowerPoint deck here or click to choose"
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
      <h2>Why convert slides to PDF</h2>
      <p>
        PDFs are the lowest-friction way to share a deck with someone who may not have PowerPoint
        installed — they open everywhere (browser, phone, Apple Preview, Adobe Reader) and look
        identical to what you designed. Particularly useful for handouts, attachments, and sending
        a final version of a deck where editability isn&rsquo;t desired.
      </p>
      <h2>What carries over</h2>
      <ul>
        <li>One slide per PDF page, at the slide&rsquo;s aspect ratio (16:9 by default, 4:3 if the source uses it)</li>
        <li>All static content: text, shapes, images, charts, tables</li>
        <li>Slide order and slide-master backgrounds</li>
      </ul>
      <h2>What gets flattened</h2>
      <ul>
        <li><strong>Animations</strong> render in their initial state — PDF can&rsquo;t animate</li>
        <li><strong>Slide transitions</strong> are dropped — PDF pages just turn</li>
        <li><strong>Embedded video and audio</strong> show as a static frame — the playback can&rsquo;t come along</li>
        <li><strong>Speaker notes</strong> aren&rsquo;t included unless you&rsquo;ve added them as on-slide text</li>
      </ul>
      <p>
        If you need an interactive version of the deck for a remote audience, export to MP4 from
        PowerPoint instead — PDF is for sharing the visual content only.
      </p>
    </article>
  );
}
