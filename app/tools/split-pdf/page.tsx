import type { Metadata } from "next";

import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { SplitPdf } from "@/components/pdf-tools/SplitPdf";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "split-pdf";

const TITLE = "Free Split PDF — Extract Pages or Split Every Page (No Upload)";
const DESCRIPTION =
  "Extract a page range or split every page into its own PDF — bundled in a ZIP. In-browser, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf splitter",
    "separate pdf pages",
    "split pdf online",
    "split pdf free",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Split PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function SplitPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Split PDF"
        description="Pull specific pages out of a PDF, or burst every page into its own file. Range mode produces one PDF; per-page mode bundles everything into a ZIP."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <SplitPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The two ways to split a PDF</h2>
      <p>
        <strong>Range mode</strong> is the right pick when you want one specific section out of a
        larger PDF — say, the appendix from a 200-page report, or three particular pages from a
        scan. Type the pages you want as a comma-separated list (e.g. <code>1-3, 5, 7-10</code>),
        and the output is a single PDF containing just those pages, in the order you listed them.
      </p>
      <p>
        <strong>Per-page mode</strong> is the right pick when you want to break a PDF into atomic
        files — every page becomes its own PDF. Browsers can't reliably trigger many simultaneous
        downloads, so all the per-page PDFs are zipped together for a single download.
      </p>
      <h2>Page-range syntax</h2>
      <p>
        Whitespace is ignored, so <code>1-3, 5, 7-10</code> and <code>1-3,5,7-10</code> are
        equivalent. Out-of-range pages are silently clamped. Reversed ranges like <code>10-7</code>
        are treated as <code>7-10</code>. Duplicate pages are de-duplicated and the result is
        ordered low-to-high — so the output is always coherent.
      </p>
      <h2>Privacy</h2>
      <p>
        Splitting runs entirely in your browser. Even a 500-page PDF stays on your device — the
        only network traffic on this page is loading the tool itself.
      </p>
    </article>
  );
}
