import type { Metadata } from "next";

import { OutgrowingToolBanner } from "@/components/tools/OutgrowingToolBanner";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { InvoiceGenerator } from "@/components/productivity-tools/InvoiceGenerator";
import { ProductivityToolShell } from "@/components/productivity-tools/ProductivityToolShell";
import { getProductivityFaqs, productivityToolOgUrl } from "@/lib/productivityFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "invoice-generator";

const TITLE = "Free Invoice Generator — Branded PDF, Multi-Currency, No Signup";
const DESCRIPTION =
  "Free online invoice generator. Add your logo, fill the form, download a clean branded PDF. Multi-currency, tax + discount, line-item totals. Browser-side, private.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "invoice generator",
    "free invoice maker",
    "online invoice",
    "pdf invoice",
    "freelance invoice",
    "branded invoice template",
    "invoice with logo",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: productivityToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Invoice Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [productivityToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <ProductivityToolShell
        toolId={TOOL_ID}
        title="Invoice Generator"
        description="Fill the form, upload your logo, click download. The invoice is built into a clean PDF entirely in your browser — your client and pricing details never leave your device."
        faqItems={getProductivityFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <InvoiceGenerator />
      </ProductivityToolShell>
      <OutgrowingToolBanner />
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>What goes on a professional invoice</h2>
      <p>
        Every invoice should clearly identify both parties (your business and
        the client), the work performed, the agreed price, and the payment
        terms. The form here covers all of that automatically — it includes
        invoice number, issue and due dates, currency, line items with
        quantity and unit price, tax and discount lines, and a notes / payment
        terms section for bank details or thank-you messages.
      </p>

      <h2>Multi-currency support</h2>
      <p>
        Pick from USD, EUR, GBP, NGN, INR, CAD, AUD, JPY, CNY, and ZAR — the
        currency symbol and number formatting are applied automatically using
        the browser's Intl API, so amounts render correctly for the locale
        you've picked.
      </p>

      <h2>Branding with your logo</h2>
      <p>
        Upload a PNG or JPG of your logo and it appears in the top-left of
        the PDF. Because the upload happens in your browser, the logo file
        never leaves your device — there's no signup, no account, no logo
        gallery on someone else's server.
      </p>

      <h2>Auto-saving</h2>
      <p>
        Every keystroke is saved to your browser's local storage so accidental
        tab closes don't wipe out a half-filled invoice. When you start a
        completely new invoice for a different client, hit "Reset form" to
        clear the saved details.
      </p>

      <h2>Compliance</h2>
      <p>
        The template covers the universally-required fields. Specific tax-
        compliance rules (e.g. VAT IDs in the EU, fiscal codes in some Latin
        American countries, or e-invoicing standards) vary by jurisdiction —
        if your accounting software requires those, add them to the Notes
        field or use a dedicated compliance tool.
      </p>
    </article>
  );
}
