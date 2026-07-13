/**
 * Per-tool metadata for the PDF Tools category. Mirrors the sleep/travel
 * pattern so the rendered FAQ matches the JSON-LD schema exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type PdfToolId =
  | "merge-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "organize-pdf"
  | "compress-pdf"
  | "watermark-pdf"
  | "page-numbers-pdf"
  | "jpg-pdf"
  | "sign-pdf"
  | "edit-pdf"
  // Phase 2 — server-backed Office ↔ PDF conversions (ConvertAPI)
  | "word-to-pdf"
  | "pdf-to-word"
  | "excel-to-pdf"
  | "pdf-to-excel"
  | "ppt-to-pdf"
  | "pdf-to-ppt";

export interface HowToStep {
  name: string;
  text: string;
}

const STANDARD_PRIVACY: FAQItem = {
  q: "Are my PDFs uploaded to a server?",
  a: "No. Every PDF is opened, modified and saved entirely in your browser using pdf-lib. Nothing is sent to a server. You can disconnect from the internet after the page loads and the tool still works.",
};

// Honest disclaimer shared by all six Phase-2 server-backed Office tools.
const SERVER_CONVERT_PRIVACY: FAQItem = {
  q: "Is my file uploaded to a server?",
  a: "Yes — Office ↔ PDF conversions need a Word/Excel/PowerPoint rendering engine that doesn't run in your browser. The file is uploaded to our conversion partner (ConvertAPI), converted, and deleted immediately afterward. We don't store, log, or share the file's contents. Files are capped at 10 MB and conversions are capped at 10 per hour per IP to keep the service available for everyone.",
};

const SERVER_LIMITS: FAQItem = {
  q: "What are the size and rate limits?",
  a: "Each file must be 10 MB or smaller. Each visitor (per IP address) can run up to 10 conversions per hour. These limits keep the conversion quota available for everyone — if you need more, the source files are usually best converted locally in Word, Excel or PowerPoint.",
};

export const PDF_FAQS: Record<PdfToolId, FAQItem[]> = {
  "merge-pdf": [
    {
      q: "How many PDFs can I merge?",
      a: "As many as your browser memory allows — typically dozens of PDFs adding up to a few hundred megabytes works fine on a modern laptop or phone. Merging happens in your browser, so big files stay on your device.",
    },
    {
      q: "Can I reorder the PDFs before merging?",
      a: "Yes. After adding files, drag them up or down (or use the arrows) to set the order they'll appear in the merged file.",
    },
    {
      q: "Will bookmarks, links and form fields be preserved?",
      a: "Page content (text, images, vector graphics, page rotation) is preserved exactly. Some advanced PDF features — outlines, internal links and form fields — are not carried across; the result is a clean, flat PDF.",
    },
    STANDARD_PRIVACY,
  ],

  "split-pdf": [
    {
      q: "What modes does the splitter support?",
      a: "Two modes. 'Range' extracts one PDF containing the pages you list (e.g. 1-3, 5, 7-10). 'Each page' produces one PDF per page, bundled into a ZIP so you can download them all at once.",
    },
    {
      q: "How do I specify page ranges?",
      a: "Type the pages as a comma-separated list: 1-3 selects pages 1, 2 and 3. 5 selects just page 5. Combine them: 1-3, 5, 7-10. Whitespace is ignored.",
    },
    {
      q: "What's the largest PDF I can split?",
      a: "Limited by browser memory rather than a hard cap. Hundreds of pages and a few hundred megabytes is fine on a modern device.",
    },
    STANDARD_PRIVACY,
  ],

  "rotate-pdf": [
    {
      q: "Can I rotate individual pages or only the whole PDF?",
      a: "Both. Click thumbnails to select specific pages, or use 'Select all' to rotate everything at once. Each selected page rotates by the angle you pick (90°, 180° or 270° clockwise).",
    },
    {
      q: "Does the rotation move text inside the page?",
      a: "No. It sets the PDF's page rotation flag, which tells viewers to display the page rotated. The underlying content stays in place — viewers and printers handle it correctly.",
    },
    {
      q: "Why does my PDF look rotated already?",
      a: "Some scanners save pages with a rotation flag the wrong way around. This tool lets you correct that — pick the rotation that lands the page right-side up in your viewer.",
    },
    STANDARD_PRIVACY,
  ],

  "organize-pdf": [
    {
      q: "What does the organize tool do?",
      a: "Drag page thumbnails into a new order, delete pages you don't need, or duplicate pages. The output is a new PDF with your changes applied.",
    },
    {
      q: "Can I add pages from another PDF?",
      a: "Not in this tool — use the Merge PDF tool to combine PDFs first, then bring the merged file here to reorganize.",
    },
    {
      q: "Will the file get larger after reorganizing?",
      a: "No. The pages are copied as-is into the new PDF, so the file size stays close to the original. Deleting pages makes it smaller.",
    },
    STANDARD_PRIVACY,
  ],

  "compress-pdf": [
    {
      q: "How does the compressor work?",
      a: "It re-renders every page as a JPEG image at your chosen quality and rebuilds the PDF from those images. That gives big size reductions but the result becomes image-only — selectable text and PDF metadata are lost.",
    },
    {
      q: "Which quality setting should I pick?",
      a: "High (90%) keeps very good visual quality with modest savings (often 30–50% smaller). Medium (75%) is a good balance for sharing (50–70% smaller). Low (50%) is best for email or web preview when size matters more than detail.",
    },
    {
      q: "Will the compressed PDF still have selectable text?",
      a: "No — because the tool flattens pages to images, text is no longer selectable or searchable. If you need to preserve text, keep the original PDF or use the OCR tool on the compressed output later.",
    },
    STANDARD_PRIVACY,
  ],

  "watermark-pdf": [
    {
      q: "Can I add text and image watermarks?",
      a: "Text watermarks are supported now — pick font size, colour, opacity, rotation and position. Image watermarks are on the roadmap.",
    },
    {
      q: "Where on the page does the watermark land?",
      a: "Pick from nine anchor positions (top-left through bottom-right plus dead-centre). The watermark is drawn on every page of the PDF.",
    },
    {
      q: "Can I make a 'CONFIDENTIAL' or 'DRAFT' watermark?",
      a: "Yes — type the text, set rotation to 45° for a diagonal banner, and lower opacity to around 25–35% so it shows through without obscuring content.",
    },
    STANDARD_PRIVACY,
  ],

  "page-numbers-pdf": [
    {
      q: "What page number formats are supported?",
      a: "Three formats: '1' (just the number), '1 / 10' (with total page count), and 'Page 1 of 10'. Pick the one that fits your document.",
    },
    {
      q: "Where do the numbers go on the page?",
      a: "Six positions — top-left, top-centre, top-right and the same three along the bottom. Bottom-centre is the most common choice for reports and books.",
    },
    {
      q: "Can I start numbering from a page other than 1?",
      a: "Yes. Set the 'Start number' field to the value you want for the first numbered page — useful for adding numbers that continue from another document.",
    },
    STANDARD_PRIVACY,
  ],

  "jpg-pdf": [
    {
      q: "Which way does this tool convert?",
      a: "Both. Switch tabs: Image to PDF combines PNG, JPG, or JPEG images into a multi-page PDF; PDF → JPG renders each page of a PDF to a high-quality JPEG.",
    },
    {
      q: "Can I mix PNG and JPG images in one PDF?",
      a: "Yes. Drop or select any combination of PNG, JPG, and JPEG images, drag to reorder, pick page size (A4 / Letter / Auto-fit), and one PDF is built with each image on its own page.",
    },
    {
      q: "What resolution do PDF → JPG exports use?",
      a: "Pages are rendered at 2× device resolution by default — good enough to share or print. JPEG quality is fixed at high (~92%) for clean text.",
    },
    STANDARD_PRIVACY,
  ],

  "sign-pdf": [
    {
      q: "How do I sign?",
      a: "Draw your signature on the canvas with mouse, finger, or stylus. Pick the page to sign, click where the signature should land, and download the signed PDF.",
    },
    {
      q: "Can I type a signature instead of drawing it?",
      a: "Drawing only in this tool — typed-text signatures are less unique and easier to forge. For a typed signature, use the Watermark tool with a script font instead.",
    },
    {
      q: "Is the signature legally binding?",
      a: "An electronic signature is generally valid for everyday agreements in most jurisdictions, but specific contracts (mortgages, wills, some employment documents) may require a qualified eSignature service with audit trails. Check local rules.",
    },
    STANDARD_PRIVACY,
  ],

  "edit-pdf": [
    {
      q: "What can I add to a PDF?",
      a: "Text boxes (font size, colour) and simple shapes (rectangle, ellipse, line). Pick a page, click on the canvas where the element should go, and adjust its properties before saving.",
    },
    {
      q: "Can I edit existing text in the PDF?",
      a: "Not in this tool. PDF text isn't editable the way a Word document is — most 'PDF editors' that claim to edit existing text either fail on complex layouts or convert the page to an image first. This tool focuses on adding new content on top, which is reliable.",
    },
    {
      q: "Can I delete or move existing content?",
      a: "You can hide content by covering it with a white rectangle, but the underlying text is still present in the file. For real redaction, the content has to be removed at the byte level — outside the scope of this tool.",
    },
    STANDARD_PRIVACY,
  ],

  // ============================================================ Phase 2
  "word-to-pdf": [
    {
      q: "What Word formats does this tool accept?",
      a: "Modern .docx files (Word 2007 and later) are the primary input. Older .doc files also work in most cases, but the layout may shift slightly because the .doc format was Microsoft's internal binary spec — modern engines do their best, but the result isn't always pixel-identical to Word's print preview.",
    },
    {
      q: "Will fonts and formatting be preserved?",
      a: "Common system fonts (Calibri, Arial, Times New Roman, Helvetica, Courier) and the layout you see in Word are preserved. Uncommon or licensed fonts are substituted with the closest equivalent — usually invisible at a glance, occasionally noticeable on body text.",
    },
    {
      q: "What about tracked changes, comments and macros?",
      a: "Tracked changes are accepted into the PDF as if you ran 'Accept All'. Comments are dropped to keep the PDF clean. Macros (.docm) are simply ignored — only the visible content gets converted.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],

  "pdf-to-word": [
    {
      q: "How accurate is the converted Word document?",
      a: "Text and paragraph order come across very well for digital PDFs (those generated from Word, LaTeX, etc.). Scanned PDFs or image-only PDFs produce poor results because there's no text layer to extract — you'd need an OCR tool first.",
    },
    {
      q: "Will the layout match the PDF exactly?",
      a: "Mostly. Complex multi-column layouts, footnotes and floating images often shift to fit Word's flow model. Simple single-column reports, letters and articles convert almost perfectly. For pixel-perfect fidelity, keep the PDF and edit a separate Word copy.",
    },
    {
      q: "Can I edit tables and images after converting?",
      a: "Yes. Tables are reconstructed as Word tables you can edit, and embedded images are preserved. Vector graphics are usually flattened into images.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],

  "excel-to-pdf": [
    {
      q: "Will every sheet in my workbook become a page?",
      a: "Yes — each worksheet becomes one or more pages in the PDF, in the order they appear in the workbook. Print areas, page breaks and fit-to-page settings you've set in Excel are honoured.",
    },
    {
      q: "How are charts and formulas handled?",
      a: "Charts are rendered into the PDF as they appear in Excel. Formulas are converted to their current displayed values — the PDF shows the answers, not the formulas behind them.",
    },
    {
      q: "What about hidden sheets, columns and rows?",
      a: "Anything hidden in the source workbook stays hidden in the PDF. If you need it included, unhide it in Excel first and re-export.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],

  "pdf-to-excel": [
    {
      q: "How well does table extraction work?",
      a: "Best on PDFs with clearly bordered tables. Borderless tables, tables that span multiple pages, and merged cells are detected best-effort — they usually come through, but column alignment may need a quick clean-up.",
    },
    {
      q: "Will formulas come across?",
      a: "No. A PDF only stores the visible values, not the formulas behind them. The converted Excel file shows the same numbers as the PDF, as values rather than formulas.",
    },
    {
      q: "What about pages that aren't tables?",
      a: "Paragraphs of text are extracted into cells too, often one cell per line. Not ideal for prose — if your PDF is mostly text, use PDF → Word instead.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],

  "ppt-to-pdf": [
    {
      q: "Does the PDF keep each slide on its own page?",
      a: "Yes. One slide per PDF page, at the slide's aspect ratio (16:9 by default, 4:3 if your deck uses that). Speaker notes are not included unless you've added them as text on the slide itself.",
    },
    {
      q: "Are animations and transitions preserved?",
      a: "No — a PDF is a static document, so animations are flattened to their initial state and transitions don't exist. For interactive playback, export from PowerPoint to video instead.",
    },
    {
      q: "What about embedded video and audio?",
      a: "Embedded media doesn't carry over to PDF. The slide is rendered as it appears in PowerPoint's design view, with the video frame showing as a static image.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],

  "pdf-to-ppt": [
    {
      q: "How is a PDF turned into a PowerPoint?",
      a: "Each page of the PDF becomes a separate slide in the deck. The page content is rendered as an editable layer where possible (text boxes and shapes), with anything complex falling back to a background image of the page.",
    },
    {
      q: "Will I be able to edit the text after converting?",
      a: "Often, yes — text from digital PDFs typically converts to editable text boxes in PowerPoint. Scanned PDFs come through as images per slide (you'd need OCR first to make the text editable).",
    },
    {
      q: "What slide size is used?",
      a: "Standard 16:9 widescreen by default. If your PDF has pages in portrait orientation, PowerPoint may letterbox the content with margins.",
    },
    SERVER_LIMITS,
    SERVER_CONVERT_PRIVACY,
  ],
};

export const PDF_HOWTOS: Record<PdfToolId, HowToStep[]> = {
  "merge-pdf": [
    { name: "Add your PDFs", text: "Drag and drop or click to select two or more PDF files." },
    { name: "Reorder them", text: "Drag files up or down so they merge in the order you want." },
    { name: "Download the merged PDF", text: "Click Merge and your combined PDF downloads instantly." },
  ],
  "split-pdf": [
    { name: "Add your PDF", text: "Drop the PDF you want to split into the upload area." },
    { name: "Pick a mode", text: "'Range' for specific pages, or 'Each page' to split every page into its own PDF." },
    { name: "Download", text: "Range mode downloads one PDF; per-page mode downloads a ZIP of all pages." },
  ],
  "rotate-pdf": [
    { name: "Add your PDF", text: "Drop a PDF — thumbnails appear for every page." },
    { name: "Select pages", text: "Click thumbnails to select pages, or hit Select all." },
    { name: "Rotate and save", text: "Pick the rotation angle and download the rotated PDF." },
  ],
  "organize-pdf": [
    { name: "Add your PDF", text: "Drop a PDF to see every page as a thumbnail." },
    { name: "Reorder and delete", text: "Drag thumbnails into a new order or click X to remove pages you don't need." },
    { name: "Save the new PDF", text: "Download your reorganized PDF." },
  ],
  "compress-pdf": [
    { name: "Add your PDF", text: "Drop the PDF you want to make smaller." },
    { name: "Pick a quality level", text: "High keeps the best look, Medium balances quality and size, Low gives the smallest file." },
    { name: "Download the compressed file", text: "Compare original and new size, then download the result." },
  ],
  "watermark-pdf": [
    { name: "Add your PDF and your watermark text", text: "Drop the PDF and type the watermark text." },
    { name: "Style it", text: "Pick font size, colour, opacity, rotation and which corner of the page it sits in." },
    { name: "Download", text: "Apply to every page and download the watermarked PDF." },
  ],
  "page-numbers-pdf": [
    { name: "Add your PDF", text: "Drop the PDF you want to number." },
    { name: "Choose format and position", text: "Pick the number format and where on the page it appears." },
    { name: "Save", text: "Download the numbered PDF." },
  ],
  "jpg-pdf": [
    { name: "Pick a direction", text: "Switch between Image to PDF and PDF → JPG tabs." },
    { name: "Add your files", text: "Drop PNG, JPG, or JPEG images, or a PDF, into the upload area." },
    { name: "Convert and download", text: "Tweak any options and click convert — your file downloads when ready." },
  ],
  "sign-pdf": [
    { name: "Add your PDF", text: "Drop the PDF you need to sign." },
    { name: "Draw your signature", text: "Use mouse, finger or stylus to draw on the signature pad." },
    { name: "Place and save", text: "Click the page where the signature goes and download the signed PDF." },
  ],
  "edit-pdf": [
    { name: "Add your PDF", text: "Drop the PDF you want to mark up." },
    { name: "Pick a page", text: "Choose the page from the thumbnails." },
    { name: "Add text or a shape", text: "Click on the page where the element should go, edit its properties, and save the PDF." },
  ],
  "word-to-pdf": [
    { name: "Add your Word document", text: "Drop a .docx (or .doc) file up to 10 MB." },
    { name: "Convert on the server", text: "The file uploads to our conversion partner, gets rendered to PDF, and is deleted right after." },
    { name: "Download the PDF", text: "The converted PDF streams back to your browser as a download." },
  ],
  "pdf-to-word": [
    { name: "Add your PDF", text: "Drop a PDF up to 10 MB." },
    { name: "Convert on the server", text: "We send the PDF to our conversion partner, which extracts the text and layout into a .docx." },
    { name: "Download the Word document", text: "Open it in Word, Google Docs or LibreOffice — the source file is deleted from our server." },
  ],
  "excel-to-pdf": [
    { name: "Add your Excel workbook", text: "Drop an .xlsx (or .xls) file up to 10 MB." },
    { name: "Convert on the server", text: "Each worksheet is rendered to a PDF page, honouring your print-area settings." },
    { name: "Download the PDF", text: "The PDF downloads in your browser and the workbook is deleted from our server." },
  ],
  "pdf-to-excel": [
    { name: "Add your PDF", text: "Drop a PDF that contains tables." },
    { name: "Convert on the server", text: "We send the PDF to our conversion partner, which detects tables and extracts them into cells." },
    { name: "Download the Excel file", text: "Open the .xlsx in Excel or Google Sheets to clean up the layout if needed." },
  ],
  "ppt-to-pdf": [
    { name: "Add your PowerPoint deck", text: "Drop a .pptx (or .ppt) file up to 10 MB." },
    { name: "Convert on the server", text: "Each slide becomes a PDF page at the slide's aspect ratio." },
    { name: "Download the PDF", text: "The PDF downloads in your browser and the source deck is deleted from our server." },
  ],
  "pdf-to-ppt": [
    { name: "Add your PDF", text: "Drop a PDF — each page will become a slide." },
    { name: "Convert on the server", text: "Pages convert to editable text boxes where possible, otherwise to slide backgrounds." },
    { name: "Download the .pptx", text: "Open it in PowerPoint, Google Slides or Keynote and tweak as needed." },
  ],
};

export const PDF_FEATURE_LISTS: Record<PdfToolId, string> = {
  "merge-pdf": "Multi-file drag-and-drop, reorderable list, in-browser merging with pdf-lib, no upload, instant download",
  "split-pdf": "Page-range and per-page modes, ZIP bundling for per-page exports, in-browser splitting, no upload",
  "rotate-pdf": "Per-page thumbnails, multi-select rotation, 90/180/270 angles, in-browser, no upload",
  "organize-pdf": "Drag-reorder pages, delete pages, in-browser PDF rebuild, no upload",
  "compress-pdf": "High/Medium/Low quality presets, image-based recompression, before/after size comparison, no upload",
  "watermark-pdf": "Text watermark with font size, colour, opacity, rotation and 9-position anchors, every-page application, no upload",
  "page-numbers-pdf": "Three number formats, six position options, custom start number, font size and colour controls, no upload",
  "jpg-pdf": "Two directions in one tool: PNG/JPG/JPEG images to PDF with page-size options, and PDF to high-quality JPEGs, no upload",
  "sign-pdf": "Drawable signature pad (mouse / finger / stylus), per-page placement, in-browser PDF embedding, no upload",
  "edit-pdf": "Add text and shape overlays to any page, font and colour controls, in-browser, no upload",
  "word-to-pdf": "Word (.docx / .doc) → PDF via ConvertAPI, font and layout preserved, 10 MB file limit, files deleted after conversion",
  "pdf-to-word": "PDF → Word (.docx) via ConvertAPI, paragraphs and tables reconstructed, editable in Word/Google Docs",
  "excel-to-pdf": "Excel (.xlsx / .xls) → PDF via ConvertAPI, multi-sheet workbooks, print-area-aware, files deleted after conversion",
  "pdf-to-excel": "PDF → Excel (.xlsx) via ConvertAPI, table detection from bordered tables, values not formulas",
  "ppt-to-pdf": "PowerPoint (.pptx / .ppt) → PDF via ConvertAPI, one slide per page, aspect ratio preserved",
  "pdf-to-ppt": "PDF → PowerPoint (.pptx) via ConvertAPI, each page becomes a slide, editable text where possible",
};

export const PDF_TOOL_PUBLISHED = "2026-05-23";

export function getPdfFaqs(toolId: string): FAQItem[] {
  return PDF_FAQS[toolId as PdfToolId] ?? [];
}

export function getPdfHowTo(toolId: string): HowToStep[] {
  return PDF_HOWTOS[toolId as PdfToolId] ?? [];
}

export function getPdfFeatureList(toolId: string): string {
  return PDF_FEATURE_LISTS[toolId as PdfToolId] ?? "";
}

export function pdfToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "pdf-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
