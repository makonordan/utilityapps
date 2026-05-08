import type { Tool } from "./tools";

export interface Article {
  slug: string;
  title: string;
  description: string;
  url: string;
  readingTimeMinutes: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  href: string;
  image?: string;
}

export interface SearchSuggestion {
  intent: string;
  primaryTool: Tool | null;
  suggestedTools: Tool[];
  suggestedArticles: Article[];
  suggestedProducts: Product[];
}

export const EMPTY_SUGGESTION: SearchSuggestion = {
  intent: "",
  primaryTool: null,
  suggestedTools: [],
  suggestedArticles: [],
  suggestedProducts: [],
};

export const RECENT_SEARCHES_KEY = "utilityapps:recent-searches";
export const RECENT_SEARCHES_MAX = 5;

export function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): string[] {
  if (typeof window === "undefined") return [];
  const trimmed = query.trim();
  if (!trimmed) return loadRecentSearches();
  const current = loadRecentSearches();
  const next = [trimmed, ...current.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    RECENT_SEARCHES_MAX
  );
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // ignore
  }
}
