"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Pencil } from "lucide-react";

/**
 * Owner-only bar shown on the public card / master page. Public pages are
 * ISR-cached, so we can't render based on the server session (it would
 * leak owner state into the cache). Instead we check session client-side
 * via /api/business-card/me and only render if the caller owns this URL.
 *
 * Renders nothing (a) while checking, (b) if there's no session, or
 * (c) if the session user doesn't own this page — so non-owners see
 * exactly the same DOM as before.
 */
export function OwnerActions({
  cardOwnerUsername,
  cardId,
}: {
  cardOwnerUsername: string;
  /** Card id for the deep-link. Omit on master pages → we deep-link to /dashboard instead. */
  cardId?: string;
}) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/business-card/me", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as {
          ok?: boolean;
          user?: { username?: string } | null;
        };
        if (cancelled) return;
        setIsOwner(json.user?.username === cardOwnerUsername);
      } catch {
        // Silent: if the check fails, we just don't render the bar.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardOwnerUsername]);

  if (!isOwner) return null;

  const editHref = cardId
    ? `/tools/business-card/dashboard/${cardId}`
    : `/tools/business-card/dashboard`;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-3 py-2 text-xs text-white/90 backdrop-blur">
      <span className="hidden sm:inline text-white/70">You own this card ·</span>
      <Link
        href={editHref}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-surface-900 transition hover:bg-white"
      >
        <Pencil className="h-3 w-3" /> Edit this card
      </Link>
      <Link
        href="/tools/business-card/dashboard"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
      >
        <LayoutDashboard className="h-3 w-3" /> Dashboard
      </Link>
    </div>
  );
}
