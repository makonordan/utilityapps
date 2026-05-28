"use client";

/**
 * Thin wrapper around the browser's on-device Translation APIs:
 *   - Translator API       (Chrome / Edge 138+)
 *   - LanguageDetector API (Chrome / Edge 138+)
 *
 * Everything runs on-device — the text never leaves the browser. That's
 * the entire point of this tool vs Google Translate.
 *
 * These APIs are too new to be in TypeScript's lib.dom.d.ts at our TS
 * version, so we declare the minimal surface we use ourselves below.
 * All access is feature-detected; on unsupported browsers the helpers
 * report `unsupported` and the UI falls back to a Google Translate
 * deep-link.
 */

// --------------------------------------------------- minimal type decls

type Availability = "unavailable" | "downloadable" | "downloading" | "available";

interface DownloadProgressEvent extends Event {
  readonly loaded: number; // 0..1
}

interface CreateMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (e: DownloadProgressEvent) => void
  ): void;
}

interface TranslatorInstance {
  translate(input: string): Promise<string>;
  destroy?: () => void;
}

interface TranslatorCreateOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (m: CreateMonitor) => void;
}

interface TranslatorStatic {
  availability(opts: {
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<Availability>;
  create(opts: TranslatorCreateOptions): Promise<TranslatorInstance>;
}

interface DetectionResult {
  detectedLanguage: string;
  confidence: number;
}

interface LanguageDetectorInstance {
  detect(input: string): Promise<DetectionResult[]>;
  destroy?: () => void;
}

interface LanguageDetectorStatic {
  availability(): Promise<Availability>;
  create(opts?: { monitor?: (m: CreateMonitor) => void }): Promise<LanguageDetectorInstance>;
}

declare global {
  // eslint-disable-next-line no-var
  var Translator: TranslatorStatic | undefined;
  // eslint-disable-next-line no-var
  var LanguageDetector: LanguageDetectorStatic | undefined;
}

// ------------------------------------------------------- feature checks

export function isTranslatorSupported(): boolean {
  return typeof self !== "undefined" && "Translator" in self && !!self.Translator;
}

export function isLanguageDetectorSupported(): boolean {
  return (
    typeof self !== "undefined" &&
    "LanguageDetector" in self &&
    !!self.LanguageDetector
  );
}

// ------------------------------------------------------- translator pool

// Creating a Translator downloads (once) and warms a model — expensive.
// Cache instances per language pair so repeat translations are instant.
const translatorCache = new Map<string, Promise<TranslatorInstance>>();

export type PairAvailability = Availability | "unsupported";

export async function checkPairAvailability(
  source: string,
  target: string
): Promise<PairAvailability> {
  if (!isTranslatorSupported() || !self.Translator) return "unsupported";
  if (source === target) return "available";
  try {
    return await self.Translator.availability({
      sourceLanguage: source,
      targetLanguage: target,
    });
  } catch {
    return "unsupported";
  }
}

/**
 * Translate `text` from `source` to `target`. `onProgress` fires with a
 * 0..1 fraction while a language pack downloads on first use.
 *
 * Throws on unsupported browsers — callers should feature-detect first
 * via isTranslatorSupported() and show the fallback UI.
 */
export async function translateText(
  text: string,
  source: string,
  target: string,
  onProgress?: (fraction: number) => void
): Promise<string> {
  if (!isTranslatorSupported() || !self.Translator) {
    throw new Error("on-device-translation-unsupported");
  }
  if (source === target) return text;

  const key = `${source}->${target}`;
  let instancePromise = translatorCache.get(key);
  if (!instancePromise) {
    instancePromise = self.Translator.create({
      sourceLanguage: source,
      targetLanguage: target,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          onProgress?.(e.loaded);
        });
      },
    });
    translatorCache.set(key, instancePromise);
    // If creation fails, drop it from the cache so a retry can re-create.
    instancePromise.catch(() => translatorCache.delete(key));
  }

  const translator = await instancePromise;
  return translator.translate(text);
}

/**
 * Detect the language of `text`. Returns an ISO code (e.g. "fr") or null
 * if detection is unsupported / inconclusive.
 */
export async function detectLanguage(text: string): Promise<string | null> {
  if (!isLanguageDetectorSupported() || !self.LanguageDetector) return null;
  if (!text.trim()) return null;
  try {
    const availability = await self.LanguageDetector.availability();
    if (availability === "unavailable") return null;
    const detector = await self.LanguageDetector.create();
    const results = await detector.detect(text);
    detector.destroy?.();
    const best = results?.[0];
    if (best && best.confidence >= 0.5 && best.detectedLanguage !== "und") {
      return best.detectedLanguage;
    }
    return null;
  } catch {
    return null;
  }
}

// ------------------------------------------------------- language list

export interface Language {
  code: string;
  name: string;
}

/**
 * Curated list of widely-used languages the on-device models support.
 * Codes are BCP-47 base codes the Translator API accepts. Not exhaustive
 * — covers the languages most translation searches target.
 */
export const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ru", name: "Russian" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "fa", name: "Persian" },
  { code: "he", name: "Hebrew" },
  { code: "sv", name: "Swedish" },
  { code: "ro", name: "Romanian" },
  { code: "el", name: "Greek" },
  { code: "cs", name: "Czech" },
];

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

/** Build a Google Translate deep-link with text pre-filled (fallback for
 *  browsers without the on-device Translator API). `source` of "auto"
 *  lets Google detect the language. */
export function googleTranslateUrl(
  text: string,
  source: string,
  target: string
): string {
  const sl = source === "auto" ? "auto" : source;
  const params = new URLSearchParams({
    sl,
    tl: target,
    text,
    op: "translate",
  });
  return `https://translate.google.com/?${params.toString()}`;
}
