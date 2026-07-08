import { NextRequest } from "next/server";

import { generateMasterQrPng } from "@/lib/businessCard/qr";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type Params = { params: Promise<{ username: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { username } = await params;
  const url = new URL(request.url);
  const hires = url.searchParams.get("hires") === "1";
  const download = url.searchParams.get("download") === "1";

  const admin = getSupabaseAdmin();
  if (!admin) return new Response("Service unavailable", { status: 503 });

  const { data: user } = await admin
    .from("bc_users")
    .select("id, username, name")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (!user) return new Response("Not found", { status: 404 });

  const png = await generateMasterQrPng((user as { username: string }).username, { hires });

  const headers: Record<string, string> = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  };
  if (download) {
    const filename = `${username}-master-qr${hires ? "-hires" : ""}.png`;
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }
  return new Response(new Uint8Array(png), { headers });
}
