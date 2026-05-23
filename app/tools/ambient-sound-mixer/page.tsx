import type { Metadata } from "next";

import { AmbientSoundMixer } from "@/components/sleep-tools/AmbientSoundMixer";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "ambient-sound-mixer";

const TITLE = "Free Ambient Sound Mixer — White, Brown, Rain & Ocean";
const DESCRIPTION =
  "Mix brown, pink, white noise plus rain and ocean ambience into your own sleep or focus soundscape. Free, browser-based.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ambient sound mixer",
    "noise mixer",
    "sleep sound mixer",
    "white pink brown noise mix",
    "rain sound generator",
    "ocean wave sounds",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Ambient Sound Mixer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [sleepToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function AmbientSoundMixerPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <SleepToolShell
        toolId={TOOL_ID}
        title="Ambient Sound Mixer"
        description="Blend five procedurally-generated ambient tracks — brown, pink and white noise plus rain and ocean — into a custom soundscape. One audio engine, five sliders, a master sleep timer, no downloads."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <AmbientSoundMixer />
      </SleepToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why blending sounds works better than one alone</h2>
      <p>
        A single noise colour can feel monotonous after a few minutes. Adding a small amount of a
        second texture — say, brown noise as the base with a hint of rain on top — gives the ear
        enough variety to relax into without ever becoming busy. The mixer is built around that
        principle: a few sliders, no fiddly menus, set it and forget it.
      </p>

      <h2>What each track is good for</h2>
      <p>
        <strong>White noise</strong> masks chatter and notifications best — the high-frequency
        content covers human speech. <strong>Pink noise</strong> is white softened — gentler on the
        ears for long sessions. <strong>Brown noise</strong> is the deepest — best for sleep and
        tinnitus relief. <strong>Rain</strong> adds an organic feel that pure noise lacks.
        <strong>Ocean waves</strong> introduce slow rhythmic swells that pull breathing into a
        slower rhythm.
      </p>

      <h2>How the mixer is built</h2>
      <p>
        Every track is synthesised in your browser with the Web Audio API. Two random-walk noise
        buffers — white and brown — feed five tracks through different filter and modulation chains.
        Pink is white through a lowpass; rain is white through a bandpass; ocean is brown modulated
        by a 0.1-Hz oscillator that creates the slow wave swells. Nothing is downloaded; nothing is
        streamed.
      </p>

      <h2>Using it for sleep vs. focus</h2>
      <p>
        For sleep, start with brown noise around 60% and add a touch of rain or ocean to taste — set
        the sleep timer to 60 minutes and let it fade out. For focus, bring up pink or white noise
        to mask chatter and keep rain low — focus benefits from steady, predictable sound. Save your
        own mix by remembering the slider positions; the page resets each visit so the mixer stays
        simple.
      </p>
    </article>
  );
}
