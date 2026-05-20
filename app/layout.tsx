import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
import "./globals.css";
import SeoHeadTags from "@/components/SeoHeadTags";
import { getSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });

export const metadata: Metadata = {
  title: "Blass — Iluminação & Componentes",
  description: "Soluções com qualidade em iluminação e componentes para móveis. 26 anos de mercado, 2000+ revendas em todo o Brasil.",
  metadataBase: new URL("https://blass.ind.br"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="pt-BR" className={`${inter.variable} ${marcellus.variable}`}>
      <body>
        {settings.seo.bodyStart && (
          <div dangerouslySetInnerHTML={{ __html: settings.seo.bodyStart }} />
        )}
        <SeoHeadTags html={settings.seo.head} />
        {children}
      </body>
    </html>
  );
}
