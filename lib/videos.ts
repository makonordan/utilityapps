export interface Video {
  id: string;
  title: string;
  description: string;
  category: "Tools" | "Productivity" | "Finance" | "AI & Automation";
  toolId: string | null;
  /** YouTube's ISO duration doesn't come from oEmbed and we don't have a
   *  Data-API key, so this is filled in by hand. Empty string = hide the
   *  overlay in VideoCard. */
  duration: string;
  /** Human-formatted views count ("42K"). Same story — hand-filled or blank. */
  views: string;
  publishedAt: string;
  thumbnail: string;
  featured: boolean;
}

/**
 * Real UtilityApps channel videos.
 *
 * Titles were pulled from YouTube's public oEmbed endpoint
 * (https://www.youtube.com/oembed?url=…) so they match exactly what the
 * channel shows — including any typos in the original upload. If a title
 * looks off, fix it on YouTube itself and re-copy it here.
 *
 * Descriptions are short category-aware blurbs (oEmbed doesn't return
 * the real YouTube description — that'd need a Data API key). Duration
 * and view counts are blank for the same reason; VideoCard hides those
 * fields when empty.
 */
const CHANNEL_VIDEOS: Omit<Video, "thumbnail">[] = [
  {
    id: "w8A2PZgfZEk",
    title: "Everyone Complicates Software Too Much | This Is the Real Secret",
    description: "A software-mindset walkthrough on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: true,
  },
  {
    id: "P0dpWIAa1JY",
    title: "This Simple Adjustment to Your Templates Will Change Everything",
    description: "A productivity walkthrough on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "uDNlQ3-w1og",
    title:
      "Stop Paying for Tools You Can Get Free — 100+ Online Utilities in One Website | No Sign Up",
    description: "A tour of the UtilityApps toolkit on the Utility Apps Site YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "M2kOqC575Ms",
    title:
      "The entire game behind UtilityApps | Every Tool You’ve Googled, Free & Private: UtilityApps",
    description: "The story behind UtilityApps on the Utility Apps Site YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "g-2YcHf3mr8",
    title: "Your Brian will visualize better after watching this….",
    description: "A mental-model walkthrough on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "oiPzsRh_N3I",
    title: "Picture this scenario for a moment and see what it takes to ….",
    description: "A framing exercise on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "5wVIq3-8vuk",
    title: "The TRUTH No One Tells You About Human Attention (4 Stages of Engagement)",
    description: "An attention & engagement breakdown on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "GlW5JVw8DzE",
    title:
      "Stop Overcomplicating Productivity, Here You Have a Simple Approach | The Actual Guide",
    description: "A productivity walkthrough on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "7r2J_x8wjtc",
    title:
      "Stop Overcomplicating Productivity, Here You Have a Simple Approach | The Actual Guide.",
    description: "A productivity walkthrough on the Utility Apps Site YouTube channel.",
    category: "Productivity",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
];

/** Real YouTube thumbnails (11-char IDs are canonical channel uploads). */
export const VIDEOS: Video[] = CHANNEL_VIDEOS.map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
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
