"use client";

import { useEffect } from "react";

import { trackAppEvent } from "@/lib/apps/analytics";

/**
 * Side-effect-only component. Mount on an app listing page (`listing_view`)
 * or a comparison page (`compare_view`, `appId` being the comparison slug)
 * to fire the view event once per page load. Renders nothing.
 */
export function TrackAppView({
  appId,
  eventType,
}: {
  appId: string;
  eventType: "listing_view" | "compare_view";
}) {
  useEffect(() => {
    trackAppEvent(appId, eventType);
  }, [appId, eventType]);
  return null;
}
