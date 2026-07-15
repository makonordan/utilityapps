import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Funnel from a free generator tool to the /apps software directory —
 * the honest upsell path once someone needs more than a one-off document.
 * Mount on tool pages whose users plausibly outgrow a single-document
 * generator (invoice, receipt, purchase order) into full software.
 *
 * `maxWidth` should match the surrounding page's container so the banner's
 * edges line up with the rest of the content above it.
 */
export function OutgrowingToolBanner({ maxWidth = "max-w-5xl" }: { maxWidth?: string }) {
  return (
    <section className={cn("mx-auto mt-16 px-4 sm:px-6", maxWidth)}>
      <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-700/40 dark:bg-primary-500/10">
        <p className="text-sm font-semibold text-surface-900 dark:text-white">
          Outgrowing this tool?
        </p>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          See the invoicing software we actually recommend — honest verdicts, verified pricing,
          never ranked by who paid us.
        </p>
        <Link
          href="/apps"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Browse invoicing software
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
