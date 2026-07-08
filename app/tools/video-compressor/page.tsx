import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { VideoCompressor } from "@/components/video-tools/VideoCompressor";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "video-compressor";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Video Compressor — Shrink MP4, MOV, WebM & More Free";
const DESCRIPTION =
  "Compress videos online for free without uploading. Reduce MP4, MOV, WebM, MKV and more by up to 80% in your browser using ffmpeg.wasm. No signup. 100% private.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "video compressor",
    "compress video online",
    "compress mp4",
    "shrink video",
    "reduce video size",
    "compress mov",
    "compress webm",
    "free video compressor",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Video Compressor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function VideoCompressorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Video Compressor"
        description="Compress MP4, MOV, WebM and more by up to 80% — entirely in your browser via ffmpeg.wasm. Pick a quality preset, drop a file, download an H.264 MP4."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <VideoCompressor />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why compress video</h2>
      <p>
        A modern phone records around 100 MB of footage per minute at 4K — far
        too large to email, share over chat, or upload to most CMS systems. A
        well-compressed copy of the same clip is typically under 20 MB with no
        visible quality loss. Compressing before sharing saves bandwidth,
        speeds up uploads, and stays inside the file-size limits that Slack,
        Discord, email, and most learning platforms enforce.
      </p>

      <h2>How this video compressor works</h2>
      <p>
        The tool runs <strong>ffmpeg.wasm</strong> directly in your browser tab.
        On the first run it downloads the WebAssembly build of ffmpeg (about
        30 MB) and caches it; every subsequent compression uses the cached
        engine. Your video file is read into memory, re-encoded with the H.264
        codec at the quality you pick, and written out as a standard MP4 that
        plays on every device and platform.
      </p>

      <h2>Picking a quality preset</h2>
      <p>
        <strong>Low</strong> uses constant-rate-factor (CRF) 32 — aggressive
        compression for sharing on chat platforms or as a small archive. Files
        are typically 70–85% smaller than the source. <strong>Medium</strong>{" "}
        (CRF 28, recommended) lands at 50–70% savings with no perceptible quality
        loss for the vast majority of footage. <strong>High</strong> (CRF 22)
        keeps the file near archival quality, useful for source masters you'll
        re-edit later.
      </p>

      <h2>Privacy by default</h2>
      <p>
        Every byte of the transcode happens locally in your browser. The video
        never leaves your device, so the compressor is safe to use for personal
        footage, client work under NDA, or anything else you wouldn't upload to
        a third-party server. The only thing we log is anonymous tool-visit
        counts, the same as every other page on the site.
      </p>
    </article>
  );
}
