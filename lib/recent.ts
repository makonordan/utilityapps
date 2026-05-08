const STORAGE_KEY = "utilityapps:recent-tools";
const MAX_RECENT = 5;
const CHANGE_EVENT = "utilityapps:recent-changed";

export interface RecentEntry {
  toolId: string;
  ts: number;
}

export function getRecentTools(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RecentEntry =>
        x && typeof x === "object" && typeof x.toolId === "string" && typeof x.ts === "number"
    );
  } catch {
    return [];
  }
}

export function recordToolUse(toolId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentTools().filter((e) => e.toolId !== toolId);
    const next: RecentEntry[] = [{ toolId, ts: Date.now() }, ...current].slice(0, MAX_RECENT);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function clearRecentTools(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function subscribeRecentTools(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener(CHANGE_EVENT, handler);
  // Cross-tab sync
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
