import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe2,
  HeartHandshake,
  LayoutGrid,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG, formatNumber } from "@/lib/utils";

const TITLE = `About ${SITE_CONFIG.name} — Free Tools for Everyone`;
const DESCRIPTION =
  "Why we built UtilityApps, what we believe about productivity software, and how we keep hundreds of tools free for the world.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/about`,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
};

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Privacy first",
    body: "Most tools run entirely in your browser. Your inputs and files never leave your device.",
  },
  {
    Icon: Zap,
    title: "Instant by default",
    body: "No signup, no upload limits, no waiting. Click a tool, use a tool, move on.",
  },
  {
    Icon: HeartHandshake,
    title: "Free, forever",
    body: "Optional ads and curated affiliate products fund the Service. The tools themselves stay free.",
  },
  {
    Icon: Lightbulb,
    title: "Designed to teach",
    body: "Every calculator shows the formula. Every article explains why the answer is the answer.",
  },
];

const STATS = [
  // "+" only appears once the catalog actually crosses 200 — until then
  // the count counts up to the real number so the claim stays honest.
  {
    Icon: Sparkles,
    value: TOOLS.length >= 200 ? "200+" : String(TOOLS.length),
    label: "tools live",
  },
  { Icon: LayoutGrid, value: String(CATEGORIES.length), label: "categories" },
  { Icon: Globe2, value: "Worldwide", label: "no geo-locks" },
  { Icon: CheckCircle2, value: "100%", label: "free, no signup" },
];

const STACK = [
  { name: "Next.js", role: "App framework" },
  { name: "React 19", role: "UI library" },
  { name: "TypeScript", role: "Type system" },
  { name: "Tailwind CSS", role: "Styling" },
  { name: "Supabase", role: "Database" },
  { name: "Vercel", role: "Hosting + CDN" },
  { name: "OpenAI", role: "AI search" },
  { name: "Resend", role: "Email" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c") }}
      />

      <Hero />

      <Stats />

      <Values />

      <Categories />

      <Team />

      <Stack />

      <CtaBlock />
    </>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
          About
        </li>
      </ol>
    </nav>
  );
}

function Hero() {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-12 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumb />
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          <Sparkles className="h-3.5 w-3.5" />
          About UtilityApps
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          We build free tools for the world
        </h1>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-surface-600 sm:text-lg dark:text-surface-300">
          <p>
            Most online tools want your email before they&apos;ll do anything useful. We took the
            opposite bet: build the calculators, converters, and writing aids people actually
            need, make them work in five seconds, and never ask for a signup. The result is{" "}
            {SITE_CONFIG.name} — a growing library of {TOOLS.length}+ free utility tools used by
            tens of thousands of people every month.
          </p>
          <p>
            Our mission is simple: take everyday tasks that involve a calculator, a converter, or
            a quick text transform, and make them so fast that pulling out your phone for the
            same task feels slower. Every tool runs in your browser where possible, ships with
            the underlying formula visible, and stays free forever.
          </p>
          <p>
            We pay for the tools the way the internet has always worked best — through tasteful,
            non-intrusive advertising and curated affiliate recommendations for digital products
            we genuinely use. We don&apos;t sell data, we don&apos;t paywall features, and we
            don&apos;t pretend to be neutral about products we recommend (see our{" "}
            <Link href="/affiliate-disclosure" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
              affiliate disclosure
            </Link>
            ).
          </p>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {STATS.map((stat) => (
          <li
            key={stat.label}
            className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <stat.Icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Values() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Why UtilityApps
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Four things we hold above all else
        </h2>
      </header>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <li
            key={value.title}
            className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <value.Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-3 text-base font-semibold text-surface-900 dark:text-white">
              {value.title}
            </h3>
            <p className="mt-1.5 text-sm text-surface-600 dark:text-surface-400">{value.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          What we build
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          {numberWord(CATEGORIES.length)} categories, all free
        </h2>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link
              href={`/tools/categories/${c.id}`}
              className="group flex h-full items-start gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: c.color }}
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-surface-900 dark:text-white">
                  {c.name}
                  <span className="ml-1.5 text-[11px] font-normal text-surface-500 dark:text-surface-400">
                    {formatNumber(c.toolCount)}
                  </span>
                </span>
                <span className="mt-1 line-clamp-2 text-xs text-surface-600 dark:text-surface-400">
                  {c.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Team() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        Who we are
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
        A small team passionate about productivity
      </h2>
      <p className="mt-4 text-base leading-relaxed text-surface-600 dark:text-surface-300">
        UtilityApps is built by a small group of engineers, writers, and designers who use these
        tools every day. We answer support emails ourselves, write the articles ourselves, and
        prioritize what to build next based on what we and the community keep reaching for.
      </p>
      <p className="mt-3 text-base leading-relaxed text-surface-600 dark:text-surface-300">
        Have a feature you wish existed?{" "}
        <Link href="/contact" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Tell us about it
        </Link>
        . We ship the most-requested tools first.
      </p>
    </section>
  );
}

function Stack() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Built with
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          The stack behind UtilityApps
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-surface-600 dark:text-surface-300">
          We&apos;re fans of boring, dependable, well-documented tools. This is the stack as of
          today — it changes when the next thing earns the swap.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STACK.map((item) => (
          <li
            key={item.name}
            className="rounded-2xl border border-surface-200 bg-white p-4 text-center dark:border-surface-800 dark:bg-surface-900"
          >
            <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.name}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {item.role}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaBlock() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-surface-800 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950 p-8 text-center text-white sm:p-12"
        style={{ backgroundColor: "#020617" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,102,255,0.4),rgba(124,58,237,0.4))] opacity-30 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start using tools for free
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-surface-200">
            No signup. No downloads. Pick a tool from any category and start in five seconds.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
            >
              Browse all tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Spell out small numbers so the hero copy reads naturally; fall back to
// digits past twenty since "Twenty-three" feels worse than "23" in a heading.
const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];
function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}
