/**
 * Per-tool metadata for the Language Tools category. Same shape as the
 * other *Faqs.ts files so LanguageToolShell renders FAQ + schema the
 * same way.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type LanguageToolId = "translator";

export interface HowToStep {
  name: string;
  text: string;
}

const PRIVACY_FAQ: FAQItem = {
  q: "Does my text get sent to a server?",
  a: "No — and that's the whole point. The translator uses your browser's built-in, on-device translation model (Chrome / Edge 138+). Your text is translated locally and never leaves your device. You can even disconnect from the internet after the language pack downloads and it still works. If your browser doesn't support on-device translation, we offer a one-click link to Google Translate instead — but that path does send your text to Google, and we tell you so before you click.",
};

export const LANGUAGE_FAQS: Record<LanguageToolId, FAQItem[]> = {
  translator: [
    {
      q: "How is this different from Google Translate?",
      a: "Google Translate sends every character you type to Google's servers. This tool translates entirely on your device using your browser's built-in AI model — your words never leave your browser. That matters when you're translating something private: a contract, a medical letter, a personal message. The trade-off is that on-device models support fewer languages and are a touch less polished than Google's cloud models, and the feature needs a recent Chrome or Edge.",
    },
    {
      q: "Which browsers support on-device translation?",
      a: "Chrome and Edge version 138 and newer (mid-2025 onward), on desktop and Android. Safari and Firefox don't expose the on-device translation API yet. On unsupported browsers the tool shows a one-click 'Open in Google Translate' button with your text pre-filled, so you still get a translation — just not the private, on-device kind.",
    },
    {
      q: "Why did it pause to 'download a language pack'?",
      a: "The first time you translate a given language pair, your browser downloads the on-device model for it (typically a few tens of megabytes). It's cached afterwards, so the next translation in that pair is instant — and works offline.",
    },
    {
      q: "How many languages are supported?",
      a: "We list around 25 of the most-used languages. The exact set available depends on your browser's installed models; if a pair isn't downloadable, the tool tells you and offers the Google Translate fallback.",
    },
    PRIVACY_FAQ,
  ],
};

export const LANGUAGE_HOWTOS: Record<LanguageToolId, HowToStep[]> = {
  translator: [
    { name: "Pick your languages", text: "Choose the language to translate from (or leave it on Auto-detect) and the language to translate into." },
    { name: "Type or paste your text", text: "Enter the text in the left box. Translation runs automatically a moment after you stop typing." },
    { name: "Copy the result", text: "The translation appears on the right — click Copy to grab it. Nothing you typed was sent anywhere." },
  ],
};

export const LANGUAGE_FEATURE_LISTS: Record<LanguageToolId, string> = {
  translator:
    "On-device translation (text never leaves the browser), auto language detection, ~25 languages, instant repeat translations after first download, Google Translate fallback for unsupported browsers, no signup",
};

export const LANGUAGE_TOOL_PUBLISHED = "2026-05-28";

export function getLanguageFaqs(toolId: string): FAQItem[] {
  return LANGUAGE_FAQS[toolId as LanguageToolId] ?? [];
}

export function getLanguageHowTo(toolId: string): HowToStep[] {
  return LANGUAGE_HOWTOS[toolId as LanguageToolId] ?? [];
}

export function getLanguageFeatureList(toolId: string): string {
  return LANGUAGE_FEATURE_LISTS[toolId as LanguageToolId] ?? "";
}

export function languageToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "language-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
