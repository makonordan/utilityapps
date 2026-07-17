"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Fuse, { type FuseResult } from "fuse.js";
import {
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Mic,
  MicOff,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import { searchApps, type AppListing } from "@/lib/apps";
import {
  EMPTY_SUGGESTION,
  clearRecentSearches,
  loadRecentSearches,
  saveRecentSearch,
  type Article,
  type Product,
  type SearchSuggestion,
} from "@/lib/search";
import { TOOLS, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.3,
  keys: [
    { name: "name", weight: 0.4 },
    { name: "keywords", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "category", weight: 0.1 },
  ],
};

const AI_DEBOUNCE_MS = 600;
const MIN_QUERY_FOR_AI = 4;

interface TrendingItem {
  query: string;
  searchCount: number;
}

type FlatItem =
  | { kind: "tool"; href: string; key: string; label: string }
  | { kind: "app"; href: string; key: string; label: string }
  | { kind: "article"; href: string; key: string; label: string }
  | { kind: "product"; href: string; key: string; label: string };

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [suggestion, setSuggestion] = useState<SearchSuggestion>(EMPTY_SUGGESTION);
  const [aiLoading, setAiLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<unknown>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fuse = useMemo(() => new Fuse(TOOLS, FUSE_OPTIONS), []);

  const fuseResults = useMemo(() => {
    if (!query.trim()) return [] as FuseResult<Tool>[];
    return fuse.search(query.trim()).slice(0, 8);
  }, [fuse, query]);

  const appResults: AppListing[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchApps(query.trim()).slice(0, 5);
  }, [query]);

  // ⌘K + custom event triggers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdK = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isCmdK) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
    }
    function onOpenEvent(e: Event) {
      const detail = (e as CustomEvent<{ query?: string }>).detail;
      setOpen(true);
      if (detail?.query) setQuery(detail.query);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search-modal", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search-modal", onOpenEvent);
    };
  }, [open]);

  // Body scroll lock + autofocus
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = original;
      clearTimeout(t);
    };
  }, [open]);

  // Load recents + voice support detection on mount. Both reads are
  // browser-only and fire exactly once.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setRecents(loadRecentSearches());
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    setVoiceSupported(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Lazy-load trending searches when the modal first opens
  useEffect(() => {
    if (!open || trending.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@/lib/db/queries");
        const res = await mod.getTrendingSearches(8);
        if (!cancelled && res.data) {
          setTrending(res.data);
        }
      } catch {
        // Supabase may not be configured yet — silently skip.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, trending.length]);

  // AI suggestion debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    aiAbortRef.current?.abort();

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_FOR_AI) {
      // Reset on short query — fires only when query changes, not in a loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestion(EMPTY_SUGGESTION);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAiLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      aiAbortRef.current = ctrl;
      setAiLoading(true);
      try {
        const res = await fetch("/api/search/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed }),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as SearchSuggestion;
        if (!ctrl.signal.aborted) setSuggestion(data);
      } catch (err) {
        if ((err as { name?: string }).name !== "AbortError") {
          setSuggestion(EMPTY_SUGGESTION);
        }
      } finally {
        if (!ctrl.signal.aborted) setAiLoading(false);
      }
    }, AI_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Build the displayed result sets
  const bestMatchTool: Tool | null =
    suggestion.primaryTool ?? fuseResults[0]?.item ?? null;

  const toolResults: Tool[] = useMemo(() => {
    if (suggestion.suggestedTools.length > 0) {
      const filtered = suggestion.suggestedTools.filter((t) => t.id !== bestMatchTool?.id);
      return filtered.slice(0, 5);
    }
    return fuseResults
      .map((r) => r.item)
      .filter((t) => t.id !== bestMatchTool?.id)
      .slice(0, 5);
  }, [suggestion.suggestedTools, fuseResults, bestMatchTool]);

  const articleResults = suggestion.suggestedArticles.slice(0, 3);
  const productResults = suggestion.suggestedProducts.slice(0, 2);

  const aiPowered = suggestion.suggestedTools.length > 0 || !!suggestion.primaryTool;

  // Flat keyboard-nav list
  const flat: FlatItem[] = useMemo(() => {
    const out: FlatItem[] = [];
    if (bestMatchTool) {
      out.push({ kind: "tool", key: `best-${bestMatchTool.id}`, href: bestMatchTool.href, label: bestMatchTool.name });
    }
    for (const t of toolResults) {
      out.push({ kind: "tool", key: `tool-${t.id}`, href: t.href, label: t.name });
    }
    for (const app of appResults) {
      out.push({ kind: "app", key: `app-${app.id}`, href: `/apps/${app.id}`, label: app.name });
    }
    for (const a of articleResults) {
      out.push({ kind: "article", key: `article-${a.slug}`, href: a.url, label: a.title });
    }
    for (const p of productResults) {
      out.push({ kind: "product", key: `product-${p.id}`, href: p.href, label: p.name });
    }
    return out;
  }, [bestMatchTool, toolResults, appResults, articleResults, productResults]);

  useEffect(() => {
    // Reset cursor when the result list changes shape.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query, flat.length]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSuggestion(EMPTY_SUGGESTION);
  }, []);

  const submit = useCallback(
    (item?: FlatItem) => {
      const target = item ?? flat[selectedIndex];
      if (!target) return;
      saveRecentSearch(query);
      router.push(target.href);
      close();
    },
    [flat, selectedIndex, query, router, close]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  function startVoice() {
    const w = window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor() as {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    };
    rec.lang = navigator.language || "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) setQuery(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  function stopVoice() {
    const rec = recognitionRef.current as { stop?: () => void } | null;
    rec?.stop?.();
    setListening(false);
  }

  // Index map so list items know their flat index for highlight + click
  const indexByKey = useMemo(() => {
    const m = new Map<string, number>();
    flat.forEach((item, i) => m.set(item.key, i));
    return m;
  }, [flat]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-surface-950/60 px-3 pt-[10vh] backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Search UtilityApps"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
          >
            <div className="flex items-center gap-3 border-b border-surface-200 px-4 py-3 dark:border-surface-800">
              <Search className="h-5 w-5 shrink-0 text-surface-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, apps, articles, and products..."
                aria-label="Search"
                className="flex-1 bg-transparent text-base text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-white"
              />
              {aiLoading && (
                <span
                  aria-label="Loading suggestions"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500/30 border-t-primary-500"
                />
              )}
              {voiceSupported && (
                <button
                  type="button"
                  aria-label={listening ? "Stop voice search" : "Start voice search"}
                  onClick={listening ? stopVoice : startVoice}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition hover:bg-surface-100 hover:text-surface-800 dark:hover:bg-surface-800 dark:hover:text-white",
                    listening && "text-warning-500 animate-pulse"
                  )}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-800 dark:hover:bg-surface-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden rounded border border-surface-200 bg-surface-50 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 sm:inline">
                Esc
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!query && (
                <EmptyState
                  recents={recents}
                  trending={trending}
                  onPick={(q) => setQuery(q)}
                  onClearRecents={() => {
                    clearRecentSearches();
                    setRecents([]);
                  }}
                />
              )}

              {query && flat.length === 0 && !aiLoading && (
                <p className="px-3 py-10 text-center text-sm text-surface-500 dark:text-surface-400">
                  No results for <span className="font-medium">&ldquo;{query}&rdquo;</span>. Try a
                  broader keyword like &ldquo;loan&rdquo; or &ldquo;image&rdquo;.
                </p>
              )}

              {query && bestMatchTool && (
                <Section title="Best Match" badge={aiPowered ? "AI Suggested" : undefined}>
                  <BestMatchCard
                    tool={bestMatchTool}
                    intent={suggestion.intent}
                    aiPowered={aiPowered}
                    selected={selectedIndex === indexByKey.get(`best-${bestMatchTool.id}`)}
                    onClick={() =>
                      submit({
                        kind: "tool",
                        key: `best-${bestMatchTool.id}`,
                        href: bestMatchTool.href,
                        label: bestMatchTool.name,
                      })
                    }
                  />
                </Section>
              )}

              {toolResults.length > 0 && (
                <Section title="Tools" badge={aiPowered ? "AI Suggested" : undefined}>
                  <ul className="space-y-1">
                    {toolResults.map((tool) => {
                      const key = `tool-${tool.id}`;
                      const idx = indexByKey.get(key) ?? -1;
                      return (
                        <li key={key}>
                          <ResultRow
                            href={tool.href}
                            title={tool.name}
                            subtitle={tool.description}
                            tag={tool.category}
                            selected={idx === selectedIndex}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() =>
                              submit({ kind: "tool", key, href: tool.href, label: tool.name })
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}

              {appResults.length > 0 && (
                <Section title="Apps">
                  <ul className="space-y-1">
                    {appResults.map((app) => {
                      const key = `app-${app.id}`;
                      const idx = indexByKey.get(key) ?? -1;
                      const href = `/apps/${app.id}`;
                      return (
                        <li key={key}>
                          <ResultRow
                            href={href}
                            title={app.name}
                            subtitle={app.tagline}
                            tag="Software"
                            icon={<LayoutGrid className="h-4 w-4" />}
                            selected={idx === selectedIndex}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => submit({ kind: "app", key, href, label: app.name })}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}

              {articleResults.length > 0 && (
                <Section title="Articles">
                  <ul className="space-y-1">
                    {articleResults.map((a: Article) => {
                      const key = `article-${a.slug}`;
                      const idx = indexByKey.get(key) ?? -1;
                      return (
                        <li key={key}>
                          <ResultRow
                            href={a.url}
                            title={a.title}
                            subtitle={`${a.readingTimeMinutes} min read`}
                            tag="Article"
                            icon={<BookOpen className="h-4 w-4" />}
                            selected={idx === selectedIndex}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() =>
                              submit({ kind: "article", key, href: a.url, label: a.title })
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}

              {productResults.length > 0 && (
                <Section title="Products">
                  <ul className="space-y-1">
                    {productResults.map((p: Product) => {
                      const key = `product-${p.id}`;
                      const idx = indexByKey.get(key) ?? -1;
                      return (
                        <li key={key}>
                          <ResultRow
                            href={p.href}
                            title={p.name}
                            subtitle={p.description}
                            tag="Product"
                            selected={idx === selectedIndex}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() =>
                              submit({ kind: "product", key, href: p.href, label: p.name })
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-surface-200 bg-surface-50/60 px-4 py-2 text-[11px] text-surface-500 dark:border-surface-800 dark:bg-surface-950/60 dark:text-surface-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <KeyHint>↑</KeyHint>
                  <KeyHint>↓</KeyHint> navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <KeyHint>↵</KeyHint> open
                </span>
                <span className="inline-flex items-center gap-1">
                  <KeyHint>Esc</KeyHint> close
                </span>
              </div>
              {aiPowered && (
                <span className="inline-flex items-center gap-1 text-accent-600 dark:text-accent-400">
                  <Sparkles className="h-3 w-3" /> AI assisted
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-1 py-2">
      <header className="flex items-center justify-between px-2 pb-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {title}
        </h3>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
            <Sparkles className="h-3 w-3" /> {badge}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function BestMatchCard({
  tool,
  intent,
  aiPowered,
  selected,
  onClick,
}: {
  tool: Tool;
  intent: string;
  aiPowered: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
        selected
          ? "border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-500/10"
          : "border-surface-200 hover:border-primary-300 hover:bg-primary-50 dark:border-surface-800 dark:hover:border-primary-700 dark:hover:bg-primary-500/10"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
            {tool.name}
          </p>
          <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
            {tool.category}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-surface-600 dark:text-surface-400">
          {aiPowered && intent ? intent : tool.description}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-surface-400 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
    </button>
  );
}

function ResultRow({
  href,
  title,
  subtitle,
  tag,
  icon,
  selected,
  onClick,
  onMouseEnter,
}: {
  href: string;
  title: string;
  subtitle?: string;
  tag?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition",
        selected
          ? "bg-surface-100 dark:bg-surface-800"
          : "hover:bg-surface-50 dark:hover:bg-surface-800/60"
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300">
        {icon ?? <Search className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-surface-900 dark:text-white">{title}</span>
        {subtitle && (
          <span className="block truncate text-xs text-surface-500 dark:text-surface-400">
            {subtitle}
          </span>
        )}
      </span>
      {tag && (
        <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
          {tag}
        </span>
      )}
    </Link>
  );
}

function EmptyState({
  recents,
  trending,
  onPick,
  onClearRecents,
}: {
  recents: string[];
  trending: TrendingItem[];
  onPick: (q: string) => void;
  onClearRecents: () => void;
}) {
  return (
    <div className="space-y-4">
      {recents.length > 0 && (
        <Section title="Recent">
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="sr-only">Recent searches</span>
            <button
              type="button"
              onClick={onClearRecents}
              className="text-[11px] font-medium text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200"
            >
              Clear history
            </button>
          </div>
          <ul className="space-y-1">
            {recents.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => onPick(q)}
                  className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800/60"
                >
                  <Search className="h-4 w-4 text-surface-400" />
                  <span className="truncate">{q}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {trending.length > 0 && (
        <Section title="Trending">
          <ul className="space-y-1">
            {trending.map((t) => (
              <li key={t.query}>
                <button
                  type="button"
                  onClick={() => onPick(t.query)}
                  className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800/60"
                >
                  <TrendingUp className="h-4 w-4 text-accent-500" />
                  <span className="flex-1 truncate">{t.query}</span>
                  <span className="text-[11px] text-surface-500 dark:text-surface-400">
                    {t.searchCount.toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {recents.length === 0 && trending.length === 0 && (
        <p className="px-3 py-10 text-center text-sm text-surface-500 dark:text-surface-400">
          Start typing to search hundreds of free utility tools.
        </p>
      )}
    </div>
  );
}

function KeyHint({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-surface-200 bg-white px-1 py-0.5 text-[10px] font-medium text-surface-600 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300">
      {children}
    </kbd>
  );
}
