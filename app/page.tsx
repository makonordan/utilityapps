import type { Metadata } from "next";

import { AdSlot } from "@/components/ads/AdSlot";
import { AllTools } from "@/components/home/AllTools";
import { FAQ } from "@/components/home/FAQ";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { Stats } from "@/components/home/Stats";
import { TrendingTools } from "@/components/home/TrendingTools";
import { YouTubeHub } from "@/components/home/YouTubeHub";
import { getFeaturedPosts } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/utils";

const HOME_TITLE = `${SITE_CONFIG.name} — 200+ Free AI Utility Tools for Everyday Work`;
const HOME_DESCRIPTION =
  "No signup. No downloads. 100% free online tools for creators, freelancers, developers, students, marketers and businesses.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_CONFIG.url,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SITE_CONFIG.ogImage],
  },
};

export default async function HomePage() {
  const posts = await getFeaturedPosts(3);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="top" />
      </div>
      <TrendingTools />
      <AllTools />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <AdSlot position="mid" />
      </div>
      <HowItWorks />
      <FeaturedPosts posts={posts} />
      <ProductsPreview />
      <YouTubeHub />
      <Stats />
      <Newsletter />
      <FAQ />
    </>
  );
}
