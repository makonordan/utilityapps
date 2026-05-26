"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Image as ImageIcon,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";

import { SearchBar } from "@/components/search/SearchBar";
import { TOOLS, toolCountPhrase } from "@/lib/tools";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const FLOATING_TOOLS = [
  { id: "loan-calculator", icon: Banknote, accent: "from-primary-500 to-accent-500" },
  { id: "compress-image", icon: ImageIcon, accent: "from-accent-500 to-primary-500" },
  { id: "share", icon: Share2, accent: "from-blue-500 to-indigo-600" },
];

const TRUST = [
  { Icon: Sparkles, label: toolCountPhrase() },
  { Icon: CheckCircle2, label: "No signup required" },
  { Icon: ShieldCheck, label: "100% browser-side" },
  { Icon: Smartphone, label: "Mobile friendly" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-16 sm:pt-24">
      <GradientMesh />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 backdrop-blur dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {toolCountPhrase()} · {CATEGORIES.length} categories · 0 signups
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl lg:text-7xl dark:text-white"
        >
          <Balancer>
            Every tool you&apos;ve Googled,{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              free, in one place.
            </span>
          </Balancer>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-base text-surface-600 sm:text-lg dark:text-surface-300"
        >
          <Balancer>
            From mortgage math to image compression, PDF conversion to link sharing —{" "}
            {toolCountPhrase()} that run instantly in your browser. No signup, no uploads
            to strangers, no usage caps.
          </Balancer>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#tools"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            Explore All Tools
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-2xl border border-surface-200 bg-white/70 px-5 py-3 text-sm font-semibold text-surface-800 backdrop-blur transition hover:bg-white dark:border-surface-800 dark:bg-surface-900/60 dark:text-surface-100 dark:hover:bg-surface-900"
          >
            How it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
          className="mt-10"
        >
          <SearchBar />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-surface-500 dark:text-surface-400"
        >
          {TRUST.map(({ Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-primary-500" />
              {label}
            </li>
          ))}
        </motion.ul>
      </div>

      <FloatingToolCards />
    </section>
  );
}

function GradientMesh() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(0,102,255,0.10),transparent_70%)] dark:bg-[radial-gradient(60%_80%_at_50%_0%,rgba(0,102,255,0.18),transparent_70%)]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="ua-orb ua-orb-1" />
        <span className="ua-orb ua-orb-2" />
        <span className="ua-orb ua-orb-3" />
      </div>
      <style jsx>{`
        .ua-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.55;
          will-change: transform;
        }
        :global(.dark) .ua-orb {
          opacity: 0.45;
        }
        .ua-orb-1 {
          top: -120px;
          left: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, #0066ff 0%, transparent 60%);
          animation: ua-drift-1 22s ease-in-out infinite;
        }
        .ua-orb-2 {
          top: 80px;
          right: -120px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, #7c3aed 0%, transparent 60%);
          animation: ua-drift-2 26s ease-in-out infinite;
        }
        .ua-orb-3 {
          bottom: -160px;
          left: 30%;
          width: 460px;
          height: 460px;
          background: radial-gradient(circle, #38bdf8 0%, transparent 60%);
          animation: ua-drift-3 28s ease-in-out infinite;
        }
        @keyframes ua-drift-1 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(40px, 30px, 0) scale(1.08);
          }
        }
        @keyframes ua-drift-2 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-30px, 50px, 0) scale(1.05);
          }
        }
        @keyframes ua-drift-3 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(20px, -40px, 0) scale(0.95);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ua-orb {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

function FloatingToolCards() {
  // Render only after mount. The framer-motion animated cards were producing
  // hydration mismatches under React 19, which then caused the entire page's
  // event handlers (including ToolCard navigation) to be re-attached and
  // briefly miss clicks. Mount-after-effect avoids the SSR/client diff entirely.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto hidden max-w-6xl px-4 sm:px-6 lg:block"
      aria-hidden="true"
    >
      <div className="relative h-0">
        {FLOATING_TOOLS.map((entry, i) => {
          const tool = TOOLS.find((t) => t.id === entry.id);
          if (!tool) return null;
          const positions = [
            "left-[-2rem] top-[-220px] rotate-[-6deg]",
            "right-[-2rem] top-[-180px] rotate-[5deg]",
            "left-1/2 top-[-260px] -translate-x-1/2 rotate-[-2deg]",
          ];
          const Icon = entry.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
              className={cn("absolute w-64", positions[i])}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="rounded-2xl border border-surface-200 bg-white/80 p-4 shadow-card backdrop-blur dark:border-surface-800 dark:bg-surface-900/80"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                      entry.accent
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
                      {tool.name}
                    </p>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400">
                      {tool.category}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-primary-600 dark:text-primary-400">
                  <Zap className="h-3 w-3" />
                  Free • No signup
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        <div className="absolute right-12 top-[-100px] hidden xl:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] font-medium uppercase tracking-wider text-surface-400 dark:text-surface-500"
          >
            <Type className="mb-1 h-3 w-3" /> instant
          </motion.div>
        </div>
      </div>
    </div>
  );
}
