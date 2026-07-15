import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { RemoveBackground } from "@/components/image-tools/RemoveBackground";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "remove-background";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Remove Background Free — AI Background Remover, No Upload";
const DESCRIPTION =
  "Remove the background from any photo in seconds. AI runs entirely in your browser — no upload, no signup, no usage cap. Transparent, solid colour, or blurred background.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "remove background",
    "background remover",
    "ai background remover",
    "remove image background",
    "transparent background",
    "remove background free",
    "remove background online",
    "cut out image",
    "isolate subject",
    "product photo background",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: imageToolOgUrl(TITLE, DESCRIPTION),
        width: 1200,
        height: 630,
        alt: "Remove Background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [imageToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function RemoveBackgroundPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Remove Background"
        description="Cut the background out of any photo in seconds. AI runs entirely in your browser — your image never leaves your device. Replace with transparent, a solid colour, or a blurred original."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <RemoveBackground />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>One-click background removal — in your browser</h2>
      <p>
        Drop a photo, click the button, and a few seconds later you have a
        clean PNG with the subject isolated against transparency. The whole
        thing — neural-network inference and all — runs on your device using
        WebAssembly. Your image never leaves your browser. There&rsquo;s no
        server, no API key, no usage cap.
      </p>

      <h2>How it works (the honest version)</h2>
      <p>
        On your first run, a state-of-the-art segmentation model (about 40
        MB) downloads from a content-delivery network and gets cached in
        your browser&rsquo;s storage. Every run after that is instant —
        no network at all once you&rsquo;ve loaded the model once. Inference
        uses WebGPU on devices that support it (most modern Chrome / Edge /
        Safari) and falls back to WASM-CPU everywhere else; the latter is
        slower but still works.
      </p>

      <h2>Background replacement</h2>
      <p>
        After the cutout is ready, the new background is composited locally
        on a canvas:
      </p>
      <ul>
        <li><strong>Transparent</strong> — keeps the alpha channel; perfect for layering into a design tool, slide deck or PDF.</li>
        <li><strong>White / Black</strong> — the catalogue standards. White is the e-commerce default; black is great for portraits and product shots with dramatic light.</li>
        <li><strong>Blur original</strong> — keeps your subject in context but blurs the background heavily. Great for video-conferencing-style portraits.</li>
        <li><strong>Custom colour</strong> — pick any hex value to match your brand.</li>
      </ul>

      <h2>What works, what struggles</h2>
      <p>
        Modern segmentation models excel at people, animals, vehicles,
        bottles, packaging, and any subject with a fairly continuous outline.
        Hair, fur, lace and other fine edge detail are the long-standing
        hard cases — they sometimes lose a few strands or pick up halo
        artefacts. For pixel-perfect catalogue masters, refine the cutout
        in a dedicated tool afterwards; for most social-media and casual
        product photos, the output is good enough to ship as-is.
      </p>

      <h2>Privacy</h2>
      <p>
        Because the model runs on your machine, your image is never
        uploaded. There is literally no path for your file to reach any
        server we operate. No analytics event records the file, no logs
        capture its bytes, and the &ldquo;Start over&rdquo; button drops the
        in-memory copy immediately. If your tab is closed before processing
        finishes, nothing persists.
      </p>
    </article>
  );
}
