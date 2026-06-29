"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bold,
  ChevronDown,
  Circle,
  Eraser,
  FileText,
  Hand,
  Image as ImageIcon,
  Italic,
  Layers,
  Loader2,
  Minus as LineIcon,
  MoveDown,
  MoveUp,
  Pencil,
  Save,
  Shapes,
  Square,
  Trash2,
  Type,
  Underline,
  X,
} from "lucide-react";
import {
  PDFDocument,
  PDFFont,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import {
  downloadBlob,
  formatBytes,
  openPdfDocument,
  renderPageToCanvas,
} from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

/**
 * Full interactive PDF editor — the v2 rewrite that replaces the old
 * "click to queue" UI with a proper select/drag/resize annotation editor.
 *
 * Feature set matches the iLovePDF Edit-PDF baseline:
 *   - Tools: hand (pan/select), text, image, freehand draw, shapes
 *     (line, rectangle, circle)
 *   - Per-item floating toolbar with the right controls for the type
 *     (text formatting, shape stroke/fill, etc.)
 *   - Items can be selected, dragged, resized via corner handles
 *   - Right sidebar lists all annotations grouped by page, with
 *     reorder (z-order), per-item edit/delete, and a "Remove all" link
 *   - Multi-page support with a left thumbnail strip
 *   - Save → pdf-lib bakes annotations into a new PDF you download
 *
 * All client-side, no upload, no server processing.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

type Tool = "hand" | "text" | "image" | "draw" | "line" | "rect" | "circle";

type FontFamily = "Helvetica" | "TimesRoman" | "Courier";

interface Common {
  id: string;
  page: number; // 1-based
  /** Z-order within the page. Higher = front. */
  z: number;
  opacity: number; // 0..1
}

interface TextAnn extends Common {
  kind: "text";
  /** Top-left in canvas px (preview coords). Converted at save time. */
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}

interface ImageAnn extends Common {
  kind: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  /** data URL — kept around so the overlay can render the actual image. */
  src: string;
  /** Bytes the embed step uses. Kept alongside src so we don't have to
   *  decode the data URL twice. */
  bytes: Uint8Array;
  format: "png" | "jpeg";
}

interface LineAnn extends Common {
  kind: "line";
  x: number; y: number; x2: number; y2: number;
  color: string;
  strokeWidth: number;
}

interface RectAnn extends Common {
  kind: "rect";
  x: number; y: number; width: number; height: number;
  borderColor: string;
  fillColor: string | null;
  strokeWidth: number;
}

interface CircleAnn extends Common {
  kind: "circle";
  x: number; y: number; width: number; height: number; // bounding box
  borderColor: string;
  fillColor: string | null;
  strokeWidth: number;
}

