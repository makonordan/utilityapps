import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  /** Pixel size shortcut. Defaults to "sm" (16px). */
  size?: "xs" | "sm" | "md" | "lg";
  /** Optional accessible label. Defaults to "Loading". */
  label?: string;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/**
 * Minimal spinner. Use inside buttons during async actions, or anywhere a
 * lightweight "thinking" indicator is needed. Renders a visually-hidden
 * label by default so screen readers announce the loading state.
 */
export function LoadingSpinner({ size = "sm", label = "Loading", className }: Props) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center", className)}>
      <Loader2 className={cn("animate-spin", SIZE_CLASS[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
