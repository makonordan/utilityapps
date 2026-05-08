import { NextRequest, NextResponse } from "next/server";

// In Next 16, the `middleware.ts` file convention was renamed to `proxy.ts`
// (and the function from `middleware` to `proxy`). Behavior is identical.
// Backward-compat docs: https://nextjs.org/docs/app/api-reference/file-conventions/proxy

export const ADMIN_COOKIE = "ua_admin";
const LOGIN_PATH = "/admin/login";
const AUTH_API = "/api/admin/auth";

/** Constant-time string compare so the cookie check doesn't leak via timing. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and auth API through without checking the cookie.
  if (pathname.startsWith(LOGIN_PATH) || pathname.startsWith(AUTH_API)) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // No password configured — fail closed: redirect to login with an error
    // so the operator notices their env var is missing rather than the
    // dashboard being publicly accessible.
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("error", "not-configured");
    return NextResponse.redirect(url);
  }

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (!cookie || !constantTimeEqual(cookie, expected)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
