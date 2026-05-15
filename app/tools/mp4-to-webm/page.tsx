import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { Mp4ToWebm } from "@/components/video-tools/Mp4ToWebm";
import { VideoToolShell } from "@/components/video-tools/VideoToolShell";
import { getVideoFaqs, videoToolOgUrl } from "@/lib/videoFaqs";
import { VIDEO_TOOLS_CONFIG } from "@/lib/videoTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "mp4-to-webm";
const CONFIG = VIDEO_TOOLS_CONFIG[TOOL_ID];

const TITLE = "MP4 to WebM Converter — Free, In-Browser, No Upload";
const DESCRIPTION =
  "Convert MP4, MOV, and MKV videos to WebM (VP8) free in your browser. Smaller files for HTML5 video on the open web. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "mp4 to webm",
    "convert mp4 to webm",
    "webm converter",
    "mp4 webm online",
    "free video converter",
    "html5 video",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: videoToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "MP4 to WebM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [videoToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function Mp4ToWebmPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <VideoToolShell
        toolId={TOOL_ID}
        title="MP4 to WebM"
        description="Convert MP4, MOV, or MKV files to WebM with VP8 video and Vorbis audio. The output works in every modern browser and is typically 25–35% smaller than the equivalent MP4."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getVideoFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <Mp4ToWebm />
      </VideoToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why convert MP4 to WebM</h2>
      <p>
        WebM was built for the open web. Its VP8 and VP9 codecs ship royalty-free
        on every modern browser, and at equivalent visual quality WebM files are
        typically 25–35% smaller than H.264 MP4. That difference matters most
        for landing pages and background-video hero sections, where every
        kilobyte hits page load time.
      </p>

      <h2>Browser compatibility</h2>
      <p>
        Chrome, Firefox, Edge, and Brave have supported WebM for over a decade.
        Safari added support on macOS Big Sur and iOS 16. If you need to cover
        older Apple devices, ship both formats and let the <code>&lt;video&gt;</code>{" "}
        element pick: a WebM source first for modern browsers, an MP4 fallback
        for the rest.
      </p>

      <h2>VP8 vs VP9</h2>
      <p>
        This tool uses VP8 because it's the codec guaranteed to be present in
        every build of ffmpeg.wasm — VP9 support depends on how the WASM core
        was compiled. For the file-size and quality differences most users will
        see, VP8 is fine; switch to VP9 in a desktop editor if you have a
        specific need for it.
      </p>
    </article>
  );
}
