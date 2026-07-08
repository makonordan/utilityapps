import type { Metadata } from "next";

import { ImageResizer } from "@/components/image-tools/ImageResizer";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "resize-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Image Resizer — Resize JPG, PNG, GIF Online Free | Exact Pixels or Percent";
const DESCRIPTION =
  "Resize images online for free by exact pixels or percentage. Built-in presets for Instagram, YouTube, LinkedIn and other social platforms. No upload — everything runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "image resizer",
    "resize image",
    "resize jpg",
    "resize png",
    "resize gif",
    "image dimensions",
    "image size changer",
    "free image resizer",
    "online image resizer",
    "instagram size",
    "youtube thumbnail size",
    "facebook cover size",
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
        alt: "Image Resizer",
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

export default function ResizeImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Image Resizer"
        description="Resize images to exact pixel dimensions or scale by a percentage. Built-in presets for every major social platform. Bulk processing supported."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ImageResizer />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The right image size for every platform</h2>
      <p>
        Most upload failures and washed-out thumbnails come down to one thing:
        a mismatch between your image's dimensions and the platform's expected
        size. This tool lets you resize to exact pixel targets — or to a
        percentage of the original — in one click. Below is a quick reference
        for the sizes that come up most often.
      </p>

      <h3>Social media</h3>
      <ul>
        <li><strong>Instagram square post:</strong> 1080 × 1080 px</li>
        <li><strong>Instagram portrait:</strong> 1080 × 1350 px</li>
        <li><strong>Instagram story / reel:</strong> 1080 × 1920 px</li>
        <li><strong>Facebook cover:</strong> 820 × 312 px (851 × 315 also works)</li>
        <li><strong>Twitter / X header:</strong> 1500 × 500 px</li>
        <li><strong>LinkedIn banner:</strong> 1584 × 396 px</li>
        <li><strong>YouTube thumbnail:</strong> 1280 × 720 px</li>
        <li><strong>Pinterest pin:</strong> 1000 × 1500 px (2:3 ratio)</li>
      </ul>

      <h3>Web and display</h3>
      <ul>
        <li><strong>Full HD wallpaper:</strong> 1920 × 1080 px</li>
        <li><strong>HD wallpaper:</strong> 1280 × 720 px</li>
        <li><strong>4K wallpaper:</strong> 3840 × 2160 px</li>
        <li><strong>Email header:</strong> 600 × 200 px (rendered well by most clients)</li>
        <li><strong>Open Graph / social share image:</strong> 1200 × 630 px</li>
        <li><strong>Favicon master file:</strong> 512 × 512 px</li>
      </ul>

      <h3>Print</h3>
      <p>
        Print sizes depend on the target DPI. For 300 DPI (high-quality print)
        a standard 4 × 6 inch photo is 1200 × 1800 px, a US Letter page is
        2550 × 3300 px, and a 5 × 7 print is 1500 × 2100 px. If you're not
        sure, aim for the largest size your source image supports — you can
        always shrink later, but upscaling beyond the original adds blur and
        artefacts.
      </p>

      <h2>How resizing works</h2>
      <p>
        Behind the scenes the tool draws your image onto an HTML canvas at
        the new dimensions using bicubic-style interpolation, then re-encodes
        it as JPG, PNG or WebP. Bilinear and bicubic resampling produce the
        smooth, modern look you expect — without the blocky pixelation you'd
        get from nearest-neighbour scaling. Because everything happens in
        the browser, your files are never uploaded; the tool works just as
        well offline once the page has loaded.
      </p>

      <h2>Locking the aspect ratio</h2>
      <p>
        By default the width and height inputs are linked: change one and
        the other updates automatically to preserve the original image's
        proportions. Click the chain icon between the two inputs to break
        the link if you need to stretch or squash the image — useful when
        forcing a specific banner shape, or filling a UI slot with a fixed
        aspect ratio.
      </p>

      <h2>Resizing in bulk</h2>
      <p>
        When you have a folder of product photos or screenshots that all
        need to hit the same target size, switch to Bulk mode. Drop up to
        20 files, pick your dimensions (or a percentage scale), and the tool
        will process them one after another. At the end you'll get a single
        ZIP archive containing every resized image, named so the new
        dimensions are visible at a glance.
      </p>
    </article>
  );
}
