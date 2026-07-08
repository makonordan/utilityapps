"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { CalendlyButton } from "@/components/studio/CalendlyButton";
import { cn, SITE_CONFIG } from "@/lib/utils";

const NAV_LINKS = [
  { label: "What we build", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Studio-branded sticky header. Renders only on /studio/* routes —
 * the global UtilityApps Header is hidden there via HideOnEmbed's
 * extraPrefixes, so this fills the same slot with B2B-flavored
 * branding (logo + "by UtilityApps" wordmark + Book CTA).
 */
export function StudioHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all",
        scrolled
          ? "border-surface-200 bg-white/95 backdrop-blur dark:border-surface-800 dark:bg-surface-950/95"
          : "border-transparent bg-white/70 backdrop-blur-sm dark:bg-surface-950/60"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2.5"
          aria-label="UtilityApps Studio home"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white shadow-md"
          >
            U
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-surface-900 dark:text-white">
              {SITE_CONFIG.name} Studio
            </span>
            <Link
              href="/"
              className="text-[10px] font-medium text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
            >
              by {SITE_CONFIG.name}
            </Link>
          </span>
        </Link>

        <nav
          aria-label="Studio sections"
          className="ml-auto hidden items-center gap-6 text-sm font-medium text-surface-600 md:flex dark:text-surface-300"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-primary-700 dark:hover:text-primary-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <CalendlyButton
          analyticsId="studio-header"
          className="ml-auto hidden items-center gap-1.5 rounded-xl bg-surface-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-surface-800 md:ml-0 md:inline-flex dark:bg-white dark:text-surface-900 dark:hover:bg-surface-100"
        >
          Book a discovery call
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </CalendlyButton>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-surface-700 hover:bg-surface-100 md:hidden dark:text-surface-200 dark:hover:bg-surface-800"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-200 bg-white px-4 py-4 md:hidden dark:border-surface-800 dark:bg-surface-950">
          <nav className="flex flex-col gap-3 text-sm font-medium text-surface-700 dark:text-surface-200">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <CalendlyButton
            analyticsId="studio-header-mobile"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Book a discovery call
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </CalendlyButton>
          <p className="mt-3 text-center text-[11px] text-surface-500 dark:text-surface-400">
            Looking for the free tools?{" "}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-medium text-primary-700 hover:underline dark:text-primary-300"
            >
              utilityapps.site
            </Link>
          </p>
        </div>
      )}
    </header>
  );
}
