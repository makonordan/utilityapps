import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { RemoveBackground } from "@/components/image-tools/RemoveBackground";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "remove-background";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Remove Background Free — AI Background Remover | Instant & Accurate";
const DESCRIPTION =
  "Remove the background from any photo in seconds. AI-powered, free, accurate — perfect for portraits, products and e-commerce shots. Replace with a solid colour or blurred original.";

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
        description="Cut the background out of any photo in seconds with AI. Replace it with transparent, a solid colour, or a blurred version of the original."
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
      <h2>One-click background removal</h2>
      <p>
        Drop a photo, click the button, and a few seconds later you have a
        clean PNG with the subject isolated against transparency. Behind the
        scenes the image is sent to a state-of-the-art segmentation model
        trained on millions of subject/background pairs — the same approach
        professional product photographers use, just instant and without
        the manual masking work.
      </p>

      <h2>Why this tool is server-powered</h2>
      <p>
        Most tools on this site run entirely in your browser. Background
        removal is the exception: the model is too large and the inference
        too computationally expensive to ship to the client without a
        miserable wait time. Your image is sent over HTTPS to a vetted AI
        service (remove.bg), processed, and discarded — the API doesn&apos;t
        retain your file after the cutout is returned.
      </p>

      <h2>Background replacement</h2>
      <p>
        After the cutout is ready, the new background is composited locally
        in your browser — no extra API call:
      </p>
      <ul>
        <li><strong>Transparent</strong> — keeps the alpha channel; perfect for layering into a design tool, slide deck or PDF.</li>
        <li><strong>White / Black</strong> — the catalogue standards. White is the e-commerce default; black is great for portraits and product shots with dramatic light.</li>
        <li><strong>Blur original</strong> — keeps your subject in context but blurs the background heavily. Great for video conferencing-style portraits.</li>
        <li><strong>Custom colour</strong> — pick any hex value to match your brand.</li>
      </ul>

      <h2>What works, what struggles</h2>
      <p>
        Modern segmentation models excel at people, animals, vehicles,
        bottles, packaging, and any subject with a fairly continuous outline.
        Hair, fur, lace and other fine edge detail are the long-standing
        hard cases — they sometimes lose a few strands or pick up halo
        artefacts. For pixel-perfect catalogue masters, refine the cutout
        in a dedicated tool afterwards; for most social media and casual
        product photos, the AI output is good enough to ship as-is.
      </p>

      <h2>Privacy and usage</h2>
      <p>
        Files are sent over HTTPS only, not retained by the API after
        processing, and never touch our analytics. The on-page usage
        counter is stored in your browser&apos;s localStorage and resets at
        the start of every calendar month. If you need more than 50
        removals per month, remove.bg&apos;s paid plans are linked from the
        tool itself.
      </p>
    </article>
  );
}
