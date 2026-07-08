import type { Metadata } from "next";

import { MergePdf } from "@/components/pdf-tools/MergePdf";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "merge-pdf";

const TITLE = "Free Merge PDF — Combine PDFs in Your Browser (No Upload)";
const DESCRIPTION =
  "Combine two or more PDFs into one — reorder with drag-and-drop, no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf files",
    "pdf merger",
    "merge pdf online",
    "combine pdf files free",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Merge PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function MergePdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Merge PDF"
        description="Combine PDFs into one — drag-and-drop to reorder, then merge. Everything stays in your browser; nothing is uploaded."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <MergePdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why merge PDFs in your browser</h2>
      <p>
        Most online PDF tools upload your file to a server, do the work there, and let you download
        the result. That's fine for a holiday photo — less fine for a contract, a payslip, or a tax
        return. This tool does the merge with <strong>pdf-lib running entirely in your browser</strong>:
        the PDFs are read into memory, joined, and offered back as a download without ever leaving
        your device.
      </p>
      <h2>When merging is the right tool</h2>
      <p>
        Reach for Merge PDF when you have multiple separate files that belong together as one
        document — receipts for an expense report, a cover letter plus a CV, a scanned ID alongside
        a signed form. If instead you want to <em>change the order of pages inside a single PDF</em>,
        the Organize PDF tool is faster. If you want to <em>split</em> a single PDF, use Split PDF.
      </p>
      <h2>What gets preserved</h2>
      <p>
        Page content (text, images, vector graphics, page rotation) carries over exactly. The merged
        PDF is a clean, flat file — outlines, internal links, and form fields from the source PDFs
        are not preserved, which keeps the result simple and predictable.
      </p>
    </article>
  );
}
