import Image from "next/image";
import { DEFAULT_STORE } from "@/lib/defaults";

export default function GaleriaDecadas({ images }: { images?: string[] }) {
  const list = images?.length ? images : DEFAULT_STORE.settings.galeria.images;
  // Lista duplicada → loop contínuo (marquee translada -50%)
  const loop = [...list, ...list];

  return (
    <section id="galeria" className="bg-cream py-12 md:py-16 overflow-hidden">
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
            <div
              key={i}
              className="relative h-[clamp(240px,48vh,600px)] w-[clamp(220px,34vw,440px)] flex-shrink-0 rounded-2xl overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1300px) 440px, (min-width: 768px) 34vw, 60vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
