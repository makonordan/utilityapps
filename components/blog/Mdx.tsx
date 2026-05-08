"use client";

import { useMDXComponent } from "next-contentlayer/hooks";

import { mdxComponents } from "./MDXComponents";

export function Mdx({ code }: { code: string }) {
  // useMDXComponent is contentlayer's officially documented hook and
  // memoizes the returned component for the given code string.
  const Component = useMDXComponent(code);
  return (
    <div className="mdx-content">
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Component components={mdxComponents} />
    </div>
  );
}
