"use client";

import { ArrowUpRight, ShoppingCart } from "lucide-react";

import { trackAffiliateClick } from "@/lib/affiliate";
import { platformLabel, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  variant?: "compact" | "full" | "primary";
  className?: string;
  children?: React.ReactNode;
}

export function BuyButton({ product, variant = "compact", className, children }: Props) {
  function handleClick() {
    // Fire-and-forget — never block the navigation.
    void trackAffiliateClick(product.id);
  }

  const label =
    children ??
    (variant === "primary"
      ? "Get Instant Access"
      : variant === "full"
        ? `Buy on ${platformLabel(product.platform)}`
        : "Buy Now");

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow hover:from-primary-600 hover:to-accent-600 px-5 py-3 text-sm"
      : variant === "full"
        ? "bg-primary-500 text-white hover:bg-primary-600 px-5 py-3 text-sm"
        : "bg-surface-900 text-white hover:bg-surface-700 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-100 px-3 py-2 text-xs";

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      data-product-id={product.id}
      data-platform={product.platform}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition",
        styles,
        className
      )}
    >
      {variant === "primary" ? (
        <ShoppingCart className="h-4 w-4" />
      ) : null}
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

