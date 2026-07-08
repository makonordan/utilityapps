import { AdUnit, type AdFormat } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

export type AdPosition = "top" | "mid" | "bottom" | "sidebar" | "in-article";

interface PositionConfig {
  envVar: string;
  fallback: string;
  format: AdFormat;
  layoutKey?: string;
}

/**
 * Slot ID resolution: each position reads from a NEXT_PUBLIC env var so the
 * IDs can be configured per environment without a code change. The `fallback`
 * values are obvious sentinels so dev placeholders show a recognizable label.
 */
const POSITIONS: Record<AdPosition, PositionConfig> = {
  top: {
    envVar: "NEXT_PUBLIC_ADSENSE_SLOT_TOP",
    fallback: "DEV-TOP",
    format: "horizontal",
  },
  mid: {
    envVar: "NEXT_PUBLIC_ADSENSE_SLOT_MID",
    fallback: "DEV-MID",
    format: "rectangle",
  },
  bottom: {
    envVar: "NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM",
    fallback: "DEV-BOTTOM",
    format: "horizontal",
  },
  sidebar: {
    envVar: "NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR",
    fallback: "DEV-SIDEBAR",
    format: "vertical",
  },
  "in-article": {
    envVar: "NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE",
    fallback: "DEV-IN-ARTICLE",
    format: "fluid",
    layoutKey: "-fb+5w+4e-db+86",
  },
};

interface Props {
  position: AdPosition;
  /** Override the format derived from `position` (rare). */
  format?: AdFormat;
  className?: string;
}

/** Position-aware wrapper around <AdUnit/>. Use this everywhere; let the
 *  position name do the talking, not raw slot IDs. */
export function AdSlot({ position, format, className }: Props) {
  const config = POSITIONS[position];
  const slotId =
    (typeof process !== "undefined" && process.env[config.envVar]) || config.fallback;

  return (
    <AdSlotShell position={position} className={className}>
      <AdUnit slot={slotId} format={format ?? config.format} layoutKey={config.layoutKey} />
    </AdSlotShell>
  );
}

/** Adds default vertical spacing per placement so callers don't have to. */
function AdSlotShell({
  position,
  className,
  children,
}: {
  position: AdPosition;
  className?: string;
  children: React.ReactNode;
}) {
  const spacing =
    position === "in-article" ? "my-10" : position === "sidebar" ? "my-0" : "my-8";
  return <div className={cn(spacing, className)}>{children}</div>;
}
