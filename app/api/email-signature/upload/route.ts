import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Anonymous image upload for the Email Signature Generator.
 *
 * Public (no auth). The tool is positioned as "no signup" and gating
 * uploads behind the Business Card sign-in flow gave anonymous visitors
 * a broken dead-end ("sign in with Google top right" — but there's no
 * button in the header for this tool).
 *
 * Abuse envelope:
 *   - 2 MB hard cap here, plus the bc-avatars bucket has its own 2 MB
 *     file_size_limit (schema.sql section 17) so a bypassed client
 *     can't inflate storage.
 *   - MIME allowlist: image/jpeg, image/png, image/webp. Same list is
 *     enforced by the bucket's allowed_mime_types, so a spoofed
 *     content-type header still gets rejected at the storage layer.
 *   - Randomised path so anonymous uploads don't collide and can't be
 *     guessed by iterating a sequential counter.
 *   - No rate limiting yet — Supabase Storage bandwidth/egress caps
 *     act as a soft ceiling for now. Add IP-based rate limiting if
 *     the tool takes off.
 */

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "storage-unavailable" },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid form data" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const kindRaw = form.get("kind");

  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "file missing" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `File must be ≤ ${MAX_BYTES / 1024 / 1024} MB` },
      { status: 413 }
    );
  }
  const ext = ACCEPTED_MIME[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, or WEBP images" },
      { status: 415 }
    );
  }

  const kind =
    typeof kindRaw === "string" && (kindRaw === "logo" || kindRaw === "avatar")
      ? kindRaw
      : "avatar";
  // Randomised path so anonymous uploads can't collide and aren't
  // guessable by iterating a sequential counter.
  const random = Math.random().toString(36).slice(2, 10);
  const path = `email-signature/${kind}-${Date.now()}-${random}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage.from("bc-avatars").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    // Supabase Storage returns "Bucket not found" when infra hasn't been
    // provisioned. Rewrite that into an actionable end-user message
    // rather than leaking the raw string.
    if (/bucket not found/i.test(error.message)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Image uploads aren't set up yet — please paste an image URL below instead.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data: pub } = admin.storage.from("bc-avatars").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: pub.publicUrl, path });
}
