"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Send, Star } from "lucide-react";

import { cn, SITE_CONFIG } from "@/lib/utils";

const SHARE_TEXT = `I keep using UtilityApps — hundreds of free, no-signup, browser-side utilities. Worth a look: ${SITE_CONFIG.url}`;

const REVIEW_LINKS = [
  {
    label: "Review on Product Hunt",
    href: `https://www.producthunt.com/posts/utilityapps`,
  },
  {
    label: "Review on AlternativeTo",
    href: `https://alternativeto.net/software/utilityapps/`,
  },
];

export function HelpFreeActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ShareCard />
      <ReviewCard />
      <LinkBackCard />
    </div>
  );
}

function ShareCard() {
  const [copied, setCopied] = useState(false);

  const tweetHref = `https://x.com/intent/post?text=${encodeURIComponent(SHARE_TEXT)}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`;
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(SITE_CONFIG.url)}&text=${encodeURIComponent("Free utility tools, no signup.")}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers / blocked clipboard: do nothing visible.
    }
  };

  return (
    <Card title="Share with a friend" body="Most growth comes from one-on-one recommendations. One person, one share.">
      <div className="mt-3 grid grid-cols-2 gap-2">
        <ShareBtn href={tweetHref} label="X / Twitter" icon={<XIcon />} />
        <ShareBtn href={waHref} label="WhatsApp" icon={<MessageCircle className="h-3.5 w-3.5" />} />
        <ShareBtn href={tgHref} label="Telegram" icon={<Send className="h-3.5 w-3.5" />} />
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-200 px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:bg-primary-500/5"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy link
            </>
          )}
        </button>
      </div>
    </Card>
  );
}

function ReviewCard() {
  return (
    <Card
      title="Leave a review"
      body="Reviews on third-party directories are how strangers discover UtilityApps. Honest words help most."
    >
      <ul className="mt-3 space-y-2">
        {REVIEW_LINKS.map((r) => (
          <li key={r.href}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 underline-offset-2 hover:underline dark:text-primary-300"
            >
              <Star className="h-3.5 w-3.5" /> {r.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function LinkBackCard() {
  const snippet = `<a href="${SITE_CONFIG.url}">UtilityApps</a>`;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <Card
      title="Link back from your site"
      body="If you write a blog, run a newsletter, or make YouTube videos, link to a tool you actually use."
    >
      <code className="mt-3 block overflow-x-auto rounded-xl bg-surface-100 px-3 py-2 text-[11px] text-surface-700 dark:bg-surface-800 dark:text-surface-200">
        {snippet}
      </code>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "mt-2 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition",
          copied
            ? "border-success-300 text-success-700 dark:border-success-700 dark:text-success-300"
            : "border-surface-200 text-surface-700 hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700"
        )}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy snippet
          </>
        )}
      </button>
    </Card>
  );
}

function Card({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">{body}</p>
      {children}
    </div>
  );
}

function ShareBtn({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-200 px-3 py-2 text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:bg-primary-500/5"
    >
      {icon}
      {label}
    </a>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
