import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

/**
 * Featured tutorials on the homepage. Titles/durations aren't hardcoded
 * — the YouTube player renders the video's canonical title on hover and
 * on click, so we stay in sync with whatever the channel decides to call
 * a video without needing to touch this file.
 */
const VIDEO_IDS = ["w8A2PZgfZEk", "P0dpWIAa1JY"] as const;

export function YouTubeHub() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            Learn with Video Tutorials
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Two-minute walkthroughs of the tools that move money, time, and pixels.
          </p>
        </div>
        <Link
          href="/youtube"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          Watch all tutorials
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {VIDEO_IDS.map((id) => (
          <figure
            key={id}
            className="overflow-hidden rounded-2xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-900"
          >
            <div className="relative aspect-video">
              <iframe
                title="UtilityApps tutorial"
                src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 p-4">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                <Play className="mr-1 inline h-3 w-3" />
                From the UtilityApps YouTube channel
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400"
              >
                Watch on YouTube →
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
