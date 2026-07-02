"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";

import type { BcCardRow } from "@/lib/businessCard/types";
import { cn } from "@/lib/utils";

/**
 * The whole reason this feature exists. Tapping this triggers a .vcf
 * download → phone shows "Add to contacts?" native dialog on both iOS
 * and Android. Analytics tracked via a fire-and-forget beacon so the
 * download starts immediately.
 */

export function SaveContactButton({
  card,
  accent,
}: {
  card: BcCardRow;
  /** Overrides the default red styling — used by non-default themes. */
  accent?: string;
}) {
  const [saved, setSaved] = useState(false);

  const onTap = async () => {
    // Fire the tracking beacon in parallel with the download. If it's
    // dropped (bfcache, network fail), the download still succeeds.
    try {
      navigator.sendBeacon?.(
        `/api/business-card/analytics/${card.id}`,
        new Blob([JSON.stringify({ scan_type: "vcf_download", referrer: document.referrer })], {
          type: "application/json",
        })
      );
    } catch {
      /* best-effort */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <a
      href={`/api/business-card/vcf/${card.id}`}
      onClick={onTap}
      aria-label="Save contact to phone"
      className={cn(
        "sticky bottom-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.98]",
        "min-h-[56px]"
      )}
      style={{
        background: accent ? `${accent}` : "linear-gradient(135deg, #DC2626, #991B1B)",
      }}
    >
      {saved ? (
        <>
          <Check className="h-5 w-5" />
          Contact saved
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          Save to Contacts
        </>
      )}
    </a>
  );
}
