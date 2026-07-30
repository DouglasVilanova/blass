import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Inovacao from "@/components/sections/Inovacao";
import Tendencias from "@/components/sections/Tendencias";
import CategoriasLed from "@/components/sections/CategoriasLed";
import GaleriaDecadas from "@/components/sections/GaleriaDecadas";
import PillsCategorias from "@/components/sections/PillsCategorias";
import FeaturedCarousel from "@/components/sections/FeaturedCarousel";
import { getSettings } from "@/lib/settings";
import { getFeaturedProducts } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, stripHtml, DEFAULT_DESCRIPTION } from "@/lib/seo";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedProducts(6),
  ]);
  const v = settings.visibility;
  const c = settings.contact;

  // Structured data — identidade da empresa para o Google (Knowledge Panel / marca)
  const sameAs = [c.instagram, c.facebook, c.linkedin].filter((u) => u && u.trim());
  const phone = c.phones?.[0] ?? c.phone;
  const email = c.emails?.[0] ?? c.email;
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Blass Iluminação & Componentes",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: settings.seo.description?.trim() || DEFAULT_DESCRIPTION,
    ...(sameAs.length ? { sameAs } : {}),
    ...(phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: phone,
            contactType: "sales",
            areaServed: "BR",
            availableLanguage: "Portuguese",
            ...(email ? { email } : {}),
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: stripHtml(c.address),
      addressLocality: "Flores da Cunha",
      addressRegion: "RS",
      addressCountry: "BR",
    },
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blass",
    url: SITE_URL,
  };

  return (
    <>
      <JsonLd data={[orgLd, siteLd]} />
      <Hero settings={settings} />
      <About settings={settings} />
      <Inovacao settings={settings} />
      <Tendencias
        text={settings.tendencias?.text}
        highlight={settings.tendencias?.highlight}
        image={settings.tendencias?.image}
      />
      <CategoriasLed cards={settings.categoriasCards?.cards} />
      <GaleriaDecadas images={settings.galeria?.images} />
      <PillsCategorias words={settings.pills?.words} />
      {v.highlight && featured.length > 0 && (
        <FeaturedCarousel products={featured} tag={settings.highlight.tag} />
      )}
    </>
  );
}
