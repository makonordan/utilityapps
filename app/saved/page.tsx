import type { Metadata } from "next";

import { SavedToolsView } from "@/components/tools/SavedToolsView";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Your Saved Tools";
const DESCRIPTION =
  "Quickly return to the tools you've bookmarked. Saved anonymously on this device — no account, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/saved" },
  // Bookmarks are private to the user's device; don't index personal pages.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/saved`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
};

export default function SavedPage() {
  return <SavedToolsView />;
}
