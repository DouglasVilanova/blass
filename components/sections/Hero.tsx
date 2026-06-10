import type { SiteSettings } from "@/lib/types";
import BrandLogo from "@/components/BrandLogo";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-brown-dark">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.55)), url(${settings.hero.image})` }}
      />
      <div className="relative h-full flex items-center justify-center text-center">
        <BrandLogo
          variant="negativo"
          signature
          width={520}
          height={240}
          priority
          className="w-[280px] md:w-[480px] h-auto"
        />
      </div>
    </section>
  );
}
