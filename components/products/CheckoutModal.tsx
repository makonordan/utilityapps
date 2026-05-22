"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, X } from "lucide-react";

import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
}

/**
 * Collects the buyer's email, then starts a Korapay checkout. The email is
 * where the download link is delivered, so it is required before redirect.
 */
export function CheckoutModal({ product, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: email.trim() }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok || !json.checkoutUrl) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      // Hand off to Korapay's hosted checkout.
      window.location.href = json.checkoutUrl;
    } catch {
      setError("Network error — please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-surface-950/50 p-4 backdrop-blur-sm"
      onClick={() => !loading && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="checkout-title"
              className="text-lg font-bold tracking-tight text-surface-900 dark:text-white"
            >
              Checkout
            </h2>
            <p className="mt-0.5 text-sm text-surface-600 dark:text-surface-300">
              {product.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition hover:bg-surface-100 disabled:opacity-50 dark:text-surface-400 dark:hover:bg-surface-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-baseline justify-between rounded-xl bg-surface-50 px-4 py-3 dark:bg-surface-800/60">
          <span className="text-sm text-surface-600 dark:text-surface-300">Total</span>
          <span className="text-2xl font-bold text-surface-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="checkout-email"
            className="block text-sm font-medium text-surface-800 dark:text-surface-200"
          >
            Email address
          </label>
          <input
            id="checkout-email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-surface-700 dark:bg-surface-950 dark:text-white"
          />
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            Your download link is emailed here right after payment.
          </p>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting checkout…
              </>
            ) : (
              <>Pay ${product.price.toFixed(2)}</>
            )}
          </button>
        </form>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <Lock className="h-3 w-3" />
          Secure payment via Korapay
        </p>
      </div>
    </div>
  );
}
