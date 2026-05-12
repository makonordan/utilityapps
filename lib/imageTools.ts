// Per-tool configuration, supported formats, meme templates, and shared
// TypeScript interfaces for the Image Tools section.
//
// Tool slugs MUST match the `id` values added in lib/tools.ts so callers can
// resolve config from either side. Keep the two files in sync.

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

/** A user-supplied image file plus the bits we need to display it. */
export interface ImageFile {
  /** Stable client-side id. */
  id: string;
  /** The original File reference. */
  file: File;
  /** Original filename, kept separately so renames don't lose the source. */
  name: string;
  /** Size in bytes (mirrors file.size). */
  size: number;
  /** Detected MIME type. */
  type: string;
  /** Width × height in pixels once decoded. */
  width: number;
  height: number;
  /** Object URL or data URL used by <img src=...>. */
  previewUrl: string;
}

/** Standardized result shape returned by every image processor. */
export interface ProcessingResult {
  /** True when the operation succeeded end-to-end. */
  success: boolean;
  /** The processed image as a Blob (only set on success). */
  blob?: Blob;
  /** Suggested filename for the download. */
  filename?: string;
  /** MIME type of the output blob. */
  mimeType?: string;
  /** Output dimensions, when applicable (resize/crop/upscale). */
  width?: number;
  height?: number;
  /** Original size and resulting size, so the UI can show savings. */
  originalSize?: number;
  resultSize?: number;
  /** Human-readable error message when success is false. */
  error?: string;
  /** Total processing duration in ms (for telemetry). */
  durationMs?: number;
}

/** Watermark configuration shared by text/image watermark tools. */
export interface WatermarkOptions {
  type: "text" | "image";
  /** Text content (required when type === "text"). */
  text?: string;
  /** Watermark image as a data URL or Blob URL (required when type === "image"). */
  imageUrl?: string;
  /** Font family (CSS value). Text watermarks only. */
  fontFamily?: string;
  /** Font size in px. */
  fontSize?: number;
  /** CSS color string. */
  color?: string;
  /** 0–1; multiplied into the rendered alpha. */
  opacity?: number;
  /** Rotation in degrees. */
  rotation?: number;
  /** Where to anchor the watermark. */
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "tile";
  /** Padding from the chosen anchor edge in px. */
  padding?: number;
}

/** Pixel rectangle used by the crop tool. */
export interface CropSelection {
  /** Distance from the left edge in pixels. */
  x: number;
  /** Distance from the top edge in pixels. */
  y: number;
  width: number;
  height: number;
  /** Optional locked aspect ratio (e.g. 16/9). */
  aspectRatio?: number;
}

/** Resize tool configuration. */
export interface ResizeOptions {
  mode: "exact" | "percent" | "fit-width" | "fit-height";
  /** Target pixel width (used when mode === "exact" or "fit-width"). */
  width?: number;
  /** Target pixel height (used when mode === "exact" or "fit-height"). */
  height?: number;
  /** Scale factor as percent (50 → 50%). Used when mode === "percent". */
  percent?: number;
  /** Keep aspect ratio when only one dimension is set. */
  preserveAspectRatio?: boolean;
  /** Resampling algorithm hint passed to canvas. */
  quality?: "low" | "medium" | "high";
}

