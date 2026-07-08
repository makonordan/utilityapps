"use client";

import { useMemo, useState } from "react";

import { ToolCard } from "@/components/tools/ToolCard";
import { VideoCard } from "@/components/youtube/VideoCard";
import { TOOLS_BY_ID } from "@/lib/tools";
import { type Video, VIDEO_CATEGORIES } from "@/lib/videos";
import { cn } from "@/lib/utils";

export function VideoHub({ videos }: { videos: Video[] }) {
  const [filter, setFilter] = useState<Video["category"] | null>(null);

  const visible = useMemo(
    () => (filter ? videos.filter((v) => v.category === filter) : videos),
    [videos, filter]
  );

  const relatedTools = useMemo(() => {
    const seen = new Set<string>();
    const list = [];
    for (const v of visible) {
      if (!v.toolId || seen.has(v.toolId)) continue;
      const tool = TOOLS_BY_ID[v.toolId];
      if (!tool) continue;
      seen.add(v.toolId);
      list.push(tool);
    }
    return list;
  }, [visible]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav
        aria-label="Filter by video category"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <Chip active={filter === null} onClick={() => setFilter(null)} label={`All (${videos.length})`} />
        {VIDEO_CATEGORIES.map((cat) => {
          const count = videos.filter((v) => v.category === cat).length;
          return (
            <Chip
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              label={`${cat} (${count})`}
            />
          );
        })}
      </nav>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-surface-200 p-10 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
          No videos in this category yet. Check back soon — we ship a new tutorial every week.
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      )}

      {relatedTools.length > 0 && (
        <section className="mt-16 space-y-5">
          <header>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              From the videos
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Related tools
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Try the tools featured in {filter ? `${filter}` : "the videos"} above — free, no signup.
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary-500 bg-primary-500 text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
      )}
    >
      {label}
    </button>
  );
}
