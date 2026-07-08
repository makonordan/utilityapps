/**
 * Public changelog entries — surfaced at /changelog.
 *
 * Add new entries to the TOP of this array. Keep `date` as ISO YYYY-MM-DD
 * (matches sitemap's lastModified format). Sorting happens in the page,
 * so manual order is just a convention.
 *
 * Pick `kind` carefully — it drives the badge color on the changelog
 * page and helps users skim the timeline:
 *   - "launch":  brand-new tool, category, or page surface
 *   - "feature": meaningful additions to an existing tool
 *   - "seo":     site-wide SEO / discoverability improvements
 *   - "fix":     bug fix worth surfacing publicly
 *   - "infra":   ops / reliability changes (rare; usually internal)
 */

export type ChangelogKind = "launch" | "feature" | "seo" | "fix" | "infra";

export interface ChangelogEntry {
  /** ISO date the change shipped to production. */
  date: string;
  kind: ChangelogKind;
  title: string;
  /** 1–2 sentences. The "why" matters more than the "what". */
  description: string;
  /** Optional list of tool IDs this entry touched — renders as chips. */
  tools?: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-06-01",
    kind: "seo",
    title: "Competitor comparison + alternatives pages",
    description:
      "Shipped 44 /vs/ pages (e.g. /vs/merge-pdf-vs-ilovepdf) and 14 /alternatives/[competitor] hubs to capture high-intent queries for free alternatives to iLovePDF, Smallpdf, Adobe, TinyPNG, remove.bg, Photopea, Kapwing, and more. Each page is fact-checked with a `factsVerifiedOn` date.",
  },
  {
    date: "2026-06-01",
    kind: "seo",
    title: "AggregateRating stars across every tool page",
    description:
      "Added schema.org AggregateRating to all tool SoftwareApplication JSON-LD plus a visible '★ 4.x (N)' badge in headers. Gated on a 3-rating minimum so no tool surfaces a misleading single-vote score.",
  },
  {
    date: "2026-05-29",
    kind: "feature",
    title: "Chrome extension waitlist banner",
    description:
      "Slim dismissible top-of-site banner that captures emails for a planned UtilityApps Chrome extension. Stored separately from newsletter / API waitlist for clean targeting.",
  },
  {
    date: "2026-05-28",
    kind: "launch",
    title: "Site-wide 'Translate this page' control",
    description:
      "Added a single-click translation toggle on every page. Uses browser-native translation APIs where available with clear fallback guidance for browsers that don't expose them.",
  },
  {
    date: "2026-05-28",
    kind: "launch",
    title: "Language Tools category — on-device Private Translator",
    description:
      "Launched the Language Tools category and shipped a Private Translator that runs translation models on-device, never sending text to a server.",
    tools: ["translator"],
  },
  {
    date: "2026-05-27",
    kind: "launch",
    title: "/api waitlist landing page",
    description:
      "Validate demand for an UtilityApps API before building. Captured directly into a dedicated waitlist with surfacing in nav, mega-menu, hero, and footer.",
  },
  {
    date: "2026-05-27",
    kind: "infra",
    title: "Sentry error tracking + completion analytics",
    description:
      "Wired Sentry behind NEXT_PUBLIC_SENTRY_DSN so we catch production errors without leaking PII. Added tool 'completion' tracking (uses vs visits) so the admin dashboard shows real engagement, not vanity counts.",
  },
  {
    date: "2026-05-26",
    kind: "launch",
    title: "Share tool — text snippets + URL shortener + file uploads",
    description:
      "Phase 1 shipped text snippets and a URL shortener with no signup; Phase 2 added file uploads up to 25 MB via signed direct uploads to Supabase Storage. Built around the 'paste, share, gone' use case — no accounts, no permanent storage.",
    tools: ["share"],
  },
  {
    date: "2026-05-23",
    kind: "launch",
    title: "Legal Tools category — 8 in-browser document generators",
    description:
      "Privacy Policy, Terms of Service, Cookie Policy, NDA, Freelance Contract, DMCA Takedown, GDPR Request, and Cease-and-Desist generators. All run client-side so sensitive details never leave the browser.",
    tools: [
      "privacy-policy-generator",
      "terms-of-service-generator",
      "cookie-policy-generator",
      "nda-generator",
      "freelance-contract-generator",
      "dmca-takedown-notice",
      "gdpr-request-letter",
      "cease-and-desist-letter",
    ],
  },
  {
    date: "2026-05-23",
    kind: "launch",
    title: "PDF Tools category — 16 tools (10 in-browser + 6 Office↔PDF)",
    description:
      "Phase 1 launched 10 in-browser PDF tools (merge, split, compress, rotate, watermark, sign, etc.) running entirely client-side. Phase 2 added 6 Office↔PDF conversions powered by ConvertAPI for jobs the browser can't do.",
    tools: [
      "merge-pdf",
      "split-pdf",
      "compress-pdf",
      "rotate-pdf",
      "watermark-pdf",
      "sign-pdf",
      "pdf-to-word",
      "word-to-pdf",
      "pdf-to-excel",
      "excel-to-pdf",
      "pdf-to-ppt",
      "ppt-to-pdf",
    ],
  },
];

export function getSortedChangelog(): ChangelogEntry[] {
  return [...CHANGELOG].sort((a, b) => (a.date < b.date ? 1 : -1));
}
