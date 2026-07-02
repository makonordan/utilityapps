import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CardView } from "@/components/business-card/CardView";
import {
  getPublicMasterCards,
  getPublicMasterSettings,
  getPublicUser,
} from "@/lib/businessCard/publicQueries";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * Master selector page — /bc/[username]. This is what someone sees
 * when they scan the master QR code. Mobile-first: list of card tiles,
 * each tappable, each linking to its own individual card page.
 *
 * ISR with 60-second revalidate so edits show up quickly without
 * hitting Supabase on every scan.
 */

export const revalidate = 60;

type Params = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const user = await getPublicUser(username);
  if (!user) return { title: "Not found" };
  const title = `${user.name} — Digital Business Cards`;
  return {
    title,
    description: `Save ${user.name}'s contact directly to your phone. All business cards in one place.`,
    alternates: { canonical: `/bc/${user.username}` },
    openGraph: {
      type: "profile",
      title,
      description: `All of ${user.name}'s business cards. Tap to save.`,
      url: `${SITE_CONFIG.url}/bc/${user.username}`,
      images: user.avatarUrl ? [{ url: user.avatarUrl, width: 400, height: 400, alt: user.name }] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function MasterPage({ params }: Params) {
  const { username } = await params;
  const user = await getPublicUser(username);
  if (!user) notFound();
  const [settings, cards] = await Promise.all([
    getPublicMasterSettings(user.id),
    getPublicMasterCards(user.id),
  ]);

  const bg = settings?.background_style === "solid"
    ? settings.background_color
    : `linear-gradient(180deg, ${settings?.background_color ?? "#0F172A"} 0%, ${settings?.background_color ?? "#0F172A"}dd 100%)`;

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:px-6">
        {/* Owner header */}
        <header className="text-center text-white">
          {(settings?.show_avatar ?? true) && (settings?.master_avatar_url ?? user.avatarUrl) && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={settings?.master_avatar_url ?? user.avatarUrl ?? ""}
              alt=""
              className="mx-auto h-24 w-24 rounded-full border-2 border-white/30 object-cover shadow-xl"
            />
          )}
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {settings?.page_title ?? user.name}
          </h1>
          {settings?.page_bio && (
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">{settings.page_bio}</p>
          )}
        </header>

        {/* Card tiles */}
        <main className="mt-8 flex-1 space-y-3">
          {cards.length === 0 && (
            <div className="rounded-2xl bg-white/10 p-6 text-center text-sm text-white/80 backdrop-blur">
              This user hasn&rsquo;t published any cards yet.
            </div>
          )}
          {cards.map((card) => (
            <CardView
              key={card.id}
              card={card}
              compact
              href={`/bc/${user.username}/${card.slug}`}
            />
          ))}
        </main>

        {/* Footer */}
        <footer className="mt-10 pt-6 text-center text-[11px] text-white/60">
          <p>
            Created with{" "}
            <Link href="/tools/business-card" className="underline decoration-white/40 underline-offset-2 hover:text-white">
              {SITE_CONFIG.name}
            </Link>
            {" · "}
            <Link href="/tools/business-card" className="underline decoration-white/40 underline-offset-2 hover:text-white">
              Create your free card →
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
