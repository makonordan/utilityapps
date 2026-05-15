import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { FrameExtractor } from "@/components/video-tools/FrameExtractor";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "video-frame-extractor";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Video Frame Extractor — Save Frames from Video as PNG or JPG";
const DESCRIPTION =
  "Extract every frame, every Nth second, or one specific frame from any video file. Save as PNG or JPG. Runs free in your browser, no upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "video frame extractor",
    "extract frames from video",
    "video to png",
    "video to images",
    "still frame from video",
    "mp4 frame extractor",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Video Frame Extractor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function FrameExtractorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Video Frame Extractor"
        description="Save every frame, sample every N seconds, or pull a single frame at a specific timestamp. Output is PNG (lossless) or JPG, bundled as a ZIP when there are multiple frames."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <FrameExtractor />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Three extraction modes</h2>
      <p>
        <strong>Single frame</strong> — pick one timestamp and pull the
        clearest frame at that moment. Perfect for capturing a thumbnail, a
        product detail, or a still for a presentation.{" "}
        <strong>Every N seconds</strong> — sample the video at a fixed interval,
        useful for storyboards, time-lapse stills, or visual summaries of a
        long video. <strong>All frames</strong> — decode every frame between
        the start and end timestamps for frame-by-frame analysis or rotoscoping.
      </p>

      <h2>PNG vs JPG</h2>
      <p>
        <strong>PNG</strong> is lossless — exactly what the decoder produced —
        making it the right choice when you'll edit the frames or print them.{" "}
        <strong>JPG</strong> is much smaller and good enough for previews,
        thumbnails, and storyboards. Pick PNG by default and switch to JPG only
        if file size is a problem.
      </p>

      <h2>Working with the ZIP output</h2>
      <p>
        When more than one frame is extracted, the tool bundles them into a
        single ZIP for download. Unzip and the frames arrive in order
        (frame_0001, frame_0002, …) so you can drop them straight into a folder,
        image editor, or animation timeline.
      </p>
    </article>
  );
}
