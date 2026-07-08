import { Skeleton, SkeletonText, SkeletonToolCard } from "@/components/ui/Skeleton";

/**
 * Global loading boundary. Renders a homepage-shaped skeleton so a navigating
 * user sees structure immediately instead of a blank page.
 */
export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* Hero skeleton */}
      <section className="relative isolate overflow-hidden pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Skeleton className="mx-auto h-6 w-48 rounded-full" />
          <div className="mt-6 space-y-3">
            <Skeleton className="mx-auto h-10 w-3/4 rounded-2xl sm:h-14" />
            <Skeleton className="mx-auto h-10 w-1/2 rounded-2xl sm:h-14" />
          </div>
          <div className="mt-6 space-y-2">
            <SkeletonText width="w-full" />
            <SkeletonText width="w-4/5 mx-auto" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Skeleton className="h-12 w-44 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
          <div className="mt-10">
            <Skeleton className="mx-auto h-14 w-full max-w-2xl rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Trending tools skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-7 w-44 rounded-xl" />
          </div>
          <Skeleton className="hidden h-4 w-20 rounded sm:block" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonToolCard key={i} />
          ))}
        </div>
      </section>

      {/* All-tools grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-56 rounded-xl" />
          <SkeletonText width="w-2/3" />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonToolCard key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
