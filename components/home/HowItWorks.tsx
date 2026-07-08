"use client";

import { motion } from "framer-motion";
import { Bookmark, Search, Zap } from "lucide-react";

const STEPS = [
  {
    n: "01",
    Icon: Search,
    title: "Search or browse",
    body: "Find the tool you need in seconds. Use the AI-powered search bar, the trending list, or browse by category.",
  },
  {
    n: "02",
    Icon: Zap,
    title: "Use instantly",
    body: "No signup, no downloads, no credit card. Most tools run entirely in your browser, so your files stay on your device.",
  },
  {
    n: "03",
    Icon: Bookmark,
    title: "Bookmark favorites",
    body: "Save the tools you use most. Your bookmarks travel with you on the same device — anonymous, no account needed.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Three steps. No friction.
        </h2>
        <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
          We removed every step that gets between you and the work — including ourselves.
        </p>
      </header>

      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map(({ n, Icon, title, body }, i) => (
          <motion.li
            key={n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white p-6 shadow-card dark:border-surface-800 dark:bg-surface-900"
          >
            <span className="font-mono text-5xl font-bold text-primary-100 dark:text-primary-500/15">
              {n}
            </span>
            <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">{body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
