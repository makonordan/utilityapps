"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

import {
  IMAGE_TOOLS_CONFIG,
  MEME_TEMPLATES,
  type MemeTemplate,
} from "@/lib/imageTools";
import { downloadFile } from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "meme-generator";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

interface TextStyle {
  font: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  uppercase: boolean;
  /** Auto = font size derives from canvas width. */
  size: "auto" | "small" | "medium" | "large" | "xl";
}

interface CustomOverlay {
  id: string;
  text: string;
  xPct: number; // 0..100 — center x as percentage of canvas
  yPct: number; // 0..100 — center y as percentage of canvas
  style: TextStyle;
}

const DEFAULT_STYLE: TextStyle = {
  font: "Impact",
  color: "#FFFFFF",
  strokeColor: "#000000",
  strokeWidth: 4,
  uppercase: true,
  size: "auto",
};

const FONTS = ["Impact", "Arial Black", "Comic Sans MS"];

const SIZE_MULT: Record<TextStyle["size"], number> = {
  auto: 1 / 11,
  small: 1 / 18,
  medium: 1 / 12,
  large: 1 / 9,
  xl: 1 / 7,
};

let __pid = 0;
const nextId = () => `ov-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Gradient parsing — maps `gradient:from-X,to-Y` placeholders to hex pairs
// ──────────────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  "primary-500": "#0066FF",
  "accent-500": "#8B5CF6",
  "warning-500": "#F59E0B",
  "success-500": "#10B981",
  "surface-700": "#374151",
  "surface-800": "#1F2937",
};

function parseGradient(url: string): [string, string] | null {
  const m = /^gradient:from-([^,]+),to-(.+)$/.exec(url);
  if (!m) return null;
  return [COLOR_MAP[m[1]] ?? "#0066FF", COLOR_MAP[m[2]] ?? "#8B5CF6"];
}

function gradientCss(url: string): string | null {
  const pair = parseGradient(url);
  if (!pair) return null;
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}

// ──────────────────────────────────────────────────────────────────────────
// Canvas helpers
// ──────────────────────────────────────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawStyledText(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: TextStyle,
  cx: number,
  cy: number,
  canvasW: number,
  maxWidth: number
) {
  if (!text.trim()) return;
  const fontSize = Math.max(14, Math.round(canvasW * SIZE_MULT[style.size]));
  ctx.font = `900 ${fontSize}px ${style.font}, "Arial Black", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  const lines = wrapLines(ctx, style.uppercase ? text.toUpperCase() : text, maxWidth);
  const lineHeight = Math.round(fontSize * 1.05);
  const totalH = lines.length * lineHeight;
  // Anchor: cy is the centre of the block.
  const startY = cy - totalH / 2 + lineHeight / 2;

  // Stroke first (outline), then fill on top.
  ctx.strokeStyle = style.strokeColor;
  ctx.lineWidth = style.strokeWidth;
  ctx.fillStyle = style.color;
  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    if (style.strokeWidth > 0) ctx.strokeText(line, cx, y);
    ctx.fillText(line, cx, y);
  });
}

