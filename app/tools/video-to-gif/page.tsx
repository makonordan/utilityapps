import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { VideoToGif } from "@/components/video-tools/VideoToGif";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "video-to-gif";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Video to GIF Converter — Free, In-Browser, No Watermark";
const DESCRIPTION =
  "Convert MP4, MOV, WebM and other videos to animated GIFs free in your browser. Custom fps, width, and clip length. No upload, no watermark, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "video to gif",
    "mp4 to gif",
    "mov to gif",
    "convert video to gif",
    "online gif maker",
    "free gif converter",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Video to GIF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function VideoToGifPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Video to GIF"
        description="Turn any short clip into an animated GIF. Pick the start, length, frame rate, and width — the conversion runs entirely in your browser using a palette pass for clean colours."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <VideoToGif />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>How to pick GIF settings</h2>
      <p>
        GIFs trade quality for portability — they autoplay on every platform,
        loop forever, and embed without a video player, but the format is old
        and inefficient. The fps, width, and length you pick directly drive the
        output file size:
      </p>
      <ul>
        <li>
          <strong>10–12 fps at 480 px wide</strong> is the sweet spot for
          social posts, Slack reactions, and product walkthroughs.
        </li>
        <li>
          <strong>15–24 fps at 640–800 px</strong> looks much smoother but can
          easily produce 10–20 MB files that some platforms reject.
        </li>
        <li>
          <strong>Length under 6 seconds</strong> is ideal — GIFs over 10
          seconds usually look worse than the same clip delivered as MP4.
        </li>
      </ul>

      <h2>Why the palette pass matters</h2>
      <p>
        GIFs only support 256 colours per frame. Without a palette pass, the
        result looks dithered and washed out. This tool uses ffmpeg's two-step
        palette workflow (palettegen → paletteuse with Bayer dithering) so
        gradients, faces, and brand colours render cleanly.
      </p>

      <h2>When to keep it as MP4 instead</h2>
      <p>
        If you need audio, smoother motion, or smaller files, convert to a
        compressed MP4 or WebM instead. Twitter/X, Slack, and most modern
        platforms now autoplay short MP4s the same way they autoplay GIFs —
        with a fraction of the file size.
      </p>
    </article>
  );
}
