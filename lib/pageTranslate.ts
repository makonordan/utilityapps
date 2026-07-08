"use client";

/**
 * Whole-page on-device translation engine.
 *
 * Walks the DOM, translates visible text nodes with the browser's
 * on-device Translator API (the same engine as the Private Translator
 * tool), and keeps translating new nodes via a MutationObserver so the
 * page stays translated as the user navigates (App Router keeps the
 * layout mounted) and as React re-renders swap text nodes.
 *
 * Everything is on-device — no server, no upload. Only works in
 * Chrome / Edge 138+; callers must feature-detect via
 * isTranslatorSupported() and show the browser-native guidance
 * otherwise.
 *
 * Source language is fixed to "en" — the site is authored in English
 * (<html lang="en">).
 */

import { isTranslatorSupported, translateText } from "./translator";

const SOURCE_LANG = "en";
const STORAGE_KEY = "utilityapps:page-lang";

// Elements whose text we never translate: code, inputs, media, and
// anything explicitly opted out with [data-no-translate].
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "KBD",
  "SAMP",
  "SVG",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CANVAS",
  "VIDEO",
  "AUDIO",
]);

// Per-language string cache so repeated labels (buttons, nav) translate once.
let cache = new Map<string, string>();
let currentLang: string | null = null;

// Nodes we've already translated — skip on re-walks. WeakSet so GC'd nodes
// don't leak. React-replaced nodes are brand new, so they're NOT in here and
// get re-translated, which is exactly what keeps the page translated.
const doneNodes = new WeakSet<Text>();

let observer: MutationObserver | null = null;
let observerTimer: ReturnType<typeof setTimeout> | null = null;
const pendingRoots = new Set<Node>();

function isSkipped(node: Node): boolean {
  let el: HTMLElement | null = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.hasAttribute("data-no-translate")) return true;
    if (el.isContentEditable) return true;
    el = el.parentElement;
  }
  return false;
}

function collectTextNodes(root: Node): Text[] {
  if (root.nodeType === Node.TEXT_NODE) {
    const t = root as Text;
    const v = t.textContent ?? "";
    if (v.trim() && !doneNodes.has(t) && !isSkipped(t)) return [t];
    return [];
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const v = n.textContent ?? "";
      if (!v.trim()) return NodeFilter.FILTER_REJECT;
      if (doneNodes.has(n as Text)) return NodeFilter.FILTER_REJECT;
      if (isSkipped(n)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const out: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

async function translateNodes(
  nodes: Text[],
  lang: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  if (nodes.length === 0) return;
  const CHUNK = 12; // modest concurrency so we don't swamp the model
  let done = 0;
  for (let i = 0; i < nodes.length; i += CHUNK) {
    const chunk = nodes.slice(i, i + CHUNK);
    await Promise.all(
      chunk.map(async (node) => {
        if (lang !== currentLang) return; // language changed mid-flight
        const original = node.textContent ?? "";
        const key = original.trim();
        if (!key) return;
        let translated = cache.get(key);
        if (translated == null) {
          try {
            translated = await translateText(key, SOURCE_LANG, lang);
            cache.set(key, translated);
          } catch {
            return; // leave this node in English; don't mark done so a retry can hit it
          }
        }
        if (lang !== currentLang) return;
        if (node.isConnected && !doneNodes.has(node)) {
          // Preserve surrounding whitespace; function replacer avoids
          // `$&`-style pattern interpretation in the translated text.
          node.textContent = original.replace(key, () => translated as string);
          doneNodes.add(node);
        }
      })
    );
    done += chunk.length;
    onProgress?.(Math.min(1, done / nodes.length));
  }
}

function startObserver(lang: string) {
  observer?.disconnect();
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => pendingRoots.add(n));
      } else if (m.type === "characterData") {
        // A text node's content changed (e.g. React update). Re-translate it
        // unless we just did (it'd be in doneNodes already).
        const t = m.target as Text;
        if (!doneNodes.has(t)) pendingRoots.add(t);
      }
    }
    if (observerTimer) clearTimeout(observerTimer);
    observerTimer = setTimeout(() => {
      const roots = Array.from(pendingRoots);
      pendingRoots.clear();
      const nodes: Text[] = [];
      for (const r of roots) {
        if (r.isConnected) nodes.push(...collectTextNodes(r));
      }
      if (nodes.length) void translateNodes(nodes, lang);
    }, 250);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

/**
 * Translate the whole page into `lang` and keep it translated as content
 * changes. Persists the choice so it re-applies on navigation / reload.
 */
export async function applyPageTranslation(
  lang: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  if (!isTranslatorSupported()) {
    throw new Error("on-device-translation-unsupported");
  }
  if (lang === SOURCE_LANG) {
    restoreOriginal();
    return;
  }
  currentLang = lang;
  cache = new Map();
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode — translation still works for this session */
  }
  await translateNodes(collectTextNodes(document.body), lang, onProgress);
  startObserver(lang);
}

/**
 * Restore the original English text. The cleanest, most reliable restore
 * for a live-mutated DOM is a reload — trying to swap every translated
 * node back risks drift after re-renders. Clears the saved language first
 * so the reload comes back in English.
 */
export function restoreOriginal(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  observer?.disconnect();
  observer = null;
  currentLang = null;
  if (typeof window !== "undefined") window.location.reload();
}

export function getSavedLang(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
