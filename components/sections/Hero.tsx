import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import Reveal from "@/components/Reveal";

export default function Hero({ settings }: { settings: SiteSettings }) {
  // Banner oficial do mockup (BANNER HEADER.png → /novo/hero.webp)
  const image = "/novo/hero.webp";
  const t = settings.tagline;

  return (
    <section className="relative w-full overflow-hidden bg-[#4F2612]">
      {/* Foto de fundo */}
      <img
        src={image}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Vinheta: escurece bordas e base para leitura do texto (mesma cor do bloco 2) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4F2612]/40 via-[#4F2612]/10 to-[#4F2612]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#4F2612]/50 via-transparent to-[#4F2612]/50" />

      {/* Conteúdo */}
      {/* 100svh = altura real da tela (desconta barra do navegador mobile) → hero fecha a dobra sem vazar o próximo bloco */}
      <div className="relative mx-auto max-w-7xl px-6 min-h-[100svh] flex flex-col items-center justify-end pb-14 md:pb-20 text-center">
        <Reveal variant="fade" delay={150}>
          <h1 className="font-exo font-semibold text-cream-light text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.12] max-w-4xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
            {t.line1} <span className="text-orange">{t.highlight1}</span>
            <br className="hidden sm:block" />
            {" "}{t.line2} <span className="text-orange">{t.highlight2}</span>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={500}>
          <Link
            href={t.ctaHref || "/produtos"}
            className="mt-8 inline-flex items-center rounded-full border-2 border-orange bg-night-deep/30 backdrop-blur-sm text-cream-light hover:bg-orange hover:text-white font-medium tracking-wide px-8 py-3.5 text-sm md:text-base transition-colors"
          >
            {t.ctaLabel || "Confira as soluções disponíveis!"}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
