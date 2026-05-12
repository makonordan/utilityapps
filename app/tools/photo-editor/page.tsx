import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { PhotoEditor } from "@/components/image-tools/PhotoEditor";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "photo-editor";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Photo Editor Online Free — Add Text, Effects, Stickers & Frames to Photos";
const DESCRIPTION =
  "Free online photo editor. Add text, stickers, frames, and Instagram-style filters to your photos. Adjust brightness, contrast, saturation. Draw on images. 100% browser-based.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "photo editor",
    "online photo editor",
    "free photo editor",
    "add text to photo",
    "add stickers to photo",
    "photo filters",
    "instagram filters",
    "draw on photo",
    "photo effects",
    "image editor",
    "browser photo editor",
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
        alt: "Photo Editor",
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

export default function PhotoEditorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Photo Editor"
        description="Add text, stickers, frames, filters and freehand drawings to any photo. Adjustable brightness, contrast and saturation. Browser-based — your files never leave your device."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
        className="max-w-screen-2xl"
      >
        <PhotoEditor />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>A complete photo editor in your browser</h2>
      <p>
        This is a full-feature image editor built on top of Fabric.js — the
        same canvas-based engine that powers many commercial design tools.
        Open a photo, add text and stickers, drop in a frame, apply
        Instagram-style filters, fine-tune the brightness and contrast, draw
        on top with a brush, then download a PNG, JPG or WEBP. There's no
        signup, no upload step, and no quota.
      </p>

      <h2>Six tabs, one workspace</h2>
      <ul>
        <li><strong>Text</strong> — add editable text with font, size, weight, italic, underline, alignment, fill, highlight, and outline controls.</li>
        <li><strong>Effects</strong> — 17 one-click filter presets covering grayscale, sepia, vintage, B&amp;W, brightness/contrast nudges and more.</li>
        <li><strong>Stickers</strong> — emoji, arrows, shapes and holiday symbols you can drop and resize.</li>
        <li><strong>Frames</strong> — eight frame styles including border, rounded corners, polaroid, film strip, vignette, torn paper and grunge.</li>
        <li><strong>Adjust</strong> — sliders for brightness, contrast, saturation, hue, blur, noise and pixelate; apply once and reset on demand.</li>
        <li><strong>Draw</strong> — pencil, circle and spray brushes with size, opacity and colour control. Clear-only-the-drawing button.</li>
      </ul>

      <h2>Privacy as a default</h2>
      <p>
        Every edit happens on your device. No upload, no temporary cache on
        any server, no analytics on the photo content. The only thing the
        site records is an anonymous tool-visit count, the same as every
        other tool here. That makes the editor safe for sensitive material:
        passport-style photos, internal screenshots, draft client work, and
        anything else you wouldn't want sitting on a third-party host.
      </p>

      <h2>How undo and redo work</h2>
      <p>
        Every meaningful change — adding an object, modifying a property,
        applying a filter, drawing a stroke — pushes a JSON snapshot onto an
        in-memory history. The history is capped at 50 entries to keep
        memory predictable, and Undo/Redo restore the canvas exactly as it
        was at that point.
      </p>

      <h2>Choosing a download format</h2>
      <p>
        <strong>PNG</strong> is the default and the safest pick: lossless,
        preserves transparency, and looks great on every surface. Switch to{" "}
        <strong>JPG</strong> for photographic content where a smaller file
        matters more than perfect pixel fidelity, or <strong>WEBP</strong>{" "}
        for the web — typically 25–35% smaller than JPG at the same visual
        quality. The quality slider next to the format selector controls
        JPG and WEBP encoding.
      </p>
    </article>
  );
}
