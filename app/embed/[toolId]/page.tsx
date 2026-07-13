import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { ColorConverter } from "@/components/dev-tools/ColorConverter";
import { HashGenerator } from "@/components/dev-tools/HashGenerator";
import { RegexTester } from "@/components/dev-tools/RegexTester";
import { UuidGenerator } from "@/components/dev-tools/UuidGenerator";
import { ContrastChecker } from "@/components/design-tools/ContrastChecker";
import { GradientGenerator } from "@/components/design-tools/GradientGenerator";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ toolId: string }>;
}

/**
 * Embed-only render of a tool, designed to be iframed from third-party sites.
 * Site chrome (Header / Footer / banners / floating UI) is suppressed by
 * the root layout via `<HideOnEmbed>` so the iframe shows only the tool +
 * a small "Powered by UtilityApps" attribution badge.
 *
 * Each entry is a curated tool whose inner component is self-contained
 * (no shell dependencies, no `toolId`-prop expectations from the shell).
 * Browser-side dev/design tools are the highest-value embed targets —
 * bloggers iframe them into tutorials, which seeds backlinks passively.
 */

const EMBEDDABLE_TOOLS: Record<string, () => ReactNode> = {
  "uuid-generator": () => <UuidGenerator />,
  "hash-generator": () => <HashGenerator />,
  "color-converter": () => <ColorConverter />,
  "regex-tester": () => <RegexTester />,
  "contrast-checker": () => <ContrastChecker />,
  "gradient-generator": () => <GradientGenerator />,
};

export async function generateStaticParams() {
  return Object.keys(EMBEDDABLE_TOOLS).map((toolId) => ({ toolId }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { toolId } = await params;
  const tool = TOOLS_BY_ID[toolId];
  if (!tool || !EMBEDDABLE_TOOLS[toolId]) {
    return { title: "Embed not found" };
  }

  const title = `${tool.name} — Embed`;
  return {
    title,
    description: `${tool.name} embeddable widget for ${SITE_CONFIG.name}.`,
    // Don't index the embed shell — Google should index the canonical
    // tool page, not the iframe target. Search Console penalizes
    // duplicate content otherwise.
    robots: { index: false, follow: true },
    alternates: { canonical: tool.href },
  };
}

export default async function EmbedPage({ params }: RouteParams) {
  const { toolId } = await params;
  const tool = TOOLS_BY_ID[toolId];
  const renderTool = EMBEDDABLE_TOOLS[toolId];
  if (!tool || !renderTool) notFound();

  return (
    <div className="relative min-h-screen bg-white p-4 dark:bg-surface-950">
      <EmbedToolBody tool={tool}>{renderTool()}</EmbedToolBody>
      <PoweredByBadge tool={tool} />
    </div>
  );
}

function EmbedToolBody({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">
          {tool.name}
        </h1>
        <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">
          {tool.description}
        </p>
      </header>
      {children}
    </div>
  );
}

/** Floating attribution. THIS is the backlink — when bloggers iframe the
 *  embed, this link goes back to the canonical tool page with a known
 *  utm_source so we can track which embeds drive real visits. */
function PoweredByBadge({ tool }: { tool: Tool }) {
  const href = `${SITE_CONFIG.url}${tool.href}?utm_source=embed&utm_medium=iframe`;
  return (
    <Link
      href={href}
      target="_top"
      rel="noopener"
      className="fixed bottom-3 right-3 z-50 inline-flex items-center gap-1.5 rounded-full bg-surface-900/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow-card backdrop-blur transition hover:bg-surface-900 dark:bg-white/10 dark:hover:bg-white/20"
    >
      Powered by {SITE_CONFIG.name}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}
