import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DEFAULT_STORE } from "@/lib/defaults";

type Card = { label: string; href: string; off: string; on: string };

export default function CategoriasLed({ cards }: { cards?: Card[] }) {
  const list = cards?.length ? cards : DEFAULT_STORE.settings.categoriasCards.cards;
  return (
    <section className="bg-night border-t border-[#6E5E53] py-14 md:py-20 overflow-hidden">
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
            className="group relative block w-full"
          >
            {/* Imagem apagada (padrão) */}
            <img
              src={c.off}
              alt=""
              aria-hidden
              className="w-full h-auto block transition-opacity duration-500 ease-out group-hover:opacity-0"
              loading="lazy"
            />
            {/* Imagem acesa (hover) — crossfade */}
            <img
              src={c.on}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              loading="lazy"
            />
            {/* Rótulo */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="font-exo font-bold uppercase tracking-wide text-cream-light text-xl md:text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                {c.label}
              </span>
            </span>
          </Link>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}
