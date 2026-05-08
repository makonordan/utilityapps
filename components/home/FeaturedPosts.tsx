import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Calculator,
  Clock,
  Code2,
  HeartPulse,
  Image as ImageIcon,
  type LucideIcon,
  Search,
  Sparkles,
  Type,
} from "lucide-react";

import type { FeaturedPost } from "@/lib/posts";
import { cn, formatDate } from "@/lib/utils";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  "Text Tools": Type,
  "Image Tools": ImageIcon,
  "Calculator Tools": Calculator,
  "Finance Tools": Banknote,
  "Health Tools": HeartPulse,
  "Developer Tools": Code2,
  "SEO Tools": Search,
  "Productivity Tools": Sparkles,
};

export function FeaturedPosts({ posts }: { posts: FeaturedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            From the UtilityApps Blog
          </h2>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Deep dives, money-saving guides, and tutorials for our most-used tools.
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          View all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const Icon = CATEGORY_ICON[post.category] ?? Sparkles;
          return (
          <li key={post.slug}>
            <Link
              href={post.url}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900"
            >
              <div
                className={cn(
                  "relative h-44 w-full overflow-hidden bg-gradient-to-br",
                  post.gradient
                )}
                aria-hidden="true"
              >
                {post.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  </>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.45),transparent_60%)]" />
                    <span className="absolute -right-6 -top-6 opacity-30 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-40 w-40 text-white" strokeWidth={1.4} />
                    </span>
                  </>
                )}
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  <Icon className="h-3 w-3" />
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
                    {post.readingTimeMinutes} min read · {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
          );
        })}
      </ul>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400"
        >
          View all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
