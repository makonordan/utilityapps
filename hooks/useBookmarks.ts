"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getOrCreateAnonId } from "@/lib/anon-id";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";

const STORAGE_KEY = "utilityapps:bookmarks";
const CHANGE_EVENT = "utilityapps:bookmarks-changed";

// Module-level state shared across all hook instances. The store pattern keeps
// every <BookmarkButton/> in sync without each one polling localStorage.
let bookmarks: Set<string> = new Set();
let initialized = false;
let serverSyncStarted = false;
const subscribers = new Set<() => void>();

function loadFromLocal(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        bookmarks = new Set(parsed.filter((x): x is string => typeof x === "string"));
      }
    }
  } catch {
    // ignore
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
  } catch {
    // ignore
  }
}

function emit(): void {
  for (const fn of subscribers) fn();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

function setBookmarks(next: Set<string>): void {
  bookmarks = next;
  persist();
  emit();
}

async function syncFromServerOnce(): Promise<void> {
  if (serverSyncStarted || typeof window === "undefined") return;
  serverSyncStarted = true;
  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) return;
    const id = getOrCreateAnonId();
    const res = await queries.getUserBookmarks(id);
    if (!res.data) return;
    const remote = new Set(res.data.map((b) => b.tool_id));
    if (remote.size === 0 && bookmarks.size === 0) return;
    // Merge local + remote so a user who bookmarked offline doesn't lose data.
    const merged = new Set<string>([...bookmarks, ...remote]);
    if (merged.size !== bookmarks.size) {
      setBookmarks(merged);
    }
  } catch {
    // Supabase unavailable — local-only mode
  }
}

function subscribe(listener: () => void): () => void {
  loadFromLocal();
  subscribers.add(listener);
  // Cross-tab sync: another tab editing localStorage triggers re-read.
  const storageHandler = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const parsed = e.newValue ? JSON.parse(e.newValue) : [];
      if (Array.isArray(parsed)) {
        bookmarks = new Set(parsed.filter((x: unknown): x is string => typeof x === "string"));
      } else {
        bookmarks = new Set();
      }
    } catch {
      bookmarks = new Set();
    }
    for (const fn of subscribers) fn();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", storageHandler);
    void syncFromServerOnce();
  }
  return () => {
    subscribers.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", storageHandler);
    }
  };
}

const EMPTY: Set<string> = new Set();
function getSnapshot(): Set<string> {
  return bookmarks;
}
function getServerSnapshot(): Set<string> {
  return EMPTY;
}

async function syncAddToServer(toolId: string): Promise<void> {
  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) return;
    await queries.addBookmark(getOrCreateAnonId(), toolId);
  } catch {
    // local-only mode
  }
}

async function syncRemoveFromServer(toolId: string): Promise<void> {
  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) return;
    await queries.removeBookmark(getOrCreateAnonId(), toolId);
  } catch {
    // local-only mode
  }
}

export interface UseBookmarksApi {
  bookmarks: Tool[];
  ids: Set<string>;
  isBookmarked: (toolId: string) => boolean;
  addBookmark: (toolId: string) => void;
  removeBookmark: (toolId: string) => void;
  toggleBookmark: (toolId: string) => boolean;
  /** Returns the current list at call time (matches the spec's `getBookmarks`). */
  getBookmarks: () => Tool[];
  clear: () => void;
}

export function useBookmarks(): UseBookmarksApi {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const bookmarkedTools = useMemo<Tool[]>(() => {
    const out: Tool[] = [];
    for (const id of ids) {
      const tool = TOOLS_BY_ID[id];
      if (tool) out.push(tool);
    }
    return out;
  }, [ids]);

  const isBookmarked = useCallback((toolId: string) => ids.has(toolId), [ids]);

  const addBookmark = useCallback((toolId: string) => {
    if (bookmarks.has(toolId)) return;
    setBookmarks(new Set([...bookmarks, toolId]));
    void syncAddToServer(toolId);
  }, []);

  const removeBookmark = useCallback((toolId: string) => {
    if (!bookmarks.has(toolId)) return;
    const next = new Set(bookmarks);
    next.delete(toolId);
    setBookmarks(next);
    void syncRemoveFromServer(toolId);
  }, []);

  const toggleBookmark = useCallback((toolId: string) => {
    const next = !bookmarks.has(toolId);
    if (next) addBookmark(toolId);
    else removeBookmark(toolId);
    return next;
  }, [addBookmark, removeBookmark]);

  const getBookmarks = useCallback(() => {
    const out: Tool[] = [];
    for (const id of bookmarks) {
      const tool = TOOLS_BY_ID[id];
      if (tool) out.push(tool);
    }
    return out;
  }, []);

  const clear = useCallback(() => {
    setBookmarks(new Set());
  }, []);

  return {
    bookmarks: bookmarkedTools,
    ids,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    getBookmarks,
    clear,
  };
}
