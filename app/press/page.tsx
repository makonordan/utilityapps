import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG, formatNumber } from "@/lib/utils";

const TITLE = `Press Kit — ${SITE_CONFIG.name}`;
const DESCRIPTION = `Press kit, brand assets, founder bio, and pitch lengths for ${SITE_CONFIG.name}. For journalists, reviewers, and newsletter curators.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/press" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/press`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

const PRESS_EMAIL = "hello@utilityapps.site";

const PITCH_ONE_LINER =
  `${SITE_CONFIG.name} — hundreds of free utility tools, no signup, runs in your browser.`;

const PITCH_TWO_SENTENCES =
  `${SITE_CONFIG.name} is a free-tools platform with more than ${TOOLS.length} utilities across PDF, image, video, audio, design, developer, productivity, student, legal, language, sleep, and travel categories. Most tools run entirely in the browser — no signup, no daily cap, and no Pro upsell.`;

const PITCH_PARAGRAPH =
  `${SITE_CONFIG.name} is a privacy-first free-tools platform built by Daniel Makonor under the Neospace Tech brand. It packs more than ${TOOLS.length} utilities — from PDF merging and image compression to citation generators and noise mixers — into a single fast-loading site. The product thesis is simple: tools that should be free, with no signup, no usage caps, and no Pro upsell. Most tools run entirely client-side so files never leave the user's browser. The site is monetized through tasteful display ads on surrounding pages and optional digital products, never by gating the tools themselves.`;

const BRAND_COLORS = [
  { name: "Brand Navy", hex: "#0E1A2B" },
  { name: "Brand Gold", hex: "#D4A24C" },
  { name: "Brand Emerald", hex: "#10A37F" },
];

const BRAND_ASSETS = [
  {
    label: "Logo — full lockup (SVG)",
    href: "/brand/utilityapps-logo-full.svg",
    bytes: "SVG",
  },
  {
    label: "Logo — mark only (SVG)",
    href: "/brand/utilityapps-logo-mark.svg",
    bytes: "SVG",
  },
  {
    label: "Site icon (SVG)",
    href: "/icon.svg",
    bytes: "SVG",
  },
];

