"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

interface Props {
  toolId: string;
  className?: string;
  size?: "sm" | "md";
}

export function BookmarkButton({ toolId, className, size = "md" }: Props) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(toolId);

  const dimensions = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(toolId);
      }}
      whileTap={{ scale: 0.85 }}
      title={saved ? "Saved" : "Save tool"}
      aria-label={saved ? "Remove bookmark" : "Save tool"}
      aria-pressed={saved}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border transition",
        dimensions,
        saved
          ? "border-warning-300 bg-warning-50 text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300"
          : "border-surface-200 text-surface-400 hover:border-warning-300 hover:bg-warning-50 hover:text-warning-500 dark:border-surface-800 dark:text-surface-500 dark:hover:border-warning-500/40 dark:hover:bg-warning-500/10 dark:hover:text-warning-300",
        className
      )}
    >
      <motion.span
        key={saved ? "saved" : "unsaved"}
        initial={false}
        animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="flex"
      >
        <Heart className={cn(iconSize, saved && "fill-current")} aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}
