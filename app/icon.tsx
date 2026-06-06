import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          borderRadius: 8,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 20,
          color: "#0066ff",
          letterSpacing: "-1px",
        }}
      >
        A
      </div>
    ),
    { ...size },
  )
}
