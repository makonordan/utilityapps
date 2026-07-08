import type { Metadata } from "next";

import { OrganizePdf } from "@/components/pdf-tools/OrganizePdf";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "organize-pdf";

const TITLE = "Free Organize PDF — Reorder & Delete Pages in Browser";
const DESCRIPTION =
  "Drag-and-drop page thumbnails to reorder or delete pages. In-browser, no signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "organize pdf",
    "reorder pdf pages",
    "rearrange pdf",
    "delete pdf pages",
    "pdf page organizer",
    "sort pdf pages",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Organize PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function OrganizePdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Organize PDF"
        description="See every page as a thumbnail, drag to reorder, click X to remove pages. Save a clean new PDF."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <OrganizePdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What Organize PDF is for</h2>
      <p>
        Sometimes a PDF arrives with its pages in the wrong order — scanned out of sequence,
        merged in the wrong order, or with extra blank pages from a printer. Organize PDF gives
        you a thumbnail grid of every page and lets you drag them into the order you actually
        want, then drop the unwanted ones. The output is a new PDF built from the pages you kept,
        in your new order.
      </p>
      <h2>How the underlying copy works</h2>
      <p>
        Pages are copied byte-for-byte from the source PDF into a fresh document with pdf-lib's
        <code>copyPages</code>. That means the visual result is identical to the source — no
        re-rendering, no quality loss, no swelling file size. Deleting pages produces a smaller
        file proportional to the pages you removed.
      </p>
      <h2>Combine with other PDF tools</h2>
      <p>
        Need to bring pages in from another PDF first? Use Merge PDF to join the documents, then
        bring the merged file here to reorganize. Need to rotate a single landscape page in the
        middle? Use Rotate PDF first, then organize.
      </p>
    </article>
  );
}
