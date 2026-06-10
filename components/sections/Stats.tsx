import type { SiteSettings } from "@/lib/types";
import BrazilOutline from "@/components/BrazilOutline";

export default function Stats({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-cream pattern-zigzag py-14">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-brown">
        <div className="text-center">
          <div className="font-display text-6xl text-orange">{settings.stats.years}</div>
          <div className="text-sm mt-1">anos no mercado</div>
        </div>
        <div className="text-center">
          <div className="font-display text-6xl text-orange">{settings.stats.resellers}</div>
          <div className="text-sm mt-1">revendas</div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-4">
          <BrazilOutline className="w-24 h-28 text-orange" variant="fill" />
          <p className="font-semibold text-brown leading-tight max-w-[180px]">{settings.stats.coverage}</p>
        </div>
      </div>
    </section>
  );
}
