import type { Metadata } from "next";

import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { ImageUpscaler } from "@/components/image-tools/ImageUpscaler";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "upscale-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "AI Image Upscaler — Enlarge Images Without Losing Quality | Free Online";
const DESCRIPTION =
  "Upscale images 2× or 4× with AI — entirely in your browser. Increase resolution, recover detail, and enlarge photos without losing quality. Free, private, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ai image upscaler",
    "upscale image",
    "enlarge image ai",
    "increase image resolution",
    "upscale image online",
    "free image upscaler",
    "image enhancer ai",
    "ai photo enlarger",
    "2x upscale",
    "4x upscale",
    "browser image upscaler",
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
        alt: "AI Image Upscaler",
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

export default function UpscaleImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="AI Image Upscaler"
        description="Enlarge any photo 2× or 4× with AI that runs entirely in your browser. Recover detail, sharpen edges, and increase resolution without sending your file anywhere."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ImageUpscaler />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Enlarge images without the blur</h2>
      <p>
        Traditional resizing (the kind your operating system, image editor or
        web browser does for free) interpolates between existing pixels using
        algorithms like bilinear or bicubic. They're fast, but they can't
        invent detail that isn't already there — so a 400 × 300 photo
        stretched to 1600 × 1200 ends up soft, smeared, and obviously
        upscaled. AI upscaling solves that by training a neural network on
        millions of pairs of low- and high-resolution images. The model
        learns what plausible "high-resolution" detail looks like and
        regenerates it during the enlargement.
      </p>

      <h2>Why this tool runs in your browser</h2>
      <p>
        Most AI upscalers send your image to a server, run inference there,
        and send the result back. That's expensive (someone has to pay for
        the GPU) and it means your photo lives on a third-party machine,
        even if briefly. This tool uses{" "}
        <strong>UpscalerJS on top of TensorFlow.js</strong> to run the same
        kind of model directly in your browser, on your CPU or GPU. The
        model downloads once, gets cached, and never needs to leave your
        device after that.
      </p>

      <h2>2× vs 4× — which should you pick?</h2>
      <p>
        2× is the default. It quadruples the pixel count and is enough for
        almost every "share larger on social media" or "print bigger"
        scenario. It also runs in roughly half the time of 4× and uses much
        less memory.
      </p>
      <p>
        4× shines when your source is genuinely small — say a thumbnail, an
        old web image, a tiny avatar — and you need a result that holds up
        at full screen. Under the hood the tool runs the 2× model twice in
        succession. The trade-off is time (about 2× as long) and memory
        (significantly more). If you hit an out-of-memory error, drop back
        to 2× or shrink the source first.
      </p>

      <h2>Best results: what photos work well?</h2>
      <ul>
        <li><strong>Portraits and faces</strong> — the model has seen a lot of these and recovers eye, hair and skin detail beautifully.</li>
        <li><strong>Landscapes with natural texture</strong> — leaves, water, clouds and rocks all upscale well.</li>
        <li><strong>Product photos</strong> — fabric, leather, packaging, and clean studio shots stay crisp.</li>
        <li><strong>Old web images and screenshots</strong> — sharp text might still be soft (use a vector source if you have one).</li>
      </ul>

      <h2>What it can't do</h2>
      <p>
        AI upscaling is regeneration, not magic restoration. If your source
        is already heavily compressed, the model will sometimes lock onto
        the JPEG artefacts and amplify them. Faces from very small thumbnails
        can come back looking subtly different from the real person — the
        model is filling in plausible detail, not recovering the truth.
        Treat the output as "a believable larger version" rather than "the
        original at higher resolution".
      </p>
    </article>
  );
}
