import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { getPollByPublicId } from "@/lib/pollQueries";

/**
 * Dynamic OG image for /tools/instant-poll/[publicId].
 *
 * Polls travel in link previews — WhatsApp, Twitter/X, Slack, iMessage.
 * The image renders the actual question + current vote count so
 * recipients see what they're being asked to vote on before tapping.
 *
 * Uses next/og (satori under the hood, same engine as /api/og). Node
 * runtime because we need the Supabase service-role client to read
 * the poll row; satori itself runs in both edge and node with no
 * behavioural difference at 1200x630.
 *
 * Cached at the CDN for 30 seconds with stale-while-revalidate so the
 * count in the image stays roughly current without slamming Supabase
 * every time a link unfurls in a new group.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIZE = { width: 1200, height: 630 } as const;

/** Palette pinned to the site's brand blue → purple gradient so the
 *  OG image reads as UtilityApps at a glance. */
const ACCENT = "#3B82F6";
const ACCENT_2 = "#8B5CF6";
const INK = "#0F172A";
const MUTED = "#64748B";
const FAINT = "#94A3B8";
const SURFACE = "#FFFFFF";

type Params = { params: Promise<{ publicId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { publicId } = await params;
  const fetched = await getPollByPublicId(publicId);

  if (!fetched) {
    return new ImageResponse(<NotFoundView />, { ...SIZE });
  }

  const { poll, results } = fetched;
  return new ImageResponse(
    <PollView question={poll.question} totalVotes={results.total} />,
    {
      ...SIZE,
      headers: {
        // 30s CDN cache + 60s stale-while-revalidate. Long enough that
        // a burst of link unfurls doesn't hammer the Supabase read;
        // short enough that the vote count in the image stays roughly
        // current for polls that are actively being shared.
        "cache-control":
          "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}

// ── Views ──────────────────────────────────────────────────────────────

function PollView({
  question,
  totalVotes,
}: {
  question: string;
  totalVotes: number;
}) {
  // Font size scales with question length so a one-liner reads as
  // massive-and-decisive and a 200-char question still fits on the
  // canvas.
  const questionFontSize =
    question.length > 150 ? 44 : question.length > 90 ? 56 : 72;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: SURFACE,
        padding: "60px 72px",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      {/* Eyebrow — brand chip + tool name. */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`,
            borderRadius: 12,
            color: "white",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          U
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: ACCENT,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            UtilityApps · Instant Poll
          </div>
          <div
            style={{
              fontSize: 16,
              color: MUTED,
              marginTop: 2,
            }}
          >
            utilityapps.site
          </div>
        </div>
      </div>

      {/* Question — the whole point of the image. */}
      <div
        style={{
          display: "flex",
          fontSize: questionFontSize,
          fontWeight: 800,
          color: INK,
          lineHeight: 1.15,
          maxWidth: 1056,
          wordBreak: "break-word",
        }}
      >
        {question}
      </div>

      {/* CTA pill + vote count. */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`,
            color: SURFACE,
            padding: "18px 32px",
            borderRadius: 999,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Tap to vote →
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: MUTED,
            fontWeight: 600,
          }}
        >
          {totalVotes.toLocaleString()}{" "}
          {totalVotes === 1 ? "vote" : "votes"} so far
        </div>
      </div>
    </div>
  );
}

function NotFoundView() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: SURFACE,
        fontFamily: "sans-serif",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 60,
          fontWeight: 800,
          color: INK,
        }}
      >
        Poll not found
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: FAINT,
        }}
      >
        Create your own · utilityapps.site/tools/instant-poll
      </div>
    </div>
  );
}
