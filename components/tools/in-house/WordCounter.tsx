"use client";

import { useMemo, useState } from "react";

import { TEXTAREA_CLASS, ToolShell } from "./ToolShell";

function analyse(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim().length === 0 ? 0 : text.split(/[.!?]+(?=\s|$)/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  // Average reading speed: 238 wpm (Brysbaert 2019). Speaking: 130 wpm.
  const readingMinutes = words / 238;
  const speakingMinutes = words / 130;
  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTime: formatMinutes(readingMinutes),
    speakingTime: formatMinutes(speakingMinutes),
  };
}

function formatMinutes(m: number): string {
  if (m < 1 / 60) return "< 1 sec";
  if (m < 1) return `${Math.round(m * 60)} sec`;
  const minutes = Math.floor(m);
  const seconds = Math.round((m - minutes) * 60);
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`;
}

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyse(text), [text]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: stats.readingTime },
    { label: "Speaking time", value: stats.speakingTime },
  ];

  return (
    <ToolShell
      eyebrow="Text"
      title="Word Counter"
      description="Live word, character, sentence, and reading-time counts as you type or paste."
      onReset={() => setText("")}
    >
      <textarea
        aria-label="Text to count"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className={TEXTAREA_CLASS}
      />
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-3 dark:border-surface-700 dark:bg-surface-800/60"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-bold text-surface-900 dark:text-white">{item.value}</p>
          </li>
        ))}
      </ul>
    </ToolShell>
  );
}
