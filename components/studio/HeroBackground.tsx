"use client";

import { motion } from "framer-motion";

/**
 * Subtle animated background for the Studio hero — a few floating
 * geometric shapes drifting at different speeds. Intentionally quiet:
 * the headline and CTA are the focal points, not the animation.
 *
 * Client component because Framer Motion's `animate` prop is RSC-incompatible.
 * The parent hero stays a server component so the headline + CTA still
 * appear in the SSR HTML (good for crawlers + perceived load speed).
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Shape
        className="left-[-4rem] top-12 h-72 w-72 bg-gradient-to-br from-primary-400/30 to-accent-400/20"
        style={{ borderRadius: "60% 40% 50% 50%" }}
        duration={18}
        offset={20}
      />
      <Shape
        className="right-[-6rem] top-32 h-96 w-96 bg-gradient-to-br from-accent-400/25 to-primary-500/15"
        style={{ borderRadius: "50% 50% 40% 60%" }}
        duration={22}
        offset={-25}
      />
      <Shape
        className="bottom-[-5rem] left-1/3 h-80 w-80 bg-gradient-to-tr from-primary-500/15 to-accent-300/20"
        style={{ borderRadius: "55% 45% 60% 40%" }}
        duration={26}
        offset={15}
      />
    </div>
  );
}

function Shape({
  className,
  style,
  duration,
  offset,
}: {
  className: string;
  style: React.CSSProperties;
  duration: number;
  offset: number;
}) {
  return (
    <motion.div
      className={`absolute blur-3xl ${className}`}
      style={style}
      animate={{
        y: [0, offset, 0],
        x: [0, offset / 2, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
