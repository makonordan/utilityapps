"use client";

import { usePathname } from "next/navigation";

/**
 * Renders nothing on `/embed/*` paths and any extra prefixes passed in —
 * used to strip Header / Footer / floating UI from embed routes (so
 * third-party iframes don't get the whole site chrome) and from /studio/*
 * (where a Studio-branded sub-nav replaces the global header).
 *
 * Client-only check: chrome briefly renders in the SSR HTML then
 * disappears at hydration. Acceptable for both use cases since the
 * destination has its own nav once hydrated.
 */
export function HideOnEmbed({
  children,
  extraPrefixes = [],
}: {
  children: React.ReactNode;
  extraPrefixes?: string[];
}) {
  const pathname = usePathname();
  if (!pathname) return <>{children}</>;
  if (pathname.startsWith("/embed/")) return null;
  for (const prefix of extraPrefixes) {
    if (pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix)) {
      return null;
    }
  }
  return <>{children}</>;
}
