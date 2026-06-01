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
  "adobe-acrobat": {
    slug: "adobe-acrobat",
    name: "Adobe Acrobat",
    homepage: "https://www.adobe.com/acrobat.html",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Adobe's flagship PDF product — desktop, web, and mobile, with a paid Acrobat Pro tier that unlocks editing, conversion, and signing.",
    features: {
      pricing: { value: "Acrobat Pro ~$19.99/mo; free Reader is view-only" },
      signupRequired: { value: "Adobe ID required for cloud features" },
      processingLocation: { value: "Cloud-based when using web tools", tone: "no" },
      freeTierLimit: { value: "Free Reader doesn't edit/convert/sign", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes (Acrobat mobile apps)", tone: "yes" },
    },
  },
  pdf24: {
    slug: "pdf24",
    name: "PDF24",
    homepage: "https://tools.pdf24.org",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Free PDF-tools suite by Geek Software (Germany) — web + Windows desktop, supported by display ads.",
    features: {
      pricing: { value: "Free, ad-supported" },
      signupRequired: { value: "Not required" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "Free, but heavy ads on web tools", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  sejda: {
    slug: "sejda",
    name: "Sejda",
    homepage: "https://www.sejda.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Polished PDF-tools site with a generous-but-capped free tier and a paid subscription for unlimited tasks.",
    features: {
      pricing: { value: "Free tier (capped) + paid subscription" },
      signupRequired: { value: "Optional for free; required for paid" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: {
        value: "3 free tasks/hour, 200 pages, 50 MB per file",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  photopea: {
    slug: "photopea",
    name: "Photopea",
    homepage: "https://www.photopea.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Free in-browser Photoshop clone — full PSD compatibility, ad-supported, with a Premium tier that removes ads.",
    features: {
      pricing: { value: "Free with ads + Premium ~$5/mo to remove ads" },
      signupRequired: { value: "Not required" },
      processingLocation: { value: "Browser-side (WebAssembly)", tone: "yes" },
      freeTierLimit: { value: "Free, ad-supported in the editor", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Limited (editor is desktop-focused)", tone: "no" },
    },
  },
  canva: {
    slug: "canva",
    name: "Canva",
    homepage: "https://www.canva.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "All-in-one design platform with templates and stock assets — free tier plus Canva Pro (~$15/mo).",
    features: {
      pricing: { value: "Free tier + Canva Pro ~$15/mo" },
      signupRequired: { value: "Required (account-based)", tone: "no" },
      processingLocation: { value: "Cloud-based", tone: "no" },
      freeTierLimit: { value: "Many assets/templates are Pro-only", tone: "no" },
      watermarks: { value: "No watermarks on Free outputs", tone: "yes" },
      mobile: { value: "Yes (mobile apps + web)", tone: "yes" },
    },
  },
  kapwing: {
    slug: "kapwing",
    name: "Kapwing",
    homepage: "https://www.kapwing.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Browser-based video editor + meme/GIF maker — free tier with watermark on exports above a length cap, Pro removes it.",
    features: {
      pricing: { value: "Free (watermarked) + Pro $16/mo to remove watermark" },
      signupRequired: { value: "Required for any export" },
      processingLocation: { value: "Cloud-based", tone: "no" },
      freeTierLimit: {
        value: "Free exports add watermark above 7 min total",
        tone: "no",
      },
      watermarks: { value: "Yes on long free exports", tone: "no" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  ezgif: {
    slug: "ezgif",
    name: "ezgif.com",
    homepage: "https://ezgif.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Long-running free online GIF maker / editor with broad video-to-gif support, supported by display ads.",
    features: {
      pricing: { value: "Free, ad-supported" },
      signupRequired: { value: "Not required" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "Free; ~200 MB file cap with ads", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  convertio: {
    slug: "convertio",
    name: "Convertio",
    homepage: "https://convertio.co",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Universal file converter (300+ formats) — free tier with daily caps, paid plans for higher limits.",
    features: {
      pricing: { value: "Free (capped) + paid plans from $9.99/mo" },
      signupRequired: { value: "Optional for free; required for paid" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: {
        value: "100 MB file cap, 10 conversions/day on free",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  cloudconvert: {
    slug: "cloudconvert",
    name: "CloudConvert",
    homepage: "https://cloudconvert.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Pay-per-conversion file-conversion service with a small daily free allowance and a strong API for automation.",
    features: {
      pricing: { value: "Pay-as-you-go credits + 25 conversions/day free" },
      signupRequired: { value: "Required after free daily allowance" },
      processingLocation: { value: "Files uploaded to their servers", tone: "no" },
      freeTierLimit: { value: "25 free conversions per day, then paid", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  termsfeed: {
    slug: "termsfeed",
    name: "TermsFeed",
    homepage: "https://www.termsfeed.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Legal-doc generator (Privacy Policy, Terms, Cookie Policy) — short free outputs, paid for full versions and downloads.",
    features: {
      pricing: { value: "Free preview; paid for full doc + downloads" },
      signupRequired: { value: "Email required for free; account for paid", tone: "no" },
      processingLocation: { value: "Generated server-side" },
      freeTierLimit: { value: "Most useful sections are paid-only", tone: "no" },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  easybib: {
    slug: "easybib",
    name: "EasyBib",
    homepage: "https://www.easybib.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "Long-standing citation generator owned by Chegg — free for basic MLA, ad-supported, paid for APA/Chicago/grammar.",
    features: {
      pricing: { value: "Free MLA + ads; Plus ~$9.95/mo for APA/Chicago" },
      signupRequired: { value: "Required for advanced styles", tone: "no" },
      processingLocation: { value: "Citations generated server-side" },
      freeTierLimit: {
        value: "Only MLA free; APA, Chicago, grammar are Plus-only",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes — responsive web", tone: "yes" },
    },
  },
  quillbot: {
    slug: "quillbot",
    name: "QuillBot",
    homepage: "https://quillbot.com",
    factsVerifiedOn: "2026-06-01",
    blurb:
      "AI paraphrasing + grammar tool with a metered free tier and a Premium subscription that unlocks long passages and modes.",
    features: {
      pricing: { value: "Free (capped) + Premium ~$9.95/mo" },
      signupRequired: { value: "Optional for free; required for Premium" },
      processingLocation: { value: "Cloud-based AI", tone: "no" },
      freeTierLimit: {
        value: "125-word paraphrase cap; modes locked on free",
        tone: "no",
      },
      watermarks: { value: "No watermarks", tone: "yes" },
      mobile: { value: "Yes (mobile apps + web)", tone: "yes" },
    },
  },
};

/** Each entry produces one /vs/<toolId>-vs-<competitorSlug> page. */
export interface ToolVsEntry {
  toolId: string;
  competitorSlug: string;
}

export const TOOL_VS_COMPETITOR: ToolVsEntry[] = [
  // PDF — high-volume "iLovePDF / Smallpdf / Adobe alternative" queries.
  { toolId: "merge-pdf", competitorSlug: "ilovepdf" },
  { toolId: "merge-pdf", competitorSlug: "smallpdf" },
  { toolId: "merge-pdf", competitorSlug: "adobe-acrobat" },
  { toolId: "merge-pdf", competitorSlug: "pdf24" },
  { toolId: "merge-pdf", competitorSlug: "sejda" },
  { toolId: "compress-pdf", competitorSlug: "ilovepdf" },
  { toolId: "compress-pdf", competitorSlug: "smallpdf" },
  { toolId: "compress-pdf", competitorSlug: "adobe-acrobat" },
  { toolId: "compress-pdf", competitorSlug: "pdf24" },
  { toolId: "split-pdf", competitorSlug: "ilovepdf" },
  { toolId: "split-pdf", competitorSlug: "sejda" },
  { toolId: "pdf-to-word", competitorSlug: "smallpdf" },
  { toolId: "pdf-to-word", competitorSlug: "ilovepdf" },
  { toolId: "pdf-to-word", competitorSlug: "adobe-acrobat" },
  { toolId: "edit-pdf", competitorSlug: "smallpdf" },
  { toolId: "edit-pdf", competitorSlug: "adobe-acrobat" },
  { toolId: "sign-pdf", competitorSlug: "ilovepdf" },
  { toolId: "sign-pdf", competitorSlug: "adobe-acrobat" },
  { toolId: "watermark-pdf", competitorSlug: "ilovepdf" },
  { toolId: "jpg-pdf", competitorSlug: "ilovepdf" },

  // Image
  { toolId: "compress-image", competitorSlug: "tinypng" },
  { toolId: "remove-background", competitorSlug: "remove-bg" },
  { toolId: "photo-editor", competitorSlug: "photopea" },
  { toolId: "photo-editor", competitorSlug: "canva" },
  { toolId: "crop-image", competitorSlug: "photopea" },
  { toolId: "meme-generator", competitorSlug: "canva" },
  { toolId: "convert-to-jpg", competitorSlug: "convertio" },
  { toolId: "convert-from-jpg", competitorSlug: "convertio" },

  // Video
  { toolId: "video-compressor", competitorSlug: "clideo" },
  { toolId: "video-trimmer", competitorSlug: "clideo" },
  { toolId: "video-trimmer", competitorSlug: "kapwing" },
  { toolId: "video-to-gif", competitorSlug: "ezgif" },
  { toolId: "video-to-gif", competitorSlug: "kapwing" },
  { toolId: "video-resizer", competitorSlug: "kapwing" },

  // Audio
  { toolId: "mp3-cutter", competitorSlug: "123apps" },
  { toolId: "audio-converter", competitorSlug: "convertio" },
  { toolId: "audio-converter", competitorSlug: "cloudconvert" },

  // Student
  { toolId: "citation-generator", competitorSlug: "mybib" },
  { toolId: "citation-generator", competitorSlug: "easybib" },
  { toolId: "paraphrasing-tool", competitorSlug: "quillbot" },

  // Design
  { toolId: "html-to-image", competitorSlug: "htmlcsstoimage" },

  // Legal
  { toolId: "privacy-policy-generator", competitorSlug: "termsfeed" },
  { toolId: "terms-of-service-generator", competitorSlug: "termsfeed" },
  { toolId: "cookie-policy-generator", competitorSlug: "termsfeed" },
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

  "merge-pdf|adobe-acrobat":
    "Adobe Acrobat merges PDFs reliably, but real editing/conversion lives behind Acrobat Pro at ~$20/month. UtilityApps Merge PDF does the merge in your browser, free, with no Adobe ID — and the file never gets uploaded to Adobe's cloud.",
  "merge-pdf|pdf24":
    "PDF24 has a wide free toolkit but the web tools are ad-heavy and your file uploads to their servers. UtilityApps Merge PDF runs entirely in your browser with no ads injected inside the tool surface.",
  "merge-pdf|sejda":
    "Sejda has a generous-but-capped free tier (3 tasks/hour, 200 pages, 50 MB). UtilityApps Merge PDF has no per-hour cap, no page cap, and no per-file size limit beyond what your browser can hold — because it runs locally.",
  "compress-pdf|adobe-acrobat":
    "Compressing a PDF in Acrobat Pro works well, but it's a paid feature inside a $20/month subscription. UtilityApps Compress PDF gives you the same outcome — smaller file, preserved layout — for free, with no signup and no upload to Adobe Document Cloud.",
  "compress-pdf|pdf24":
    "PDF24 compresses for free but the web flow is ad-heavy and your file is uploaded to their server. UtilityApps Compress PDF runs the compression in your browser, ad-free inside the tool, no upload.",
  "split-pdf|sejda":
    "Sejda splits PDFs cleanly but caps the free tier at 3 tasks/hour and 200 pages. UtilityApps Split PDF has no per-hour or per-page cap because the work happens locally — there's nothing to meter.",
  "pdf-to-word|ilovepdf":
    "Both iLovePDF and UtilityApps have to upload for PDF→Word — the conversion needs Office libraries that don't run in the browser. The differences: iLovePDF caps the free tier and pushes Premium; we don't cap and we don't have a Premium tier to push.",
  "pdf-to-word|adobe-acrobat":
    "PDF→Word in Adobe is gated behind Acrobat Pro and requires an Adobe ID. UtilityApps PDF to Word is free, no signup, and the file is deleted from our conversion partner immediately after the .docx is returned.",
  "edit-pdf|smallpdf":
    "Smallpdf's editor pushes you to Pro after two tasks per day. UtilityApps Edit PDF lets you add text, images, and annotations in the browser without a daily cap or a Pro upsell.",
  "edit-pdf|adobe-acrobat":
    "Adobe Acrobat is still the most powerful PDF editor — and the most expensive. For light editing (text, images, annotations) UtilityApps Edit PDF covers the 80% case for free. For OCR, complex form work, or batch automation, Acrobat still wins.",
  "sign-pdf|ilovepdf":
    "iLovePDF Sign is part of a paid suite (free tier limits how many signatures you can collect). UtilityApps Sign PDF lets you drop a signature, type or draw it, and download — free, no signup, no monthly cap.",
  "sign-pdf|adobe-acrobat":
    "Adobe Sign is an industrial e-signature platform; for one-off personal signing the price is overkill. UtilityApps Sign PDF lets you place a signature image, typed text, or hand-drawn mark on a PDF in the browser — free.",
  "watermark-pdf|ilovepdf":
    "iLovePDF's watermark tool is part of the metered free suite. UtilityApps Watermark PDF lets you add a text or image watermark in the browser with no per-day cap and no Premium upsell.",
  "jpg-pdf|ilovepdf":
    "iLovePDF JPG-to-PDF uploads your photos and caps free use. UtilityApps JPG to PDF combines images in your browser — no upload, no cap, and the order/orientation controls are right there.",

  "photo-editor|photopea":
    "Photopea is the best free in-browser Photoshop replacement — full PSD support, layers, masks. UtilityApps Photo Editor is intentionally lighter: quick crops, filters, text, exports, no ads in the editor. Use Photopea for serious work, UtilityApps for fast edits.",
  "photo-editor|canva":
    "Canva is template-first and account-gated. UtilityApps Photo Editor is direct: open an image, edit, download — no signup, no Pro upsell on assets.",
  "crop-image|photopea":
    "Photopea can crop, but you load the whole editor first. UtilityApps Crop Image is a one-purpose tool: drop image, drag, download. Faster path when crop is the only thing you need.",
  "meme-generator|canva":
    "Canva has meme templates but you need to sign in and pick from a paid asset library. UtilityApps Meme Generator gives you the classic top/bottom-text caption flow with no signup, no template hunt.",
  "convert-to-jpg|convertio":
    "Convertio supports hundreds of formats but caps the free tier to 100 MB files and 10 conversions/day. UtilityApps Convert to JPG handles the common formats in your browser — no per-day cap, no upload.",
  "convert-from-jpg|convertio":
    "Convertio works but uploads every file and meters free use. UtilityApps Convert from JPG runs in your browser, with no daily cap and no file going up to a third-party server.",

  "video-trimmer|kapwing":
    "Kapwing's video editor adds a watermark to longer free exports and gates the rest behind a signup + Pro. UtilityApps Video Trimmer trims clips in the browser with no watermark and no account.",
  "video-to-gif|ezgif":
    "ezgif is fast and free but ad-supported, and your file uploads to their server. UtilityApps Video to GIF runs the conversion in your browser via FFmpeg WebAssembly — no upload, no ads inside the tool.",
  "video-to-gif|kapwing":
    "Kapwing requires a signup and watermarks longer free exports. UtilityApps Video to GIF needs neither — the GIF is clean, the export is local.",
  "video-resizer|kapwing":
    "Kapwing resizes video in the cloud and gates higher-quality exports behind Pro. UtilityApps Video Resizer changes dimensions and aspect ratio in the browser, no Pro tier to hit.",

  "audio-converter|convertio":
    "Convertio handles audio formats but uploads every file and limits free use to 10 conversions/day. UtilityApps Audio Converter changes formats in the browser using the Web Audio API — no upload, no daily cap.",
  "audio-converter|cloudconvert":
    "CloudConvert gives you 25 free conversions/day, then it's pay-per-credit. UtilityApps Audio Converter is unmetered because the conversion happens locally — there's nothing to charge for.",

  "citation-generator|easybib":
    "EasyBib gives away MLA but locks APA and Chicago behind a Plus subscription, and the free experience is ad-dense. UtilityApps Citation Generator covers MLA, APA, Chicago, and Harvard for free with a cleaner UI.",
  "paraphrasing-tool|quillbot":
    "QuillBot's free tier caps paraphrases at 125 words and locks most modes behind Premium. UtilityApps Paraphrasing Tool isn't trying to replace QuillBot's AI suite, but for quick rewrites with no word-cap and no signup, it's the lighter path.",

  "privacy-policy-generator|termsfeed":
    "TermsFeed gives you a free preview and then paywalls the full Privacy Policy. UtilityApps Privacy Policy Generator outputs a full document for free — designed for small sites, indie projects, and side-hustles that don't need a $39 lawyer-grade doc.",
  "terms-of-service-generator|termsfeed":
    "TermsFeed locks the full Terms of Service behind a paid generator. UtilityApps Terms of Service Generator gives you a complete doc for free, with the disclosure that it's a starting template, not lawyer-grade legal advice.",
  "cookie-policy-generator|termsfeed":
    "TermsFeed's Cookie Policy is paywalled past the preview. UtilityApps Cookie Policy Generator outputs a complete policy free — meant as a starting point for small sites needing GDPR/CCPA disclosure.",
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

/** Competitors mapped against a specific tool — used for the
 *  "Also compared to…" strip on the tool page. */
export function getCompetitorsForTool(toolId: string): Competitor[] {
  const slugs = TOOL_VS_COMPETITOR
    .filter((m) => m.toolId === toolId)
    .map((m) => m.competitorSlug);
  return slugs
    .map((s) => COMPETITORS[s])
    .filter((c): c is Competitor => Boolean(c));
}

/** Tool IDs mapped against a specific competitor — used for the
 *  /alternatives/[competitor] hub page. */
export function getToolIdsForCompetitor(competitorSlug: string): string[] {
  return TOOL_VS_COMPETITOR
    .filter((m) => m.competitorSlug === competitorSlug)
    .map((m) => m.toolId);
}

/** Competitor slugs that have at least one mapped tool. Used to
 *  generateStaticParams for /alternatives. */
export function getCompetitorsWithTools(): Competitor[] {
  const slugs = new Set(TOOL_VS_COMPETITOR.map((m) => m.competitorSlug));
  return Array.from(slugs)
    .map((s) => COMPETITORS[s])
    .filter((c): c is Competitor => Boolean(c));
}
