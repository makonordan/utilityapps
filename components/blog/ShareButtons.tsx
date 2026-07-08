"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

import { LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      Icon: TwitterIcon,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Share on LinkedIn",
      Icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share on WhatsApp",
      Icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — fall back to selecting the URL via prompt.
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 text-xs text-surface-600 dark:text-surface-400"
      aria-label="Share this article"
    >
      <span className="font-semibold uppercase tracking-wider">Share</span>
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 transition hover:border-primary-300 hover:text-primary-600 dark:border-surface-800 dark:hover:border-primary-700 dark:hover:text-primary-400"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 font-medium transition",
          copied
            ? "border-success-300 bg-success-50 text-success-700 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300"
            : "border-surface-200 hover:border-primary-300 hover:text-primary-600 dark:border-surface-800 dark:hover:border-primary-700 dark:hover:text-primary-400"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
