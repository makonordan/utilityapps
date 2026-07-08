import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton primitive — a shimmering placeholder block.
 *
 * The Tailwind config exposes `animate-shimmer` and `bg-shimmer-gradient`
 * (added in step 1). This component layers them over a neutral surface tint
 * so the shimmer is visible in both light and dark mode.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 animate-shimmer bg-shimmer-gradient"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
}

/** A single line of placeholder text. Optionally takes a width modifier. */
export function SkeletonText({
  className,
  width = "w-full",
}: SkeletonProps & { width?: string }) {
  return <Skeleton className={cn("h-3.5", width, className)} />;
}

/** A standard card skeleton: image area + 2 lines of text + footer. */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900",
        className
      )}
    >
      <SkeletonImage className="h-32 rounded-xl" />
      <SkeletonText width="w-3/4" />
      <SkeletonText width="w-full" />
      <SkeletonText width="w-5/6" />
      <div className="mt-2 flex items-center justify-between">
        <SkeletonText width="w-1/3" className="h-3" />
        <SkeletonText width="w-12" className="h-3" />
      </div>
    </div>
  );
}

/** Image-shaped skeleton (default 5:3 aspect ratio). */
export function SkeletonImage({ className }: SkeletonProps) {
  return <Skeleton className={cn("aspect-[5/3] w-full", className)} />;
}

/** Tool-card sized skeleton — same footprint as <ToolCard /> for grid use. */
export function SkeletonToolCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900",
        className
      )}
    >
      <span className="block h-1 w-full bg-surface-200 dark:bg-surface-800" />
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-1/3" className="h-2.5" />
            <SkeletonText width="w-2/3" />
          </div>
        </div>
        <SkeletonText width="w-full" />
        <SkeletonText width="w-11/12" />
        <SkeletonText width="w-3/4" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-surface-100 p-4 pt-3 dark:border-surface-800">
        <SkeletonText width="w-20" className="h-3" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}
