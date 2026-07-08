"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { StudioFAQItem } from "@/lib/studio";
import { cn } from "@/lib/utils";

/**
 * Accordion FAQ tailored for /studio.
 *
 * Emits FAQPage JSON-LD inline (same approach as components/tools/ToolFAQ)
 * so the Studio page picks up rich-snippet eligibility without each section
 * having to author its own script tag.
 */
export function StudioFAQ({ items }: { items: StudioFAQItem[] }) {
  return (
    <div className="space-y-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      {items.map((it, i) => (
        <Item key={it.q} item={it} startOpen={i === 0} />
      ))}
    </div>
  );
}

function Item({ item, startOpen }: { item: StudioFAQItem; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <div className="rounded-2xl border border-surface-200 bg-white transition dark:border-surface-800 dark:bg-surface-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white"
        aria-expanded={open}
      >
        {item.q}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-surface-400 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="border-t border-surface-100 px-5 py-4 text-sm leading-relaxed text-surface-600 dark:border-surface-800 dark:text-surface-300">
          {item.a}
        </p>
      )}
    </div>
  );
}
