"use client";

import { useEffect, useState } from "react";
import { Edit3, FileText, Loader2, Plus, Square, Type, X } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageToCanvas } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

/**
 * Edit PDF — overlay text or shapes anywhere on a PDF page.
 * Each "annotation" is queued; clicking the page sets its x/y, then Apply
 * writes them all out with pdf-lib. Pure client-side, no flatten-to-image so
 * existing text stays selectable.
 */

type Tool = "text" | "rect" | "ellipse";

interface BaseAnn {
  id: string;
  tool: Tool;
  page: number; // 1-based
  x: number;
  y: number;
  color: string; // #rrggbb
}
interface TextAnn extends BaseAnn { tool: "text"; text: string; size: number; }
interface RectAnn extends BaseAnn { tool: "rect"; width: number; height: number; }
interface EllipseAnn extends BaseAnn { tool: "ellipse"; rx: number; ry: number; }
type Annotation = TextAnn | RectAnn | EllipseAnn;

const PREVIEW_SCALE = 1.25;

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDims, setPreviewDims] = useState<{ width: number; height: number } | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  // Draft annotation currently being placed
  const [tool, setTool] = useState<Tool>("text");
  const [text, setText] = useState("Sample text");
  const [size, setSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(40);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setNumPages(0);
      setPreviewUrl(null);
      setPreviewDims(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const doc = await openPdfDocument(file);
        if (cancelled) return;
        setNumPages(doc.numPages);
        const page = Math.min(pageNumber, doc.numPages);
        const canvas = await renderPageToCanvas(doc, page, { scale: PREVIEW_SCALE });
        if (cancelled) return;
        setPreviewUrl(canvas.toDataURL("image/png"));
        setPreviewDims({ width: canvas.width, height: canvas.height });
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Couldn't open that PDF.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file, pageNumber]);

  const placeOnPage = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!previewDims) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPx = ((e.clientX - rect.left) / rect.width) * previewDims.width;
    const yPx = ((e.clientY - rect.top) / rect.height) * previewDims.height;
    const x = xPx / PREVIEW_SCALE;
    const y = (previewDims.height - yPx) / PREVIEW_SCALE;

    const id = crypto.randomUUID();
    let ann: Annotation;
    if (tool === "text") {
      if (!text.trim()) {
        setError("Type some text before placing it.");
        return;
      }
      ann = { id, tool: "text", page: pageNumber, x, y, color, text, size };
    } else if (tool === "rect") {
      ann = { id, tool: "rect", page: pageNumber, x, y, color, width, height };
    } else {
      ann = { id, tool: "ellipse", page: pageNumber, x, y, color, rx: width / 2, ry: height / 2 };
    }
    setError(null);
    setAnnotations((prev) => [...prev, ann]);
  };

  const remove = (id: string) =>
    setAnnotations((prev) => prev.filter((a) => a.id !== id));

  const apply = async () => {
    if (!file || annotations.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      for (const ann of annotations) {
        const page = doc.getPage(ann.page - 1);
        const [r, g, b] = hexToRgb(ann.color);
        if (ann.tool === "text") {
          page.drawText(ann.text, {
            x: ann.x,
            y: ann.y,
            size: ann.size,
            font,
            color: rgb(r, g, b),
          });
        } else if (ann.tool === "rect") {
          page.drawRectangle({
            x: ann.x - ann.width / 2,
            y: ann.y - ann.height / 2,
            width: ann.width,
            height: ann.height,
            borderColor: rgb(r, g, b),
            borderWidth: 1.5,
          });
        } else {
          page.drawEllipse({
            x: ann.x,
            y: ann.y,
            xScale: ann.rx,
            yScale: ann.ry,
            borderColor: rgb(r, g, b),
            borderWidth: 1.5,
          });
        }
      }
      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-edited.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't save the edited PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <PdfDropzone onFiles={(files) => setFile(files[0])} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
          <FileText className="h-4 w-4 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
          <span className="text-[11px] text-surface-500 dark:text-surface-400">{numPages} pages · {formatBytes(file.size)}</span>
          <button type="button" onClick={() => { setFile(null); setAnnotations([]); }} aria-label="Remove" className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Preview pane */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-surface-700 dark:text-surface-200">Page</span>
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.max(1, Math.min(numPages || 1, Number(e.target.value) || 1)))}
                className="w-20 rounded-lg border border-surface-200 bg-white px-2 py-1 text-sm dark:border-surface-700 dark:bg-surface-900"
              />
              <span className="text-xs text-surface-500">of {numPages}</span>
              <span className="ml-auto rounded-full bg-surface-100 px-2.5 py-1 text-[11px] text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                {annotations.length} edit{annotations.length === 1 ? "" : "s"} queued
              </span>
            </div>

            <div className="rounded-xl border border-surface-200 bg-surface-100 p-3 dark:border-surface-800 dark:bg-surface-800/40">
              {previewUrl && previewDims ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={`Page ${pageNumber}`}
                    onClick={placeOnPage}
                    className="mx-auto block max-w-full cursor-crosshair rounded-md shadow-sm"
                  />
                  {/* Overlay markers for annotations on this page */}
                  {annotations.filter((a) => a.page === pageNumber).map((a) => {
                    const leftPct = ((a.x * PREVIEW_SCALE) / previewDims.width) * 100;
                    const topPct = (1 - (a.y * PREVIEW_SCALE) / previewDims.height) * 100;
                    return (
                      <span
                        key={a.id}
                        aria-hidden
                        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-white"
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="flex items-center justify-center gap-2 py-10 text-sm text-surface-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading page…
                </p>
              )}
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Choose a tool, set its options, then click on the page to place it.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Tool</span>
              <div role="tablist" className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl bg-surface-100 p-1.5 dark:bg-surface-800">
                {([
                  { id: "text" as const, label: "Text", icon: Type },
                  { id: "rect" as const, label: "Box", icon: Square },
                  { id: "ellipse" as const, label: "Oval", icon: Plus },
                ]).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTool(id)}
                    aria-pressed={tool === id}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition",
                      tool === id ? "bg-white text-red-700 shadow-sm dark:bg-surface-950 dark:text-red-300" : "text-surface-600 dark:text-surface-300"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {tool === "text" && (
              <>
                <label className="block">
                  <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Text</span>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
                    Font size <span className="font-normal text-surface-500">({size}pt)</span>
                  </span>
                  <input type="range" min={8} max={48} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full accent-red-500" />
                </label>
              </>
            )}

            {(tool === "rect" || tool === "ellipse") && (
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Width</span>
                  <input type="number" min={10} value={width} onChange={(e) => setWidth(Math.max(10, Number(e.target.value) || 10))} className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900" />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Height</span>
                  <input type="number" min={10} value={height} onChange={(e) => setHeight(Math.max(10, Number(e.target.value) || 10))} className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900" />
                </label>
              </div>
            )}

            <label className="flex items-center gap-3">
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">Color</span>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border border-surface-200 dark:border-surface-700" />
              <span className="font-mono text-xs text-surface-500">{color}</span>
            </label>

            {annotations.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-surface-200 dark:border-surface-800">
                <ul className="divide-y divide-surface-200 dark:divide-surface-800">
                  {annotations.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                      <span className="truncate text-surface-700 dark:text-surface-200">
                        <span className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                          p{a.page} · {a.tool}
                        </span>{" "}
                        {a.tool === "text" ? <em>“{a.text}”</em> : `${Math.round(a.x)}, ${Math.round(a.y)}`}
                      </span>
                      <button type="button" onClick={() => remove(a.id)} aria-label="Remove" className="rounded p-0.5 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
            )}

            <button
              type="button"
              onClick={apply}
              disabled={busy || annotations.length === 0}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
                busy || annotations.length === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-red-700"
              )}
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Edit3 className="h-4 w-4" />Apply &amp; download</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}
