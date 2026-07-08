import { getOrCreateAnonId } from "./anon-id";

const RATE_LIMIT_KEY = "utilityapps:tool-track";
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

interface RateMap {
  [toolId: string]: number;
}

function readRateMap(): RateMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRateMap(map: RateMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function shouldTrack(toolId: string): boolean {
  const map = readRateMap();
  const last = map[toolId];
  if (typeof last !== "number") return true;
  return Date.now() - last >= RATE_LIMIT_MS;
}

function markTracked(toolId: string): void {
  const map = readRateMap();
  map[toolId] = Date.now();
  // Prune entries older than the rate window so the map can't grow unbounded.
  const cutoff = Date.now() - RATE_LIMIT_MS;
  for (const id of Object.keys(map)) {
    if (map[id] < cutoff) delete map[id];
  }
  writeRateMap(map);
}

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

/**
 * Tracks a tool-usage event from the client.
 *
 * - Hits `/api/tools/track` (which writes to Supabase).
 * - Rate-limited to one insert per tool per session per hour via localStorage.
 * - Best-effort: never throws, never blocks the caller.
 */
export async function trackToolUsageClient(
  toolId: string,
  options: { country?: string | null } = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!shouldTrack(toolId)) return;
  markTracked(toolId);

  try {
    await fetch("/api/tools/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolId,
        country: options.country ?? null,
        device: detectDevice(),
        session: getOrCreateAnonId(),
      }),
      keepalive: true,
    });
  } catch {
    // network errors are silent; tracking must never break UX
  }
}

// ---------------------------------------------------------- completions

const COMPLETION_RATE_LIMIT_KEY = "utilityapps:tool-complete";
/** Don't double-count completions if the user mashes a Download button
 *  five times in a row. Same idea as the visit limiter but tighter. */
const COMPLETION_RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

function shouldTrackCompletion(toolId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(COMPLETION_RATE_LIMIT_KEY);
    const map: RateMap =
      raw && typeof raw === "string" ? (JSON.parse(raw) as RateMap) : {};
    const last = map[toolId];
    if (typeof last === "number" && Date.now() - last < COMPLETION_RATE_LIMIT_MS) {
      return false;
    }
    map[toolId] = Date.now();
    // Prune past cutoff so the map can't grow unbounded.
    const cutoff = Date.now() - COMPLETION_RATE_LIMIT_MS;
    for (const k of Object.keys(map)) {
      if (map[k] < cutoff) delete map[k];
    }
    window.localStorage.setItem(COMPLETION_RATE_LIMIT_KEY, JSON.stringify(map));
    return true;
  } catch {
    return true;
  }
}

/**
 * Tracks a successful tool *completion* — fire from a tool component
 * AFTER it successfully delivers its primary output (download, copy,
 * link created, etc.).
 *
 * Rate-limited to one completion per tool per 5 minutes per browser
 * so impatient users hitting Download three times don't inflate the
 * completion count.
 *
 * Best-effort: never throws, never blocks the caller. Safe to fire-
 * and-forget; do NOT `await` if you're in a download click handler
 * (it adds latency to the UX).
 */
export async function trackToolCompletionClient(toolId: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!shouldTrackCompletion(toolId)) return;

  try {
    await fetch("/api/tools/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolId,
        session: getOrCreateAnonId(),
      }),
      keepalive: true,
    });
  } catch {
    // network errors are silent; tracking must never break UX
  }
}
