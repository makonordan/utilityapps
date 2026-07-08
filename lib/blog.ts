import "server-only";

export type { Heading } from "./headings";
export { slugifyHeading } from "./headings";
import type { Heading } from "./headings";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  author: string;
  readingTimeMinutes: number;
  url: string;
  image?: string;
  headings: Heading[];
  gradient: string;
}

export interface BlogPost extends BlogPostMeta {
  body: { code: string; raw: string };
}

const GRADIENTS = [
  "from-primary-500 to-accent-500",
  "from-accent-500 to-primary-500",
  "from-primary-400 to-accent-600",
  "from-success-500 to-primary-500",
  "from-warning-500 to-accent-500",
];


interface RawPost {
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  author: string;
  slug?: string;
  readingTimeMinutes?: number;
  url?: string;
  image?: string;
  headings?: Heading[];
  body: { code: string; raw: string };
  _raw?: { flattenedPath?: string };
}

/**
 * A post goes live only once its frontmatter `date` has arrived. Future-dated
 * posts are hidden everywhere — the blog index, the sitemap, related lists, and
 * even their own URL (404 until the day) — which lets us schedule a staggered
 * rollout instead of publishing everything at once. Compared as YYYY-MM-DD
 * strings so the gate flips at UTC midnight with no timezone ambiguity.
 */
export function isPublished(date: string): boolean {
  return date.slice(0, 10) <= new Date().toISOString().slice(0, 10);
}

async function loadAllRawPosts(): Promise<RawPost[]> {
  try {
    const mod = (await import("contentlayer2/generated").catch(() => null)) as
      | { allPosts?: RawPost[] }
      | null;
    return mod?.allPosts ?? [];
  } catch {
    return [];
  }
}

function hydrate(post: RawPost, index: number): BlogPost {
  const slug = post.slug ?? post._raw?.flattenedPath?.replace(/^blog\//, "") ?? "";
  return {
    slug,
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    tags: post.tags ?? [],
    featured: post.featured ?? false,
    author: post.author,
    readingTimeMinutes: post.readingTimeMinutes ?? 5,
    url: post.url ?? `/blog/${slug}`,
    image: post.image,
    headings: post.headings ?? [],
    gradient: GRADIENTS[index % GRADIENTS.length],
    body: post.body,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const raw = await loadAllRawPosts();
  return raw
    .filter((p) => isPublished(p.date))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((p, i) => hydrate(p, i));
}

export async function getPostMetas(): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();
  return posts.map(({ body: _body, ...meta }) => meta);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedPosts(
  category: string,
  excludeSlug: string,
  limit: number = 3
): Promise<BlogPostMeta[]> {
  const all = await getPostMetas();
  const same = all.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase() && p.slug !== excludeSlug
  );
  if (same.length >= limit) return same.slice(0, limit);
  const filler = all
    .filter((p) => p.slug !== excludeSlug && !same.includes(p))
    .slice(0, limit - same.length);
  return [...same, ...filler];
}

export async function getPopularPosts(limit: number = 5): Promise<BlogPostMeta[]> {
  const all = await getPostMetas();
  return [...all]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const all = await getPostMetas();
  const counts = new Map<string, number>();
  for (const post of all) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
