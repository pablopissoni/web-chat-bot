import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CallBot — Asistente virtual de CallBotIA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 60%, #262626 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: 28,
            opacity: 0.7,
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#34d399",
              display: "block",
            }}
          />
          <span>CallBotIA</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "24px",
          }}
        >
          CallBot
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            lineHeight: 1.3,
            opacity: 0.8,
            maxWidth: 900,
          }}
        >
          Asistente virtual con IA agéntica: streaming, tool calling y
          derivación a humano.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 22,
            opacity: 0.5,
            gap: 24,
          }}
        >
          <span>Next.js 16</span>
          <span>·</span>
          <span>OpenAI GPT-4o-mini</span>
          <span>·</span>
          <span>Firestore</span>
          <span>·</span>
          <span>Vercel</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
