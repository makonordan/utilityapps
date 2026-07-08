import type { Metadata } from "next";

import { CompressPdf } from "@/components/pdf-tools/CompressPdf";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "compress-pdf";

const TITLE = "Free Compress PDF — Shrink PDFs to Email Size in Browser";
const DESCRIPTION =
  "Reduce PDF file size with High, Medium or Low quality presets — in-browser, no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "shrink pdf",
    "pdf compressor",
    "pdf size reducer",
    "compress pdf online",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Compress PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function CompressPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Compress PDF"
        description="Shrink a PDF to email size — pick a quality level and the tool re-renders pages as JPEGs and rebuilds the PDF. Big savings, in your browser."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CompressPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>How browser-side PDF compression works</h2>
      <p>
        The tool renders every page to a canvas, exports it as a JPEG at your chosen quality, and
        rebuilds the PDF from those images. This trades selectable text for big size savings — a
        typical sweet spot is Medium (75% JPEG quality at 1.2× scale), which often cuts the file
        in half or more.
      </p>
      <h2>The big trade-off</h2>
      <p>
        Because the pages become images, you lose: <strong>text selection and search, embedded
        fonts, hyperlinks, form fields, and vector sharpness.</strong> If those matter, keep the
        original PDF or use a quality-preserving approach (downsample only embedded images, recompress
        with mozjpeg — both more complex than this tool offers).
      </p>
      <h2>When to use which quality</h2>
      <ul>
        <li><strong>High</strong>: minor savings, almost-original look — best when the PDF must still look polished.</li>
        <li><strong>Medium</strong>: balanced — best for sharing receipts, scans, brochures.</li>
        <li><strong>Low</strong>: aggressive — best for email attachments under 5MB or quick web previews.</li>
      </ul>
      <h2>Privacy</h2>
      <p>
        Compression runs in your browser using pdf-lib and the Canvas API. Your PDF never reaches a
        server.
      </p>
    </article>
  );
}
