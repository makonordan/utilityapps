"use client";

import { useEffect } from "react";

import type { BcScanType } from "@/lib/businessCard/types";

/**
 * Fire-and-forget analytics ping when a public card page mounts.
 * Reads `?src=qr` from the URL — that's how the QR-code URLs are
 * marked distinct from a direct link visit.
 *
 * Also wires up delegated click tracking for tap-to-open contact rows
 * that carry `data-scan-type` attributes (see CardView).
 */
export function PageTracker({
  cardId,
  defaultType = "link_visit",
}: {
  cardId: string;
  defaultType?: BcScanType;
}) {
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const isQr = sp.get("src") === "qr";
    const scanType: BcScanType = isQr ? "qr_scan" : defaultType;
    const referrer = document.referrer || null;
    try {
      const blob = new Blob([JSON.stringify({ scan_type: scanType, referrer })], {
        type: "application/json",
      });
      navigator.sendBeacon?.(`/api/business-card/analytics/${cardId}`, blob) ||
        fetch(`/api/business-card/analytics/${cardId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scan_type: scanType, referrer }),
          keepalive: true,
        }).catch(() => undefined);
    } catch {
      /* best-effort */
    }

    // Delegated click tracking on any element carrying data-scan-type.
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest("[data-scan-type]");
      if (!target) return;
      const type = target.getAttribute("data-scan-type") as BcScanType | null;
      if (!type) return;
      try {
        navigator.sendBeacon?.(
          `/api/business-card/analytics/${cardId}`,
          new Blob([JSON.stringify({ scan_type: type, referrer })], {
            type: "application/json",
          })
        );
      } catch {
        /* best-effort */
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [cardId, defaultType]);

  return null;
}
