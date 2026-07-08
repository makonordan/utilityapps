import { Mail } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function SidebarNewsletter() {
  return (
    <section className="rounded-2xl border border-surface-200 bg-gradient-to-br from-primary-50/40 to-white p-5 dark:border-surface-800 dark:from-primary-500/10 dark:to-surface-900">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <Mail className="h-4 w-4" />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
        One short email each Friday
      </h3>
      <p className="mt-1.5 text-xs text-surface-600 dark:text-surface-400">
        New tools, money-saving guides, and tips you can use the next morning.
      </p>
      <div className="mt-3">
        <NewsletterForm
          source="blog-sidebar"
          variant="stacked"
          buttonLabel="Subscribe"
          successLabel="Subscribed"
        />
      </div>
    </section>
  );
}
