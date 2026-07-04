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
 * Real UtilityApps channel videos. Only `id` is authoritative (YouTube is
 * the source of truth) — title/description/category should be filled in
 * per-video as we curate them. The YouTube thumbnail (loaded from
 * img.youtube.com) shows the actual video preview regardless, so a
 * placeholder title doesn't leave the page visually broken.
 *
 * TODO(daniel): edit each entry below with the real title, description,
 * duration, and category once you've reviewed them on the channel.
 */
const CHANNEL_VIDEOS: Omit<Video, "thumbnail">[] = [
  {
    id: "w8A2PZgfZEk",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: true,
  },
  {
    id: "P0dpWIAa1JY",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "uDNlQ3-w1og",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "M2kOqC575Ms",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "g-2YcHf3mr8",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "oiPzsRh_N3I",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "5wVIq3-8vuk",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "GlW5JVw8DzE",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
    toolId: null,
    duration: "",
    views: "",
    publishedAt: "2026-07-04",
    featured: false,
  },
  {
    id: "7r2J_x8wjtc",
    title: "UtilityApps tutorial",
    description: "Walkthrough on the UtilityApps YouTube channel.",
    category: "Tools",
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
