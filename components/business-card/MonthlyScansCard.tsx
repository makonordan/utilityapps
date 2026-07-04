import Link from "next/link";
import { ArrowRight, BarChart3, Lock } from "lucide-react";

import type { MonthlyScanUsage } from "@/lib/businessCard/analytics";
import type { BcPlan } from "@/lib/businessCard/types";

/**
 * Small dashboard widget summarising the user's monthly scan usage
 * against their plan cap. On Free (cap = 50), when the user hits the cap
 * we swap the meter for an upgrade nudge — analytics past 50 aren't
 * visible to them, but they're still being collected in the database so
 * they'll appear immediately after upgrade.
 */
export function MonthlyScansCard({
  usage,
  plan,
}: {
  usage: MonthlyScanUsage;
  plan: BcPlan;
}) {
  const { visible, cap, capped } = usage;
  const pct = cap ? Math.min(100, Math.round((visible / cap) * 100)) : 0;
  const hasHitCap = capped;

  return (
    <section className="mt-6 rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
            <BarChart3 className="mr-1 inline h-3 w-3 -translate-y-px" />
            Scans this month
          </p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">
            {visible.toLocaleString()}
            {cap !== null && (
              <span className="ml-2 text-sm font-medium text-surface-500 dark:text-surface-400">
                {hasHitCap ? "+" : ""} / {cap}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {plan === "free"
              ? hasHitCap
                ? "You've hit your monthly scan cap. Additional scans are still being recorded — upgrade to see them."
                : "Free plan · resets on the 1st of each month"
              : "Unlimited on your plan"}
          </p>
        </div>
        {plan === "free" && (
          <Link
            href="/tools/business-card#pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
          >
            <Lock className="h-3 w-3" /> Unlock unlimited
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {cap !== null && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <div
            className={`h-full rounded-full transition-all ${
              hasHitCap
                ? "bg-red-500"
                : pct > 80
                  ? "bg-amber-500"
                  : "bg-primary-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </section>
  );
}
