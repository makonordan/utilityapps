import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { ExtractAudio } from "@/components/video-tools/ExtractAudio";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "extract-audio-from-video";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Extract Audio from Video — Free MP4 to MP3 Converter";
const DESCRIPTION =
  "Pull audio out of any video file as MP3 or AAC, free, in your browser. Works on MP4, MOV, WebM, MKV and more. No upload, no signup, no watermark.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "extract audio from video",
    "mp4 to mp3",
    "video to mp3",
    "mov to mp3",
    "extract sound from video",
    "free audio extractor",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Extract Audio from Video" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function ExtractAudioPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="Extract Audio from Video"
        description="Save the audio track out of a video file as MP3 or AAC. The extraction runs in your browser using ffmpeg.wasm — the video never leaves your device."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ExtractAudio />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Common reasons to extract audio</h2>
      <p>
        Save a podcast interview from its video upload as a separate MP3,
        capture narration from a screen recording for a transcript, pull
        voiceover from a tutorial to remix into a new edit, or grab background
        music from a clip you legally own to sync against new footage. The
        workflow is the same: decode the video, discard the picture, encode
        only the audio.
      </p>

      <h2>MP3 vs AAC</h2>
      <p>
        <strong>MP3</strong> is the safest default. It plays everywhere — even
        on a 20-year-old MP3 player — and the 192 kbps default quality is
        transparent for most source material. <strong>AAC</strong> produces
        smaller files at the same quality and is the modern standard for
        podcasts and streaming. Either is fine; pick MP3 unless you have a
        specific reason to prefer AAC.
      </p>

      <h2>What this tool is not</h2>
      <p>
        This is not a YouTube or streaming downloader. The tool only works on
        video files you already have — screen recordings, phone clips, podcast
        exports, interview footage. To download from a streaming site, use that
        platform's official download feature or a desktop app.
      </p>
    </article>
  );
}
