import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { JwtDecoder } from "@/components/dev-tools/JwtDecoder";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "jwt-decoder";
const TITLE = "Free JWT Decoder Online — Header, Payload, Signature Verify";
const DESCRIPTION =
  "Decode JWT tokens free in your browser. See header, payload, and signature, plus verify HS256/HS384/HS512 signatures with a shared secret. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["jwt decoder", "jwt parser", "jwt debugger", "decode jwt", "verify jwt signature", "jwt online"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "JWT Decoder" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function JwtDecoderPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="JWT Decoder"
        description="Paste a JWT and instantly see its header, payload, and signature. Verify HS256/HS384/HS512 signatures by providing the shared secret."
        faqItems={getDevFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>What is a JWT</h2>
            <p>
              A JSON Web Token (JWT) is a compact, URL-safe way to transmit signed claims between two
              parties. It has three base64url-encoded segments separated by dots: a header (algorithm
              and token type), a payload (the actual claims), and a signature that proves the token
              wasn&apos;t modified after signing.
            </p>
            <h2>Verifying signatures safely</h2>
            <p>
              This decoder verifies HMAC family signatures (HS256, HS384, HS512) using the WebCrypto
              API and a secret you provide. RSA and ECDSA signatures (RS256, ES256) are decoded for
              inspection but not verified — pasting a private key into a browser tool is risky and
              defeats the purpose of asymmetric crypto. Verify those server-side instead.
            </p>
          </article>
        }
      >
        <JwtDecoder />
      </DeveloperToolShell>
    </>
  );
}