/** Compress tool configuration. */
export interface CompressOptions {
  /** Target output format. "auto" keeps the original where possible. */
  format: "auto" | "jpeg" | "png" | "webp" | "avif";
  /** 0–1 (JPEG/WebP/AVIF quality). Ignored for PNG. */
  quality?: number;
  /** Optional hard cap on output file size in KB (best-effort iterative compression). */
  targetSizeKB?: number;
  /** Strip EXIF, ICC and other metadata. */
  stripMetadata?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────
// Per-tool configuration
// ──────────────────────────────────────────────────────────────────────────

export interface ToolConfig {
  /** Maximum size per file in megabytes. */
  maxFileSizeMB: number;
  /** Accepted MIME types or file extensions for the file picker. */
  acceptedFormats: string[];
  /** True if the tool supports batch / bulk processing. */
  supportsMultiple: boolean;
  /** Where the heavy lifting happens. */
  processingLocation: "browser" | "api";
  /** True when a server-side endpoint or third-party API key is required. */
  apiRequired: boolean;
}

/** Per-tool runtime configuration keyed by the tool id from lib/tools.ts. */
export const IMAGE_TOOLS_CONFIG = {
  "compress-image": {
    maxFileSizeMB: 50,
    acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "resize-image": {
    maxFileSizeMB: 50,
    acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "crop-image": {
    maxFileSizeMB: 25,
    acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "convert-to-jpg": {
    maxFileSizeMB: 50,
    acceptedFormats: [
      "image/png",
      "image/gif",
      "image/tiff",
      "image/svg+xml",
      "image/webp",
      "image/avif",
      "image/heic",
      "image/heif",
      ".psd",
      ".cr2",
      ".nef",
      ".arw",
    ],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "convert-from-jpg": {
    maxFileSizeMB: 50,
    acceptedFormats: ["image/jpeg"],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "photo-editor": {
    maxFileSizeMB: 25,
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "upscale-image": {
    // AI upscaling runs in-browser via TensorFlow.js + UpscalerJS — keep the
    // file limit small so the model doesn't OOM on weaker devices.
    maxFileSizeMB: 10,
    acceptedFormats: ["image/jpeg", "image/png"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "remove-background": {
    maxFileSizeMB: 10,
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    supportsMultiple: false,
    processingLocation: "api",
    apiRequired: true,
  },
  "watermark-image": {
    maxFileSizeMB: 25,
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "meme-generator": {
    maxFileSizeMB: 15,
    acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "rotate-image": {
    maxFileSizeMB: 25,
    acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    supportsMultiple: true,
    processingLocation: "browser",
    apiRequired: false,
  },
  "html-to-image": {
    // Server renders the page in a headless browser — requires a server route.
    maxFileSizeMB: 2,
    acceptedFormats: ["text/html", "url"],
    supportsMultiple: false,
    processingLocation: "api",
    apiRequired: true,
  },
  "blur-face": {
    maxFileSizeMB: 15,
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
} as const satisfies Record<string, ToolConfig>;

/** Union of every configured tool id. */
export type ImageToolId = keyof typeof IMAGE_TOOLS_CONFIG;

// ──────────────────────────────────────────────────────────────────────────
// Accepted input formats (human-friendly list per tool)
// ──────────────────────────────────────────────────────────────────────────

/** Friendly extension/format strings shown next to each upload widget. */
export const SUPPORTED_FORMATS: Record<ImageToolId, string[]> = {
  "compress-image": ["JPG", "JPEG", "PNG", "SVG", "GIF", "WEBP"],
  "resize-image": ["JPG", "JPEG", "PNG", "SVG", "GIF", "WEBP"],
  "crop-image": ["JPG", "JPEG", "PNG", "GIF", "WEBP"],
  "convert-to-jpg": [
    "PNG",
    "GIF",
    "TIFF",
    "PSD",
    "SVG",
    "WEBP",
    "AVIF",
    "HEIC",
    "HEIF",
    "CR2 (RAW)",
    "NEF (RAW)",
    "ARW (RAW)",
  ],
  "convert-from-jpg": ["JPG", "JPEG"],
  "photo-editor": ["JPG", "JPEG", "PNG", "WEBP"],
  "upscale-image": ["JPG", "JPEG", "PNG"],
  "remove-background": ["JPG", "JPEG", "PNG", "WEBP"],
  "watermark-image": ["JPG", "JPEG", "PNG", "WEBP"],
  "meme-generator": ["JPG", "JPEG", "PNG", "GIF", "WEBP"],
  "rotate-image": ["JPG", "JPEG", "PNG", "GIF", "WEBP"],
  "html-to-image": ["URL", "HTML"],
  "blur-face": ["JPG", "JPEG", "PNG", "WEBP"],
};

// ──────────────────────────────────────────────────────────────────────────
// Meme templates
// ──────────────────────────────────────────────────────────────────────────

export interface MemeTemplate {
  id: string;
  name: string;
  /** Either a real image URL or a `gradient:` placeholder consumed by the UI. */
  imageUrl: string;
  topTextDefault: string;
  bottomTextDefault: string;
}

/**
 * 20 classic meme templates. `imageUrl` uses the `gradient:` prefix so the
 * UI can render a programmatic placeholder until real artwork is added — keeps
 * the catalog usable from day one without bundling copyrighted images.
 */
export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: "drake",
    name: "Drake",
    imageUrl: "gradient:from-warning-500,to-accent-500",
    topTextDefault: "Boring thing",
    bottomTextDefault: "Better thing",
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    imageUrl: "gradient:from-primary-500,to-success-500",
    topTextDefault: "Me",
    bottomTextDefault: "Shiny new framework",
  },
  {
    id: "woman-yelling-at-cat",
    name: "Woman Yelling at Cat",
    imageUrl: "gradient:from-accent-500,to-warning-500",
    topTextDefault: "Yelling person",
    bottomTextDefault: "Confused cat",
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    imageUrl: "gradient:from-primary-500,to-accent-500",
    topTextDefault: "Option A",
    bottomTextDefault: "Option B",
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    imageUrl: "gradient:from-success-500,to-primary-500",
    topTextDefault: "",
    bottomTextDefault: "Change my mind",
  },
  {
    id: "bernie-sanders",
    name: "Bernie Sanders",
    imageUrl: "gradient:from-surface-700,to-primary-500",
    topTextDefault: "I am once again asking",
    bottomTextDefault: "For your attention",
  },
  {
    id: "hide-the-pain-harold",
    name: "Hide the Pain Harold",
    imageUrl: "gradient:from-warning-500,to-surface-700",
    topTextDefault: "When the build finally passes",
    bottomTextDefault: "After 47 attempts",
  },
  {
    id: "doge",
    name: "Doge",
    imageUrl: "gradient:from-warning-500,to-accent-500",
    topTextDefault: "Such wow",
    bottomTextDefault: "Much amaze",
  },
  {
    id: "one-does-not-simply",
    name: "One Does Not Simply",
    imageUrl: "gradient:from-surface-800,to-accent-500",
    topTextDefault: "One does not simply",
    bottomTextDefault: "Push to main on Friday",
  },
  {
    id: "this-is-fine",
    name: "This Is Fine",
    imageUrl: "gradient:from-warning-500,to-accent-500",
    topTextDefault: "This is fine.",
    bottomTextDefault: "Everything is fine.",
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    imageUrl: "gradient:from-primary-500,to-accent-500",
    topTextDefault: "Small idea",
    bottomTextDefault: "Big idea",
  },
  {
    id: "surprised-pikachu",
    name: "Surprised Pikachu",
    imageUrl: "gradient:from-warning-500,to-success-500",
    topTextDefault: "When you skip the tests",
    bottomTextDefault: "And the deploy fails",
  },
  {
    id: "disaster-girl",
    name: "Disaster Girl",
    imageUrl: "gradient:from-warning-500,to-accent-500",
    topTextDefault: "I did the thing",
    bottomTextDefault: "Now there's chaos",
  },
  {
    id: "left-exit-12",
    name: "Left Exit 12",
    imageUrl: "gradient:from-success-500,to-primary-500",
    topTextDefault: "Sensible choice",
    bottomTextDefault: "What I actually do",
  },
  {
    id: "success-kid",
    name: "Success Kid",
    imageUrl: "gradient:from-accent-500,to-warning-500",
    topTextDefault: "Wrote one line of code",
    bottomTextDefault: "It compiled",
  },
  {
    id: "bad-luck-brian",
    name: "Bad Luck Brian",
    imageUrl: "gradient:from-primary-500,to-warning-500",
    topTextDefault: "Finally fixes the bug",
    bottomTextDefault: "Breaks two new ones",
  },
  {
    id: "ancient-aliens",
    name: "Ancient Aliens",
    imageUrl: "gradient:from-accent-500,to-primary-500",
    topTextDefault: "I'm not saying it was the linter",
    bottomTextDefault: "But it was the linter",
  },
  {
    id: "gru-plan",
    name: "Gru Plan",
    imageUrl: "gradient:from-primary-500,to-accent-500",
    topTextDefault: "Step one: write tests",
    bottomTextDefault: "Step four: tests still fail",
  },
  {
    id: "waiting-skeleton",
    name: "Waiting Skeleton",
    imageUrl: "gradient:from-surface-700,to-primary-500",
    topTextDefault: "Me waiting for",
    bottomTextDefault: "npm install to finish",
  },
  {
    id: "galaxy-brain",
    name: "Galaxy Brain",
    imageUrl: "gradient:from-accent-500,to-primary-500",
    topTextDefault: "Use a framework",
    bottomTextDefault: "Write your own framework",
  },
];

export const MEME_TEMPLATES_BY_ID: Record<string, MemeTemplate> = Object.fromEntries(
  MEME_TEMPLATES.map((t) => [t.id, t])
);

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

/** Convenience accessor — narrows the union type for callers using a string id. */
export function getImageToolConfig(toolId: string): ToolConfig | null {
  if (toolId in IMAGE_TOOLS_CONFIG) {
    return IMAGE_TOOLS_CONFIG[toolId as ImageToolId];
  }
  return null;
}

/** Returns the accepted-formats list for a tool id, or [] if unknown. */
export function getSupportedFormats(toolId: string): string[] {
  if (toolId in SUPPORTED_FORMATS) {
    return SUPPORTED_FORMATS[toolId as ImageToolId];
  }
  return [];
}
