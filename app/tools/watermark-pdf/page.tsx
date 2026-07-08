import type { Metadata } from "next";

import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { WatermarkPdf } from "@/components/pdf-tools/WatermarkPdf";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "watermark-pdf";

const TITLE = "Free Watermark PDF — Add CONFIDENTIAL or DRAFT Text in Browser";
const DESCRIPTION =
  "Add a text watermark to every page — font size, colour, opacity, rotation, 9 positions. In-browser, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "watermark pdf",
    "add watermark to pdf",
    "pdf watermark online",
    "stamp pdf",
    "confidential watermark",
    "draft watermark pdf",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Watermark PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function WatermarkPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Watermark PDF"
        description="Stamp every page with custom text — pick font size, colour, opacity, rotation and one of nine anchor positions."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <WatermarkPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What makes a watermark effective</h2>
      <p>
        A good watermark is <strong>visible enough to deter casual misuse</strong> but{" "}
        <strong>subtle enough that the document remains readable</strong>. The classic recipe is a
        diagonal banner across the centre (set rotation to 45°), opacity around 25–35%, font size
        large (60–100pt for a full-page banner), in a muted grey or red.
      </p>
      <h2>Common watermark patterns</h2>
      <ul>
        <li><strong>CONFIDENTIAL</strong>: 45° rotation, centre, ~30% opacity, dark grey or red.</li>
        <li><strong>DRAFT</strong>: same as above, distinguishing a work-in-progress from the final.</li>
        <li><strong>Client name</strong>: bottom-right corner, low opacity (15–20%), small font — for shareable previews of work in progress.</li>
        <li><strong>SAMPLE / PREVIEW</strong>: dead-centre, lower opacity, used on samples sent for review.</li>
      </ul>
      <h2>Limits</h2>
      <p>
        A watermark deters casual misuse — anyone who really wants the content can still extract
        the underlying text or use the Compress tool to flatten the file. For true protection, use a
        password-protected PDF or a dedicated DRM service instead.
      </p>
    </article>
  );
}
