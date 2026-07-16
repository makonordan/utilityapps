import { ChevronDown } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

export function ToolFAQ({
  items,
  title = "Frequently asked",
  heading = "Questions about this tool",
  centered = false,
}: {
  items: FAQItem[];
  title?: string;
  heading?: string;
  centered?: boolean;
}) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="space-y-6">
      <header className={centered ? "text-center" : undefined}>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {title}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          {heading}
        </h2>
      </header>

      <div className="divide-y divide-surface-200 overflow-hidden rounded-2xl border border-surface-200 bg-white dark:divide-surface-800 dark:border-surface-800 dark:bg-surface-900">
        {items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-surface-900 transition hover:bg-surface-50 dark:text-white dark:hover:bg-surface-800/60">
              <span>{item.q}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-surface-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 text-sm text-surface-600 dark:text-surface-300">{item.a}</div>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
