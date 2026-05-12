export interface Video {
  id: string;
  title: string;
  description: string;
  category: "Tools" | "Productivity" | "Finance" | "AI & Automation";
  toolId: string | null;
  duration: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
  featured: boolean;
}

// IMPORTANT: These are placeholder YouTube IDs. Replace with real video IDs
// once the UtilityApps channel is live. The 11-char synthetic IDs follow
// YouTube's format so the URL templates remain valid.
const PLACEHOLDERS: Omit<Video, "thumbnail">[] = [
  {
    id: "ua_loan_calc1",
    title: "Loan Calculator Walkthrough — Get Your Real Monthly Payment",
    description:
      "How to use the UtilityApps Loan Calculator to compare terms, rates, and down payments side-by-side in under three minutes.",
    category: "Finance",
    toolId: "loan-calculator",
    duration: "6:42",
    views: "84K",
    publishedAt: "2026-04-22",
    featured: true,
  },
  {
    id: "ua_mortgage_v2",
    title: "Mortgage Math, Demystified (US, UK, and Canada)",
    description:
      "PITI, PMI, and the formula every lender uses. Walk through three real loans and learn the 30-second sanity check.",
    category: "Finance",
    toolId: "mortgage-calculator",
    duration: "9:15",
    views: "62K",
    publishedAt: "2026-04-08",
    featured: false,
  },
  {
    id: "ua_imgcomp_pro",
    title: "Compress Images Without Losing Quality (AVIF, WebP, JPEG)",
    description:
      "The math behind modern image formats and how to drop file sizes 80% without anyone noticing.",
    category: "Tools",
    toolId: "compress-image",
    duration: "7:28",
    views: "120K",
    publishedAt: "2026-03-30",
    featured: false,
  },
  {
    id: "ua_bmi_explain",
    title: "BMI Is Lying to You — Here's What to Track Instead",
    description:
      "When BMI is reliable, when it isn't, and the cheaper measures that beat it for individual health risk.",
    category: "Tools",
    toolId: "bmi-calculator",
    duration: "5:54",
    views: "47K",
    publishedAt: "2026-03-18",
    featured: false,
  },
  {
    id: "ua_pct_basics",
    title: "Master Percentages in 8 Minutes",
    description:
      "Three formulas that solve 95% of percent problems, plus the mental shortcuts that beat your phone.",
    category: "Tools",
    toolId: "percentage-calculator",
    duration: "8:02",
    views: "38K",
    publishedAt: "2026-03-05",
    featured: false,
  },
  {
    id: "ua_word_count1",
    title: "Word Count Targets for Every Platform (2026)",
    description:
      "Tweets, LinkedIn posts, blog articles, college essays — the actual numbers backed by data.",
    category: "Productivity",
    toolId: "word-counter",
    duration: "4:38",
    views: "19K",
    publishedAt: "2026-02-26",
    featured: false,
  },
  {
    id: "ua_pdf_combo",
    title: "PDF Toolkit Tour: Convert, Merge, Split, Compress",
    description:
      "Everything the UtilityApps PDF Converter can do — including the OCR mode for scanned files.",
    category: "Tools",
    toolId: "pdf-converter",
    duration: "10:12",
    views: "73K",
    publishedAt: "2026-02-14",
    featured: false,
  },
  {
    id: "ua_qr_design",
    title: "Designing QR Codes People Actually Scan",
    description:
      "Logos, colors, error correction — the small choices that double your scan rate.",
    category: "Tools",
    toolId: "qr-code-generator",
    duration: "5:21",
    views: "29K",
    publishedAt: "2026-02-02",
    featured: false,
  },
  {
    id: "ua_json_dev",
    title: "JSON for Developers: Format, Validate, Query",
    description:
      "JSONPath, schema validation, and the keyboard shortcuts that turn the formatter into a daily driver.",
    category: "Productivity",
    toolId: "json-formatter",
    duration: "11:47",
    views: "55K",
    publishedAt: "2026-01-21",
    featured: false,
  },
  {
    id: "ua_meta_tags1",
    title: "Meta Tags That Win the Click",
    description:
      "Open Graph, Twitter Cards, and SERP previews. Build them once and never touch them again.",
    category: "Productivity",
    toolId: "meta-tag-generator",
    duration: "6:09",
    views: "22K",
    publishedAt: "2026-01-09",
    featured: false,
  },
  {
    id: "ua_calorie_kit",
    title: "Calorie Targets, Honestly Explained",
    description:
      "TDEE, BMR, and how to set a target you'll actually hit — without buying anyone's macros app.",
    category: "Productivity",
    toolId: "calorie-calculator",
    duration: "8:44",
    views: "41K",
    publishedAt: "2025-12-18",
    featured: false,
  },
  {
    id: "ua_ai_search1",
    title: "How the UtilityApps AI Search Actually Works",
    description:
      "A two-layer search system: instant fuzzy match plus a tiny GPT-4o-mini intent layer. The architecture, in plain language.",
    category: "AI & Automation",
    toolId: null,
    duration: "12:30",
    views: "31K",
    publishedAt: "2025-12-04",
    featured: false,
  },
  {
    id: "ua_ai_prompts1",
    title: "10 Prompts That Replaced My Most-Used Apps",
    description:
      "The single-prompt versions of meeting summarizers, email writers, and code reviewers — and when not to use them.",
    category: "AI & Automation",
    toolId: null,
    duration: "9:55",
    views: "98K",
    publishedAt: "2025-11-22",
    featured: false,
  },
  {
    id: "ua_automation1",
    title: "Build a Personal AI Assistant in an Afternoon",
    description:
      "Wire Claude to your inbox, calendar, and notes with zero code. The setup, the prompts, and the privacy considerations.",
    category: "AI & Automation",
    toolId: null,
    duration: "14:22",
    views: "56K",
    publishedAt: "2025-11-08",
    featured: false,
  },
  {
    id: "ua_currency_v1",
    title: "Currency Conversion for Travelers and Freelancers",
    description:
      "Mid-market rates, hidden bank fees, and the conversion habit that saves freelancers hundreds per month.",
    category: "Finance",
    toolId: "currency-converter",
    duration: "5:48",
    views: "26K",
    publishedAt: "2025-10-29",
    featured: false,
  },
];

// Placeholder thumbnails: deterministic picsum.photos images keyed by video id.
// Once real YouTube videos are uploaded, swap each entry to the real thumbnail
// at https://img.youtube.com/vi/<11-char-yt-id>/maxresdefault.jpg.
export const VIDEOS: Video[] = PLACEHOLDERS.map((v) => ({
  ...v,
  thumbnail: `https://picsum.photos/seed/${v.id}/1280/720`,
}));

export const VIDEO_CATEGORIES: Video["category"][] = [
  "Tools",
  "Productivity",
  "Finance",
  "AI & Automation",
];

export function getFeaturedVideo(): Video | null {
  return VIDEOS.find((v) => v.featured) ?? VIDEOS[0] ?? null;
}

export function getVideosByCategory(category: Video["category"] | null): Video[] {
  if (!category) return VIDEOS;
  return VIDEOS.filter((v) => v.category === category);
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function embedUrl(videoId: string, autoplay: boolean = false): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
