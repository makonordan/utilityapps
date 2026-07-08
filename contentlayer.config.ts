import { defineDocumentType, makeSource } from "contentlayer2/source-files";

const READING_WORDS_PER_MINUTE = 220;

interface Heading {
  level: 2 | 3;
  text: string;
  slug: string;
}

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    author: { type: "string", required: true },
    readingTime: { type: "number", required: false },
    image: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => post._raw.flattenedPath.replace(/^blog\//, ""),
    },
    readingTimeMinutes: {
      type: "number",
      resolve: (post) => {
        if (typeof post.readingTime === "number" && post.readingTime > 0) {
          return post.readingTime;
        }
        const words = post.body.raw.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / READING_WORDS_PER_MINUTE));
      },
    },
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace(/^blog\//, "")}`,
    },
    headings: {
      type: "json",
      resolve: (post) => {
        const headings: Heading[] = [];
        const regex = /^(#{2,3})\s+(.+?)\s*$/gm;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(post.body.raw)) !== null) {
          const level = match[1].length as 2 | 3;
          const text = match[2].trim();
          headings.push({ level, text, slug: slugifyHeading(text) });
        }
        return headings;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  // The warning checks for a tsconfig path alias under the old "contentlayer/generated"
  // name. We only use "contentlayer2/generated" (already wired into tsconfig.json), so
  // suppress the noise.
  disableImportAliasWarning: true,
});
