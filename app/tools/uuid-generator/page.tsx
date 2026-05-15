import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { UuidGenerator } from "@/components/dev-tools/UuidGenerator";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "uuid-generator";
const TITLE = "Free UUID Generator — v1, v4, v7 (Single + Batch up to 1,000)";
const DESCRIPTION =
  "Generate UUIDs free in your browser — v1 (timestamp), v4 (random), or v7 (sortable). Single or batch up to 1,000. Copy or download as .txt. WebCrypto-backed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["uuid generator", "uuid v4", "uuid v7", "uuid v1", "guid generator", "online uuid"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "UUID Generator" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="UUID Generator"
        description="Generate UUIDs in v1, v4, or v7. One at a time or batches up to 1,000. Copy individual values, copy the whole batch, or download as a text file."
        faqItems={getDevFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>Picking a UUID version</h2>
            <p>
              <strong>v4</strong> is the safe default for most cases — fully random, opaque, no
              metadata leaks. <strong>v7</strong> is the modern choice for new systems: same
              opacity but sortable by creation time, which makes it ideal as a database primary
              key. <strong>v1</strong> is legacy — it embeds the timestamp and a node identifier,
              which is rarely what you want today.
            </p>
            <h2>Privacy</h2>
            <p>
              All randomness comes from the browser&apos;s WebCrypto API. UUIDs never leave your
              device — generation runs entirely client-side.
            </p>
          </article>
        }
      >
        <UuidGenerator />
      </DeveloperToolShell>
    </>
  );
}
