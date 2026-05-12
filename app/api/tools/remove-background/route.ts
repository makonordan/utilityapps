import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Background-removal proxy → remove.bg
 *
 * Setup
 * -----
 * 1. Sign up at https://www.remove.bg/users/sign_up (50 free removals/month).
 * 2. Grab your API key from https://www.remove.bg/dashboard.
 * 3. Add it to .env.local (NEVER commit this file):
 *
 *      REMOVE_BG_API_KEY=tbd4e6NnNcRUaFoC5TffXygv
 *
 * Security note
 * -------------
 * If this key has ever been pasted into a chat window, an issue tracker, a
 * git commit, or any other place outside .env.local — rotate it from the
 * remove.bg dashboard before going to production. Anything shared once is
 * effectively public.
 *
 * Why this route exists
 * ---------------------
 * The remove.bg API key must NEVER ship to the browser. This server route
 * accepts a multipart upload from the Remove Background tool, forwards it
 * to remove.bg with the API key, and streams the PNG response back to the
 * client. The client only ever sees this same-origin endpoint.
 */

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB matches the tool config limit.
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  if (!process.env.REMOVE_BG_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Background removal isn't configured on this server. Add REMOVE_BG_API_KEY to .env.local — see app/api/tools/remove-background/route.ts for instructions.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const blob = file as File;

  if (!ACCEPTED.has(blob.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG and WEBP files are accepted." },
      { status: 415 }
    );
  }

  if (blob.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 25 MB." },
      { status: 413 }
    );
  }

  try {
    const upstreamForm = new FormData();
    upstreamForm.append("image_file", blob, blob.name);
    upstreamForm.append("size", "auto");

    const upstream = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        // Do NOT set Content-Type — fetch fills in the multipart boundary.
      },
      body: upstreamForm,
    });

    if (upstream.ok) {
      const png = await upstream.arrayBuffer();
      return new NextResponse(png, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": String(png.byteLength),
          "Cache-Control": "no-store",
        },
      });
    }

    // ── Specific upstream errors → user-friendly messages ──
    if (upstream.status === 402) {
      return NextResponse.json(
        {
          error:
            "The shared API key has run out of credits for this month. The site owner needs to top up at remove.bg, or upgrade for unlimited removals.",
        },
        { status: 402 }
      );
    }
    if (upstream.status === 413) {
      return NextResponse.json(
        { error: "Image is too large for the remove.bg API." },
        { status: 413 }
      );
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.json(
        { error: "Background-removal credentials are invalid. Contact the site owner." },
        { status: 502 }
      );
    }

    // Generic fallback — try to surface the upstream message if it's JSON.
    let detail = "";
    const ct = upstream.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      try {
        const body = (await upstream.json()) as {
          errors?: { title?: string }[];
        };
        detail = body.errors?.[0]?.title ?? "";
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json(
      {
        error:
          detail ||
          `Background removal failed (status ${upstream.status}). Please try again.`,
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("[api/remove-background]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Background removal failed. Please try again." },
      { status: 500 }
    );
  }
}
