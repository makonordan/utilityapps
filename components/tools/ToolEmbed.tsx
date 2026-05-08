"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface Props {
  tool: Tool;
  /** Iframe height in pixels. Defaults to 650. */
  height?: number;
  className?: string;
}

const LOAD_TIMEOUT_MS = 8000;

type State = "loading" | "ready" | "blocked";

/**
 * Lazy-loading iframe embed of an external tool site.
 *
 * Strategy:
 *   - Show a shimmer skeleton initially.
 *   - Mount the iframe with `loading="lazy"`.
 *   - On `onLoad`, transition to "ready" and reveal the iframe.
 *   - If load doesn't fire within `LOAD_TIMEOUT_MS` (e.g. X-Frame-Options
 *     blocked the embed), transition to "blocked" and surface an
 *     "Open" fallback button that navigates in the SAME tab.
 *   - A non-blocking "Open" link is always visible below the iframe so users
 *     have an escape hatch even when the embed renders. Same-tab navigation.
 */
export function ToolEmbed({ tool, height = 650, className }: Props) {
  const src = tool.embedUrl ?? tool.externalHref;
  const openHref = tool.externalHref ?? tool.embedUrl;
  const [state, setState] = useState<State>("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state !== "loading") return;
    timerRef.current = setTimeout(() => {
      setState((current) => (current === "loading" ? "blocked" : current));
    }, LOAD_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  function handleLoad() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("ready");
  }

  if (!src) return null;

  return (
    <section aria-label={`${tool.name} tool`} className={cn("space-y-3", className)}>
      <div
        className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card dark:border-surface-800 dark:bg-surface-900"
        style={{ height }}
      >
        {state === "loading" && (
          <div className="absolute inset-0 flex flex-col gap-3 p-5" aria-hidden="true">
            <Skeleton className="h-10 w-1/3 rounded-xl" />
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <div className="grid flex-1 gap-3 pt-2 sm:grid-cols-2">
              <Skeleton className="h-full rounded-2xl" />
              <Skeleton className="h-full rounded-2xl" />
            </div>
          </div>
        )}

        {state === "blocked" ? (
          <BlockedFallback tool={tool} href={openHref} />
        ) : (
          <iframe
            src={src}
            title={tool.name}
            loading="lazy"
            onLoad={handleLoad}
            allow="clipboard-write; clipboard-read"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            referrerPolicy="strict-origin-when-cross-origin"
            className={cn(
              "block h-full w-full border-0 transition-opacity duration-200",
              state === "ready" ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-surface-500 dark:text-surface-400">
        <p className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-success-500" aria-hidden="true" />
          Tool runs in this page. Your data never leaves your browser.
        </p>
        {openHref && (
          <a
            href={openHref}
            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Open {tool.name}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}

function BlockedFallback({ tool, href }: { tool: Tool; href: string | null }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300">
        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-surface-900 dark:text-white">
        {tool.name} took too long to load here
      </h3>
      <p className="max-w-md text-sm text-surface-600 dark:text-surface-300">
        Some browsers block third-party tools from running inside an embed. Open it directly to use
        it — same tool, same domain.
      </p>
      {href && (
        <a
          href={href}
          className="mt-1 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
        >
          Open {tool.name}
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
