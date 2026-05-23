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
  | "edit-pdf";

export interface HowToStep {
  name: string;
  text: string;
}

const STANDARD_PRIVACY: FAQItem = {
  q: "Are my PDFs uploaded to a server?",
  a: "No. Every PDF is opened, modified and saved entirely in your browser using pdf-lib. Nothing is sent to a server. You can disconnect from the internet after the page loads and the tool still works.",
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
      a: "Both. Switch tabs: JPG → PDF combines images into a multi-page PDF; PDF → JPG renders each page of a PDF to a high-quality JPEG.",
    },
    {
      q: "Can I add multiple JPGs to one PDF?",
      a: "Yes. Drop or select all the images, drag to reorder, pick page size (A4 / Letter / Auto-fit), and one PDF is built with each image on its own page.",
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
    { name: "Pick a direction", text: "Switch between JPG → PDF and PDF → JPG tabs." },
    { name: "Add your files", text: "Drop images or a PDF into the upload area." },
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
};

export const PDF_FEATURE_LISTS: Record<PdfToolId, string> = {
  "merge-pdf": "Multi-file drag-and-drop, reorderable list, in-browser merging with pdf-lib, no upload, instant download",
  "split-pdf": "Page-range and per-page modes, ZIP bundling for per-page exports, in-browser splitting, no upload",
  "rotate-pdf": "Per-page thumbnails, multi-select rotation, 90/180/270 angles, in-browser, no upload",
  "organize-pdf": "Drag-reorder pages, delete pages, in-browser PDF rebuild, no upload",
  "compress-pdf": "High/Medium/Low quality presets, image-based recompression, before/after size comparison, no upload",
  "watermark-pdf": "Text watermark with font size, colour, opacity, rotation and 9-position anchors, every-page application, no upload",
  "page-numbers-pdf": "Three number formats, six position options, custom start number, font size and colour controls, no upload",
  "jpg-pdf": "Two directions in one tool: multi-image to PDF with page-size options, and PDF to high-quality JPEGs, no upload",
  "sign-pdf": "Drawable signature pad (mouse / finger / stylus), per-page placement, in-browser PDF embedding, no upload",
  "edit-pdf": "Add text and shape overlays to any page, font and colour controls, in-browser, no upload",
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
