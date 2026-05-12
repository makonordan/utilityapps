"use client";

import { useRef, useState } from "react";
import { Download, FileImage, Trash2, Upload } from "lucide-react";

import { ToolShell } from "./ToolShell";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

let nextId = 1;

// Minimal single-page-per-image PDF writer. No npm dependency.
// Each image is embedded as a JPEG XObject (we re-encode source images via
// canvas to ensure JPEG bytes regardless of input format).
async function buildPdf(items: ImageItem[]): Promise<Blob> {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let pos = 0;

  function push(s: string | Uint8Array) {
    const bytes = typeof s === "string" ? encoder.encode(s) : s;
    chunks.push(bytes);
    pos += bytes.byteLength;
  }
  function record() {
    offsets.push(pos);
  }

  push("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  // Object 1: catalog
  record();
  push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Object 2: pages tree (we'll know kids after building each page).
  // We'll fill it in by reserving its slot and placing it at the end.
  // Easier: build pages first, then write catalog/pages at end with computed refs.

  // Reset and use a different strategy: collect pages first.
  chunks.length = 0;
  offsets.length = 0;
  pos = 0;

  push("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  // We'll lay out objects:
  // 1: Catalog
  // 2: Pages
  // For each image i (0-based): 3 + i*3 = Page, +1 = Image XObject, +2 = Content stream
  const pageRefs: number[] = [];

  // Reserve catalog (will write last actually). Simpler: write catalog and pages with placeholders is complex.
  // We'll build all page objects first, capture their object numbers, then write Pages and Catalog as the
  // LAST objects in the file. PDF allows objects in any order.

  // Encode each image as JPEG bytes (re-encoding via canvas to normalise format).
  async function toJpegBytes(item: ImageItem): Promise<Uint8Array> {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = item.url;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Image load failed"));
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.92)
    );
    return new Uint8Array(await blob.arrayBuffer());
  }

  let nextObjNum = 3;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const jpeg = await toJpegBytes(item);

    const pageObjNum = nextObjNum++;
    const imageObjNum = nextObjNum++;
    const contentObjNum = nextObjNum++;

    // Page (US Letter @ 72 dpi: 612 × 792, image scaled to fit with margin).
    const pageW = 612;
    const pageH = 792;
    const margin = 36;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;
    const aspect = item.width / item.height;
    let drawW = maxW;
    let drawH = maxW / aspect;
    if (drawH > maxH) {
      drawH = maxH;
      drawW = maxH * aspect;
    }
    const drawX = (pageW - drawW) / 2;
    const drawY = (pageH - drawH) / 2;

    record();
    pageRefs.push(pageObjNum);
    push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 ${imageObjNum} 0 R >> >> /Contents ${contentObjNum} 0 R >>\nendobj\n`
    );

    // Image XObject (JPEG via DCTDecode filter — raw stream is the JPEG bytes).
    record();
    push(
      `${imageObjNum} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${item.width} /Height ${item.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.byteLength} >>\nstream\n`
    );
    push(jpeg);
    push("\nendstream\nendobj\n");

    // Content stream draws the image: q  cm  /Im0 Do  Q
    const cmd = `q\n${drawW} 0 0 ${drawH} ${drawX} ${drawY} cm\n/Im0 Do\nQ\n`;
    const cmdBytes = encoder.encode(cmd);
    record();
    push(
      `${contentObjNum} 0 obj\n<< /Length ${cmdBytes.byteLength} >>\nstream\n`
    );
    push(cmdBytes);
    push("endstream\nendobj\n");
  }

  // Pages tree (object 2) and Catalog (object 1) — append at the end.
  // Reorder the offsets array: we recorded pages/images/contents in order, so their object numbers run
  // from 3 upward. We need offsets indexed by object number 1..N. Build a map.
  const objOffsets: Record<number, number> = {};
  // Re-walk what we just wrote to map each object number to its offset.
  // We pushed in groups of 3 per image: page, image, content (objNums 3,4,5 then 6,7,8 ...).
  let objNum = 3;
  for (let i = 0; i < items.length; i++) {
    objOffsets[objNum++] = offsets[i * 3];
    objOffsets[objNum++] = offsets[i * 3 + 1];
    objOffsets[objNum++] = offsets[i * 3 + 2];
  }

  // Pages object (#2)
  objOffsets[2] = pos;
  push(
    `2 0 obj\n<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs
      .map((n) => `${n} 0 R`)
      .join(" ")}] >>\nendobj\n`
  );

  // Catalog (#1)
  objOffsets[1] = pos;
  push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // xref
  const xrefOffset = pos;
  const totalObjs = nextObjNum - 1;
  push(`xref\n0 ${totalObjs + 1}\n`);
  push("0000000000 65535 f \n");
  for (let i = 1; i <= totalObjs; i++) {
    const off = objOffsets[i] ?? 0;
    push(off.toString().padStart(10, "0") + " 00000 n \n");
  }
  push(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  // Combine.
  const totalLen = chunks.reduce((sum, c) => sum + c.byteLength, 0);
  const out = new Uint8Array(totalLen);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return new Blob([out], { type: "application/pdf" });
}

export function PdfConverter() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next: ImageItem[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(f);
      const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = url;
      });
      next.push({ id: String(nextId++), name: f.name, url, width: dims.w, height: dims.h });
    }
    setItems((prev) => [...prev, ...next]);
  }

  function remove(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  function reset() {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function download() {
    if (items.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await buildPdf(items);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `images-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF build failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell
      eyebrow="Productivity"
      title="Images → PDF Converter"
      description="Drop in images and download a single PDF, one image per US-Letter page. Files never leave your browser."
      onReset={reset}
    >
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 px-6 py-10 text-sm text-surface-600 transition hover:border-primary-400 hover:bg-primary-50/40 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-800/40 dark:text-surface-300 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
      >
        <Upload className="h-6 w-6" />
        <span className="font-semibold">Click to add images</span>
        <span className="text-xs text-surface-500 dark:text-surface-400">JPG, PNG, WebP, GIF — multiple files supported</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      {items.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.id} className="relative overflow-hidden rounded-xl border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="block aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-surface-600 dark:text-surface-300">
                  <FileImage className="mr-1 inline h-3 w-3" />
                  Page {i + 1} · {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-surface-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-800 dark:bg-error-500/15 dark:text-error-200">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={download}
        disabled={items.length === 0 || busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600 disabled:cursor-not-allowed disabled:from-surface-300 disabled:to-surface-300 disabled:opacity-60 disabled:shadow-none"
      >
        <Download className="h-4 w-4" />
        {busy ? "Building PDF…" : `Download PDF${items.length ? ` (${items.length} page${items.length === 1 ? "" : "s"})` : ""}`}
      </button>
    </ToolShell>
  );
}
