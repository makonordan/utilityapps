import "server-only";

import type { NextRequest } from "next/server";

/** Same x-forwarded-for / x-real-ip extraction pattern as /api/convert. */
export function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Hours allowed on share creation. Mirrors the radio buttons in the UI. */
export const ALLOWED_EXPIRY_HOURS = [1, 24, 168, 720] as const;
export type ExpiryHours = (typeof ALLOWED_EXPIRY_HOURS)[number];

export function isAllowedExpiry(n: number): n is ExpiryHours {
  return (ALLOWED_EXPIRY_HOURS as readonly number[]).includes(n);
}

/** Per-IP hourly create limits for Phase 1 (no Redis required). */
export const TEXT_SHARES_PER_HOUR = 20;
export const URL_SHARES_PER_HOUR = 20;
