"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is UtilityApps really free?",
    a: "Yes — every tool listed on UtilityApps is free to use, with no signup, no credit card, and no usage caps. We monetize through optional digital products and tasteful display ads, never by gating tools.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required. Bookmarks and recent searches stay on your device using a private anonymous ID, so you can come back to your favorite tools without ever signing up.",
  },
  {
    q: "Are my files private?",
    a: "Most tools (image compression, JSON formatting, base64 encoding, password generation, etc.) run entirely in your browser. Your files never leave your device. Tools that require server processing auto-delete uploads within an hour.",
  },
  {
    q: "Can I use UtilityApps on mobile?",
    a: "Every tool is built mobile-first and works on phones and tablets without a download. The app installs as a Progressive Web App from any modern browser.",
  },
  {
    q: "Which countries do the financial tools support?",
    a: "Loan, mortgage, salary, and tax calculators support the US, UK, Canada, Germany, France, and most EU countries, with currency and tax-bracket data updated each year.",
  },
  {
    q: "How is the AI search powered?",
    a: "Search uses a two-layer system: an instant fuzzy match against the tool catalog, plus an AI intent layer (GPT-4o-mini) that detects what you're trying to do and points you at the right tool. The AI layer is opt-in and degrades gracefully if it's unavailable.",
  },
  {
    q: "Can I suggest a new tool?",
    a: "Please do. The fastest way is the contact form on /contact. We ship the most-requested tools first.",
  },
  {
    q: "Do you offer an API or white-label version?",
    a: "Not yet, but several of the tools have programmatic versions in the pipeline. Subscribe to the newsletter to be notified when the developer API ships.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Frequently asked
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Everything you might be wondering
        </h2>
      </header>

      <Accordion.Root
        type="single"
        collapsible
        className="divide-y divide-surface-200 overflow-hidden rounded-2xl border border-surface-200 bg-white dark:divide-surface-800 dark:border-surface-800 dark:bg-surface-900"
      >
        {FAQS.map((faq, i) => (
          <Accordion.Item key={faq.q} value={`item-${i}`}>
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-surface-900 transition hover:bg-surface-50 data-[state=open]:bg-surface-50 dark:text-white dark:hover:bg-surface-800/60 dark:data-[state=open]:bg-surface-800/60">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-surface-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-sm text-surface-600 data-[state=closed]:animate-[accordion-up_0.2s_ease] data-[state=open]:animate-[accordion-down_0.2s_ease] dark:text-surface-300">
              <div className="px-5 pb-5 pt-0">{faq.a}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
