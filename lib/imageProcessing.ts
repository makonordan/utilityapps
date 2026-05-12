/**
 * Browser-side image processing utilities shared by every Image Tool
 * (compress, resize, crop, convert, watermark, meme-generator, …).
 *
 * The whole module is pure browser code — `window`, `document`, `Image`,
 * `URL.createObjectURL`. Don't import from a Server Component.
 */

import JSZip from "jszip";
import { saveAs } from "file-saver";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

/** Format string accepted by HTMLCanvasElement.toBlob. */
export type ImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export interface LoadedImage {
  img: HTMLImageElement;
  /** Always call this once you're done with `img` so the object URL is freed. */
  cleanup: () => void;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface AspectRatio {
  /** Pretty form, e.g. `"16:9"`, `"4:3"`, `"1:1"`. */
  ratio: string;
  /** Width / height as a decimal, e.g. `1.7777…`. */
  decimal: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// 1. loadImageFromFile
// ──────────────────────────────────────────────────────────────────────────

/**
 * Decode a File into an HTMLImageElement via an object URL.
 *
 * Returns the image AND a cleanup callback — the caller must invoke
 * `cleanup()` once the image is no longer needed (usually after drawing
 * to canvas) so the blob URL is revoked.
 */
export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const cleanup = () => URL.revokeObjectURL(url);

    img.onload = () => resolve({ img, cleanup });
    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to decode image: ${file.name}`));
    };
    img.src = url;
  });
}

// ──────────────────────────────────────────────────────────────────────────
// 2. imageToCanvas
// ──────────────────────────────────────────────────────────────────────────

/**
 * Draw `img` to a fresh canvas, optionally resizing.
 *
 *  - both dims given → exact size, no aspect preservation
 *  - one dim given   → preserve aspect ratio against the other
 *  - neither given   → natural size
 */
export function imageToCanvas(
  img: HTMLImageElement,
  width?: number,
  height?: number
): HTMLCanvasElement {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  let targetW = naturalW;
  let targetH = naturalH;

  if (width != null && height != null) {
    targetW = width;
    targetH = height;
  } else if (width != null) {
    targetW = width;
    targetH = Math.round((width / naturalW) * naturalH);
  } else if (height != null) {
    targetH = height;
    targetW = Math.round((height / naturalH) * naturalW);
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, targetW);
  canvas.height = Math.max(1, targetH);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

// ──────────────────────────────────────────────────────────────────────────
// 3. canvasToBlob
// ──────────────────────────────────────────────────────────────────────────

/**
 * Encode a canvas as a Blob.
 *
 * `quality` is honoured by the JPEG and WebP encoders (range 0..1) and
 * ignored by PNG/GIF.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageMimeType,
  quality: number = 0.92
): Promise<Blob> {
  const q = Math.min(1, Math.max(0, quality));
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Canvas encoding failed for ${format}`));
          return;
        }
        resolve(blob);
      },
      format,
      q
    );
  });
}

// ──────────────────────────────────────────────────────────────────────────
// 4. downloadFile
// ──────────────────────────────────────────────────────────────────────────

/** Trigger a single-file download via file-saver. */
export function downloadFile(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

// ──────────────────────────────────────────────────────────────────────────
// 5. downloadZip
// ──────────────────────────────────────────────────────────────────────────

/**
 * Bundle multiple blobs into a single ZIP and trigger a download.
 *
 * Duplicate filenames within `files` are auto-suffixed with `-1`, `-2`, …
 * so the ZIP doesn't collapse same-named entries.
 */
export async function downloadZip(
  files: { blob: Blob; name: string }[],
  zipName: string = "images.zip"
): Promise<void> {
  const zip = new JSZip();
  const seen = new Map<string, number>();

  for (const { blob, name } of files) {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);

    let entryName = name;
    if (count > 0) {
      const dot = name.lastIndexOf(".");
      entryName =
        dot > 0
          ? `${name.slice(0, dot)}-${count}${name.slice(dot)}`
          : `${name}-${count}`;
    }
    zip.file(entryName, blob);
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  saveAs(zipBlob, zipName);
}

// ──────────────────────────────────────────────────────────────────────────
// 6. formatFileSize
// ──────────────────────────────────────────────────────────────────────────

/** "2.4 MB", "340 KB", "812 B". Uses base 1024. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  // 1 decimal under 10, otherwise round to whole number for compactness.
  const formatted = value < 10 ? value.toFixed(1) : Math.round(value).toString();
  return `${formatted} ${units[unitIndex]}`;
}

// ──────────────────────────────────────────────────────────────────────────
// 7. getImageDimensions
// ──────────────────────────────────────────────────────────────────────────

/** Read an image's natural width × height without keeping it in memory. */
export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  const { img, cleanup } = await loadImageFromFile(file);
  try {
    return {
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
    };
  } finally {
    cleanup();
  }
}

