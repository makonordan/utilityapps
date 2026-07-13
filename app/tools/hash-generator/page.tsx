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
        seoContent={<SeoContent />}
      >
        <HashGenerator />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Which hash algorithm should you use?</h2>
      <p>
        MD5 and SHA-1 are fast but cryptographically broken — collisions (two different inputs
        producing the same hash) have been demonstrated for both, so neither should be used for
        security purposes like password storage or verifying that a file hasn&rsquo;t been tampered
        with by an adversary. SHA-256 and SHA-512 are the current standard for security-sensitive
        use cases; MD5 and SHA-1 still show up for legacy compatibility (checksums, non-security
        deduplication) where collision resistance doesn&rsquo;t matter.
      </p>
      <h2>Verifying a file download</h2>
      <p>
        Many software releases publish a SHA-256 checksum alongside the download. Hashing the file
        you downloaded and comparing it to the published value confirms the file wasn&rsquo;t corrupted
        in transit or swapped for a tampered copy — any single-byte difference in the file produces
        a completely different hash.
      </p>
      <h2>Hashing files, not just text</h2>
      <p>
        Beyond pasted text, the tool hashes files directly in your browser using the WebCrypto
        API — the same browser-native cryptography engine used for HTTPS — so large files are
        hashed quickly without ever leaving your device.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        No signup, and neither your text nor your files are uploaded — hashing runs entirely
        client-side via WebCrypto.
      </p>
    </article>
  );
}
