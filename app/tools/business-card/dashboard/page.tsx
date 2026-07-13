import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Plus, QrCode } from "lucide-react";

import { CopyLinkButton } from "@/components/business-card/CopyLinkButton";
import { DashboardCardList } from "@/components/business-card/DashboardCardList";
import { MonthlyScansCard } from "@/components/business-card/MonthlyScansCard";
import { getMonthlyScanUsage } from "@/lib/businessCard/analytics";
import { getBcUser } from "@/lib/businessCard/auth";
import { PLAN_LIMITS } from "@/lib/businessCard/types";
import type { BcCardRow } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata = {
  title: "My Business Cards",
  robots: { index: false, follow: true },
};

/**
 * Dashboard — the command center for a signed-in user with at least
 * one bc_users row. Redirects to /create for unauth'd or unfinished
 * onboarding cases.
 */
export default async function DashboardPage() {
  const user = await getBcUser();
  if (!user) redirect("/tools/business-card/create");

  const admin = getSupabaseAdmin();
  const [cardsRes, usage] = await Promise.all([
    admin
      ? admin
          .from("bc_cards")
          .select("*")
          .eq("user_id", user.id)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as BcCardRow[] }),
    getMonthlyScanUsage(user.id, user.plan),
  ]);
  const cards = (cardsRes.data ?? []) as BcCardRow[];

  const limits = PLAN_LIMITS[user.plan];
  const active = cards.filter((c) => c.is_active).length;
  const masterUrl = `${SITE_CONFIG.url}/bc/${user.username}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            My business cards
          </h1>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {active} of {limits.maxCards ?? "∞"} active cards on your {user.plan} plan
          </p>
        </div>
        <Link
          href="/tools/business-card/create"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Plus className="h-4 w-4" /> New card
        </Link>
      </header>

      {/* Monthly scan usage — surfaces the plan cap explicitly so a free
          user knows when analytics are being clipped instead of silently
          under-counting. */}
      {usage && <MonthlyScansCard usage={usage} plan={user.plan} />}

      {/* Master QR */}
      <section className="mt-8 grid gap-4 rounded-3xl border border-surface-200 bg-white p-6 sm:grid-cols-[1fr_180px] dark:border-surface-800 dark:bg-surface-900">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Your master page
          </p>
          <p className="mt-1 truncate font-mono text-sm text-surface-900 dark:text-white">{masterUrl}</p>
          <p className="mt-2 text-xs text-surface-600 dark:text-surface-300">
            One QR code for all your cards. Scanning shows the card selector on any phone.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={masterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
            >
              Open master page <ArrowRight className="h-3 w-3" />
            </a>
            <CopyLinkButton value={masterUrl} />
            <a
              href={`/api/business-card/qr/master/${user.username}?download=1`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
            >
              <QrCode className="h-3 w-3" /> Download master QR
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/business-card/qr/master/${user.username}`}
          alt="Master QR code"
          className="mx-auto block h-40 w-40"
        />
      </section>

      {/* Cards */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">Your cards</h2>
        <DashboardCardList cards={cards} username={user.username} />
      </section>
    </div>
  );
}

