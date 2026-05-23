import type { Metadata } from "next";

import { CookiePolicyGenerator } from "@/components/legal-tools/CookiePolicyGenerator";
import { LegalToolShell } from "@/components/legal-tools/LegalToolShell";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getLegalFaqs, legalToolOgUrl } from "@/lib/legalFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "cookie-policy-generator";

const TITLE = "Free Cookie Policy Generator — GDPR & CCPA Categories";
const DESCRIPTION =
  "Tick the cookie categories you use; the generator builds a complete cookie policy. GDPR + CCPA, PDF or Word.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "cookie policy generator",
    "free cookie policy",
    "gdpr cookie policy",
    "cookie policy template",
    "cookie disclosure generator",
    "cookies policy for website",
  ],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: legalToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Cookie Policy Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [legalToolOgUrl(TITLE, DESCRIPTION)],
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function CookiePolicyGeneratorPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <LegalToolShell
        toolId={TOOL_ID}
        title="Cookie Policy Generator"
        description="Pick the cookie categories your site uses and the third-party providers involved. The generator builds a complete, GDPR + CCPA-aware cookie policy."
        faqItems={getLegalFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CookiePolicyGenerator />
      </LegalToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>The five cookie categories</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — sessions, security, load balancing. Required for
          the site to function. No consent needed.
        </li>
        <li>
          <strong>Preferences</strong> — language, theme, region. Used to personalise the
          experience.
        </li>
        <li>
          <strong>Analytics</strong> — measure usage and performance. Requires opt-in consent in
          the EU/UK; opt-out in the US.
        </li>
        <li>
          <strong>Advertising</strong> — track users across sites for ads and measurement.
          Requires consent in the EU/UK; subject to opt-out rights in California and other US
          states.
        </li>
        <li>
          <strong>Social media</strong> — set by embedded widgets (Facebook, LinkedIn, X,
          YouTube). Treated as third-party tracking; consent recommended.
        </li>
      </ul>
      <h2>Policy vs banner — you need both</h2>
      <p>
        The <strong>policy</strong> is the document at <code>/cookies</code> explaining which
        cookies you set and why — that&rsquo;s what this tool generates. The{" "}
        <strong>banner</strong> is the UI element that asks for consent before non-essential
        cookies are set — that needs a separate tool or library (Cookiebot, Osano, custom React
        component). The policy describes what you do; the banner enforces consent.
      </p>
    </article>
  );
}
