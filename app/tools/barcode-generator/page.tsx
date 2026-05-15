import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { BarcodeGenerator } from "@/components/productivity-tools/BarcodeGenerator";
import { ProductivityToolShell } from "@/components/productivity-tools/ProductivityToolShell";
import { getProductivityFaqs, productivityToolOgUrl } from "@/lib/productivityFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "barcode-generator";

const TITLE = "Free Barcode Generator — Code 128, EAN, UPC & More (PNG / SVG)";
const DESCRIPTION =
  "Generate Code 128, EAN-13, UPC, Code 39, ITF and 5 more barcode formats free in your browser. Download as PNG or SVG. No signup, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "barcode generator",
    "code 128 generator",
    "ean-13 generator",
    "upc generator",
    "barcode maker",
    "free barcode generator",
    "online barcode",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: productivityToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Barcode Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [productivityToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function BarcodeGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ProductivityToolShell
        toolId={TOOL_ID}
        title="Barcode Generator"
        description="Generate Code 128, EAN-13, UPC, Code 39, ITF, MSI, Pharmacode and more — entirely in your browser. Download as a crisp PNG or scalable SVG."
        faqItems={getProductivityFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <BarcodeGenerator />
      </ProductivityToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Picking the right barcode format</h2>
      <p>
        Barcodes look similar but are very different under the hood. The right
        format depends on what scans your code:
      </p>
      <ul>
        <li>
          <strong>Code 128</strong> — the workhorse for shipping labels,
          inventory, and asset tracking. Encodes any printable ASCII and
          packs more data into less space than Code 39.
        </li>
        <li>
          <strong>EAN-13 / UPC-A</strong> — the 12–13 digit codes printed on
          retail products worldwide. Use these only if the barcode will pass
          through retail point-of-sale.
        </li>
        <li>
          <strong>Code 39</strong> — older but still widely supported. Common
          on ID badges and basic logistics where readability without a check
          digit is fine.
        </li>
        <li>
          <strong>ITF-14</strong> — the larger code on the outside of shipping
          cartons. Designed to remain scannable on corrugated cardboard.
        </li>
      </ul>

      <h2>PNG vs SVG output</h2>
      <p>
        <strong>PNG</strong> is the safe default — every label printer and
        document tool accepts it. It's exported at 2× resolution so it stays
        crisp at the size you place it. <strong>SVG</strong> is vector, so it
        scales to any size without pixelation — ideal for print labels,
        packaging artwork, and Adobe Illustrator workflows.
      </p>

      <h2>Privacy by default</h2>
      <p>
        The barcode is rendered in your browser using JsBarcode and exported
        from the same canvas you see on screen. Your data is never sent to a
        server, so the tool is safe to use for SKUs, internal asset tags,
        prescription labels, and other sensitive identifiers.
      </p>
    </article>
  );
}
