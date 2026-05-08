import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Info,
  Lightbulb,
  Link2,
} from "lucide-react";

import { slugifyHeading } from "@/lib/headings";
import { cn } from "@/lib/utils";

function isExternal(href?: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("https://utilityapps.site") || href.startsWith("http://utilityapps.site")) {
    return false;
  }
  return /^https?:\/\//.test(href);
}

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const node = children as { props?: { children?: ReactNode } };
    return childrenToText(node.props?.children);
  }
  return "";
}

function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Anchor link"
      className="ml-2 inline-flex translate-y-[-2px] items-center text-surface-300 opacity-0 transition group-hover:opacity-100 dark:text-surface-600"
    >
      <Link2 className="h-4 w-4" />
    </a>
  );
}

function H2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  const id = rest.id ?? slugifyHeading(childrenToText(children));
  return (
    <h2
      id={id}
      className="group mt-12 scroll-mt-24 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white"
      {...rest}
    >
      {children}
      <HeadingAnchor id={id} />
    </h2>
  );
}

function H3({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
  const id = rest.id ?? slugifyHeading(childrenToText(children));
  return (
    <h3
      id={id}
      className="group mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-surface-900 dark:text-white"
      {...rest}
    >
      {children}
      <HeadingAnchor id={id} />
    </h3>
  );
}

function Anchor({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const external = isExternal(href);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-baseline gap-0.5 font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
        {...rest}
      >
        {children}
        <ExternalLink className="h-3 w-3 self-center" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link
      href={href ?? "#"}
      className="font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
    >
      {children}
    </Link>
  );
}

function Img({ src, alt = "", title, ...rest }: ComponentPropsWithoutRef<"img">) {
  if (!src) return null;
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl border border-surface-200 dark:border-surface-800"
        {...rest}
      />
      {title && (
        <figcaption className="mt-2 text-center text-xs text-surface-500 dark:text-surface-400">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

function Pre({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className="my-6 overflow-x-auto rounded-2xl border border-surface-200 bg-surface-950 p-4 font-mono text-[13px] leading-relaxed text-surface-100 dark:border-surface-800"
      {...rest}
    >
      {children}
    </pre>
  );
}

function Code({ className, children, ...rest }: ComponentPropsWithoutRef<"code">) {
  // Block code (inside <pre>) gets the parent's styling. Inline code gets its own pill.
  const isBlock = className?.includes("language-");
  if (isBlock) {
    return (
      <code className={cn(className, "block")} {...rest}>
        {children}
      </code>
    );
  }
  return (
    <code
      className="rounded-md bg-surface-100 px-1.5 py-0.5 font-mono text-[0.875em] text-accent-700 dark:bg-surface-800 dark:text-accent-300"
      {...rest}
    >
      {children}
    </code>
  );
}

function Blockquote({ children, ...rest }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="my-6 rounded-r-xl border-l-4 border-primary-500 bg-primary-50/60 px-5 py-4 text-base italic text-surface-700 dark:bg-primary-500/10 dark:text-surface-200"
      {...rest}
    >
      {children}
    </blockquote>
  );
}

function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full border-collapse text-left text-sm" {...rest}>
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...rest }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-surface-200 bg-surface-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300"
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({ children, ...rest }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-surface-100 px-4 py-3 align-top text-surface-700 last:border-b-0 dark:border-surface-800 dark:text-surface-200"
      {...rest}
    >
      {children}
    </td>
  );
}

function Ul({ children, ...rest }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className="my-5 list-disc space-y-2 pl-6 marker:text-surface-400" {...rest}>
      {children}
    </ul>
  );
}

function Ol({ children, ...rest }: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-surface-400" {...rest}>
      {children}
    </ol>
  );
}

function P({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p className="my-5 leading-relaxed text-surface-700 dark:text-surface-200" {...rest}>
      {children}
    </p>
  );
}

function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr className="my-10 border-surface-200 dark:border-surface-800" {...props} />;
}

type CalloutType = "tip" | "info" | "warning";

const CALLOUT_STYLES: Record<CalloutType, { wrap: string; icon: React.ComponentType<{ className?: string }> }> = {
  tip: {
    wrap: "border-success-300 bg-success-50/60 text-success-900 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-100",
    icon: Lightbulb,
  },
  info: {
    wrap: "border-primary-300 bg-primary-50/60 text-primary-900 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-100",
    icon: Info,
  },
  warning: {
    wrap: "border-warning-300 bg-warning-50/60 text-warning-900 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-100",
    icon: AlertTriangle,
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const { wrap, icon: Icon } = CALLOUT_STYLES[type];
  return (
    <aside
      role="note"
      className={cn("my-6 flex gap-3 rounded-2xl border px-4 py-3 text-sm", wrap)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="space-y-1.5">
        {title && <p className="font-semibold">{title}</p>}
        <div className="[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">{children}</div>
      </div>
    </aside>
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  a: Anchor,
  img: Img,
  pre: Pre,
  code: Code,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
  ul: Ul,
  ol: Ol,
  p: P,
  hr: Hr,
  Callout,
};
