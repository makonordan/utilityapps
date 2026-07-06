import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PollVote } from "@/components/business-tools/PollVote";
import { getPollByPublicId } from "@/lib/pollQueries";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/instant-poll/[publicId] — the public poll page.
 *
 * This is the URL that lands in WhatsApp / Slack / email / SMS. It's
 * fetched on the server so the first paint has the poll question and
 * options ready — no client-side loading spinner between tap and vote,
 * and the OG preview in link unfurlers shows the actual question.
 *
 * `force-dynamic` because polls change constantly (vote counts) —
 * static generation or ISR would just serve stale numbers. The client
 * component takes over after mount and polls /api/poll/[publicId]
 * every 5 seconds to keep the results view live.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ publicId: string }> };

// ── Metadata ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { publicId } = await params;
  const fetched = await getPollByPublicId(publicId);
  if (!fetched) {
    return {
      title: `Poll not found | ${SITE_CONFIG.name}`,
      robots: { index: false, follow: false },
    };
  }

  const { poll } = fetched;
  // Cap the display question so it fits inside link-unfurler chrome
  // and the browser tab title. The full question still renders on the
  // page itself.
  const displayQuestion =
    poll.question.length > 80 ? `${poll.question.slice(0, 77)}…` : poll.question;
  // Description per spec — invitational + option count.
  const description = `Vote now — instant poll, no login. ${poll.options.length} options.`;
  const canonical = `/tools/instant-poll/${poll.publicId}`;
  // Cache-busting query param so a link that goes viral doesn't keep
  // showing the day-one vote count in unfurlers forever. Rounded to
  // the minute so the same request in quick succession still hits the
  // OG route's own 30s CDN cache.
  const ogCacheKey = Math.floor(Date.now() / 60_000);
  const ogUrl = `${SITE_CONFIG.url}/api/poll/${poll.publicId}/og?v=${ogCacheKey}`;

  return {
    // Per spec: the browser tab / share preview title IS the poll
    // question. No trailing " | UtilityApps" — the OG image and
    // description both surface the brand.
    title: displayQuestion,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: displayQuestion,
      description,
      url: `${SITE_CONFIG.url}${canonical}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `Poll: ${displayQuestion}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayQuestion,
      description,
      images: [ogUrl],
    },
    // Individual polls are ephemeral (30-day life) and often
    // internal-facing — noindex so Google's crawler doesn't flood
    // its index with abandoned "Where should we eat" polls. OG tags
    // still populate for social shares (they read HTML directly).
    robots: { index: false, follow: false },
  };
}

// ── Page ───────────────────────────────────────────────────────────────

export default async function PollPage({ params }: Params) {
  const { publicId } = await params;
  const fetched = await getPollByPublicId(publicId);
  if (!fetched) notFound();

  return (
    <>
      <PollVote initial={fetched} publicId={fetched.poll.publicId} />
    </>
  );
}
