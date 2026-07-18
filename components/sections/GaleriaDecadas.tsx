import { DEFAULT_STORE } from "@/lib/defaults";

export default function GaleriaDecadas({ images }: { images?: string[] }) {
  const list = images?.length ? images : DEFAULT_STORE.settings.galeria.images;
  // Lista duplicada → loop contínuo (marquee translada -50%)
  const loop = [...list, ...list];

  return (
    <section className="bg-cream py-12 md:py-16 overflow-hidden">
      <div className="px-6 text-center mb-8">
        <h2 className="font-exo font-bold text-2xl md:text-4xl leading-tight">
          <span className="text-brown">Há mais de duas décadas trazendo</span>
          <br />
          <span className="text-orange">mais destaque aos seus projetos</span>
        </h2>
      </div>

      {/* Esteira de fotos com auto-rolagem (pausa no hover) */}
      <div className="overflow-hidden">
        <div className="flex gap-2 w-max animate-marquee hover:[animation-play-state:paused]">
          {loop.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-[clamp(240px,48vh,600px)] w-[clamp(220px,34vw,440px)] object-cover flex-shrink-0 rounded-2xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
