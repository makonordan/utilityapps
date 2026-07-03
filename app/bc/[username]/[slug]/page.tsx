import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { CardView } from "@/components/business-card/CardView";
import { OwnerActions } from "@/components/business-card/OwnerActions";
import { PageTracker } from "@/components/business-card/PageTracker";
import { ShareCardSection } from "@/components/business-card/ShareCardSection";
import { getPublicCard } from "@/lib/businessCard/publicQueries";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * Individual card page — /bc/[username]/[slug]. This is what someone
 * sees when they scan an individual card's QR code. Same mobile-first
 * layout as the master page, but only one card (in full) instead of a
 * tile list.
 */

export const revalidate = 60;

type Params = { params: Promise<{ username: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username, slug } = await params;
  const res = await getPublicCard(username, slug);
  if (!res) return { title: "Not found" };
  const { card } = res;
  const jobBit = card.job_title ? ` — ${card.job_title}` : "";
  const orgBit = card.company_name ? ` at ${card.company_name}` : "";
  const title = `${card.full_name}${jobBit}${orgBit}`;
  const description = card.tagline ?? card.bio?.slice(0, 160) ?? `Digital business card. Tap to save contact.`;
  return {
    title,
    description,
    alternates: { canonical: `/bc/${username}/${slug}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `${SITE_CONFIG.url}/bc/${username}/${slug}`,
      images: card.avatar_url ? [{ url: card.avatar_url, width: 400, height: 400, alt: card.full_name }] : [],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function IndividualCardPage({ params }: Params) {
  const { username, slug } = await params;
  const res = await getPublicCard(username, slug);
  if (!res) notFound();
  const { card, user } = res;

  const bg = `linear-gradient(180deg, ${card.brand_color_secondary} 0%, ${card.brand_color_primary} 100%)`;

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <PageTracker cardId={card.id} defaultType="link_visit" />
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6 sm:px-6">
        <Link
          href={`/bc/${username}`}
          className="mb-4 inline-flex items-center gap-1 self-start text-xs font-medium text-white/85 hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> All cards
        </Link>

        <main className="flex-1">
          <CardView card={card} />
          <OwnerActions cardOwnerUsername={username} cardId={card.id} />
          <ShareCardSection
            cardId={card.id}
            publicUrl={`${SITE_CONFIG.url}/bc/${username}/${slug}`}
          />
        </main>

        <footer className="mt-10 pt-6 text-center text-[11px] text-white/70">
          <Link
            href="/tools/business-card"
            className="underline decoration-white/40 underline-offset-2 hover:text-white"
          >
            Create your free card at {SITE_CONFIG.name} →
          </Link>
        </footer>
      </div>
    </div>
  );
}