const SOCIAL_LINKS = [
  { label: "X / Twitter", href: "https://x.com/UtilityAppsSite" },
  { label: "Founder on X", href: "https://x.com/makonordaniel" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/utilityapps/" },
  { label: "Instagram", href: "https://www.instagram.com/utilityappssite" },
  { label: "YouTube", href: "https://www.youtube.com/@UtilityAppsSite" },
  { label: "Founder Telegram", href: "https://t.me/+RRgbsAjhnuFlYWY8" },
];

const FOUNDER_NAME = "Daniel Makonor";
const FOUNDER_BIO =
  "Daniel Makonor is the founder of Neospace Tech and the operator behind UtilityApps. ~10 years in software, starting as a software engineer and data engineer, now operating as a software project manager and business analyst. Ships across telecoms, finance, oil and gas, healthcare, education, no-code, compliance, and public sector.";

export default function PressPage() {
  const toolsCount = TOOLS.length;
  const categoriesCount = CATEGORIES.length;
  const totalSearches = TOOLS.reduce((sum, t) => sum + (t.monthlySearches ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">Press kit</span>
      </nav>

      <header className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          For journalists & reviewers
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          {SITE_CONFIG.name} Press Kit
        </h1>
        <p className="mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          {PITCH_ONE_LINER} This page has the assets, pitch lengths, stats, and contact you
          need to write about us.
        </p>
        <a
          href={`mailto:${PRESS_EMAIL}?subject=Press%20inquiry%20—%20${encodeURIComponent(SITE_CONFIG.name)}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email press team
        </a>
      </header>

      <Section title="At a glance">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Tools live" value={formatNumber(toolsCount)} />
          <Stat label="Categories" value={String(categoriesCount)} />
          <Stat label="Combined keyword volume" value={`${formatNumber(totalSearches)}/mo`} />
        </div>
      </Section>

      <Section title="Pitch — three lengths">
        <PitchBlock label="One-liner" value={PITCH_ONE_LINER} />
        <PitchBlock label="Two sentences" value={PITCH_TWO_SENTENCES} />
        <PitchBlock label="Paragraph" value={PITCH_PARAGRAPH} />
      </Section>

      <Section title="Founder">
        <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">
            {FOUNDER_NAME}
            <span className="ml-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              Founder, Neospace Tech
            </span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
            {FOUNDER_BIO}
          </p>
          <p className="mt-4 text-xs text-surface-500 dark:text-surface-400">
            Single social handle:{" "}
            <a
              href="https://x.com/makonordaniel"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-semibold text-primary-700 hover:underline dark:text-primary-300"
            >
              @makonordaniel
            </a>{" "}
            (X, LinkedIn, Instagram, TikTok, YouTube)
          </p>
        </div>
      </Section>

      <Section title="Brand assets">
        <ul className="grid gap-2 sm:grid-cols-2">
          {BRAND_ASSETS.map((asset) => (
            <li key={asset.href}>
              <a
                href={asset.href}
                download
                className="group flex items-center justify-between gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 transition hover:border-primary-300 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-surface-900 dark:text-white">
                    {asset.label}
                  </span>
                  <span className="block text-[11px] text-surface-500 dark:text-surface-400">
                    {asset.bytes}
                  </span>
                </span>
                <Download
                  className="h-4 w-4 shrink-0 text-surface-400 transition group-hover:text-primary-600 dark:group-hover:text-primary-400"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Brand colors">
        <ul className="grid gap-3 sm:grid-cols-3">
          {BRAND_COLORS.map((color) => (
            <li
              key={color.hex}
              className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800"
            >
              <div
                className="h-16 w-full"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <div className="bg-white px-3 py-2 text-xs dark:bg-surface-900">
                <p className="font-semibold text-surface-900 dark:text-white">
                  {color.name}
                </p>
                <p className="font-mono text-surface-500 dark:text-surface-400">
                  {color.hex}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Trust & privacy posture">
        <ul className="space-y-2 text-sm text-surface-700 dark:text-surface-200">
          {[
            "Most tools run entirely in the browser — files never uploaded.",
            "No signup required for any tool.",
            "No daily limits, no Pro tier, no usage caps.",
            "Monetized through display ads on surrounding pages and optional digital products — never by gating tools.",
            "Where a tool genuinely needs server-side processing (e.g. Office↔PDF conversion, background removal), the upload is over HTTPS and the file is deleted immediately after the result is returned.",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-500"
                aria-hidden="true"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Embed a tool on your site">
        <p className="mb-4 text-sm text-surface-700 dark:text-surface-200">
          A growing set of {SITE_CONFIG.name} tools can be embedded in any
          article, tutorial, or docs site via a one-line iframe. The
          embedded surface has no nav or footer — just the tool — with a
          small &ldquo;Powered by {SITE_CONFIG.name}&rdquo; attribution in
          the corner.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-surface-200 bg-surface-50 p-4 text-xs dark:border-surface-800 dark:bg-surface-900">
          <pre className="whitespace-pre-wrap break-all font-mono text-surface-800 dark:text-surface-200">
            {`<iframe
  src="${SITE_CONFIG.url}/embed/uuid-generator"
  width="100%"
  height="600"
  frameborder="0"
  loading="lazy"
  title="UUID Generator by ${SITE_CONFIG.name}"
></iframe>`}
          </pre>
        </div>
        <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
          Available tool IDs at launch: <span className="font-mono">uuid-generator</span>,{" "}
          <span className="font-mono">hash-generator</span>,{" "}
          <span className="font-mono">color-converter</span>,{" "}
          <span className="font-mono">regex-tester</span>,{" "}
          <span className="font-mono">contrast-checker</span>,{" "}
          <span className="font-mono">gradient-generator</span>. More
          coming — request one at {PRESS_EMAIL}.
        </p>
      </Section>

      <Section title="Socials">
        <ul className="grid gap-2 sm:grid-cols-2">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:bg-primary-500/5"
              >
                {s.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Press contact">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 text-sm dark:border-surface-800 dark:bg-surface-900/40">
          <p className="text-surface-700 dark:text-surface-200">
            For interviews, early access, or fact-checking, email:
          </p>
          <a
            href={`mailto:${PRESS_EMAIL}?subject=Press%20inquiry%20—%20${encodeURIComponent(SITE_CONFIG.name)}`}
            className="mt-2 inline-flex items-center gap-2 font-mono text-base font-semibold text-primary-700 hover:underline dark:text-primary-300"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {PRESS_EMAIL}
          </a>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-lg font-bold text-surface-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
    </div>
  );
}

function PitchBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
        {value}
      </p>
    </div>
  );
}
