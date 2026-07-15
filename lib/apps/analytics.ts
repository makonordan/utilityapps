import { trackEvent } from "@/lib/gtag";
import type { AppEventType } from "@/lib/supabase";
import { detectDevice } from "@/lib/track";

/**
 * Client-side wiring for the Apps directory's anonymous analytics.
 * Anonymous, privacy-respecting: no login, no personal data, no IP storage
 * (country/device are resolved server-side/from the UA string, never an
 * IP address — see app/api/apps/*). Every function here is fire-and-forget
 * unless documented otherwise, and never throws.
 */

const VOTE_STORAGE_KEY = "utilityapps:app-vote";

type VoteMap = Record<string, "up" | "down">;

function readVoteMap(): VoteMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VOTE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeVoteMap(map: VoteMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

/** The vote already cast for this app on this device, or null. One vote per
 *  device, gently enforced — checked so we don't re-ask, never to block a
 *  determined user from clicking again. */
export function getExistingVote(appId: string): "up" | "down" | null {
  return readVoteMap()[appId] ?? null;
}

/** Records a helpful-vote locally so this device doesn't get asked again. */
export function markVoted(appId: string, vote: "up" | "down"): void {
  const map = readVoteMap();
  map[appId] = vote;
  writeVoteMap(map);
}

/** Fire-and-forget POST to /api/apps/track — covers every event type except
 *  affiliate_click, which has its own function + endpoint below. */
export function trackAppEvent(
  appId: string,
  eventType: Exclude<AppEventType, "affiliate_click">,
  metadata: Record<string, unknown> = {}
): void {
  trackEvent(`app_${eventType}`, { app_id: appId, ...metadata });
  if (typeof window === "undefined") return;
  fetch("/api/apps/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId, eventType, metadata, device: detectDevice() }),
    keepalive: true,
  }).catch(() => {
    // network errors are silent; tracking must never break UX
  });
}

/**
 * Fire-and-forget affiliate-click logger. Call this from the `onClick` of a
 * plain `<a href target="_blank">` — do NOT `preventDefault` or await this
 * before navigating. The anchor's native navigation is what actually opens
 * the tab; this just races the log request alongside it, which keeps the
 * click a direct, synchronous result of the user gesture (some browsers
 * block `window.open` calls that aren't).
 */
export function trackAffiliateClick(appId: string, url: string, source?: string): void {
  trackEvent("app_affiliate_click", { app_id: appId, url, source });
  if (typeof window === "undefined") return;
  fetch("/api/apps/affiliate-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId, url, source, device: detectDevice() }),
    keepalive: true,
  }).catch(() => {
    // network errors are silent; tracking must never break UX
  });
}

/** Fire-and-forget completed-search logger. Debounce at the call site (this
 *  fires immediately when called — it doesn't debounce itself) so only
 *  finished searches get logged, not every keystroke. Zero-result searches
 *  are demand we're not serving — flag them the same way server-side. */
export function logCompletedSearch(
  query: string,
  resultsCount: number,
  category?: string | null,
  clickedAppId?: string | null
): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  trackEvent("app_search", {
    query: trimmed,
    results_count: resultsCount,
    zero_results: resultsCount === 0,
    category: category ?? undefined,
  });
  if (typeof window === "undefined") return;
  fetch("/api/apps/search-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: trimmed,
      resultsCount,
      category: category ?? null,
      clickedAppId: clickedAppId ?? null,
    }),
    keepalive: true,
  }).catch(() => {
    // silent
  });
}

export interface AppSuggestionInput {
  suggestedName: string;
  suggestedUrl?: string;
  reason?: string;
  email?: string;
}

/** Submits a software suggestion. Unlike the helpers above, this is a real
 *  form submission — the caller should await it and surface the result. */
export async function submitAppSuggestion(
  input: AppSuggestionInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/apps/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
    if (!res.ok || body.success === false) {
      return { success: false, error: body.error ?? "Couldn't submit suggestion" };
    }
    trackEvent("app_suggestion_submitted", {});
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}
