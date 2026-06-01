import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-chat-bot-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CallBot — Asistente virtual de CallBotIA",
  description:
    "Chat con IA agéntica: respuestas en streaming, tool calling, captación de leads y derivación a humano.",
  keywords: [
    "CallBotIA",
    "chatbot IA",
    "asistente virtual",
    "OpenAI",
    "Next.js",
    "agente conversacional",
  ],
  authors: [{ name: "CallBotIA" }],
  openGraph: {
    title: "CallBot — Asistente virtual de CallBotIA",
    description:
      "Chat con IA agéntica: streaming en tiempo real, herramientas y derivación a humano.",
    url: SITE_URL,
    siteName: "CallBotIA",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CallBot — Asistente virtual de CallBotIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CallBot — Asistente virtual de CallBotIA",
    description:
      "Chat con IA agéntica: streaming en tiempo real, herramientas y derivación a humano.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
