import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

/** "Get monthly picks" — value exchange, never a gate. Reuses the existing
 *  newsletter pipeline (newsletter_subscribers table) with a dedicated
 *  source so it's distinguishable in the admin dashboard from footer/blog
 *  signups. */
export function AppsNewsletter({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">Get monthly picks</h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          New and better tools in this category, once a month. No spam, unsubscribe anytime.
        </p>
        <div className="mt-4 max-w-md">
          <NewsletterForm
            source="apps-directory"
            variant="inline"
            buttonLabel="Get picks"
            successLabel="You're in!"
          />
        </div>
      </div>
    </section>
  );
}
