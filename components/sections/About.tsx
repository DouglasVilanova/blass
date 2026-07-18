import type { SiteSettings } from "@/lib/types";
import { DEFAULT_STORE } from "@/lib/defaults";
import ConstruimosCard from "./ConstruimosCard";
import Reveal from "@/components/Reveal";
import { renderMarks } from "@/lib/markup";

export default function About({ settings }: { settings: SiteSettings }) {
  const layout = settings.layouts?.construimos ?? DEFAULT_STORE.settings.layouts.construimos;
  const t = settings.construimos ?? DEFAULT_STORE.settings.construimos;

  return (
    <section id="sobre" className="bg-[#4F2612] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative">
        {/* Card pavilhão + mão + brilho (posições editáveis no painel) */}
        <ConstruimosCard layout={layout} />

        {/* Texto */}
        <Reveal variant="right-far" delay={250}>
          <h2 className="font-exo font-bold uppercase tracking-wide text-cream-light text-2xl md:text-4xl">
            {renderMarks(t.title, "text-orange")}
          </h2>
          <div className="mt-6 space-y-5 text-cream-light/80 leading-relaxed text-[15px] md:text-base">
            {t.paragraphs.map((p, i) => (
              <p key={i}>{renderMarks(p, "font-semibold text-cream-light")}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
