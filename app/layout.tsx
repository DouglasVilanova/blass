import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SeoHeadTags from "@/components/SeoHeadTags";
import { getSettings } from "@/lib/settings";
import { ConfirmProvider } from "@/components/gestao/ConfirmDialog";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });

// Fonte oficial da marca Blass — Punoer (do Manual de Marca)
const punoer = localFont({
  src: "../public/fonts/Punoer.otf",
  variable: "--font-punoer",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blass — Iluminação & Componentes",
    template: "%s — Blass",
  },
  description:
    "Soluções em iluminação e componentes para móveis e ambientes. 26 anos de mercado, mais de 2.000 revendas em todo o Brasil. Flores da Cunha — RS.",
  keywords: [
    "iluminação para móveis",
    "fita de LED",
    "perfil para LED",
    "puxadores",
    "componentes para móveis",
    "iluminação planejada",
    "Blass iluminação",
    "Flores da Cunha",
    "Rio Grande do Sul",
  ],
  metadataBase: new URL("https://blass.ind.br"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Blass — Iluminação & Componentes",
    description:
      "Soluções em iluminação e componentes para móveis. 26 anos de mercado, 2.000+ revendas no Brasil.",
    url: "https://blass.ind.br",
    siteName: "Blass",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blass — Iluminação & Componentes",
    description: "26 anos de mercado. 2.000+ revendas. Iluminação e componentes para móveis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="pt-BR" className={`${inter.variable} ${marcellus.variable} ${punoer.variable}`}>
      <body>
        {settings.seo.head && <SeoHeadTags html={settings.seo.head} />}
        {settings.seo.bodyStart && (
          <div dangerouslySetInnerHTML={{ __html: settings.seo.bodyStart }} />
        )}
        <ConfirmProvider>{children}</ConfirmProvider>
      </body>
    </html>
  );
}
