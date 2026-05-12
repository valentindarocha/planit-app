import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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
   Metadata global de PLANIT
   - title con template: cada página puede sobreescribir el título
     y se compone como "Mi página | PLANIT"
   - openGraph y twitter para previews al compartir el link en
     WhatsApp, Twitter, Instagram, LinkedIn, etc.
   - La imagen OG (1200x630) la genera dinámicamente
     app/opengraph-image.tsx — Next.js la inyecta sola
─────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://planit-app-fgi6.vercel.app"),
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
    url: "https://planit-app-fgi6.vercel.app",
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
    canonical: "https://planit-app-fgi6.vercel.app",
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
      </body>
    </html>
  );
}
