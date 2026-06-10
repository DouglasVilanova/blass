import type { SiteSettings } from "@/lib/types";
import HeroCarousel from "./HeroCarousel";

export default function Hero({ settings }: { settings: SiteSettings }) {
  // Migra legado: se não tem banners[] mas tem image, usa image como único banner
  const banners =
    settings.hero.banners && settings.hero.banners.length > 0
      ? settings.hero.banners
      : settings.hero.image
      ? [settings.hero.image]
      : [];

  // Múltiplos banners → carrossel client com auto-rotate
  if (banners.length > 1) {
    return <HeroCarousel banners={banners} />;
  }

  // 1 banner ou nenhum → renderiza estático (SSR puro, sem JS)
  const single = banners[0];
  return (
    <section className="relative w-full overflow-hidden bg-brown-dark">
      {single && (
        <img
          src={single}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/55" />
      <div className="relative h-[55vh] min-h-[380px] max-h-[640px]" />
    </section>
  );
}
