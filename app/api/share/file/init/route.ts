import { NextRequest, NextResponse } from "next/server";

import {
  FILE_SHARES_PER_HOUR,
  getClientIp,
} from "../../_utils";

export const runtime = "nodejs";

interface Body {
  filename?: unknown;
  size?: unknown;
  mimetype?: unknown;
  customSlug?: unknown;
}

/**
 * POST /api/share/file/init
 *
 * First half of the two-phase upload. Validates the file metadata, picks
 * a slug, and returns a signed upload URL that lets the browser PUT the
 * file directly to Supabase Storage (so the Vercel function never sees
 * the bytes — keeps us within the 4.5 MB Hobby-tier body limit even for
 * 25 MB files).
 *
 * On success the response carries:
 *   - slug:    the chosen identifier
 *   - path:    the Storage object key (`<slug>/<filename>`)
 *   - token:   pass to supabase.storage.uploadToSignedUrl()
 *   - signedUrl: full URL if the client wants to upload via plain fetch
 */
export async function POST(request: NextRequest) {
  const shares = await import("@/lib/db/shares");
  const { validateFileMetadata } = await import("@/lib/file-validation");
  const { validateCustomSlug } = await import("@/lib/slug");

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const filename = typeof body.filename === "string" ? body.filename : "";
  const size = Number(body.size);
  const mimetype =
    typeof body.mimetype === "string" ? body.mimetype : "application/octet-stream";

  const meta = validateFileMetadata(filename, size, mimetype);
  if (!meta.ok) {
    return NextResponse.json({ error: meta.error }, { status: 400 });
  }

  // Custom slug — same rules as text/url
  let customSlug: string | null = null;
  if (typeof body.customSlug === "string" && body.customSlug.trim()) {
    const v = validateCustomSlug(body.customSlug);
    if (!v.valid) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }
    customSlug = v.normalised ?? null;
  }

  const ip = getClientIp(request);
  const ipHash = shares.hashCreatorIp(ip);

  if (await shares.isRateLimited(ipHash, FILE_SHARES_PER_HOUR)) {
    return NextResponse.json(
      {
        error: `Rate limit reached (${FILE_SHARES_PER_HOUR} file uploads per hour). Try again in an hour.`,
      },
      { status: 429 }
    );
  }

  const result = await shares.initFileShare({
    filename,
    contentType: mimetype,
    size,
    customSlug,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    slug: result.slug,
    path: result.path,
    token: result.token,
    signedUrl: result.signedUrl,
    customSlugWasUsed: result.customSlugWasUsed,
  });
}
