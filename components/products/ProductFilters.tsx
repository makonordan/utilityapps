"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "newest" | "price-asc" | "price-desc";

interface PriceRange {
  label: string;
  test: (price: number) => boolean;
}

const PRICE_RANGES: PriceRange[] = [
  { label: "Any price", test: () => true },
  { label: "Under $20", test: (p) => p < 20 },
  { label: "$20 – $40", test: (p) => p >= 20 && p <= 40 },
  { label: "$40 +", test: (p) => p > 40 },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "newest", label: "Newest first" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

interface Props {
  products: Product[];
  categories: string[];
}

export function ProductFilters({ products, categories }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("popular");

  const visible = useMemo(() => {
    const range = PRICE_RANGES[priceRangeIndex];
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!range.test(p.price)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "popular":
          return b.salesCount - a.salesCount;
        case "newest":
          return Number(b.new) - Number(a.new) || b.salesCount - a.salesCount;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
      }
    });

    return list;
  }, [products, category, priceRangeIndex, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          <CategoryChip
            active={category === null}
            onClick={() => setCategory(null)}
            label={`All (${products.length})`}
          />
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c).length;
            return (
              <CategoryChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                label={`${c} (${count})`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Price
            </span>
            <select
              value={priceRangeIndex}
              onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
              className="rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
            >
              {PRICE_RANGES.map((range, i) => (
                <option key={range.label} value={i}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-surface-200 p-10 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
          No products match those filters. Try a different category or price range.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary-500 bg-primary-500 text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
      )}
    >
      {label}
    </button>
  );
}
