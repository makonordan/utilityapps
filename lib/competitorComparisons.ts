/**
 * Competitor comparison data for /vs/[our-tool]-vs-[competitor] pages.
 *
 * Every claim below should be verifiable on the competitor's public site
 * (pricing/FAQ/landing pages) as of `factsVerifiedOn`. We never fabricate
 * specs. When pricing or limits change, bump `factsVerifiedOn` and update
 * the corresponding fields — the page renders the date so visitors know
 * how fresh the comparison is.
 *
 * Adding a new comparison:
 *   1. Add the competitor to COMPETITORS (or reuse an existing one).
 *   2. Add an entry to TOOL_VS_COMPETITOR mapping the our-tool-id to its
 *      competitor slug.
 *   3. Add a `narrative` keyed by `${toolId}|${competitorSlug}` —
 *      tool-specific copy keeps each page genuinely unique (avoids
 *      thin-content SEO penalties).
 */

/** A single fact on the comparison table.
 *  - `tone: "yes"` → positive for the user (Check icon).
 *  - `tone: "no"`  → negative for the user (X icon).
 *  - omitted        → neutral, just text. */
export interface CompetitorFeature {
  value: string;
  tone?: "yes" | "no";
}

export interface Competitor {
  slug: string;
  name: string;
  homepage: string;
  /** ISO date of last fact-check (YYYY-MM-DD). */
  factsVerifiedOn: string;
  /** One-line positioning summary. */
  blurb: string;
  /** Comparable facts on each axis. Use the competitor's own free tier. */
  features: {
    pricing: CompetitorFeature;
    signupRequired: CompetitorFeature;
    processingLocation: CompetitorFeature;
    freeTierLimit: CompetitorFeature;
    watermarks: CompetitorFeature;
    mobile: CompetitorFeature;
  };
}

/** UtilityApps facts — shared across every comparison page. */
export const US_FACTS = {
  name: "UtilityApps",
  pricing: { value: "Free, no signup", tone: "yes" } as CompetitorFeature,
  signupRequired: { value: "Never required", tone: "yes" } as CompetitorFeature,
  /** Per-tool: browser vs server. Filled in per comparison from the tool's
   *  metadata, since some of our tools (Office↔PDF, background removal,
   *  video resize) do call a server-side API. */
  freeTierLimit: { value: "No daily limit", tone: "yes" } as CompetitorFeature,
  watermarks: { value: "Never", tone: "yes" } as CompetitorFeature,
  mobile: { value: "Yes — responsive", tone: "yes" } as CompetitorFeature,
};

