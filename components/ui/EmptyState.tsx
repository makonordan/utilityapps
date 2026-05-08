import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface ActionLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
}

interface Props {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ActionLink[];
  className?: string;
}

/**
 * Reusable empty-state card.
 *
 * Use anywhere a list, grid, or feed is empty: zero search results, no
 * bookmarks, no recently used tools, etc. Pass one or two action links to
 * recover the user's flow.
 */
export function EmptyState({
  Icon = Inbox,
  title,
  description,
  actions,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-dashed border-surface-200 bg-gradient-to-br from-surface-50 to-white p-10 text-center dark:border-surface-800 dark:from-surface-900 dark:to-surface-950",
        className
      )}
    >
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-surface-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-surface-600 dark:text-surface-300">
          {description}
        </p>
      )}
      {actions && actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => (
            <ActionButton key={action.label} action={action} />
          ))}
        </div>
      )}
    </section>
  );
}

function ActionButton({ action }: { action: ActionLink }) {
  const className =
    action.variant === "secondary"
      ? "inline-flex items-center gap-1.5 rounded-2xl border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
      : "inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600";

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}
