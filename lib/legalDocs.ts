"use client";

/**
 * Shared document model + renderers for the Legal Tools category.
 *
 * Every tool's generator builds a LegalDocument tree from user form input,
 * then this file knows how to turn that tree into:
 *   • an HTML preview (for the on-page live preview)
 *   • a PDF download (pdf-lib, already used by Phase-1 PDF Tools)
 *   • a Word .docx download (the `docx` npm package)
 *
 * The boilerplate disclaimer paragraph is appended to every generated
 * document automatically — tools don't have to remember to include it.
 */

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { SITE_CONFIG } from "@/lib/utils";

// ---------------------------------------------------------------- types

export interface LegalDocument {
  /** Document title — e.g. "Privacy Policy" or "Non-Disclosure Agreement". */
  title: string;
  /** Optional subtitle line under the title (e.g. "Between Acme Inc. and …"). */
  subtitle?: string;
  /** Effective / dated line — e.g. "Effective: 23 May 2026". */
  effectiveLine?: string;
  /** Numbered sections of the document. */
  sections: LegalSection[];
  /** Optional signature block(s) appended at the end. */
  signatures?: SignatureBlock[];
}

export interface LegalSection {
  /** Section heading shown as H2 in HTML and as Heading2 in DOCX. */
  heading: string;
  /** A mix of paragraphs and bullet lists. */
  body: LegalBodyItem[];
}

export type LegalBodyItem = string | { type: "list"; items: string[] };

export interface SignatureBlock {
  /** Role label, e.g. "Signed by". */
  role: string;
  /** Pre-filled name if known, otherwise an underscored blank. */
  name?: string;
  /** Pre-filled date or blank. */
  date?: string;
}

// Standard disclaimer baked into every generated document.
const DISCLAIMER_HEADING = "Important — not legal advice";
const DISCLAIMER_BODY =
  "This document was generated from a template by UtilityApps " +
  "(utilityapps.site). It is provided as-is, with no warranty, and is not " +
  "legal advice. Laws and required clauses vary by jurisdiction and " +
  "situation. Before relying on this document, have it reviewed by a " +
  "lawyer licensed in your jurisdiction.";

/** Returns a copy of `doc` with the standard disclaimer appended as the
 *  final section. Idempotent — won't double-append if it's already there. */
function withDisclaimer(doc: LegalDocument): LegalDocument {
  const last = doc.sections[doc.sections.length - 1];
  if (last && last.heading === DISCLAIMER_HEADING) return doc;
  return {
    ...doc,
    sections: [
      ...doc.sections,
      { heading: DISCLAIMER_HEADING, body: [DISCLAIMER_BODY] },
    ],
  };
}

// -------------------------------------------------------- formatted date

/** "23 May 2026" — used for the default effective line. */
export function formatLongDate(d: Date = new Date()): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------- HTML preview

/**
 * Render the document as semantic HTML for the on-page preview pane.
 * Returns a React-friendly array of elements via the caller's renderer;
 * we return raw HTML here so React can dangerouslySetInnerHTML it (the
 * content is fully under our control — it's our template + user form
 * input that we escape).
 */
