import { NextRequest } from "next/server";

import { TOOLS_BY_ID } from "@/lib/tools";

export const runtime = "nodejs";

interface CompleteBody {
  toolId?: unknown;
  session?: unknown;
}

/**
 * POST /api/tools/complete
 *
 * Sibling of /api/tools/track. Called by a tool when it successfully
 * delivers its primary output — file downloaded, link created, snippet
 * shared, etc. We keep the schema dumb (just tool_id + session) so the
 * admin can compute completion rate = completions ÷ visits per tool.
 *
 * Like the visits tracker, this is best-effort: a failed write logs
 * but does not bubble back as an error to the user.
 */
export async function POST(request: NextRequest) {
  let body: CompleteBody;
  try {
    body = (await request.json()) as CompleteBody;
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
  const session =
    typeof body.session === "string" && body.session.length <= 64 ? body.session : null;

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) {
      return Response.json({ success: true, persisted: false });
    }
    const res = await queries.trackToolCompletion(toolId, session);
    if (res.error) {
      return Response.json({ success: false, error: res.error }, { status: 500 });
    }
    return Response.json({ success: true, persisted: true });
  } catch (err) {
    const { reportError } = await import("@/lib/error-reporting");
    reportError(err, { tag: "api/tools/complete", extra: { toolId } });
    return Response.json(
      { success: false, error: "Could not record completion" },
      { status: 500 }
    );
  }
}
