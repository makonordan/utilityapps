import type { Metadata } from "next";

import { BlurFace } from "@/components/image-tools/BlurFace";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "blur-face";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Face Blur — Automatically Blur Faces in Photos Free | Privacy Tool";
const DESCRIPTION =
  "Automatically detect and blur faces — or any region — in a photo. Works on license plates, signs, and bystanders. Runs entirely in your browser. Free, private, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "blur face",
    "blur faces in photo",
    "face blur",
    "automatic face blur",
    "ai face blur",
    "privacy blur",
    "blur license plate",
    "anonymize photo",
    "gdpr photo blur",
    "face anonymizer",
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
        alt: "Face Blur",
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

export default function BlurFacePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Face Blur"
        description="Automatically detect and blur faces in any photo — or paint custom blur regions over license plates, signs and bystanders. Runs entirely in your browser."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BlurFace />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Anonymise photos without sending them anywhere</h2>
      <p>
        Most online face-blurring tools require you to upload your photo to
        their servers — which is awkward when the whole point of blurring
        the photo is that you don&apos;t want it out in the world. This tool
        flips that around: the face-detection neural net runs in your
        browser via TensorFlow.js, the blurring is done by your own
        browser&apos;s canvas, and your photo never travels over the
        network. We don&apos;t even log the filename.
      </p>

      <h2>Auto, manual, or both</h2>
      <p>
        <strong>Auto</strong> mode uses the TinyFaceDetector model — a fast,
        lightweight neural network that finds faces at a wide range of
        scales and angles. After detection, every face shows up as a red
        dashed box with an X handle to remove false positives.
      </p>
      <p>
        <strong>Manual</strong> mode lets you click-and-drag rectangles
        over anything that needs to disappear — license plates, T-shirt
        graphics, badges, signs, screens, bystanders. Manual regions show
        up in blue so you can tell them apart from the AI&apos;s
        detections.
      </p>
      <p>
        <strong>Both</strong> mode is what most people want: run auto
        detection, then paint extra rectangles over whatever the AI
        missed.
      </p>

      <h2>Tuning the blur intensity and shape</h2>
      <p>
        The intensity slider controls the pixelation block size. Low values
        (5–10) produce a subtle pixelation that still suggests a face
        shape; high values (20+) reduce the area to a few coarse colour
        blocks — the look you typically see on the news. Pick high values
        for true anonymisation; the lower end can sometimes be reversed by
        modern AI tools, so don&apos;t rely on it for sensitive material.
      </p>
      <p>
        The shape control toggles between an oval blur (clipped to an
        ellipse — the natural choice for faces) and a rectangle (the
        choice for licence plates, signs and other rectangular objects).
      </p>

      <h2>Privacy-first journalism, parenting and street photography</h2>
      <p>
        Use cases this tool was built for:
      </p>
      <ul>
        <li><strong>Journalists protecting sources</strong> — blur a source&apos;s face before publishing without ever sending the original to a remote service.</li>
        <li><strong>Parents sharing kid photos</strong> — anonymise other children in school events, parties or sports matches.</li>
        <li><strong>Street photographers</strong> — comply with GDPR when including identifiable bystanders in a publishable shot.</li>
        <li><strong>Real-estate listings</strong> — blur cars, doorbells with names, and overheard street numbers.</li>
        <li><strong>Surveillance/CCTV stills</strong> — blur faces before forwarding stills to insurance, building managers or social networks.</li>
        <li><strong>Sensitive corporate screenshots</strong> — quickly cover faces in employee photos when sharing externally.</li>
      </ul>

      <h2>What the AI can and can&apos;t do</h2>
      <p>
        TinyFaceDetector is good but not perfect. It handles the standard
        cases (front-facing portraits at decent resolution, groups in
        ordinary lighting) very well. It struggles with very small faces
        (under ~40 px wide), strong profiles, partial occlusion (sunglasses
        + masks together can confuse it), and anything heavily stylised
        like sketches or anime. When you&apos;re relying on this for real
        privacy work, do a visual pass after the auto detection to confirm
        every face is covered — Manual mode is one click away.
      </p>
    </article>
  );
}
