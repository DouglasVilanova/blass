import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blass — Iluminação & Componentes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4F2612",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
        }}
      >
        {/* Orange accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#F0781A" }} />

        <div style={{ fontSize: 96, letterSpacing: "0.25em", color: "#FFFADD", fontWeight: 700 }}>
          BLASS
        </div>
        <div style={{ fontSize: 18, letterSpacing: "0.5em", color: "#F0781A", marginTop: 12, textTransform: "uppercase" }}>
          ILUMINAÇÃO • COMPONENTES
        </div>
        <div style={{ fontSize: 22, color: "#FFFADD", opacity: 0.6, marginTop: 32, maxWidth: 700, textAlign: "center" }}>
          26 anos de mercado · 2.000+ revendas · Flores da Cunha — RS
        </div>

        {/* Bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#F0781A" }} />
      </div>
    ),
    { ...size }
  );
}