// ──────────────────────────────────────────────────────────────────────────
// 8. calculateAspectRatio
// ──────────────────────────────────────────────────────────────────────────

const COMMON_RATIOS: Array<{ name: string; decimal: number }> = [
  { name: "1:1", decimal: 1 },
  { name: "5:4", decimal: 5 / 4 },
  { name: "4:3", decimal: 4 / 3 },
  { name: "3:2", decimal: 3 / 2 },
  { name: "16:10", decimal: 16 / 10 },
  { name: "16:9", decimal: 16 / 9 },
  { name: "21:9", decimal: 21 / 9 },
  { name: "9:16", decimal: 9 / 16 },
  { name: "2:3", decimal: 2 / 3 },
  { name: "3:4", decimal: 3 / 4 },
  { name: "4:5", decimal: 4 / 5 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Express a width × height as a friendly aspect ratio.
 *
 * Snaps to a common ratio when within ~1% (so 1920×1081 still reports as
 * 16:9 instead of e.g. 1920:1081). Otherwise reduces by GCD; if either
 * side is still > 99 after reduction, returns the rounded decimal as a
 * `"x:1"` style string to avoid 1366:768-style noise.
 */
export function calculateAspectRatio(
  width: number,
  height: number
): AspectRatio {
  if (!width || !height) return { ratio: "0:0", decimal: 0 };

  const decimal = width / height;

  for (const candidate of COMMON_RATIOS) {
    if (Math.abs(decimal - candidate.decimal) / candidate.decimal < 0.01) {
      return { ratio: candidate.name, decimal };
    }
  }

  const divisor = gcd(width, height);
  const a = width / divisor;
  const b = height / divisor;

  if (a > 99 || b > 99) {
    return { ratio: `${decimal.toFixed(2)}:1`, decimal };
  }
  return { ratio: `${a}:${b}`, decimal };
}

// ──────────────────────────────────────────────────────────────────────────
// 9. validateImageFile
// ──────────────────────────────────────────────────────────────────────────

/**
 * Check size & format up front so we can show inline errors before any
 * processing kicks off.
 *
 * `acceptedFormats` accepts either MIME types (`image/jpeg`) or
 * file extensions with a leading dot (`.heic`) — same convention as
 * IMAGE_TOOLS_CONFIG.
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number,
  acceptedFormats: string[]
): ValidationResult {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File exceeds ${maxSizeMB} MB limit (got ${formatFileSize(file.size)})`,
    };
  }

  const lowerName = file.name.toLowerCase();
  const lowerType = file.type.toLowerCase();

  const matched = acceptedFormats.some((fmt) => {
    const f = fmt.toLowerCase();
    if (f.startsWith(".")) return lowerName.endsWith(f);
    if (f === "url") return false; // URL inputs are handled outside the file picker
    return lowerType === f;
  });

  if (!matched) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type || lowerName.split(".").pop() || "unknown"}`,
    };
  }
  return { valid: true };
}

// ──────────────────────────────────────────────────────────────────────────
// Universal decoder — handles HEIC and TIFF in addition to native formats
// ──────────────────────────────────────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image decode failed"));
    img.src = src;
  });
}

/**
 * Decode any supported file (PNG, GIF, WEBP, SVG, BMP, JPG, TIFF, HEIC) into
 * a canvas. HEIC and TIFF decoders are dynamically imported so they only
 * land in the bundle when a user actually drops one of those formats.
 */
export async function loadAnyImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  // ── HEIC / HEIF ──
  if (
    type.includes("heic") ||
    type.includes("heif") ||
    /\.(heic|heif)$/.test(name)
  ) {
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.95,
    });
    const blob = Array.isArray(out) ? out[0] : out;
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadImg(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // ── TIFF ──
  if (type.includes("tiff") || type.includes("tif") || /\.tiff?$/.test(name)) {
    const UTIF = await import("utif");
    const buf = await file.arrayBuffer();
    const ifds = UTIF.decode(buf);
    if (ifds.length === 0) throw new Error("TIFF file has no images");
    UTIF.decodeImage(buf, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);
    const canvas = document.createElement("canvas");
    canvas.width = ifds[0].width;
    canvas.height = ifds[0].height;
    const ctx = canvas.getContext("2d")!;
    const id = ctx.createImageData(canvas.width, canvas.height);
    id.data.set(rgba);
    ctx.putImageData(id, 0, 0);
    return canvas;
  }

  // ── Anything browsers can decode natively ──
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ──────────────────────────────────────────────────────────────────────────
// 10. blobToDataURL
// ──────────────────────────────────────────────────────────────────────────

/** Read a blob into a `data:` URL (useful for inlining into `<img src>`). */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("FileReader returned non-string result"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}
