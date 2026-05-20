import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function ReachCTA({ settings }: { settings: SiteSettings }) {
  const r = settings.reach;
  return (
    <section id="contato" className="bg-brown text-cream-light py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-orange text-xs tracking-widest font-semibold mb-4">QUERO COMPRAR</div>
          <h2 className="font-display text-3xl md:text-4xl leading-tight uppercase">{r.title}</h2>
          <p className="mt-6 text-cream-light/80 max-w-md">{r.body}</p>
          <Link href={r.ctaHref} className="btn-orange mt-8">{r.ctaLabel}</Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <svg viewBox="0 0 200 220" className="w-64 h-72 stroke-orange fill-none" strokeWidth={2} aria-hidden>
            <path d="M50 30 L150 25 L170 80 L155 130 L170 175 L120 200 L70 195 L40 160 L25 110 L40 65 Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
