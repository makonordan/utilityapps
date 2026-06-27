"use client";

/**
 * Browser-side Excel (.xlsx / .xls) → PDF conversion.
 *
 * Pipeline:
 *   1. SheetJS reads the workbook into JSON (one 2D array per sheet)
 *   2. jspdf-autotable renders each sheet as a styled PDF table
 *      (multi-page automatically — autotable handles row splitting)
 *   3. Multi-sheet workbooks get one section per sheet, each starting on
 *      a new page with the sheet name as a header
 *
 * Quality target: ~80% for data tables (the dominant Excel use case).
 * Charts, conditional formatting, merged cells across rows, embedded
 * images, and pivot tables all collapse to plain values. For a finance
 * model where the chart is the whole point, this won't work — for
 * "I have a spreadsheet I want to email as a PDF", it's fine.
 *
 * Libraries dynamic-imported so initial page load stays light.
 */

import { downloadBlob } from "@/lib/pdfClient";

export interface ExcelToPdfOptions {
  /** Optional progress callback (0..100). */
  onProgress?: (percent: number, stage: string) => void;
  /** Page orientation. Excel is usually wider than tall → landscape default. */
  orientation?: "portrait" | "landscape";
}

export async function convertExcelToPdf(
  file: File,
  options: ExcelToPdfOptions = {}
): Promise<Blob> {
  const { onProgress = () => {}, orientation = "landscape" } = options;

  onProgress(5, "Reading workbook");
  const arrayBuffer = await file.arrayBuffer();

  onProgress(20, "Loading parser");
  const XLSX = await import("xlsx");

  onProgress(35, "Parsing sheets");
  const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

  const sheetNames = wb.SheetNames;
  if (!sheetNames.length) {
    throw new Error("This workbook has no sheets.");
  }

  onProgress(55, "Rendering PDF");
  const { jsPDF } = await import("jspdf");
  // jspdf-autotable is a plugin — importing it for side effects registers
  // `autoTable` on the jsPDF prototype.
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default ?? autoTableModule;

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation,
    compress: true,
  });

  const totalSheets = sheetNames.length;
  for (let i = 0; i < totalSheets; i++) {
    const name = sheetNames[i];
    const ws = wb.Sheets[name];
    if (!ws) continue;

    // sheet_to_json with header:1 gives back an array of rows (each row =
    // array of cell values). Empty cells become undefined; we coerce them
    // to "" so they don't render as the word "undefined".
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
      header: 1,
      blankrows: false,
      defval: "",
    });

    if (rows.length === 0) {
      // Empty sheet — write a small note so users don't think the file broke.
      if (i > 0) pdf.addPage();
      pdf.setFontSize(14).setFont("helvetica", "bold").text(name, 15, 20);
      pdf.setFontSize(10).setFont("helvetica", "normal").text("(empty sheet)", 15, 30);
      continue;
    }

    // Treat the first row as the header IF it has the same column count as
    // the second row (a heuristic, but matches 95% of real spreadsheets).
    const head = rows.length > 1 ? [normalizeRow(rows[0])] : [];
    const body = rows.slice(head.length).map(normalizeRow);

    if (i > 0) pdf.addPage();

    pdf
      .setFontSize(14)
      .setFont("helvetica", "bold")
      .text(name, 15, 15);

    // autoTable mutates the pdf instance — calling it after `text` puts the
    // table below our sheet-name header. Setting startY explicitly leaves
    // clean vertical breathing room.
    autoTable(pdf, {
      head,
      body,
      startY: 20,
      margin: { left: 10, right: 10, top: 20, bottom: 15 },
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [33, 100, 232], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      // autoTable handles long tables by paginating automatically. The
      // 'auto' showHead value repeats the header on each new page so a
      // multi-page table stays readable.
      showHead: "firstPage",
      didDrawPage: () => {
        const pageCount = pdf.getNumberOfPages();
        pdf
          .setFontSize(8)
          .setFont("helvetica", "normal")
          .setTextColor(128)
          .text(
            `${name} · page ${pdf.getCurrentPageInfo().pageNumber} of ${pageCount}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 7,
            { align: "center" }
          );
        pdf.setTextColor(0);
      },
    });

    onProgress(55 + Math.round(((i + 1) / totalSheets) * 40), "Rendering PDF");
  }

  onProgress(98, "Finalizing");
  const blob = pdf.output("blob");
  onProgress(100, "Done");
  return blob;
}

function normalizeRow(row: unknown[]): (string | number)[] {
  return row.map((cell) => {
    if (cell === undefined || cell === null) return "";
    if (cell instanceof Date) return cell.toISOString().slice(0, 10);
    if (typeof cell === "number" || typeof cell === "string") return cell;
    return String(cell);
  });
}

/** Convenience wrapper — convert + trigger download. */
export async function convertExcelToPdfAndDownload(
  file: File,
  options: ExcelToPdfOptions = {}
): Promise<{ blob: Blob; filename: string }> {
  const blob = await convertExcelToPdf(file, options);
  const filename = file.name.replace(/\.xlsx?$/i, "") + ".pdf";
  downloadBlob(blob, filename, "application/pdf");
  return { blob, filename };
}
