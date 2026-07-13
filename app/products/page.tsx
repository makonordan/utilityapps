import type { Metadata } from "next";
import { Download, ShieldCheck, Sparkles } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { ProductFilters } from "@/components/products/ProductFilters";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Digital Products — Pay Once, Own Forever";
const DESCRIPTION =
  "Practical, no-fluff digital products to help you work faster and smarter. Instant download, fair prices, made by UtilityApps.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "digital products",
    "pay once own forever",
    "productivity templates",
    "instant download products",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/products`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

export default function ProductsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UtilityApps Digital Products",
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_CONFIG.url}/products/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ProductsHero />

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <AdSlot position="mid" />
      </div>

      <ProductFilters products={PRODUCTS} categories={PRODUCT_CATEGORIES} />
    </>
  );
}

function ProductsHero() {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-14 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          UtilityApps Store
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Digital Products by UtilityApps
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Practical, no-fluff digital products that help you work faster and smarter. Pay once,
          download instantly, keep it forever.
        </p>

        <ul className="mx-auto mt-7 grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <Stat Icon={Download} value="Instant" label="delivery" />
          <Stat Icon={ShieldCheck} value="Secure" label="checkout" />
          <Stat Icon={Sparkles} value="Yours" label="to keep" />
        </ul>
      </div>
    </section>
  );
}

function Stat({
  Icon,
  value,
  label,
}: {
  Icon: typeof Sparkles;
  value: string;
  label: string;
}) {
  return (
    <li className="rounded-2xl border border-surface-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
      <span className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
        <Icon className="h-4 w-4" />
        <span className="font-bold">{value}</span>
      </span>
      <span className="ml-2 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
    </li>
  );
}
