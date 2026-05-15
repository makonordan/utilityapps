import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { AudioToolShell } from "@/components/audio-tools/AudioToolShell";
import { VoiceRecorder } from "@/components/audio-tools/VoiceRecorder";
import { audioToolOgUrl, getAudioFaqs } from "@/lib/audioFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "voice-recorder";
const TITLE = "Free Online Voice Recorder — Record + Download, No Signup";
const DESCRIPTION =
  "Record your voice free in your browser with a live waveform. Download as WebM or MP3. No signup, no upload — recording stays on your device.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["voice recorder", "online voice recorder", "audio recorder", "record voice", "mic recorder"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: audioToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Voice Recorder" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function VoiceRecorderPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <AudioToolShell
        toolId={TOOL_ID}
        title="Voice Recorder"
        description="Record audio from your microphone with a live waveform. Play it back, then download as WebM (small) or convert to MP3 — all without leaving your browser."
        faqItems={getAudioFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>How recording works</h2>
            <p>
              The recorder uses the browser&apos;s MediaRecorder API. When you click Record, the
              browser asks for microphone permission, then captures audio directly into memory as
              a WebM/Opus stream. Nothing is uploaded — the recording exists only in your browser
              tab until you download it.
            </p>
            <h2>WebM or MP3?</h2>
            <p>
              WebM/Opus is the native recording format — high quality and small files. If you need
              MP3 (for compatibility with older players or some editing software), click Convert to
              MP3 and the recording is re-encoded locally via ffmpeg.wasm.
            </p>
            <h2>Microphone permission</h2>
            <p>
              The browser will only allow recording on a secure (HTTPS) page and after you grant
              permission. You can revoke microphone access any time in your browser&apos;s site
              settings.
            </p>
          </article>
        }
      >
        <VoiceRecorder />
      </AudioToolShell>
    </>
  );
}
