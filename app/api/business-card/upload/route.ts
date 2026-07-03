import { NextRequest, NextResponse } from "next/server";

import { getBcUser } from "@/lib/businessCard/auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Uploads a card avatar or company logo to the `bc-avatars` storage bucket.
 *
 * Auth: authenticated bc_users only.
 * Path: bc-avatars/<bc_user_id>/<kind>-<timestamp>.<ext>
 *
 * The client is expected to have already compressed / resized the image
 * (see AvatarUpload.tsx — targets ~200 KB via a Canvas draw). We still
 * enforce a 2 MB hard cap here so a bypassed client can't inflate storage.
 *
 * Returns the public URL of the uploaded object. The caller then PATCHes
 * their card row with that URL as `avatar_url` (or `logo_url`).
 */

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const user = await getBcUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "storage-unavailable" }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid form data" }, { status: 400 });
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
    return NextResponse.json({ ok: false, error: "Only JPG, PNG, or WEBP images" }, { status: 415 });
  }

  const kind = typeof kindRaw === "string" && (kindRaw === "logo" || kindRaw === "avatar") ? kindRaw : "avatar";
  const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage.from("bc-avatars").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    // Supabase Storage returns "Bucket not found" (404-ish) when the
    // `bc-avatars` bucket hasn't been created yet. Rewrite that into an
    // actionable message rather than leaking the raw string to end users.
    if (/bucket not found/i.test(error.message)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Image uploads aren't set up yet on this server. Please try again in a bit — we're finalising storage configuration.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data: pub } = admin.storage.from("bc-avatars").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: pub.publicUrl, path });
}
