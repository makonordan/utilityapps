import type { Metadata } from "next";

import { HtmlToImage } from "@/components/image-tools/HtmlToImage";
import { ImageToolShell } from "@/components/image-tools/ImageToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getImageFaqs, imageToolOgUrl } from "@/lib/imageFaqs";
import { IMAGE_TOOLS_CONFIG } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "html-to-image";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];

const TITLE = "HTML to Image — Convert Webpage URL or HTML Code to JPG/PNG Free";
const DESCRIPTION =
  "Convert any public URL or a snippet of HTML+CSS into a crisp image. Adjustable viewport width, retina scale, PNG/JPG/WEBP/SVG output. Free, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "html to image",
    "url to image",
    "webpage screenshot",
    "html to jpg",
    "html to png",
    "convert html to image",
    "screenshot api",
    "html2canvas",
    "webpage to png",
    "url to png",
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
        alt: "HTML to Image",
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

export default function HtmlToImagePage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ImageToolShell
        toolId={TOOL_ID}
        title="HTML to Image"
        description="Capture any public webpage URL — or render pasted HTML+CSS — as a PNG, JPG, WEBP or SVG. Adjustable width, retina scaling, viewport or full-page capture."
        processingLocation={CONFIG.processingLocation}
        apiRequired={CONFIG.apiRequired}
        faqItems={getImageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <HtmlToImage />
      </ImageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Two ways to turn HTML into a picture</h2>
      <p>
        Sometimes you need a webpage as an image — to attach to a bug
        report, to embed in a slide deck, to share an inline preview on
        Twitter, or to generate a social-share card for an article. This
        tool gives you two paths to that result: paste a URL and let our
        screenshot API capture the live page, or paste HTML+CSS and have
        the browser render it locally.
      </p>

      <h2>URL mode (server-powered)</h2>
      <p>
        Drop any public <code>http(s)://</code> URL and click Convert. The
        request is forwarded to the Screenshotone API with your viewport
        width, pixel scale and capture mode (viewport vs full-page). Ads,
        cookie banners and tracking scripts are blocked by default so the
        captured page looks clean. Some sites refuse the capture — busy
        single-page apps, authenticated dashboards, sites with strict
        CSP/X-Frame-Options — and the error message will tell you when
        that happens.
      </p>

      <h2>HTML mode (browser-side, fully private)</h2>
      <p>
        Paste any HTML and inline CSS into the textarea and the tool
        renders it inside a sandboxed iframe, then captures the result with
        html2canvas. Because everything runs locally, your code never
        leaves the browser — perfect for confidential internal layouts,
        in-progress design mockups, or anything you wouldn&apos;t want sent
        through a third-party service.
      </p>
      <p>
        Self-contained markup with inline CSS works best. External fonts
        and images need CORS-enabled hosts to render correctly; resources
        from private servers that don&apos;t set the right headers will be
        silently skipped. Tailwind utility classes won&apos;t apply unless
        you also paste a <code>&lt;style&gt;</code> block with the actual
        rules; the browser doesn&apos;t know about your framework.
      </p>

      <h2>Picking the right pixel scale</h2>
      <p>
        Set the pixel scale to <strong>1×</strong> for standard-resolution
        output (good for fast previews and lightweight files),{" "}
        <strong>2×</strong> for retina-quality screenshots you&apos;ll embed
        on a website or in a deck, and <strong>3×</strong> when you need
        the highest fidelity — typically for print or large monitors.
        Higher scales produce much bigger files: 3× is roughly nine times
        the bytes of 1×, since file size grows with the square of the
        pixel-density multiplier.
      </p>

      <h2>Format quick guide</h2>
      <ul>
        <li><strong>PNG</strong> — lossless, supports transparency. The default.</li>
        <li><strong>JPG</strong> — smaller, lossy, white background. Best for photo-heavy pages.</li>
        <li><strong>WEBP</strong> — smaller than JPG at the same visual quality. Universally supported on modern browsers.</li>
        <li><strong>SVG</strong> — vector wrapper around the raster output. Useful when a downstream tool insists on an SVG file.</li>
      </ul>
    </article>
  );
}
