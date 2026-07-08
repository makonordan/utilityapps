"use client";

import { useState } from "react";
import { ArrowUpRight, Clock, ShoppingCart } from "lucide-react";

import { CheckoutModal } from "@/components/products/CheckoutModal";
import { trackAffiliateClick } from "@/lib/affiliate";
import { isComingSoon, isOwnedProduct, platformLabel, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  variant?: "compact" | "full" | "primary";
  className?: string;
  children?: React.ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition";

function styleFor(variant: "compact" | "full" | "primary"): string {
  return variant === "primary"
    ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow hover:from-primary-600 hover:to-accent-600 px-5 py-3 text-sm"
    : variant === "full"
      ? "bg-primary-500 text-white hover:bg-primary-600 px-5 py-3 text-sm"
      : "bg-surface-900 text-white hover:bg-surface-700 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-100 px-3 py-2 text-xs";
}

export function BuyButton({ product, variant = "compact", className, children }: Props) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // --- Owned product: on-site Korapay checkout -----------------------------
  if (isOwnedProduct(product)) {
    if (isComingSoon(product)) {
      return (
        <button
          type="button"
          disabled
          className={cn(BASE, styleFor(variant), "cursor-not-allowed opacity-60", className)}
        >
          <Clock className="h-4 w-4" />
          <span>Coming soon</span>
        </button>
      );
    }
    return (
      <>
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          data-product-id={product.id}
          className={cn(BASE, styleFor(variant), className)}
        >
          {variant === "primary" ? <ShoppingCart className="h-4 w-4" /> : null}
          <span>{children ?? `Buy now — $${product.price.toFixed(2)}`}</span>
        </button>
        {checkoutOpen && (
          <CheckoutModal product={product} onClose={() => setCheckoutOpen(false)} />
        )}
      </>
    );
  }

  // --- Affiliate product: external buy link --------------------------------
  const label =
    children ??
    (variant === "primary"
      ? "Get Instant Access"
      : variant === "full"
        ? `Buy on ${platformLabel(product.platform)}`
        : "Buy Now");

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => void trackAffiliateClick(product.id)}
      data-product-id={product.id}
      data-platform={product.platform}
      className={cn(BASE, styleFor(variant), className)}
    >
      {variant === "primary" ? <ShoppingCart className="h-4 w-4" /> : null}
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}
