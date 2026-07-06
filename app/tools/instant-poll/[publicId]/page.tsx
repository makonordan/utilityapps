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

  const { poll, results } = fetched;
  // Cap the OG title so it fits inside link-unfurler chrome. The full
  // question still renders on the page itself; this is just the
  // preview.
  const displayQuestion =
    poll.question.length > 80 ? `${poll.question.slice(0, 77)}…` : poll.question;
  const title = `${displayQuestion} — Vote | ${SITE_CONFIG.name}`;
  const description =
    results.total > 0
      ? `${poll.options.length} options · ${results.total.toLocaleString()} ${
          results.total === 1 ? "vote" : "votes"
        } so far. Cast yours in seconds — no signup.`
      : `${poll.options.length} options. Be the first to vote — no signup, one tap.`;
  const canonical = `/tools/instant-poll/${poll.publicId}`;

  return {
    title,
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
          url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(
            displayQuestion
          )}&description=${encodeURIComponent(
            "Vote in seconds — no signup"
          )}&type=tool`,
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
    },
    // Individual polls shouldn't get indexed by Google — they're
    // ephemeral (30-day lifetime) and often internal-facing. Their
    // metadata still populates for social shares because those pull
    // OG tags directly.
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
