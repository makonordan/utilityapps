import type { Metadata } from "next";

import { LanguageToolShell } from "@/components/language-tools/LanguageToolShell";
import { Translator } from "@/components/language-tools/Translator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLanguageFaqs, languageToolOgUrl } from "@/lib/languageFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "translator";

const TITLE = "Private Translator — On-Device, No Upload";
const DESCRIPTION =
  "Translate text privately, on your device. Your words never leave your browser — unlike Google Translate. Auto-detect, ~25 languages, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "private translator",
    "offline translator",
    "on-device translation",
    "translate without sending data to google",
    "browser translator",
    "free translator no signup",
    "secure translator",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: languageToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Private Translator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [languageToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function TranslatorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LanguageToolShell
        toolId={TOOL_ID}
        title="Private Translator"
        description="Translate text on your device — your words never leave your browser. Auto-detects the source language and works offline once a language pack downloads."
        faqItems={getLanguageFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <Translator />
      </LanguageToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Translation that doesn&rsquo;t spy on you</h2>
      <p>
        Every time you paste text into Google Translate, that text is sent to
        Google&rsquo;s servers. For a holiday phrase, who cares. For a contract
        clause, a medical letter, a private message, or anything covered by an
        NDA, it&rsquo;s a real problem — you&rsquo;ve just handed confidential
        text to a third party.
      </p>
      <p>
        This translator is different. It uses the <strong>on-device AI
        translation model built into your browser</strong> (Chrome and Edge,
        version 138 and up). Your text is translated locally, on your own
        machine, and is <strong>never sent to any server</strong> — not
        ours, not Google&rsquo;s. After the language pack downloads once, it
        even works with the internet switched off.
      </p>

      <h2>How on-device translation works</h2>
      <p>
        Modern Chromium browsers ship a small, efficient translation model
        that runs directly on your device. The first time you translate a
        given language pair, the browser downloads that pair&rsquo;s model
        (typically a few tens of megabytes) and caches it. Every translation
        after that is instant and offline.
      </p>

      <h2>What to do if your browser isn&rsquo;t supported</h2>
      <p>
        Safari and Firefox don&rsquo;t yet expose the on-device translation
        API. If you&rsquo;re on one of those, the tool shows a one-click link
        that opens Google Translate with your text pre-filled — handy, but be
        aware that path does send your text to Google. For the private,
        on-device experience, open this page in Chrome or Edge.
      </p>

      <h2>When to use a private translator</h2>
      <ul>
        <li>Translating legal, medical, or financial documents</li>
        <li>Anything under an NDA or confidentiality agreement</li>
        <li>Personal messages you&rsquo;d rather not log to a third party</li>
        <li>Working offline — on a plane, in a dead-zone, on a locked-down network</li>
      </ul>
    </article>
  );
}
