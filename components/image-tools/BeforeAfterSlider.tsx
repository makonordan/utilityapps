"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Initial position 0..100, defaults to 50. */
  initialPosition?: number;
  className?: string;
}

/**
 * Comparison slider with mouse + touch + keyboard support.
 *
 * The "after" image sits underneath at full opacity and the "before" image
 * is layered on top, clipped from the right by `clip-path: inset(0 X% 0 0)`
 * so dragging right reveals more of the after image.
 */
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() =>
    Math.min(100, Math.max(0, initialPosition))
  );
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // Pointer Events unify mouse + touch + pen on every modern browser.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-xl border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-800",
        "touch-none cursor-ew-resize",
        className
      )}
    >
      {/* AFTER (bottom layer, always fully visible underneath) */}
      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt={afterLabel}
          draggable={false}
          className="block h-auto w-full select-none"
        />
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow">
          {afterLabel}
        </span>
      </div>

      {/* BEFORE (top layer, clipped) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={beforeLabel}
          draggable={false}
          className="block h-full w-full select-none object-cover"
        />
        <span className="pointer-events-auto absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow">
          {beforeLabel}
        </span>
      </div>

      {/* Divider line + handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Reveal slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={onKeyDown}
        className="absolute top-0 z-10 flex h-full -translate-x-1/2 items-center justify-center focus:outline-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-surface-700 shadow-lg ring-1 ring-black/10 transition group-hover:scale-105 dark:bg-surface-900 dark:text-surface-100">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
