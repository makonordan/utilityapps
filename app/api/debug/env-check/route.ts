import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Temporary diagnostic for the CONVERTAPI_SECRET visibility issue.
 *
 * Returns a short report on what the running Node.js function actually sees
 * for the env var — without ever exposing the value itself. The
 * first/last char + length are enough to tell apart these failure modes:
 *
 *   - `present: false`           → Vercel isn't passing the var at all
 *                                   (wrong project, wrong env, name typo)
 *   - `length: 0`                → present but empty (paste error)
 *   - `length: 12-14`            → user pasted the masked preview
 *                                   like "...D9aKTynn"
 *   - `length: 30+` with `firstChar`/`lastChar` being whitespace
 *                                → trailing/leading whitespace from paste
 *   - `length: 30+` clean        → value IS there; failure is upstream
 *                                   (auth rejection, but the wrong error
 *                                    code is reaching the user)
 *
 * Safe to leave in production briefly but should be removed once the
 * CONVERTAPI_SECRET issue is resolved.
 */
export async function GET() {
  const v = process.env.CONVERTAPI_SECRET;

  if (typeof v !== "string") {
    return NextResponse.json(
      {
        envVar: "CONVERTAPI_SECRET",
        present: false,
        hint: "Vercel isn't passing this env var to the function. Check the variable name spelling AND that the Production checkbox was ticked.",
        runtime: process.env.VERCEL_ENV ?? "unknown",
        nextRuntime: "nodejs",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      envVar: "CONVERTAPI_SECRET",
      present: true,
      length: v.length,
      firstChar: JSON.stringify(v.charAt(0)),
      lastChar: JSON.stringify(v.charAt(v.length - 1)),
      hasLeadingWhitespace: /^\s/.test(v),
      hasTrailingWhitespace: /\s$/.test(v),
      runtime: process.env.VERCEL_ENV ?? "unknown",
      nextRuntime: "nodejs",
    },
    { status: 200 }
  );
}
