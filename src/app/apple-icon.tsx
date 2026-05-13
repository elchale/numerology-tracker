import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #1e1738 0%, #0b0a14 80%)",
          color: "#f5c64f",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-0.03em",
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