interface DrawAnn extends Common {
  kind: "draw";
  /** Points are in canvas px relative to the page, captured by mouse. */
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

type Ann = TextAnn | ImageAnn | LineAnn | RectAnn | CircleAnn | DrawAnn;

// ─── Constants ─────────────────────────────────────────────────────────────

const PREVIEW_SCALE = 1.5;
const THUMB_SCALE = 0.18;
const HANDLE_PX = 10;

// ─── Helpers ───────────────────────────────────────────────────────────────

function uid(): string {
  return crypto.randomUUID();
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

function fontKey(fam: FontFamily, bold: boolean, italic: boolean): StandardFonts {
  if (fam === "TimesRoman") {
    if (bold && italic) return StandardFonts.TimesRomanBoldItalic;
    if (bold) return StandardFonts.TimesRomanBold;
    if (italic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }
  if (fam === "Courier") {
    if (bold && italic) return StandardFonts.CourierBoldOblique;
    if (bold) return StandardFonts.CourierBold;
    if (italic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }
  if (bold && italic) return StandardFonts.HelveticaBoldOblique;
  if (bold) return StandardFonts.HelveticaBold;
  if (italic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

/** CSS font-family + style/weight string for the in-browser overlay so
 *  the preview matches what pdf-lib will draw at save time. */
function cssFont(fam: FontFamily): string {
  if (fam === "TimesRoman") return '"Times New Roman", Times, serif';
  if (fam === "Courier") return '"Courier New", Courier, monospace';
  return "Helvetica, Arial, sans-serif";
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Couldn't read image"));
    r.readAsDataURL(file);
  });
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

// ─── Main component ────────────────────────────────────────────────────────

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDims, setPreviewDims] = useState<{ w: number; h: number } | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);

  const [tool, setTool] = useState<Tool>("hand");
  const [annotations, setAnnotations] = useState<Ann[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // ── Load + render the current page ───────────────────────────────────────
  useEffect(() => {
    if (!file) {
      setNumPages(0);
      setPreviewUrl(null);
      setPreviewDims(null);
      setThumbs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const doc = await openPdfDocument(file);
        if (cancelled) return;
        setNumPages(doc.numPages);
        // Render the active page at preview scale.
        const page = Math.min(pageNumber, doc.numPages);
        const canvas = await renderPageToCanvas(doc, page, { scale: PREVIEW_SCALE });
        if (cancelled) return;
        setPreviewUrl(canvas.toDataURL("image/png"));
        setPreviewDims({ w: canvas.width, h: canvas.height });
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

  // Generate page thumbnails once when the file loads, in the background.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        const doc = await openPdfDocument(file);
        const out: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const canvas = await renderPageToCanvas(doc, i, { scale: THUMB_SCALE });
          out.push(canvas.toDataURL("image/png"));
          if (cancelled) return;
        }
        if (!cancelled) setThumbs(out);
      } catch {
        /* thumbnails are non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // ── Annotation actions ────────────────────────────────────────────────────
  const nextZ = useCallback(
    (page: number) => {
      const onPage = annotations.filter((a) => a.page === page);
      return onPage.reduce((m, a) => Math.max(m, a.z), 0) + 1;
    },
    [annotations]
  );

  const addAnnotation = useCallback((a: Ann) => {
    setAnnotations((prev) => [...prev, a]);
    setSelectedId(a.id);
  }, []);

  const updateAnnotation = useCallback((id: string, patch: Partial<Ann>) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? ({ ...a, ...patch } as Ann) : a))
    );
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setSelectedId((sel) => (sel === id ? null : sel));
  }, []);

  const removeAll = useCallback(() => {
    setAnnotations([]);
    setSelectedId(null);
  }, []);

  const moveZ = useCallback(
    (id: string, delta: 1 | -1) => {
      setAnnotations((prev) => {
        const ann = prev.find((a) => a.id === id);
        if (!ann) return prev;
        const onPage = prev.filter((a) => a.page === ann.page);
        const ordered = [...onPage].sort((a, b) => a.z - b.z);
        const idx = ordered.findIndex((a) => a.id === id);
        const swapIdx = idx + delta;
        if (swapIdx < 0 || swapIdx >= ordered.length) return prev;
        const swap = ordered[swapIdx];
        return prev.map((a) => {
          if (a.id === ann.id) return { ...a, z: swap.z };
          if (a.id === swap.id) return { ...a, z: ann.z };
          return a;
        });
      });
    },
    []
  );

  // ── Canvas click → place new annotation ──────────────────────────────────
  const placeOnCanvas = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Clicks on existing annotation children bubble up here; let them
      // through to their own handlers without inserting a new annotation.
      if (e.target !== e.currentTarget) return;

      if (tool === "hand") {
        setSelectedId(null);
        return;
      }

      if (!previewDims) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (previewDims.w / rect.width);
      const y = (e.clientY - rect.top) * (previewDims.h / rect.height);

      const base: Common = {
        id: uid(),
        page: pageNumber,
        z: nextZ(pageNumber),
        opacity: 1,
      };

      if (tool === "text") {
        addAnnotation({
          ...base,
          kind: "text",
          x,
          y,
          width: 200,
          height: 32,
          text: "New text",
          fontFamily: "Helvetica",
          fontSize: 16,
          bold: false,
          italic: false,
          underline: false,
          color: "#111111",
        });
      } else if (tool === "rect") {
        addAnnotation({
          ...base,
          kind: "rect",
          x,
          y,
          width: 140,
          height: 80,
          borderColor: "#dc2626",
          fillColor: null,
          strokeWidth: 2,
        });
      } else if (tool === "circle") {
        addAnnotation({
          ...base,
          kind: "circle",
          x,
          y,
          width: 100,
          height: 100,
          borderColor: "#dc2626",
          fillColor: null,
          strokeWidth: 2,
        });
      } else if (tool === "line") {
        addAnnotation({
          ...base,
          kind: "line",
          x,
          y,
          x2: x + 140,
          y2: y,
          color: "#dc2626",
          strokeWidth: 2,
        });
      } else if (tool === "image") {
        // Trigger the hidden file picker; insert happens in its onChange.
        imageInputRef.current?.click();
      }
    },
    [addAnnotation, nextZ, pageNumber, previewDims, tool]
  );

  // Image picker handler.
  const onImagePicked = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = ""; // allow re-selecting the same image
      if (!f) return;
      if (!/^image\/(png|jpe?g)$/.test(f.type)) {
        setError("Only PNG or JPG images can be added.");
        return;
      }
      try {
        const src = await readFileAsDataUrl(f);
        const bytes = dataUrlToBytes(src);
        // Size the image to roughly 1/4 of the page width to start.
        const w = previewDims ? Math.min(previewDims.w * 0.25, 240) : 200;
        const probe = new Image();
        probe.src = src;
        await new Promise((res) => (probe.onload = res));
        const aspect = probe.naturalWidth / probe.naturalHeight || 1;
        const h = w / aspect;
        addAnnotation({
          id: uid(),
          kind: "image",
          page: pageNumber,
          z: nextZ(pageNumber),
          opacity: 1,
          x: previewDims ? (previewDims.w - w) / 2 : 40,
          y: previewDims ? (previewDims.h - h) / 2 : 40,
          width: w,
          height: h,
          src,
          bytes,
          format: f.type === "image/png" ? "png" : "jpeg",
        });
      } catch (err) {
        console.error(err);
        setError("Couldn't load that image.");
      }
    },
    [addAnnotation, nextZ, pageNumber, previewDims]
  );

  // ── Freehand draw ────────────────────────────────────────────────────────
  const drawStateRef = useRef<{ id: string; points: { x: number; y: number }[] } | null>(null);

  const beginDraw = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tool !== "draw") return;
    if (e.target !== e.currentTarget) return;
    if (!previewDims) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (previewDims.w / rect.width);
    const y = (e.clientY - rect.top) * (previewDims.h / rect.height);
    const ann: DrawAnn = {
      id: uid(),
      kind: "draw",
      page: pageNumber,
      z: nextZ(pageNumber),
      opacity: 1,
      points: [{ x, y }],
      color: "#dc2626",
      strokeWidth: 2,
    };
    drawStateRef.current = { id: ann.id, points: ann.points };
    addAnnotation(ann);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const continueDraw = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = drawStateRef.current;
    if (!state || !previewDims) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (previewDims.w / rect.width);
    const y = (e.clientY - rect.top) * (previewDims.h / rect.height);
    state.points.push({ x, y });
    updateAnnotation(state.id, { points: [...state.points] } as Partial<DrawAnn>);
  };

  const endDraw = () => {
    drawStateRef.current = null;
  };

  // ── Save (apply all annotations to the PDF) ──────────────────────────────
  const save = async () => {
    if (!file || annotations.length === 0 || !previewDims) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);

      // Cache font + image embeds so we don't re-upload them per-page.
      const fontCache = new Map<StandardFonts, PDFFont>();
      const getFont = async (k: StandardFonts) => {
        const cached = fontCache.get(k);
        if (cached) return cached;
        const f = await doc.embedFont(k);
        fontCache.set(k, f);
        return f;
      };

      const sortedByZ = [...annotations].sort((a, b) => a.z - b.z);

      // Translate canvas-pixel coords into PDF points for the active page's
      // dimensions. The preview was rendered at PREVIEW_SCALE relative to
      // the actual PDF mediabox, so dividing by it gets us back to points.
      // Y axis flips: canvas origin is top-left, PDF origin is bottom-left.
      const toPdf = (ann: Ann, page: ReturnType<typeof doc.getPage>) => {
        const { height: pdfH } = page.getSize();
        const previewH = previewDims.h;
        const previewW = previewDims.w;
        const scaleY = pdfH / previewH;
        const scaleX = page.getSize().width / previewW;
        const scale = (scaleX + scaleY) / 2; // they should match within rounding
        return { scale, scaleX, scaleY, pdfH };
      };

      for (const a of sortedByZ) {
        const page = doc.getPage(a.page - 1);
        const { scaleX, scaleY, pdfH } = toPdf(a, page);

        if (a.kind === "text") {
          const f = await getFont(fontKey(a.fontFamily, a.bold, a.italic));
          const [r, g, b] = hexToRgb(a.color);
          const sizePt = a.fontSize * scaleY;
          // Text baseline lives at the bottom of the glyphs; the overlay
          // shows the top of the box at `y`, so the baseline sits at
          // (y + height - small descent margin).
          const xPt = a.x * scaleX;
          const yPt = pdfH - (a.y + a.height) * scaleY + sizePt * 0.2;
          page.drawText(a.text, {
            x: xPt,
            y: yPt,
            size: sizePt,
            font: f,
            color: rgb(r, g, b),
            opacity: a.opacity,
          });
          if (a.underline) {
            const textW = f.widthOfTextAtSize(a.text, sizePt);
            page.drawLine({
              start: { x: xPt, y: yPt - 1.5 },
              end: { x: xPt + textW, y: yPt - 1.5 },
              thickness: Math.max(0.5, sizePt / 16),
              color: rgb(r, g, b),
              opacity: a.opacity,
            });
          }
        } else if (a.kind === "image") {
          const img =
            a.format === "png"
              ? await doc.embedPng(a.bytes)
              : await doc.embedJpg(a.bytes);
          page.drawImage(img, {
            x: a.x * scaleX,
            y: pdfH - (a.y + a.height) * scaleY,
            width: a.width * scaleX,
            height: a.height * scaleY,
            opacity: a.opacity,
          });
        } else if (a.kind === "line") {
          const [r, g, b] = hexToRgb(a.color);
          page.drawLine({
            start: { x: a.x * scaleX, y: pdfH - a.y * scaleY },
            end: { x: a.x2 * scaleX, y: pdfH - a.y2 * scaleY },
            thickness: a.strokeWidth * scaleX,
            color: rgb(r, g, b),
            opacity: a.opacity,
          });
        } else if (a.kind === "rect") {
          const [br, bg, bb] = hexToRgb(a.borderColor);
          const fill = a.fillColor ? hexToRgb(a.fillColor) : null;
          page.drawRectangle({
            x: a.x * scaleX,
            y: pdfH - (a.y + a.height) * scaleY,
            width: a.width * scaleX,
            height: a.height * scaleY,
            borderColor: rgb(br, bg, bb),
            color: fill ? rgb(fill[0], fill[1], fill[2]) : undefined,
            borderWidth: a.strokeWidth * scaleX,
            opacity: a.opacity,
          });
        } else if (a.kind === "circle") {
          const [br, bg, bb] = hexToRgb(a.borderColor);
          const fill = a.fillColor ? hexToRgb(a.fillColor) : null;
          // pdf-lib's drawEllipse centres at (x, y) with x/yScale as radii.
          const cxPt = (a.x + a.width / 2) * scaleX;
          const cyPt = pdfH - (a.y + a.height / 2) * scaleY;
          page.drawEllipse({
            x: cxPt,
            y: cyPt,
            xScale: (a.width / 2) * scaleX,
            yScale: (a.height / 2) * scaleY,
            borderColor: rgb(br, bg, bb),
            color: fill ? rgb(fill[0], fill[1], fill[2]) : undefined,
            borderWidth: a.strokeWidth * scaleX,
            opacity: a.opacity,
          });
        } else if (a.kind === "draw") {
          if (a.points.length < 2) continue;
          const [r, g, b] = hexToRgb(a.color);
          // Convert points to a single SVG path and let pdf-lib stroke it
          // in one operation (cheaper than N drawLine calls).
          const path = a.points
            .map((p, i) => {
              const xp = p.x * scaleX;
              const yp = pdfH - p.y * scaleY;
              return `${i === 0 ? "M" : "L"} ${xp.toFixed(2)} ${yp.toFixed(2)}`;
            })
            .join(" ");
          page.drawSvgPath(path, {
            borderColor: rgb(r, g, b),
            borderWidth: a.strokeWidth * scaleX,
            opacity: a.opacity,
          });
        }
      }

      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-edited.pdf");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? `Couldn't save: ${err.message}` : "Couldn't save the edited PDF.");
    } finally {
      setBusy(false);
    }
  };

  // ── Derived data for rendering ───────────────────────────────────────────
  const visibleAnnotations = useMemo(
    () => annotations.filter((a) => a.page === pageNumber).sort((a, b) => a.z - b.z),
    [annotations, pageNumber]
  );
  const selected = annotations.find((a) => a.id === selectedId) ?? null;

  // ── Render ───────────────────────────────────────────────────────────────
  if (!file) {
    return (
      <div className="space-y-5">
        <PdfDropzone
          onFiles={(files) => {
            setFile(files[0]);
            setAnnotations([]);
            setSelectedId(null);
            setPageNumber(1);
            setError(null);
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File header */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
        <FileText className="h-4 w-4 shrink-0 text-red-500" />
        <span className="flex-1 truncate text-sm font-medium text-surface-900 dark:text-white">
          {file.name}
        </span>
        <span className="text-[11px] text-surface-500 dark:text-surface-400">
          {numPages} page{numPages === 1 ? "" : "s"} · {formatBytes(file.size)}
        </span>
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setAnnotations([]);
            setSelectedId(null);
            setThumbs([]);
            setError(null);
          }}
          aria-label="Remove file"
          className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tool palette */}
      <Toolbar tool={tool} onTool={setTool} />

      {/* Floating format toolbar for the selected item */}
      {selected && (
        <SelectionToolbar
          ann={selected}
          onChange={(patch) => updateAnnotation(selected.id, patch)}
          onDelete={() => removeAnnotation(selected.id)}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[110px_1fr_280px]">
        {/* Page thumbnails */}
        <PageThumbnails
          thumbs={thumbs}
          active={pageNumber}
          onSelect={(p) => {
            setPageNumber(p);
            setSelectedId(null);
          }}
        />

        {/* Canvas + overlays */}
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-200 bg-surface-100 p-3 dark:border-surface-800 dark:bg-surface-800/40">
            {previewUrl && previewDims ? (
              <div
                className={cn(
                  "relative mx-auto inline-block max-w-full select-none",
                  tool === "hand" ? "cursor-grab" : tool === "draw" ? "cursor-crosshair" : "cursor-crosshair"
                )}
                style={{ width: "100%", maxWidth: previewDims.w }}
                onClick={placeOnCanvas}
                onPointerDown={beginDraw}
                onPointerMove={continueDraw}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
              >
                {/* Background page */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`Page ${pageNumber}`}
                  className="block w-full rounded-md shadow-sm"
                  draggable={false}
                />

                {/* Overlay annotations */}
                {visibleAnnotations.map((a) => (
                  <AnnotationOverlay
                    key={a.id}
                    ann={a}
                    pageDims={previewDims}
                    isSelected={a.id === selectedId}
                    isHandTool={tool === "hand"}
                    onSelect={() => setSelectedId(a.id)}
                    onChange={(patch) => updateAnnotation(a.id, patch)}
                  />
                ))}
              </div>
            ) : (
              <p className="flex items-center justify-center gap-2 py-12 text-sm text-surface-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading page…
              </p>
            )}
          </div>

          {/* Page nav */}
          <div className="flex items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-900">
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="rounded-lg p-1.5 text-surface-600 transition hover:bg-surface-100 disabled:opacity-40 dark:text-surface-300 dark:hover:bg-surface-800"
              aria-label="Previous page"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
            <span className="text-xs font-medium tabular-nums text-surface-700 dark:text-surface-200">
              Page {pageNumber} of {numPages}
            </span>
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="rounded-lg p-1.5 text-surface-600 transition hover:bg-surface-100 disabled:opacity-40 dark:text-surface-300 dark:hover:bg-surface-800"
              aria-label="Next page"
            >
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>

        {/* Item sidebar */}
        <Sidebar
          allAnnotations={annotations}
          activePage={pageNumber}
          selectedId={selectedId}
          onSelect={(id, page) => {
            setSelectedId(id);
            if (page !== pageNumber) setPageNumber(page);
          }}
          onDelete={removeAnnotation}
          onMoveUp={(id) => moveZ(id, 1)}
          onMoveDown={(id) => moveZ(id, -1)}
          onRemoveAll={removeAll}
          onSave={save}
          busy={busy}
          numPages={numPages}
        />
      </div>

      {/* Hidden image picker */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={onImagePicked}
      />

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────

function Toolbar({ tool, onTool }: { tool: Tool; onTool: (t: Tool) => void }) {
  const buttons: {
    id: Tool;
    label: string;
    icon: typeof Hand;
  }[] = [
    { id: "hand", label: "Hand (select / pan)", icon: Hand },
    { id: "text", label: "Add text", icon: Type },
    { id: "image", label: "Add image", icon: ImageIcon },
    { id: "draw", label: "Freehand draw", icon: Pencil },
  ];
  const shapeButtons: { id: Tool; label: string; icon: typeof LineIcon }[] = [
    { id: "line", label: "Line", icon: LineIcon },
    { id: "rect", label: "Rectangle", icon: Square },
    { id: "circle", label: "Circle", icon: Circle },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-surface-200 bg-white p-1.5 dark:border-surface-800 dark:bg-surface-900">
      {buttons.map(({ id, label, icon: Icon }) => (
        <ToolBtn key={id} active={tool === id} onClick={() => onTool(id)} title={label}>
          <Icon className="h-4 w-4" />
        </ToolBtn>
      ))}
      <span className="mx-1 h-6 w-px bg-surface-200 dark:bg-surface-800" />
      <span className="flex items-center gap-1">
        <Shapes className="ml-1 h-3.5 w-3.5 text-surface-400" aria-hidden />
        {shapeButtons.map(({ id, label, icon: Icon }) => (
          <ToolBtn key={id} active={tool === id} onClick={() => onTool(id)} title={label}>
            <Icon className="h-4 w-4" />
          </ToolBtn>
        ))}
      </span>
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      aria-label={title}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg transition",
        active
          ? "bg-red-600 text-white shadow-sm"
          : "text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
      )}
    >
      {children}
    </button>
  );
}

function PageThumbnails({
  thumbs,
  active,
  onSelect,
}: {
  thumbs: string[];
  active: number;
  onSelect: (page: number) => void;
}) {
  if (thumbs.length === 0) {
    return (
      <div className="hidden rounded-xl border border-surface-200 bg-surface-50 p-3 text-center text-[11px] text-surface-500 lg:block dark:border-surface-800 dark:bg-surface-900/40 dark:text-surface-400">
        Loading thumbnails…
      </div>
    );
  }
  return (
    <div className="hidden max-h-[600px] overflow-y-auto rounded-xl border border-surface-200 bg-surface-50 p-2 lg:block dark:border-surface-800 dark:bg-surface-900/40">
      <ul className="space-y-2">
        {thumbs.map((src, i) => {
          const page = i + 1;
          const isActive = page === active;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(page)}
                className={cn(
                  "block w-full overflow-hidden rounded-md border transition",
                  isActive
                    ? "border-red-500 ring-2 ring-red-500/30"
                    : "border-surface-200 hover:border-red-300 dark:border-surface-800 dark:hover:border-red-700/60"
                )}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Page ${page}`} className="block w-full" />
                <span className="block bg-white py-0.5 text-center text-[10px] font-medium text-surface-700 dark:bg-surface-900 dark:text-surface-200">
                  {page}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Sidebar({
  allAnnotations,
  activePage,
  selectedId,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  onRemoveAll,
  onSave,
  busy,
  numPages,
}: {
  allAnnotations: Ann[];
  activePage: number;
  selectedId: string | null;
  onSelect: (id: string, page: number) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemoveAll: () => void;
  onSave: () => void;
  busy: boolean;
  numPages: number;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Edit PDF
        </h3>
        {allAnnotations.length > 0 && (
          <button
            type="button"
            onClick={onRemoveAll}
            className="text-[11px] font-medium text-red-600 hover:underline dark:text-red-400"
          >
            Remove all
          </button>
        )}
      </header>

      <p className="flex items-start gap-1.5 rounded-lg bg-surface-100 px-2.5 py-2 text-[11px] text-surface-600 dark:bg-surface-800 dark:text-surface-300">
        <Layers className="mt-0.5 h-3 w-3 shrink-0 text-surface-500" />
        Use ↑↓ to move items front or back. Click an item to select it.
      </p>

      <div className="max-h-[460px] space-y-3 overflow-y-auto">
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
          const items = allAnnotations
            .filter((a) => a.page === page)
            .sort((a, b) => b.z - a.z); // top of list = front
          if (items.length === 0) return null;
          return (
            <section key={page}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Page {page}
              </p>
              <ul className="space-y-1">
                {items.map((a) => (
                  <li key={a.id}>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition",
                        a.id === selectedId
                          ? "border-red-300 bg-red-50 dark:border-red-700/50 dark:bg-red-500/10"
                          : "border-surface-200 hover:border-surface-300 dark:border-surface-800 dark:hover:border-surface-700"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(a.id, a.page)}
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <AnnotationIcon ann={a} />
                        <span className="truncate text-surface-800 dark:text-surface-100">
                          {labelFor(a)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveUp(a.id)}
                        title="Move forward"
                        aria-label="Move forward"
                        className="rounded p-0.5 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700"
                      >
                        <MoveUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveDown(a.id)}
                        title="Move backward"
                        aria-label="Move backward"
                        className="rounded p-0.5 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700"
                      >
                        <MoveDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(a.id)}
                        title="Delete"
                        aria-label="Delete"
                        className="rounded p-0.5 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {allAnnotations.length === 0 && (
          <p className="rounded-lg border border-dashed border-surface-200 p-4 text-center text-[11px] text-surface-500 dark:border-surface-800">
            Nothing here yet. Pick a tool above and click on the page.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={busy || allAnnotations.length === 0}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition",
          busy || allAnnotations.length === 0
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-red-700"
        )}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save changes
          </>
        )}
      </button>
      {allAnnotations.length === 0 && (
        <p className="text-center text-[11px] text-surface-500 dark:text-surface-400">
          Add at least one item to enable saving.
        </p>
      )}
    </div>
  );
}

function AnnotationIcon({ ann }: { ann: Ann }) {
  const cls = "h-3 w-3 text-surface-500 dark:text-surface-400";
  if (ann.kind === "text") return <Type className={cls} />;
  if (ann.kind === "image") return <ImageIcon className={cls} />;
  if (ann.kind === "rect") return <Square className={cls} />;
  if (ann.kind === "circle") return <Circle className={cls} />;
  if (ann.kind === "line") return <LineIcon className={cls} />;
  return <Pencil className={cls} />;
}

function labelFor(a: Ann): string {
  if (a.kind === "text") return a.text.slice(0, 30) || "Empty text";
  if (a.kind === "image") return "Image";
  if (a.kind === "rect") return "Rectangle";
  if (a.kind === "circle") return "Circle";
  if (a.kind === "line") return "Line";
  return `Drawing (${a.points.length} pts)`;
}

function SelectionToolbar({
  ann,
  onChange,
  onDelete,
}: {
  ann: Ann;
  onChange: (patch: Partial<Ann>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-surface-200 bg-white p-1.5 dark:border-surface-800 dark:bg-surface-900">
      {ann.kind === "text" && (
        <>
          <select
            value={ann.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value as FontFamily } as Partial<TextAnn>)}
            className="rounded-md border border-surface-200 bg-white px-2 py-1 text-xs dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="TimesRoman">Times New Roman</option>
            <option value="Courier">Courier</option>
          </select>
          <input
            type="number"
            min={6}
            max={120}
            value={ann.fontSize}
            onChange={(e) =>
              onChange({ fontSize: Math.max(6, Math.min(120, Number(e.target.value) || 0)) } as Partial<TextAnn>)
            }
            className="w-14 rounded-md border border-surface-200 bg-white px-2 py-1 text-xs dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
          <ToggleBtn active={ann.bold} onClick={() => onChange({ bold: !ann.bold } as Partial<TextAnn>)} title="Bold">
            <Bold className="h-3.5 w-3.5" />
          </ToggleBtn>
          <ToggleBtn active={ann.italic} onClick={() => onChange({ italic: !ann.italic } as Partial<TextAnn>)} title="Italic">
            <Italic className="h-3.5 w-3.5" />
          </ToggleBtn>
          <ToggleBtn active={ann.underline} onClick={() => onChange({ underline: !ann.underline } as Partial<TextAnn>)} title="Underline">
            <Underline className="h-3.5 w-3.5" />
          </ToggleBtn>
          <ColorBtn label="Text" value={ann.color} onChange={(c) => onChange({ color: c } as Partial<TextAnn>)} />
        </>
      )}

      {(ann.kind === "rect" || ann.kind === "circle") && (
        <>
          <ColorBtn label="Stroke" value={ann.borderColor} onChange={(c) => onChange({ borderColor: c } as Partial<Ann>)} />
          <ColorBtn
            label="Fill"
            value={ann.fillColor ?? "#000000"}
            onChange={(c) => onChange({ fillColor: c } as Partial<Ann>)}
            allowClear
            cleared={ann.fillColor === null}
            onClear={() => onChange({ fillColor: null } as Partial<Ann>)}
          />
          <NumberBtn
            label="Stroke"
            value={ann.strokeWidth}
            min={0.5}
            max={20}
            step={0.5}
            onChange={(n) => onChange({ strokeWidth: n } as Partial<Ann>)}
          />
        </>
      )}

      {(ann.kind === "line" || ann.kind === "draw") && (
        <>
          <ColorBtn label="Color" value={ann.color} onChange={(c) => onChange({ color: c } as Partial<Ann>)} />
          <NumberBtn
            label="Width"
            value={ann.strokeWidth}
            min={0.5}
            max={20}
            step={0.5}
            onChange={(n) => onChange({ strokeWidth: n } as Partial<Ann>)}
          />
        </>
      )}

      {/* Opacity is universal. */}
      <label className="ml-1 flex items-center gap-1.5 text-[11px] text-surface-600 dark:text-surface-300">
        Opacity
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(ann.opacity * 100)}
          onChange={(e) => onChange({ opacity: Number(e.target.value) / 100 } as Partial<Ann>)}
          className="w-20 accent-red-500"
        />
        <span className="w-7 text-right font-mono">{Math.round(ann.opacity * 100)}%</span>
      </label>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        title="Delete"
        className="ml-auto rounded-md p-1.5 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md",
        active
          ? "bg-surface-900 text-white dark:bg-white dark:text-surface-900"
          : "text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
      )}
    >
      {children}
    </button>
  );
}

function ColorBtn({
  label,
  value,
  onChange,
  allowClear,
  cleared,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
  allowClear?: boolean;
  cleared?: boolean;
  onClear?: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-1.5 py-0.5 text-[11px] dark:border-surface-700">
      <span className="text-surface-600 dark:text-surface-300">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-7 cursor-pointer rounded bg-transparent p-0"
        style={cleared ? { opacity: 0.3 } : undefined}
      />
      {allowClear && (
        <button
          type="button"
          onClick={onClear}
          title={cleared ? "Fill is off" : "Remove fill"}
          aria-label="Remove fill"
          className="rounded p-0.5 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
        >
          <Eraser className="h-3 w-3" />
        </button>
      )}
    </label>
  );
}

function NumberBtn({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-1.5 py-0.5 text-[11px] dark:border-surface-700">
      <span className="text-surface-600 dark:text-surface-300">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="w-14 rounded bg-white px-1 py-0.5 text-right tabular-nums dark:bg-surface-900"
      />
    </label>
  );
}

// ─── Annotation overlay (with drag + resize) ───────────────────────────────

interface OverlayProps {
  ann: Ann;
  pageDims: { w: number; h: number };
  isSelected: boolean;
  isHandTool: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<Ann>) => void;
}

function AnnotationOverlay({ ann, pageDims, isSelected, isHandTool, onSelect, onChange }: OverlayProps) {
  // Drawing strokes render as SVG; they aren't draggable in this v1.
  if (ann.kind === "draw") {
    return (
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        viewBox={`0 0 ${pageDims.w} ${pageDims.h}`}
        preserveAspectRatio="none"
      >
        <path
          d={ann.points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ")}
          fill="none"
          stroke={ann.color}
          strokeWidth={ann.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={ann.opacity}
        />
      </svg>
    );
  }

  // For lines, render a 1D box that you drag both endpoints of.
  if (ann.kind === "line") {
    return (
      <LineOverlay
        ann={ann}
        pageDims={pageDims}
        isSelected={isSelected}
        isHandTool={isHandTool}
        onSelect={onSelect}
        onChange={onChange}
      />
    );
  }

  return (
    <BoxOverlay
      ann={ann}
      pageDims={pageDims}
      isSelected={isSelected}
      isHandTool={isHandTool}
      onSelect={onSelect}
      onChange={onChange}
    />
  );
}

/** Boxed annotations (text, image, rect, circle) all share the same drag +
 *  8-handle resize behaviour, just with different visual content. */
function BoxOverlay({ ann, pageDims, isSelected, isHandTool, onSelect, onChange }: OverlayProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Width/height shortcuts. Reads from the discriminated type below.
  const a = ann as Exclude<Ann, DrawAnn | LineAnn>;

  const startDrag = (e: React.PointerEvent) => {
    if (!isHandTool && !isSelected) {
      onSelect();
      return;
    }
    onSelect();
    e.preventDefault();
    e.stopPropagation();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = a.x;
    const startY = a.y;
    const parent = boxRef.current?.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const scaleX = pageDims.w / parentRect.width;
    const scaleY = pageDims.h / parentRect.height;

    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startMouseX) * scaleX;
      const dy = (ev.clientY - startMouseY) * scaleY;
      onChange({ x: clamp(startX + dx, 0, pageDims.w - a.width), y: clamp(startY + dy, 0, pageDims.h - a.height) } as Partial<Ann>);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (corner: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const start = { x: a.x, y: a.y, w: a.width, h: a.height };
    const parent = boxRef.current?.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const scaleX = pageDims.w / parentRect.width;
    const scaleY = pageDims.h / parentRect.height;

    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startMouseX) * scaleX;
      const dy = (ev.clientY - startMouseY) * scaleY;
      let { x, y, w, h } = start;
      const min = 16;
      if (corner.includes("e")) w = Math.max(min, start.w + dx);
      if (corner.includes("s")) h = Math.max(min, start.h + dy);
      if (corner.includes("w")) {
        const newW = Math.max(min, start.w - dx);
        x = start.x + (start.w - newW);
        w = newW;
      }
      if (corner.includes("n")) {
        const newH = Math.max(min, start.h - dy);
        y = start.y + (start.h - newH);
        h = newH;
      }
      onChange({ x, y, width: w, height: h } as Partial<Ann>);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const left = (a.x / pageDims.w) * 100;
  const top = (a.y / pageDims.h) * 100;
  const widthPct = (a.width / pageDims.w) * 100;
  const heightPct = (a.height / pageDims.h) * 100;

  return (
    <div
      ref={boxRef}
      role="button"
      tabIndex={0}
      onPointerDown={startDrag}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        cursor: isHandTool ? "move" : "pointer",
        opacity: a.opacity,
      }}
      className={cn(isSelected && "outline outline-2 outline-red-500")}
    >
      {/* Visual content per kind. */}
      {ann.kind === "text" && (
        <TextContent ann={ann as TextAnn} onChange={(p) => onChange(p as Partial<Ann>)} />
      )}
      {ann.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={(ann as ImageAnn).src}
          alt=""
          draggable={false}
          className="block h-full w-full object-fill"
        />
      )}
      {ann.kind === "rect" && (
        <div
          className="h-full w-full"
          style={{
            border: `${(ann as RectAnn).strokeWidth}px solid ${(ann as RectAnn).borderColor}`,
            background: (ann as RectAnn).fillColor ?? "transparent",
          }}
        />
      )}
      {ann.kind === "circle" && (
        <div
          className="h-full w-full rounded-full"
          style={{
            border: `${(ann as CircleAnn).strokeWidth}px solid ${(ann as CircleAnn).borderColor}`,
            background: (ann as CircleAnn).fillColor ?? "transparent",
          }}
        />
      )}

      {/* Resize handles */}
      {isSelected && (
        <>
          {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const).map((c) => {
            const pos: Record<typeof c, React.CSSProperties> = {
              nw: { left: -HANDLE_PX / 2, top: -HANDLE_PX / 2, cursor: "nwse-resize" },
              n: { left: "50%", top: -HANDLE_PX / 2, transform: "translateX(-50%)", cursor: "ns-resize" },
              ne: { right: -HANDLE_PX / 2, top: -HANDLE_PX / 2, cursor: "nesw-resize" },
              e: { right: -HANDLE_PX / 2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
              se: { right: -HANDLE_PX / 2, bottom: -HANDLE_PX / 2, cursor: "nwse-resize" },
              s: { left: "50%", bottom: -HANDLE_PX / 2, transform: "translateX(-50%)", cursor: "ns-resize" },
              sw: { left: -HANDLE_PX / 2, bottom: -HANDLE_PX / 2, cursor: "nesw-resize" },
              w: { left: -HANDLE_PX / 2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
            } as const;
            return (
              <span
                key={c}
                onPointerDown={startResize(c)}
                role="presentation"
                style={{
                  position: "absolute",
                  width: HANDLE_PX,
                  height: HANDLE_PX,
                  background: "white",
                  border: "1px solid #dc2626",
                  borderRadius: 2,
                  ...pos[c],
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function TextContent({ ann, onChange }: { ann: TextAnn; onChange: (patch: Partial<TextAnn>) => void }) {
  // Inline-edit on double-click — the textarea takes over while editing.
  const [editing, setEditing] = useState(false);
  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      style={{
        fontFamily: cssFont(ann.fontFamily),
        fontSize: ann.fontSize,
        fontWeight: ann.bold ? 700 : 400,
        fontStyle: ann.italic ? "italic" : "normal",
        textDecoration: ann.underline ? "underline" : "none",
        color: ann.color,
        lineHeight: 1.2,
        padding: "2px 4px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        whiteSpace: "pre-wrap",
      }}
    >
      {editing ? (
        <textarea
          autoFocus
          defaultValue={ann.text}
          onBlur={(e) => {
            onChange({ text: e.target.value });
            setEditing(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="block h-full w-full resize-none border-0 bg-transparent p-0 outline-none"
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            fontStyle: "inherit",
            textDecoration: "inherit",
            color: "inherit",
            lineHeight: "inherit",
          }}
        />
      ) : (
        ann.text || <span style={{ opacity: 0.4 }}>Double-click to edit</span>
      )}
    </div>
  );
}

function LineOverlay({ ann, pageDims, isSelected, isHandTool, onSelect, onChange }: OverlayProps) {
  const line = ann as LineAnn;
  // Treat the line as a 1px-thick draggable box from (x,y) to (x2,y2).
  const startDrag = (e: React.PointerEvent) => {
    if (!isHandTool && !isSelected) {
      onSelect();
      return;
    }
    onSelect();
    e.preventDefault();
    e.stopPropagation();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const sx = line.x;
    const sy = line.y;
    const sx2 = line.x2;
    const sy2 = line.y2;
    const parent = (e.target as Element).closest("[data-line-host]") as HTMLElement | null;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const scaleX = pageDims.w / parentRect.width;
    const scaleY = pageDims.h / parentRect.height;
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startMouseX) * scaleX;
      const dy = (ev.clientY - startMouseY) * scaleY;
      onChange({ x: sx + dx, y: sy + dy, x2: sx2 + dx, y2: sy2 + dy } as Partial<LineAnn>);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div data-line-host className="pointer-events-none absolute inset-0">
      <svg
        viewBox={`0 0 ${pageDims.w} ${pageDims.h}`}
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <line
          x1={line.x}
          y1={line.y}
          x2={line.x2}
          y2={line.y2}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          strokeLinecap="round"
          opacity={line.opacity}
          onPointerDown={(e) => startDrag(e as unknown as React.PointerEvent)}
          style={{ pointerEvents: "stroke", cursor: isHandTool ? "move" : "pointer" }}
        />
        {isSelected && (
          <>
            <LineHandle
              cx={line.x}
              cy={line.y}
              pageDims={pageDims}
              onChange={(nx, ny) => onChange({ x: nx, y: ny } as Partial<LineAnn>)}
            />
            <LineHandle
              cx={line.x2}
              cy={line.y2}
              pageDims={pageDims}
              onChange={(nx, ny) => onChange({ x2: nx, y2: ny } as Partial<LineAnn>)}
            />
          </>
        )}
      </svg>
    </div>
  );
}

function LineHandle({
  cx,
  cy,
  pageDims,
  onChange,
}: {
  cx: number;
  cy: number;
  pageDims: { w: number; h: number };
  onChange: (nx: number, ny: number) => void;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="white"
      stroke="#dc2626"
      strokeWidth={1}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const startMouseX = e.clientX;
        const startMouseY = e.clientY;
        const sx = cx;
        const sy = cy;
        const svg = (e.target as Element).closest("svg")!;
        const rect = svg.getBoundingClientRect();
        const scaleX = pageDims.w / rect.width;
        const scaleY = pageDims.h / rect.height;
        const onMove = (ev: PointerEvent) => {
          const nx = sx + (ev.clientX - startMouseX) * scaleX;
          const ny = sy + (ev.clientY - startMouseY) * scaleY;
          onChange(nx, ny);
        };
        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      }}
      style={{ pointerEvents: "all", cursor: "grab" }}
    />
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
