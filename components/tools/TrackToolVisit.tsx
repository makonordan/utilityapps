"use client";

import { useEffect } from "react";

import { recordToolUse } from "@/lib/recent";
import { trackToolUsageClient } from "@/lib/track";

/**
 * Side-effect-only component. Mount on a tool page to:
 *   1. push the tool into the user's "recently used" list (localStorage)
 *   2. fire a rate-limited tool-usage event to /api/tools/track
 *
 * Renders nothing.
 */
export function TrackToolVisit({ toolId }: { toolId: string }) {
  useEffect(() => {
    recordToolUse(toolId);
    void trackToolUsageClient(toolId);
  }, [toolId]);
  return null;
}
