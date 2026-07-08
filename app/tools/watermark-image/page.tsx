import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { WatermarkImage } from "@/components/image-tools/WatermarkImage";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "watermark-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Watermark Image Free — Add Text or Logo Watermark to Photos Online";
const DESCRIPTION =
  "Add a text or logo watermark to photos online — free, in your browser, with live preview. Bulk watermarking, 9 positions plus tile, opacity, rotation and scale controls.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "watermark image",
    "add watermark",
    "image watermark",
    "logo watermark",
    "watermark photo",
    "free watermark",
    "online watermark",
    "bulk watermark",
    "copyright photo",
    "watermark generator",
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
        alt: "Watermark Image",
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

export default function WatermarkImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Watermark Image"
        description="Add a text or logo watermark to one photo or a batch of up to 20. Pick a corner, tile it across the image, tune opacity and rotation. Live preview included."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <WatermarkImage />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why watermark a photo?</h2>
      <p>
        Watermarks are the simplest, most universal way to mark image
        ownership. For photographers, designers and creators they discourage
        casual reuse and link viewers back to the source. For brands they
        keep marketing assets identifiable as they bounce around social
        media and review sites. For internal teams they label work-in-progress
        screenshots so they don&apos;t end up in a customer deck by mistake.
      </p>

      <h2>Text vs logo watermarks</h2>
      <p>
        <strong>Text</strong> watermarks are crisp, tiny and easy to read
        even at small sizes. Pick a font, type the text (your name, your
        site, a copyright string), and tune the colour and weight. A
        semi-transparent white text watermark in a bottom corner is the
        photography standard.
      </p>
      <p>
        <strong>Logo</strong> watermarks let you use a real brand mark — any
        shape, any colour, any complexity. For best results use a PNG with
        transparency around the logo, drop it in the small upload area in
        the settings panel, then scale it to 10–25% of the image width.
      </p>

      <h2>Choosing a position</h2>
      <p>
        Standard placements are <strong>bottom-right</strong> (least
        intrusive on the subject) and <strong>centre</strong> (impossible to
        crop out — useful for proof-of-ownership work). For e-commerce and
        catalogue photos the <strong>tile</strong> mode is the safest
        choice because it spreads the watermark across the whole image; an
        accidental crop still leaves several copies visible.
      </p>

      <h2>Opacity, rotation and scale</h2>
      <p>
        Opacity around 35–60% is the sweet spot for most watermarks — clearly
        visible without dominating the photo. Rotation lets you place a
        diagonal mark across the picture (try 30° for tiled patterns).
        Scale (for image watermarks) sets the watermark width as a percentage
        of the source image width — 15–25% looks professional, 40%+ becomes
        a feature of the photo rather than a watermark.
      </p>

      <h2>Bulk processing</h2>
      <p>
        Drop up to 20 photos in one go. The settings panel applies to every
        file in the queue, the first image gets a live preview, and the
        result downloads as either individual files or a single ZIP
        archive. Useful for product catalogues, real-estate galleries,
        portfolio batches or any time you have a folder of photos that all
        need the same mark.
      </p>
    </article>
  );
}
