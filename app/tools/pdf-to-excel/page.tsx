import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "pdf-to-excel";

const TITLE = "Free PDF to Excel — Extract Tables to .xlsx Online";
const DESCRIPTION =
  "Pull tables from a PDF into an editable Excel file. Best on bordered tables. 10 MB limit, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "pdf to excel",
    "pdf to xlsx",
    "convert pdf to excel",
    "extract tables from pdf",
    "pdf table to excel",
    "pdf to spreadsheet",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "PDF to Excel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function PdfToExcelPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="PDF to Excel"
        description="Extract tables from a PDF into an editable .xlsx. Best results on PDFs with clearly bordered tables — borderless layouts may need a quick clean-up after."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          target="pdf-to-xlsx"
          accept="application/pdf"
          dropLabel="Drop a PDF here or click to choose"
          actionLabel="Convert to Excel"
          outputExt=".xlsx"
        />
      </PdfToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>How table extraction works</h2>
      <p>
        The conversion engine analyses each PDF page for grid-like structures — visible cell
        borders, consistent column gutters, repeated row spacing — and reconstructs them as rows
        and columns in an Excel sheet. Each PDF page typically becomes one worksheet (or one
        section within a worksheet) in the output workbook.
      </p>
      <h2>What works best</h2>
      <ul>
        <li>Tables with visible borders and consistent column widths</li>
        <li>Bank statements, invoices and financial reports</li>
        <li>Single-table-per-page PDFs (cleanest output)</li>
        <li>Digitally-generated PDFs with a text layer</li>
      </ul>
      <h2>What needs cleanup</h2>
      <ul>
        <li>Borderless tables — columns may merge or split unpredictably</li>
        <li>Tables that span multiple pages — usually rebuilt per page, not joined</li>
        <li>Merged cells, multi-row headers and footnotes — best-effort</li>
        <li>Scanned PDFs (no text layer) — needs OCR first</li>
      </ul>
      <h2>Why no formulas?</h2>
      <p>
        A PDF stores the visible values shown on the page, not the formulas that produced them.
        The converted Excel file therefore contains the same numbers as the PDF, as plain values
        — useful for further analysis, but not editable as live formulas.
      </p>
    </article>
  );
}
