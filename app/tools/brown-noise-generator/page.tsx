import type { Metadata } from "next";

import { BrownNoiseGenerator } from "@/components/sleep-tools/BrownNoiseGenerator";
import { SleepToolShell } from "@/components/sleep-tools/SleepToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getSleepFaqs, sleepToolOgUrl } from "@/lib/sleepFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "brown-noise-generator";

const TITLE = "Free Brown Noise Generator Online — For Sleep, Focus & Tinnitus";
const DESCRIPTION =
  "Pure brown noise generated live in your browser. Sleep timer, volume control, no downloads, works offline.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brown noise",
    "brown noise generator",
    "brown noise for sleep",
    "brown noise for focus",
    "brown noise online",
    "free brown noise",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: sleepToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Brown Noise Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [sleepToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function BrownNoiseGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <SleepToolShell
        toolId={TOOL_ID}
        title="Brown Noise Generator"
        description="Brown noise on demand — generated sample-by-sample in your browser. Lower-frequency than white or pink noise, brown noise is the gentlest noise colour and a favourite for sleep, deep focus and tinnitus relief."
        faqItems={getSleepFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BrownNoiseGenerator />
      </SleepToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What brown noise is (and why it's different from white)</h2>
      <p>
        White noise contains every frequency at equal energy — it sounds like a hiss, similar to an
        untuned TV. <strong>Brown noise</strong> (also called red noise) drops energy by 6 dB per
        octave, meaning lower frequencies are far louder than higher ones. The result is a deep,
        rumbling sound — closer to a distant waterfall or strong wind — that most people find much
        easier to listen to for hours than white noise.
      </p>

      <h2>Why people use brown noise for sleep</h2>
      <p>
        Brown noise's low-frequency emphasis masks the abrupt sounds that wake you — a door closing,
        a car outside, a partner's snoring — without the harsh hiss that keeps your brain alert.
        Many people who can't tolerate white noise sleep fine to brown. It also masks tinnitus
        better than silence for some listeners, because the low-end energy overlaps with the
        sensation rather than fighting it.
      </p>

      <h2>Why it's good for focus too</h2>
      <p>
        Brown noise is uneventful — there are no transients, no surprises, nothing for your brain to
        track. That makes it a strong background for deep work, especially in an open office or
        cafe. White noise tires people faster because the high-frequency energy still triggers
        attention. Brown is, for most listeners, the calmest of the noise colours.
      </p>

      <h2>How this generator works</h2>
      <p>
        The noise is generated live in your browser using the Web Audio API — there is no audio
        file, no streaming, no loop point. Each sample is produced from the previous one via a
        random walk (the integration of white noise), which is the mathematical definition of brown
        noise. The audio runs entirely on your device and works offline once the page is loaded.
      </p>
    </article>
  );
}
