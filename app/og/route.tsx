import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
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
        }}
      >
        <div
          style={{
            fontSize: "96px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          ADAKAN
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#0066ff",
            marginTop: "16px",
            letterSpacing: "6px",
            fontWeight: "500",
          }}
        >
          SOFTWARE
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "32px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Premium Web Design | Brand Identity | UI/UX
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #0066ff 40%, #2dd4bf 60%, transparent)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
