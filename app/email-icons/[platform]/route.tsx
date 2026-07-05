import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * On-demand icon PNGs for the Email Signature Generator's social row.
 *
 * The signature HTML references icons at
 *   https://utilityapps.site/email-icons/<platform>.png
 * (see SOCIAL_ICON_BASE in lib/generateSignatureHtml.ts). Rather than
 * committing 8 PNG assets to public/, this dynamic route renders each
 * icon on demand using next/og's ImageResponse (edge runtime, satori
 * under the hood) and caches the result at the CDN forever
 * (immutable + max-age=1y). First hit generates and stores; every
 * subsequent request is a static CDN response.
 *
 * Design: 48×48 rounded square in the platform's brand colour, with a
 * white monogram centred inside. Not a pixel-perfect trademark render
 * (satori doesn't handle Instagram's radial gradient or YouTube's
 * play-triangle SVG cleanly, and licensing individual brand marks for
 * a generator adds friction). Monograms are honest, universally
 * recognisable, and render identically in every email client — which
 * is the whole point of the tool.
 *
 * Requests for `.svg` or bare platform names also work; the file
 * extension is stripped before lookup.
 */

export const runtime = "edge";
// Cache the rendered response at the CDN forever — icons never change.
export const revalidate = false;

interface IconStyle {
  bg: string;
  fg: string;
  label: string;
}

const ICONS: Record<string, IconStyle> = {
  linkedin: { bg: "#0A66C2", fg: "#FFFFFF", label: "in" },
  twitter: { bg: "#000000", fg: "#FFFFFF", label: "X" },
  instagram: { bg: "#E4405F", fg: "#FFFFFF", label: "IG" },
  facebook: { bg: "#1877F2", fg: "#FFFFFF", label: "f" },
  youtube: { bg: "#FF0000", fg: "#FFFFFF", label: "▶" },
  github: { bg: "#181717", fg: "#FFFFFF", label: "GH" },
  whatsapp: { bg: "#25D366", fg: "#FFFFFF", label: "W" },
  calendly: { bg: "#006BFF", fg: "#FFFFFF", label: "C" },
  website: { bg: "#6B7280", fg: "#FFFFFF", label: "@" },
};

/** Fallback used when a request comes in for an unknown platform slug —
 *  still returns a valid PNG so the <img> doesn't render as broken. */
const UNKNOWN: IconStyle = { bg: "#9CA3AF", fg: "#FFFFFF", label: "?" };

const SIZE = 48;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;
  // Strip .png / .svg / .webp / etc. so the caller's URL choice
  // doesn't drive lookup semantics.
  const slug = platform.replace(/\.(png|svg|jpg|jpeg|webp)$/i, "").toLowerCase();
  const style = ICONS[slug] ?? UNKNOWN;

  // Monogram font sizes vary a bit so short labels fill the square and
  // longer ones stay legible.
  const fontSize = style.label.length === 1 ? 28 : style.label.length === 2 ? 20 : 18;

  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: style.bg,
          borderRadius: 8,
          color: style.fg,
          fontFamily: "sans-serif",
          fontSize,
          fontWeight: 700,
          letterSpacing: -0.5,
          lineHeight: 1,
        }}
      >
        {style.label}
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        // Immutable icons — one-year CDN cache. Change the label/colour
        // in this file and force a URL bump via a query string when
        // rolling out a new design.
        "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
        // Explicit type so Outlook trusts the response as an image
        // regardless of the URL extension.
        "content-type": "image/png",
      },
    }
  );
}
