import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { SidebarNewsletter } from "@/components/blog/SidebarNewsletter";
import {
  getAllPosts,
  getCategories,
  getPopularPosts,
  type BlogPostMeta,
} from "@/lib/blog";
import { getCategoryTheme } from "@/lib/blogThemes";
import { generateAuthorSchema } from "@/lib/schema";
import { SITE_CONFIG, cn, formatDate } from "@/lib/utils";

const PAGE_SIZE = 12;

const TITLE = "Free Tools Blog — Guides & Tutorials";
const DESCRIPTION =
  "Deep dives, money-saving guides, and practical tutorials for the tools you actually use. Free, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["tools blog", "productivity guides", "how-to tutorials", "tool tips and tricks"],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/blog`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

interface SearchParams {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function BlogIndexPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const category = (sp.category ?? "").trim();
  const q = (sp.q ?? "").trim().toLowerCase();

  const [allPosts, popular, categories] = await Promise.all([
    getAllPosts(),
    getPopularPosts(5),
    getCategories(),
  ]);
  const allMetas: BlogPostMeta[] = allPosts.map(({ body: _body, ...meta }) => meta);

  const filtered = allMetas.filter((post) => {
    if (category && post.category.toLowerCase() !== category.toLowerCase()) return false;
    if (q) {
      const haystack = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const featured = !category && !q
    ? allMetas.find((p) => p.featured) ?? null
    : null;

  const pool = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;
  const totalPages = Math.max(1, Math.ceil(pool.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = pool.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_CONFIG.name} Blog`,
    url: `${SITE_CONFIG.url}/blog`,
    description: DESCRIPTION,
    blogPost: allMetas.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_CONFIG.url}${post.url}`,
      author: generateAuthorSchema(post.author),
      articleSection: post.category,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <BlogHero defaultQuery={q} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div className="min-w-0">
          {featured && <FeaturedPostCard post={featured} />}

          <CategoryFilters categories={categories} active={category} q={q} />

          <AdSlot position="mid" />

          {pageItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-surface-200 p-10 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
              No posts match those filters yet. Try a different category or clear your search.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          <Pagination page={safePage} totalPages={totalPages} category={category} q={q} />
        </div>

        <aside className="mt-12 space-y-8 lg:mt-0">
          <SidebarPopular posts={popular} />
          <SidebarCategories categories={categories} active={category} />
          <SidebarNewsletter />
        </aside>
      </div>
    </>
  );
}

function BlogHero({ defaultQuery }: { defaultQuery: string }) {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-12 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          The UtilityApps Blog
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Tools that save time and money — explained
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Deep dives, calculators, and practical tutorials for the tools you actually use. Free,
          no signup, written by people who use them daily.
        </p>

        <form action="/blog" method="get" role="search" className="mx-auto mt-8 flex w-full max-w-xl items-center rounded-2xl border border-surface-200 bg-white shadow-card focus-within:border-primary-400 focus-within:shadow-glow dark:border-surface-800 dark:bg-surface-900">
          <span className="pl-4 text-surface-400">
            <Search className="h-4 w-4" />
          </span>
          <label htmlFor="blog-search" className="sr-only">
            Search the blog
          </label>
          <input
            id="blog-search"
            name="q"
            defaultValue={defaultQuery}
            placeholder="Search articles, e.g. mortgage, BMI, image compression"
            className="h-12 flex-1 bg-transparent px-3 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-white"
          />
          <button
            type="submit"
            className="m-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

function FeaturedPostCard({ post }: { post: BlogPostMeta }) {
  const theme = getCategoryTheme(post.category);
  return (
    <Link
      href={post.url}
      className="group mb-10 grid overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:grid-cols-[1.2fr_1fr] dark:border-surface-800 dark:bg-surface-900"
    >
      <div
        className="relative h-48 overflow-hidden sm:h-auto"
        style={{ backgroundImage: theme.gradient }}
        aria-hidden="true"
      >
        <theme.Icon
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-white/30"
          strokeWidth={1.5}
        />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_60%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          Featured
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {post.category}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm text-surface-600 dark:text-surface-300">
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-surface-500 dark:text-surface-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTimeMinutes} min · {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400">
            Read featured
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPostMeta }) {
  const theme = getCategoryTheme(post.category);
  return (
    <Link
      href={post.url}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{ backgroundImage: theme.gradient }}
        aria-hidden="true"
      >
        <theme.Icon
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white/30"
          strokeWidth={1.5}
        />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_60%)]" />
        <span className="absolute bottom-3 left-4 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-surface-900 dark:text-white">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-surface-600 dark:text-surface-300">
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-surface-500 dark:text-surface-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTimeMinutes} min · {formatDate(post.date)}
          </span>
          <span className="text-[11px]">{post.author}</span>
        </div>
      </div>
    </Link>
  );
}

function CategoryFilters({
  categories,
  active,
  q,
}: {
  categories: { name: string; count: number }[];
  active: string;
  q: string;
}) {
  if (categories.length === 0) return null;
  const buildHref = (cat: string | null) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
      <Link
        href={buildHref(null)}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
          !active
            ? "border-primary-500 bg-primary-500 text-white"
            : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
        )}
      >
        All
      </Link>
      {categories.map((c) => {
        const isActive = active.toLowerCase() === c.name.toLowerCase();
        return (
          <Link
            key={c.name}
            href={buildHref(c.name)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
              isActive
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200"
            )}
          >
            {c.name}
            <span className="text-[10px] opacity-80">{c.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Pagination({
  page,
  totalPages,
  category,
  q,
}: {
  page: number;
  totalPages: number;
  category: string;
  q: string;
}) {
  if (totalPages <= 1) return null;
  const buildHref = (n: number) => {
    const params = new URLSearchParams();
    if (n > 1) params.set("page", String(n));
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className="rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200"
        >
          ← Previous
        </Link>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={buildHref(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "min-w-[2.5rem] rounded-xl border px-3 py-2 text-center text-sm font-medium transition",
            n === page
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-surface-200 text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200"
          )}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className="rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:text-surface-200"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

function SidebarPopular({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        Popular posts
      </h3>
      <ol className="mt-3 space-y-3">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={post.url}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-surface-50 dark:hover:bg-surface-900"
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {post.title}
                </span>
                <span className="block text-[11px] text-surface-500 dark:text-surface-400">
                  {post.readingTimeMinutes} min · {post.category}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SidebarCategories({
  categories,
  active,
}: {
  categories: { name: string; count: number }[];
  active: string;
}) {
  if (categories.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        Categories
      </h3>
      <ul className="mt-3 space-y-1">
        {categories.map((c) => {
          const isActive = active.toLowerCase() === c.name.toLowerCase();
          return (
            <li key={c.name}>
              <Link
                href={`/blog?category=${encodeURIComponent(c.name)}`}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-primary-50 font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                    : "text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-900"
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400">{c.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

