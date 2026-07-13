import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, QrCode } from "lucide-react";

import { CardForm } from "@/components/business-card/CardForm";
import { CopyLinkButton } from "@/components/business-card/CopyLinkButton";
import { getBcUser } from "@/lib/businessCard/auth";
import type { BcCardRow } from "@/lib/businessCard/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata = {
  title: "Edit Card",
  robots: { index: false, follow: true },
};

type Params = { params: Promise<{ cardId: string }> };

/** Edit an existing card. Auto-save is handled inside CardForm. */
export default async function EditCardPage({ params }: Params) {
  const { cardId } = await params;
  const user = await getBcUser();
  if (!user) redirect(`/tools/business-card/create`);

  const admin = getSupabaseAdmin();
  if (!admin) notFound();
  const { data } = await admin
    .from("bc_cards")
    .select("*")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) notFound();
  const card = data as BcCardRow;

  const url = `${SITE_CONFIG.url}/bc/${user.username}/${card.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/tools/business-card/dashboard"
        className="inline-flex items-center gap-1 text-xs font-medium text-surface-500 transition hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Editing card
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            {card.full_name}
          </h1>
          <p className="mt-1 truncate font-mono text-xs text-surface-500 dark:text-surface-400">
            {url}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Owner-facing 'save my own contact' — lets them test the flow
              on their own phone AND re-save after every edit. Each edit
              auto-saves in-place; tapping this again after an edit
              downloads the fresh .vcf so their phone gets the update. */}
          <a
            href={`/api/business-card/vcf/${card.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
          >
            <Download className="h-3 w-3" /> Save to my phone
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
          >
            <ExternalLink className="h-3 w-3" /> View public
          </a>
          <CopyLinkButton value={url} />
          <a
            href={`/api/business-card/qr/${card.id}?download=1`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
          >
            <QrCode className="h-3 w-3" /> Download QR
          </a>
        </div>
      </header>

      <div className="mt-8">
        <CardForm mode={{ kind: "edit", card, username: user.username }} plan={user.plan} />
      </div>
    </div>
  );
}
