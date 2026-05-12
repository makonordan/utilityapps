import type { Metadata } from "next";

import { ConvertToJpg } from "@/components/image-tools/ConvertToJpg";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "convert-to-jpg";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "Convert to JPG — PNG, GIF, WEBP, SVG, HEIC to JPG Converter Free";
const DESCRIPTION =
  "Convert PNG, WEBP, GIF, SVG, HEIC, BMP and TIFF images to JPG online for free. Bulk conversion, transparent background fill, and adjustable quality. 100% browser-based.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "convert to jpg",
    "png to jpg",
    "webp to jpg",
    "gif to jpg",
    "svg to jpg",
    "heic to jpg",
    "bmp to jpg",
    "tiff to jpg",
    "image to jpeg",
    "convert image to jpeg",
    "free jpg converter",
    "online jpg converter",
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
        alt: "Convert to JPG",
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

export default function ConvertToJpgPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="Convert to JPG"
        description="Convert PNG, WEBP, GIF, SVG, HEIC, BMP and TIFF to JPG. Adjustable quality, transparent-background fill, bulk conversion — all in your browser."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <ConvertToJpg />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Why convert to JPG?</h2>
      <p>
        JPG (also called JPEG) is the universal language of online
        photographs. Every browser, every email client, every CMS and every
        social network accepts it — making it the safest target format when
        you need a file that just works. JPGs are also smaller than PNGs for
        photographic content thanks to the format's efficient lossy
        compression, which lets you trade a tiny amount of perceptual
        quality for a big drop in file size.
      </p>

      <h2>What this tool handles</h2>
      <ul>
        <li><strong>PNG → JPG:</strong> dramatic size savings on screenshots and photos that don't need transparency.</li>
        <li><strong>WEBP → JPG:</strong> useful when an older system or app doesn't recognise WEBP.</li>
        <li><strong>HEIC → JPG:</strong> the format iPhones save in by default — many tools still can't open it.</li>
        <li><strong>GIF → JPG:</strong> grabs the first frame as a static photo.</li>
        <li><strong>SVG → JPG:</strong> rasterises a vector at its current size.</li>
        <li><strong>BMP, TIFF → JPG:</strong> handy for legacy scanner output and Windows clipboard images.</li>
      </ul>

      <h2>Background colour for transparent images</h2>
      <p>
        JPG can't store an alpha channel — every pixel is fully opaque. When
        a PNG, WEBP or SVG with transparency is converted, the transparent
        pixels are filled with whatever background colour you pick. The
        default is white, which works for most documents and bright
        websites, but black, light gray and any custom hex are one click
        away. Pick the colour that matches the surface where the JPG will
        eventually be displayed and the result will look seamless.
      </p>

      <h2>Picking a quality setting</h2>
      <p>
        The quality slider runs from 1 to 100. As a quick guide:
      </p>
      <ul>
        <li><strong>95–100:</strong> archival or master copies — virtually identical to source.</li>
        <li><strong>85–94:</strong> the standard "looks great everywhere" range. Default is 92.</li>
        <li><strong>70–84:</strong> noticeable savings; visible artefacts only on flat colour areas.</li>
        <li><strong>40–69:</strong> aggressive — smudgy edges and blocking become visible.</li>
        <li><strong>1–39:</strong> for thumbnails or extreme bandwidth-constrained use cases only.</li>
      </ul>

      <h2>Privacy</h2>
      <p>
        Every step — including HEIC and TIFF decoding — happens in your
        browser. Files never touch our servers, and the tool keeps working
        if you go offline mid-session. That makes it safe to convert
        passport photos, screenshots of internal dashboards, scanned
        documents, and anything else you wouldn't want sitting on a
        third-party host.
      </p>
    </article>
  );
}
