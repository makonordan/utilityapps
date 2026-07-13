import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Cpu, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { type FAQItem, ToolFAQ } from "@/components/tools/ToolFAQ";
import { getIcon } from "@/lib/icons";
import { VIDEO_TOOLS_CONFIG, type VideoToolId } from "@/lib/videoTools";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const CATEGORY_COLOR = "#EC4899";

const TITLE = "Free Video Tools — Compress, Trim & More";
const DESCRIPTION =
  "8 free in-browser video tools. Compress, trim, convert to WebM or GIF, extract audio, pull frames, mute, and resize MP4, MOV, WebM and more. No upload, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "free video tools",
    "online video tools",
    "video compressor",
    "video trimmer",
    "mp4 to gif",
    "mp4 to webm",
    "extract audio from video",
    "video frame extractor",
    "mute video",
    "video resizer",
  ],
  alternates: { canonical: "/tools/video-tools" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/video-tools`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/og/categories/video-tools`,
        width: 1200,
        height: 630,
        alt: "UtilityApps Video Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_CONFIG.url}/og/categories/video-tools`],
    creator: SITE_CONFIG.twitterHandle,
  },
};

interface ToolGroup {
  id: string;
  title: string;
  description: string;
  toolIds: VideoToolId[];
}

const GROUPS: ToolGroup[] = [
  {
    id: "shrink-and-cut",
    title: "Shrink & Cut",
    description:
      "Compress for chat platforms, trim down to the part you want, and remove audio without re-encoding.",
    toolIds: ["video-compressor", "video-trimmer", "mute-video"],
  },
  {
    id: "convert",
    title: "Convert",
    description:
      "Turn videos into GIFs, WebM, or pull the audio out as MP3 or AAC.",
    toolIds: ["video-to-gif", "mp4-to-webm", "extract-audio-from-video"],
  },
  {
    id: "transform",
    title: "Transform",
    description:
      "Resize for social platforms and pull individual frames as PNG or JPG.",
    toolIds: ["video-resizer", "video-frame-extractor"],
  },
];

const KEY_FEATURES: Record<VideoToolId, string[]> = {
  "video-compressor": ["H.264 MP4 output", "Quality presets", "Up to 80% smaller"],
  "video-trimmer": ["Lossless stream-copy", "Timeline scrub", "Any container"],
  "video-to-gif": ["Configurable fps + width", "1–30s clips", "Palette pass"],
  "mp4-to-webm": ["VP8 / Vorbis", "Web-optimised", "Smaller than MP4"],
  "extract-audio-from-video": ["MP3 + AAC", "192 kbps default", "Multi-format input"],
  "video-frame-extractor": ["Single / interval / all", "PNG or JPG", "ZIP packaging"],
  "mute-video": ["No re-encode", "Lossless video", "Instant"],
  "video-resizer": ["Reel · Square · 16:9", "Custom dimensions", "Aspect-ratio lock"],
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Are these video tools really free?",
    a: "Yes — all 8 video tools are 100% free, no signup, no daily quota, no watermarks. The transcodes run entirely in your browser using ffmpeg.wasm, so there's no server cost we'd need to pass on.",
  },
  {
    q: "Do you upload my video to a server?",
    a: "No. Every tool in this section processes files locally using ffmpeg compiled to WebAssembly. Your video never leaves your browser tab.",
  },
  {
    q: "Why is the first transcode slow?",
    a: "On first use, the browser downloads the WebAssembly build of ffmpeg (about 30 MB) and caches it. Subsequent transcodes — including across other UtilityApps video tools — use the cached engine and start immediately.",
  },
  {
    q: "What input formats are supported?",
    a: "MP4, MOV, WebM, MKV, AVI, FLV, OGV, and 3GP are accepted across the section. Less common containers usually work too because ffmpeg probes the file content rather than relying on the extension.",
  },
  {
    q: "Is there a file size limit?",
    a: "Most tools accept up to 500 MB per file. Video-to-GIF and frame-extractor have lower limits (200–300 MB) because GIF encoding and frame buffering are memory-heavy.",
  },
  {
    q: "Will the tools work on mobile?",
    a: "Yes — they run in any modern mobile browser. Phones have less RAM than desktops, so very large files (300 MB+) may struggle. Stick to under 200 MB on mobile if possible.",
  },
  {
    q: "Can I batch-process multiple videos?",
    a: "Not yet — each video tool takes one file at a time. Batch mode is on the roadmap.",
  },
  {
    q: "Do the tools add a watermark to the output?",
    a: "No. None of our video tools add a watermark.",
  },
];

