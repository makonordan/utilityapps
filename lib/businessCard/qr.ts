import "server-only";

import QRCode from "qrcode";

import { SITE_CONFIG } from "@/lib/utils";

/**
 * QR code generation for business cards. Deliberately simple for v1:
 * we don't embed a center logo (that requires image composition +
 * degrades scan reliability if the payload is long), don't cache to
 * Supabase Storage (the qrcode lib is fast enough — ~30ms per QR on
 * a warm Vercel function), and offer just one size for the initial
 * ship. Everything above is Phase-2/3 material.
 *
 * Payload contains a `?src=qr` marker so the analytics endpoint can
 * tell a QR scan from a direct link visit.
 */

const QR_OPTIONS: QRCode.QRCodeToBufferOptions = {
  errorCorrectionLevel: "M",
  type: "png",
  margin: 2,
  width: 400,
  color: { dark: "#000000", light: "#00000000" }, // transparent background
};

const QR_HIRES_OPTIONS: QRCode.QRCodeToBufferOptions = {
  ...QR_OPTIONS,
  width: 1200,
};

export function cardUrl(username: string, slug: string): string {
  return `${SITE_CONFIG.url}/bc/${username}/${slug}?src=qr`;
}

export function masterUrl(username: string): string {
  return `${SITE_CONFIG.url}/bc/${username}?src=qr`;
}

export async function generateCardQrPng(
  username: string,
  slug: string,
  { hires = false }: { hires?: boolean } = {}
): Promise<Buffer> {
  return QRCode.toBuffer(cardUrl(username, slug), hires ? QR_HIRES_OPTIONS : QR_OPTIONS);
}

export async function generateMasterQrPng(
  username: string,
  { hires = false }: { hires?: boolean } = {}
): Promise<Buffer> {
  return QRCode.toBuffer(masterUrl(username), hires ? QR_HIRES_OPTIONS : QR_OPTIONS);
}
