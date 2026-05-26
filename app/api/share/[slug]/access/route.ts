import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface Body {
  password?: unknown;
}

/**
 * POST /api/share/[slug]/access — return the actual content.
 *
 * Verifies password if the share has one, then increments the view count
 * and returns the content. If the view limit is hit *after* this view,
 * the row is deleted so future requests get the 404 response.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const shares = await import("@/lib/db/shares");

  const row = await shares.findBySlug(slug);
  if (!row) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }
  if (shares.isExpired(row)) {
    return NextResponse.json({ error: "This share has expired." }, { status: 404 });
  }
  if (shares.isViewLimitReached(row)) {
    return NextResponse.json(
      { error: "This share has reached its view limit." },
      { status: 404 }
    );
  }
  if (row.reported) {
    return NextResponse.json(
      { error: "This share has been removed." },
      { status: 404 }
    );
  }

  // Password gate
  if (row.password_hash) {
    let body: Body = {};
    try {
      body = (await request.json()) as Body;
    } catch {
      // Empty body is fine — it just means "no password supplied".
    }
    const supplied = typeof body.password === "string" ? body.password : "";
    if (!supplied) {
      return NextResponse.json(
        { error: "Password required.", passwordRequired: true },
        { status: 401 }
      );
    }
    if (!shares.verifyPassword(supplied, row.password_hash)) {
      return NextResponse.json(
        { error: "Wrong password.", passwordRequired: true },
        { status: 401 }
      );
    }
  }

  // Counted view — incrementViewCount() returns the post-update row.
  const updated = await shares.incrementViewCount(slug);
  const finalRow = updated ?? row;

  // If this view hit the limit, delete so further requests 404.
  if (
    finalRow.view_limit !== null &&
    finalRow.view_count >= finalRow.view_limit
  ) {
    await shares.deleteBySlug(slug);
  }

  // Build the payload by type
  if (finalRow.type === "text") {
    return NextResponse.json({
      type: "text",
      content: finalRow.text_content ?? "",
      language: finalRow.text_language,
      viewCount: finalRow.view_count,
      viewLimit: finalRow.view_limit,
    });
  }

  if (finalRow.type === "url") {
    return NextResponse.json({
      type: "url",
      url: finalRow.original_url ?? "",
      viewCount: finalRow.view_count,
      viewLimit: finalRow.view_limit,
    });
  }

  if (finalRow.type === "file") {
    if (!finalRow.file_path || !finalRow.file_name) {
      return NextResponse.json(
        { error: "Share is missing file metadata." },
        { status: 500 }
      );
    }
    // Two signed URLs:
    //   downloadUrl — has Content-Disposition: attachment so a click
    //                 downloads with the original filename
    //   inlineUrl   — same file, no download hint, so img/iframe render it
    const downloadUrl = await shares.createDownloadUrl(
      finalRow.file_path,
      finalRow.file_name
    );
    const inlineUrl = await shares.createInlineUrl(finalRow.file_path);
    if (!downloadUrl || !inlineUrl) {
      return NextResponse.json(
        { error: "Couldn't generate a download link. Try again." },
        { status: 500 }
      );
    }
    return NextResponse.json({
      type: "file",
      filename: finalRow.file_name,
      size: finalRow.file_size,
      mimetype: finalRow.file_mimetype,
      downloadUrl,
      inlineUrl,
      viewCount: finalRow.view_count,
      viewLimit: finalRow.view_limit,
    });
  }

  return NextResponse.json(
    { error: "Unknown share type." },
    { status: 500 }
  );
}
