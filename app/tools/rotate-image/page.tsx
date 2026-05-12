import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { RotateImage } from "@/components/image-tools/RotateImage";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "rotate-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Image Rotator — Rotate JPG, PNG, GIF Online Free | Bulk Rotation";
const DESCRIPTION =
  "Rotate images 90°, 180°, 270° or any custom angle. Flip horizontally or vertically. Bulk rotate a folder of photos with an orientation filter. Free, browser-based.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "rotate image",
    "image rotator",
    "rotate jpg",
    "rotate png",
    "rotate photo online",
    "flip image",
    "bulk rotate",
    "free image rotator",
    "online image rotator",
    "rotate 90 degrees",
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
        alt: "Image Rotator",
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

export default function RotateImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Image Rotator"
        description="Rotate one image or a whole batch. Quick 90°/180°/270° presets, custom angles with gap-fill, horizontal and vertical flips, plus an orientation filter for mixed-photo folders."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <RotateImage />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Fix a folder of mis-oriented photos in seconds</h2>
      <p>
        Phones, cameras and scanners record EXIF orientation tags, but not
        every viewer respects them — so half your photos end up sideways
        when you share them. This tool is the fastest way to bake the
        correct rotation into the pixels themselves: drop a folder, pick
        90° clockwise (the usual fix for portrait-mode phone photos), and
        download the corrected batch.
      </p>

      <h2>Quick presets, custom angles, or both</h2>
      <p>
        Three big quick buttons cover the everyday rotations: 90° left, 90°
        right and 180°. For straightening a tilted horizon or producing a
        diagonal layout, tick <strong>Custom angle</strong> and drag the
        slider from −360° to +360°. The number input next to the slider
        gives you single-degree precision.
      </p>

      <h2>Gap fill for non-90° rotations</h2>
      <p>
        When you rotate by an angle that isn&apos;t a multiple of 90°, the
        image no longer fills its bounding rectangle — there are
        triangular gaps at each corner. The colour you pick from the
        gap-fill swatch fills those gaps. Pick the colour of your eventual
        background (white for printing on paper, black for cinema posters,
        the page colour for embedding into a slide). Set the output format
        to PNG and the gaps stay transparent — useful when you&apos;ll
        composite the rotated image onto another layer later.
      </p>

      <h2>Orientation filter</h2>
      <p>
        Camera roll exports often mix landscape, portrait and square shots
        — and you usually only want to fix one orientation. The orientation
        filter limits the rotation to files matching the chosen shape:
        <strong> Landscape</strong> for wider-than-tall, <strong>Portrait
        </strong> for taller-than-wide, <strong>Square</strong> for equal
        sides, or <strong>All</strong> to apply the rotation to everything.
        Files outside the selected orientation are marked Skipped.
      </p>

      <h2>Bulk download as a ZIP</h2>
      <p>
        For batches of 2 or more, the Download button switches to "Download
        all as ZIP" so the rotated files land in your downloads folder as a
        single archive. Single-file batches download straight away with the
        original name plus a <code>-rotated</code> suffix.
      </p>
    </article>
  );
}
