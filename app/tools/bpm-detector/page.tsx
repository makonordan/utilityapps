import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { AudioToolShell } from "@/components/audio-tools/AudioToolShell";
import { BpmDetector } from "@/components/audio-tools/BpmDetector";
import { audioToolOgUrl, getAudioFaqs } from "@/lib/audioFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "bpm-detector";
const TITLE = "Free BPM Detector — Find a Song's Tempo Online";
const DESCRIPTION =
  "Detect the BPM (tempo) of any song free in your browser. Drop an MP3, WAV, OGG or FLAC and get beats per minute. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["bpm detector", "bpm counter", "find bpm", "song tempo", "beats per minute", "tempo finder"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: audioToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "BPM Detector" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function BpmDetectorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <AudioToolShell
        toolId={TOOL_ID}
        title="BPM Detector"
        description="Drop a song and get its tempo in beats per minute. Detection runs entirely in your browser using the Web Audio API."
        faqItems={getAudioFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>How BPM detection works</h2>
            <p>
              The tool decodes your audio to raw samples, measures the energy in short 20 ms
              windows, and finds the peaks — the loud moments that usually correspond to kick
              drums and snares. It then histograms the time between those peaks and converts the
              most common interval into beats per minute.
            </p>
            <h2>When it works well — and when it doesn't</h2>
            <p>
              Detection is reliable (±2 BPM) for music with a clear, steady beat: electronic, pop,
              rock, hip-hop, dance. Genres without prominent percussion — ambient, classical,
              free jazz, spoken word — may not produce a clean BPM, because there genuinely
              isn&apos;t a single tempo to find. If a track you know is 128 BPM reads as 64 or
              256, the engine locked onto a half- or double-tempo harmonic.
            </p>
          </article>
        }
      >
        <BpmDetector />
      </AudioToolShell>
    </>
  );
}
