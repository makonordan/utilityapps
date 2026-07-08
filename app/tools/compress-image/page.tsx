import type { Metadata } from "next";

import { ImageCompressor } from "@/components/image-tools/ImageCompressor";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "compress-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Image Compressor — Compress JPG, PNG, SVG & GIF Free";
const DESCRIPTION =
  "Compress images online for free without losing quality. Reduce JPG, PNG, SVG and GIF file sizes by up to 90%. No upload to server. 100% private.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "image compressor",
    "compress jpg",
    "compress png",
    "compress svg",
    "compress gif",
    "reduce image size",
    "shrink image",
    "image optimizer",
    "free image compressor",
    "online image compressor",
    "browser image compression",
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
        alt: "Image Compressor",
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

export default function CompressImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Image Compressor"
        description="Compress JPG, PNG, SVG and GIF images by up to 90% — without losing visible quality. Drag, drop, download. Everything happens in your browser."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ImageCompressor />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why image compression matters</h2>
      <p>
        Images make up the majority of bytes downloaded by a typical web page —
        often more than HTML, CSS and JavaScript combined. A single
        un-optimised camera photo can be 6 MB or more, while the same photo
        compressed at 80% quality will be under 400 KB and look identical to
        the human eye. Multiply that across a dozen photos on a portfolio,
        a product gallery, or a blog post and the savings are dramatic: faster
        page loads, lower bandwidth bills, happier mobile visitors, and a real
        boost to your Core Web Vitals (in particular LCP, the metric Google
        uses as a ranking signal).
      </p>

      <h2>How this image compressor works</h2>
      <p>
        Under the hood the tool uses a battle-tested open-source compression
        engine running entirely in your browser via a Web Worker, so the main
        thread stays responsive even on bulk jobs. For raster formats (JPG,
        PNG, GIF, WebP) it decodes the image, optionally resizes it, and
        re-encodes with the quality and target format you pick. For SVG it
        runs a text minifier that strips comments, doctype declarations and
        redundant whitespace from the markup — pure string manipulation, no
        re-rendering required.
      </p>

      <h2>Lossy vs lossless compression</h2>
      <p>
        <strong>Lossless</strong> compression squeezes out only data the
        decoder doesn't need — repeated bytes, unused colour entries, redundant
        markup. Pixel values are preserved exactly, so the result is bit-for-bit
        identical to the original on screen. PNG and SVG support lossless
        workflows; the trade-off is that file size reductions are usually
        modest (often 10–30%).
      </p>
      <p>
        <strong>Lossy</strong> compression goes much further by discarding
        information your eye is unlikely to notice — high-frequency colour
        detail, very small luminance variations, areas of nearly-uniform
        colour. JPG, WebP and AVIF were designed for this. With a quality
        setting between 70 and 85 you'll typically see file sizes drop by
        50–90% with no perceptible quality loss. Push the slider lower for
        aggressive savings on thumbnails and previews; push it higher for
        archival masters and prints.
      </p>

      <h2>Choosing the right output format</h2>
      <p>
        For photographs and screenshots full of detail, <strong>JPG</strong>{" "}
        remains the safe default — it's universally supported and very
        efficient at quality settings of 75 and above. For photos on
        modern sites where bytes matter most, <strong>WebP</strong> is the
        better choice: it produces 25–35% smaller files than JPG at the same
        visual quality. Reserve <strong>PNG</strong> for graphics that need
        sharp edges, transparency, or pixel-perfect text — but if you don't
        need transparency, converting a PNG screenshot to WebP can shrink it
        by 80% or more.
      </p>

      <h2>Privacy by default</h2>
      <p>
        Because everything runs locally, none of your files ever touch our
        servers — there's no upload step, no temporary storage, and no
        analytics on the file contents. That makes this compressor safe to use
        for personal photos, screenshots of internal tools, draft client work,
        or anything else you wouldn't want sitting on a third-party server.
        The only thing we collect is anonymous tool-visit counts, the same as
        every other page on the site.
      </p>
    </article>
  );
}
