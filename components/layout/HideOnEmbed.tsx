"use client";

import { usePathname } from "next/navigation";

/**
 * Renders nothing on /embed/* paths — used to strip Header / Footer /
 * floating UI from embed routes so third-party iframes don't get the
 * whole site chrome.
 *
 * Client-only check: chrome briefly renders in the SSR HTML then
 * disappears at hydration. Acceptable for the iframe use case since
 * the embedded surface has no nav for users to interact with before
 * hydration anyway.
 */
export function HideOnEmbed({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/embed/")) return null;
  return <>{children}</>;
}
