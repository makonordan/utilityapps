import { NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const SuggestSchema = z.object({
  suggestedName: z.string().trim().min(1).max(200),
  suggestedUrl: z.string().trim().max(2048).optional().nullable(),
  reason: z.string().trim().max(2000).optional().nullable(),
  // Optional — a suggestion box, never a gate. Empty/omitted is valid;
  // when present it must look like an email.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .optional()
    .nullable()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Invalid email address" }),
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SuggestSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return Response.json({ success: false, error: issue?.message ?? "Invalid body" }, { status: 400 });
  }

  const { suggestedName, suggestedUrl, reason, email } = parsed.data;

  try {
    const queries = await import("@/lib/db/queries").catch(() => null);
    if (!queries) {
      return Response.json({ success: true, persisted: false });
    }
    const res = await queries.logAppSuggestion({
      suggestedName,
      suggestedUrl: suggestedUrl || null,
      reason: reason || null,
      email: email || null,
    });
    if (res.error) {
      return Response.json({ success: false, error: res.error }, { status: 500 });
    }
    return Response.json({ success: true, persisted: true });
  } catch (err) {
    console.error("[apps/suggest]", err);
    return Response.json({ success: false, error: "Failed to submit suggestion" }, { status: 500 });
  }
}
