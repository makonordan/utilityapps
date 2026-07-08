import type { Metadata } from "next";

import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { SignPdf } from "@/components/pdf-tools/SignPdf";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "sign-pdf";

const TITLE = "Free Sign PDF — Draw an Electronic Signature in Your Browser";
const DESCRIPTION =
  "Draw your signature on a canvas, click where it goes on the PDF, and download — no upload, no signup, no third-party.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "sign pdf",
    "esign pdf",
    "electronic signature pdf",
    "add signature to pdf",
    "draw signature pdf",
    "sign pdf online free",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Sign PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function SignPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Sign PDF"
        description="Draw a signature with mouse, finger or stylus, pick the page, click where it goes, and download the signed PDF — all in your browser."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <SignPdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What this tool does (and doesn't)</h2>
      <p>
        This is an <strong>electronic signature</strong> tool: it embeds a drawn signature image
        onto a PDF page, in your browser, without uploading the file anywhere. It's appropriate for
        the vast majority of day-to-day agreements — internal forms, NDAs with collaborators,
        vendor approvals, freelance contracts.
      </p>
      <p>
        It is <strong>not a qualified electronic signature service</strong> (no audit trail, no
        identity verification, no cryptographic signing certificate). For contracts that require
        eIDAS-qualified or DocuSign-grade audit trails (mortgages, wills, certain corporate
        filings), use a dedicated service like DocuSign or Adobe Sign instead.
      </p>
      <h2>How to get the cleanest signature</h2>
      <ul>
        <li>Sign with a stylus on a tablet if you have one — the lines come out crispest.</li>
        <li>On a laptop, slow down: mouse signatures benefit from deliberate strokes.</li>
        <li>Use the &ldquo;Width&rdquo; slider to size the signature for the field on the document — too large looks unprofessional, too small looks like an afterthought.</li>
      </ul>
      <h2>What stays on your device</h2>
      <p>
        Both the signature you draw and the PDF you sign live entirely in your browser. The
        signature is embedded as a transparent PNG into the PDF using pdf-lib, and the signed file
        is offered as a download. Nothing reaches a server.
      </p>
    </article>
  );
}
