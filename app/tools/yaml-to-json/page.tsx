import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { YamlToJson } from "@/components/dev-tools/YamlToJson";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "yaml-to-json";
const TITLE = "Free YAML to JSON Converter (and Back) — Live, In-Browser";
const DESCRIPTION =
  "Convert YAML to JSON or JSON to YAML free in your browser. Live preview, YAML 1.2 support, anchors and aliases handled. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml parser", "online yaml"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "YAML ↔ JSON" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function YamlToJsonPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="YAML ↔ JSON"
        description="Convert YAML to JSON and back. Powered by js-yaml (YAML 1.2). Output updates live as you type."
        faqItems={getDevFaqs(TOOL_ID)}
        seoContent={
          <article>
            <h2>YAML 1.2</h2>
            <p>
              The conversion uses js-yaml in YAML 1.2 mode — the spec used by Kubernetes, GitHub
              Actions, Ansible, Docker Compose, and most modern devops tools. Anchors and aliases
              in the source are resolved into duplicated values when converted to JSON.
            </p>
          </article>
        }
      >
        <YamlToJson />
      </DeveloperToolShell>
    </>
  );
}
