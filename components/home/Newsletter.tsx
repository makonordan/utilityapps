import { Mail } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-surface-200 bg-gradient-to-br from-white to-surface-50 p-8 text-center shadow-card sm:p-12 dark:border-surface-800 dark:from-surface-900 dark:to-surface-950">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
          <Mail className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Get weekly tool recommendations
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-surface-600 dark:text-surface-300">
          One short email each Friday: the tools that saved us time this week, plus a short tip you
          can use the next morning.
        </p>

        <div className="mx-auto mt-6 max-w-md">
          <NewsletterForm source="home" />
        </div>

        <p className="mx-auto mt-5 max-w-md text-[11px] text-surface-500 dark:text-surface-500">
          By subscribing you agree to our Privacy Policy. We never share your email and you can
          unsubscribe in one click. GDPR compliant.
        </p>
      </div>
    </section>
  );
}
