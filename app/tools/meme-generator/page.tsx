import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { MemeGenerator } from "@/components/image-tools/MemeGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "meme-generator";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Meme Generator — Make Memes Online Free with Classic Templates & Your Photos";
const DESCRIPTION =
  "Make memes online free. Pick from 20 classic templates or upload your own photo. Live preview, classic Impact font, custom colours, advanced text overlays. Download PNG.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "meme generator",
    "meme maker",
    "online meme creator",
    "make a meme",
    "meme templates",
    "free meme generator",
    "drake meme",
    "distracted boyfriend meme",
    "custom meme",
    "upload meme photo",
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
        alt: "Meme Generator",
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

export default function MemeGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Meme Generator"
        description="Pick a classic template or upload your own photo. Type your top and bottom text. Drop in extra overlays with Advanced mode. Download a crisp PNG ready to share."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <MemeGenerator />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Make memes that look the way memes are supposed to look</h2>
      <p>
        Memes have a visual grammar — bold white text, black outline,
        ALL-CAPS, anchored at the top and bottom of the image. This
        generator nails that out of the box: pick a template (or your own
        photo), type two lines, hit download. The classic{" "}
        <strong>Impact</strong> font and the proper double-pass
        stroke-then-fill rendering are turned on by default, so you don&apos;t
        have to fiddle with settings to get the look.
      </p>

      <h2>20 templates, or bring your own</h2>
      <p>
        The gallery includes Drake, Distracted Boyfriend, Woman Yelling at
        Cat, Two Buttons, Change My Mind, Bernie Sanders, Hide the Pain
        Harold, Doge, One Does Not Simply, This Is Fine, Expanding Brain,
        Surprised Pikachu, Disaster Girl, Left Exit 12, Success Kid, Bad
        Luck Brian, Ancient Aliens, Gru Plan, Waiting Skeleton and Galaxy
        Brain. Each ships with sensible default top/bottom text — start
        from there and customise, or wipe it and write your own. Want
        something completely original? Drop in any photo and treat it like
        a blank canvas.
      </p>

      <h2>Live preview, instant feedback</h2>
      <p>
        Every keystroke updates the canvas. Change the font, the colour,
        the outline width or the uppercase setting and the preview
        re-renders the moment your hand leaves the slider. No "process"
        button, no waiting — the meme you see is the meme that&apos;ll
        download.
      </p>

      <h2>Advanced mode for layered captions</h2>
      <p>
        Most memes are happy with just a top line and a bottom line. For the
        ones that need more — labelled diagrams, Expanding Brain panels,
        Drake-style options — flip on Advanced mode and click <em>Add
        text</em>. Each overlay has its own size control and a draggable
        handle on the preview, so you can place captions over specific
        people, hands or buttons in the image.
      </p>

      <h2>Privacy</h2>
      <p>
        The generator runs entirely in your browser using the Canvas API.
        Your photos, the templates you pick, and the memes you build all
        stay on your device — nothing is uploaded to our servers. The only
        thing the site records is an anonymous tool-visit count, the same
        as every other page here.
      </p>
    </article>
  );
}
