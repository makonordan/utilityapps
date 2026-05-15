import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { VideoResizer } from "@/components/video-tools/VideoResizer";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "video-resizer";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Video Resizer — Resize Videos for Reel, TikTok, YouTube Free";
const DESCRIPTION =
  "Resize MP4, MOV, WebM, and MKV videos to Reel, TikTok, YouTube Short, or any custom dimensions. Runs free in your browser. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "video resizer",
    "resize video online",
    "video size for reel",
    "video size for tiktok",
    "youtube short size",
    "resize mp4",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Video Resizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function VideoResizerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Video Resizer"
        description="Resize any video to social-media dimensions or a custom width and height. Aspect ratio is preserved by default with clean letterbox or pillarbox padding."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <VideoResizer />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Pick the right dimensions for the platform</h2>
      <ul>
        <li>
          <strong>1080 × 1920 (9:16)</strong> — Instagram Reels, TikTok,
          YouTube Shorts, Snapchat. Always the safest vertical format.
        </li>
        <li>
          <strong>1080 × 1080 (1:1)</strong> — Instagram feed and Facebook
          square posts. Works well on every timeline.
        </li>
        <li>
          <strong>1920 × 1080 (16:9)</strong> — YouTube landscape, Twitter/X
          videos, Vimeo, embedded site players.
        </li>
        <li>
          <strong>1280 × 720 (16:9)</strong> — same shape, lighter file. Good
          for HTML5 embeds and bandwidth-constrained pages.
        </li>
      </ul>

      <h2>Why preserve aspect ratio</h2>
      <p>
        Turning the aspect-ratio lock off will stretch the source frame to fill
        the new dimensions — heads get squashed or distorted. With the lock on,
        the resizer scales the video to fit one dimension and adds clean black
        bars (letterbox or pillarbox) on the other axis. The output retains the
        original proportions and looks correct on every player.
      </p>

      <h2>About the re-encode</h2>
      <p>
        Resizing inherently requires a full re-encode — the pixel grid
        changes, so the H.264 codec has to recompute every frame. The default
        quality (CRF 23) is visually transparent for most footage. Long source
        videos take longer to resize than to merely trim or mute; budget
        roughly half the runtime of the video on a modern laptop.
      </p>
    </article>
  );
}
