"use client";

import { ArrowUpRight } from "lucide-react";

import { trackAffiliateClick } from "@/lib/apps/analytics";
import type { AppListing } from "@/lib/apps";
import { cn } from "@/lib/utils";

/** "Visit [Name]" button + the honest disclosure line that goes with it.
 *  Three states, in priority order: a real affiliate link (disclosed), an
 *  explicit "we don't earn anything from this" trust signal when we've
 *  confirmed there's no affiliate program, or a neutral "direct link" note
 *  otherwise (program status unconfirmed / not yet an affiliate).
 *
 *  `source` tags where the click came from (e.g. "listing", "compare") in
 *  the logged event's metadata — purely informational, never required. */
export function AffiliateCTA({
  app,
  className,
  source,
}: {
  app: AppListing;
  className?: string;
  source?: string;
}) {
  const isAffiliate = Boolean(app.affiliateUrl);
  const visitHref = app.affiliateUrl ?? app.website;

  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <a
        href={visitHref}
        target="_blank"
        rel={isAffiliate ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer"}
        onClick={() => trackAffiliateClick(app.id, visitHref, source)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-base font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
      >
        Visit {app.name}
        <ArrowUpRight className="h-4 w-4" />
      </a>
      {isAffiliate ? (
        <p className="max-w-md text-xs text-surface-500 dark:text-surface-400">
          Affiliate link — we may earn a commission. It doesn&apos;t affect our verdict.
        </p>
      ) : app.hasAffiliateProgram === false ? (
        <p className="max-w-md text-xs font-medium text-success-700 dark:text-success-400">
          We don&apos;t earn anything from this link — we list it because it&apos;s good.
        </p>
      ) : (
        <p className="max-w-md text-xs text-surface-500 dark:text-surface-400">
          This is a direct link to {app.name} — we don&apos;t currently earn anything from it.
        </p>
      )}
    </div>
  );
}
