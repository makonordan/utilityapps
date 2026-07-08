import { ImageResponse } from "next/og";

import { getCategoryByName } from "@/lib/categories";
import { TOOLS_BY_ID } from "@/lib/tools";

export const runtime = "edge";

const SIZE = { width: 800, height: 400 } as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = TOOLS_BY_ID[slug];

  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          UtilityApps
        </div>
      ),
      SIZE
    );
  }

  const category = getCategoryByName(tool.category);
  const accent = category?.color ?? "#0066FF";
  const initial = tool.name.trim().charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 56px",
          background: "linear-gradient(135deg, #020617 0%, #0a0f1f 50%, #0a0a0a 100%)",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "radial-gradient(circle, #7C3AED44 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top row: brand + category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)`,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              U
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>UtilityApps</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 600,
              color: accent,
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
            }}
          >
            {tool.category}
          </div>
        </div>

        {/* Center: large icon block + tool name */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginTop: 24,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: 28,
              background: `linear-gradient(135deg, ${accent} 0%, #7C3AED 100%)`,
              boxShadow: `0 20px 60px ${accent}66`,
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: -1.2,
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              {tool.name}
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#cbd5e1",
                lineHeight: 1.35,
                maxWidth: 520,
              }}
            >
              {truncate(tool.description, 110)}
            </div>
          </div>
        </div>

        {/* Bottom row: domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            color: "#94a3b8",
            fontSize: 16,
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

function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length - 1).trimEnd() + "…";
}
