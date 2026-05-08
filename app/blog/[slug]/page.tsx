import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, User } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { Mdx } from "@/components/blog/Mdx";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type BlogPost,
  type Heading,
} from "@/lib/blog";
import { SITE_CONFIG, cn, formatDate } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, post.category, "free tools"],
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_CONFIG.name,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image ?? SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image ?? SITE_CONFIG.ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug, 3);
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ?? `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author, url: SITE_CONFIG.url },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.body.raw.trim().split(/\s+/).length,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_CONFIG.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <Schema data={articleJsonLd} />
      <Schema data={breadcrumbJsonLd} />

      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <TOC headings={post.headings} className="hidden lg:block" />

        <div className="min-w-0">
          <Breadcrumb post={post} />
          <ArticleHeader post={post} />

          <Mdx code={post.body.code} />

          <AdSlot position="in-article" />

          <ShareSection title={post.title} url={url} />
          <AuthorCard author={post.author} />
          {related.length > 0 && <RelatedPosts posts={related} />}

          <div className="mt-12">
            <Newsletter />
          </div>

          <AdSlot position="bottom" />
        </div>
      </article>
    </>
  );
}

function Schema({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function ReadingProgress() {
  return (
    <>
      <div
        aria-hidden="true"
        className="ua-reading-progress fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"
      />
      <style>{`
        .ua-reading-progress {
          transform: scaleX(0);
          animation: ua-reading-progress-fill linear;
          animation-timeline: scroll(root);
        }
        @keyframes ua-reading-progress-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ua-reading-progress { animation: none; }
        }
      `}</style>
    </>
  );
}

function Breadcrumb({ post }: { post: BlogPost }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li>
          <Link href="/blog" className="hover:text-surface-700 dark:hover:text-surface-200">
            Blog
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li>
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="hover:text-surface-700 dark:hover:text-surface-200"
          >
            {post.category}
          </Link>
        </li>
      </ol>
    </nav>
  );
}

function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mt-6 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        {post.category}
      </p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">{post.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500 dark:text-surface-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white">
            <User className="h-3.5 w-3.5" />
          </span>
          {post.author}
        </span>
        <span>·</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.readingTimeMinutes} min read
        </span>
      </div>
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-300">
                #{tag}
              </span>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function TOC({ headings, className }: { headings: Heading[]; className?: string }) {
  if (!headings || headings.length === 0) return null;
  return (
    <aside className={cn("self-start lg:sticky lg:top-24", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        On this page
      </h2>
      <nav className="mt-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 text-sm">
        <ol className="space-y-1.5">
          {headings.map((h) => (
            <li key={`${h.slug}-${h.level}`} className={cn(h.level === 3 && "ml-3")}>
              <a
                href={`#${h.slug}`}
                className="block rounded-lg px-2 py-1 text-surface-600 transition hover:bg-surface-50 hover:text-primary-600 dark:text-surface-300 dark:hover:bg-surface-900 dark:hover:text-primary-400"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}


function ShareSection({ title, url }: { title: string; url: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-surface-200 bg-surface-50/40 p-5 dark:border-surface-800 dark:bg-surface-900/40">
      <ShareButtons title={title} url={url} />
    </section>
  );
}

function AuthorCard({ author }: { author: string }) {
  return (
    <section className="mt-8 flex items-start gap-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <User className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Written by
        </p>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{author}</h3>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          We build free utility tools and write about the math, science, and trade-offs behind them.
          Got feedback or a tool request?{" "}
          <Link href="/contact" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function RelatedPosts({ posts }: { posts: { slug: string; url: string; title: string; category: string; readingTimeMinutes: number; date: string; gradient: string }[] }) {
  return (
    <section className="mt-12 space-y-5">
      <header className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Related articles
        </h2>
        <Link
          href="/blog"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          More from the blog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>
      <ul className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.url}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
            >
              <div className={cn("h-24 bg-gradient-to-br", p.gradient)} aria-hidden="true" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  {p.category}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-surface-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] text-surface-500 dark:text-surface-400">
                  <Clock className="h-3 w-3" />
                  {p.readingTimeMinutes} min · {formatDate(p.date)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

