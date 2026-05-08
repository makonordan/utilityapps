// Heading-slug helper, shared between the contentlayer config (server-side
// build), the MDX components (client-side render), and the TOC renderer.
// Lives outside lib/blog.ts so it can be imported from client components
// without dragging in the `server-only` directive there.

export interface Heading {
  level: 2 | 3;
  text: string;
  slug: string;
}

export function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