export const COMPETITORS: Record<string, Competitor> = {
  ilovepdf: {
    slug: "ilovepdf",
    name: "iLovePDF",
    homepage: "https://www.ilovepdf.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "A large PDF-tools suite with web, desktop, and mobile apps, monetized through a Premium subscription.",
    features: {
      pricing: { value: "Free tier + Premium ($7/mo at time of writing)" },
      signupRequired: { value: "Optional for free, required for Premium" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "Daily task & file-size caps on free tier", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes (mobile apps + responsive web)", tone: "yes" },
    },
  },
  smallpdf: {
    slug: "smallpdf",
    name: "Smallpdf",
    homepage: "https://smallpdf.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Polished PDF-tools site owned by Smallpdf AG, with a 7-day Pro trial and a metered free tier.",
    features: {
      pricing: { value: "Free tier (metered) + Pro subscription" },
      signupRequired: { value: "Required after free-tier limit hits" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: {
        value: "Two free documents per day, then Pro upsell",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes (mobile apps + responsive web)", tone: "yes" },
    },
  },
  tinypng: {
    slug: "tinypng",
    name: "TinyPNG",
    homepage: "https://tinypng.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Image-compression utility by Tinify, popular for PNG/JPEG/WebP smart-lossy compression, with a paid API for developers.",
    features: {
      pricing: { value: "Free in browser, paid API for automation" },
      signupRequired: { value: "Not required in browser; required for API" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: {
        value: "Up to 20 images per batch, 5 MB each (web)",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web only", tone: "yes" },
    },
  },
  "remove-bg": {
    slug: "remove-bg",
    name: "remove.bg",
    homepage: "https://www.remove.bg",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "AI background-removal service by Kaleido AI (Canva), with a free preview tier and credits for full-resolution output.",
    features: {
      pricing: { value: "Free preview; credits required for HD output" },
      signupRequired: { value: "Required for full-resolution downloads" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: {
        value: "Preview only without credits; HD = $0.20+/image",
        tone: "no",
      },
      watermarks: { value: "No watermarks (resolution-limited instead)", tone: "yes" },
      mobile: { value: "Yes (mobile apps + responsive web)", tone: "yes" },
    },
  },
  clideo: {
    slug: "clideo",
    name: "Clideo",
    homepage: "https://clideo.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Browser-based video editing suite (compress, cut, merge, convert) monetized through a paid plan that removes a watermark.",
    features: {
      pricing: { value: "Free tier with watermark + paid subscription" },
      signupRequired: { value: "Required to remove the watermark" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "500 MB file cap; watermarked output", tone: "no" },
      watermarks: { value: "Yes — added to free-tier exports", tone: "no" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  "123apps": {
    slug: "123apps",
    name: "123Apps Audio Cutter",
    homepage: "https://mp3cut.net",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Long-running free online audio cutter / converter by 123Apps, supported by ads and an optional Premium upgrade.",
    features: {
      pricing: { value: "Free with ads + optional Premium" },
      signupRequired: { value: "Not required" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "Free, but ad-supported", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  mybib: {
    slug: "mybib",
    name: "MyBib",
    homepage: "https://www.mybib.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Free citation generator for students, supporting APA, MLA, Chicago, and Harvard styles, monetized through display ads.",
    features: {
      pricing: { value: "Free, ad-supported" },
      signupRequired: { value: "Optional (saves bibliographies)" },
      processingLocation: { value: "Citations generated server-side" },
      freeTierLimit: { value: "Free, but ad-heavy", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  htmlcsstoimage: {
    slug: "htmlcsstoimage",
    name: "HTML/CSS to Image",
    homepage: "https://htmlcsstoimage.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "API-first service that renders HTML/CSS to PNG/JPG/WebP — built for automation, with a small free trial.",
    features: {
      pricing: { value: "Free trial (50 images) + paid API plans" },
      signupRequired: { value: "Required (API key)" },
      processingLocation: { value: "Files generated server-side", tone: "no" },
      freeTierLimit: { value: "50-image trial, then $19+/mo", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "API-only (no browser UI)" },
    },
  },
};

/** Each entry produces one /vs/<toolId>-vs-<competitorSlug> page. */
export interface ToolVsEntry {
  toolId: string;
  competitorSlug: string;
}

export const TOOL_VS_COMPETITOR: ToolVsEntry[] = [
  // PDF — high-volume "iLovePDF / Smallpdf alternative" queries.
  { toolId: "merge-pdf", competitorSlug: "ilovepdf" },
  { toolId: "merge-pdf", competitorSlug: "smallpdf" },
  { toolId: "compress-pdf", competitorSlug: "ilovepdf" },
  { toolId: "compress-pdf", competitorSlug: "smallpdf" },
  { toolId: "split-pdf", competitorSlug: "ilovepdf" },
  { toolId: "pdf-to-word", competitorSlug: "smallpdf" },

  // Image
  { toolId: "compress-image", competitorSlug: "tinypng" },
  { toolId: "remove-background", competitorSlug: "remove-bg" },

  // Video
  { toolId: "video-compressor", competitorSlug: "clideo" },
  { toolId: "video-trimmer", competitorSlug: "clideo" },

  // Audio
  { toolId: "mp3-cutter", competitorSlug: "123apps" },

  // Student
  { toolId: "citation-generator", competitorSlug: "mybib" },

  // Design
  { toolId: "html-to-image", competitorSlug: "htmlcsstoimage" },
];

/** Tool-specific narrative shown above the comparison table. Lets each
 *  page stand on genuinely unique copy. Keyed `${toolId}|${competitorSlug}`. */
export const VS_NARRATIVES: Record<string, string> = {
  "merge-pdf|ilovepdf":
    "iLovePDF's Merge PDF is one of the most-used PDF tools on the web, but every file you upload travels to their servers and the free tier has daily caps. UtilityApps merges PDFs entirely inside your browser — nothing is uploaded, no Premium upsell, no signup. If you merge PDFs occasionally and want privacy by default, ours wins. If you want a mobile app and a polished suite around it, theirs is the more mature ecosystem.",
  "merge-pdf|smallpdf":
    "Smallpdf is a beautifully designed PDF suite, but its free tier caps you at two documents per day before pushing a Pro subscription. UtilityApps Merge PDF runs inside your browser with no daily limit, no signup, and files never leave your device. For occasional users especially, ours removes the friction entirely.",
  "compress-pdf|ilovepdf":
    "iLovePDF Compress PDF gets the job done but uploads every file to their servers and limits the free tier. UtilityApps Compress PDF runs the compression in your browser with the same library iLovePDF uses server-side — same result, fewer round-trips, no upload.",
  "compress-pdf|smallpdf":
    "Smallpdf's compressor is part of a paid suite — two documents per day on the free tier, then a Pro upsell. UtilityApps Compress PDF has no daily cap, no upload, and runs the same compression algorithms client-side.",
  "split-pdf|ilovepdf":
    "Both tools split PDFs cleanly. The difference is where the work happens — iLovePDF uploads your file; UtilityApps does it inside your browser. For confidential documents (contracts, statements, IDs), the local option is the safer default.",
  "pdf-to-word|smallpdf":
    "PDF → Word is genuinely hard, so this is one place we do upload (the conversion engine needs Office libraries that don't run in the browser). The differences vs Smallpdf: no daily-task cap, no Pro upsell, the file is deleted immediately after the result is returned, and the whole thing is free.",
  "compress-image|tinypng":
    "TinyPNG is the gold standard for image compression — but the free web tool caps you at 20 images per batch at 5 MB each, and every file uploads to their servers. UtilityApps Compress Image runs lossy/lossless compression directly in your browser. No batch limit. No upload. Same kind of result.",
  "remove-background|remove-bg":
    "remove.bg's AI quality is excellent, but the free tier only returns low-resolution previews — full HD costs credits and requires a signup. UtilityApps Remove Background calls a paid API behind the scenes too (this isn't something the browser can do well alone), but we don't bill you for it — there's no signup, no credit metering, and no resolution cap on the free tier.",
  "video-compressor|clideo":
    "Clideo compresses videos in the browser, but the free tier exports a watermark across the result — paying lifts it. UtilityApps Video Compressor has no watermark, no signup, and runs the compression directly in your browser using FFmpeg WebAssembly.",
  "video-trimmer|clideo":
    "Clideo's trimmer adds a watermark to free-tier exports. UtilityApps Video Trimmer doesn't — the trimmed clip you download is clean, with no signup or upgrade required.",
  "mp3-cutter|123apps":
    "123Apps' MP3 Cutter is free and ad-supported, with files uploaded to their servers. UtilityApps MP3 Cutter does the same job inside your browser using the Web Audio API — no upload, no ads embedded in the editor, and the file never leaves your device.",
  "citation-generator|mybib":
    "MyBib is a solid free citation tool, but it's heavily ad-supported. UtilityApps Citation Generator covers the same major styles (APA, MLA, Chicago, Harvard) with no ads inside the citation form itself — same coverage, calmer interface.",
  "html-to-image|htmlcsstoimage":
    "HTML/CSS to Image is an API-first product — you pay per render and need an API key. UtilityApps HTML to Image renders the snippet directly in your browser using a Canvas API, so it's free and instant, but not designed for automated server-side use. If you need an API, theirs is the right pick; if you need a one-off render, ours wins on speed.",
};

export function getCompetitor(slug: string): Competitor | null {
  return COMPETITORS[slug] ?? null;
}

export function getVsNarrative(toolId: string, competitorSlug: string): string {
  return (
    VS_NARRATIVES[`${toolId}|${competitorSlug}`] ??
    `Both tools solve the same job. The differences are pricing, signup, and where the file lives during processing — those line up in the table below.`
  );
}
