import Image from "next/image";

import type { AppListing } from "@/lib/apps";

/** Renders the vendor logo when we have a real asset URL (currently sourced
 *  from Google's favicon service, keyed off each app's own website domain —
 *  see docs/apps-verification-checklist.md); falls back to a colored initial
 *  avatar for the rare listing still carrying the "VERIFY" placeholder. A
 *  bordered neutral tile behind the image keeps small/transparent favicons
 *  from looking like they're floating loose on the card. */
export function AppLogo({ app, size = 40 }: { app: AppListing; size?: number }) {
  if (app.logoUrl.startsWith("http")) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-xl border border-surface-200 bg-white p-1.5 dark:border-surface-800 dark:bg-surface-950"
        style={{ width: size, height: size }}
      >
        <Image
          src={app.logoUrl}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {app.name.charAt(0)}
    </span>
  );
}