export function renderToHtml(input: LegalDocument): string {
  const doc = withDisclaimer(input);
  const parts: string[] = [];
  parts.push(`<h1>${escape(doc.title)}</h1>`);
  if (doc.subtitle) parts.push(`<p class="subtitle">${escape(doc.subtitle)}</p>`);
  if (doc.effectiveLine)
    parts.push(`<p class="effective">${escape(doc.effectiveLine)}</p>`);

  doc.sections.forEach((section, i) => {
    parts.push(`<h2>${i + 1}. ${escape(section.heading)}</h2>`);
    for (const item of section.body) {
      if (typeof item === "string") {
        parts.push(`<p>${escape(item)}</p>`);
      } else {
        parts.push(
          `<ul>${item.items
            .map((li) => `<li>${escape(li)}</li>`)
            .join("")}</ul>`
        );
      }
    }
  });

  if (doc.signatures && doc.signatures.length) {
    parts.push(`<div class="signatures">`);
    for (const sig of doc.signatures) {
      parts.push(
        `<div class="signature"><p><strong>${escape(sig.role)}</strong></p>` +
          `<p>Name: ${escape(sig.name ?? "____________________")}</p>` +
          `<p>Date: ${escape(sig.date ?? "____________________")}</p>` +
          `<p>Signature: ____________________</p></div>`
      );
    }
    parts.push(`</div>`);
  }

  return parts.join("\n");
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ----------------------------------------------------------- PDF render

/**
 * Render the document as a PDF using pdf-lib. Letter-size pages (612×792
 * points) with US-style 1" margins, Helvetica throughout. Wraps text at
 * the right margin and auto-paginates as needed.
 */
export async function renderToPdf(input: LegalDocument): Promise<Uint8Array> {
  const doc = withDisclaimer(input);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 612;
  const PAGE_H = 792;
  const MARGIN = 72;
  const LINE = 14;
  const PARA_GAP = 8;
  const SECTION_GAP = 14;
  const BODY_SIZE = 10.5;
  const H1_SIZE = 22;
  const H2_SIZE = 13;
  const TEXT_COLOR = rgb(0.12, 0.12, 0.13);
  const MUTED_COLOR = rgb(0.4, 0.4, 0.45);

  // Page cursor — we add pages and track y manually.
  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;
  const usableWidth = PAGE_W - MARGIN * 2;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };

  const drawLine = (text: string, opts: {
    f?: typeof font;
    size?: number;
    color?: ReturnType<typeof rgb>;
    indent?: number;
  } = {}) => {
    const f = opts.f ?? font;
    const size = opts.size ?? BODY_SIZE;
    const color = opts.color ?? TEXT_COLOR;
    ensureSpace(size + 4);
    page.drawText(text, { x: MARGIN + (opts.indent ?? 0), y, size, font: f, color });
    y -= LINE;
  };

  const drawWrapped = (text: string, opts: {
    f?: typeof font;
    size?: number;
    color?: ReturnType<typeof rgb>;
    indent?: number;
  } = {}) => {
    const f = opts.f ?? font;
    const size = opts.size ?? BODY_SIZE;
    const indent = opts.indent ?? 0;
    const maxWidth = usableWidth - indent;
    const words = text.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      const width = f.widthOfTextAtSize(test, size);
      if (width > maxWidth && line) {
        drawLine(line, { ...opts, f, size, indent });
        line = w;
      } else {
        line = test;
      }
    }
    if (line) drawLine(line, { ...opts, f, size, indent });
  };

  // Title
  drawLine(doc.title, { f: bold, size: H1_SIZE });
  y -= 6;
  if (doc.subtitle) {
    drawWrapped(doc.subtitle, { size: 11, color: MUTED_COLOR });
  }
  if (doc.effectiveLine) {
    drawLine(doc.effectiveLine, { size: 10, color: MUTED_COLOR });
  }
  y -= SECTION_GAP;

  // Sections
  doc.sections.forEach((section, i) => {
    y -= SECTION_GAP / 2;
    drawLine(`${i + 1}. ${section.heading}`, { f: bold, size: H2_SIZE });
    y -= 4;
    for (const item of section.body) {
      if (typeof item === "string") {
        drawWrapped(item);
        y -= PARA_GAP;
      } else {
        for (const li of item.items) {
          drawWrapped(`• ${li}`, { indent: 12 });
        }
        y -= PARA_GAP;
      }
    }
  });

  // Signatures
  if (doc.signatures && doc.signatures.length) {
    y -= SECTION_GAP;
    for (const sig of doc.signatures) {
      ensureSpace(LINE * 5);
      drawLine(sig.role, { f: bold, size: 11 });
      drawLine(`Name: ${sig.name ?? "____________________"}`);
      drawLine(`Date: ${sig.date ?? "____________________"}`);
      drawLine(`Signature: ____________________`);
      y -= SECTION_GAP;
    }
  }

  // Footer on every page with the source URL.
  const totalPages = pdf.getPageCount();
  for (let i = 0; i < totalPages; i += 1) {
    const p = pdf.getPage(i);
    p.drawText(`${SITE_CONFIG.url} · Generated template — not legal advice`, {
      x: MARGIN,
      y: MARGIN / 2,
      size: 8,
      font,
      color: MUTED_COLOR,
    });
    p.drawText(`Page ${i + 1} of ${totalPages}`, {
      x: PAGE_W - MARGIN - 60,
      y: MARGIN / 2,
      size: 8,
      font,
      color: MUTED_COLOR,
    });
  }

  return pdf.save();
}

// ----------------------------------------------------------- DOCX render

/** Render the document as a .docx Blob ready for download. */
export async function renderToDocx(input: LegalDocument): Promise<Blob> {
  const doc = withDisclaimer(input);
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: doc.title, bold: true })],
    })
  );
  if (doc.subtitle) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.subtitle, italics: true, color: "555555" })],
      })
    );
  }
  if (doc.effectiveLine) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.effectiveLine, color: "777777" })],
      })
    );
  }
  // Spacing
  children.push(new Paragraph({ children: [new TextRun("")] }));

  doc.sections.forEach((section, i) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: `${i + 1}. ${section.heading}`, bold: true })],
      })
    );
    for (const item of section.body) {
      if (typeof item === "string") {
        children.push(new Paragraph({ children: [new TextRun(item)] }));
      } else {
        for (const li of item.items) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun(li)],
            })
          );
        }
      }
    }
    children.push(new Paragraph({ children: [new TextRun("")] }));
  });

  if (doc.signatures && doc.signatures.length) {
    children.push(new Paragraph({ children: [new TextRun("")] }));
    for (const sig of doc.signatures) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: sig.role, bold: true })] })
      );
      children.push(
        new Paragraph({
          children: [new TextRun(`Name: ${sig.name ?? "____________________"}`)],
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun(`Date: ${sig.date ?? "____________________"}`)],
        })
      );
      children.push(
        new Paragraph({ children: [new TextRun("Signature: ____________________")] })
      );
      children.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }

  const document = new Document({
    creator: SITE_CONFIG.name,
    title: doc.title,
    description: `Generated by ${SITE_CONFIG.name}`,
    sections: [{ children }],
  });

  return Packer.toBlob(document);
}

// ----------------------------------------------- download convenience

/** Trigger a browser download for any blob with a chosen filename. */
export function downloadFile(data: Blob | Uint8Array, filename: string, mimeType: string) {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([data.buffer as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

// ----------------------------------------------------- safe slug helper

/** Lowercased filename-safe slug for download names. */
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60) || "document"
  );
}
