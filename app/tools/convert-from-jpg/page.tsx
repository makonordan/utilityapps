import type { Metadata } from "next";

import { ConvertFromJpg } from "@/components/image-tools/ConvertFromJpg";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "convert-from-jpg";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Convert JPG — JPG to PNG, WEBP | Animated GIF Maker from Photos Free";
const DESCRIPTION =
  "Convert JPG images to PNG or WEBP — or stitch multiple JPGs into one looping animated GIF. Adjustable frame rate, loop count and scale. Free, browser-based, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "jpg to png",
    "jpg to webp",
    "jpg to gif",
    "convert jpg",
    "convert jpg to png",
    "convert jpg to webp",
    "animated gif maker",
    "create gif from photos",
    "jpg to animated gif",
    "free jpg converter",
    "online jpg to png",
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
        alt: "Convert from JPG",
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

export default function ConvertFromJpgPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Convert from JPG"
        description="Convert JPGs to PNG or WEBP — or stitch a sequence of JPGs into one looping animated GIF. Bulk processing, frame reordering, adjustable scale."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ConvertFromJpg />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Three things this tool does</h2>
      <p>
        It converts a JPG (or a folder of JPGs) into <strong>PNG</strong> for
        lossless re-editing, into <strong>WEBP</strong> for the modern web,
        or into a single <strong>animated GIF</strong> that strings your
        photos together into a looping clip. Pick the mode at the top, drop
        your files, tweak the settings, and download the result.
      </p>

      <h2>JPG → PNG</h2>
      <p>
        PNG is the right destination when you want a master copy you can
        edit further without quality loss compounding with every save. PNGs
        are typically larger than JPGs for photographs, but smaller than
        JPGs for screenshots, logos, line art and anything else with sharp
        edges and flat colour blocks. PNG also supports transparency, so it
        becomes the natural format if you plan to remove a background later.
      </p>

      <h2>JPG → WEBP</h2>
      <p>
        WEBP is the format Google designed specifically to replace JPG and
        PNG on the web. At the same visual quality, WEBP files are 25–35%
        smaller than JPG and 26% smaller than PNG. Every Chromium browser,
        Firefox and Safari (15+) supports it, so you can deploy WEBP to
        production with confidence. Quality 90 is a great default — drop it
        to 75 for thumbnails and gallery grids.
      </p>

      <h2>Building animated GIFs from a sequence</h2>
      <p>
        Animated GIFs are still the lingua franca of share-anywhere short
        clips: chat windows, blog posts, support tickets, README files. To
        build one, switch to the <strong>Create animated GIF</strong> mode,
        drop your photos (we support up to 60 frames), drag the tiles to
        reorder, then set frame rate and loop. The tool uses gif.js with
        Web Workers under the hood, so the encoding runs in parallel and
        keeps the page responsive even on a 30-frame animation.
      </p>

      <h2>Keeping GIF file sizes manageable</h2>
      <p>
        GIFs balloon fast. A 24 fps, 1080p, 30-frame animation can easily
        hit 30 MB. Three knobs trim the size dramatically:
      </p>
      <ul>
        <li><strong>Scale.</strong> 75% is roughly half the bytes; 50% is roughly a quarter.</li>
        <li><strong>Frame rate.</strong> 10 fps usually looks fine and produces files less than half the size of a 24 fps version.</li>
        <li><strong>Frame count.</strong> Cut frames from the middle of the sequence — the eye rarely notices.</li>
      </ul>

      <h2>All-browser, all-private</h2>
      <p>
        Bulk format conversion uses the Canvas API. GIF encoding uses Web
        Workers shipped from your browser. Neither path uploads your files
        anywhere — perfect when the photos are personal, the screenshots
        are confidential, or you're on a flaky connection.
      </p>
    </article>
  );
}
