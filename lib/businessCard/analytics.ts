import "server-only";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { PLAN_LIMITS } from "./types";
import type { BcPlan } from "./types";

/**
 * Server-side analytics helpers. Called from server components (dashboard)
 * and read-only API endpoints. We never expose scan rows past the plan's
 * monthly cap — that's the "50 scans/month" gate advertised on the
 * pricing page.
 *
 * Scans are *always* collected (see /api/business-card/analytics/[cardId])
 * so an upgrading user gets full history. The cap only affects what the
 * dashboard renders.
 */

export interface MonthlyScanUsage {
  /** Actual scan count this month (uncapped, for internal comparisons). */
  total: number;
  /** What we're allowed to show the user — min(total, cap) if cap is set. */
  visible: number;
  /** Plan cap; null means unlimited (pro/business). */
  cap: number | null;
  /** True when total > cap and we're clipping the number for display. */
  capped: boolean;
  /** ISO string of the first millisecond of the current UTC month. */
  monthStart: string;
}

function firstOfCurrentUtcMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Count how many scans across ALL of a user's cards happened this month.
 * Uses a HEAD count query so we never pull scan rows over the wire when
 * the caller only wants the number.
 */
export async function getMonthlyScanUsage(
  userId: string,
  plan: BcPlan
): Promise<MonthlyScanUsage | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const cap = PLAN_LIMITS[plan].monthlyScansCap;
  const monthStart = firstOfCurrentUtcMonth();

  const { data: cards } = await admin
    .from("bc_cards")
    .select("id")
    .eq("user_id", userId);
  const cardIds = (cards ?? []).map((c: { id: string }) => c.id);

  if (cardIds.length === 0) {
    return {
      total: 0,
      visible: 0,
      cap,
      capped: false,
      monthStart: monthStart.toISOString(),
    };
  }

  const { count } = await admin
    .from("bc_scans")
    .select("id", { count: "exact", head: true })
    .in("card_id", cardIds)
    .gte("scanned_at", monthStart.toISOString());
  const total = count ?? 0;
  const capped = cap !== null && total > cap;
  const visible = cap !== null ? Math.min(total, cap) : total;

  return {
    total,
    visible,
    cap,
    capped,
    monthStart: monthStart.toISOString(),
  };
}
