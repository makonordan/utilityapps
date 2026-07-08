import { isPublished } from "./blog";

export interface FeaturedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTimeMinutes: number;
  url: string;
  image?: string;
  featured?: boolean;
  gradient: string;
}

const GRADIENTS = [
  "from-primary-500 to-accent-500",
  "from-accent-500 to-primary-500",
  "from-primary-400 to-accent-600",
  "from-success-500 to-primary-500",
  "from-warning-500 to-accent-500",
];

const PLACEHOLDER_POSTS: FeaturedPost[] = [
  {
    slug: "save-money-with-loan-calculator",
    title: "How to Save Thousands with the Right Loan Calculator",
    description:
      "Five small inputs that change your monthly payment more than you think — and how to spot a bad loan in 30 seconds.",
    date: "2026-04-22",
    category: "Finance Tools",
    readingTimeMinutes: 6,
    url: "/blog/save-money-with-loan-calculator",
    featured: true,
    gradient: GRADIENTS[0],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  {
    slug: "compress-images-without-quality-loss",
    title: "Compress Images Without Losing Quality (Even at 90%)",
    description:
      "The math behind WebP, AVIF, and modern compression — and the one setting that wrecks every photo you upload.",
    date: "2026-04-15",
    category: "Image Tools",
    readingTimeMinutes: 8,
    url: "/blog/compress-images-without-quality-loss",
    featured: true,
    gradient: GRADIENTS[1],
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  {
    slug: "bmi-vs-body-composition",
    title: "BMI Is Lying to You — Here's What to Track Instead",
    description:
      "Why BMI miscategorizes athletes, what waist-to-hip and body-fat % actually tell you, and the calculators worth bookmarking.",
    date: "2026-04-08",
    category: "Health Tools",
    readingTimeMinutes: 5,
    url: "/blog/bmi-vs-body-composition",
    featured: true,
    gradient: GRADIENTS[2],
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&h=600&q=80",
  },
];

export async function getFeaturedPosts(limit: number = 3): Promise<FeaturedPost[]> {
  try {
    // contentlayer2/generated only exists after `contentlayer2 build`. Try at runtime.
    const mod = (await import("contentlayer2/generated").catch(() => null)) as
      | { allPosts?: ContentlayerPost[] }
      | null;
    if (!mod?.allPosts || mod.allPosts.length === 0) return PLACEHOLDER_POSTS.slice(0, limit);

    return mod.allPosts
      .filter((p) => p.featured && isPublished(p.date))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, limit)
      .map((p, i) => ({
        slug: p.slug ?? p._raw?.flattenedPath?.replace(/^posts\//, "") ?? "",
        title: p.title,
        description: p.description,
        date: p.date,
        category: p.category,
        readingTimeMinutes: p.readingTimeMinutes ?? 5,
        url: p.url ?? `/blog/${p.slug ?? ""}`,
        image: p.image,
        featured: p.featured,
        gradient: GRADIENTS[i % GRADIENTS.length],
      }));
  } catch {
    return PLACEHOLDER_POSTS.slice(0, limit);
  }
}

export async function getRelatedPosts(
  category: string,
  limit: number = 3
): Promise<FeaturedPost[]> {
  const all = await getAllPosts();
  const matches = all.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
  if (matches.length >= limit) return matches.slice(0, limit);
  // pad with most-recent across categories so the section never disappears
  const fillers = all.filter((p) => !matches.includes(p)).slice(0, limit - matches.length);
  return [...matches, ...fillers].slice(0, limit);
}

async function getAllPosts(): Promise<FeaturedPost[]> {
  try {
    const mod = (await import("contentlayer2/generated").catch(() => null)) as
      | { allPosts?: ContentlayerPost[] }
      | null;
    if (!mod?.allPosts || mod.allPosts.length === 0) return PLACEHOLDER_POSTS;
    return mod.allPosts
      .filter((p) => isPublished(p.date))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .map((p, i) => ({
        slug: p.slug ?? p._raw?.flattenedPath?.replace(/^posts\//, "") ?? "",
        title: p.title,
        description: p.description,
        date: p.date,
        category: p.category,
        readingTimeMinutes: p.readingTimeMinutes ?? 5,
        url: p.url ?? `/blog/${p.slug ?? ""}`,
        image: p.image,
        featured: p.featured,
        gradient: GRADIENTS[i % GRADIENTS.length],
      }));
  } catch {
    return PLACEHOLDER_POSTS;
  }
}

interface ContentlayerPost {
  title: string;
  description: string;
  date: string;
  category: string;
  featured?: boolean;
  slug?: string;
  readingTimeMinutes?: number;
  url?: string;
  image?: string;
  _raw?: { flattenedPath?: string };
}
