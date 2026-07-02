"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, ExternalLink, Loader2, QrCode, Settings, Trash2 } from "lucide-react";

import { CardView } from "./CardView";
import type { BcCardRow } from "@/lib/businessCard/types";
import { SITE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function DashboardCardList({
  cards: initial,
  username,
}: {
  cards: BcCardRow[];
  username: string;
}) {
  const router = useRouter();
  const [cards, setCards] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggle = async (card: BcCardRow, field: "is_active" | "is_master_visible") => {
    setBusyId(card.id);
    const next = !card[field];
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, [field]: next } : c)));
    try {
      await fetch(`/api/business-card/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (card: BcCardRow) => {
    if (!confirm(`Delete "${card.full_name}" card? This can't be undone.`)) return;
    setBusyId(card.id);
    try {
      const res = await fetch(`/api/business-card/cards/${card.id}`, { method: "DELETE" });
      if (res.ok) setCards((prev) => prev.filter((c) => c.id !== card.id));
    } finally {
      setBusyId(null);
      router.refresh();
    }
  };

  if (cards.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-surface-300 p-10 text-center text-sm text-surface-500 dark:border-surface-700 dark:text-surface-400">
        No cards yet. Create your first from the button above.
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.id} className="space-y-3">
          <div className="max-h-80 overflow-hidden rounded-2xl">
            <CardView card={card} hideSaveButton compact />
          </div>
          <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate text-sm font-bold text-surface-900 dark:text-white">
                {card.full_name}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                {card.card_type}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-surface-500 dark:text-surface-400">
              /bc/{username}/{card.slug}
            </p>
            <div className="mt-3 grid gap-2 text-[11px]">
              <ToggleRow
                label="Active"
                value={card.is_active}
                onToggle={() => toggle(card, "is_active")}
                busy={busyId === card.id}
              />
              <ToggleRow
                label="Show on master page"
                value={card.is_master_visible}
                onToggle={() => toggle(card, "is_master_visible")}
                busy={busyId === card.id}
              />
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-surface-600 dark:text-surface-300">
              <BarChart3 className="h-3 w-3" /> {card.scan_count} scans · {card.save_count} saves
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link
                href={`/tools/business-card/dashboard/${card.id}`}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-primary-700"
              >
                <Settings className="h-3 w-3" /> Edit
              </Link>
              <a
                href={`${SITE_CONFIG.url}/bc/${username}/${card.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-[11px] font-semibold text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
              >
                <ExternalLink className="h-3 w-3" /> View
              </a>
              <a
                href={`/api/business-card/qr/${card.id}?download=1`}
                className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-[11px] font-semibold text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
              >
                <QrCode className="h-3 w-3" /> QR
              </a>
              <button
                type="button"
                onClick={() => remove(card)}
                disabled={busyId === card.id}
                className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                {busyId === card.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
  busy,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  busy: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={busy}
        onClick={onToggle}
        className={cn(
          "relative h-4 w-7 shrink-0 rounded-full transition",
          value ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-3.5" : "translate-x-0.5"
          )}
        />
      </button>
      <span className="text-surface-700 dark:text-surface-200">{label}</span>
    </label>
  );
}
