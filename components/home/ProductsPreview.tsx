import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { FEATURED_PRODUCTS } from "@/lib/products";
import { cn, formatNumber } from "@/lib/utils";

export function ProductsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Premium Digital Products
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Hand-built bundles that pay for themselves the first time you use them. Earn while you sleep.
          </p>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          Browse all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_PRODUCTS.map((product) => {
          const badge = product.bestseller ? "Best Seller" : product.new ? "New" : null;
          return (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
              >
                <div className={cn("relative h-36 w-full bg-gradient-to-br", product.image)} aria-hidden="true">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                  {badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                      {badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold leading-snug text-surface-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-xs text-surface-600 dark:text-surface-400">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-surface-900 dark:text-white">
                      ${product.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-surface-600 dark:text-surface-300">
                      <Star className="h-3.5 w-3.5 fill-warning-400 text-warning-400" />
                      {product.rating.toFixed(1)}
                      <span className="text-surface-400">({formatNumber(product.reviewCount)})</span>
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400">
                    View Product
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
