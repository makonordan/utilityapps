// Per-tool configuration for the Video Tools section. Mirrors the shape of
// lib/imageTools.ts so VideoToolShell can read the same fields without a new
// abstraction. Tool slugs MUST match the ids added in lib/tools.ts.

export interface VideoToolConfig {
  /** Maximum size per file in megabytes. ffmpeg.wasm holds inputs in memory,
   *  so per-tool caps keep weaker devices from OOM-ing mid-transcode. */
  maxFileSizeMB: number;
  /** Accepted MIME types or file extensions for the file picker. */
  acceptedFormats: string[];
  /** True if the tool supports batch / bulk processing. */
  supportsMultiple: boolean;
  /** Where the heavy lifting happens. All current video tools are browser-side. */
  processingLocation: "browser" | "api";
  /** True when a server-side endpoint or third-party API key is required. */
  apiRequired: boolean;
}

/** Common accept list for "any common video file". */
const COMMON_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "video/x-msvideo",
  "video/x-flv",
  "video/mpeg",
  "video/ogg",
  "video/3gpp",
];

export const VIDEO_TOOLS_CONFIG = {
  "video-compressor": {
    maxFileSizeMB: 500,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "video-trimmer": {
    maxFileSizeMB: 500,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "video-to-gif": {
    maxFileSizeMB: 200,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "mp4-to-webm": {
    maxFileSizeMB: 500,
    acceptedFormats: ["video/mp4", "video/quicktime", "video/x-matroska"],
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "extract-audio-from-video": {
    maxFileSizeMB: 500,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "video-frame-extractor": {
    maxFileSizeMB: 300,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "mute-video": {
    maxFileSizeMB: 500,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
  "video-resizer": {
    maxFileSizeMB: 500,
    acceptedFormats: COMMON_VIDEO_FORMATS,
    supportsMultiple: false,
    processingLocation: "browser",
    apiRequired: false,
  },
} as const satisfies Record<string, VideoToolConfig>;

export type VideoToolId = keyof typeof VIDEO_TOOLS_CONFIG;

/** Friendly extension lists shown next to the upload widget. */
export const VIDEO_SUPPORTED_FORMATS: Record<VideoToolId, string[]> = {
  "video-compressor": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "video-trimmer": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "video-to-gif": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "mp4-to-webm": ["MP4", "MOV", "MKV"],
  "extract-audio-from-video": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "video-frame-extractor": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "mute-video": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
  "video-resizer": ["MP4", "MOV", "WEBM", "MKV", "AVI", "FLV", "OGV", "3GP"],
};

export function getVideoToolConfig(toolId: string): VideoToolConfig | null {
  if (toolId in VIDEO_TOOLS_CONFIG) {
    return VIDEO_TOOLS_CONFIG[toolId as VideoToolId];
  }
  return null;
}

export function getVideoSupportedFormats(toolId: string): string[] {
  if (toolId in VIDEO_SUPPORTED_FORMATS) {
    return VIDEO_SUPPORTED_FORMATS[toolId as VideoToolId];
  }
  return [];
}

/** Human-readable file size formatter shared by every video tool. */
export function formatVideoSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** mm:ss formatter for trim controls. */
export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}
