"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";

import { LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { SITE_CONFIG, cn } from "@/lib/utils";

interface Props {
  toolId: string;
  toolName: string;
  toolPath: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Compact share-icon button used inside ToolCard.
 *
 * Mobile (or any browser with Web Share API): triggers the native share sheet
 * so the user can post to any installed app (Messages, WhatsApp, Twitter,
 * LinkedIn, Mail, etc.).
 *
 * Desktop fallback: tiny popover with X, LinkedIn, WhatsApp, and Copy-Link.
 *
 * Click handlers stopPropagation so the parent ToolCard <Link> doesn't
 * navigate away.
 */
export function ShareToolButton({ toolId, toolName, toolPath, className, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [supportsNative, setSupportsNative] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSupportsNative(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  // Close popover on outside click.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const fullUrl = `${SITE_CONFIG.url}${toolPath}`;
  const text = `Check out the free ${toolName} on ${SITE_CONFIG.name}`;
  const encUrl = encodeURIComponent(fullUrl);
  const encText = encodeURIComponent(text);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (supportsNative) {
      try {
        await navigator.share({ title: toolName, text, url: fullUrl });
        return;
      } catch {
        // User cancelled or failed — fall through to popover.
      }
    }
    setOpen((prev) => !prev);
  }

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      window.prompt("Copy this link:", fullUrl);
    }
  }

  const dimensions = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleClick}
        title={`Share ${toolName}`}
        aria-label={`Share ${toolName}`}
        aria-expanded={open}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600",
          "dark:border-surface-800 dark:text-surface-400 dark:hover:border-primary-700 dark:hover:bg-primary-500/10 dark:hover:text-primary-300",
          dimensions
        )}
        // Don't trigger any outer link/card click.
        data-share-trigger="true"
      >
        <Share2 className={iconSize} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key={`${toolId}-share-popover`}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="menu"
            aria-label="Share options"
            className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-surface-200 bg-white p-1 shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
            // Stop bubbling so parent Link doesn't fire when clicking inside.
            onClick={(e) => e.stopPropagation()}
          >
            <ShareLink
              href={`https://x.com/intent/tweet?text=${encText}&url=${encUrl}`}
              Icon={TwitterIcon}
              label="Share on X"
            />
            <ShareLink
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`}
              Icon={LinkedinIcon}
              label="Share on LinkedIn"
            />
            <ShareLink
              href={`https://api.whatsapp.com/send?text=${encText}%20${encUrl}`}
              Icon={MessageCircle}
              label="WhatsApp"
            />
            <ShareLink
              href={`https://t.me/share/url?url=${encUrl}&text=${encText}`}
              Icon={Send}
              label="Telegram"
            />
            <button
              type="button"
              onClick={copy}
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-surface-700 transition hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success-500" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareLink({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      role="menuitem"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-surface-700 transition hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
