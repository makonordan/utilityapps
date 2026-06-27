import type { Metadata } from "next";

import { BrowserOfficeConverter } from "@/components/pdf-tools/BrowserOfficeConverter";
import { PdfToolShell } from "@/components/pdf-tools/PdfToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getPdfFaqs, pdfToolOgUrl } from "@/lib/pdfFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "excel-to-pdf";

const TITLE = "Free Excel to PDF — Convert .xlsx Workbooks to PDF in Your Browser";
const DESCRIPTION =
  "Convert Excel workbooks (.xlsx / .xls) into PDFs — every sheet on its own section, formatted as a clean table. Runs entirely in your browser, no upload, no signup.";

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
        description="Drop an .xlsx (or .xls) and download a PDF — one section per sheet, rendered as a clean table. Runs entirely in your browser; data tables and column headers look great, charts and conditional formatting collapse to their underlying values."
        faqItems={getPdfFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BrowserOfficeConverter
          toolId={TOOL_ID}
          target="excel-to-pdf"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          dropLabel="Drop an Excel workbook here or click to choose"
          actionLabel="Convert to PDF"
          outputExt=".pdf"
          qualityNote="Great for data tables (the common case). Charts, conditional formatting, embedded images, and complex merged-cell layouts collapse to their underlying values. Files never leave your browser."
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
        Each worksheet in the workbook converts to one section of the PDF in
        sheet order. The first row of each sheet is treated as the header
        and styled in a coloured band; the rest of the sheet renders as a
        regular table with alternating row shading for readability. Long
        sheets paginate automatically — the header doesn&rsquo;t repeat on
        every page to keep the file small, but the sheet name + page counter
        in the footer makes it easy to keep track.
      </p>
      <h2>What translates well</h2>
      <ul>
        <li>Data tables with text, numbers, and dates</li>
        <li>Multi-sheet workbooks (you get one section per sheet)</li>
        <li>Standard column headers</li>
        <li>Empty sheets (rendered with a small placeholder rather than skipped)</li>
      </ul>
      <h2>What doesn&rsquo;t survive</h2>
      <ul>
        <li>Charts — collapse to nothing; only the underlying data table makes it through</li>
        <li>Conditional formatting (colour scales, data bars) — values stay, colours don&rsquo;t</li>
        <li>Cell merges across rows — usually flatten into the top-left value</li>
        <li>Pivot tables, slicers, and form controls</li>
        <li>Embedded images and shapes</li>
      </ul>
      <h2>What about formulas?</h2>
      <p>
        Formulas convert to their current calculated values — the PDF shows
        the numbers, not the formulas behind them. If you need both, keep
        the source workbook alongside the PDF.
      </p>
    </article>
  );
}
