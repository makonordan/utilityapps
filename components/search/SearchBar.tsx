"use client";

import { useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "loan calculator",
  "compress image",
  "BMI calculator",
  "PDF to Word",
  "QR code",
  "JSON formatter",
  "tip calculator",
  "currency converter",
];

function openModalWithQuery(query: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("open-search-modal", { detail: { query } })
  );
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) {
      openModalWithQuery("");
      return;
    }
    openModalWithQuery(query.trim());
  }

  return (
    <div className={cn("mx-auto w-full max-w-2xl text-center", className)}>
      <form
        onSubmit={onSubmit}
        role="search"
        className="group relative flex items-center rounded-2xl border border-surface-200 bg-white shadow-card transition focus-within:border-primary-400 focus-within:shadow-glow dark:border-surface-800 dark:bg-surface-900"
      >
        <span className="pointer-events-none flex h-14 w-12 items-center justify-center text-surface-400">
          <Search className="h-5 w-5" />
        </span>
        <label htmlFor="hero-search" className="sr-only">
          Search UtilityApps
        </label>
        <input
          id="hero-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, articles, and products..."
          autoComplete="off"
          className="h-14 flex-1 bg-transparent pr-2 text-base text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-white"
        />
        <button
          type="submit"
          className="m-1.5 inline-flex h-11 items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:from-primary-600 hover:to-accent-600"
        >
          <Sparkles className="h-4 w-4" />
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-surface-500 dark:text-surface-400">
        <span className="font-medium uppercase tracking-wider">Popular:</span>
        {POPULAR_SEARCHES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => openModalWithQuery(q)}
            className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
