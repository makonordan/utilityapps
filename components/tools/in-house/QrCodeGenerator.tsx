"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { CopyButton, Field, INPUT_CLASS, ToolShell } from "./ToolShell";

const SIZES = [200, 400, 600, 800];
const ECC = [
  { id: "L", label: "Low (~7%)" },
  { id: "M", label: "Medium (~15%)" },
  { id: "Q", label: "Quartile (~25%)" },
  { id: "H", label: "High (~30%)" },
];

function buildUrl(text: string, size: number, ecc: string, fg: string, bg: string): string {
  const hex = (c: string) => c.replace("#", "");
  const params = new URLSearchParams({
    data: text,
    size: `${size}x${size}`,
    ecc,
    color: hex(fg),
    bgcolor: hex(bg),
    qzone: "2",
    format: "png",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export function QrCodeGenerator() {
  const [text, setText] = useState("https://utilityapps.site");
  const [size, setSize] = useState(400);
  const [ecc, setEcc] = useState("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const url = text.trim() ? buildUrl(text.trim(), size, ecc, fg, bg) : "";

  return (
    <ToolShell
      eyebrow="Productivity"
      title="QR Code Generator"
      description="Generate a QR code for any URL, text, WiFi config, or vCard. Download as PNG."
      onReset={() => {
        setText("https://utilityapps.site");
        setSize(400);
        setEcc("M");
        setFg("#000000");
        setBg("#ffffff");
      }}
    >
      <Field label="Content (URL, text, WiFi, vCard…)">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={INPUT_CLASS}
          placeholder="https://utilityapps.site"
        />
      </Field>

      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <Field label="Size">
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={INPUT_CLASS}>
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}×{s} px</option>
            ))}
          </select>
        </Field>
        <Field label="Error correction">
          <select value={ecc} onChange={(e) => setEcc(e.target.value)} className={INPUT_CLASS}>
            {ECC.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Foreground">
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full cursor-pointer rounded-xl border border-surface-200 bg-white p-1 dark:border-surface-700 dark:bg-surface-800" />
        </Field>
        <Field label="Background">
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full cursor-pointer rounded-xl border border-surface-200 bg-white p-1 dark:border-surface-700 dark:bg-surface-800" />
        </Field>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800/40">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Generated QR code"
              width={size}
              height={size}
              className="block max-w-[300px]"
            />
          ) : (
            <div className="flex h-[300px] w-[300px] items-center justify-center text-sm text-surface-400">
              Enter content to generate
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Actions
          </p>
          <a
            href={url}
            download="qr-code.png"
            className={
              url
                ? "inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                : "pointer-events-none inline-flex items-center gap-2 rounded-xl bg-surface-300 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
            }
          >
            <Download className="h-4 w-4" />
            Download PNG
          </a>
          <div>
            <p className="mb-1 text-[11px] text-surface-500 dark:text-surface-400">Direct image URL</p>
            <div className="flex items-start gap-2">
              <code className="flex-1 truncate rounded-lg bg-surface-100 px-2 py-1.5 text-xs text-surface-700 dark:bg-surface-800 dark:text-surface-300">{url || "—"}</code>
              <CopyButton value={url} />
            </div>
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            Tip: higher error-correction levels can survive 30% damage but make denser codes — pick High when adding a logo overlay.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
