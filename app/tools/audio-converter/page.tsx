import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { AudioToolShell } from "@/components/audio-tools/AudioToolShell";
import { AudioConverter } from "@/components/audio-tools/AudioConverter";
import { audioToolOgUrl, getAudioFaqs } from "@/lib/audioFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "audio-converter";
const TITLE = "Free Audio Converter — MP3, WAV, OGG, FLAC, AAC, OPUS";
const DESCRIPTION =
  "Convert audio between MP3, WAV, OGG, FLAC, AAC and OPUS free in your browser. Powered by ffmpeg.wasm. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["audio converter", "mp3 converter", "wav to mp3", "flac to mp3", "convert audio online"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: audioToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Audio Converter" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function AudioConverterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <AudioToolShell
        toolId={TOOL_ID}
        title="Audio Converter"
        description="Convert audio files between MP3, WAV, OGG, FLAC, AAC/M4A, and OPUS. The transcode runs in your browser via ffmpeg.wasm."
        faqItems={getAudioFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Lossy vs lossless</h2>
            <p>
              <strong>WAV</strong> and <strong>FLAC</strong> are lossless — every sample is
              preserved. WAV is uncompressed (large files); FLAC compresses losslessly (about
              half the size). <strong>MP3</strong>, <strong>OGG</strong>, <strong>AAC</strong>,
              and <strong>OPUS</strong> are lossy — they discard inaudible detail to produce much
              smaller files. For listening, MP3 at 192 kbps or OPUS at 128 kbps is transparent for
              almost everyone. For archiving or further editing, keep FLAC.
            </p>
          </article>
        }
      >
        <AudioConverter />
      </AudioToolShell>
    </>
  );
}
