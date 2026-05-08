import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const VIDEOS = [
  {
    id: "dQw4w9WgXcQ",
    title: "How to compress images without losing quality",
    duration: "6:42",
  },
  {
    id: "9bZkp7q19f0",
    title: "Loan vs mortgage calculator — which one to use",
    duration: "8:15",
  },
];

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
        {VIDEOS.map((video) => (
          <figure
            key={video.id}
            className="overflow-hidden rounded-2xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-900"
          >
            <div className="relative aspect-video">
              <iframe
                title={video.title}
                src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
                  {video.title}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  <Play className="mr-1 inline h-3 w-3" />
                  {video.duration}
                </p>
              </div>
              <Link
                href={`/youtube/${video.id}`}
                className="text-xs font-semibold text-primary-600 dark:text-primary-400"
              >
                Watch →
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
