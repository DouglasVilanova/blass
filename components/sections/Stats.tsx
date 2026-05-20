import type { SiteSettings } from "@/lib/types";

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
          <svg viewBox="0 0 200 220" className="w-24 h-28 fill-orange" aria-hidden>
            <path d="M50 30 L150 25 L170 80 L155 130 L170 175 L120 200 L70 195 L40 160 L25 110 L40 65 Z" />
          </svg>
          <p className="font-semibold text-brown leading-tight max-w-[180px]">{settings.stats.coverage}</p>
        </div>
      </div>
    </section>
  );
}
