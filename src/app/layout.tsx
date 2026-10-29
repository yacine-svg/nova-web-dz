import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Background from "@/components/Background";
import LiquidFilters from "@/components/LiquidFilters";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nova Web Dz | Sites web, applications et design en Algérie",
  description:
    "Choisissez votre site web, application ou design, voyez le prix en dinars et envoyez votre demande sur WhatsApp. Nova Web Dz, Algérie.",
  openGraph: {
    title: "Nova Web Dz",
    description: "Sites web, applications et design pour les entreprises en Algérie. Prix en DA, demande sur WhatsApp.",
    locale: "fr_DZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a2280",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={bricolage.variable}>
      <body>
        <LiquidFilters />
        <Background />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
