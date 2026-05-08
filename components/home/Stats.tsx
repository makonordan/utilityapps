"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { label: "Tools", value: 200, suffix: "+" },
  { label: "Users", value: 50000, suffix: "+" },
  { label: "Signups Required", value: 0 },
  { label: "Free Forever", value: 100, suffix: "%" },
];

const DURATION_MS = 1400;

export function Stats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!ref.current || animate) return;
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAnimate(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [animate]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950 p-8 text-white sm:p-12 dark:from-black dark:via-surface-950 dark:to-black"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,102,255,0.4),rgba(124,58,237,0.4),rgba(0,102,255,0.4))] opacity-30 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
        />
        <div className="relative grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold tracking-tight sm:text-5xl">
                {stat.prefix}
                <Counter to={stat.value} animate={animate} />
                {stat.suffix}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-surface-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to, animate }: { to: number; animate: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    if (to === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, to]);

  return <>{value.toLocaleString()}</>;
}
