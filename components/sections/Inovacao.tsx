import type { SiteSettings } from "@/lib/types";
import { DEFAULT_STORE } from "@/lib/defaults";
import InovacaoCarousel from "./InovacaoCarousel";
import Reveal from "@/components/Reveal";
import { renderMarks } from "@/lib/markup";

export default function Inovacao({ settings }: { settings: SiteSettings }) {
  const inv = settings.inovacao ?? DEFAULT_STORE.settings.inovacao;
  const images = inv.images?.length ? inv.images : DEFAULT_STORE.settings.inovacao.images;
  const title = inv.title ?? DEFAULT_STORE.settings.inovacao.title;
  const paragraphs = inv.paragraphs?.length ? inv.paragraphs : DEFAULT_STORE.settings.inovacao.paragraphs;

  return (
    <section className="bg-[#4F2612] border-t border-[#6E5E53] py-14 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Texto — entra da esquerda (distância longa) */}
        <Reveal variant="left-far">
          <h2 className="font-exo font-bold uppercase tracking-wide text-cream-light text-2xl md:text-4xl">
            {renderMarks(title, "text-orange")}
          </h2>
          <div className="mt-6 space-y-5 text-cream-light/80 leading-relaxed text-[15px] md:text-base">
            {paragraphs.map((p, i) => (
              <p key={i}>{renderMarks(p, "font-semibold text-orange")}</p>
            ))}
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
