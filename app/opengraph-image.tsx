import { ImageResponse } from "next/og";

/* ─────────────────────────────────────────────
   OpenGraph image generada dinámicamente
   Aparece como preview cuando alguien comparte la URL de PLANIT
   en WhatsApp, Twitter, Instagram, LinkedIn, etc.

   Esta imagen se genera al hacer build y se sirve como PNG
   en /opengraph-image (Next.js la detecta automáticamente).
───────────────────────────────────────────── */

export const alt = "PLANIT — Marketplace de servicios para eventos en Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F59E4D 0%, #E8731A 45%, #C25E10 100%)",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Decoración: círculos sutiles de fondo */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.06)",
          }}
        />

        {/* Badge superior */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.18)",
            border: "2px solid rgba(255, 255, 255, 0.35)",
            fontSize: 22,
            color: "white",
            fontWeight: 700,
            letterSpacing: "0.18em",
            marginBottom: 40,
          }}
        >
          MARKETPLACE DE EVENTOS · ARGENTINA
        </div>

        {/* Logo PLANIT */}
        <div
          style={{
            fontSize: 210,
            fontWeight: 900,
            color: "white",
            letterSpacing: "0.12em",
            lineHeight: 1,
            textShadow: "0 6px 32px rgba(0, 0, 0, 0.18)",
          }}
        >
          PLANIT
        </div>

        {/* Subtítulo principal */}
        <div
          style={{
            display: "flex",
            fontSize: 46,
            color: "rgba(255, 255, 255, 0.98)",
            marginTop: 32,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Tu evento, en un solo lugar
        </div>

        {/* Footer con servicios */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          DJs · Fotógrafos · Catering · Lugares · Bandas · Organizadores
        </div>
      </div>
    ),
    { ...size },
  );
}
