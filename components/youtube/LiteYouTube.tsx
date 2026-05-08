"use client";

import { useState, type ReactNode } from "react";
import { Play } from "lucide-react";

import { embedUrl } from "@/lib/videos";
import { cn } from "@/lib/utils";

interface Props {
  videoId: string;
  title: string;
  thumbnail: string;
  /** Tailwind gradient fallback when the YouTube thumbnail 404s. */
  fallbackGradient?: string;
  /** Pre-rendered icon JSX shown as a watermark on the fallback gradient.
   *  Must be a ReactNode (not a ComponentType) — RSC can serialize JSX
   *  but not raw function references across the server/client boundary. */
  fallbackIconNode?: ReactNode;
  /** Subtitle (usually the video category) shown above the title on the fallback. */
  fallbackEyebrow?: string;
  className?: string;
}

export function LiteYouTube({
  videoId,
  title,
  thumbnail,
  fallbackGradient = "from-primary-500 to-accent-500",
  fallbackIconNode,
  fallbackEyebrow,
  className,
}: Props) {
  const [active, setActive] = useState(false);
  const [thumbBroken, setThumbBroken] = useState(false);

  if (active) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
        <iframe
          src={embedUrl(videoId, true)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Play: ${title}`}
      onClick={() => setActive(true)}
      className={cn(
        "group relative aspect-video w-full cursor-pointer overflow-hidden bg-surface-900",
        className
      )}
    >
      {!thumbBroken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setThumbBroken(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        // YouTube thumbnail 404'd — render a designed fallback "template"
        // that still feels like a video card: gradient bg, large category
        // watermark, eyebrow + truncated title, dotted texture.
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 bg-gradient-to-br", fallbackGradient)}
        >
          {/* Subtle dotted texture overlay */}
          <span
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* Large faded brand mark — pre-rendered JSX from the parent. */}
          {fallbackIconNode && (
            <span className="absolute -right-6 -top-6 opacity-25 [&>svg]:h-48 [&>svg]:w-48 [&>svg]:text-white">
              {fallbackIconNode}
            </span>
          )}
          {/* Title block, bottom-left */}
          <span className="absolute bottom-4 left-4 right-4 text-left">
            {fallbackEyebrow && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                {fallbackEyebrow}
              </span>
            )}
            <span className="mt-1 line-clamp-2 text-base font-semibold leading-tight text-white sm:text-lg">
              {title}
            </span>
          </span>
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-surface-900 shadow-2xl transition-transform duration-200 group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </span>
    </button>
  );
}
