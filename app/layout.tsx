import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

/* ─────────────────────────────────────────────
   URL pública de la app — fuente única de verdad.
   Viene de NEXT_PUBLIC_APP_URL (configurada en Vercel y .env.local).
   Si en algún momento la env var no existe, caemos al dominio actual
   como fallback para evitar runtime errors.

   IMPORTANTE: cuando se cambie el dominio, NO toques este archivo —
   simplemente actualizá la env var NEXT_PUBLIC_APP_URL en Vercel.
─────────────────────────────────────────────── */
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://planit-app-fgi6.vercel.app";

/* ─────────────────────────────────────────────
   Metadata global de PLANIT
   - title con template: cada página puede sobreescribir el título
     y se compone como "Mi página | PLANIT"
   - openGraph y twitter para previews al compartir el link en
     WhatsApp, Twitter, Instagram, LinkedIn, etc.
   - La imagen OG (1200x630) la genera dinámicamente
     app/opengraph-image.tsx — Next.js la inyecta sola
─────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PLANIT — Tu evento en un solo lugar",
    template: "%s · PLANIT",
  },
  description:
    "Marketplace de servicios para eventos en Argentina. Encontrá DJs, " +
    "fotógrafos, catering, lugares y más, comparalos y reservá fecha con " +
    "pago de seña 100% seguro.",
  applicationName: "PLANIT",
  authors: [{ name: "PLANIT" }],
  keywords: [
    "PLANIT",
    "eventos",
    "marketplace eventos Argentina",
    "DJs",
    "fotógrafos",
    "catering",
    "salones",
    "bandas en vivo",
    "organización de eventos",
    "reservar proveedores",
    "señas online",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: APP_URL,
    siteName: "PLANIT",
    title: "PLANIT — Tu evento en un solo lugar",
    description:
      "Marketplace de servicios para eventos en Argentina. DJs, fotógrafos, " +
      "catering, lugares y más. Reservá con pago de seña seguro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLANIT — Tu evento en un solo lugar",
    description:
      "Marketplace de servicios para eventos en Argentina. Reservá tu " +
      "proveedor en minutos.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        {/* Vercel Analytics (page views, referrers, top pages, devices) */}
        <Analytics />
        {/* Vercel Speed Insights (Core Web Vitals reales de usuarios) */}
        <SpeedInsights />
      </body>
    </html>
  );
}
