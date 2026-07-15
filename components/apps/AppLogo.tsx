import Image from "next/image";

import type { AppListing } from "@/lib/apps";

/** Renders the vendor logo when we have a real, verified asset URL; falls
 *  back to a colored initial avatar otherwise (logoUrl starts as "VERIFY"
 *  until the owner uploads a real asset — see docs/apps-verification-checklist.md). */
export function AppLogo({ app, size = 40 }: { app: AppListing; size?: number }) {
  if (app.logoUrl.startsWith("http")) {
    return (
      <Image
        src={app.logoUrl}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-xl object-contain"
      />
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
