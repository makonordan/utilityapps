import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { VideoTrimmer } from "@/components/video-tools/VideoTrimmer";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "video-trimmer";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Video Trimmer — Cut and Crop Videos Online Free";
const DESCRIPTION =
  "Trim videos online for free without uploading. Lossless stream-copy cuts of MP4, MOV, WebM, MKV in your browser. No re-encoding, no quality loss. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "video trimmer",
    "trim video online",
    "cut video",
    "crop video",
    "trim mp4",
    "video editor online",
    "free video trimmer",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Video Trimmer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function VideoTrimmerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Video Trimmer"
        description="Cut a clean section out of any MP4, MOV, WebM, or MKV file. The trim uses stream-copy mode so there's no re-encode and no quality loss."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <VideoTrimmer />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What lossless trimming means</h2>
      <p>
        Most online trimmers re-encode your video on the way out, which throws
        away quality even if the file looks fine. This trimmer uses ffmpeg's{" "}
        <strong>stream-copy</strong> mode: it locates the nearest keyframes to
        your start and end points and packages only the bytes between them. The
        video and audio tracks are bit-identical to the source between those
        points, so the trim is as fast as a file copy and as faithful as the
        original.
      </p>

      <h2>How to choose precise trim points</h2>
      <p>
        Stream-copy can only cut on keyframes (typically every 1–2 seconds in
        modern recordings). If your start point lands between keyframes, ffmpeg
        rounds backwards to the previous one — so the trimmed clip may begin a
        fraction of a second earlier than the timestamp you typed. For most
        social-media use this is invisible; for frame-perfect cuts, use a
        desktop editor.
      </p>

      <h2>When to use this tool</h2>
      <p>
        Trim a long screen recording down to the part you want to share, cut a
        few seconds off the start and end of a phone clip, or pull a single
        highlight out of a longer video. The result is the same container as
        the source, so it stays compatible with the editor or platform you
        were going to send it to.
      </p>
    </article>
  );
}
