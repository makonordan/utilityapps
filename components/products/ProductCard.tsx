import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { BuyButton } from "@/components/products/BuyButton";
import { platformLabel, type Product } from "@/lib/products";
import { cn, formatNumber } from "@/lib/utils";

function discountPercent(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const discount = discountPercent(product.price, product.originalPrice);
  const badge = product.bestseller
    ? { label: "Bestseller", tone: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300" }
    : product.new
      ? { label: "New", tone: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300" }
      : null;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900",
        className
      )}
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={product.name}
        className="relative block aspect-[5/3] w-full overflow-hidden"
      >
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 bg-gradient-to-br", product.image)}
        />
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-surface-800 shadow-sm backdrop-blur">
          {platformLabel(product.platform)}
        </span>
        {badge && (
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm",
              badge.tone
            )}
          >
            {badge.label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-sm font-semibold leading-snug text-surface-900 dark:text-white">
          <Link href={`/products/${product.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-3 text-xs text-surface-600 dark:text-surface-400">
          {product.description}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-surface-900 dark:text-white">${product.price}</span>
              {discount > 0 && (
                <span className="text-xs text-surface-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-[11px] font-semibold text-success-600 dark:text-success-400">
                Save {discount}%
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-surface-600 dark:text-surface-300">
            <Star className="h-3.5 w-3.5 fill-warning-400 text-warning-400" aria-hidden="true" />
            {product.rating.toFixed(1)}
            <span className="text-surface-400">({formatNumber(product.reviewCount)})</span>
          </span>
        </div>

        <BuyButton product={product} className="mt-4 w-full" />
      </div>
    </article>
  );
}

export function FeaturedProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900">
      <Link
        href={`/products/${product.id}`}
        aria-label={product.name}
        className="relative block aspect-[16/9] w-full overflow-hidden"
      >
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 bg-gradient-to-br", product.image)}
        />
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
          priority
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-semibold text-surface-800 shadow-sm backdrop-blur">
          {platformLabel(product.platform)}
        </span>
        {discount > 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-warning-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            Save {discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          {product.category} · Bestseller
        </span>
        <h3 className="mt-1 text-xl font-bold tracking-tight text-surface-900 dark:text-white">
          <Link href={`/products/${product.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-surface-600 dark:text-surface-300">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-surface-900 dark:text-white">${product.price}</span>
          {discount > 0 && (
            <span className="text-sm text-surface-400 line-through">${product.originalPrice}</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-surface-600 dark:text-surface-300">
            <Star className="h-3.5 w-3.5 fill-warning-400 text-warning-400" aria-hidden="true" />
            {product.rating.toFixed(1)}
            <span className="text-surface-400">({formatNumber(product.reviewCount)})</span>
          </span>
        </div>

        <BuyButton product={product} variant="primary" className="mt-5 w-full">
          Get Instant Access
        </BuyButton>
      </div>
    </article>
  );
}
