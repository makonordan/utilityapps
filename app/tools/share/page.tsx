import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Share2, ShieldCheck, Zap } from "lucide-react";

import { ShareTool } from "@/components/share-tool/ShareTool";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "share";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free File, Text & Link Sharing — No Signup";
const DESCRIPTION =
  "Share files up to 25 MB, text snippets, or shortened links instantly. Optional password, expiration, view limit and QR code. No signup, no tracking.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "free file sharing",
    "share text online",
    "url shortener",
    "share files no signup",
    "anonymous file sharing",
    "free link shortener",
    "free wetransfer alternative",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function SharePage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    {
      name: tool?.category ?? "Productivity Tools",
      url: category
        ? `${SITE_CONFIG.url}/tools/categories/${category.id}`
        : `${SITE_CONFIG.url}/tools`,
    },
    {
      name: tool?.name ?? "Quick Share",
      url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool?.name ?? "Quick Share",
    description: tool?.longDescription ?? DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web)",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <ScriptJsonLd data={breadcrumbJsonLd} />
      <ScriptJsonLd data={softwareJsonLd} />
      <TrackToolVisit toolId={TOOL_ID} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
        >
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-surface-700 dark:text-surface-200">Quick Share</span>
        </nav>

        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md"
          >
            <Share2 className="h-7 w-7" />
          </span>
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
              Share Anything — Files, Text or Links
            </h1>
            <p className="max-w-2xl text-base text-surface-600 dark:text-surface-300">
              No signup. No login. Drop a file (up to 25&nbsp;MB), paste a snippet, or
              shorten a long URL — hit create, send the link. Expires when you say it
              expires.
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200">
                <Zap className="h-3 w-3 text-blue-600 dark:text-blue-300" /> No signup
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200">
                <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-300" /> Password optional
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
                Auto-expires
              </li>
            </ul>
          </div>
        </header>

        <p className="mt-5 inline-flex items-start gap-2 rounded-lg bg-surface-50 px-3 py-2 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          <span aria-hidden="true">🔒</span>
          We store the content you share (file, text or URL) on our server only
          until it expires — and we delete it automatically. We never sell your data.
        </p>

        <section className="mt-8">
          <ShareTool />
        </section>

        <section className="prose prose-surface mt-14 max-w-none dark:prose-invert">
          <h2>What this tool does</h2>
          <p>
            Two of the most common &ldquo;quick share&rdquo; jobs, rolled into one
            page with no signup required:
          </p>
          <ul>
            <li>
              <strong>Text snippets</strong> — paste a snippet of code, a note, a
              long message, anything up to 100 KB. The recipient sees it in a
              clean reader page; if you set a language it gets syntax-highlighted.
            </li>
            <li>
              <strong>Link shortener</strong> — turn a long URL into a short{" "}
              <code>{SITE_CONFIG.url}/s/&#123;slug&#125;</code> link, with a
              optional custom slug. Recipient sees the destination domain before
              they continue, so they can&rsquo;t be silently redirected.
            </li>
          </ul>
          <p>
            File sharing comes next. We chose to ship text + links first because
            they need no extra infrastructure — you get the full UX (password,
            view limits, expiration, custom links, QR codes) immediately.
          </p>

          <h2>Why &ldquo;no signup&rdquo; is the whole point</h2>
          <p>
            Every other sharing service either asks you to sign up &ldquo;just
            this once&rdquo; or quietly attaches your share to a tracked
            account. The point of a one-off share is that it&rsquo;s one off.
            Type, send, forget. We keep no account, no history beyond what your
            own browser remembers, and we auto-delete everything once it expires.
          </p>

          <h2>What we won&rsquo;t allow</h2>
          <p>
            Every share has a &ldquo;Report this content&rdquo; button. Reported
            shares are removed immediately — there&rsquo;s no review queue. If
            you sent something legitimate to a hostile recipient who reported it,
            email <code>hello@utilityapps.site</code> and we can recreate it from
            the audit log. Don&rsquo;t share anything illegal or anything that
            isn&rsquo;t yours to share. The full rules live in our terms.
          </p>
        </section>
      </div>
    </>
  );
}

function ScriptJsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
