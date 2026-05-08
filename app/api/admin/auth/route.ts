import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE_NAME = "ua_admin";
const TWELVE_HOURS_SECS = 60 * 60 * 12;

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Login: accepts password from form-data or JSON, sets cookie, redirects. */
export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return redirectToLogin(request, "not-configured");
  }

  let password = "";
  let fromForm = false;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    fromForm = true;
    const form = await request.formData();
    password = String(form.get("password") ?? "").trim();
  } else {
    try {
      const body = (await request.json()) as { password?: unknown };
      password = typeof body.password === "string" ? body.password.trim() : "";
    } catch {
      // ignore
    }
  }

  if (!password || !constantTimeEqual(password, expected)) {
    return fromForm
      ? redirectToLogin(request, "invalid")
      : NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  const fromParam = url.searchParams.get("from");
  url.searchParams.delete("from");
  url.searchParams.delete("error");
  url.pathname = fromParam && fromParam.startsWith("/admin") ? fromParam : "/admin";

  const response = fromForm
    ? NextResponse.redirect(url, { status: 303 })
    : NextResponse.json({ success: true, redirect: url.pathname });

  response.cookies.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TWELVE_HOURS_SECS,
  });

  return response;
}

/** Logout: clear the cookie and redirect to the login page. */
export async function DELETE(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.delete("from");
  url.searchParams.delete("error");

  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

function redirectToLogin(request: NextRequest, error: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, { status: 303 });
}
