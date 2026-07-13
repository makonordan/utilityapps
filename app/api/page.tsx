import type { Metadata } from "next";
import Link from "next/link";
import {
  Cloud,
  Code2,
  FileText,
  Globe2,
  Image as ImageIcon,
  Lock,
  ScrollText,
  Share2,
  Zap,
} from "lucide-react";

import { WaitlistForm } from "@/components/api-waitlist/WaitlistForm";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Free Tools API — Coming Soon, Join Waitlist";
const DESCRIPTION =
  "Every UtilityApps tool, available as a programmable API. PDF, image, audio, " +
  "legal docs, link shortening, file sharing — call it from your backend. Join " +
  "the waitlist to help shape the alpha.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "tools API",
    "PDF processing API",
    "image processing API",
    "developer API waitlist",
  ],
  alternates: { canonical: "/api" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/api`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

const ENDPOINT_TEASERS = [
  { Icon: FileText, title: "PDF endpoints", body: "Merge, split, rotate, watermark, compress, sign — what the in-browser PDF tools do, callable from your backend." },
  { Icon: ImageIcon, title: "Image endpoints", body: "Compress, resize, convert, watermark, remove background — wired to the same engines as the web tools." },
  { Icon: ScrollText, title: "Document generation", body: "Privacy policies, terms of service, NDAs, freelance contracts — generate to PDF / Word via a single POST." },
  { Icon: Share2, title: "Sharing + shortener", body: "Programmatic link shortening + text/file share. Same auto-expiry, password, view-limit options as the UI tool." },
  { Icon: Cloud, title: "Office conversions", body: "Word ↔ PDF, Excel ↔ PDF, PowerPoint ↔ PDF. Wraps ConvertAPI so you don't have to." },
  { Icon: Zap, title: "Webhooks", body: "Get notified when long-running jobs finish — fire-and-forget conversions, scheduled shares, etc." },
];

export default function ApiWaitlistPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          <Code2 className="h-3.5 w-3.5" /> API · COMING SOON
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          The UtilityApps API — for when a browser tab isn&rsquo;t enough.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-surface-600 sm:text-lg dark:text-surface-300">
          Every tool on UtilityApps, available as an API endpoint.{" "}
          {TOOLS.length} tools today; the same engines, callable from your
          backend, with sensible auth and per-key rate limits.
        </p>
      </header>

      {/* Waitlist form */}
      <section className="mx-auto mt-10 max-w-xl">
        <WaitlistForm />
      </section>

      {/* What you'd be able to do */}
      <section className="mt-16">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          What you&rsquo;d be able to do
        </h2>
        <p className="mt-1 text-lg font-semibold text-surface-900 dark:text-white">
          A rough sketch of the surface area.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {ENDPOINT_TEASERS.map(({ Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
                {title}
              </p>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* The "why not yet" — honest */}
      <section className="mt-16 rounded-2xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Why we haven&rsquo;t built it yet
        </h2>
        <div className="mt-3 space-y-3 text-sm text-surface-700 dark:text-surface-200">
          <p>
            Shipping a public API isn&rsquo;t just the endpoints. It&rsquo;s API
            keys, per-key rate limits, billing, usage dashboards, SLAs, error
            budgets, and a docs site that doesn&rsquo;t go stale. That&rsquo;s
            weeks of work before the first paying call comes through.
          </p>
          <p>
            <strong>So we&rsquo;re validating demand first.</strong> If 100+
            developers sign up on this page, we&rsquo;ll start building. If 10
            sign up, we&rsquo;ll build something else and come back to this
            when the market signals louder.
          </p>
          <p>
            Drop your email + a sentence on what you&rsquo;d use it for. The
            use-case description is what helps us decide which endpoints to
            ship first — and which ones we can skip.
          </p>
        </div>
      </section>

      {/* Pricing thoughts (vague on purpose) */}
      <section className="mt-12 grid gap-6 rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:grid-cols-3">
        <Bullet
          Icon={Lock}
          title="API keys"
          body="Generate / revoke from a dashboard. Scoped to specific endpoints if you want."
        />
        <Bullet
          Icon={Zap}
          title="Free tier"
          body="A useful daily quota at $0 — enough to evaluate the API in your prod-adjacent staging."
        />
        <Bullet
          Icon={Globe2}
          title="Predictable pricing"
          body="Per-call pricing, no surprises. The same conversion that costs $0.01 today will cost $0.01 next year."
        />
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 text-center">
        <p className="text-sm text-surface-600 dark:text-surface-300">
          Want to chat instead?
        </p>
        <p className="mt-1">
          <Link
            href="/contact"
            className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            Contact us →
          </Link>
        </p>
      </section>
    </main>
  );
}

function Bullet({
  Icon,
  title,
  body,
}: {
  Icon: typeof Lock;
  title: string;
  body: string;
}) {
  return (
    <div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
        {title}
      </p>
      <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{body}</p>
    </div>
  );
}
