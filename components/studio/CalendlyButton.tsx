"use client";

import { useCallback, useEffect, useRef } from "react";

import { STUDIO_CALENDLY_URL, calendlyLinkFor } from "@/lib/studio";
import { cn } from "@/lib/utils";

interface Props {
  /** Optional topic forwarded to Calendly as the first answer (a1=). */
  topic?: string;
  children: React.ReactNode;
  className?: string;
  /** Used by analytics middleware to identify which CTA was clicked. */
  analyticsId?: string;
  /** When true, render as an `<a>` opening Calendly in a new tab — safer
   *  for SEO crawlers and users with strict popup blockers. */
  newTabOnly?: boolean;
  ariaLabel?: string;
}

/**
 * Launches Calendly's popup widget for the configured discovery-call URL.
 *
 * Loads Calendly's widget script lazily (only when this button is clicked
 * the first time) so visitors who don't engage never pay the bytes. Falls
 * back to opening Calendly in a new tab if the script fails to load.
 *
 * Emits a `studio_calendly_opened` event via `window.gtag` when GA is
 * present — caller only needs to pass `analyticsId` for funnel tracking.
 */
export function CalendlyButton({
  topic,
  children,
  className,
  analyticsId,
  newTabOnly,
  ariaLabel,
}: Props) {
  const url = calendlyLinkFor(topic);
  const scriptLoaded = useRef(false);

  // Inject Calendly widget CSS once globally so the modal looks right.
  useEffect(() => {
    if (newTabOnly) return;
    if (typeof document === "undefined") return;
    if (document.querySelector('link[data-calendly-css="1"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.dataset.calendlyCss = "1";
    document.head.appendChild(link);
  }, [newTabOnly]);

  const openPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    track(analyticsId);

    const calendly = (window as unknown as {
      Calendly?: { initPopupWidget: (opts: { url: string }) => void };
    }).Calendly;

    if (calendly && calendly.initPopupWidget) {
      calendly.initPopupWidget({ url });
      return;
    }

    // First click — load the widget script then open.
    if (!scriptLoaded.current) {
      scriptLoaded.current = true;
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      s.onload = () => {
        const c = (window as unknown as {
          Calendly?: { initPopupWidget: (opts: { url: string }) => void };
        }).Calendly;
        if (c && c.initPopupWidget) c.initPopupWidget({ url });
        else window.open(url, "_blank", "noopener,noreferrer");
      };
      s.onerror = () => window.open(url, "_blank", "noopener,noreferrer");
      document.head.appendChild(s);
    } else {
      // Script loaded but Calendly object not ready yet (rare) → new tab fallback.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [url, analyticsId]);

  if (newTabOnly) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
        onClick={() => track(analyticsId)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={openPopup}
      className={cn(className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function track(analyticsId: string | undefined) {
  if (!analyticsId) return;
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "studio_calendly_opened", { source: analyticsId });
  }
}

/** Plain link used when we want a styled CTA that's always a real link
 *  (e.g. in the contact fallback page). Keeps SEO crawlers + popup
 *  blockers happy. */
export function CalendlyLink({
  topic,
  children,
  className,
  analyticsId,
}: {
  topic?: string;
  children: React.ReactNode;
  className?: string;
  analyticsId?: string;
}) {
  return (
    <CalendlyButton
      topic={topic}
      analyticsId={analyticsId}
      className={className}
      newTabOnly
    >
      {children}
    </CalendlyButton>
  );
}

export function getCalendlyUrl(): string {
  return STUDIO_CALENDLY_URL;
}
