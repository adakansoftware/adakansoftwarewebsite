import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          borderRadius: 36,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 110,
          color: "#0066ff",
          letterSpacing: "-4px",
        }}
      >
        A
      </div>
    ),
    { ...size },
  )
}
