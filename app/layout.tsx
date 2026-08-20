import type { Metadata, Viewport } from "next";
import { preconnect } from "react-dom";
import { Inter, Marcellus } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SeoHeadTags from "@/components/SeoHeadTags";
import { getSettings } from "@/lib/settings";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { ConfirmProvider } from "@/components/gestao/ConfirmDialog";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });

// Fonte do site (Exo 2) — woff2 subsetado e self-hosted, dos arquivos oficiais do mockup
const exo2 = localFont({
  src: [
    { path: "../public/fonts/exo2/exo2-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/exo2/exo2-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/exo2/exo2-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/exo2/exo2-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/exo2/exo2-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-exo2",
  display: "swap",
});

// Fonte oficial da marca Blass — Punoer (do Manual de Marca)
const punoer = localFont({
  src: "../public/fonts/Punoer.otf",
  variable: "--font-punoer",
  display: "swap",
});

const baseMetadata: Metadata = {
  title: {
    default: "Blass — Iluminação & Componentes",
    template: "%s — Blass",
  },
  description: DEFAULT_DESCRIPTION,
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
    description: DEFAULT_DESCRIPTION,
    url: "https://blass.ind.br",
    siteName: "Blass",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blass — Iluminação & Componentes",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1F1108",
};

/** Aceita o token puro OU a tag <meta> inteira colada do Search Console/Bing/Facebook. */
function verificationContent(raw?: string): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  const m = t.match(/content=["']([^"']+)["']/i);
  return (m ? m[1] : t).trim() || undefined;
}

// Metadados dinâmicos: injeta os códigos de verificação SERVER-SIDE no <head>,
// para que o robô do Google/Bing os leia no HTML bruto (campo do painel = client-side, não serve).
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSettings();

  // Frase de descrição editável no painel (fallback = padrão).
  const description = seo.description?.trim() || DEFAULT_DESCRIPTION;

  const google = verificationContent(seo.verification?.google);
  const bing = verificationContent(seo.verification?.bing);
  const facebook = verificationContent(seo.verification?.facebook);

  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;
  if (facebook) other["facebook-domain-verification"] = facebook;
  const hasVerification = google || Object.keys(other).length > 0;

  return {
    ...baseMetadata,
    description,
    openGraph: { ...baseMetadata.openGraph, description },
    twitter: { ...baseMetadata.twitter, description },
    ...(hasVerification
      ? {
          verification: {
            ...(google ? { google } : {}),
            ...(Object.keys(other).length ? { other } : {}),
          },
        }
      : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  // Abre a conexão com o Supabase cedo (imagens de produto/galeria são servidas de lá).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) preconnect(supabaseUrl);

  return (
    <html lang="pt-BR" className={`${inter.variable} ${marcellus.variable} ${exo2.variable} ${punoer.variable}`}>
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
