import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 } as const;

const TYPE_STYLES: Record<string, { label: string; accent: string }> = {
  tool: { label: "Tool", accent: "#0066FF" },
  post: { label: "Article", accent: "#7C3AED" },
  product: { label: "Product", accent: "#F59E0B" },
  category: { label: "Category", accent: "#10B981" },
  default: { label: "UtilityApps", accent: "#0066FF" },
};

const MAX_TITLE = 90;
const MAX_DESCRIPTION = 160;

function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return input.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const title = truncate(
    sp.get("title")?.trim() || "UtilityApps — Free AI Utility Tools",
    MAX_TITLE
  );
  const description = truncate(
    sp.get("description")?.trim() || "200+ free tools for everyday work. No signup required.",
    MAX_DESCRIPTION
  );
  const type = (sp.get("type") || "default").toLowerCase();
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #020617 0%, #0a0f1f 40%, #0a0a0a 100%)",
          color: "#ffffff",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Decorative glows */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -200,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${style.accent}55 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -160,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "radial-gradient(circle, #7C3AED44 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top row: brand + type pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              U
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>UtilityApps</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: 9999,
              fontSize: 18,
              fontWeight: 600,
              color: style.accent,
              background: `${style.accent}22`,
              border: `1px solid ${style.accent}55`,
            }}
          >
            {style.label}
          </div>
        </div>

        {/* Center: title + description */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 1,
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -1.6,
              lineHeight: 1.05,
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              lineHeight: 1.4,
              color: "#cbd5e1",
              maxWidth: 920,
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            color: "#94a3b8",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex" }}>utilityapps.site</div>
          <div style={{ display: "flex" }}>Free · No signup · Instant</div>
        </div>
      </div>
    ),
    SIZE
  );
}
