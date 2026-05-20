import type { SiteSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-brown-dark">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.55)), url(${settings.hero.image})` }}
      />
      <div className="relative h-full flex items-center justify-center text-center text-cream-light">
        <div>
          <div className="font-display text-6xl md:text-8xl tracking-[0.3em]">{settings.hero.title}</div>
          <div className="mt-3 text-[11px] md:text-xs tracking-[0.5em] text-orange">
            {settings.hero.subtitle.toUpperCase()}
          </div>
        </div>
      </div>
    </section>
  );
}
