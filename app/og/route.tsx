import { ImageResponse } from "next/og"
import { type NextRequest } from "next/server"

export const runtime = "edge"

const pageData: Record<string, { subtitle: string; accent: string }> = {
  services: { subtitle: "Web Design | Brand Identity | UI/UX | Frontend", accent: "#0066ff" },
  projects: { subtitle: "Selected Work | Case Studies | Live Demos", accent: "#14b8a6" },
  contact: { subtitle: "Start a Project | Get a Quote | Say Hello", accent: "#0066ff" },
  logo: { subtitle: "Logo Design | Brand Mark | Identity Systems", accent: "#f59e0b" },
  about: { subtitle: "Design & Software Studio | Istanbul, Turkey", accent: "#2dd4bf" },
  default: { subtitle: "Premium Web Design | Brand Identity | UI/UX", accent: "#0066ff" },
}

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") ?? "default"
  const { subtitle, accent } = pageData[page] ?? pageData.default

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070a12",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse at 30% 40%, ${accent}18 0%, transparent 60%)`,
          }}
        />
        <div
          style={{
            fontSize: "96px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-4px",
            lineHeight: 1,
            position: "relative",
          }}
        >
          ADAKAN
        </div>
        <div
          style={{
            fontSize: "32px",
            color: accent,
            marginTop: "12px",
            letterSpacing: "8px",
            fontWeight: "600",
            position: "relative",
          }}
        >
          SOFTWARE
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.45)",
            marginTop: "28px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            position: "relative",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: `linear-gradient(90deg, transparent, ${accent} 40%, #2dd4bf 60%, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "40px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "2px",
          }}
        >
          adakansoftware.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
