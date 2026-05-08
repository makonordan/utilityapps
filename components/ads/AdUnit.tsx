"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type AdFormat = "horizontal" | "rectangle" | "vertical" | "fluid";

interface Props {
  /** AdSense slot ID (data-ad-slot). */
  slot: string;
  format?: AdFormat;
  /** Optional layoutKey for in-article (fluid) ads. */
  layoutKey?: string;
  className?: string;
}

const FORMAT_MIN_HEIGHT: Record<AdFormat, number> = {
  horizontal: 90,
  rectangle: 250,
  vertical: 600,
  fluid: 250,
};

/**
 * A single AdSense ad slot.
 *
 * Behavior:
 *   - Outside production OR with no `NEXT_PUBLIC_ADSENSE_ID`, renders a
 *     dashed gray placeholder labeled with the slot ID. Lets you see ad
 *     positioning during development without loading any third-party JS.
 *   - In production, renders the standard <ins class="adsbygoogle"> tag and
 *     calls `adsbygoogle.push({})` only when the unit enters the viewport
 *     (200px rootMargin). This prevents off-screen ads from initializing,
 *     which is the biggest single Core-Web-Vitals win for ad-funded sites.
 *   - Reserves `min-height` per format so the ad slot never shifts layout
 *     once the network response paints.
 */
export function AdUnit({ slot, format = "horizontal", layoutKey, className }: Props) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isProd = process.env.NODE_ENV === "production";
  const enabled = isProd && !!publisherId;
  const ref = useRef<HTMLDivElement | null>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (!enabled || pushed) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          try {
            (window.adsbygoogle = window.adsbygoogle ?? []).push({});
          } catch (err) {
            console.warn("[AdUnit] adsbygoogle.push failed", err);
          }
          setPushed(true);
          observer.disconnect();
          break;
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, pushed, slot]);

  if (!enabled) {
    return (
      <div
        className={cn(
          "ad-slot ad-placeholder flex w-full items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-surface-50 text-[11px] uppercase tracking-wider text-surface-400 dark:border-surface-800 dark:bg-surface-900/40 dark:text-surface-600",
          className
        )}
        style={{ minHeight: FORMAT_MIN_HEIGHT[format] }}
        data-ad-slot={slot}
        data-ad-format={format}
        aria-label="Advertisement placeholder"
      >
        <span>
          Ad slot · <code className="font-mono not-italic">{slot}</code> · {format}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("ad-slot relative w-full overflow-hidden", className)}
      style={{ minHeight: FORMAT_MIN_HEIGHT[format] }}
      data-ad-slot={slot}
      data-ad-format={format}
      aria-label="Advertisement"
    >
      {/* eslint-disable-next-line jsx-a11y/aria-role */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
