import type { Metadata } from "next";

import { OfficeConverter } from "@/components/pdf-tools/OfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "excel-to-pdf";

const TITLE = "Free Excel to PDF — Convert .xlsx Workbooks to PDF Online";
const DESCRIPTION =
  "Convert Excel workbooks (.xlsx / .xls) into PDFs — every sheet as a page. 10 MB limit, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "excel to pdf",
    "xlsx to pdf",
    "convert excel to pdf",
    "spreadsheet to pdf",
    "excel to pdf free",
    "xls to pdf",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: pdfToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Excel to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [pdfToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function ExcelToPdfPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <PdfToolShell
        toolId={TOOL_ID}
        title="Excel to PDF"
        description="Drop an .xlsx (or .xls) and get a PDF where every sheet becomes a page. Print areas and page breaks set in Excel are honoured."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        serverProcessing
      >
        <OfficeConverter
          toolId={TOOL_ID}
          target="xlsx-to-pdf"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          dropLabel="Drop an Excel workbook here or click to choose"
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
      <h2>How sheets become pages</h2>
      <p>
        Each worksheet in the workbook converts to one or more PDF pages in the order they appear
        in Excel. Worksheets with print areas set use that exact range as the page boundary;
        worksheets without print areas use the data range. Page breaks you&rsquo;ve inserted
        manually are respected.
      </p>
      <h2>Tips for clean output</h2>
      <ul>
        <li>Set <strong>Page Layout → Print Area</strong> in Excel to control exactly what appears.</li>
        <li>Use <strong>Page Layout → Scale to Fit</strong> for wide tables that would otherwise overflow.</li>
        <li>Hide columns or rows you don&rsquo;t want to appear in the PDF (they stay hidden).</li>
        <li>Use <strong>Page Layout → Orientation: Landscape</strong> for wide reports before exporting.</li>
      </ul>
      <h2>What about formulas?</h2>
      <p>
        Formulas convert to their current displayed values — the PDF shows the numbers, not the
        formulas behind them. If you need both, keep the source workbook alongside.
      </p>
    </article>
  );
}
