"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

import {
  annualSavingsPercent,
  type TierDefinition,
} from "@/lib/support";
import { cn } from "@/lib/utils";

/** Provider URLs for each tier+cycle resolved server-side and passed in
 *  as a flat record so this client component never reads env vars. */
export interface TierCheckoutUrls {
  [key: string]: {
    monthly: { bmac: string | null; stripe: string | null; paystack: string | null };
    annual: { bmac: string | null; stripe: string | null; paystack: string | null };
  };
}

interface Props {
  tiers: TierDefinition[];
  checkoutUrls: TierCheckoutUrls;
}

const ACCENT_CLASSES: Record<
  TierDefinition["accent"],
  { ring: string; button: string; chip: string; pop: string }
> = {
  blue: {
    ring: "ring-primary-200 dark:ring-primary-500/30",
    button:
      "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400",
    chip: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300",
    pop: "from-primary-500/0 via-primary-500/0 to-primary-500/0",
  },
  purple: {
    ring: "ring-accent-300 dark:ring-accent-500/40",
    button:
      "bg-accent-600 text-white hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400",
    chip: "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300",
    pop: "from-accent-500/10 via-primary-500/5 to-transparent",
  },
  gold: {
    ring: "ring-amber-300 dark:ring-amber-500/40",
    button:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400",
    chip: "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
    pop: "from-amber-500/0 via-amber-500/0 to-amber-500/0",
  },
};

export function TierSelector({ tiers, checkoutUrls }: Props) {
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const savings = annualSavingsPercent();

  return (
    <div>
      <div className="mb-6 flex items-center justify-center">
        <div
          role="tablist"
          aria-label="Billing cycle"
          className="inline-flex items-center rounded-full border border-surface-200 bg-white p-1 text-xs font-semibold dark:border-surface-800 dark:bg-surface-900"
        >
          <CycleButton
            active={cycle === "monthly"}
            onClick={() => setCycle("monthly")}
            label="Monthly"
          />
          <CycleButton
            active={cycle === "annual"}
            onClick={() => setCycle("annual")}
            label={`Annual — Save ${savings}%`}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            cycle={cycle}
            urls={checkoutUrls[tier.id]?.[cycle]}
          />
        ))}
      </div>
    </div>
  );
}

function CycleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        "rounded-full px-4 py-1.5 transition",
        active
          ? "bg-surface-900 text-white dark:bg-white dark:text-surface-900"
          : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function TierCard({
  tier,
  cycle,
  urls,
}: {
  tier: TierDefinition;
  cycle: "monthly" | "annual";
  urls: { bmac: string | null; stripe: string | null; paystack: string | null } | undefined;
}) {
  const accent = ACCENT_CLASSES[tier.accent];
  const price = cycle === "annual" ? tier.priceAnnual : tier.priceMonthly;
  const suffix = cycle === "annual" ? "/year" : "/month";
  const monthlyEquivalent =
    cycle === "annual" ? `~$${(tier.priceAnnual / 12).toFixed(2)}/mo billed yearly` : null;

  // Render the first available provider as the primary CTA. Secondary
  // providers show as smaller chips below. If none are configured we
  // surface a "Coming soon" state — better than a dead button.
  const primary = urls?.bmac
    ? { label: "Subscribe via Buy Me a Coffee", href: urls.bmac, provider: "bmac" as const }
    : urls?.stripe
      ? { label: "Subscribe via card (Stripe)", href: urls.stripe, provider: "stripe" as const }
      : urls?.paystack
        ? { label: "Subscribe via Paystack", href: urls.paystack, provider: "paystack" as const }
        : null;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition dark:bg-surface-900",
        tier.featured
          ? "border-transparent ring-2 lg:scale-[1.02]"
          : "border-surface-200 dark:border-surface-800",
        tier.featured && accent.ring
      )}
    >
      {tier.featured && (
        <span
          className={cn(
            "absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
            accent.chip
          )}
        >
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Most popular
        </span>
      )}

      <header>
        <h3 className="text-base font-bold tracking-tight text-surface-900 dark:text-white">
          {tier.name}
        </h3>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{tier.tagline}</p>
        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
            ${price}
          </span>
          <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {suffix}
          </span>
        </div>
        {monthlyEquivalent && (
          <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
            {monthlyEquivalent}
          </p>
        )}
      </header>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {tier.features.map((f) => (
          <Feature key={f} text={f} />
        ))}
      </ul>

      <div className="mt-6">
        {primary ? (
          <a
            href={primary.href}
            target={primary.provider === "bmac" ? "_blank" : undefined}
            rel={primary.provider === "bmac" ? "noopener noreferrer" : undefined}
            className={cn(
              "block w-full rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
              accent.button
            )}
          >
            {primary.label}
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="block w-full cursor-not-allowed rounded-2xl bg-surface-100 px-4 py-3 text-center text-sm font-semibold text-surface-500 dark:bg-surface-800 dark:text-surface-400"
            aria-label={`${tier.name} signup coming soon`}
          >
            Coming soon
          </button>
        )}

        <SecondaryProviders primary={primary?.provider} urls={urls} />
      </div>
    </article>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-surface-700 dark:text-surface-200">
      <Check
        className="mt-0.5 h-4 w-4 shrink-0 text-success-500 dark:text-success-400"
        aria-hidden="true"
      />
      <span>{text}</span>
    </li>
  );
}

function SecondaryProviders({
  primary,
  urls,
}: {
  primary: "bmac" | "stripe" | "paystack" | undefined;
  urls: { bmac: string | null; stripe: string | null; paystack: string | null } | undefined;
}) {
  if (!urls) return null;
  const others: { label: string; href: string }[] = [];
  if (primary !== "stripe" && urls.stripe) others.push({ label: "Card", href: urls.stripe });
  if (primary !== "paystack" && urls.paystack) others.push({ label: "Paystack (Nigeria)", href: urls.paystack });
  if (primary !== "bmac" && urls.bmac) others.push({ label: "BMaC", href: urls.bmac });
  if (others.length === 0) return null;

  return (
    <p className="mt-3 text-center text-[11px] text-surface-500 dark:text-surface-400">
      Or pay via{" "}
      {others.map((o, i) => (
        <span key={o.href}>
          {i > 0 && " · "}
          <a
            href={o.href}
            target={o.label === "BMaC" ? "_blank" : undefined}
            rel={o.label === "BMaC" ? "noopener noreferrer" : undefined}
            className="font-medium underline decoration-dotted underline-offset-2 hover:text-surface-700 dark:hover:text-surface-200"
          >
            {o.label}
          </a>
        </span>
      ))}
    </p>
  );
}
