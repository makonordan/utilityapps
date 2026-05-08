import type { Metadata } from "next";
import { Download, Info, Sparkles, Users } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { FeaturedProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  getBestsellerProducts,
} from "@/lib/products";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = `Digital Products for Creators — ${SITE_CONFIG.name} Store`;
const DESCRIPTION =
  "Curated digital resources to grow your business, boost productivity, and save time. Instant download, fair prices, real creators.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  const featured = getBestsellerProducts(3);

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
      <AffiliateDisclosure />

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              Bestsellers
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Featured products
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Top-selling bundles right now — built by people who use them.
            </p>
          </header>
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.map((p) => (
              <FeaturedProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
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
          Premium Digital Products for Creators
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Curated digital resources to grow your business, boost productivity, and save time.
          Hand-picked from creators we use ourselves.
        </p>

        <ul className="mx-auto mt-7 grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <Stat Icon={Sparkles} value="50+" label="products" />
          <Stat Icon={Download} value="Instant" label="download" />
          <Stat Icon={Users} value="Trusted" label="creators" />
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

function AffiliateDisclosure() {
  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
      <p
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 text-sm text-primary-900 dark:border-primary-700/40 dark:bg-primary-500/10 dark:text-primary-100"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Disclosure:</strong> Some links on this page are
          affiliate links. We may earn a commission when you purchase through our links, at no extra
          cost to you. Every product is hand-picked — we never recommend something we wouldn&apos;t
          use ourselves.
        </span>
      </p>
    </div>
  );
}
