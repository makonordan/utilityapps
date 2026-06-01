"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

import { PageTranslate } from "@/components/page-translate/PageTranslate";
import { CATEGORIES } from "@/lib/categories";
import { TOOLS, toolCountPhrase, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  /** Optional pill text shown next to the label (e.g. "Alpha" for new). */
  badge?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "API", href: "/api", badge: "Alpha" },
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
  { label: "YouTube", href: "/youtube" },
  { label: "About", href: "/about" },
];

function groupToolsByCategory(): Map<string, Tool[]> {
  const map = new Map<string, Tool[]>();
  for (const tool of TOOLS) {
    if (!map.has(tool.category)) map.set(tool.category, []);
    map.get(tool.category)!.push(tool);
  }
  for (const list of map.values()) {
    list.sort((a, b) => b.monthlySearches - a.monthlySearches);
  }
  return map;
}

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold", className)} aria-label="UtilityApps home">
      <svg
        viewBox="0 0 32 32"
        width={28}
        height={28}
        aria-hidden="true"
        className="text-primary-500"
      >
        <defs>
          <linearGradient id="ua-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="currentColor" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <path
          d="M16 1.5l12.124 7v15l-12.124 7L3.876 23.5v-15z"
          fill="url(#ua-mark)"
          stroke="currentColor"
          strokeWidth="0"
        />
        <path
          d="M16 9.5l6.062 3.5v6L16 22.5l-6.062-3.5v-6z"
          fill="white"
          fillOpacity="0.92"
        />
      </svg>
      <span className="text-base tracking-tight text-surface-900 dark:text-white">UtilityApps</span>
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Hydration guard: avoid flash of wrong theme on first paint.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-surface-200 text-surface-600 transition hover:bg-surface-100 hover:text-surface-900 dark:border-surface-800 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={mounted ? (isDark ? "sun" : "moon") : "placeholder"}
          initial={{ y: -16, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 16, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex"
        >
          {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 transition-[width] duration-150"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}

function ToolsMegaMenu() {
  const grouped = useMemo(() => groupToolsByCategory(), []);

  // max-h + overflow-y-auto on the panel below: the 12-category grid is
  // taller than most viewports, so cap to the visible area below the sticky
  // header and let the menu scroll internally.
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute left-0 top-full z-50 mt-2 max-h-[calc(100vh-6rem)] w-[calc(100vw-3rem)] max-w-[960px] overflow-y-auto rounded-3xl border border-surface-200 bg-white p-6 shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const tools = grouped.get(cat.name) ?? [];
          const isImageTools = cat.name === "Image Tools";
          const categoryHref = isImageTools
            ? "/tools/image-tools"
            : `/tools/categories/${cat.id}`;
          return (
            <div key={cat.id}>
              <Link
                href={categoryHref}
                className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
              >
                <span>{cat.name}</span>
                <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  {cat.toolCount}
                </span>
              </Link>
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-surface-700 transition hover:bg-surface-50 hover:text-primary-600 dark:text-surface-200 dark:hover:bg-surface-800 dark:hover:text-primary-400"
                    >
                      <span className="font-medium">{tool.name}</span>
                      {tool.new ? (
                        // "New" trumps "Top" — new tools need spotlight more
                        // than evergreen ones, so we show one pill not both.
                        <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                          New
                        </span>
                      ) : tool.featured ? (
                        <span className="rounded-full bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                          Top
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-surface-200 pt-4 dark:border-surface-800">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {toolCountPhrase()} — no signup, no upload limits.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/api"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Building with our tools? Try the API
            <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              Alpha
            </span>
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Browse every tool
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const grouped = useMemo(() => groupToolsByCategory(), []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-surface-950/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-card-hover dark:bg-surface-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3 dark:border-surface-800">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Tools
              </p>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isOpen = expanded === cat.id;
                  const tools = grouped.get(cat.name) ?? [];
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : cat.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-surface-800 hover:bg-surface-100 dark:text-surface-100 dark:hover:bg-surface-800"
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                            {cat.toolCount}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {tools.map((tool) => (
                              <li key={tool.id}>
                                <Link
                                  href={tool.href}
                                  onClick={onClose}
                                  className="block rounded-lg px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-primary-400"
                                >
                                  {tool.name}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href={
                                  cat.name === "Image Tools"
                                    ? "/tools/image-tools"
                                    : `/tools/categories/${cat.id}`
                                }
                                onClick={onClose}
                                className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400"
                              >
                                See all in {cat.name} →
                              </Link>
                            </li>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                More
              </p>
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-surface-100 dark:text-surface-100 dark:hover:bg-surface-800"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-surface-200 px-4 py-4 dark:border-surface-800">
              <a
                href="/support"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-primary-600 hover:to-accent-600"
              >
                <Heart className="h-4 w-4" />
                Support
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openSearch() {
    window.dispatchEvent(new CustomEvent("open-search-modal"));
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-surface-200/80 bg-white/80 backdrop-blur-lg dark:border-surface-800/80 dark:bg-surface-950/80"
          : "border-transparent bg-white/0 dark:bg-surface-950/0"
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                onFocus={() => setToolsOpen(true)}
                onBlur={() => setToolsOpen(false)}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 dark:hover:text-white"
              >
                Tools
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>{toolsOpen && <ToolsMegaMenu />}</AnimatePresence>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 dark:hover:text-white"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Open search"
            className="hidden items-center gap-2 rounded-xl border border-surface-200 px-3 py-1.5 text-sm text-surface-500 transition hover:bg-surface-50 hover:text-surface-700 dark:border-surface-800 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100 sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search tools…</span>
            <kbd className="ml-2 hidden rounded border border-surface-200 bg-surface-50 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 md:inline">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 sm:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <PageTranslate />
          <ThemeToggle />
          <a
            href="/support"
            className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-primary-600 hover:to-accent-600 md:inline-flex"
          >
            <Heart className="h-4 w-4" />
            Support
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <ScrollProgress />
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