export default function VideoToolsHubPage() {
  const allTools = GROUPS.flatMap((g) => g.toolIds.map((id) => TOOLS_BY_ID[id])).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
          Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">Video Tools</span>
      </nav>

      <Hero />

      <AdSlot position="top" />

      <section className="mt-6 space-y-10">
        {GROUPS.map((group) => (
          <ToolGroupSection key={group.id} group={group} />
        ))}
      </section>

      <AdSlot position="bottom" />

      <section className="mt-14">
        <ToolFAQ items={FAQ_ITEMS} title="Video tools FAQ" />
      </section>

      <StructuredData tools={allTools} />
    </div>
  );
}

function Hero() {
  return (
    <header className="space-y-5">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow"
        style={{ backgroundColor: CATEGORY_COLOR }}
      >
        <Sparkles className="h-3 w-3" />
        8 free video tools
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
        Free Online Video Tools —<br className="hidden sm:block" /> Compress, Trim, Convert in Your Browser
      </h1>
      <p className="max-w-2xl text-base text-surface-600 sm:text-lg dark:text-surface-300">
        Eight video tools that run entirely in your browser using ffmpeg.wasm.
        Compress, trim, convert, mute, resize, and pull frames or audio out of
        any video — without uploading a single byte.
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {[
          { icon: Cpu, label: "100% Browser-Based" },
          { icon: Zap, label: "No Signup" },
          { icon: Lock, label: "No File Upload" },
          { icon: ShieldCheck, label: "Free Forever" },
        ].map((b) => (
          <li
            key={b.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200"
          >
            <b.icon className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
            {b.label}
          </li>
        ))}
      </ul>
    </header>
  );
}

function ToolGroupSection({ group }: { group: ToolGroup }) {
  const tools = group.toolIds.map((id) => TOOLS_BY_ID[id]).filter(Boolean);
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
          {group.title}
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{group.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <HubToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

function HubToolCard({ tool }: { tool: Tool }) {
  const Icon = getIcon(tool.icon);
  const features = KEY_FEATURES[tool.id as VideoToolId] ?? [];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700">
      <Link
        href={tool.href}
        aria-label={`Open ${tool.name}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
      />

      <div className="relative z-10 flex items-start justify-between p-5">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: CATEGORY_COLOR }}
        >
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-5 w-5" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
          <Lock className="h-3 w-3" /> Browser
        </span>
      </div>

      <h3 className="relative z-10 px-5 text-base font-semibold text-surface-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
        {tool.name}
      </h3>
      <p className="relative z-10 mt-1.5 line-clamp-3 px-5 text-sm text-surface-600 dark:text-surface-300">
        {tool.description}
      </p>

      <ul className="relative z-10 mt-3 flex flex-wrap gap-1.5 px-5">
        {features.map((f) => (
          <li
            key={f}
            className="rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-300"
          >
            {f}
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-surface-100 p-4 pt-3 dark:border-surface-800">
        <span
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400"
          aria-hidden="true"
        >
          Use tool
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function StructuredData({ tools }: { tools: Tool[] }) {
  const base = SITE_CONFIG.url;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${base}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Video Tools",
        item: `${base}/tools/video-tools`,
      },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free video tools",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}${tool.href}`,
      name: tool.name,
    })),
  };

  // Reference VIDEO_TOOLS_CONFIG so the type import is kept and we don't end
  // up with a phantom unused import after future edits.
  void VIDEO_TOOLS_CONFIG;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemList).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
