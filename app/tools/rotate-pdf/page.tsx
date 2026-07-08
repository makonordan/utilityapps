import type { Metadata } from "next";

import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { RotatePdf } from "@/components/pdf-tools/RotatePdf";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "rotate-pdf";

const TITLE = "Free Rotate PDF — Fix Sideways or Upside-Down Pages in Browser";
const DESCRIPTION =
  "Rotate any page or all pages of a PDF — 90°, 180° or 270°. Preview thumbnails, no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "rotate pdf",
    "turn pdf pages",
    "fix sideways pdf",
    "rotate pdf online",
    "pdf rotator",
    "rotate pdf 90 degrees",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Rotate PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function RotatePdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Rotate PDF"
        description="Spin individual pages or every page at once. Thumbnails let you preview the rotation before saving."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <RotatePdf />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why some PDFs open sideways</h2>
      <p>
        Scanners and phone-camera apps often save pages with a wrong rotation flag. The page
        content is fine — it's just the metadata telling viewers how to display it that's off.
        Rotating with this tool corrects the flag rather than re-rendering the pixels, so the
        result stays crisp and the file size barely changes.
      </p>
      <h2>Whole-document vs per-page</h2>
      <p>
        The bulk &ldquo;rotate all&rdquo; buttons are useful when an entire PDF was scanned the
        wrong way. For mixed orientations — a portrait report with a single landscape table page in
        the middle, for example — click the individual page thumbnails to set their rotation. Each
        click adds 90° clockwise.
      </p>
      <h2>Saves the rotation flag, not pixels</h2>
      <p>
        Some online tools rotate by re-rendering each page as an image — fast but it destroys
        selectable text. This tool sets the PDF's per-page rotation property and re-saves the file,
        which means the underlying text remains searchable and copy-pastable.
      </p>
    </article>
  );
}