function drawGradientBg(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  from: string,
  to: string
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, from);
  grad.addColorStop(1, to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [style, setStyle] = useState<TextStyle>(DEFAULT_STYLE);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [overlays, setOverlays] = useState<CustomOverlay[]>([]);

  const [shareSupported, setShareSupported] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayLayerRef = useRef<HTMLDivElement>(null);
  const backgroundImgRef = useRef<HTMLImageElement | null>(null);
  const drawSeqRef = useRef(0);
  const dragRef = useRef<{
    id: string;
    pointerOffsetX: number;
    pointerOffsetY: number;
  } | null>(null);

  // ───── Feature detection: Web Share with files ─────
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setShareSupported(typeof navigator.share === "function");
  }, []);

  // ───── Cleanup uploaded URL on unmount or replacement ─────
  useEffect(() => {
    return () => {
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── Pick template ─────
  const pickTemplate = useCallback(
    async (template: MemeTemplate) => {
      setSelectedTemplate(template);
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
      setUploadedFile(null);
      setUploadedUrl(null);
      backgroundImgRef.current = null;
      setTopText(template.topTextDefault);
      setBottomText(template.bottomTextDefault);
    },
    [uploadedUrl]
  );

  // ───── Upload own image ─────
  const pickFile = useCallback(
    async (f: File) => {
      if (!f.type.startsWith("image/")) return;
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
      const url = URL.createObjectURL(f);
      setUploadedFile(f);
      setUploadedUrl(url);
      setSelectedTemplate(null);
      try {
        const img = await loadImg(url);
        backgroundImgRef.current = img;
      } catch {
        backgroundImgRef.current = null;
      }
    },
    [uploadedUrl]
  );

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void pickFile(f);
    e.target.value = "";
  };

  // ───── Compute canvas size ─────
  const canvasSize = useMemo(() => {
    const img = backgroundImgRef.current;
    if (img && img.naturalWidth && img.naturalHeight) {
      const scale = Math.min(1, 1200 / img.naturalWidth);
      return {
        w: Math.round(img.naturalWidth * scale),
        h: Math.round(img.naturalHeight * scale),
      };
    }
    return { w: 720, h: 720 };
  }, // backgroundImgRef.current is a ref - changes don't trigger this, but
  // we manually call requestDraw after setting it. Tracked via uploadedUrl/selectedTemplate.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [uploadedUrl, selectedTemplate]);

  // ───── Draw ─────
  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const seq = ++drawSeqRef.current;
    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (backgroundImgRef.current) {
      ctx.drawImage(backgroundImgRef.current, 0, 0, canvas.width, canvas.height);
    } else if (selectedTemplate) {
      const pair = parseGradient(selectedTemplate.imageUrl);
      if (pair) drawGradientBg(ctx, canvas.width, canvas.height, pair[0], pair[1]);
    } else {
      // Checker placeholder
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (drawSeqRef.current !== seq) return; // a newer draw is queued

    const maxWidth = canvas.width * 0.92;
    const padding = Math.round(canvas.height * 0.04);

    // Top text
    drawStyledText(
      ctx,
      topText,
      style,
      canvas.width / 2,
      padding + (canvas.height * 0.04),
      canvas.width,
      maxWidth
    );
    // Bottom text
    drawStyledText(
      ctx,
      bottomText,
      style,
      canvas.width / 2,
      canvas.height - padding - (canvas.height * 0.04),
      canvas.width,
      maxWidth
    );
    // Custom overlays
    for (const ov of overlays) {
      drawStyledText(
        ctx,
        ov.text,
        ov.style,
        (ov.xPct / 100) * canvas.width,
        (ov.yPct / 100) * canvas.height,
        canvas.width,
        maxWidth
      );
    }
  }, [bottomText, canvasSize.h, canvasSize.w, overlays, selectedTemplate, style, topText]);

  // Redraw whenever inputs change. We also call draw() once after setting
  // backgroundImgRef inside pickFile via a microtask below.
  useEffect(() => {
    void draw();
  }, [draw]);

  // After picking a user image, we need to draw once the ref is hooked up.
  // pickFile loads asynchronously, so we trigger a redraw when uploadedUrl flips.
  useEffect(() => {
    if (!uploadedUrl) return;
    let cancelled = false;
    (async () => {
      // Wait a microtask so backgroundImgRef.current is up to date.
      await Promise.resolve();
      if (!cancelled) void draw();
    })();
    return () => {
      cancelled = true;
    };
  }, [uploadedUrl, draw]);

  // ───── Overlay drag (advanced mode) ─────
  const onOverlayPointerDown = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const layer = overlayLayerRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const target = e.currentTarget as HTMLDivElement;
    const handleRect = target.getBoundingClientRect();
    dragRef.current = {
      id,
      pointerOffsetX: e.clientX - (handleRect.left + handleRect.width / 2),
      pointerOffsetY: e.clientY - (handleRect.top + handleRect.height / 2),
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    // Move handler binds to window so we can drag outside the handle.
    const move = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const x = ev.clientX - drag.pointerOffsetX - rect.left;
      const y = ev.clientY - drag.pointerOffsetY - rect.top;
      const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setOverlays((prev) =>
        prev.map((o) => (o.id === drag.id ? { ...o, xPct, yPct } : o))
      );
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const addOverlay = () =>
    setOverlays((prev) => [
      ...prev,
      {
        id: nextId(),
        text: "New text",
        xPct: 50,
        yPct: 50,
        style: { ...DEFAULT_STYLE, size: "medium" },
      },
    ]);
  const removeOverlay = (id: string) =>
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  const updateOverlay = (id: string, partial: Partial<CustomOverlay>) =>
    setOverlays((prev) => prev.map((o) => (o.id === id ? { ...o, ...partial } : o)));

  // ───── Download ─────
  const memeBlob = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png")
    );
  }, []);

  const downloadMeme = useCallback(async () => {
    const blob = await memeBlob();
    if (!blob) return;
    downloadFile(blob, "meme.png");
  }, [memeBlob]);

  // ───── Share ─────
  const shareMeme = useCallback(async () => {
    const blob = await memeBlob();
    if (!blob) return;
    if (typeof navigator.share === "function") {
      try {
        const file = new File([blob], "meme.png", { type: "image/png" });
        // canShare with files is the safe check.
        const data: ShareData = { files: [file], title: "Meme", text: "Made with UtilityApps" };
        if (
          "canShare" in navigator &&
          typeof navigator.canShare === "function" &&
          !navigator.canShare(data)
        ) {
          // File share not supported — fall through to text-only.
          await navigator.share({ title: "Meme", text: "Made with UtilityApps" });
        } else {
          await navigator.share(data);
        }
      } catch {
        /* user cancelled or share not available */
      }
    } else {
      // Fallback: copy a friendly text + download.
      try {
        await navigator.clipboard.writeText(
          "I made a meme with UtilityApps — try it at utilityapps.site/tools/meme-generator"
        );
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 1500);
      } catch {
        /* clipboard not available */
      }
      await downloadMeme();
    }
  }, [downloadMeme, memeBlob]);

  // Share-to links (text-only, no image upload required)
  const tweetUrl = useMemo(
    () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "I made a meme with UtilityApps 🎨"
      )}&url=${encodeURIComponent("https://utilityapps.site/tools/meme-generator")}`,
    []
  );
  const whatsappUrl = useMemo(
    () =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        "I made a meme with UtilityApps 🎨 https://utilityapps.site/tools/meme-generator"
      )}`,
    []
  );

  const hasBackground = !!selectedTemplate || !!uploadedUrl;

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {!hasBackground ? (
        <TemplateGallery onPick={pickTemplate} onUpload={pickFile} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {/* Header strip */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-surface-600 dark:text-surface-300">
                {selectedTemplate ? `Template: ${selectedTemplate.name}` : `Custom upload: ${uploadedFile?.name ?? "image"}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
                  backgroundImgRef.current = null;
                  setSelectedTemplate(null);
                  setUploadedFile(null);
                  setUploadedUrl(null);
                  setTopText("");
                  setBottomText("");
                  setOverlays([]);
                }}
                className="text-xs font-medium text-surface-500 hover:text-primary-700 dark:text-surface-400 dark:hover:text-primary-300"
              >
                Pick another
              </button>
            </div>

            {/* Canvas + drag overlay layer */}
            <div className="overflow-hidden rounded-2xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-800">
              <div className="relative mx-auto inline-block max-w-full">
                <canvas ref={canvasRef} className="block max-w-full" />
                {advancedOpen && (
                  <div ref={overlayLayerRef} className="absolute inset-0">
                    {overlays.map((o) => (
                      <div
                        key={o.id}
                        onPointerDown={onOverlayPointerDown(o.id)}
                        style={{
                          left: `${o.xPct}%`,
                          top: `${o.yPct}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className="absolute h-8 w-8 cursor-move rounded-full border-2 border-white bg-primary-500/70 shadow ring-1 ring-black/30"
                        title={o.text}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top / bottom inputs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <LabeledTextarea
                label="Top text"
                value={topText}
                onChange={setTopText}
                placeholder="WHEN THE BUILD"
              />
              <LabeledTextarea
                label="Bottom text"
                value={bottomText}
                onChange={setBottomText}
                placeholder="FINALLY PASSES"
              />
            </div>

            {/* Advanced overlays */}
            <div className="space-y-2 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={advancedOpen}
                    onChange={(e) => setAdvancedOpen(e.target.checked)}
                    className="h-4 w-4 accent-primary-600"
                  />
                  Advanced mode (extra text overlays)
                </label>
                {advancedOpen && (
                  <button
                    type="button"
                    onClick={addOverlay}
                    className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-2.5 py-1 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200"
                  >
                    <Plus className="h-3 w-3" /> Add text
                  </button>
                )}
              </div>

              {advancedOpen && overlays.length === 0 && (
                <p className="text-[11px] text-surface-500 dark:text-surface-400">
                  Click <strong>Add text</strong>, then drag the blue handle to reposition.
                </p>
              )}

              {advancedOpen && overlays.length > 0 && (
                <ul className="space-y-2">
                  {overlays.map((o, i) => (
                    <li
                      key={o.id}
                      className="grid gap-2 rounded-lg border border-surface-200 p-2 dark:border-surface-700 sm:grid-cols-[1fr_auto]"
                    >
                      <input
                        type="text"
                        value={o.text}
                        onChange={(e) => updateOverlay(o.id, { text: e.target.value })}
                        placeholder={`Text block ${i + 1}`}
                        className="rounded-md border border-surface-200 bg-white px-2 py-1 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={o.style.size}
                          onChange={(e) =>
                            updateOverlay(o.id, {
                              style: {
                                ...o.style,
                                size: e.target.value as TextStyle["size"],
                              },
                            })
                          }
                          className="rounded-md border border-surface-200 bg-white px-1.5 py-0.5 text-[11px] text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="xl">XL</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeOverlay(o.id)}
                          title="Remove"
                          className="text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Download + share */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={downloadMeme}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                <Download className="h-4 w-4" /> Download meme (PNG)
              </button>
              <button
                type="button"
                onClick={shareMeme}
                className="inline-flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500"
              >
                {shareCopied ? (
                  <>
                    <Check className="h-4 w-4 text-success-600" /> Link copied
                  </>
                ) : shareSupported ? (
                  <>
                    <Share2 className="h-4 w-4" /> Share…
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy link
                  </>
                )}
              </button>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500"
              >
                Share to X
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              Tip: share-to-X and WhatsApp links open a text-only share — use the
              Share button (or download then attach) to include the actual image.
            </p>
          </div>

          {/* Style panel */}
          <StylePanel style={style} setStyle={setStyle} />
        </div>
      )}

      {/* Hidden file input for upload */}
      <input
        id="meme-upload"
        type="file"
        accept={CONFIG.acceptedFormats.join(",")}
        onChange={onFileInputChange}
        className="sr-only"
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Template gallery
// ──────────────────────────────────────────────────────────────────────────

function TemplateGallery({
  onPick,
  onUpload,
}: {
  onPick: (t: MemeTemplate) => void;
  onUpload: (f: File) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white">
        Choose a template
      </h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {MEME_TEMPLATES.map((t) => {
          const grad = gradientCss(t.imageUrl);
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onPick(t)}
                className="group flex w-full flex-col gap-1 overflow-hidden rounded-xl border border-surface-200 bg-white text-left transition hover:border-primary-300 hover:shadow-sm dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-500"
              >
                <span
                  aria-hidden="true"
                  className="flex aspect-square w-full items-center justify-center"
                  style={grad ? { background: grad } : { background: "#e5e7eb" }}
                >
                  <Sparkles className="h-6 w-6 text-white/80" />
                </span>
                <span className="px-2 py-1.5 text-xs font-semibold text-surface-900 dark:text-white">
                  {t.name}
                </span>
              </button>
            </li>
          );
        })}

        {/* Upload your own */}
        <li>
          <label
            htmlFor="meme-upload"
            className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-300 bg-white p-4 text-center transition hover:border-primary-400 hover:bg-primary-50/40 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-primary-500 dark:hover:bg-primary-500/5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
              <Upload className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-surface-900 dark:text-white">
              Upload my own image
            </span>
            <span className="text-[11px] text-surface-500 dark:text-surface-400">
              JPG, PNG, GIF or WEBP
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>
        </li>
      </ul>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Style panel
// ──────────────────────────────────────────────────────────────────────────

function StylePanel({
  style,
  setStyle,
}: {
  style: TextStyle;
  setStyle: (s: TextStyle) => void;
}) {
  const set = <K extends keyof TextStyle>(key: K, value: TextStyle[K]) =>
    setStyle({ ...style, [key]: value });

  return (
    <aside className="h-fit space-y-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          Text style
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Classic meme defaults: bold Impact, white fill, black outline.
        </p>
      </header>

      <label className="block space-y-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Font
        </span>
        <select
          value={style.font}
          onChange={(e) => set("font", e.target.value)}
          className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Size
        </span>
        <select
          value={style.size}
          onChange={(e) => set("size", e.target.value as TextStyle["size"])}
          className="w-full rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        >
          <option value="auto">Auto (image-aware)</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xl">XL</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Text colour
          </span>
          <ColorRow value={style.color} onChange={(c) => set("color", c)} />
        </label>
        <label className="block space-y-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Outline colour
          </span>
          <ColorRow value={style.strokeColor} onChange={(c) => set("strokeColor", c)} />
        </label>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Outline width
          </span>
          <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
            {style.strokeWidth}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={12}
          value={style.strokeWidth}
          onChange={(e) => set("strokeWidth", Number(e.target.value))}
          className="w-full accent-primary-600"
        />
      </div>

      <label className="inline-flex items-center gap-2 text-xs text-surface-700 dark:text-surface-200">
        <input
          type="checkbox"
          checked={style.uppercase}
          onChange={(e) => set("uppercase", e.target.checked)}
          className="h-4 w-4 accent-primary-600"
        />
        Force UPPERCASE (classic meme style)
      </label>
    </aside>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-y rounded-md border border-surface-200 bg-white px-3 py-2 text-sm font-semibold text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
      />
    </label>
  );
}

function ColorRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs uppercase tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
      />
    </div>
  );
}
