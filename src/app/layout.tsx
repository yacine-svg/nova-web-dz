import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Background from "@/components/Background";
import LiquidFilters from "@/components/LiquidFilters";
import SmoothScroll from "@/components/SmoothScroll";
import { themeBootScript } from "@/lib/themeBoot";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nova-web-dz.vercel.app"),
  title: "Nova Web Dz | Sites web, design et rapports PFE en Algérie",
  description:
    "Sites web et systèmes sur mesure, logos, présentations, montage vidéo et mise en page de rapports PFE. Prix en DA, demande sur WhatsApp. Nova Web Dz, Algérie.",
  openGraph: {
    title: "Nova Web Dz",
    description: "Sites web & systèmes sur mesure, logos, présentations, montage, rapports PFE. Prix en DA, demande sur WhatsApp.",
    locale: "fr_DZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9edf2" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={bricolage.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <LiquidFilters />
        <Background />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
