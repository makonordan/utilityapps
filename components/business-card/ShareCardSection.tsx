"use client";

import { useState } from "react";
import { Check, Copy, Download, QrCode } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Small "share this card" panel shown at the bottom of the public
 * individual card page. Gives visitors an easy way to pass the card
 * along to someone else — QR to scan, link to copy, and a download
 * for anyone who wants to print/keep the QR.
 *
 * Kept intentionally minimal so it doesn't compete visually with the
 * primary Save-to-Contacts CTA above it.
 */
export function ShareCardSection({
  cardId,
  publicUrl,
}: {
  cardId: string;
  publicUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard denied — silent */
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-4 text-white backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
        Share this card
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            copied
              ? "border-emerald-300 bg-emerald-500/20 text-emerald-100"
              : "border-white/20 bg-white/10 text-white hover:bg-white/15"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
        >
          <QrCode className="h-3.5 w-3.5" />
          {showQr ? "Hide QR" : "Show QR"}
        </button>
        <a
          href={`/api/business-card/qr/${cardId}?download=1`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </a>
      </div>

      {showQr && (
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/business-card/qr/${cardId}`}
            alt="QR code for this card"
            className="mx-auto block h-56 w-56"
          />
          <p className="mt-2 text-center text-[11px] text-surface-600">
            Point a phone camera at this QR to save the contact.
          </p>
        </div>
      )}
    </div>
  );
}
