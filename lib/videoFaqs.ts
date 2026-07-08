/**
 * Shared per-tool metadata for the Video Tools section. Mirrors lib/imageFaqs.ts
 * — FAQs, HowTo steps, feature lists, and publish date live in one place so
 * the rendered content matches the JSON-LD schemas exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { type VideoToolId } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

export interface HowToStep {
  name: string;
  text: string;
}

// ──────────────────────────────────────────────────────────────────────────
// FAQs — 6 entries per tool. Generic privacy / format / mobile questions
// first, tool-specific questions last.
// ──────────────────────────────────────────────────────────────────────────

export const VIDEO_FAQS: Record<VideoToolId, FAQItem[]> = {
  "video-compressor": [
    {
      q: "Is the video compressor really free?",
      a: "Yes — every feature is free with no signup, no daily quota, and no watermarks. The transcode runs in your browser using ffmpeg.wasm.",
    },
    {
      q: "Do you upload my video?",
      a: "No. The whole encode happens locally in your browser. Your file never touches a server — perfect for personal footage or unreleased work.",
    },
    {
      q: "Which video formats can I compress?",
      a: "MP4, MOV, WebM, MKV, AVI, FLV, OGV, and 3GP. The output is always an H.264 MP4 so the result plays everywhere — phones, browsers, social platforms.",
    },
    {
      q: "Is there a file size limit?",
      a: "Up to 500 MB per file. Larger videos run, but performance depends on your device's RAM — desktop browsers handle bigger files than phones.",
    },
    {
      q: "How long does compression take?",
      a: "Roughly half of the video's runtime on a modern laptop. A 60-second clip compresses in about 30 seconds; a 5-minute video takes around 2–3 minutes.",
    },
    {
      q: "How much smaller will my video be?",
      a: "Most camera and screen-recorded videos shrink by 50–80% at the default quality (CRF 28). Bump the quality up for archival masters or down for fast-loading web video.",
    },
  ],

  "video-trimmer": [
    {
      q: "Is the video trimmer really free?",
      a: "Yes — no signup, no watermark, no quota. Trim as many videos as you want.",
    },
    {
      q: "Does my video get uploaded?",
      a: "No. The trim runs in your browser, so the file stays on your device the entire time.",
    },
    {
      q: "What formats does it accept?",
      a: "MP4, MOV, WebM, MKV, AVI, FLV, OGV, and 3GP. The output preserves the input container whenever possible.",
    },
    {
      q: "Is there a length limit?",
      a: "Up to 500 MB per file. The trim itself is fast because it uses stream copy — no re-encoding — so even hour-long videos finish in seconds.",
    },
    {
      q: "Will trimming reduce quality?",
      a: "No. We use ffmpeg's stream-copy mode, which cuts on keyframes without re-encoding. The output is bit-identical to the source between the trim points.",
    },
    {
      q: "Can I trim multiple sections?",
      a: "The current version supports a single start/end range. For multi-segment edits, trim each section separately and concatenate using a video editor.",
    },
  ],

  "video-to-gif": [
    {
      q: "Is the video-to-GIF tool free?",
      a: "Yes — completely free, no signup, no watermark. Make as many GIFs as you need.",
    },
    {
      q: "Does my video get uploaded?",
      a: "No. The GIF is built in your browser, so your source video never leaves your device.",
    },
    {
      q: "What's the maximum input size?",
      a: "Up to 200 MB. GIF encoding is memory-heavy, so a smaller cap keeps the conversion stable on mobile browsers.",
    },
    {
      q: "How long can my output GIF be?",
      a: "Anywhere from 1 to 30 seconds. Longer GIFs are technically possible but quickly balloon to tens of megabytes, which most platforms reject.",
    },
    {
      q: "What frame rate and size should I pick?",
      a: "10–15 fps and 480 px wide is the sweet spot for social media. Higher fps and larger sizes look better but produce much bigger files.",
    },
    {
      q: "Will the GIF have sound?",
      a: "No — the GIF format does not support audio. If you need audio, use the MP4-to-WebM tool instead and embed the resulting clip.",
    },
  ],

  "mp4-to-webm": [
    {
      q: "Is the MP4-to-WebM converter free?",
      a: "Yes, free with no signup and no watermark. Convert as many videos as you like.",
    },
    {
      q: "Why convert from MP4 to WebM?",
      a: "WebM (VP8/VP9) typically produces files 25–35% smaller than equivalent-quality H.264 MP4. It's also the recommended format for HTML5 <video> on the open web.",
    },
    {
      q: "Does the file leave my device?",
      a: "No. The conversion runs entirely in your browser using ffmpeg.wasm.",
    },
    {
      q: "What's the largest file I can convert?",
      a: "Up to 500 MB. The single-threaded encoder is slower than native ffmpeg, so very large files can take several minutes — leave the tab open.",
    },
    {
      q: "Will I lose quality?",
      a: "WebM uses lossy compression, so there's some loss compared to the source. At the default quality (CRF 30), the difference is imperceptible for most content.",
    },
    {
      q: "Will the WebM file play in Safari?",
      a: "Safari supports WebM as of macOS Big Sur (2020) and iOS 16. For older Apple devices, keep an MP4 fallback.",
    },
  ],

  "extract-audio-from-video": [
    {
      q: "Is the audio extractor free?",
      a: "Yes — free, no signup, no watermark. Extract audio from as many videos as you need.",
    },
    {
      q: "Does the video get uploaded?",
      a: "No. Extraction happens in your browser, so the file stays on your device.",
    },
    {
      q: "What audio formats can I export?",
      a: "MP3 (universal compatibility) and AAC (smaller files at the same quality). Pick MP3 unless you have a reason to prefer AAC.",
    },
    {
      q: "What's the input limit?",
      a: "Up to 500 MB. Audio-only output is small even for long videos, but the extractor still has to decode the full source to find the audio track.",
    },
    {
      q: "Will the audio quality match the source?",
      a: "The extractor re-encodes audio at 192 kbps by default, which is transparent for almost all source material. Lossless extraction (FLAC) is not supported in this version.",
    },
    {
      q: "Why use this instead of a YouTube downloader?",
      a: "This tool extracts audio from a video file you already have, like a screen recording, podcast video, or interview footage. It does not download from streaming sites.",
    },
  ],

  "video-frame-extractor": [
    {
      q: "Is the frame extractor free?",
      a: "Yes — free, no signup, no watermark.",
    },
    {
      q: "Does my video get uploaded?",
      a: "No. Frame extraction runs in your browser using ffmpeg.wasm; nothing leaves the device.",
    },
    {
      q: "How many frames can I extract?",
      a: "Up to about 500 frames per run before the browser memory cap becomes an issue. For longer videos, pick a lower frames-per-second rate.",
    },
    {
      q: "What image format are the frames in?",
      a: "PNG by default — lossless, transparent compression. You can switch to JPG in the output settings if file size matters.",
    },
    {
      q: "Can I extract just one specific frame?",
      a: "Yes — set the timestamp directly in the controls. The extractor will seek to that exact moment and pull a single frame.",
    },
    {
      q: "Why are the frames packaged as a ZIP?",
      a: "Most frame extractions produce dozens of files. Bundling them as a single ZIP makes downloading and managing them dramatically simpler than serving each image separately.",
    },
  ],

  "mute-video": [
    {
      q: "Is the video muter free?",
      a: "Yes — completely free, no signup, no watermark.",
    },
    {
      q: "Does muting upload my video?",
      a: "No. The video stays in your browser, where ffmpeg strips the audio track and writes a new file.",
    },
    {
      q: "Will the video quality drop after muting?",
      a: "No. We use stream-copy mode to keep the video track bit-identical to the source — only the audio track is removed.",
    },
    {
      q: "What's the input limit?",
      a: "Up to 500 MB per file. Because there's no re-encode, muting even a long video is near-instant.",
    },
    {
      q: "Can I keep just one of multiple audio tracks?",
      a: "The current version removes all audio. For selective audio handling, use a desktop editor like Shotcut or DaVinci Resolve.",
    },
    {
      q: "Why would I mute a video?",
      a: "Common reasons: removing copyrighted background music before uploading to social, stripping bystander conversations from family clips, or preparing footage for narration in editing software.",
    },
  ],

  "video-resizer": [
    {
      q: "Is the video resizer free?",
      a: "Yes — free with no signup, no quota, and no watermark.",
    },
    {
      q: "Does my video get uploaded?",
      a: "No. Resizing runs in your browser using ffmpeg.wasm — your file stays local.",
    },
    {
      q: "What dimensions should I pick for social platforms?",
      a: "1080 × 1920 for Instagram Reels, TikTok, and YouTube Shorts (9:16). 1080 × 1080 for Instagram feed (1:1). 1920 × 1080 for YouTube and Twitter/X landscape (16:9).",
    },
    {
      q: "Will resizing distort my video?",
      a: "Only if you turn off aspect-ratio lock. With the lock on (default), the resizer either letterboxes or scales to fit one dimension while preserving the original ratio.",
    },
    {
      q: "What's the file size limit?",
      a: "Up to 500 MB per file. Resizing requires a re-encode, so duration roughly tracks the source length.",
    },
    {
      q: "What output format is used?",
      a: "H.264 MP4 — universal compatibility across browsers, phones, and editing software.",
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// HowTo steps — used by SchemaOrg HowTo JSON-LD and rendered on each page.
// ──────────────────────────────────────────────────────────────────────────

export const VIDEO_HOWTOS: Record<VideoToolId, HowToStep[]> = {
  "video-compressor": [
    { name: "Upload", text: "Drop a video file (MP4, MOV, WebM, MKV, AVI, FLV, OGV, or 3GP) into the upload area. Maximum 500 MB." },
    { name: "Pick quality", text: "Choose Low (smallest file), Medium (recommended), or High (best quality, larger file)." },
    { name: "Compress", text: "Click Compress video. The browser downloads ffmpeg.wasm on first use, then re-encodes the file with H.264." },
    { name: "Preview", text: "Play the compressed result inline to confirm it looks acceptable before downloading." },
    { name: "Download", text: "Click Download MP4 to save the compressed file. The original size and new size are shown so you can see the savings." },
  ],
  "video-trimmer": [
    { name: "Upload", text: "Drop a video file into the upload area." },
    { name: "Set start and end", text: "Drag the start/end handles on the timeline, or type timestamps in the mm:ss inputs." },
    { name: "Preview", text: "Use the inline player to scrub through and confirm the trim range." },
    { name: "Trim", text: "Click Trim video. The cut uses stream-copy so there's no re-encode — your output is bit-identical to the source between the trim points." },
    { name: "Download", text: "Click Download to save the trimmed clip." },
  ],
  "video-to-gif": [
    { name: "Upload", text: "Drop a video file (max 200 MB) into the upload area." },
    { name: "Choose range", text: "Pick the start time and duration (1–30 seconds). Longer ranges produce much bigger GIFs." },
    { name: "Set fps and size", text: "Default is 10 fps at 480 px wide — a good balance for social media. Raise both for smoother / sharper output." },
    { name: "Convert", text: "Click Convert to GIF. ffmpeg renders the GIF in your browser using a palette pass for clean colours." },
    { name: "Download", text: "Preview the GIF inline and click Download to save it." },
  ],
  "mp4-to-webm": [
    { name: "Upload", text: "Drop an MP4, MOV, or MKV file into the upload area (max 500 MB)." },
    { name: "Pick quality", text: "Low / Medium / High. Medium is recommended for most web video." },
    { name: "Convert", text: "Click Convert to WebM. The encoder uses VP8 for broad browser support." },
    { name: "Preview", text: "Play the result inline to confirm it looks correct." },
    { name: "Download", text: "Click Download WebM to save the converted file." },
  ],
  "extract-audio-from-video": [
    { name: "Upload", text: "Drop a video file into the upload area." },
    { name: "Pick format", text: "Choose MP3 for universal compatibility, or AAC for smaller files at the same quality." },
    { name: "Extract", text: "Click Extract audio. ffmpeg decodes the video and writes only the audio track." },
    { name: "Preview", text: "Play the extracted audio inline to verify the result." },
    { name: "Download", text: "Click Download to save the audio file." },
  ],
  "video-frame-extractor": [
    { name: "Upload", text: "Drop a video file into the upload area." },
    { name: "Pick mode", text: "Choose Every N seconds (sample at a regular interval), All frames (every frame in the range), or Single frame (one specific timestamp)." },
    { name: "Set range", text: "Optionally restrict the extraction to a start–end window so you don't pull frames from the whole video." },
    { name: "Extract", text: "Click Extract frames. Frames are written as PNG (or JPG) inside ffmpeg's virtual filesystem." },
    { name: "Download", text: "Frames are bundled into a single ZIP file for easy download." },
  ],
  "mute-video": [
    { name: "Upload", text: "Drop a video file into the upload area." },
    { name: "Preview", text: "Play the source inline to confirm you've picked the right file." },
    { name: "Mute", text: "Click Mute video. ffmpeg strips the audio track without re-encoding the video, so the output is instant and lossless." },
    { name: "Verify", text: "Play the muted result to confirm audio is gone and video is intact." },
    { name: "Download", text: "Click Download to save the muted file." },
  ],
  "video-resizer": [
    { name: "Upload", text: "Drop a video file into the upload area (max 500 MB)." },
    { name: "Pick dimensions", text: "Use a preset (Instagram Reel, TikTok, YouTube, Twitter/X) or type custom width and height." },
    { name: "Aspect ratio", text: "Keep the lock on to preserve the original ratio, or turn it off if you specifically need to stretch the frame." },
    { name: "Resize", text: "Click Resize video. ffmpeg scales the frames and re-encodes to H.264 MP4." },
    { name: "Download", text: "Preview the resized result and click Download to save it." },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// Feature lists — populate SoftwareApplication.featureList in JSON-LD.
// ──────────────────────────────────────────────────────────────────────────

export const VIDEO_FEATURE_LISTS: Record<VideoToolId, string> = {
  "video-compressor":
    "H.264 compression, quality presets (low/medium/high), MP4/MOV/WebM/MKV/AVI/FLV/OGV/3GP input, in-browser ffmpeg.wasm, file-size comparison, no upload",
  "video-trimmer":
    "Stream-copy trim (lossless), timeline scrub, mm:ss inputs, inline preview, no re-encode, multi-format input",
  "video-to-gif":
    "Configurable fps and width, 1–30 second clips, palette optimization, inline preview, in-browser processing, no upload",
  "mp4-to-webm":
    "VP8 / VP9 encoding, quality presets, MP4/MOV/MKV input, smaller file sizes than MP4, no signup, no upload",
  "extract-audio-from-video":
    "MP3 and AAC export, 192 kbps default quality, multi-format input, inline audio preview, no upload",
  "video-frame-extractor":
    "Every-N-seconds sampling, single-frame export, PNG or JPG output, ZIP packaging, custom time range, in-browser processing",
  "mute-video":
    "Stream-copy mute (lossless, instant), no re-encode, multi-format input, in-browser processing, no upload",
  "video-resizer":
    "Social-media presets (Reel, TikTok, YouTube, Twitter/X), custom dimensions, aspect-ratio lock, H.264 MP4 output, in-browser processing",
};

// ──────────────────────────────────────────────────────────────────────────
// Publish date — shared by every video tool since they ship together.
// ──────────────────────────────────────────────────────────────────────────

export const VIDEO_TOOL_PUBLISHED = "2026-05-15";

// ──────────────────────────────────────────────────────────────────────────
// Convenience accessors
// ──────────────────────────────────────────────────────────────────────────

export function getVideoFaqs(toolId: string): FAQItem[] {
  return VIDEO_FAQS[toolId as VideoToolId] ?? [];
}

export function getVideoHowTo(toolId: string): HowToStep[] {
  return VIDEO_HOWTOS[toolId as VideoToolId] ?? [];
}

export function getVideoFeatureList(toolId: string): string {
  return VIDEO_FEATURE_LISTS[toolId as VideoToolId] ?? "";
}

export function videoToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
    type: "video-tool",
  });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
