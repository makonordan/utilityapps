import {
  ArrowUpRight,
  Banknote,
  Bot,
  Eye,
  type LucideIcon,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

import { LiteYouTube } from "@/components/youtube/LiteYouTube";
import { type Video, watchUrl } from "@/lib/videos";
import { cn, formatDate } from "@/lib/utils";

const CATEGORY_GRADIENT: Record<Video["category"], string> = {
  Tools: "from-primary-500 to-accent-500",
  Productivity: "from-accent-500 to-primary-500",
  Finance: "from-success-500 to-primary-500",
  "AI & Automation": "from-warning-500 to-accent-500",
};

const CATEGORY_TONE: Record<Video["category"], string> = {
  Tools: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300",
  Productivity: "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300",
  Finance: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300",
  "AI & Automation": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300",
};

const CATEGORY_ICON: Record<Video["category"], LucideIcon> = {
  Tools: Wrench,
  Productivity: Zap,
  Finance: Banknote,
  "AI & Automation": Bot,
};

/**
 * Pre-render the category icon as JSX. Server Components can serialize JSX
 * across the RSC boundary but cannot pass raw component (function) refs to
 * Client Components. LiteYouTube is `'use client'`, so we hand it a node.
 */
function renderCategoryIcon(category: Video["category"]) {
  const Icon = CATEGORY_ICON[category] ?? Sparkles;
  return <Icon strokeWidth={1.2} />;
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900">
      <div className="relative">
        <LiteYouTube
          videoId={video.id}
          title={video.title}
          thumbnail={video.thumbnail}
          fallbackGradient={CATEGORY_GRADIENT[video.category]}
          fallbackIconNode={renderCategoryIcon(video.category)}
          fallbackEyebrow={video.category}
        />
        {video.duration && (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {video.duration}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              CATEGORY_TONE[video.category]
            )}
          >
            {video.category}
          </span>
          {video.views && (
            <span className="inline-flex items-center gap-1 text-[11px] text-surface-500 dark:text-surface-400">
              <Eye className="h-3 w-3" />
              {video.views} views
            </span>
          )}
        </div>
        <h3 className="mt-2 text-base font-semibold leading-snug">
          <a
            href={watchUrl(video.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-surface-900 transition hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
          >
            {video.title}
          </a>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-surface-600 dark:text-surface-400">
          {video.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-surface-500 dark:text-surface-400">
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
          <a
            href={watchUrl(video.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary-600 transition group-hover:gap-1.5 dark:text-primary-400"
          >
            Watch on YouTube
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
