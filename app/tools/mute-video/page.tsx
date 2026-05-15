import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { MuteVideo } from "@/components/video-tools/MuteVideo";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "mute-video";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Mute Video — Remove Audio Track From Any Video Free";
const DESCRIPTION =
  "Remove sound from MP4, MOV, WebM, MKV and other videos free in your browser. Lossless stream-copy mute — no re-encoding, no quality loss, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "mute video",
    "remove audio from video",
    "silent video",
    "remove sound from video",
    "video no sound",
    "mp4 mute online",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Mute Video" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function MuteVideoPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Mute Video"
        description="Remove the audio track from any video file without re-encoding. The video track is bit-identical to the source — only the audio is gone."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <MuteVideo />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why mute a video</h2>
      <p>
        The most common reasons: stripping copyrighted background music before
        a social-media upload to avoid takedowns, removing bystander
        conversations from family or street footage, prepping a clip for
        narration in a video editor, or creating a silent reference clip for a
        DAW where you want full control over the audio.
      </p>

      <h2>Why this is instant</h2>
      <p>
        The muter doesn't re-encode the video. It uses ffmpeg's stream-copy
        mode (<code>-c copy -an</code>) which simply repackages the video
        track into a new container and drops the audio stream. There's no
        quality loss because no encoding is performed — and the operation
        runs at file-copy speed regardless of how long the video is.
      </p>

      <h2>Need to mute only part of a video?</h2>
      <p>
        This tool removes audio from the entire clip. For partial muting
        (e.g. silencing one section but keeping the rest), use a desktop
        editor like Shotcut, DaVinci Resolve, or iMovie — those let you
        keyframe audio levels along the timeline.
      </p>
    </article>
  );
}
