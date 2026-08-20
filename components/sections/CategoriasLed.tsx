import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { DEFAULT_STORE } from "@/lib/defaults";

type Card = { label: string; href: string; off: string; on: string };

// Formato chanfrado (octógono) aplicado por CSS — independente da imagem,
// então qualquer foto enviada pelo painel fica no formato certo sem distorcer.
const CHAMFER =
  "polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)";

export default function CategoriasLed({ cards }: { cards?: Card[] }) {
  const list = cards?.length ? cards : DEFAULT_STORE.settings.categoriasCards.cards;
  return (
    <section id="categorias" className="bg-night py-14 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-[50px]">
        {list.map((c, i) => {
          const right = i % 2 === 1; // zigzag: par=esquerda, ímpar=direita
          return (
            <Reveal
              key={c.label + i}
              variant={right ? "right-far" : "left-far"}
              className={`w-full md:w-[80%] ${right ? "md:ml-auto" : "md:mr-auto"}`}
            >
              <Link
                href={c.href}
                aria-label={`Ver produtos de ${c.label}`}
                className="group relative block w-full aspect-[2.9/1]"
              >
                {/* Só a foto no formato chanfrado — sem borda/contorno colorido */}
                <div className="absolute inset-0 overflow-hidden bg-night-deep" style={{ clipPath: CHAMFER }}>
                  {/* Imagem apagada (padrão) */}
                  <Image
                    src={c.off}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 80vw, 100vw"
                    className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
                  />
                  {/* Imagem acesa (hover) — crossfade */}
                  <Image
                    src={c.on}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 80vw, 100vw"
                    className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  />
                  {/* Rótulo */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="font-exo font-bold uppercase tracking-wide text-cream-light text-xl md:text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                      {c.label}
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
