import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cloud,
  Cpu,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { type FAQItem, ToolFAQ } from "@/components/tools/ToolFAQ";
import { getIcon } from "@/lib/icons";
import { IMAGE_TOOLS_CONFIG, type ImageToolId } from "@/lib/imageTools";
import { TOOLS_BY_ID, type Tool } from "@/lib/tools";
import { SITE_CONFIG, cn } from "@/lib/utils";

const CATEGORY_COLOR = "#7C3AED";

// ──────────────────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────────────────

const TITLE =
  "Free Image Tools Online — Compress, Resize, Convert, Edit & More | UtilityApps";
const DESCRIPTION =
  "13 free online image tools. Compress JPG, PNG, GIF and SVG. Resize, crop, convert, add watermarks, remove backgrounds, and more. No signup. 100% free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    // Generic category terms
    "free image tools",
    "online image tools",
    "image tools online",
    "free image editor",
    // Per-tool keywords for SEO authority consolidation
    "image compressor",
    "compress jpg",
    "compress png",
    "image resizer",
    "resize image",
    "image cropper",
    "crop image",
    "rotate image",
    "convert to jpg",
    "convert jpg to png",
    "convert jpg to webp",
    "photo editor online",
    "ai image upscaler",
    "remove background",
    "watermark image",
    "meme generator",
    "html to image",
    "url to image",
    "blur face",
    "anonymize photo",
  ],
  alternates: { canonical: "/tools/image-tools" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/image-tools`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/og/categories/image-tools`,
        width: 1200,
        height: 630,
        alt: "UtilityApps Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_CONFIG.url}/og/categories/image-tools`],
    creator: SITE_CONFIG.twitterHandle,
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Grouping
// ──────────────────────────────────────────────────────────────────────────

interface ToolGroup {
  id: string;
  title: string;
  description: string;
  toolIds: ImageToolId[];
}

const GROUPS: ToolGroup[] = [
  {
    id: "optimize",
    title: "Optimize & Transform",
    description:
      "Cut file size, change dimensions, and re-orient photos for any platform.",
    toolIds: ["compress-image", "resize-image", "crop-image", "rotate-image"],
  },
  {
    id: "convert",
    title: "Convert",
    description: "Switch between JPG, PNG, WEBP, GIF, HEIC, TIFF, SVG and more.",
    toolIds: ["convert-to-jpg", "convert-from-jpg"],
  },
  {
    id: "edit",
    title: "Edit & Enhance",
    description: "Add text, stickers, filters, watermarks. Upscale with AI. Make memes.",
    toolIds: ["photo-editor", "upscale-image", "watermark-image", "meme-generator"],
  },
  {
    id: "advanced",
    title: "Advanced",
    description:
      "AI-powered tools and developer-grade utilities — background removal, face anonymisation, and webpage capture.",
    toolIds: ["remove-background", "blur-face", "html-to-image"],
  },
];

const KEY_FEATURES: Record<ImageToolId, string[]> = {
  "compress-image": ["JPG · PNG · SVG · GIF", "Bulk · 50 files", "Up to 90% smaller"],
  "resize-image": ["Pixels or %", "Social presets", "Bulk + ZIP"],
  "crop-image": ["Visual editor", "Aspect-ratio lock", "Rule of thirds"],
  "rotate-image": ["90° / custom angle", "Bulk", "Orientation filter"],
  "convert-to-jpg": ["PNG · WEBP · HEIC", "TIFF · SVG · BMP", "Transparent → colour"],
  "convert-from-jpg": ["JPG → PNG / WEBP", "Animated GIF maker", "Bulk + ZIP"],
  "photo-editor": ["Text · stickers · frames", "17 filters", "Free drawing"],
  "upscale-image": ["AI 2× and 4×", "Browser-side TF.js", "No upload"],
  "watermark-image": ["Text or logo", "9 positions + tile", "Bulk + ZIP"],
  "meme-generator": ["20 classic templates", "Impact font", "Custom overlays"],
  "remove-background": ["AI-powered", "Replace background", "50 free / month"],
  "blur-face": ["AI face detection", "Manual regions too", "GDPR-friendly"],
  "html-to-image": ["URL → screenshot", "HTML → image", "Retina capture"],
};

// ──────────────────────────────────────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Are these image tools really free?",
    a: "Yes — all 13 image tools are 100% free, with no signup, no daily quota, and no watermarks on the output. Most of them run entirely in your browser, so there's no server cost we'd need to pass on.",
  },
  {
    q: "Do you upload my images to a server?",
    a: 'Almost never. 10 of the 13 image tools process files entirely in your browser using the Canvas API and (where relevant) TensorFlow.js. The only exceptions are <strong>Remove Background</strong> (sends to remove.bg over HTTPS) and <strong>HTML to Image\'s URL mode</strong> (uses a screenshot API). Both clearly say so on the tool page, and neither service retains your file after the response.',
  },
  {
    q: "Which image format is best for the web?",
    a: "For most photos: <strong>WEBP</strong> at quality 80–90, falling back to <strong>JPG</strong> for older platforms. For graphics with transparency or sharp edges: <strong>PNG</strong>. For animations: <strong>GIF</strong> or, if size matters, encode as <strong>WEBP</strong> animation.",
  },
  {
    q: "Can I compress images without losing quality?",
    a: 'Yes — for PNGs and SVGs, lossless compression is the default. For JPGs and WEBPs, quality 90+ produces files that are visually indistinguishable from the source while still shrinking the byte count significantly. Try the <a href="/tools/compress-image">Image Compressor</a> to see how much you can save.',
  },
  {
    q: "What is the maximum file size?",
    a: "Most tools accept files up to 50 MB. AI-powered tools (Upscale, Remove Background, Blur Face) cap at 10–25 MB so the AI doesn't run out of memory on weaker devices.",
  },
  {
    q: "Can I process multiple images at once?",
    a: 'Yes — Compress, Resize, Rotate, Convert (both directions), and Watermark all support bulk processing of up to 20 files at a time, with a single-ZIP download at the end.',
  },
  {
    q: "Do these tools work on mobile?",
    a: "Yes. Every tool is responsive, accepts touch input on draggable controls (crop handles, meme overlays, blur regions), and works in modern mobile browsers (Chrome, Safari, Firefox).",
  },
  {
    q: "Will my images have a watermark added by your tools?",
    a: "No. None of our tools add a watermark to your output. The <a href=\"/tools/watermark-image\">Watermark Image</a> tool only adds watermarks if you ask it to, with your own text or logo.",
  },
  {
    q: "Can I use these tools commercially?",
    a: "Yes. There are no commercial restrictions on the output you create — use it for client work, products, marketing, anything.",
  },
  {
    q: "What if I need a feature that's not here?",
    a: 'Let us know — we add tools based on what people ask for. Until then, our <a href="/tools/photo-editor">Photo Editor</a> covers most general-purpose editing, and the rest of the toolkit handles every workflow we\'ve seen requested in the last year.',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────

export default function ImageToolsHubPage() {
  // Sanity-check that every tool id we reference exists. (Throws at build
  // time if someone deletes a tool without updating GROUPS.)
  const allTools = GROUPS.flatMap((g) => g.toolIds.map((id) => TOOLS_BY_ID[id])).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
          Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-surface-700 dark:text-surface-200">Image Tools</span>
      </nav>

      {/* Hero */}
      <Hero />

      {/* Top ad */}
      <AdSlot position="top" />

      {/* Tools grid */}
      <section className="mt-6 space-y-10">
        {GROUPS.map((group) => (
          <ToolGroupSection key={group.id} group={group} />
        ))}
      </section>

      {/* Why us */}
      <WhyUsSection />

      {/* Comparison table */}
      <ComparisonTable />

      {/* Educational content */}
      <EducationalContent />

      {/* Bottom ad */}
      <AdSlot position="bottom" />

      {/* FAQ */}
      <section className="mt-14">
        <ToolFAQ items={FAQ_ITEMS} title="Image tools FAQ" />
      </section>

      {/* Related categories */}
      <RelatedCategories />

      {/* Structured data */}
      <StructuredData tools={allTools} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Sections
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <header className="space-y-5">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow"
        style={{ backgroundColor: CATEGORY_COLOR }}
      >
        <Sparkles className="h-3 w-3" />
        13 free image tools
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
        Free Online Image Tools —<br className="hidden sm:block" /> No Signup, No Download
      </h1>
      <p className="max-w-2xl text-base text-surface-600 sm:text-lg dark:text-surface-300">
        Thirteen professional image tools that live in your browser. Compress,
        resize, convert, edit and transform images instantly — without uploading
        a single file.
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
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          {group.description}
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = getIcon(tool.icon);
  const config = IMAGE_TOOLS_CONFIG[tool.id as ImageToolId];
  const features = KEY_FEATURES[tool.id as ImageToolId] ?? [];
  const isBrowser = config?.processingLocation === "browser";

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
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            isBrowser
              ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300"
              : "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
          )}
          title={isBrowser ? "Runs in your browser" : "Uses a server-side API"}
        >
          {isBrowser ? (
            <>
              <Lock className="h-3 w-3" /> Browser
            </>
          ) : (
            <>
              <Cloud className="h-3 w-3" /> API
            </>
          )}
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

