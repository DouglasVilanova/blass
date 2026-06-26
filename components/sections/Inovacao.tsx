import type { SiteSettings } from "@/lib/types";
import { DEFAULT_STORE } from "@/lib/defaults";
import InovacaoCarousel from "./InovacaoCarousel";
import Reveal from "@/components/Reveal";

export default function Inovacao({ settings }: { settings: SiteSettings }) {
  const images = settings.inovacao?.images?.length
    ? settings.inovacao.images
    : DEFAULT_STORE.settings.inovacao.images;

  return (
    <section className="bg-[#4F2612] border-t border-[#6E5E53] py-14 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Texto — entra da esquerda (distância longa) */}
        <Reveal variant="left-far">
          <h2 className="font-exo font-bold uppercase tracking-wide text-cream-light text-2xl md:text-4xl">
            <span className="text-orange">INOVAÇÃO</span> NO SETOR MOVELEIRO
          </h2>
          <div className="mt-6 space-y-5 text-cream-light/80 leading-relaxed text-[15px] md:text-base">
            <p>
              Na Blass, inovação não é apenas acompanhar o mercado, mas enxergar novas possibilidades
              antes mesmo que elas se tornem tendência. Esse olhar está presente em cada detalhe,
              impulsionando o desenvolvimento de produtos que unem funcionalidade, estética e confiabilidade.
            </p>
            <p>
              Hoje, reunimos em um só lugar uma{" "}
              <strong className="font-semibold text-orange">
                linha completa de componentes, iluminação e soluções decorativas que acompanham a
                evolução dos espaços contemporâneos
              </strong>
              . Em todo o Brasil, seguimos evoluindo, levando inovação, qualidade e identidade para
              diferentes projetos e ambientes.
            </p>
          </div>
        </Reveal>

        {/* Galeria — entra da direita (distância longa) */}
        <Reveal variant="right-far" delay={200}>
          <InovacaoCarousel images={images} />
        </Reveal>
      </div>
    </section>
  );
}
