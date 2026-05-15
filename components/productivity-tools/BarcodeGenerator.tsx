"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download } from "lucide-react";

import { cn } from "@/lib/utils";

type Format =
  | "CODE128"
  | "CODE39"
  | "EAN13"
  | "EAN8"
  | "UPC"
  | "UPCE"
  | "ITF14"
  | "ITF"
  | "MSI"
  | "pharmacode";

type Output = "png" | "svg";

const FORMATS: { id: Format; label: string; sample: string; hint: string }[] = [
  { id: "CODE128", label: "Code 128", sample: "ABC-12345", hint: "General-purpose, accepts any printable ASCII." },
  { id: "EAN13", label: "EAN-13", sample: "5901234123457", hint: "13 digits — retail product codes." },
  { id: "EAN8", label: "EAN-8", sample: "96385074", hint: "8 digits — small retail packs." },
  { id: "UPC", label: "UPC-A", sample: "036000291452", hint: "12 digits — North American retail." },
  { id: "UPCE", label: "UPC-E", sample: "01234565", hint: "Compressed UPC for small packaging." },
  { id: "CODE39", label: "Code 39", sample: "BARCODE39", hint: "Letters + digits, used in logistics and ID badges." },
  { id: "ITF14", label: "ITF-14", sample: "10012345678902", hint: "14 digits — outer shipping cartons." },
  { id: "ITF", label: "ITF", sample: "1234567890", hint: "Even count of digits, interleaved 2-of-5." },
  { id: "MSI", label: "MSI", sample: "1234567", hint: "Digits only, used on warehouse shelves." },
  { id: "pharmacode", label: "Pharmacode", sample: "1234", hint: "3–131070 numeric range, pharmaceutical packaging." },
];

export function BarcodeGenerator() {
  const [format, setFormat] = useState<Format>("CODE128");
  const [value, setValue] = useState("ABC-12345");
  const [displayText, setDisplayText] = useState(true);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [output, setOutput] = useState<Output>("png");
  const [error, setError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Re-render the barcode whenever any input changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: JsBarcode } = await import("jsbarcode");
        if (cancelled || !svgRef.current) return;
        // Clear any previous render so failed attempts don't leave stale art.
        svgRef.current.innerHTML = "";
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue: displayText,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          fontSize: 16,
          font: "monospace",
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not generate barcode for that input.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [format, value, displayText, width, height]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    triggerDownload(blob, `barcode-${format.toLowerCase()}.svg`);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const xml = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // 2x for retina-friendly output.
      canvas.width = svgEl.viewBox.baseVal.width * 2 || svgEl.clientWidth * 2 || 600;
      canvas.height = svgEl.viewBox.baseVal.height * 2 || svgEl.clientHeight * 2 || 200;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(svgUrl);
        if (blob) triggerDownload(blob, `barcode-${format.toLowerCase()}.png`);
      }, "image/png");
    };
    img.onerror = () => URL.revokeObjectURL(svgUrl);
    img.src = svgUrl;
  };

  const handleDownload = () => {
    if (error) return;
    if (output === "svg") downloadSvg();
    else downloadPng();
  };

  const activeFormat = FORMATS.find((f) => f.id === format)!;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Format
        </p>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFormat(f.id);
                setValue(f.sample);
              }}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition",
                format === f.id
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">{activeFormat.hint}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Data to encode
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
              Bar width (px)
            </span>
            <input
              type="number"
              min={1}
              max={6}
              step={1}
              value={width}
              onChange={(e) => setWidth(Math.max(1, Math.min(6, Number(e.target.value))))}
              className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
              Bar height (px)
            </span>
            <input
              type="number"
              min={20}
              max={200}
              step={5}
              value={height}
              onChange={(e) => setHeight(Math.max(20, Math.min(200, Number(e.target.value))))}
              className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={displayText}
              onChange={(e) => setDisplayText(e.target.checked)}
              className="h-4 w-4 rounded border-surface-400 accent-primary-600"
            />
            Show value below bars
          </label>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Preview
        </p>
        <div className="flex items-center justify-center rounded-xl bg-white p-4">
          <svg ref={svgRef} className="max-w-full" />
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/60 dark:bg-error-500/10 dark:text-error-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex self-center rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900 sm:self-start">
            {(["png", "svg"] as Output[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOutput(opt)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                  output === opt
                    ? "bg-primary-600 text-white"
                    : "text-surface-700 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-300"
                )}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!!error}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100 sm:w-auto"
          >
            <Download className="h-6 w-6" />
            Download {output.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
