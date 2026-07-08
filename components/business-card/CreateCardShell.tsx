"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Copy, QrCode, Check } from "lucide-react";

import { CardForm } from "./CardForm";
import type { BcCardRow, BcPlan } from "@/lib/businessCard/types";
import { SITE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Shell around CardForm for the create flow: renders the form, and on
 * successful save, swaps to the success card with the URL + QR download.
 */
export function CreateCardShell({ username, plan }: { username: string; plan: BcPlan }) {
  const router = useRouter();
  const [saved, setSaved] = useState<BcCardRow | null>(null);
  const [copied, setCopied] = useState(false);

  if (saved) {
    const url = `${SITE_CONFIG.url}/bc/${username}/${saved.slug}`;
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    };
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-success-600 dark:text-success-400">
          Card created
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
          Your card is live 🎉
        </h1>
        <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
          Share the link or the QR code. Contacts save directly to phones when scanned.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_180px]">
          <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
            <p className="text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Public URL
            </p>
            <p className="mt-1 truncate font-mono text-sm text-surface-900 dark:text-white">{url}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copy}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                  copied
                    ? "border-success-500 text-success-700 dark:text-success-300"
                    : "border-surface-200 text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
                )}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
              >
                Open <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900">
            <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
              <QrCode className="h-3 w-3" /> QR code
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/business-card/qr/${saved.id}`}
              alt="QR code for this card"
              className="mx-auto block h-32 w-32"
            />
            <a
              href={`/api/business-card/qr/${saved.id}?download=1`}
              download
              className="mt-2 block text-center text-[11px] font-medium text-primary-700 hover:underline dark:text-primary-300"
            >
              Download PNG
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/tools/business-card/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSaved(null)}
            className="text-sm font-medium text-surface-600 underline decoration-dotted underline-offset-2 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          >
            Create another card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        Step 2 of 2 · Create your card
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
        Build your business card
      </h1>
      <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
        Fill in the details on the left; the live preview updates on the right. You can edit
        everything later.
      </p>

      <div className="mt-8">
        <CardForm mode={{ kind: "create", username }} plan={plan} onSaved={setSaved} />
      </div>
    </div>
  );
}
