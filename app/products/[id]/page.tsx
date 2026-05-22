import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  ChevronRight,
  Download,
  Info,
  ShieldCheck,
  Star,
  Tag,
} from "lucide-react";

import { BuyButton } from "@/components/products/BuyButton";
import { ProductCard } from "@/components/products/ProductCard";
import {
  PRODUCTS,
  getProductById,
  getRelatedProducts,
  isComingSoon,
  isOwnedProduct,
  platformLabel,
  type Product,
  type ProductReview,
} from "@/lib/products";
import { SITE_CONFIG, cn, formatDate, formatNumber } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };

  const title = `${product.name} — ${SITE_CONFIG.name} Store`;
  const description = product.longDescription;

  return {
    title,
    description,
    keywords: [...product.tags, product.category, "digital product", "instant download"],
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_CONFIG.url}/products/${product.id}`,
      siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export default async function ProductDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(product.id, 4);
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const owned = isOwnedProduct(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Organization", name: SITE_CONFIG.name },
    // Only emit rating/review markup once there are real reviews — empty
    // aggregateRating is invalid structured data.
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.toFixed(1),
            reviewCount: product.reviewCount,
          },
          review: product.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            datePublished: r.date,
            reviewBody: r.body,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: isComingSoon(product)
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      url: owned ? `${SITE_CONFIG.url}/products/${product.id}` : product.affiliateUrl,
      seller: {
        "@type": "Organization",
        name: owned ? SITE_CONFIG.name : platformLabel(product.platform),
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_CONFIG.url}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${SITE_CONFIG.url}/products?category=${encodeURIComponent(product.category)}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: `${SITE_CONFIG.url}/products/${product.id}` },
    ],
  };

  return (
    <>
      <Schema data={productJsonLd} />
      <Schema data={breadcrumbJsonLd} />

      <article className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <Breadcrumb product={product} />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ProductHero product={product} discount={discount} />
          <PurchasePanel product={product} discount={discount} />
        </div>

        <Section title="What's included">
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-2xl border border-surface-200 bg-white p-4 text-sm text-surface-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                {feature}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Description">
          <p className="text-base leading-relaxed text-surface-700 dark:text-surface-200">
            {product.longDescription}
          </p>
          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <Tag className="h-3.5 w-3.5 text-surface-400" aria-hidden="true" />
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-100 px-2 py-0.5 font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </Section>

        {product.reviewCount > 0 && <ReviewsSection product={product} />}

        <Section title="You might also like">
          {related.length === 0 ? (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Browse our full catalog for more digital products.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </Section>

        {owned ? (
          <p
            role="note"
            className="mt-12 flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 text-xs text-primary-900 dark:border-primary-700/40 dark:bg-primary-500/10 dark:text-primary-100"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              After payment is confirmed, your download link is emailed to you automatically.
              Payments are processed securely by Korapay.
            </span>
          </p>
        ) : (
          <p
            role="note"
            className="mt-12 flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 text-xs text-primary-900 dark:border-primary-700/40 dark:bg-primary-500/10 dark:text-primary-100"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Disclosure:</strong> The &quot;Buy on{" "}
              {platformLabel(product.platform)}&quot; link is an affiliate link. We may earn a
              commission when you purchase, at no extra cost to you.
            </span>
          </p>
        )}
      </article>
    </>
  );
}

function Schema({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function Breadcrumb({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li>
          <Link href="/products" className="hover:text-surface-700 dark:hover:text-surface-200">
            Products
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
          {product.category}
        </li>
      </ol>
    </nav>
  );
}

function ProductHero({ product, discount }: { product: Product; discount: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", product.image)} aria-hidden="true" />
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-semibold text-surface-800 shadow-sm backdrop-blur">
          {platformLabel(product.platform)}
        </span>
        {discount > 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-warning-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            Save {discount}%
          </span>
        )}
      </div>
    </div>
  );
}

function PurchasePanel({ product, discount }: { product: Product; discount: number }) {
  const owned = isOwnedProduct(product);
  const comingSoon = isComingSoon(product);
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        {product.category}
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
        {product.name}
      </h1>
      <p className="mt-3 text-base text-surface-600 dark:text-surface-300">{product.description}</p>

      {product.reviewCount > 0 ? (
        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 text-warning-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-warning-400" : "fill-transparent")}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-surface-700 dark:text-surface-200">
              {product.rating.toFixed(1)}
            </span>
          </span>
          <span className="text-surface-500 dark:text-surface-400">
            {formatNumber(product.reviewCount)} reviews · {formatNumber(product.salesCount)} sold
          </span>
        </div>
      ) : (
        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700 dark:bg-success-500/15 dark:text-success-300">
            New release
          </span>
        </div>
      )}

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-4xl font-bold text-surface-900 dark:text-white">${product.price}</span>
        {discount > 0 && (
          <>
            <span className="text-xl text-surface-400 line-through">${product.originalPrice}</span>
            <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-700 dark:bg-success-500/15 dark:text-success-300">
              Save ${product.originalPrice - product.price}
            </span>
          </>
        )}
      </div>

      {comingSoon && (
        <p className="mt-4 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
          This product launches soon — check back shortly.
        </p>
      )}

      <BuyButton product={product} variant="primary" className="mt-6 w-full sm:w-auto sm:self-start">
        {owned ? undefined : `Buy on ${platformLabel(product.platform)}`}
      </BuyButton>

      <ul className="mt-6 grid gap-2 text-sm text-surface-700 dark:text-surface-200 sm:grid-cols-2">
        <Trust Icon={Download}>
          {owned ? "Download link emailed instantly" : "Instant download after purchase"}
        </Trust>
        <Trust Icon={ShieldCheck}>
          {owned
            ? "Secure checkout via Korapay"
            : `Buyer protection on ${platformLabel(product.platform)}`}
        </Trust>
        {owned && product.fileFormat ? (
          <Trust Icon={Check}>Format: {product.fileFormat}</Trust>
        ) : (
          <Trust Icon={Check}>Free updates included</Trust>
        )}
        <Trust Icon={Check}>Personal &amp; commercial license</Trust>
      </ul>
    </div>
  );
}

function Trust({ Icon, children }: { Icon: typeof Check; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
      {children}
    </li>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 space-y-5">
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ReviewsSection({ product }: { product: Product }) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = product.reviews.filter((r) => Math.round(r.rating) === stars).length;
    const pct = product.reviews.length === 0 ? 0 : (count / product.reviews.length) * 100;
    return { stars, count, pct };
  });

  return (
    <Section title="Reviews">
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
          <p className="text-4xl font-bold text-surface-900 dark:text-white">
            {product.rating.toFixed(1)}
          </p>
          <span className="mt-1 inline-flex items-center gap-0.5 text-warning-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-warning-400" : "fill-transparent")}
                aria-hidden="true"
              />
            ))}
          </span>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {formatNumber(product.reviewCount)} verified reviews
          </p>
          <ul className="mt-4 space-y-1.5 text-xs">
            {distribution.map(({ stars, pct }) => (
              <li key={stars} className="flex items-center gap-2">
                <span className="w-6 text-surface-500 dark:text-surface-400">{stars}★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                  <span
                    className="block h-full rounded-full bg-warning-400"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-10 text-right text-surface-500 dark:text-surface-400">
                  {Math.round(pct)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-4">
          {product.reviews.map((review) => (
            <li
              key={`${review.author}-${review.date}`}
              className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
            >
              <ReviewRow review={review} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function ReviewRow({ review }: { review: ProductReview }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white">
            {review.author.charAt(0)}
          </span>
          <span className="text-sm font-semibold text-surface-900 dark:text-white">
            {review.author}
          </span>
        </div>
        <time
          dateTime={review.date}
          className="text-xs text-surface-500 dark:text-surface-400"
        >
          {formatDate(review.date)}
        </time>
      </div>
      <span className="mt-2 inline-flex items-center gap-0.5 text-warning-500" aria-label={`${review.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("h-3.5 w-3.5", i < review.rating ? "fill-warning-400" : "fill-transparent")}
            aria-hidden="true"
          />
        ))}
      </span>
      <p className="mt-2 text-sm text-surface-700 dark:text-surface-200">{review.body}</p>
    </div>
  );
}
