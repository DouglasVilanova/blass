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

export const revalidate = 0;

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedProducts(6),
  ]);
  const v = settings.visibility;

  return (
    <>
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