function WhyUsSection() {
  const cards = [
    {
      icon: Lock,
      title: "Privacy-first",
      desc: "Most tools never upload your file. Image stays on your device, period.",
    },
    {
      icon: Cpu,
      title: "Fast processing",
      desc: "Runs on your CPU/GPU. No round-trip to a server, no queue, no waiting.",
    },
    {
      icon: Zap,
      title: "No signup",
      desc: "Open any tool and start working. No email, no account, no credit card.",
    },
    {
      icon: Sparkles,
      title: "Professional quality",
      desc: "Same algorithms paid tools use — Canvas API, WebAssembly, TensorFlow.js.",
    },
  ];
  return (
    <section className="mt-14 space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Why UtilityApps
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Why use UtilityApps image tools?
        </h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
          >
            <span
              aria-hidden="true"
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200"
            >
              <c.icon className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
              {c.title}
            </h3>
            <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonTable() {
  const rows: { feature: string; cells: (string | boolean)[] }[] = [
    { feature: "Price", cells: ["Free", "$9.99/mo", "$12.99/mo", "$20.99/mo"] },
    { feature: "No signup", cells: [true, false, false, false] },
    { feature: "Browser-based", cells: [true, true, true, false] },
    { feature: "File privacy", cells: [true, "Limited", "Limited", true] },
    { feature: "Batch process", cells: [true, false, false, true] },
    { feature: "No watermarks", cells: [true, false, "Pro plan only", true] },
  ];
  const headers = ["Feature", "UtilityApps", "Adobe Express", "Canva", "Photoshop"];
  return (
    <section className="mt-14 space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Comparison
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          UtilityApps vs paid image editors
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          Prices accurate as of {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}.
          We&apos;re not knocking these tools — they&apos;re excellent — but for everyday
          tasks, free + private + no-signup is hard to beat.
        </p>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "px-4 py-3 font-semibold",
                    i === 1 && "text-primary-700 dark:text-primary-300"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
            {rows.map((row) => (
              <tr key={row.feature}>
                <th
                  scope="row"
                  className="px-4 py-3 text-left text-xs font-semibold text-surface-700 dark:text-surface-200"
                >
                  {row.feature}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={cn(
                      "px-4 py-3 text-xs",
                      i === 0 && "font-semibold text-primary-700 dark:text-primary-300"
                    )}
                  >
                    <Cell value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-success-700 dark:text-success-300">
        <Check className="h-3.5 w-3.5" />
        Yes
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 text-surface-500 dark:text-surface-400">
        <X className="h-3.5 w-3.5" />
        No
      </span>
    );
  }
  return <span className="text-surface-700 dark:text-surface-200">{value}</span>;
}

function EducationalContent() {
  const guides = [
    {
      slug: "jpg-vs-png-vs-webp-which-format",
      title: "JPG vs PNG vs WEBP: Which Image Format Should You Use?",
      blurb:
        "Decision flowchart with file-size measurements, browser support, transparency rules, and the case for defaulting to WEBP.",
    },
    {
      slug: "best-free-image-compressor-tools-2026",
      title: "Best Free Image Compressor Tools in 2026",
      blurb:
        "Real-world quality and size comparisons across the leading free compressors — including which ones upload your files.",
    },
    {
      slug: "how-to-resize-image-for-social-media",
      title: "How to Resize Images for Social Media (Every Platform)",
      blurb:
        "Cheat-sheet of dimensions for Instagram, Twitter/X, LinkedIn, Facebook, TikTok and YouTube — square, story, post, and cover.",
    },
    {
      slug: "how-to-add-watermark-to-photos",
      title: "How to Add a Watermark to Your Photos (Without Photoshop)",
      blurb:
        "Text vs logo, placement that survives crops, opacity that doesn't ruin the photo — and bulk-watermarking 200 files at once.",
    },
    {
      slug: "what-is-image-upscaling-ai",
      title: "What Is AI Image Upscaling? (And When It Actually Works)",
      blurb:
        "How browser-side AI upscalers work, when 4× actually adds detail vs invents it, and which photos to never run through one.",
    },
    {
      slug: "how-to-remove-background-from-image-free",
      title: "How to Remove the Background From an Image (Free, 30 Seconds)",
      blurb:
        "Why one-click background removers work, edge-case failure modes, and how to fix hair, fur, and translucent edges by hand.",
    },
  ];

  return (
    <section className="mt-14">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Guides
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Learn more on the blog
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          In-depth guides on image formats, compression, social-media sizing and AI tools — all in the unified UtilityApps blog.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/blog/${g.slug}`}
            className="group rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
          >
            <h3 className="text-sm font-semibold text-surface-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {g.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
              {g.blurb}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
              Read guide
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
        >
          See all articles in the blog
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function RelatedCategories() {
  const others = [
    { id: "text-tools", name: "Text Tools", desc: "Word counter, case converter, slug generator, diff checker." },
    { id: "calculator-tools", name: "Calculator Tools", desc: "BMI, loan, percentage, age, GPA and more." },
    { id: "finance-tools", name: "Finance Tools", desc: "Mortgage, tax, salary, tip and currency calculators." },
    { id: "developer-tools", name: "Developer Tools", desc: "JSON formatter, base64, password and QR code generators." },
    { id: "seo-tools", name: "SEO Tools", desc: "Meta tag, Open Graph, schema and slug generators." },
    { id: "productivity-tools", name: "Productivity Tools", desc: "PDF converter, QR codes, document utilities." },
  ];
  return (
    <section className="mt-14 space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          More categories
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
          Explore other UtilityApps tools
        </h2>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((c) => (
          <Link
            key={c.id}
            href={`/tools/categories/${c.id}`}
            className="group rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-surface-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                {c.name}
              </p>
              <ArrowRight className="h-4 w-4 text-surface-400 transition group-hover:translate-x-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            </div>
            <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Structured data (BreadcrumbList + SoftwareApplication + ItemList)
// ──────────────────────────────────────────────────────────────────────────

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
        name: "Image Tools",
        item: `${base}/tools/image-tools`,
      },
    ],
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UtilityApps Image Tools",
    description: DESCRIPTION,
    url: `${base}/tools/image-tools`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (browser-based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free image tools",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}${tool.href}`,
      name: tool.name,
    })),
  };

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
          __html: JSON.stringify(software).replace(/</g, "\\u003c"),
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
