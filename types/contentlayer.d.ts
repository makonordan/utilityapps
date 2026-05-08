// Ambient declaration for `contentlayer/generated`. This file is produced at
// build time by `contentlayer build`, so during a fresh `tsc --noEmit` run
// (before contentlayer has populated `.contentlayer/generated`) the import
// resolves to nothing. Declaring it as `any[]` lets the type-check pass; the
// runtime callers in lib/posts.ts and lib/blog.ts already wrap the import in
// `.catch(() => null)` and validate the shape, so this loose typing is safe.

declare module "contentlayer/generated" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const allPosts: any[];
}
