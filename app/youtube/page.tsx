import type { Metadata } from "next";
import { ArrowUpRight, Banknote, Bell, Bot, Eye, type LucideIcon, Play, Sparkles, Wrench, Zap } from "lucide-react";

import { YoutubeIcon } from "@/components/icons/SocialIcons";
import { LiteYouTube } from "@/components/youtube/LiteYouTube";
import { VideoHub } from "@/components/youtube/VideoHub";
import { VIDEOS, type Video, getFeaturedVideo, watchUrl } from "@/lib/videos";
import { SITE_CONFIG, formatDate } from "@/lib/utils";

const TITLE = `Free Tool Tutorials — ${SITE_CONFIG.name} YouTube Hub`;
const DESCRIPTION =
  "Step-by-step video tutorials for every tool on UtilityApps. Calculators, image tools, AI workflows — explained in under 10 minutes each.";
const CHANNEL_HANDLE = "@utilityapps";
const CHANNEL_URL = `https://www.youtube.com/${CHANNEL_HANDLE}`;
const SUBSCRIBER_COUNT = "12,400";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/youtube" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/youtube`,
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

export default function YouTubeHubPage() {
  const featured = getFeaturedVideo();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_CONFIG.name} Tutorials`,
    itemListElement: VIDEOS.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: watchUrl(v.id),
      name: v.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />

      {featured && (
        <FeaturedVideo
          videoId={featured.id}
          title={featured.title}
          description={featured.description}
          duration={featured.duration}
          views={featured.views}
          publishedAt={featured.publishedAt}
          thumbnail={featured.thumbnail}
          category={featured.category}
        />
      )}

      <VideoHub videos={VIDEOS} />

      <SubscribeCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-10 pt-14 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50/60 px-3 py-1 text-xs font-semibold text-warning-700 dark:border-warning-700/40 dark:bg-warning-500/10 dark:text-warning-300">
          <YoutubeIcon className="h-3.5 w-3.5" />
          UtilityApps on YouTube
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Learn with free video tutorials
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-surface-600 dark:text-surface-300">
          Step-by-step guides for every tool on UtilityApps. New tutorial every Friday.
        </p>
      </div>
    </section>
  );
}

const FEATURED_GRADIENT: Record<Video["category"], string> = {
  Tools: "from-primary-500 to-accent-500",
  Productivity: "from-accent-500 to-primary-500",
  Finance: "from-success-500 to-primary-500",
  "AI & Automation": "from-warning-500 to-accent-500",
};

const FEATURED_ICON: Record<Video["category"], LucideIcon> = {
  Tools: Wrench,
  Productivity: Zap,
  Finance: Banknote,
  "AI & Automation": Bot,
};

// Pre-render JSX so we can pass it across the RSC boundary into <LiteYouTube>
// (a Client Component). React server components can't pass function references.
function renderFeaturedIcon(category: Video["category"]) {
  const Icon = FEATURED_ICON[category] ?? Sparkles;
  return <Icon strokeWidth={1.2} />;
}

function FeaturedVideo({
  videoId,
  title,
  description,
  duration,
  views,
  publishedAt,
  thumbnail,
  category,
}: {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
  category: Video["category"];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-surface-200 bg-black shadow-card-hover dark:border-surface-800">
          <LiteYouTube
            videoId={videoId}
            title={title}
            thumbnail={thumbnail}
            fallbackGradient={FEATURED_GRADIENT[category] ?? "from-primary-500 to-accent-500"}
            fallbackIconNode={renderFeaturedIcon(category)}
            fallbackEyebrow={category}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Featured tutorial
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
          <p className="mt-3 text-base text-surface-600 dark:text-surface-300">{description}</p>
          <ul className="mt-5 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
            <li className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2 py-0.5 font-semibold dark:bg-surface-800">
              <Play className="h-3 w-3" /> {duration}
            </li>
            <li className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> {views} views
            </li>
            <li>·</li>
            <li>
              <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            </li>
          </ul>
          <a
            href={watchUrl(videoId)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600 sm:w-auto sm:self-start"
          >
            Watch on YouTube
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SubscribeCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-surface-800 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950 p-8 text-white sm:p-12"
        style={{ backgroundColor: "#020617" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,0,0,0.25),rgba(124,58,237,0.25))] opacity-40 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-2xl">
            <YoutubeIcon className="h-8 w-8" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Subscribe to the UtilityApps channel
            </h2>
            <p className="mt-1 text-sm text-surface-200">
              One short tutorial every Friday — tools, calculators, and AI workflows you can use the
              same day.
            </p>
            <p className="mt-2 text-xs text-surface-400">
              {SUBSCRIBER_COUNT} subscribers · new uploads weekly
            </p>
          </div>
          <a
            href={`${CHANNEL_URL}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF0000] px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-[#cc0000]"
          >
            <Bell className="h-4 w-4" />
            Subscribe
          </a>
        </div>
      </div>
    </section>
  );
}
