"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Pre-render placeholder shown until the section enters the viewport. */
  fallback?: ReactNode;
  /** IntersectionObserver threshold (0–1). Default 0.1. */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default "200px" so we render just before scroll-in. */
  rootMargin?: string;
  /** Once visible, stay rendered. Default true. */
  once?: boolean;
  /** Optional className for the wrapping span. */
  className?: string;
  /** Optional minimum height while invisible to prevent CLS (e.g. "400px"). */
  minHeight?: string;
}

/**
 * IntersectionObserver-based lazy mounter.
 *
 * Wraps any component and only mounts it when the wrapper scrolls within
 * `rootMargin` of the viewport. Use for YouTube embeds, ad slots, large
 * carousels, and any below-the-fold work that's expensive to render.
 *
 * Falls back to "always render" on the server and on browsers without
 * IntersectionObserver, so SSR output and SEO are never blocked.
 */
export function LazyLoad({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "200px",
  once = true,
  className,
  minHeight,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Browser fallback: just render eagerly. One-time check, no cascade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {visible ? children : fallback ?? null}
    </div>
  );
}
