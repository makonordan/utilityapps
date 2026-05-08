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
