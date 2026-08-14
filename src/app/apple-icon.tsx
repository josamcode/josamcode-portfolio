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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1117",
          backgroundImage:
            "radial-gradient(140px circle at 30% 10%, rgba(34,197,94,0.32), transparent 60%)",
          color: "#E6EDF3",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <div style={{ display: "flex" }}>
          J<span style={{ color: "#22C55E" }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
