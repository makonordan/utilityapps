import { NextRequest } from "next/server";

import { TOOLS_BY_ID } from "@/lib/tools";

export const runtime = "nodejs";

const ALLOWED_DEVICES = new Set(["mobile", "desktop", "tablet", "unknown"]);

interface TrackBody {
  toolId?: unknown;
  country?: unknown;
  device?: unknown;
  session?: unknown;
}

export async function POST(request: NextRequest) {
  let body: TrackBody;
  try {
    body = (await request.json()) as TrackBody;
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.toolId !== "string" || !body.toolId.trim()) {
    return Response.json({ success: false, error: "toolId is required" }, { status: 400 });
  }
  const toolId = body.toolId.trim();
  if (!TOOLS_BY_ID[toolId]) {
    return Response.json({ success: false, error: "Unknown toolId" }, { status: 404 });
  }

  const country =
    typeof body.country === "string" && body.country.length <= 8 ? body.country : null;

  let device: string | null = null;
  if (typeof body.device === "string") {
    const candidate = body.device.toLowerCase();
    if (ALLOWED_DEVICES.has(candidate)) device = candidate;
  }

  const session =
    typeof body.session === "string" && body.session.length <= 64 ? body.session : null;

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) {
      // Supabase not configured — return success so the client doesn't retry.
      return Response.json({ success: true, persisted: false });
    }
    const res = await queries.trackToolUsage(toolId, country, device, session);
    if (res.error) {
      return Response.json({ success: false, error: res.error }, { status: 500 });
    }
    return Response.json({ success: true, persisted: true });
  } catch (err) {
    console.error("[tools/track]", err);
    return Response.json({ success: false, error: "Failed to track" }, { status: 500 });
  }
}
