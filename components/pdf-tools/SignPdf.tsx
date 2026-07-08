"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Eraser, FileText, Loader2, Pen, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { PdfDropzone } from "@/components/pdf-tools/PdfDropzone";
import { downloadBlob, formatBytes, openPdfDocument, renderPageToCanvas } from "@/lib/pdfClient";
import { cn } from "@/lib/utils";

/**
 * Sign PDF — draw a signature on a canvas, place it on a chosen page, save.
 * Everything stays in the browser; pdf-lib embeds the PNG and pdfjs renders
 * the page so users can click where they want the signature to go.
 */
export function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDims, setPreviewDims] = useState<{ width: number; height: number } | null>(null);
  const [pagePoint, setPagePoint] = useState<{ x: number; y: number } | null>(null); // PDF coords (origin bottom-left)
  const [signaturePng, setSignaturePng] = useState<string | null>(null);
  const [sigWidth, setSigWidth] = useState(180);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the PDF and render the selected page when file or pageNumber changes.
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
        const canvas = await renderPageToCanvas(doc, page, { scale: 1.25 });
        if (cancelled) return;
        setPreviewUrl(canvas.toDataURL("image/png"));
        setPreviewDims({ width: canvas.width, height: canvas.height });
        setPagePoint(null);
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

  const onPreviewClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!previewDims) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Convert click on the displayed image to canvas pixel coords.
    const xPx = ((e.clientX - rect.left) / rect.width) * previewDims.width;
    const yPx = ((e.clientY - rect.top) / rect.height) * previewDims.height;
    // pdf-lib origin is bottom-left; the canvas rendered with scale 1.25 maps
    // 1.25 canvas px = 1 PDF point.
    const x = xPx / 1.25;
    const y = (previewDims.height - yPx) / 1.25;
    setPagePoint({ x, y });
  };

  const apply = async () => {
    if (!file || !signaturePng || !pagePoint) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const png = await doc.embedPng(signaturePng);
      const aspect = png.height / png.width;
      const w = sigWidth;
      const h = w * aspect;
      const target = doc.getPage(pageNumber - 1);
      // pagePoint is the click center; offset so the signature is centred on it.
      target.drawImage(png, {
        x: pagePoint.x - w / 2,
        y: pagePoint.y - h / 2,
        width: w,
        height: h,
      });
      const out = await doc.save();
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + "-signed.pdf");
    } catch (err) {
      console.error(err);
      setError("Couldn't add the signature.");
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
          <button type="button" onClick={() => { setFile(null); setSignaturePng(null); setPagePoint(null); }} aria-label="Remove" className="rounded-lg p-1 text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* PDF preview — click to set signature position */}
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
              {pagePoint && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                  Placed at ({Math.round(pagePoint.x)}, {Math.round(pagePoint.y)})
                </span>
              )}
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface-100 p-3 dark:border-surface-800 dark:bg-surface-800/40">
              {previewUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={`Page ${pageNumber}`}
                    onClick={onPreviewClick}
                    className="mx-auto block max-w-full cursor-crosshair rounded-md shadow-sm"
                  />
                  {pagePoint && previewDims && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/30"
                      style={{
                        left: `${((pagePoint.x * 1.25) / previewDims.width) * 100}%`,
                        top: `${(1 - (pagePoint.y * 1.25) / previewDims.height) * 100}%`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <p className="flex items-center justify-center gap-2 py-10 text-sm text-surface-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading page…
                </p>
              )}
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Click anywhere on the page to place your signature.
            </p>
          </div>

          {/* Signature pad + controls */}
          <div className="space-y-4">
            <SignaturePad value={signaturePng} onChange={setSignaturePng} />

            <label className="block">
              <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
                Signature width <span className="font-normal text-surface-500">({sigWidth}pt)</span>
              </span>
              <input
                type="range"
                min={60}
                max={360}
                step={10}
                value={sigWidth}
                onChange={(e) => setSigWidth(Number(e.target.value))}
                className="mt-2 w-full accent-red-500"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>
            )}

            <button
              type="button"
              onClick={apply}
              disabled={busy || !signaturePng || !pagePoint}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition",
                busy || !signaturePng || !pagePoint ? "cursor-not-allowed opacity-50" : "hover:bg-red-700"
              )}
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Signing…</> : <><Pen className="h-4 w-4" />Sign &amp; download</>}
            </button>
            {(!signaturePng || !pagePoint) && (
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {!signaturePng && "Draw a signature above. "}
                {!pagePoint && "Click on the page to place it."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================== SignaturePad

interface PadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

function SignaturePad({ onChange }: PadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const hasInk = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Hi-DPI rendering for a crisp signature.
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#111";
  }, []);

  const pos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = pos(e);
  };
  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastRef.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    hasInk.current = true;
  };
  const end = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (hasInk.current && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange(null);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">Your signature</span>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-surface-600 transition hover:bg-surface-100 hover:text-red-600 dark:text-surface-300 dark:hover:bg-surface-800"
        >
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
      <div className="rounded-xl border border-dashed border-surface-300 bg-white dark:border-surface-700 dark:bg-surface-900">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="h-40 w-full touch-none rounded-xl"
          style={{ display: "block" }}
        />
      </div>
      <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">Draw with mouse or finger. No upload — signature stays here.</p>
    </div>
  );
}
