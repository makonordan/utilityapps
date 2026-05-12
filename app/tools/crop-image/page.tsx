import type { Metadata } from "next";

import { ImageCropper } from "@/components/image-tools/ImageCropper";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "crop-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Image Cropper — Crop JPG, PNG, GIF Online Free | Visual Editor";
const DESCRIPTION =
  "Crop images online with a visual editor. Drag the corners, lock an aspect ratio, or enter exact pixel values. Free, private, browser-based — no upload required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "image cropper",
    "crop image",
    "crop jpg",
    "crop png",
    "crop gif",
    "visual image cropper",
    "online image cropper",
    "free image cropper",
    "aspect ratio crop",
    "square crop",
    "instagram crop",
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
        alt: "Image Cropper",
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

export default function CropImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Image Cropper"
        description="Crop images visually with handles and an aspect-ratio lock, or jump to pixel-exact coordinates. JPG, PNG, GIF and WebP supported."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ImageCropper />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Crop images the way you want</h2>
      <p>
        Cropping is one of the simplest yet highest-impact image edits you
        can make: trim the boring edges, fix off-centre subjects, force a
        thumbnail into a specific shape, or pull a detail crop out of a larger
        photo. This tool gives you two ways to do it — drag the corners
        visually, or type exact pixel values when you need millimetre-precise
        framing.
      </p>

      <h2>Visual editor vs pixel editor</h2>
      <p>
        The <strong>visual editor</strong> shows your image full-width with
        an overlay rectangle. Drag the body to move the crop around, drag
        any of the eight handles to resize. The crop coordinates are tracked
        in the original image's pixel space, so what you see in the preview
        is exactly what you'll get on download — there's no surprise
        rescaling at the end.
      </p>
      <p>
        Switch to <strong>Pixel mode</strong> when you need exact numbers:
        cropping to a fixed banner size, exporting a slice at known offsets,
        or matching another image's framing. All four inputs are clamped to
        the image bounds automatically, so you'll never produce an invalid
        crop.
      </p>

      <h2>Locking an aspect ratio</h2>
      <p>
        Pick a ratio from the chip list and the crop rectangle is constrained
        to that shape from then on. Dragging any handle resizes the rectangle
        while preserving the locked ratio — drag a corner to scale both
        dimensions, or an edge to grow the crop symmetrically around its
        centre line. Switch to <strong>Free</strong> to drag the crop into
        any custom shape.
      </p>
      <p>
        Common picks: <strong>1:1</strong> for Instagram feed posts and
        profile pictures; <strong>16:9</strong> for YouTube thumbnails,
        widescreen banners, and presentation slides; <strong>9:16</strong>{" "}
        for Instagram and TikTok stories; <strong>4:5</strong> for vertical
        portrait posts; <strong>3:2</strong> for classic DSLR prints.
      </p>

      <h2>Rule of thirds composition</h2>
      <p>
        Toggle the rule-of-thirds grid to overlay two evenly-spaced vertical
        and horizontal lines. Decades of photography teaching converge on the
        same advice: place your subject (the eye in a portrait, the horizon
        in a landscape) along one of those lines, or at one of the four
        intersections, and the composition immediately feels more balanced.
        It's a fast trick that beats centring almost every time.
      </p>

      <h2>Why crop in the browser</h2>
      <p>
        Browser-based cropping has three big advantages over a desktop image
        editor or a cloud service: it's instant (no upload wait), it's
        private (your files never leave your device), and it works on every
        operating system that runs a modern browser — including phones and
        tablets. The Canvas API used under the hood is the same engine that
        powers professional web-based design tools, so the result is
        pixel-perfect even on very large images.
      </p>
    </article>
  );
}
