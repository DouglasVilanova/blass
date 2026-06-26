import type { SiteSettings } from "@/lib/types";
import { DEFAULT_STORE } from "@/lib/defaults";
import ConstruimosCard from "./ConstruimosCard";
import Reveal from "@/components/Reveal";

export default function About({ settings }: { settings: SiteSettings }) {
  const layout = settings.layouts?.construimos ?? DEFAULT_STORE.settings.layouts.construimos;

  return (
    <section id="sobre" className="bg-[#4F2612] border-t border-[#6E5E53] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative">
        {/* Card pavilhão + mão + brilho (posições editáveis no painel) */}
        <ConstruimosCard layout={layout} />

        {/* Texto */}
        <Reveal variant="right-far" delay={250}>
          <h2 className="font-exo font-bold uppercase tracking-wide text-cream-light text-2xl md:text-4xl">
            A <span className="text-orange">BLASS</span> QUE CONSTRUÍMOS
          </h2>
          <div className="mt-6 space-y-5 text-cream-light/80 leading-relaxed text-[15px] md:text-base">
            {/* P1: alinhado à esquerda (acima da mão) */}
            <p className="text-left">
              Desde o início, a Blass foi construída com propósito, técnica e visão de futuro.
              Fundada por <strong className="font-semibold text-cream-light">Marcos Verona</strong> em
              Caxias do Sul, a empresa cresceu movida pela dedicação de uma equipe comprometida em
              entregar qualidade, eficiência e soluções que fazem a diferença no dia a dia de cada projeto.
            </p>
            {/* P2: centralizado, desviando da mão na parte de baixo */}
            <p className="text-center">
              Ao longo de <strong className="font-semibold text-cream-light">mais de duas décadas</strong>,
              evoluímos constantemente, investindo em estrutura, tecnologia e desenvolvimento para
              transformar ideias em soluções com alto padrão de acabamento e desempenho. Em 2014,
              transferimos nossa operação para Flores da Cunha, consolidando nossa estrutura em um
              novo pavilhão moderno e preparado para acompanhar a nova fase.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
