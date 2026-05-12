"use client";

import { useState } from "react";

import { CopyButton, Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function escAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface Meta {
  title: string;
  description: string;
  url: string;
  image: string;
  twitterHandle: string;
  type: "website" | "article";
}

function buildHtml(m: Meta): string {
  const lines: string[] = [];
  lines.push(`<title>${escAttr(m.title)}</title>`);
  lines.push(`<meta name="description" content="${escAttr(m.description)}" />`);
  lines.push(`<link rel="canonical" href="${escAttr(m.url)}" />`);
  lines.push("");
  lines.push("<!-- Open Graph -->");
  lines.push(`<meta property="og:title" content="${escAttr(m.title)}" />`);
  lines.push(`<meta property="og:description" content="${escAttr(m.description)}" />`);
  lines.push(`<meta property="og:url" content="${escAttr(m.url)}" />`);
  lines.push(`<meta property="og:type" content="${m.type}" />`);
  if (m.image) {
    lines.push(`<meta property="og:image" content="${escAttr(m.image)}" />`);
    lines.push(`<meta property="og:image:width" content="1200" />`);
    lines.push(`<meta property="og:image:height" content="630" />`);
  }
  lines.push("");
  lines.push("<!-- Twitter / X -->");
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${escAttr(m.title)}" />`);
  lines.push(`<meta name="twitter:description" content="${escAttr(m.description)}" />`);
  if (m.image) lines.push(`<meta name="twitter:image" content="${escAttr(m.image)}" />`);
  if (m.twitterHandle) {
    const h = m.twitterHandle.startsWith("@") ? m.twitterHandle : `@${m.twitterHandle}`;
    lines.push(`<meta name="twitter:site" content="${escAttr(h)}" />`);
    lines.push(`<meta name="twitter:creator" content="${escAttr(h)}" />`);
  }
  return lines.join("\n");
}

export function MetaTagGenerator() {
  const [m, setM] = useState<Meta>({
    title: "Free Online Image Compressor — UtilityApps",
    description: "Compress JPG, PNG, SVG, GIF up to 90% smaller with no quality loss. Free, no signup, runs in your browser.",
    url: "https://utilityapps.site/tools/compress-image",
    image: "https://utilityapps.site/og.png",
    twitterHandle: "@utilityapps",
    type: "website",
  });

  const html = buildHtml(m);

  function reset() {
    setM({
      title: "",
      description: "",
      url: "",
      image: "",
      twitterHandle: "",
      type: "website",
    });
  }

  return (
    <ToolShell
      eyebrow="SEO"
      title="Meta Tag Generator"
      description="Generate <title>, meta description, Open Graph, and Twitter Card tags in one go."
      onReset={reset}
    >
      <div className="grid gap-4">
        <Field label="Page title">
          <input
            type="text"
            value={m.title}
            onChange={(e) => setM({ ...m, title: e.target.value })}
            className={INPUT_CLASS}
            maxLength={70}
          />
        </Field>
        <Field label={`Meta description (${m.description.length}/160)`}>
          <input
            type="text"
            value={m.description}
            onChange={(e) => setM({ ...m, description: e.target.value })}
            className={INPUT_CLASS}
            maxLength={170}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Canonical URL">
            <input
              type="url"
              value={m.url}
              onChange={(e) => setM({ ...m, url: e.target.value })}
              className={INPUT_CLASS}
              placeholder="https://example.com/page"
            />
          </Field>
          <Field label="Image URL (1200×630)">
            <input
              type="url"
              value={m.image}
              onChange={(e) => setM({ ...m, image: e.target.value })}
              className={INPUT_CLASS}
              placeholder="https://example.com/og.png"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Twitter / X handle">
            <input
              type="text"
              value={m.twitterHandle}
              onChange={(e) => setM({ ...m, twitterHandle: e.target.value })}
              className={INPUT_CLASS}
              placeholder="@yourhandle"
            />
          </Field>
          <Field label="OG type">
            <select
              value={m.type}
              onChange={(e) => setM({ ...m, type: e.target.value as Meta["type"] })}
              className={INPUT_CLASS}
            >
              <option value="website">website</option>
              <option value="article">article</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            HTML — paste into &lt;head&gt;
          </p>
          <CopyButton value={html} />
        </div>
        <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-white p-3 font-mono text-xs text-surface-800 dark:bg-surface-900 dark:text-surface-100">
          {html}
        </pre>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
          Google search preview
        </p>
        <div className="rounded-xl border border-surface-200 bg-white p-4 font-sans dark:border-surface-700 dark:bg-surface-800/40">
          <p className="text-sm text-success-700 dark:text-success-400">{m.url || "https://example.com"}</p>
          <p className="mt-1 text-lg text-primary-700 dark:text-primary-300 hover:underline">
            {m.title || "Page title"}
          </p>
          <p className="mt-1 text-sm text-surface-700 dark:text-surface-300">
            {m.description || "Meta description preview…"}
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
