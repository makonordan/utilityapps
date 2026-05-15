import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { AudioToolShell } from "@/components/audio-tools/AudioToolShell";
import { Mp3Cutter } from "@/components/audio-tools/Mp3Cutter";
import { audioToolOgUrl, getAudioFaqs } from "@/lib/audioFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "mp3-cutter";
const TITLE = "Free MP3 Cutter — Trim Audio Online, Lossless, No Upload";
const DESCRIPTION =
  "Cut and trim MP3, WAV, OGG, FLAC and more free in your browser. Lossless stream-copy — no re-encoding, no quality loss. No signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["mp3 cutter", "audio trimmer", "cut mp3", "trim audio online", "mp3 trimmer", "free mp3 cutter"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: audioToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "MP3 Cutter" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function Mp3CutterPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <AudioToolShell
        toolId={TOOL_ID}
        title="MP3 Cutter"
        description="Cut a clean section out of any MP3, WAV, OGG, or FLAC file. The trim uses stream-copy mode so there's no re-encode and no quality loss."
        faqItems={getAudioFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Lossless trimming</h2>
            <p>
              This cutter uses ffmpeg&apos;s stream-copy mode — it copies the audio bytes between
              your start and end points without re-encoding them. The result is bit-identical to
              the source, so cutting a ringtone, a podcast clip, or a sample loses zero quality
              and finishes almost instantly.
            </p>
            <h2>Privacy</h2>
            <p>
              The cut runs entirely in your browser via ffmpeg.wasm. Your audio never touches a
              server — safe for voice notes, unreleased music, and confidential recordings.
            </p>
          </article>
        }
      >
        <Mp3Cutter />
      </AudioToolShell>
    </>
  );
}
