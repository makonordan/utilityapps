import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { HashGenerator } from "@/components/dev-tools/HashGenerator";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "hash-generator";
const TITLE = "Free Hash Generator — MD5, SHA-1, SHA-256, SHA-512";
const DESCRIPTION =
  "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes of text or files free in your browser. WebCrypto-backed. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["hash generator", "md5 generator", "sha-256 generator", "sha-512", "online hash"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Hash Generator" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function HashGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="Hash Generator"
        description="Compute MD5, SHA-1, SHA-256, and SHA-512 hashes of text or files. SHA family hashes use the WebCrypto API directly; MD5 uses a tiny JS implementation. Files of any size work in-browser."
        faqItems={getDevFaqs(TOOL_ID)}
      >
        <HashGenerator />
      </DeveloperToolShell>
    </>
  );
}
